const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Server } = require('socket.io');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_FILE = path.join(ROOT_DIR, 'index.html');
const DISCONNECT_GRACE_MS = 15000;
const PRIVATE_GAME_TTL_MS = 30 * 60 * 1000;
const CHAT_HISTORY_LIMIT = 50;
const LOBBY_CHAT_LIMIT = 80;
const RECENT_RESULTS_LIMIT = 20;
const CLUB_HISTORY_LIMIT = 8;
const DEFAULT_RATING = 1200;
const ELO_K = 24;
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const STORE_FILE = path.join(__dirname, 'data', 'multiplayer-store.json');

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.stl': 'model/stl',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.ico': 'image/x-icon',
    '.wasm': 'application/wasm',
};

const waitingQueue = [];
const games = new Map();
const socketToGame = new Map();
const spectatorToGame = new Map();
const reconnectTokens = new Map();
const socketProfiles = new Map();
const ratings = new Map();
const persistedStore = loadMultiplayerStore();
hydrateStoredProfiles(persistedStore.profiles).forEach(record => {
    ratings.set(record.id, record);
});
const recentResults = normalizeStoredRecentResults(persistedStore.recentResults);
const chatArchive = new Map(Object.entries(normalizeStoredChatArchive(persistedStore.chatArchive)));
const lobbyChat = normalizeStoredLobbyChat(persistedStore.lobbyChat);
const clubs = normalizeStoredClubs(persistedStore.clubs);
const tournaments = normalizeStoredTournaments(persistedStore.tournaments);
hydrateTournamentGames(tournaments);

const server = http.createServer((request, response) => {
    if (!request.url) {
        sendJson(response, 400, { error: 'Missing request URL.' });
        return;
    }

    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname || '/');

    if (pathname === '/health') {
        sendJson(response, 200, { ok: true, port: PORT });
        return;
    }

    if (pathname === '/' || pathname === '/index.html' || /^\/game\/[^/]+$/.test(pathname)) {
        serveFile(INDEX_FILE, response);
        return;
    }

    const resolved = resolveWorkspacePath(pathname);
    if (!resolved) {
        sendText(response, 403, 'Forbidden');
        return;
    }

    fs.stat(resolved, (error, stats) => {
        if (error || !stats.isFile()) {
            sendText(response, 404, 'Not Found');
            return;
        }
        serveFile(resolved, response);
    });
});

const io = new Server(server, {
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
    },
});

io.on('connection', socket => {
    const guestProfile = createGuestProfile();
    socketProfiles.set(socket.id, guestProfile);
    socket.emit('profile', buildProfilePayload(guestProfile));
    emitLiveGames(socket);
    emitLeaderboard(socket);
    emitClubs(socket);
    emitTournaments(socket);
    emitLobbyChat(socket);

    socket.on('setProfile', payload => {
        const profile = normalizeProfilePayload(payload, socketProfiles.get(socket.id));
        socketProfiles.set(socket.id, profile);
        socket.emit('profile', buildProfilePayload(profile));
        syncProfileIntoSessions(socket, profile);
        persistMultiplayerStore();
    });

    socket.on('requestLiveGames', () => {
        emitLiveGames(socket);
    });

    socket.on('requestLeaderboard', () => {
        emitLeaderboard(socket);
    });

    socket.on('requestClubs', () => {
        emitClubs(socket);
    });

    socket.on('requestTournaments', () => {
        emitTournaments(socket);
    });

    socket.on('findMatch', () => {
        cleanupSpectatorSession(socket, { emitEnded: true });
        cleanupSocketSession(socket, { permanent: true, disconnected: false });
        removeFromWaitingQueue(socket.id);

        const opponent = dequeueWaitingOpponent(socket.id);
        if (!opponent) {
            waitingQueue.push(socket.id);
            socket.emit('waiting', { mode: 'matchmaking' });
            emitLiveGames();
            return;
        }

        startGame({ whiteSocket: opponent, blackSocket: socket, mode: 'matchmaking' });
    });

    socket.on('cancelMatchmaking', () => {
        removeFromWaitingQueue(socket.id);
        socket.emit('matchmakingCancelled');
        emitLiveGames();
    });

    socket.on('resumeSession', payload => {
        handleResumeSession(socket, payload);
    });

    socket.on('createPrivateGame', () => {
        cleanupSpectatorSession(socket, { emitEnded: true });
        cleanupSocketSession(socket, { permanent: true, disconnected: false });
        removeFromWaitingQueue(socket.id);

        const game = createGame('private');
        game.status = 'waiting-private';
        game.expiresAt = Date.now() + PRIVATE_GAME_TTL_MS;
        games.set(game.id, game);
        assignRoleSocket(game, 'white', socket, { preserveToken: false });
        schedulePrivateExpiry(game);
        emitPrivateGameCreated(game, socket, { resumed: false });
        refreshPresence(game);
        emitLiveGames();
    });

    socket.on('joinPrivateGame', payload => {
        const gameId = typeof payload === 'string' ? payload : payload && payload.gameId;
        if (!gameId) {
            socket.emit('matchError', { message: 'Missing private game id.' });
            return;
        }

        const game = games.get(String(gameId));
        if (!game || expirePrivateGameIfNeeded(game)) {
            socket.emit('matchError', { message: 'This private game link is stale. Ask the host for a new link.' });
            return;
        }

        if (game.mode !== 'private') {
            socket.emit('matchError', { message: 'Private game not found.' });
            return;
        }

        if (!game.white.connected) {
            socket.emit('matchError', { message: 'The host is temporarily offline. Try again in a few seconds.' });
            return;
        }

        if (game.white.socketId === socket.id) {
            emitPrivateGameCreated(game, socket, { resumed: true });
            refreshPresence(game);
            return;
        }

        if (game.black.token && game.black.socketId === socket.id) {
            emitMatchForRole(game, 'black', socket, { resumed: true });
            refreshPresence(game);
            return;
        }

        if (game.status === 'active') {
            const message = game.black.token && !game.black.connected
                ? 'This private game is reserved for a reconnecting player.'
                : 'Private game is already full.';
            socket.emit('matchError', { message });
            return;
        }

        if (game.black.token) {
            socket.emit('matchError', { message: 'This private game is already in use.' });
            return;
        }

        cleanupSpectatorSession(socket, { emitEnded: true });
        cleanupSocketSession(socket, { permanent: true, disconnected: false });
        removeFromWaitingQueue(socket.id);

        assignRoleSocket(game, 'black', socket, { preserveToken: false });
        game.status = 'active';
        game.startedAt = Date.now();
        clearPrivateExpiry(game);
        emitMatchFound(game, { resumed: false });
        emitLiveGames();
    });

    socket.on('spectateGame', payload => {
        handleSpectateGame(socket, payload);
    });

    socket.on('stopSpectating', () => {
        cleanupSpectatorSession(socket, { emitEnded: true });
    });

    socket.on('sendChatMessage', payload => {
        handleChatMessage(socket, payload);
    });

    socket.on('requestLobbyChat', () => {
        emitLobbyChat(socket);
    });

    socket.on('sendLobbyChatMessage', payload => {
        handleLobbyChatMessage(socket, payload);
    });

    socket.on('resign', () => {
        handleResign(socket);
    });

    socket.on('drawAction', payload => {
        handleDrawAction(socket, payload);
    });

    socket.on('createClub', payload => {
        handleCreateClub(socket, payload);
    });

    socket.on('joinClub', payload => {
        handleJoinClub(socket, payload);
    });

    socket.on('leaveClub', payload => {
        handleLeaveClub(socket, payload);
    });

    socket.on('createTournament', payload => {
        handleCreateTournament(socket, payload);
    });

    socket.on('joinTournament', payload => {
        handleJoinTournament(socket, payload);
    });

    socket.on('leaveTournament', payload => {
        handleLeaveTournament(socket, payload);
    });

    socket.on('startTournament', payload => {
        handleStartTournament(socket, payload);
    });

    socket.on('joinTournamentMatch', payload => {
        handleJoinTournamentMatch(socket, payload);
    });

    socket.on('move', payload => {
        const game = getActiveGameForSocket(socket.id);
        if (!game) {
            socket.emit('matchError', { message: 'You are not in an active game.' });
            return;
        }

        const move = normalizeMovePayload(payload);
        if (!move) {
            socket.emit('matchError', { message: 'Invalid move payload.' });
            return;
        }

        game.fen = payload && payload.fen ? String(payload.fen) : game.fen;
        game.moveCount += 1;
        if (game.drawOffer) {
            game.drawOffer = null;
            emitDrawState(game);
        }

        socket.to(game.roomName).emit('moveMade', {
            gameId: game.id,
            move,
            fen: game.fen,
            by: socket.id,
        });

        emitLiveGames();

        const result = normalizeResultPayload(payload);
        if (result) {
            finalizeGame(game, result.result, result.reason);
        }
    });

    socket.on('leaveGame', () => {
        cleanupSpectatorSession(socket, { emitEnded: true });
        cleanupSocketSession(socket, { permanent: true, disconnected: false });
    });

    socket.on('disconnect', () => {
        removeFromWaitingQueue(socket.id);
        cleanupSpectatorSession(socket, { emitEnded: false });
        cleanupSocketSession(socket, { permanent: false, disconnected: true });
        socketProfiles.delete(socket.id);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Chess2 multiplayer server listening on http://localhost:${PORT}`);
});

function createGame(mode, options) {
    const settings = Object.assign({
        id: createGameId(),
        rated: mode === 'matchmaking',
        fen: START_FEN,
        status: 'active',
        startedAt: mode === 'matchmaking' ? Date.now() : 0,
        joinUrl: '',
        tournamentId: '',
        tournamentRound: 0,
        tournamentPairingId: '',
        clubId: '',
    }, options || {});
    const gameId = settings.id;
    return {
        id: gameId,
        roomName: `game:${gameId}`,
        joinUrl: settings.joinUrl || (mode === 'private' ? `/game/${gameId}` : ''),
        mode,
        rated: Boolean(settings.rated),
        fen: settings.fen,
        status: settings.status,
        createdAt: Date.now(),
        startedAt: settings.startedAt,
        endedAt: 0,
        expiresAt: null,
        expireTimeoutId: null,
        moveCount: 0,
        result: '',
        resultReason: '',
        tournamentId: settings.tournamentId,
        tournamentRound: Number(settings.tournamentRound) || 0,
        tournamentPairingId: settings.tournamentPairingId,
        clubId: settings.clubId || '',
        white: createRoleSlot(),
        black: createRoleSlot(),
        spectators: new Set(),
        chatMessages: [],
        drawOffer: null,
    };
}

function startGame({ whiteSocket, blackSocket, mode }) {
    if (!whiteSocket || !blackSocket) return null;

    cleanupSpectatorSession(whiteSocket, { emitEnded: true });
    cleanupSpectatorSession(blackSocket, { emitEnded: true });
    cleanupSocketSession(whiteSocket, { permanent: true, disconnected: false });
    cleanupSocketSession(blackSocket, { permanent: true, disconnected: false });
    removeFromWaitingQueue(whiteSocket.id);
    removeFromWaitingQueue(blackSocket.id);

    const game = createGame(mode);
    games.set(game.id, game);
    assignRoleSocket(game, 'white', whiteSocket, { preserveToken: false });
    assignRoleSocket(game, 'black', blackSocket, { preserveToken: false });
    emitMatchFound(game, { resumed: false });
    emitLiveGames();
    return game;
}

function handleResumeSession(socket, payload) {
    const reconnectToken = payload && typeof payload.reconnectToken === 'string'
        ? payload.reconnectToken.trim()
        : '';
    if (!reconnectToken) {
        socket.emit('sessionExpired', { message: 'This online session can no longer be resumed.' });
        return;
    }

    const reference = reconnectTokens.get(reconnectToken);
    if (!reference) {
        socket.emit('sessionExpired', { message: 'This online session has expired. Start a new game.' });
        return;
    }

    const game = games.get(reference.gameId);
    if (!game || expirePrivateGameIfNeeded(game)) {
        reconnectTokens.delete(reconnectToken);
        socket.emit('sessionExpired', { message: 'This online session has expired. Start a new game.' });
        return;
    }

    const role = reference.role;
    const slot = game[role];
    if (!slot || slot.token !== reconnectToken) {
        reconnectTokens.delete(reconnectToken);
        socket.emit('sessionExpired', { message: 'This online session has expired. Start a new game.' });
        return;
    }

    replaceRoleSocket(game, role, socket);

    if (game.status === 'waiting-private') {
        emitPrivateGameCreated(game, socket, { resumed: true });
        refreshPresence(game);
        return;
    }

    emitMatchForRole(game, role, socket, { resumed: true });
    refreshPresence(game);
}

function emitPrivateGameCreated(game, socket, options) {
    if (!game || !socket) return;
    const resumed = Boolean(options && options.resumed);
    socket.emit('privateGameCreated', {
        gameId: game.id,
        color: 'white',
        joinUrl: game.joinUrl,
        reconnectToken: game.white.token,
        resumed,
        rated: false,
        players: buildPlayersPayload(game),
        chatMessages: game.chatMessages.slice(-CHAT_HISTORY_LIMIT),
        spectatorCount: game.spectators.size,
        fen: game.fen,
        drawOffer: buildDrawOfferPayload(game.drawOffer),
    });
    socket.emit('chatHistory', { gameId: game.id, messages: game.chatMessages.slice(-CHAT_HISTORY_LIMIT) });
    emitDrawState(game, socket);
    socket.emit('waiting', { mode: 'private', gameId: game.id, resumed });
}

function emitMatchFound(game, options) {
    emitMatchForRole(game, 'white', getConnectedSocket(game, 'white'), options);
    emitMatchForRole(game, 'black', getConnectedSocket(game, 'black'), options);
    refreshPresence(game);
}

function emitMatchForRole(game, role, socket, options) {
    if (!game || !socket) return;
    const slot = game[role];
    socket.emit('matchFound', {
        gameId: game.id,
        color: role,
        mode: game.mode,
        fen: game.fen,
        joinUrl: game.joinUrl,
        reconnectToken: slot ? slot.token : '',
        resumed: Boolean(options && options.resumed),
        rated: Boolean(game.rated),
        players: buildPlayersPayload(game),
        chatMessages: game.chatMessages.slice(-CHAT_HISTORY_LIMIT),
        spectatorCount: game.spectators.size,
        drawOffer: buildDrawOfferPayload(game.drawOffer),
        matchContext: buildMatchContext(game),
        waitingForOpponent: game.status !== 'active',
    });
    socket.emit('chatHistory', { gameId: game.id, messages: game.chatMessages.slice(-CHAT_HISTORY_LIMIT) });
    emitDrawState(game, socket);
}

function handleSpectateGame(socket, payload) {
    if (socketToGame.has(socket.id)) {
        socket.emit('matchError', { message: 'Leave your current online game before spectating another one.' });
        return;
    }

    const gameId = typeof payload === 'string' ? payload : payload && payload.gameId;
    if (!gameId) {
        socket.emit('matchError', { message: 'Choose a live game to spectate.' });
        return;
    }

    const game = games.get(String(gameId));
    if (!game || game.status !== 'active') {
        socket.emit('matchError', { message: 'That live game is no longer available.' });
        return;
    }

    if (!isGamePublicSpectatable(game)) {
        socket.emit('matchError', { message: 'Private games are not in the public spectator feed.' });
        return;
    }

    cleanupSpectatorSession(socket, { emitEnded: false });
    game.spectators.add(socket.id);
    spectatorToGame.set(socket.id, game.id);
    socket.join(game.roomName);

    socket.emit('spectateStarted', {
        gameId: game.id,
        mode: game.mode,
        fen: game.fen,
        rated: Boolean(game.rated),
        players: buildPlayersPayload(game),
        spectatorCount: game.spectators.size,
        chatMessages: game.chatMessages.slice(-CHAT_HISTORY_LIMIT),
        drawOffer: buildDrawOfferPayload(game.drawOffer),
        matchContext: buildMatchContext(game),
    });
    socket.emit('chatHistory', { gameId: game.id, messages: game.chatMessages.slice(-CHAT_HISTORY_LIMIT) });
    emitDrawState(game, socket);
    refreshPresence(game);
    emitLiveGames();
}

function cleanupSpectatorSession(socket, options) {
    if (!socket) return;

    const settings = Object.assign({ emitEnded: false }, options || {});
    const gameId = spectatorToGame.get(socket.id);
    if (!gameId) return;

    spectatorToGame.delete(socket.id);
    const game = games.get(gameId);
    if (!game) {
        if (settings.emitEnded) {
            socket.emit('spectateEnded', { gameId });
        }
        return;
    }

    game.spectators.delete(socket.id);
    socket.leave(game.roomName);
    if (settings.emitEnded) {
        socket.emit('spectateEnded', { gameId: game.id });
    }
    refreshPresence(game);
    emitLiveGames();
}

function handleChatMessage(socket, payload) {
    const game = getRoomGameForSocket(socket.id);
    if (!game) {
        socket.emit('matchError', { message: 'Join a game or spectator room before sending chat messages.' });
        return;
    }

    const text = normalizeChatMessage(payload && payload.text);
    if (!text) {
        socket.emit('matchError', { message: 'Enter a chat message.' });
        return;
    }

    const profile = getSocketProfile(socket);
    const role = getRoleForSocket(game, socket.id) || 'spectator';
    const entry = {
        id: createMessageId(),
        gameId: game.id,
        author: buildProfilePayload(profile),
        role,
        text,
        createdAt: Date.now(),
    };
    game.chatMessages.push(entry);
    if (game.chatMessages.length > CHAT_HISTORY_LIMIT) {
        game.chatMessages.splice(0, game.chatMessages.length - CHAT_HISTORY_LIMIT);
    }
    storeChatArchive(game);
    persistMultiplayerStore();
    io.to(game.roomName).emit('chatMessage', entry);
}

function handleLobbyChatMessage(socket, payload) {
    const text = normalizeChatMessage(payload && payload.text);
    if (!text) {
        socket.emit('matchError', { message: 'Enter a chat message.' });
        return;
    }

    const profile = getSocketProfile(socket);
    const entry = {
        id: createMessageId(),
        channel: 'lobby',
        author: buildProfilePayload(profile),
        text,
        createdAt: Date.now(),
    };
    lobbyChat.push(entry);
    if (lobbyChat.length > LOBBY_CHAT_LIMIT) {
        lobbyChat.splice(0, lobbyChat.length - LOBBY_CHAT_LIMIT);
    }
    persistMultiplayerStore();
    io.emit('lobbyChatMessage', entry);
}

function handleResign(socket) {
    const game = getActiveGameForSocket(socket.id);
    if (!game) {
        socket.emit('matchError', { message: 'You are not in an active game.' });
        return;
    }

    const role = getRoleForSocket(game, socket.id);
    if (!role) {
        socket.emit('matchError', { message: 'Only players can resign this game.' });
        return;
    }

    finalizeGame(game, otherRole(role) + '-wins', 'resignation');
}

function handleDrawAction(socket, payload) {
    const game = getActiveGameForSocket(socket.id);
    if (!game) {
        socket.emit('matchError', { message: 'You are not in an active game.' });
        return;
    }

    const role = getRoleForSocket(game, socket.id);
    if (!role) {
        socket.emit('matchError', { message: 'Only players can manage draw offers.' });
        return;
    }

    const action = normalizeDrawAction(payload && payload.action);
    if (!action) {
        socket.emit('matchError', { message: 'Unknown draw action.' });
        return;
    }

    if (action === 'offer') {
        if (game.drawOffer && game.drawOffer.from === role) {
            socket.emit('matchError', { message: 'Your draw offer is already pending.' });
            return;
        }
        game.drawOffer = {
            from: role,
            createdAt: Date.now(),
        };
        emitDrawState(game);
        return;
    }

    if (!game.drawOffer) {
        socket.emit('matchError', { message: 'There is no draw offer to respond to.' });
        return;
    }

    if (game.drawOffer.from === role) {
        if (action === 'cancel') {
            game.drawOffer = null;
            emitDrawState(game);
            return;
        }
        socket.emit('matchError', { message: 'Wait for your opponent to respond to the offer.' });
        return;
    }

    if (action === 'accept') {
        finalizeGame(game, 'draw', 'agreement');
        return;
    }

    if (action === 'decline') {
        game.drawOffer = null;
        emitDrawState(game);
        return;
    }

    socket.emit('matchError', { message: 'That draw action is not available.' });
}

function refreshPresence(game) {
    if (!game) return;
    io.to(game.roomName).emit('presence', {
        gameId: game.id,
        players: {
            white: Boolean(game.white && game.white.connected),
            black: Boolean(game.black && game.black.connected),
        },
        roomPlayers: buildPlayersPayload(game),
        spectatorCount: game.spectators.size,
    });
}

function finalizeGame(game, result, reason) {
    if (!game || game.status === 'finished') return;

    game.status = 'finished';
    game.result = result || 'draw';
    game.resultReason = String(reason || inferResultReason(result || 'draw')).slice(0, 40);
    game.endedAt = Date.now();
    game.drawOffer = null;
    clearPrivateExpiry(game);
    clearRoleTimeout(game, 'white');
    clearRoleTimeout(game, 'black');

    const ratingUpdate = game.rated ? applyRatingUpdate(game, game.result) : null;
    const resultPayload = buildResultPayload(game, ratingUpdate);
    applyTournamentResult(game, resultPayload);
    recentResults.unshift(resultPayload);
    if (recentResults.length > RECENT_RESULTS_LIMIT) {
        recentResults.splice(RECENT_RESULTS_LIMIT);
    }
    storeChatArchive(game);
    persistMultiplayerStore();

    io.to(game.roomName).emit('gameResult', resultPayload);
    cleanupGame(game);
    emitLiveGames();
    emitLeaderboard();
    emitClubs();
    emitTournaments();
}

function applyRatingUpdate(game, result) {
    const whiteProfile = game.white && game.white.profile;
    const blackProfile = game.black && game.black.profile;
    if (!whiteProfile || !blackProfile) return null;

    const whiteRecord = ensureRatingRecord(whiteProfile);
    const blackRecord = ensureRatingRecord(blackProfile);
    const whiteScore = result === 'white-wins' ? 1 : (result === 'black-wins' ? 0 : 0.5);
    const blackScore = 1 - whiteScore;
    const expectedWhite = 1 / (1 + Math.pow(10, (blackRecord.rating - whiteRecord.rating) / 400));
    const expectedBlack = 1 / (1 + Math.pow(10, (whiteRecord.rating - blackRecord.rating) / 400));
    const whiteDelta = Math.round(ELO_K * (whiteScore - expectedWhite));
    const blackDelta = Math.round(ELO_K * (blackScore - expectedBlack));

    const whiteBefore = whiteRecord.rating;
    const blackBefore = blackRecord.rating;
    whiteRecord.rating += whiteDelta;
    blackRecord.rating += blackDelta;
    whiteRecord.games += 1;
    blackRecord.games += 1;
    whiteRecord.lastUpdated = Date.now();
    blackRecord.lastUpdated = whiteRecord.lastUpdated;

    if (result === 'white-wins') {
        whiteRecord.wins += 1;
        blackRecord.losses += 1;
    } else if (result === 'black-wins') {
        blackRecord.wins += 1;
        whiteRecord.losses += 1;
    } else {
        whiteRecord.draws += 1;
        blackRecord.draws += 1;
    }

    return {
        white: { before: whiteBefore, after: whiteRecord.rating, delta: whiteDelta },
        black: { before: blackBefore, after: blackRecord.rating, delta: blackDelta },
    };
}

function buildResultPayload(game, ratingUpdate) {
    return {
        gameId: game.id,
        mode: game.mode,
        rated: Boolean(game.rated),
        result: game.result,
        reason: game.resultReason,
        fen: game.fen,
        moveCount: game.moveCount,
        endedAt: game.endedAt,
        players: buildPlayersPayload(game),
        ratingUpdate,
        spectatorCount: game.spectators.size,
        summary: formatResultSummary(game),
        matchContext: buildMatchContext(game),
    };
}

function formatResultSummary(game) {
    const whiteName = getSlotDisplayName(game.white, 'White');
    const blackName = getSlotDisplayName(game.black, 'Black');
    if (game.result === 'white-wins') {
        return `${whiteName} beat ${blackName} by ${game.resultReason || 'checkmate'}.`;
    }
    if (game.result === 'black-wins') {
        return `${blackName} beat ${whiteName} by ${game.resultReason || 'checkmate'}.`;
    }
    return `${whiteName} drew with ${blackName} by ${game.resultReason || 'draw'}.`;
}

function emitLiveGames(target) {
    const payload = {
        games: Array.from(games.values())
            .filter(isGamePublicSpectatable)
            .map(buildLiveGameSummary)
            .sort((left, right) => right.startedAt - left.startedAt),
        recentResults: recentResults.slice(0, 10),
        queueSize: waitingQueue.length,
        updatedAt: Date.now(),
    };
    if (target) {
        target.emit('liveGames', payload);
        return;
    }
    io.emit('liveGames', payload);
}

function emitLeaderboard(target) {
    const payload = {
        entries: buildLeaderboard(25),
        recentResults: recentResults.slice(0, 10),
        updatedAt: Date.now(),
    };
    if (target) {
        target.emit('leaderboard', payload);
        return;
    }
    io.emit('leaderboard', payload);
}

function emitClubs(target) {
    const payload = {
        clubs: clubs.map(buildClubPayload),
        updatedAt: Date.now(),
    };
    if (target) {
        target.emit('clubsUpdated', payload);
        return;
    }
    io.emit('clubsUpdated', payload);
}

function emitTournaments(target) {
    const payload = {
        tournaments: tournaments.map(buildTournamentPayload),
        updatedAt: Date.now(),
    };
    if (target) {
        target.emit('tournamentsUpdated', payload);
        return;
    }
    io.emit('tournamentsUpdated', payload);
}

function emitLobbyChat(target) {
    const payload = {
        messages: lobbyChat.slice(-LOBBY_CHAT_LIMIT),
        updatedAt: Date.now(),
    };
    if (target) {
        target.emit('lobbyChatHistory', payload);
        return;
    }
    io.emit('lobbyChatHistory', payload);
}

function buildLeaderboard(limit) {
    return Array.from(ratings.values())
        .sort((left, right) => {
            if (right.rating !== left.rating) return right.rating - left.rating;
            if (right.wins !== left.wins) return right.wins - left.wins;
            return left.displayName.localeCompare(right.displayName);
        })
        .slice(0, Math.max(1, Number(limit) || 25))
        .map((record, index) => ({
            rank: index + 1,
            id: record.id,
            displayName: record.displayName,
            rating: record.rating,
            games: record.games,
            wins: record.wins,
            losses: record.losses,
            draws: record.draws,
        }));
}

function buildLiveGameSummary(game) {
    return {
        gameId: game.id,
        mode: game.mode,
        rated: Boolean(game.rated),
        startedAt: game.startedAt,
        moveCount: game.moveCount,
        fen: game.fen,
        spectatorCount: game.spectators.size,
        players: buildPlayersPayload(game),
        drawOffer: buildDrawOfferPayload(game.drawOffer),
        matchContext: buildMatchContext(game),
    };
}

function buildMatchContext(game) {
    if (!game || !game.tournamentId) return null;
    const tournament = findTournament(game.tournamentId);
    if (!tournament) return null;
    return {
        tournamentId: tournament.id,
        tournamentName: tournament.name,
        roundNumber: Number(game.tournamentRound) || 0,
        pairingId: game.tournamentPairingId || '',
        clubId: tournament.clubId || '',
        clubName: tournament.clubId ? getClubName(tournament.clubId) : '',
    };
}

function buildPlayersPayload(game) {
    return {
        white: buildPlayerCard(game.white, 'white'),
        black: buildPlayerCard(game.black, 'black'),
    };
}

function buildPlayerCard(slot, color) {
    const fallbackName = color === 'white' ? 'White' : 'Black';
    const profile = slot && slot.profile ? slot.profile : null;
    const rating = profile ? ensureRatingRecord(profile).rating : DEFAULT_RATING;
    return {
        color,
        id: profile && profile.id ? profile.id : '',
        displayName: profile && profile.displayName ? profile.displayName : fallbackName,
        rating,
        connected: Boolean(slot && slot.connected),
    };
}

function cleanupSocketSession(socket, options) {
    if (!socket) return;

    const settings = Object.assign({
        permanent: false,
        disconnected: false,
    }, options || {});

    const gameId = socketToGame.get(socket.id);
    if (!gameId) return;

    const game = games.get(gameId);
    socketToGame.delete(socket.id);
    if (!game) return;

    const role = getRoleForSocket(game, socket.id);
    if (!role) return;

    const slot = game[role];
    socket.leave(game.roomName);
    if (slot.socketId === socket.id) {
        slot.socketId = null;
    }

    if (settings.permanent) {
        clearRoleTimeout(game, role);
        slot.connected = false;
        if (game.status === 'waiting-private') {
            cleanupGame(game);
            emitLiveGames();
            return;
        }
        if (game.status === 'active') {
            finalizeGame(game, otherRole(role) + '-wins', settings.disconnected ? 'disconnect' : 'leave');
        }
        return;
    }

    slot.connected = false;
    scheduleRoleTimeout(game, role, settings);
    refreshPresence(game);
    emitLiveGames();
}

function scheduleRoleTimeout(game, role, options) {
    const slot = game && game[role];
    if (!slot) return;
    clearRoleTimeout(game, role);
    slot.timeoutId = setTimeout(() => {
        handleRoleTimeout(game.id, role, options || {});
    }, DISCONNECT_GRACE_MS);
}

function clearRoleTimeout(game, role) {
    const slot = game && game[role];
    if (!slot || !slot.timeoutId) return;
    clearTimeout(slot.timeoutId);
    slot.timeoutId = null;
}

function handleRoleTimeout(gameId, role, options) {
    const game = games.get(gameId);
    if (!game) return;

    const slot = game[role];
    if (!slot || slot.connected) return;

    if (game.mode === 'private' && game.status === 'waiting-private' && role === 'white') {
        cleanupGame(game);
        emitLiveGames();
        return;
    }

    if (game.status === 'active') {
        finalizeGame(game, otherRole(role) + '-wins', options && options.disconnected ? 'disconnect' : 'forfeit');
    }
}

function cleanupGame(game) {
    if (!game) return;

    clearRoleTimeout(game, 'white');
    clearRoleTimeout(game, 'black');
    clearPrivateExpiry(game);

    ['white', 'black'].forEach(role => {
        const slot = game[role];
        if (!slot) return;
        if (slot.socketId) {
            socketToGame.delete(slot.socketId);
            const activeSocket = io.sockets.sockets.get(slot.socketId);
            if (activeSocket) {
                activeSocket.leave(game.roomName);
            }
        }
        clearRoleToken(game, role);
        slot.socketId = null;
        slot.connected = false;
    });

    game.drawOffer = null;

    game.spectators.forEach(socketId => {
        spectatorToGame.delete(socketId);
        const spectatorSocket = io.sockets.sockets.get(socketId);
        if (spectatorSocket) {
            spectatorSocket.leave(game.roomName);
        }
    });
    game.spectators.clear();
    games.delete(game.id);
}

function expirePrivateGameIfNeeded(game) {
    if (!game || game.mode !== 'private' || game.status !== 'waiting-private') {
        return false;
    }
    if (!game.expiresAt || game.expiresAt > Date.now()) {
        return false;
    }

    const hostSocket = getConnectedSocket(game, 'white');
    if (hostSocket) {
        hostSocket.emit('sessionExpired', { message: 'This private game link expired. Create a new one.' });
    }
    cleanupGame(game);
    emitLiveGames();
    return true;
}

function schedulePrivateExpiry(game) {
    if (!game || game.mode !== 'private' || game.status !== 'waiting-private' || !game.expiresAt) return;
    clearPrivateExpiry(game);
    const delay = Math.max(1000, game.expiresAt - Date.now());
    game.expireTimeoutId = setTimeout(() => {
        expirePrivateGameIfNeeded(game);
    }, delay);
}

function clearPrivateExpiry(game) {
    if (!game || !game.expireTimeoutId) return;
    clearTimeout(game.expireTimeoutId);
    game.expireTimeoutId = null;
}

function assignRoleSocket(game, role, socket, options) {
    const slot = game[role];
    const preserveToken = Boolean(options && options.preserveToken);
    if (!slot) return;

    clearRoleTimeout(game, role);

    if (slot.socketId && slot.socketId !== socket.id) {
        socketToGame.delete(slot.socketId);
        const previousSocket = io.sockets.sockets.get(slot.socketId);
        if (previousSocket) {
            previousSocket.leave(game.roomName);
            previousSocket.emit('sessionExpired', { message: 'This online session was opened somewhere else.' });
        }
    }

    if (!preserveToken || !slot.token) {
        clearRoleToken(game, role);
        slot.token = createReconnectToken();
        reconnectTokens.set(slot.token, { gameId: game.id, role });
    }

    slot.profile = getSocketProfile(socket);
    ensureRatingRecord(slot.profile);
    slot.socketId = socket.id;
    slot.connected = true;
    socketToGame.set(socket.id, game.id);
    socket.join(game.roomName);
}

function replaceRoleSocket(game, role, socket) {
    assignRoleSocket(game, role, socket, { preserveToken: true });
}

function clearRoleToken(game, role) {
    const slot = game && game[role];
    if (!slot || !slot.token) return;
    reconnectTokens.delete(slot.token);
    slot.token = '';
}

function syncProfileIntoSessions(socket, profile) {
    const playerGame = getAnyGameForPlayer(socket.id);
    if (playerGame) {
        const role = getRoleForSocket(playerGame, socket.id);
        if (role && playerGame[role]) {
            playerGame[role].profile = profile;
            refreshPresence(playerGame);
        }
    }
    emitLiveGames();
    emitLeaderboard();
    emitClubs();
    emitTournaments();
}

function getSocketProfile(socket) {
    return socketProfiles.get(socket.id) || createGuestProfile();
}

function normalizeProfilePayload(payload, fallback) {
    const source = payload && typeof payload === 'object' && payload.profile && typeof payload.profile === 'object'
        ? payload.profile
        : payload;
    const safeFallback = fallback && typeof fallback === 'object' ? fallback : createGuestProfile();
    const id = typeof source?.id === 'string' && source.id.trim() ? source.id.trim() : safeFallback.id || createProfileId();
    const displayName = sanitizeDisplayName(source && source.displayName, safeFallback.displayName);
    return { id, displayName };
}

function sanitizeDisplayName(value, fallback) {
    const normalized = String(value || '').replace(/\s+/g, ' ').trim().slice(0, 24);
    if (normalized) return normalized;
    if (fallback) return String(fallback).slice(0, 24);
    const guestId = createProfileId().slice(-4);
    return 'Guest-' + guestId;
}

function createGuestProfile() {
    const id = createProfileId();
    return {
        id,
        displayName: 'Guest-' + id.slice(-4),
    };
}

function createProfileId() {
    if (typeof crypto.randomUUID === 'function') {
        return 'p-' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    }
    return 'p-' + crypto.randomBytes(6).toString('hex');
}

function ensureRatingRecord(profile) {
    if (!profile || !profile.id) {
        return {
            id: '',
            displayName: 'Guest',
            rating: DEFAULT_RATING,
            games: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            lastUpdated: 0,
        };
    }
    let record = ratings.get(profile.id);
    if (!record) {
        record = {
            id: profile.id,
            displayName: profile.displayName || 'Guest',
            rating: DEFAULT_RATING,
            games: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            lastUpdated: 0,
        };
        ratings.set(profile.id, record);
    }
    record.displayName = sanitizeDisplayName(profile.displayName, record.displayName);
    return record;
}

function buildDrawOfferPayload(drawOffer) {
    if (!drawOffer || !drawOffer.from) return null;
    return {
        from: drawOffer.from,
        createdAt: Number(drawOffer.createdAt) || Date.now(),
    };
}

function emitDrawState(game, target) {
    if (!game) return;
    const payload = {
        gameId: game.id,
        offer: buildDrawOfferPayload(game.drawOffer),
    };
    if (target) {
        target.emit('drawState', payload);
        return;
    }
    io.to(game.roomName).emit('drawState', payload);
}

function handleCreateClub(socket, payload) {
    const profile = getSocketProfile(socket);
    const name = sanitizeEntityName(payload && payload.name, 40);
    const description = sanitizeDescription(payload && payload.description, 240);
    if (!name) {
        socket.emit('matchError', { message: 'Enter a club name.' });
        return;
    }

    const club = {
        id: createEntityId('club'),
        name,
        description,
        ownerId: profile.id,
        memberIds: uniqueIds([profile.id]),
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    clubs.unshift(club);
    persistMultiplayerStore();
    emitClubs();
}

function handleJoinClub(socket, payload) {
    const club = findClub(payload && payload.clubId);
    if (!club) {
        socket.emit('matchError', { message: 'That club no longer exists.' });
        return;
    }

    const profile = getSocketProfile(socket);
    club.memberIds = uniqueIds(club.memberIds.concat(profile.id));
    club.updatedAt = Date.now();
    persistMultiplayerStore();
    emitClubs();
}

function handleLeaveClub(socket, payload) {
    const club = findClub(payload && payload.clubId);
    if (!club) {
        socket.emit('matchError', { message: 'That club no longer exists.' });
        return;
    }

    const profile = getSocketProfile(socket);
    club.memberIds = club.memberIds.filter(memberId => memberId !== profile.id);
    if (!club.memberIds.length) {
        removeClub(club.id);
        return;
    }
    if (club.ownerId === profile.id) {
        club.ownerId = club.memberIds[0];
    }
    club.updatedAt = Date.now();
    persistMultiplayerStore();
    emitClubs();
}

function handleCreateTournament(socket, payload) {
    const profile = getSocketProfile(socket);
    const name = sanitizeEntityName(payload && payload.name, 48);
    const description = sanitizeDescription(payload && payload.description, 280);
    const clubId = typeof payload?.clubId === 'string' ? payload.clubId.trim() : '';
    if (!name) {
        socket.emit('matchError', { message: 'Enter a tournament name.' });
        return;
    }
    const club = clubId ? findClub(clubId) : null;
    if (clubId && !club) {
        socket.emit('matchError', { message: 'Choose a valid club before creating a club tournament.' });
        return;
    }
    if (club && !club.memberIds.includes(profile.id)) {
        socket.emit('matchError', { message: 'Join the linked club before creating an event for it.' });
        return;
    }

    const tournament = {
        id: createEntityId('tournament'),
        name,
        description,
        ownerId: profile.id,
        clubId,
        participantIds: uniqueIds([profile.id]),
        status: 'pending',
        rounds: [],
        standings: createStandings([profile.id]),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        startedAt: 0,
    };
    tournaments.unshift(tournament);
    persistMultiplayerStore();
    emitTournaments();
}

function handleJoinTournament(socket, payload) {
    const tournament = findTournament(payload && payload.tournamentId);
    if (!tournament) {
        socket.emit('matchError', { message: 'That tournament no longer exists.' });
        return;
    }
    if (tournament.status !== 'pending') {
        socket.emit('matchError', { message: 'This tournament has already started.' });
        return;
    }

    const profile = getSocketProfile(socket);
    if (tournament.clubId) {
        const club = findClub(tournament.clubId);
        if (!club || !club.memberIds.includes(profile.id)) {
            socket.emit('matchError', { message: 'Join the linked club before entering this tournament.' });
            return;
        }
    }
    tournament.participantIds = uniqueIds(tournament.participantIds.concat(profile.id));
    tournament.standings = createStandings(tournament.participantIds);
    tournament.updatedAt = Date.now();
    persistMultiplayerStore();
    emitTournaments();
}

function handleLeaveTournament(socket, payload) {
    const tournament = findTournament(payload && payload.tournamentId);
    if (!tournament) {
        socket.emit('matchError', { message: 'That tournament no longer exists.' });
        return;
    }
    if (tournament.status !== 'pending') {
        socket.emit('matchError', { message: 'Tournament rosters are locked after the event starts.' });
        return;
    }

    const profile = getSocketProfile(socket);
    tournament.participantIds = tournament.participantIds.filter(id => id !== profile.id);
    if (!tournament.participantIds.length) {
        removeTournament(tournament.id);
        return;
    }
    if (tournament.ownerId === profile.id) {
        tournament.ownerId = tournament.participantIds[0];
    }
    tournament.standings = createStandings(tournament.participantIds);
    tournament.updatedAt = Date.now();
    persistMultiplayerStore();
    emitTournaments();
}

function handleStartTournament(socket, payload) {
    const tournament = findTournament(payload && payload.tournamentId);
    if (!tournament) {
        socket.emit('matchError', { message: 'That tournament no longer exists.' });
        return;
    }

    const profile = getSocketProfile(socket);
    if (tournament.ownerId !== profile.id) {
        socket.emit('matchError', { message: 'Only the tournament organizer can start the event.' });
        return;
    }
    if (tournament.status !== 'pending') {
        socket.emit('matchError', { message: 'This tournament is already underway.' });
        return;
    }
    if (tournament.participantIds.length < 2) {
        socket.emit('matchError', { message: 'At least two players are required to start a tournament.' });
        return;
    }

    tournament.rounds = buildRoundRobinRounds(tournament.participantIds);
    tournament.standings = createStandings(tournament.participantIds);
    tournament.status = 'active';
    tournament.startedAt = Date.now();
    tournament.updatedAt = tournament.startedAt;
    tournament.currentRound = 0;
    tournament.completedAt = 0;
    activateTournamentRound(tournament, 1);
    persistMultiplayerStore();
    emitTournaments();
}

function handleJoinTournamentMatch(socket, payload) {
    const tournamentId = typeof payload?.tournamentId === 'string' ? payload.tournamentId.trim() : '';
    const pairingId = typeof payload?.pairingId === 'string' ? payload.pairingId.trim() : '';
    const resolved = findTournamentPairing(tournamentId, pairingId);
    if (!resolved) {
        socket.emit('matchError', { message: 'That tournament pairing is no longer available.' });
        return;
    }

    const { tournament, round, pairing } = resolved;
    if (tournament.status !== 'active') {
        socket.emit('matchError', { message: 'This tournament is not currently accepting round games.' });
        return;
    }
    if (Number(tournament.currentRound) !== Number(round.roundNumber)) {
        socket.emit('matchError', { message: 'Only the active round can be played right now.' });
        return;
    }
    if (pairing.status === 'finished') {
        socket.emit('matchError', { message: 'This pairing has already been completed.' });
        return;
    }

    const currentPlayerGame = getAnyGameForPlayer(socket.id);
    if (currentPlayerGame && currentPlayerGame.id !== pairing.gameId) {
        socket.emit('matchError', { message: 'Leave your current online game before joining your tournament pairing.' });
        return;
    }
    if (spectatorToGame.has(socket.id)) {
        socket.emit('matchError', { message: 'Stop spectating before joining your tournament pairing.' });
        return;
    }

    const profile = getSocketProfile(socket);
    const role = profile.id === pairing.whiteId ? 'white' : (profile.id === pairing.blackId ? 'black' : '');
    if (!role) {
        socket.emit('matchError', { message: 'Only assigned players can join this tournament game.' });
        return;
    }

    let game = pairing.gameId ? games.get(pairing.gameId) : null;
    if (!game) {
        game = ensureTournamentPairingGame(tournament, round, pairing);
    }
    if (!game) {
        socket.emit('matchError', { message: 'Unable to create the assigned tournament game.' });
        return;
    }

    assignRoleSocket(game, role, socket, { preserveToken: false });
    pairing.status = bothPlayersConnected(game) ? 'active' : 'waiting';
    if (bothPlayersConnected(game)) {
        game.status = 'active';
        if (!game.startedAt) {
            game.startedAt = Date.now();
        }
        pairing.startedAt = pairing.startedAt || game.startedAt;
        emitMatchFound(game, { resumed: false });
    } else {
        game.status = 'waiting-tournament';
        emitMatchForRole(game, role, socket, { resumed: false });
        refreshPresence(game);
    }

    tournament.updatedAt = Date.now();
    persistMultiplayerStore();
    emitLiveGames();
    emitTournaments();
}

function buildClubPayload(club) {
    const linkedTournaments = tournaments.filter(tournament => tournament.clubId === club.id);
    return {
        id: club.id,
        name: club.name,
        description: club.description,
        ownerId: club.ownerId,
        ownerName: getDisplayNameForProfileId(club.ownerId),
        memberIds: club.memberIds.slice(),
        members: club.memberIds.map(memberId => ({
            id: memberId,
            displayName: getDisplayNameForProfileId(memberId),
            rating: getRatingForProfileId(memberId),
        })),
        memberCount: club.memberIds.length,
        linkedTournamentCount: linkedTournaments.length,
        linkedTournaments: linkedTournaments.slice(0, 6).map(tournament => ({
            id: tournament.id,
            name: tournament.name,
            status: tournament.status,
            participantCount: tournament.participantIds.length,
        })),
        recentMatches: buildClubRecentMatches(club, CLUB_HISTORY_LIMIT),
        createdAt: club.createdAt,
        updatedAt: club.updatedAt,
    };
}

function buildTournamentPayload(tournament) {
    return {
        id: tournament.id,
        name: tournament.name,
        description: tournament.description,
        ownerId: tournament.ownerId,
        ownerName: getDisplayNameForProfileId(tournament.ownerId),
        clubId: tournament.clubId || '',
        clubName: tournament.clubId ? getClubName(tournament.clubId) : '',
        status: tournament.status,
        currentRound: Number(tournament.currentRound) || 0,
        participantIds: tournament.participantIds.slice(),
        participants: tournament.participantIds.map(profileId => ({
            id: profileId,
            displayName: getDisplayNameForProfileId(profileId),
            rating: getRatingForProfileId(profileId),
        })),
        rounds: tournament.rounds.map(round => ({
            roundNumber: round.roundNumber,
            status: round.status,
            activatedAt: round.activatedAt,
            completedAt: round.completedAt,
            pairings: round.pairings.map(pairing => ({
                id: pairing.id,
                gameId: pairing.gameId || '',
                whiteId: pairing.whiteId,
                whiteName: pairing.whiteId ? getDisplayNameForProfileId(pairing.whiteId) : 'Bye',
                blackId: pairing.blackId,
                blackName: pairing.blackId ? getDisplayNameForProfileId(pairing.blackId) : 'Bye',
                result: pairing.result,
                status: pairing.status,
                startedAt: pairing.startedAt,
                completedAt: pairing.completedAt,
                summary: pairing.summary || '',
            })),
        })),
        standings: tournament.standings.map(entry => ({
            playerId: entry.playerId,
            displayName: getDisplayNameForProfileId(entry.playerId),
            rating: getRatingForProfileId(entry.playerId),
            points: entry.points,
            games: entry.games,
            wins: entry.wins,
            draws: entry.draws,
            losses: entry.losses,
        })),
        createdAt: tournament.createdAt,
        updatedAt: tournament.updatedAt,
        startedAt: tournament.startedAt,
        completedAt: tournament.completedAt,
    };
}

function getDisplayNameForProfileId(profileId) {
    const record = profileId ? ratings.get(profileId) : null;
    return record && record.displayName ? record.displayName : 'Guest';
}

function getRatingForProfileId(profileId) {
    const record = profileId ? ratings.get(profileId) : null;
    return record && Number.isFinite(record.rating) ? record.rating : DEFAULT_RATING;
}

function findClub(clubId) {
    const normalized = typeof clubId === 'string' ? clubId.trim() : '';
    return clubs.find(club => club.id === normalized) || null;
}

function getClubName(clubId) {
    const club = findClub(clubId);
    return club ? club.name : '';
}

function removeClub(clubId) {
    const index = clubs.findIndex(club => club.id === clubId);
    if (index >= 0) {
        clubs.splice(index, 1);
        tournaments.forEach(tournament => {
            if (tournament.clubId === clubId) {
                tournament.clubId = '';
                tournament.updatedAt = Date.now();
            }
        });
        persistMultiplayerStore();
        emitClubs();
        emitTournaments();
    }
}

function findTournament(tournamentId) {
    const normalized = typeof tournamentId === 'string' ? tournamentId.trim() : '';
    return tournaments.find(tournament => tournament.id === normalized) || null;
}

function removeTournament(tournamentId) {
    const index = tournaments.findIndex(tournament => tournament.id === tournamentId);
    if (index >= 0) {
        const tournament = tournaments[index];
        tournament.rounds.forEach(round => {
            round.pairings.forEach(pairing => {
                if (!pairing.gameId) return;
                const game = games.get(pairing.gameId);
                if (game) {
                    cleanupGame(game);
                }
            });
        });
        tournaments.splice(index, 1);
        persistMultiplayerStore();
        emitTournaments();
    }
}

function createStandings(participantIds) {
    return uniqueIds(participantIds).map(playerId => ({
        playerId,
        points: 0,
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0,
    }));
}

function buildRoundRobinRounds(participantIds) {
    const players = uniqueIds(participantIds).slice();
    if (players.length < 2) return [];
    const rotation = players.slice();
    const hadBye = rotation.length % 2 === 1;
    if (hadBye) {
        rotation.push(null);
    }

    const rounds = [];
    const totalRounds = rotation.length - 1;
    for (let roundIndex = 0; roundIndex < totalRounds; roundIndex += 1) {
        const pairings = [];
        for (let pairIndex = 0; pairIndex < rotation.length / 2; pairIndex += 1) {
            const left = rotation[pairIndex];
            const right = rotation[rotation.length - 1 - pairIndex];
            if (!left || !right) continue;
            const whiteId = (roundIndex + pairIndex) % 2 === 0 ? left : right;
            const blackId = whiteId === left ? right : left;
            pairings.push({
                id: createPairingId(),
                whiteId,
                blackId,
                result: 'pending',
                status: 'pending',
                gameId: '',
                startedAt: 0,
                completedAt: 0,
                summary: '',
            });
        }
        rounds.push({
            roundNumber: roundIndex + 1,
            status: 'pending',
            activatedAt: 0,
            completedAt: 0,
            pairings,
        });

        const pivot = rotation[0];
        const tail = rotation.slice(1);
        tail.unshift(tail.pop());
        rotation.splice(0, rotation.length, pivot, ...tail);
    }

    return rounds;
}

function hydrateTournamentGames(tournamentList) {
    (Array.isArray(tournamentList) ? tournamentList : []).forEach(tournament => {
        if (tournament.status !== 'active') return;
        tournament.rounds.forEach(round => {
            round.pairings.forEach(pairing => {
                const shouldHydrate = Boolean(pairing.gameId) || Number(round.roundNumber) === Number(tournament.currentRound);
                if (!shouldHydrate || pairing.status === 'finished') return;
                ensureTournamentPairingGame(tournament, round, pairing);
            });
        });
    });
}

function ensureTournamentPairingGame(tournament, round, pairing) {
    if (!tournament || !round || !pairing) return null;
    if (pairing.gameId && games.has(pairing.gameId)) {
        return games.get(pairing.gameId);
    }

    const gameId = pairing.gameId || createGameId();

    const game = createGame('tournament', {
        id: gameId,
        rated: false,
        status: pairing.status === 'active' ? 'waiting-tournament' : 'waiting-tournament',
        joinUrl: `/game/${gameId}`,
        tournamentId: tournament.id,
        tournamentRound: round.roundNumber,
        tournamentPairingId: pairing.id,
        clubId: tournament.clubId || '',
        startedAt: 0,
    });

    pairing.gameId = game.id;
    game.joinUrl = `/game/${game.id}`;
    game.white.profile = createStoredPlayerProfile(pairing.whiteId, 'White');
    game.black.profile = createStoredPlayerProfile(pairing.blackId, 'Black');
    games.set(game.id, game);
    return game;
}

function createStoredPlayerProfile(profileId, fallbackName) {
    if (!profileId) {
        return {
            id: '',
            displayName: fallbackName,
        };
    }
    return {
        id: profileId,
        displayName: getDisplayNameForProfileId(profileId) || fallbackName,
    };
}

function bothPlayersConnected(game) {
    return Boolean(game && game.white && game.white.connected && game.black && game.black.connected);
}

function findTournamentPairing(tournamentId, pairingId) {
    const tournament = findTournament(tournamentId);
    if (!tournament) return null;
    for (const round of tournament.rounds) {
        const pairing = round.pairings.find(entry => entry.id === pairingId);
        if (pairing) {
            return { tournament, round, pairing };
        }
    }
    return null;
}

function activateTournamentRound(tournament, roundNumber) {
    if (!tournament) return null;
    const round = tournament.rounds.find(entry => Number(entry.roundNumber) === Number(roundNumber));
    if (!round) return null;
    tournament.currentRound = Number(round.roundNumber) || 0;
    round.status = 'active';
    round.activatedAt = round.activatedAt || Date.now();
    round.completedAt = 0;
    round.pairings.forEach(pairing => {
        pairing.status = pairing.result === 'pending' ? 'waiting' : 'finished';
        ensureTournamentPairingGame(tournament, round, pairing);
    });
    return round;
}

function applyTournamentResult(game, resultPayload) {
    if (!game || !game.tournamentId || !game.tournamentPairingId) return;
    const resolved = findTournamentPairing(game.tournamentId, game.tournamentPairingId);
    if (!resolved) return;

    const { tournament, round, pairing } = resolved;
    pairing.result = game.result;
    pairing.status = 'finished';
    pairing.gameId = game.id;
    pairing.startedAt = pairing.startedAt || game.startedAt || game.createdAt;
    pairing.completedAt = game.endedAt;
    pairing.summary = resultPayload.summary || '';

    tournament.standings = rebuildTournamentStandings(tournament);
    tournament.updatedAt = game.endedAt || Date.now();

    const allFinished = round.pairings.every(entry => entry.result !== 'pending');
    if (allFinished) {
        round.status = 'completed';
        round.completedAt = game.endedAt || Date.now();
        const nextRound = tournament.rounds.find(entry => entry.roundNumber > round.roundNumber && entry.status !== 'completed');
        if (nextRound) {
            activateTournamentRound(tournament, nextRound.roundNumber);
        } else {
            tournament.status = 'completed';
            tournament.completedAt = game.endedAt || Date.now();
        }
    }
}

function rebuildTournamentStandings(tournament) {
    const standings = new Map(createStandings(tournament.participantIds).map(entry => [entry.playerId, entry]));
    tournament.rounds.forEach(round => {
        round.pairings.forEach(pairing => {
            if (!/^(white-wins|black-wins|draw)$/.test(pairing.result)) return;
            const white = standings.get(pairing.whiteId);
            const black = standings.get(pairing.blackId);
            if (!white || !black) return;
            white.games += 1;
            black.games += 1;
            if (pairing.result === 'white-wins') {
                white.wins += 1;
                white.points += 1;
                black.losses += 1;
            } else if (pairing.result === 'black-wins') {
                black.wins += 1;
                black.points += 1;
                white.losses += 1;
            } else {
                white.draws += 1;
                black.draws += 1;
                white.points += 0.5;
                black.points += 0.5;
            }
        });
    });

    return Array.from(standings.values()).sort((left, right) => {
        if (right.points !== left.points) return right.points - left.points;
        if (right.wins !== left.wins) return right.wins - left.wins;
        return getDisplayNameForProfileId(left.playerId).localeCompare(getDisplayNameForProfileId(right.playerId));
    });
}

function buildClubRecentMatches(club, limit) {
    if (!club) return [];
    const memberIds = new Set(Array.isArray(club.memberIds) ? club.memberIds : []);
    return recentResults.filter(result => {
        const context = result && result.matchContext ? result.matchContext : null;
        if (context && context.clubId && context.clubId === club.id) {
            return true;
        }
        const whiteId = result && result.players && result.players.white ? result.players.white.id : '';
        const blackId = result && result.players && result.players.black ? result.players.black.id : '';
        return memberIds.has(whiteId) || memberIds.has(blackId);
    }).slice(0, Math.max(1, Number(limit) || CLUB_HISTORY_LIMIT));
}

function normalizeDrawAction(value) {
    const action = String(value || '').trim().toLowerCase();
    return /^(offer|accept|decline|cancel)$/.test(action) ? action : '';
}

function storeChatArchive(game) {
    if (!game || !game.id) return;
    chatArchive.set(game.id, game.chatMessages.slice(-CHAT_HISTORY_LIMIT));
}

function createEntityId(prefix) {
    const base = typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
        : crypto.randomBytes(5).toString('hex');
    return prefix + '-' + base;
}

function createPairingId() {
    return createEntityId('pairing');
}

function uniqueIds(values) {
    return Array.from(new Set((Array.isArray(values) ? values : []).filter(value => typeof value === 'string' && value.trim()).map(value => value.trim())));
}

function sanitizeEntityName(value, maxLength) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength || 48);
}

function sanitizeDescription(value, maxLength) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength || 280);
}

function loadMultiplayerStore() {
    const fallback = {
        profiles: {},
        recentResults: [],
        chatArchive: {},
        lobbyChat: [],
        clubs: [],
        tournaments: [],
    };

    try {
        fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
        if (!fs.existsSync(STORE_FILE)) {
            fs.writeFileSync(STORE_FILE, JSON.stringify(fallback, null, 2));
            return fallback;
        }
        const parsed = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
        return Object.assign({}, fallback, parsed || {});
    } catch (error) {
        console.error('Failed to load multiplayer store.', error);
        return fallback;
    }
}

function persistMultiplayerStore() {
    const payload = {
        profiles: Object.fromEntries(Array.from(ratings.entries()).map(([id, record]) => [id, {
            id: record.id,
            displayName: record.displayName,
            rating: record.rating,
            games: record.games,
            wins: record.wins,
            losses: record.losses,
            draws: record.draws,
            lastUpdated: record.lastUpdated,
        }])),
        recentResults: recentResults.slice(0, RECENT_RESULTS_LIMIT),
        chatArchive: Object.fromEntries(Array.from(chatArchive.entries()).map(([gameId, messages]) => [gameId, Array.isArray(messages) ? messages.slice(-CHAT_HISTORY_LIMIT) : []])),
        lobbyChat: lobbyChat.slice(-LOBBY_CHAT_LIMIT),
        clubs: clubs.map(club => ({
            id: club.id,
            name: club.name,
            description: club.description,
            ownerId: club.ownerId,
            memberIds: club.memberIds.slice(),
            createdAt: club.createdAt,
            updatedAt: club.updatedAt,
        })),
        tournaments: tournaments.map(tournament => ({
            id: tournament.id,
            name: tournament.name,
            description: tournament.description,
            ownerId: tournament.ownerId,
            clubId: tournament.clubId || '',
            participantIds: tournament.participantIds.slice(),
            status: tournament.status,
            currentRound: Number(tournament.currentRound) || 0,
            rounds: tournament.rounds.map(round => ({
                roundNumber: round.roundNumber,
                status: round.status,
                activatedAt: round.activatedAt,
                completedAt: round.completedAt,
                pairings: round.pairings.map(pairing => ({
                    id: pairing.id,
                    whiteId: pairing.whiteId,
                    blackId: pairing.blackId,
                    result: pairing.result,
                    status: pairing.status,
                    gameId: pairing.gameId || '',
                    startedAt: pairing.startedAt || 0,
                    completedAt: pairing.completedAt || 0,
                    summary: pairing.summary || '',
                })),
            })),
            standings: tournament.standings.map(entry => ({
                playerId: entry.playerId,
                points: entry.points,
                games: entry.games,
                wins: entry.wins,
                draws: entry.draws,
                losses: entry.losses,
            })),
            createdAt: tournament.createdAt,
            updatedAt: tournament.updatedAt,
            startedAt: tournament.startedAt,
            completedAt: tournament.completedAt || 0,
        })),
    };

    try {
        fs.writeFileSync(STORE_FILE, JSON.stringify(payload, null, 2));
    } catch (error) {
        console.error('Failed to persist multiplayer store.', error);
    }
}

function hydrateStoredProfiles(value) {
    const source = value && typeof value === 'object' ? value : {};
    return Object.keys(source).map(id => {
        const record = source[id] || {};
        return {
            id,
            displayName: sanitizeDisplayName(record.displayName, 'Guest'),
            rating: Number(record.rating) || DEFAULT_RATING,
            games: Number(record.games) || 0,
            wins: Number(record.wins) || 0,
            losses: Number(record.losses) || 0,
            draws: Number(record.draws) || 0,
            lastUpdated: Number(record.lastUpdated) || 0,
        };
    }).filter(record => record.id);
}

function normalizeStoredRecentResults(value) {
    return Array.isArray(value) ? value.slice(0, RECENT_RESULTS_LIMIT) : [];
}

function normalizeStoredChatArchive(value) {
    const source = value && typeof value === 'object' ? value : {};
    return Object.keys(source).reduce((result, gameId) => {
        result[gameId] = Array.isArray(source[gameId]) ? source[gameId].slice(-CHAT_HISTORY_LIMIT) : [];
        return result;
    }, {});
}

function normalizeStoredClubs(value) {
    if (!Array.isArray(value)) return [];
    return value.map(club => ({
        id: typeof club?.id === 'string' ? club.id : createEntityId('club'),
        name: sanitizeEntityName(club && club.name, 40),
        description: sanitizeDescription(club && club.description, 240),
        ownerId: typeof club?.ownerId === 'string' ? club.ownerId : '',
        memberIds: uniqueIds(club && club.memberIds),
        createdAt: Number(club && club.createdAt) || Date.now(),
        updatedAt: Number(club && club.updatedAt) || Date.now(),
    })).filter(club => club.name);
}

function normalizeStoredTournaments(value) {
    if (!Array.isArray(value)) return [];
    return value.map(tournament => ({
        id: typeof tournament?.id === 'string' ? tournament.id : createEntityId('tournament'),
        name: sanitizeEntityName(tournament && tournament.name, 48),
        description: sanitizeDescription(tournament && tournament.description, 280),
        ownerId: typeof tournament?.ownerId === 'string' ? tournament.ownerId : '',
        clubId: typeof tournament?.clubId === 'string' ? tournament.clubId : '',
        participantIds: uniqueIds(tournament && tournament.participantIds),
        status: typeof tournament?.status === 'string' ? tournament.status : 'pending',
        currentRound: Number(tournament && tournament.currentRound) || 0,
        rounds: Array.isArray(tournament && tournament.rounds) ? tournament.rounds.map(round => ({
            roundNumber: Number(round && round.roundNumber) || 1,
            status: typeof round?.status === 'string' ? round.status : 'pending',
            activatedAt: Number(round && round.activatedAt) || 0,
            completedAt: Number(round && round.completedAt) || 0,
            pairings: Array.isArray(round && round.pairings) ? round.pairings.map(pairing => ({
                id: typeof pairing?.id === 'string' ? pairing.id : createPairingId(),
                whiteId: typeof pairing?.whiteId === 'string' ? pairing.whiteId : '',
                blackId: typeof pairing?.blackId === 'string' ? pairing.blackId : '',
                result: typeof pairing?.result === 'string' ? pairing.result : 'pending',
                status: typeof pairing?.status === 'string' ? pairing.status : 'pending',
                gameId: typeof pairing?.gameId === 'string' ? pairing.gameId : '',
                startedAt: Number(pairing && pairing.startedAt) || 0,
                completedAt: Number(pairing && pairing.completedAt) || 0,
                summary: typeof pairing?.summary === 'string' ? pairing.summary : '',
            })) : [],
        })) : [],
        standings: Array.isArray(tournament && tournament.standings) ? tournament.standings.map(entry => ({
            playerId: typeof entry?.playerId === 'string' ? entry.playerId : '',
            points: Number(entry && entry.points) || 0,
            games: Number(entry && entry.games) || 0,
            wins: Number(entry && entry.wins) || 0,
            draws: Number(entry && entry.draws) || 0,
            losses: Number(entry && entry.losses) || 0,
        })).filter(entry => entry.playerId) : createStandings(tournament && tournament.participantIds),
        createdAt: Number(tournament && tournament.createdAt) || Date.now(),
        updatedAt: Number(tournament && tournament.updatedAt) || Date.now(),
        startedAt: Number(tournament && tournament.startedAt) || 0,
        completedAt: Number(tournament && tournament.completedAt) || 0,
    })).filter(tournament => tournament.name);
}

function buildProfilePayload(profile) {
    const record = ensureRatingRecord(profile);
    return {
        id: record.id,
        displayName: record.displayName,
        rating: record.rating,
        games: record.games,
        wins: record.wins,
        losses: record.losses,
        draws: record.draws,
    };
}

function getConnectedSocket(game, role) {
    const slot = game && game[role];
    if (!slot || !slot.connected || !slot.socketId) return null;
    return io.sockets.sockets.get(slot.socketId) || null;
}

function getRoleForSocket(game, socketId) {
    if (!game || !socketId) return '';
    if (game.white && game.white.socketId === socketId) return 'white';
    if (game.black && game.black.socketId === socketId) return 'black';
    return '';
}

function getActiveGameForSocket(socketId) {
    const gameId = socketToGame.get(socketId);
    if (!gameId) return null;
    const game = games.get(gameId);
    return game && game.status === 'active' ? game : null;
}

function getAnyGameForPlayer(socketId) {
    const gameId = socketToGame.get(socketId);
    return gameId ? games.get(gameId) || null : null;
}

function getRoomGameForSocket(socketId) {
    return getAnyGameForPlayer(socketId) || (spectatorToGame.get(socketId) ? games.get(spectatorToGame.get(socketId)) || null : null);
}

function dequeueWaitingOpponent(currentSocketId) {
    while (waitingQueue.length) {
        const opponentId = waitingQueue.shift();
        if (!opponentId || opponentId === currentSocketId) continue;
        const opponent = io.sockets.sockets.get(opponentId);
        if (opponent) {
            return opponent;
        }
    }
    return null;
}

function createRoleSlot() {
    return {
        socketId: null,
        token: '',
        connected: false,
        timeoutId: null,
        profile: null,
    };
}

function normalizeMovePayload(payload) {
    if (!payload || typeof payload !== 'object') return null;
    const from = typeof payload.from === 'string' ? payload.from.trim().toLowerCase() : '';
    const to = typeof payload.to === 'string' ? payload.to.trim().toLowerCase() : '';
    const promotion = typeof payload.promotion === 'string' ? payload.promotion.trim() : '';
    const uci = typeof payload.uci === 'string'
        ? payload.uci.trim().toLowerCase()
        : from && to
            ? (from + to + promotion.toLowerCase())
            : '';
    if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci)) return null;
    return {
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci.slice(4) || '',
        uci,
    };
}

function normalizeResultPayload(payload) {
    if (!payload || typeof payload !== 'object') return null;
    const result = typeof payload.result === 'string' ? payload.result.trim() : '';
    if (!/^(white-wins|black-wins|draw)$/.test(result)) return null;
    const reason = String(payload.resultReason || payload.reason || '').trim().slice(0, 40) || inferResultReason(result);
    return { result, reason };
}

function inferResultReason(result) {
    if (result === 'draw') return 'stalemate';
    return 'checkmate';
}

function normalizeChatMessage(value) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.slice(0, 300);
}

function createGameId() {
    if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID().split('-')[0];
    }
    return crypto.randomBytes(6).toString('hex');
}

function createReconnectToken() {
    return crypto.randomBytes(18).toString('hex');
}

function createMessageId() {
    return crypto.randomBytes(8).toString('hex');
}

function otherRole(role) {
    return role === 'white' ? 'black' : 'white';
}

function isGamePublicSpectatable(game) {
    return Boolean(game && game.status === 'active' && (game.mode === 'matchmaking' || game.mode === 'tournament'));
}

function getSlotDisplayName(slot, fallback) {
    if (slot && slot.profile && slot.profile.displayName) return slot.profile.displayName;
    return fallback;
}

function removeFromWaitingQueue(socketId) {
    const index = waitingQueue.indexOf(socketId);
    if (index >= 0) {
        waitingQueue.splice(index, 1);
    }
}

function resolveWorkspacePath(requestPath) {
    const cleaned = requestPath.replace(/^\/+/, '');
    const candidate = path.resolve(ROOT_DIR, cleaned);
    if (!candidate.startsWith(ROOT_DIR)) return null;
    return candidate;
}

function serveFile(filePath, response) {
    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';
    const stream = fs.createReadStream(filePath);
    response.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(response);
    stream.on('error', () => {
        if (!response.headersSent) {
            sendText(response, 500, 'Failed to read file');
        } else {
            response.destroy();
        }
    });
}

function sendJson(response, statusCode, payload) {
    const body = JSON.stringify(payload);
    response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(body);
}

function sendText(response, statusCode, message) {
    response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(message);
}

function normalizeStoredLobbyChat(value) {
    return Array.isArray(value)
        ? value.slice(-LOBBY_CHAT_LIMIT).map(entry => ({
            id: typeof entry?.id === 'string' ? entry.id : createMessageId(),
            channel: 'lobby',
            author: buildProfilePayload(entry && entry.author ? entry.author : { id: '', displayName: 'Guest' }),
            text: normalizeChatMessage(entry && entry.text),
            createdAt: Number(entry && entry.createdAt) || Date.now(),
        })).filter(entry => entry.text)
        : [];
}