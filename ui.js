// ============================
//   THEMES & THEME LOGIC
// ============================
const THEMES = [
    'theme-classic','theme-classic-low',
    'theme-blue','theme-blue-low',
    'theme-green','theme-green-low',
    'theme-wood','theme-wood-low',
    'theme-night','theme-night-low',
    'theme-purple','theme-purple-low',
];

const PIECE_SET_KEY = 'bbjs-piece-set';
const BOARD3D_RENDER_STYLE_KEY = 'bbjs-3d-render-style';
const BOARD3D_RENDER_STYLES = ['staunton', 'staunton-ivory', 'staunton-bronze', 'legacy', 'scene'];
const PIECE_SETS = {
    emoji: {
        // Light Side (White)
        K: '🤴',
        Q: '👸🏻',
        R: '🏰',
        B: '🧙🏻‍♂️',
        N: '🦄',
        A: '🪽',
        C: '🛡️',
        P: '🕯️',

        // Dark Side (Black)
        k: '🤴🏽',
        q: '👸🏽',
        r: '🏯',
        b: '🧙🏽‍♂️',
        n: '🐴',
        a: '🪶',
        c: '⚔️',
        p: '♟️',
    },
    classic: {
        // Standard Unicode chess set + fallback letters for fairy pieces.
        K: '♔',
        Q: '♕',
        R: '♖',
        B: '♗',
        N: '♘',
        A: 'A',
        C: 'C',
        P: '♙',
        k: '♚',
        q: '♛',
        r: '♜',
        b: '♝',
        n: '♞',
        a: 'a',
        c: 'c',
        p: '♟',
    },
    heroesVsVillains: {
        K: '🤴', Q: '👸', R: '🏰', B: '😇', N: '🦸', A: '🌟', C: '🛡️', P: '🙂',
        k: '😈', q: '🧛', r: '🏯', b: '💀', n: '🦹', a: '🌑', c: '⚔️', p: '😤',
    },
    animalKingdom: {
        K: '🦁', Q: '🦋', R: '🐘', B: '🦊', N: '🐎', A: '🦅', C: '🐂', P: '🐰',
        k: '🐯', q: '🦅', r: '🦏', b: '🦉', n: '🐺', a: '🦇', c: '🦷', p: '🐍',
    },
    fantasyRealms: {
        K: '🤴', Q: '🧚', R: '🏰', B: '🧙', N: '🦄', A: '🪽', C: '🛡️', P: '⭐',
        k: '💀', q: '🧛', r: '🗼', b: '🧟', n: '🐲', a: '🪶', c: '⚔️', p: '🔮',
    },
    celestialVsShadow: {
        K: '☀️', Q: '🌟', R: '💫', B: '✨', N: '🌈', A: '🌠', C: '🌤️', P: '🌕',
        k: '🌑', q: '🔥', r: '🌪️', b: '⚡', n: '☄️', a: '🌫️', c: '🌩️', p: '🌚',
    },
    galacticSciFi: {
        K: '👨‍🚀', Q: '🛰️', R: '🚀', B: '🔭', N: '🚁', A: '🌟', C: '🛸', P: '⭐',
        k: '👾', q: '🛸', r: '☄️', b: '🤖', n: '🦾', a: '💫', c: '⚡', p: '💥',
    },
    foodFight: {
        K: '🍕', Q: '🍔', R: '🍟', B: '🌮', N: '🧁', A: '🍰', C: '🥪', P: '🍩',
        k: '🥦', q: '🥑', r: '🥕', b: '🍎', n: '🥗', a: '🥝', c: '🫑', p: '🫐',
    },
    underTheSea: {
        K: '🐠', Q: '🐙', R: '🐡', B: '🦀', N: '🐬', A: '🌊', C: '🐚', P: '🐟',
        k: '🦑', q: '🦈', r: '🐋', b: '🪼', n: '🦭', a: '🌑', c: '🦞', p: '🦐',
    },
    spookySeason: {
        K: '👻', Q: '🕯️', R: '🏚️', B: '🕸️', N: '🦇', A: '🌙', C: '💀', P: '🫧',
        k: '🎃', q: '🧙‍♀️', r: '🗝️', b: '🧿', n: '🐈‍⬛', a: '🍄', c: '🔮', p: '🌑',
    },
    ancientWorlds: {
        K: '👑', Q: '🌺', R: '🏛️', B: '🔆', N: '🐫', A: '☀️', C: '🛡️', P: '🪬',
        k: '⚔️', q: '🦅', r: '🏟️', b: '⚡', n: '🐺', a: '🌙', c: '🗡️', p: '🛡️',
    },
    sportsRivals: {
        K: '🏆', Q: '🥇', R: '🏟️', B: '🎯', N: '🏇', A: '🎖️', C: '🏋️', P: '⚽',
        k: '🎖️', q: '🥈', r: '🏗️', b: '🎳', n: '🤼', a: '🏅', c: '🥊', p: '🏀',
    },
    dinoWars: {
        K: '🦕', Q: '🌿', R: '🏔️', B: '🥚', N: '🦏', A: '🌄', C: '🪨', P: '🌱',
        k: '🦖', q: '🦷', r: '🌋', b: '🦴', n: '🐊', a: '🌑', c: '🔥', p: '🦂',
    },
    piratesVsNavy: {
        K: '👑', Q: '⚓', R: '🚢', B: '🔭', N: '🐴', A: '🌟', C: '🎖️', P: '🪖',
        k: '☠️', q: '🦜', r: '🏴‍☠️', b: '🗺️', n: '🦈', a: '🌑', c: '⚔️', p: '🗡️',
    },
    ninjaVsSamurai: {
        K: '🏯', Q: '🌸', R: '⛩️', B: '🎋', N: '🐴', A: '☀️', C: '🛡️', P: '🌺',
        k: '🥷', q: '🌑', r: '🗡️', b: '💨', n: '🐍', a: '🌙', c: '⚔️', p: '🌑',
    },
};
let currentPieceSet = 'emoji';
let current3DRenderStyle = 'staunton';

function normalize3DRenderStyle(style) {
    const raw = String(style || '').trim().toLowerCase();
    if (BOARD3D_RENDER_STYLES.includes(raw)) return raw;
    if (typeof window.Board3D === 'function' && typeof window.Board3D.normalizeRenderStyle === 'function') {
        const normalized = window.Board3D.normalizeRenderStyle(raw);
        if (BOARD3D_RENDER_STYLES.includes(normalized)) return normalized;
    }
    return 'staunton';
}

function getCurrent3DRenderStyle() {
    return normalize3DRenderStyle(current3DRenderStyle);
}

function apply3DRenderStyle(style, options) {
    const normalized = normalize3DRenderStyle(style);
    current3DRenderStyle = normalized;
    document.body.dataset.board3dStyle = normalized;

    document.querySelectorAll('[data-3d-style]').forEach(el => {
        el.classList.toggle('theme-active', el.getAttribute('data-3d-style') === normalized);
    });

    try { localStorage.setItem(BOARD3D_RENDER_STYLE_KEY, normalized); } catch (e) {}

    if (options && options.skipRender) return;

    if (board3D && typeof board3D.setRenderStyle === 'function') {
        board3D.setRenderStyle(normalized);
    }

    if (boardMode === '3d') {
        syncBoardVisibility();
    }
}

function applyTheme(theme) {
    THEMES.forEach(t => document.body.classList.remove(t));
    document.body.classList.add(theme);

    document.querySelectorAll('[data-theme]').forEach(el => {
        el.classList.toggle('theme-active', el.dataset.theme === theme);
    });

    try { localStorage.setItem('bbjs-theme', theme); } catch(e) {}

    // Notify renderers that rely on CSS variables (e.g. 3D background/squares).
    window.dispatchEvent(new Event('chess2:theme-changed'));

    // Classic set uses theme-aware glyph mapping, so repaint when theme changes.
    if (currentPieceSet === 'classic') {
        if (currentGameState) {
            paintPosition(currentBoardFEN);
        }
        renderTrainingView();
    }
}

function getPieceSymbol(fenChar) {
    const activeSet = PIECE_SETS[currentPieceSet] || PIECE_SETS.emoji;
    return activeSet[fenChar] || PIECE_SETS.emoji[fenChar] || '';
}

function applyPieceSet(pieceSet, options) {
    const normalized = Object.prototype.hasOwnProperty.call(PIECE_SETS, pieceSet) ? pieceSet : 'emoji';
    currentPieceSet = normalized;
    document.body.dataset.pieceSet = normalized;

    document.querySelectorAll('[data-piece-set]').forEach(el => {
        el.classList.toggle('theme-active', el.dataset.pieceSet === normalized);
    });

    try { localStorage.setItem(PIECE_SET_KEY, normalized); } catch(e) {}

    if (options && options.skipRender) return;
    if (currentGameState) {
        paintPosition(currentBoardFEN);
    }
    renderTrainingView();
}

try {
    const saved = localStorage.getItem('bbjs-theme');
    if (saved && THEMES.includes(saved)) applyTheme(saved);
    else applyTheme('theme-classic');
} catch(e) {
    applyTheme('theme-classic');
}

try {
        const savedPieceSet = localStorage.getItem(PIECE_SET_KEY);
        applyPieceSet(savedPieceSet && PIECE_SETS[savedPieceSet] ? savedPieceSet : 'emoji', { skipRender: true });
} catch (e) {
        applyPieceSet('emoji', { skipRender: true });
}

try {
    const saved3DStyle = localStorage.getItem(BOARD3D_RENDER_STYLE_KEY);
    apply3DRenderStyle(saved3DStyle || 'staunton', { skipRender: true });
} catch (e) {
    apply3DRenderStyle('staunton', { skipRender: true });
}

function createPiece(fenChar) {
    const symbol = getPieceSymbol(fenChar);
    if (!symbol) return null;

    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.dataset.piece = fenChar;
    piece.dataset.color = fenChar === fenChar.toUpperCase() ? 'white' : 'black';
    piece.textContent = symbol;
    return piece;
}

// ============================
//   BOARD CONSTANTS
// ============================
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const RANKS = "87654321";
const FILES = "abcdefgh";
let currentBoardFEN = START_FEN;
let board3D = null;
let boardMode = '2d';
let boardFlipped = false;
let boardSizingFrame = 0;
let boardResizeBound = false;
let boardResizeObserver = null;
let currentGameState = null;
let selectedSquare = null;
let legalTargets = [];
let lastMoveSquares = [];
let moveHistory = [];
let currentMoveIndex = -1;
let currentEngineInfo = null;
let playView = null;
let analysisView = null;
let loadSaveView = null;
let toolsView = null;
let openingsView = null;
let gameController = null;
let diagnosticsPreview = null;
let currentOpeningState = null;
let requestedToolsPanel = 'perft';

window.addEventListener('chess2:theme-changed', () => {
    if (board3D && typeof board3D.refreshTheme === 'function') {
        board3D.refreshTheme();
    }
});

const PLAY_CONFIG = {
    humanColor: 'white',
    engineColor: 'black',
    engineDelayMs: 260,
    searchDepth: 2,
};
const PLAY_MODE_CONFIGS = {
    play: {
        humanColors: ['white'],
        engineColors: ['black'],
    },
    'play-online': {
        humanColors: ['white'],
        engineColors: [],
    },
    'play-e2e': {
        humanColors: [],
        engineColors: ['white', 'black'],
    },
    'play-human': {
        humanColors: ['white', 'black'],
        engineColors: [],
    },
};
let currentPlayMode = 'play';
let engineThinkTimer = null;
let engineThinking = false;
let playEngine = null;
let engineRequestId = 0;
let multiplayerClient = null;
let multiplayerState = createDefaultMultiplayerState();
let requestedMultiplayerAction = null;
let requestedMultiplayerSection = 'live';
let requestedMultiplayerChatScope = 'auto';
let requestedSettingsSection = 'time-controls';
let requestedAnalysisSection = 'board';
let requestedOpeningsSection = 'explorer';
let requestedTrainingSection = 'tactics';
let requestedPuzzleSection = 'daily-puzzle';
let requestedVariantSection = 'chess960';
let trainingRuntime = null;
let puzzleRuntime = null;
let puzzleTimer = null;
let analysisInsights = createEmptyAnalysisInsights();
let analysisActionFeedback = { message: '', tone: '' };
const GAME_OPTIONS_KEY = 'chess2.game-options';
const MULTIPLAYER_CHAT_DRAFT_KEY = 'chess2.multiplayer.chat-draft';
const TRAINING_HISTORY_KEY = 'chess2.training-history';
const PUZZLE_LIBRARY_KEY = 'chess2.puzzle-library';
const PUZZLE_PROGRESS_KEY = 'chess2.puzzle-progress';
const GAME_OPTION_DEFAULTS = {
    timeControl: 600,
    bonusMode: 'increment',
    bonusSeconds: 5,
    handicap: 'none',
};
const HANDICAP_PRESETS = [
    { value: 'none', label: 'No handicap', description: 'Standard starting position.' },
    { value: 'white-pawn-odds', label: 'White gives pawn odds', removeSquare: 'f2', description: 'White starts without the f-pawn.' },
    { value: 'white-knight-odds', label: 'White gives knight odds', removeSquare: 'b1', description: 'White starts without the queenside knight.' },
    { value: 'white-bishop-odds', label: 'White gives bishop odds', removeSquare: 'c1', description: 'White starts without the queenside bishop.' },
    { value: 'white-rook-odds', label: 'White gives rook odds', removeSquare: 'a1', description: 'White starts without the queenside rook.' },
    { value: 'white-queen-odds', label: 'White gives queen odds', removeSquare: 'd1', description: 'White starts without the queen.' },
    { value: 'black-pawn-odds', label: 'Black gives pawn odds', removeSquare: 'f7', description: 'Black starts without the f-pawn.' },
    { value: 'black-knight-odds', label: 'Black gives knight odds', removeSquare: 'b8', description: 'Black starts without the queenside knight.' },
    { value: 'black-bishop-odds', label: 'Black gives bishop odds', removeSquare: 'c8', description: 'Black starts without the queenside bishop.' },
    { value: 'black-rook-odds', label: 'Black gives rook odds', removeSquare: 'a8', description: 'Black starts without the queenside rook.' },
    { value: 'black-queen-odds', label: 'Black gives queen odds', removeSquare: 'd8', description: 'Black starts without the queen.' },
];
let gameOptions = loadGameOptions();
let activeLocalGameOptions = createInactiveLocalGameOptions();
let localClockState = createIdleClockState();
let localClockTimer = null;
let multiplayerChatDraft = loadMultiplayerChatDraft();
let multiplayerClubDraft = { name: '', description: '' };
let multiplayerTournamentDraft = { name: '', description: '', clubId: '' };
const OPENINGS_FALLBACK_STATE = {
    line: [],
    sanLine: [],
    recognized: null,
    nextMoves: [],
    catalogSize: 0,
    explorerBookSize: 0,
};
const OPENINGS_PROXY = {
    getOpeningState(payload) {
        const openings = window.Chess2Openings;
        if (openings && typeof openings.getOpeningState === 'function') {
            return openings.getOpeningState(payload);
        }
        return Object.assign({}, OPENINGS_FALLBACK_STATE);
    },
    getEcoCodeCatalog() {
        const openings = window.Chess2Openings;
        if (openings && typeof openings.getEcoCodeCatalog === 'function') {
            return openings.getEcoCodeCatalog();
        }
        return [];
    },
    getExplorerBookCatalog() {
        const openings = window.Chess2Openings;
        if (openings && typeof openings.getExplorerBookCatalog === 'function') {
            return openings.getExplorerBookCatalog();
        }
        return [];
    },
};
let openingsCatalogWarmupScheduled = false;

const OPENINGS_SECTION_LABELS = {
    explorer: 'Opening Explorer',
    eco: 'ECO Codes',
    book: 'Polyglot Book',
    stats: 'Win/Draw/Loss Stats',
};

const ANALYSIS_SECTION_LABELS = {
    board: 'Analysis Board',
    eval: 'Evaluation Bar',
    pv: 'PV Display',
    stats: 'Search Stats',
    threat: 'Threat Mode',
    hint: 'Hint Mode',
    logs: 'Search Logs',
};

const TRAINING_SECTION_LABELS = {
    tactics: 'Tactics Trainer',
    endgame: 'Endgame Trainer',
    guess: 'Guess the Move',
    blindfold: 'Blindfold Mode',
    visualization: 'Visualization Drills',
    knight: 'Knight Vision',
    memory: 'Memory Mode',
};

const VARIANT_SECTION_LABELS = {
    chess960: 'Chess960',
    'king-hill': 'King of the Hill',
    'three-check': 'Three-Check',
    horde: 'Horde',
    atomic: 'Atomic',
    crazyhouse: 'Crazyhouse',
    bughouse: 'Bughouse',
    capablanca: 'Capablanca / Gothic',
    'custom-variants': 'Custom Variants',
};

const VARIANT_SECTION_DETAILS = {
    chess960: {
        title: 'Chess960',
        summary: 'Randomized back-rank setup with bishops on opposite colors and the king placed between the rooks.',
        rules: 'Castling ends on the orthodox target squares, but the start squares depend on the generated lineup.',
        support: 'Preview-ready',
        supportNote: 'The board can load a representative Chess960 starting layout, but full Chess960 castling rules are not enforced yet.',
        previewFEN: 'bnrqkrnb/pppppppp/8/8/8/8/PPPPPPPP/BNRQKRNB w KQkq - 0 1',
        primaryRoute: 'play',
        primaryAction: 'Load Sample Setup',
    },
    'king-hill': {
        title: 'King of the Hill',
        summary: 'Standard starting position, but you also win by bringing your king to e4, d4, e5, or d5.',
        rules: 'Checkmate still wins; central-king promotion to the hill is an extra victory condition.',
        support: 'Board-preview only',
        supportNote: 'The current board can load the standard setup, but hill-win detection is not wired into game-over logic yet.',
        previewFEN: START_FEN,
        primaryRoute: 'play',
        primaryAction: 'Load Standard Setup',
    },
    'three-check': {
        title: 'Three-Check',
        summary: 'Standard setup where delivering a third check wins the game immediately.',
        rules: 'Normal checkmate still counts, but checks are tracked as a separate win condition.',
        support: 'Fully playable',
        supportNote: 'Three-check counters are now tracked in the local controller, so a third delivered check ends the game immediately.',
        previewFEN: START_FEN,
        primaryRoute: 'play',
        primaryAction: 'Start Three-Check Game',
    },
    horde: {
        title: 'Horde',
        summary: 'One side fields a mass of pawns against the normal black army in an imbalanced survival battle.',
        rules: 'The horde side wins by eliminating black; black wins by capturing every horde pawn.',
        support: 'Sample-shell preview',
        supportNote: 'This workspace loads a representative horde shell for study, not a full rules-complete Horde implementation.',
        previewFEN: 'rnbqkbnr/pppppppp/8/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP w - - 0 1',
        primaryRoute: 'analysis',
        primaryAction: 'Load Sample Shell',
    },
    atomic: {
        title: 'Atomic',
        summary: 'Captures explode adjacent non-pawn pieces and kings may not capture into blast range.',
        rules: 'Check patterns change because explosions, not only direct attack, define king safety.',
        support: 'Board-preview only',
        supportNote: 'You can open the standard board as a sandbox, but explosion rules and atomic legality are not implemented.',
        previewFEN: START_FEN,
        primaryRoute: 'analysis',
        primaryAction: 'Open Sandbox Board',
    },
    crazyhouse: {
        title: 'Crazyhouse',
        summary: 'Captured pieces switch sides and may be dropped back onto empty squares on later turns.',
        rules: 'Drops create the core tactical layer, so reserve tracking is as important as the board position.',
        support: 'Pocket-enabled local play',
        supportNote: 'Reserve pockets and legal drops are now available in the local board controller. Promotion captures return as pawns, matching Crazyhouse reserve rules.',
        previewFEN: START_FEN,
        primaryRoute: 'play',
        primaryAction: 'Start Crazyhouse Game',
    },
    bughouse: {
        title: 'Bughouse',
        summary: 'Team-style drop-chess variant derived from bughouse-style reserve play across linked boards.',
        rules: 'Captured pieces transfer into a partner reserve, so the variant needs reserve state and multi-board coordination.',
        support: 'Pocket-enabled local sandbox',
        supportNote: 'The local board now exposes reserve pockets and drop logic for Bughouse-style experimentation. Linked partner-board transfer is still a separate multiplayer extension.',
        previewFEN: START_FEN,
        primaryRoute: 'play',
        primaryAction: 'Start Bughouse Sandbox',
    },
    capablanca: {
        title: 'Capablanca / Gothic',
        summary: 'A 10x8 chess family that adds two extra pieces, usually the chancellor and archbishop, to widen opening theory.',
        rules: 'Because the board is 10 files wide, piece placement, move generation, notation, and castling all need dedicated support.',
        support: '10x8 playable board',
        supportNote: 'The 2D board, local controller, notation, and castling pathing now support 10x8 Capablanca-family positions with archbishops and chancellors.',
        previewFEN: 'rnabqkcbnr/pppppppppp/10/10/10/10/PPPPPPPPPP/RNABQKCBNR w KQkq - 0 1 [variant=capablanca;files=abcdefghij;ranks=87654321;setup=capablanca]',
        primaryRoute: 'play',
        primaryAction: 'Start Capablanca Game',
        variantSetup: 'capablanca',
    },
    'custom-variants': {
        title: 'Custom Variants',
        summary: 'A staging area for house rules, bespoke starting positions, and future variant definitions.',
        rules: 'Use FEN loading for position experiments today; full custom rule authoring still needs dedicated schema and controller hooks.',
        support: 'Setup workspace',
        supportNote: 'This route sends you to tools that already exist in the app, especially FEN loading and analysis, instead of promising unsupported rule engines.',
        previewFEN: '',
        primaryRoute: 'fen-load',
        primaryAction: 'Open FEN Loader',
    },
};

const TRAINING_DIFFICULTY_LABELS = {
    all: 'All',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
};

const PUZZLE_SECTION_LABELS = {
    'daily-puzzle': 'Daily Puzzle',
    'puzzle-rush': 'Puzzle Rush',
    'puzzle-battle': 'Puzzle Battle',
    'thematic-puzzles': 'Thematic Puzzles',
    'puzzle-import': 'Import Puzzle Database',
};

const PUZZLE_SECTION_DETAILS = {
    'daily-puzzle': {
        title: 'Daily Puzzle',
        summary: 'A once-per-day featured tactic slot with streak tracking, quick solving, and a short review loop.',
        format: 'Single featured position with retry, hint, and solution reveal flow.',
        support: 'Playable',
        supportNote: 'Daily Puzzle now opens a live board-backed solve session with retry, hint, reveal, and daily streak persistence.',
        primaryAction: 'Start Daily Puzzle',
        primaryRoute: 'daily-puzzle',
        secondaryAction: 'Open Puzzle Import',
        secondaryRoute: 'puzzle-import',
    },
    'puzzle-rush': {
        title: 'Puzzle Rush',
        summary: 'Timed puzzle solving focused on speed, streak extension, and fast tactical recognition.',
        format: 'Timed sequence of short tactical prompts with score and pace emphasis.',
        support: 'Playable',
        supportNote: 'Puzzle Rush now launches a timed queue with live score tracking, miss handling, and persisted best-score history.',
        primaryAction: 'Start Puzzle Rush',
        primaryRoute: 'puzzle-rush',
        secondaryAction: 'Open Puzzle Import',
        secondaryRoute: 'puzzle-import',
    },
    'puzzle-battle': {
        title: 'Puzzle Battle',
        summary: 'Head-to-head puzzle racing built around shared rounds, score comparison, and live pressure.',
        format: 'Competitive puzzle rounds with synchronized starts and side-by-side scoring.',
        support: 'Playable',
        supportNote: 'Puzzle Battle now runs as a solo-vs-ghost race with your score tracked against a local target pace.',
        primaryAction: 'Start Puzzle Battle',
        primaryRoute: 'puzzle-battle',
        secondaryAction: 'Open Puzzle Import',
        secondaryRoute: 'puzzle-import',
    },
    'thematic-puzzles': {
        title: 'Thematic Puzzles',
        summary: 'Puzzle sets grouped by opening family, tactical motif, or endgame theme for targeted study.',
        format: 'Curated puzzle collections filtered by theme, opening, or tactical pattern.',
        support: 'Playable',
        supportNote: 'Thematic Puzzles now starts a tagged puzzle session that prefers imported themes when they are available.',
        primaryAction: 'Start Thematic Session',
        primaryRoute: 'thematic-puzzles',
        secondaryAction: 'Open Puzzle Import',
        secondaryRoute: 'puzzle-import',
    },
    'puzzle-import': {
        title: 'Import Puzzle Database',
        summary: 'Bring external puzzle collections into the app so training, rush, and thematic modes can share one source of truth.',
        format: 'File import, validation, tagging, and persistence pipeline for puzzle datasets.',
        support: 'Import ready',
        supportNote: 'The importer now accepts JSON, JSONL, CSV, TSV, and plain text puzzle files with FEN plus UCI solution fields, then stores them in local storage.',
        primaryAction: 'Import Puzzle File',
        primaryRoute: 'puzzle-import',
        secondaryAction: 'Start Daily Puzzle',
        secondaryRoute: 'daily-puzzle',
    },
};

const BUILTIN_PUZZLE_LIBRARY = [
    {
        id: 'builtin-daily-quiet-king-walk',
        title: 'Quiet King Walk',
        fen: '7k/8/8/8/4KQ2/8/8/8 w - - 0 1',
        solution: ['f4e5', 'h8g8', 'e4f5', 'g8f7', 'f5g5', 'f7g8', 'e5e7', 'g8h8', 'g5g6', 'h8g8', 'e7d8'],
        theme: 'Mate Nets',
        difficulty: 'hard',
        source: 'built-in',
        sections: ['daily-puzzle', 'thematic-puzzles'],
        description: 'Find the forcing king walk that closes the net.',
    },
    {
        id: 'builtin-rush-back-rank-white',
        title: 'Back Rank Collapse',
        fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
        solution: ['d1d8'],
        theme: 'Mate in One',
        difficulty: 'easy',
        source: 'built-in',
        sections: ['daily-puzzle', 'puzzle-rush', 'puzzle-battle', 'thematic-puzzles'],
        description: 'Finish the back-rank mate immediately.',
    },
    {
        id: 'builtin-rush-back-rank-black',
        title: 'Black Back Rank',
        fen: '3r2k1/8/8/8/8/8/5PPP/6K1 b - - 0 1',
        solution: ['d8d1'],
        theme: 'Mate in One',
        difficulty: 'easy',
        source: 'built-in',
        sections: ['puzzle-rush', 'puzzle-battle', 'thematic-puzzles'],
        description: 'Spot the immediate rook mate for black.',
    },
    {
        id: 'builtin-promotion-check',
        title: 'Promote With Tempo',
        fen: '7k/P7/8/8/8/8/8/K7 w - - 0 1',
        solution: ['a7a8q'],
        theme: 'Promotion',
        difficulty: 'easy',
        source: 'built-in',
        sections: ['daily-puzzle', 'puzzle-rush', 'thematic-puzzles'],
        description: 'Convert the pawn with the strongest promotion move.',
    },
    {
        id: 'builtin-rush-rg1',
        title: 'First Move Of The Net',
        fen: '5rk1/5p1p/5p1B/8/8/8/8/K6R w - - 0 1',
        solution: ['h1g1'],
        theme: 'Mating Net',
        difficulty: 'medium',
        source: 'built-in',
        sections: ['puzzle-rush', 'puzzle-battle', 'thematic-puzzles'],
        description: 'Start the forcing rook lift that traps the king.',
    },
    {
        id: 'builtin-rush-rxg7',
        title: 'Deflection Sacrifice',
        fen: '5rk1/5ppp/8/8/8/8/1B6/K5R1 w - - 0 1',
        solution: ['g1g7'],
        theme: 'Sacrifice',
        difficulty: 'medium',
        source: 'built-in',
        sections: ['puzzle-rush', 'puzzle-battle', 'thematic-puzzles'],
        description: 'Find the sacrifice that starts the forced finish.',
    },
    {
        id: 'builtin-theme-queen-lift',
        title: 'Quiet Queen Lift',
        fen: '7k/8/8/8/8/4K3/4Q3/8 w - - 0 1',
        solution: ['e2g4', 'h8h7', 'e3d4', 'h7h8', 'd4e5', 'h8h7', 'g4h5', 'h7g7', 'e5e6', 'g7g8', 'e6f6', 'g8f8', 'h5f7'],
        theme: 'Quiet Moves',
        difficulty: 'hard',
        source: 'built-in',
        sections: ['daily-puzzle', 'thematic-puzzles'],
        description: 'Use a quiet queen lift to build the mating box.',
    },
];

const TRAINING_DIFFICULTY_DEFAULTS = {
    tactics: ['easy', 'easy', 'medium', 'hard'],
    endgame: ['easy', 'medium', 'medium', 'hard'],
    guess: ['easy', 'medium', 'medium', 'hard'],
    blindfold: ['medium', 'medium', 'hard', 'hard'],
    visualization: ['easy', 'medium', 'medium', 'hard'],
    knight: ['easy', 'easy', 'medium', 'hard'],
    memory: ['easy', 'medium', 'medium', 'hard'],
};

const TRAINING_SCHEDULER_SETTINGS = {
    easy: { firstInterval: 3, multiplier: 2.6 },
    medium: { firstInterval: 2, multiplier: 2.1 },
    hard: { firstInterval: 1, multiplier: 1.7 },
};

const TRAINING_DRILL_CACHE = {};

const TRAINING_SECTION_DETAILS = {
    tactics: {
        title: 'Tactics Trainer',
        description: 'Solve tactical shots from curated positions and focus on forcing moves, calculation, and pattern recall.',
        focus: 'Random puzzles, hints, retries, puzzle streaks, and explanation-ready solving flow.',
        format: 'Short calculation exercises with one critical tactical solution.',
        primaryAction: 'Open Play Board',
        primaryRoute: 'play',
    },
    endgame: {
        title: 'Endgame Trainer',
        description: 'Practice reduced-material positions such as KPK and KRK with quick restart and repetition-friendly drills.',
        focus: 'Endgame technique, conversion, defensive resources, and tablebase-style rehearsal shells.',
        format: 'Preset endgame positions and side-to-move training snapshots.',
        primaryAction: 'Open Analysis Board',
        primaryRoute: 'analysis',
    },
    guess: {
        title: 'Guess the Move',
        description: 'Compare your choice against strong move selections from model lines and improve candidate-move discipline.',
        focus: 'GM-game style move selection, comparison feedback, and line-by-line review.',
        format: 'Position prompt, candidate move choice, and reveal flow.',
        primaryAction: 'Open Analysis Board',
        primaryRoute: 'analysis',
    },
    blindfold: {
        title: 'Blindfold Mode',
        description: 'Train without visible pieces and rely on coordinates, move memory, and internal board visualization.',
        focus: 'No-piece display, coordinate awareness, and move-sequence recall.',
        format: 'Hidden-board practice using the current board shell and move list.',
        primaryAction: 'Open Play Board',
        primaryRoute: 'play-human',
    },
    visualization: {
        title: 'Visualization Drills',
        description: 'Work on board memory and piece-tracking by replaying or reconstructing piece locations in your head.',
        focus: 'Board memory, square color recall, and piece-tracking exercises.',
        format: 'Prompt-driven mental board exercises using the shared board workspace.',
        primaryAction: 'Open Analysis Board',
        primaryRoute: 'analysis',
    },
    knight: {
        title: 'Knight Vision',
        description: 'Practice knight patterns, forks, and route calculation through repeated square-target drills.',
        focus: 'Knight move geometry, color-complex awareness, and pattern speed.',
        format: 'Square targeting and pattern repetition drills.',
        primaryAction: 'Open Play Board',
        primaryRoute: 'play-human',
    },
    memory: {
        title: 'Memory Mode',
        description: 'Study a position, hide it, and then reconstruct what changed from memory.',
        focus: 'Recall positions, compare reconstructed lines, and reinforce board retention.',
        format: 'Position preview, hide/reveal cycle, and recall validation shell.',
        primaryAction: 'Open Load / Save',
        primaryRoute: 'fen-load',
    },
};

const TRAINING_DRILLS = {
    tactics: [
        {
            fen: '4k3/8/8/3q4/8/8/3Q4/4K3 w - - 0 1',
            prompt: 'White to move. Win material immediately.',
            bestMove: 'd2d5',
            hint: 'Start by checking every direct capture on undefended enemy pieces.',
            theme: 'Loose-piece punishment',
            explanation: 'Qxd5 removes the loose queen at once.',
        },
        {
            fen: '4k3/8/8/4r3/8/8/4Q3/4K3 w - - 0 1',
            prompt: 'White to move. Eliminate the central rook.',
            bestMove: 'e2e5',
            hint: 'A queen capture on the same file wins material cleanly.',
            theme: 'Straight-line capture',
            explanation: 'Qxe5 wins the rook cleanly because the file is open.',
        },
        {
            fen: '4k3/8/8/8/4r3/8/4R3/4K3 w - - 0 1',
            prompt: 'White to move. Use the rook to win material right away.',
            bestMove: 'e2e4',
            hint: 'Your rook can capture upward in one move.',
            theme: 'Recapture tactic',
            explanation: 'Rxe4 removes the active rook and simplifies into a won ending.',
        },
        {
            fen: '4k3/8/8/8/8/2b5/3Q4/4K3 w - - 0 1',
            prompt: 'White to move. Remove the minor piece immediately.',
            bestMove: 'd2c3',
            hint: 'The queen can step diagonally to take the bishop.',
            theme: 'Diagonal cleanup',
            explanation: 'Qxc3 wins the bishop and leaves black without compensation.',
        },
    ],
    endgame: [
        {
            fen: '8/8/8/8/8/2k5/8/R3K3 w Q - 0 1',
            prompt: 'White to move. Give the active rook check that cuts the king off.',
            bestMove: 'a1c1',
            hint: 'Centralize the rook with check instead of drifting sideways.',
            theme: 'Rook activity',
            explanation: 'Rc1+ checks from the side and keeps the rook centralized.',
        },
        {
            fen: '8/8/8/8/8/3k4/8/3RK3 w - - 0 1',
            prompt: 'White to move. Step the rook up with check.',
            bestMove: 'd1d2',
            hint: 'Bring the rook closer while keeping the check.',
            theme: 'Technique check',
            explanation: 'Rd2+ improves the rook and forces the king to react.',
        },
        {
            fen: '8/8/8/8/3k4/8/R3K3/8 w - - 0 1',
            prompt: 'White to move. Centralize the rook with check from the second rank.',
            bestMove: 'a2d2',
            hint: 'Move the rook horizontally until it checks along the file.',
            theme: 'Cutoff technique',
            explanation: 'Rd2+ checks and immediately improves rook placement in the ending.',
        },
        {
            fen: '8/8/8/3k4/8/8/3RK3/8 w - - 0 1',
            prompt: 'White to move. Lift the rook to the fifth rank with check.',
            bestMove: 'd2d5',
            hint: 'A vertical rook lift gives check and seizes space.',
            theme: 'Active rook lift',
            explanation: 'Rd5+ is the active rook move that checks and takes control of the board.',
        },
    ],
    guess: [
        {
            fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
            prompt: 'White to move in the Italian Two Knights. Find the principled attacking continuation.',
            bestMove: 'f3g5',
            choices: ['d2d3', 'b1c3', 'f3g5', 'e1g1'],
            hint: 'The sharpest move increases pressure on f7 immediately.',
            theme: 'Opening initiative',
            explanation: 'Ng5 is the direct attacking move that immediately asks black concrete questions on f7.',
        },
        {
            fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4',
            prompt: 'White to move in the Four Knights. Choose the classical developing move.',
            bestMove: 'f1b5',
            choices: ['d2d4', 'f1b5', 'a2a3', 'h2h3'],
            hint: 'The most classical option is a bishop development move, not a pawn push.',
            theme: 'Classical development',
            explanation: 'Bb5 enters the Four Knights Spanish and keeps development purposeful.',
        },
        {
            fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 2 3',
            prompt: 'Black to move in the Ruy Lopez. Pick the standard way to question the bishop.',
            bestMove: 'a7a6',
            choices: ['a7a6', 'g8f6', 'd7d6', 'f8c5'],
            hint: 'The main line asks the bishop a direct question on move three.',
            theme: 'Main-line response',
            explanation: '...a6 is the Morphy Defense and the most standard way to challenge Bb5.',
        },
        {
            fen: 'rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
            prompt: 'White to move in the Queen’s Gambit Declined structure. Choose the natural pin.',
            bestMove: 'c1g5',
            choices: ['c1g5', 'g1f3', 'e2e3', 'c4d5'],
            hint: 'Develop the bishop actively before closing it in.',
            theme: 'QGD development',
            explanation: 'Bg5 is the classical pin that fits the structure and develops with purpose.',
        },
    ],
    blindfold: [
        {
            fen: '4k3/8/8/3q4/8/8/3Q4/4K3 w - - 0 1',
            prompt: 'Blindfold drill. White to move and win material without revealing the pieces.',
            bestMove: 'd2d5',
            hint: 'Think of the direct queen capture in the center.',
            theme: 'Blindfold material win',
            explanation: 'The same queen capture works here, but you have to track it from memory.',
        },
        {
            fen: '8/8/8/8/8/2k5/8/R3K3 w Q - 0 1',
            prompt: 'Blindfold drill. Find the rook check from the hidden board.',
            bestMove: 'a1c1',
            hint: 'Centralize the rook on the first rank with check.',
            theme: 'Hidden-board rook check',
            explanation: 'Rc1+ is the clean checking move even when the board surface is hidden.',
        },
        {
            fen: '4k3/8/8/8/4r3/8/4R3/4K3 w - - 0 1',
            prompt: 'Blindfold drill. Win the rook using only square memory.',
            bestMove: 'e2e4',
            hint: 'Your rook can travel straight up the file to capture.',
            theme: 'Blindfold recapture',
            explanation: 'Rxe4 is still the clean answer, but you have to calculate without visible pieces.',
        },
        {
            fen: '8/8/8/3k4/8/8/3RK3/8 w - - 0 1',
            prompt: 'Blindfold drill. Find the rook lift that checks from the fifth rank.',
            bestMove: 'd2d5',
            hint: 'Move the rook straight upward to deliver check.',
            theme: 'Blindfold rook lift',
            explanation: 'Rd5+ is the active rook-lift check, found from memory rather than sight.',
        },
    ],
    visualization: [
        {
            fen: '4k3/8/8/3q4/8/8/3Q4/4K3 w - - 0 1',
            prompt: 'Study the board, hide it, then identify the piece on d5.',
            targetSquare: 'd5',
            answer: 'q',
            choices: ['q', 'Q', 'k', 'empty'],
            hint: 'The target square holds the most valuable black piece in the position.',
            theme: 'Central-piece recall',
            explanation: 'The black queen was sitting on d5.',
        },
        {
            fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
            prompt: 'Study the opening setup, hide it, then identify the piece on c6.',
            targetSquare: 'c6',
            answer: 'n',
            choices: ['n', 'b', 'p', 'empty'],
            hint: 'The square is occupied by a developed black minor piece.',
            theme: 'Opening pattern memory',
            explanation: 'Black already developed the queenside knight to c6.',
        },
        {
            fen: '4k3/8/8/8/4r3/8/4R3/4K3 w - - 0 1',
            prompt: 'Study the mini-position, hide it, then identify the piece on e2.',
            targetSquare: 'e2',
            answer: 'R',
            choices: ['R', 'r', 'K', 'empty'],
            hint: 'It is a white heavy piece, not the king.',
            theme: 'File memory',
            explanation: 'White’s rook begins on e2 in this drill position.',
        },
        {
            fen: '8/8/8/8/8/2N5/8/8 w - - 0 1',
            prompt: 'Study the board, hide it, then identify what is on e4.',
            targetSquare: 'e4',
            answer: 'empty',
            choices: ['N', 'n', 'empty', 'K'],
            hint: 'Only one piece is on the board, and it is not on the target square.',
            theme: 'Empty-square recall',
            explanation: 'The only piece is the knight on c3, so e4 is empty.',
        },
    ],
    knight: [
        {
            fen: '8/8/8/8/4N3/8/8/8 w - - 0 1',
            prompt: 'Click every square attacked by the knight on e4.',
            startSquare: 'e4',
            targets: ['d2', 'f2', 'c3', 'g3', 'c5', 'g5', 'd6', 'f6'],
            hint: 'Think two squares one way and one square sideways.',
            theme: 'Central knight net',
            explanation: 'A centralized knight hits eight squares in the familiar L-pattern.',
        },
        {
            fen: '8/8/8/8/8/2N5/8/8 w - - 0 1',
            prompt: 'Click every square attacked by the knight on c3.',
            startSquare: 'c3',
            targets: ['b1', 'd1', 'a2', 'e2', 'a4', 'e4', 'b5', 'd5'],
            hint: 'Start with the two squares on the first rank, then mirror upward.',
            theme: 'Balanced knight fan',
            explanation: 'From c3 the knight fans out to eight balanced target squares.',
        },
        {
            fen: '8/8/8/5N2/8/8/8/8 w - - 0 1',
            prompt: 'Click every square attacked by the knight on f5.',
            startSquare: 'f5',
            targets: ['d4', 'h4', 'd6', 'h6', 'e3', 'g3', 'e7', 'g7'],
            hint: 'From f5, look one step inward and one step outward on both sides.',
            theme: 'Kingside knight net',
            explanation: 'The knight on f5 reaches eight squares spread across both wings.',
        },
        {
            fen: '8/1N6/8/8/8/8/8/8 w - - 0 1',
            prompt: 'Click every square attacked by the knight on b7.',
            startSquare: 'b7',
            targets: ['a5', 'c5', 'd6', 'd8'],
            hint: 'Edge knights have fewer legal targets than central knights.',
            theme: 'Edge-knight reduction',
            explanation: 'From b7 the knight only has four legal attacks because the board edge removes the rest.',
        },
    ],
    memory: [
        {
            fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
            prompt: 'Memorize the position, hide it, then recall what sits on f3.',
            targetSquare: 'f3',
            answer: 'N',
            choices: ['N', 'B', 'P', 'empty'],
            hint: 'A white minor piece has already developed there.',
            theme: 'Piece-location recall',
            explanation: 'White has already developed a knight to f3.',
        },
        {
            fen: '4k3/8/8/4r3/8/8/4Q3/4K3 w - - 0 1',
            prompt: 'Memorize the mini-position, hide it, then recall what sits on e5.',
            targetSquare: 'e5',
            answer: 'r',
            choices: ['r', 'q', 'k', 'empty'],
            hint: 'The loose black heavy piece is on that square.',
            theme: 'Threat memory',
            explanation: 'The black rook on e5 is the loose piece in the drill.',
        },
        {
            fen: '8/8/8/8/8/2N5/8/8 w - - 0 1',
            prompt: 'Memorize the simple board, hide it, then recall what sits on c3.',
            targetSquare: 'c3',
            answer: 'N',
            choices: ['N', 'n', 'K', 'empty'],
            hint: 'It is the only piece on the board.',
            theme: 'Single-piece board',
            explanation: 'The lone white knight is on c3.',
        },
        {
            fen: '8/8/8/3k4/8/8/3RK3/8 w - - 0 1',
            prompt: 'Memorize the endgame shell, hide it, then recall what sits on d5.',
            targetSquare: 'd5',
            answer: 'k',
            choices: ['k', 'K', 'r', 'empty'],
            hint: 'The black king is already centralized.',
            theme: 'Endgame king memory',
            explanation: 'Black’s king is on d5 in this reduced-material endgame.',
        },
    ],
};

function getTrainingSections() {
    return Object.keys(TRAINING_SECTION_LABELS);
}

function getPuzzleSections() {
    return Object.keys(PUZZLE_SECTION_LABELS);
}

function getTrainingDifficultyKeys() {
    return Object.keys(TRAINING_DIFFICULTY_LABELS);
}

function getTrainingDifficultyLabel(difficulty) {
    return TRAINING_DIFFICULTY_LABELS[difficulty] || TRAINING_DIFFICULTY_LABELS.medium;
}

function getTrainingDifficultyForIndex(section, index) {
    const defaults = TRAINING_DIFFICULTY_DEFAULTS[section] || TRAINING_DIFFICULTY_DEFAULTS.tactics;
    return defaults[index] || defaults[defaults.length - 1] || 'medium';
}

function getTrainingSchedulerSettings(difficulty) {
    return TRAINING_SCHEDULER_SETTINGS[difficulty] || TRAINING_SCHEDULER_SETTINGS.medium;
}

function getActiveTrainingSection() {
    return TRAINING_SECTION_DETAILS[requestedTrainingSection]
        ? requestedTrainingSection
        : 'tactics';
}

function getActivePuzzleSection() {
    return PUZZLE_SECTION_DETAILS[requestedPuzzleSection]
        ? requestedPuzzleSection
        : 'daily-puzzle';
}

function isPlayablePuzzleSection(section) {
    return /^(daily-puzzle|puzzle-rush|puzzle-battle|thematic-puzzles)$/.test(String(section || ''));
}

function createPuzzleProgressState() {
    return {
        daily: {
            lastSolvedDate: '',
            streak: 0,
            bestStreak: 0,
        },
        rushBest: 0,
        battleBest: 0,
    };
}

function createDefaultPuzzleRuntime() {
    return {
        active: false,
        section: '',
        modeLabel: '',
        queue: [],
        queueIndex: 0,
        current: null,
        playerColor: 'white',
        step: 0,
        score: 0,
        solved: 0,
        misses: 0,
        feedback: '',
        tone: 'ready',
        hintVisible: false,
        revealed: false,
        completed: false,
        startedAt: 0,
        endsAt: 0,
        durationSeconds: 0,
        themeLabel: '',
        ghostScore: 0,
        targetScore: 0,
    };
}

function clonePuzzleEntry(entry) {
    return Object.assign({}, entry, {
        solution: Array.isArray(entry && entry.solution) ? entry.solution.slice() : [],
        sections: Array.isArray(entry && entry.sections) ? entry.sections.slice() : [],
    });
}

function parsePuzzleSolutionText(text) {
    return String(text || '')
        .trim()
        .split(/[\s,;|]+/)
        .map(token => token.trim())
        .filter(Boolean);
}

function isPuzzleFenValid(fen) {
    const value = String(fen || '').trim();
    if (!value) return false;
    try {
        if (typeof window.validateFEN === 'function') {
            const validation = window.validateFEN(value);
            if (validation && validation.valid === false) {
                return false;
            }
        }
        parseFEN(value);
        return true;
    } catch (error) {
        return false;
    }
}

function normalizePuzzleDifficulty(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (/^(easy|medium|hard)$/.test(normalized)) return normalized;
    return 'medium';
}

function normalizePuzzleEntry(entry, index, sourceLabel) {
    const raw = entry || {};
    const fen = String(raw.fen || raw.FEN || raw.startFen || raw.start_fen || '').trim();
    const solution = Array.isArray(raw.solution)
        ? raw.solution.slice()
        : (Array.isArray(raw.moves)
            ? raw.moves.slice()
            : parsePuzzleSolutionText(raw.solution || raw.moves || raw.Moves || raw.uci || raw.uciLine));
    if (!isPuzzleFenValid(fen) || !solution.length) {
        return null;
    }

    let playerColor = String(raw.playerColor || raw.sideToMove || '').trim().toLowerCase();
    if (playerColor !== 'white' && playerColor !== 'black') {
        try {
            playerColor = parseFEN(fen).activeColor || 'white';
        } catch (error) {
            playerColor = 'white';
        }
    }

    const sections = Array.isArray(raw.sections)
        ? raw.sections.map(item => String(item || '').trim()).filter(Boolean)
        : [];
    const theme = String(raw.theme || raw.themes || raw.category || 'Imported').trim() || 'Imported';
    const title = String(raw.title || raw.name || raw.id || ('Imported Puzzle ' + String(index + 1))).trim();
    const idSeed = String(raw.id || title + '|' + fen + '|' + solution.join(' ')).trim();
    return {
        id: idSeed.replace(/\s+/g, '-').toLowerCase(),
        title,
        fen,
        solution: solution.map(token => String(token || '').trim().toLowerCase()).filter(Boolean),
        theme,
        difficulty: normalizePuzzleDifficulty(raw.difficulty || raw.ratingBucket || raw.level),
        source: sourceLabel || String(raw.source || 'imported').trim() || 'imported',
        sections,
        description: String(raw.description || raw.prompt || raw.comment || '').trim(),
        playerColor,
    };
}

function loadImportedPuzzleLibrary() {
    try {
        const stored = JSON.parse(localStorage.getItem(PUZZLE_LIBRARY_KEY) || '[]');
        if (!Array.isArray(stored)) return [];
        return stored
            .map((entry, index) => normalizePuzzleEntry(entry, index, 'imported'))
            .filter(Boolean);
    } catch (error) {
        return [];
    }
}

function saveImportedPuzzleLibrary(entries) {
    try {
        localStorage.setItem(PUZZLE_LIBRARY_KEY, JSON.stringify(Array.isArray(entries) ? entries : []));
    } catch (error) {
        console.warn('UI.js: unable to persist imported puzzle library.', error);
    }
}

function loadPuzzleProgress() {
    try {
        const stored = JSON.parse(localStorage.getItem(PUZZLE_PROGRESS_KEY) || '{}');
        const defaults = createPuzzleProgressState();
        return {
            daily: {
                lastSolvedDate: String(stored && stored.daily && stored.daily.lastSolvedDate || ''),
                streak: Math.max(0, Number(stored && stored.daily && stored.daily.streak) || 0),
                bestStreak: Math.max(0, Number(stored && stored.daily && stored.daily.bestStreak) || 0),
            },
            rushBest: Math.max(0, Number(stored && stored.rushBest) || defaults.rushBest),
            battleBest: Math.max(0, Number(stored && stored.battleBest) || defaults.battleBest),
        };
    } catch (error) {
        return createPuzzleProgressState();
    }
}

function savePuzzleProgress() {
    try {
        localStorage.setItem(PUZZLE_PROGRESS_KEY, JSON.stringify(puzzleRuntime && puzzleRuntime.progress ? puzzleRuntime.progress : createPuzzleProgressState()));
    } catch (error) {
        console.warn('UI.js: unable to persist puzzle progress.', error);
    }
}

function ensurePuzzleRuntime() {
    if (!puzzleRuntime) {
        puzzleRuntime = createDefaultPuzzleRuntime();
        puzzleRuntime.importedLibrary = loadImportedPuzzleLibrary();
        puzzleRuntime.progress = loadPuzzleProgress();
    }
    return puzzleRuntime;
}

function getImportedPuzzleLibrary() {
    const runtime = ensurePuzzleRuntime();
    return Array.isArray(runtime.importedLibrary) ? runtime.importedLibrary.slice() : [];
}

function getPuzzleLibrary() {
    return BUILTIN_PUZZLE_LIBRARY.concat(getImportedPuzzleLibrary()).map(clonePuzzleEntry);
}

function getPuzzleDateStamp() {
    const now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
}

function getDailyPuzzleEntry() {
    const dailyPool = getPuzzleLibrary().filter(entry => {
        return entry.sections.includes('daily-puzzle') || entry.sections.includes('thematic-puzzles') || entry.source === 'imported';
    });
    if (!dailyPool.length) return null;
    const stamp = getPuzzleDateStamp();
    const seed = stamp.split('-').reduce((sum, part) => sum + Number(part || 0), 0);
    return clonePuzzleEntry(dailyPool[seed % dailyPool.length]);
}

function getPuzzlePoolForSection(section) {
    const pool = getPuzzleLibrary().filter(entry => {
        if (section === 'thematic-puzzles') {
            return Boolean(entry.theme);
        }
        if (section === 'daily-puzzle') {
            return entry.sections.includes('daily-puzzle') || entry.source === 'imported';
        }
        return entry.sections.includes(section) || entry.source === 'imported';
    });
    if (section === 'thematic-puzzles') {
        const preferredThemes = {};
        pool.forEach(entry => {
            const label = String(entry.theme || 'Imported').trim();
            preferredThemes[label] = (preferredThemes[label] || 0) + 1;
        });
        const topTheme = Object.keys(preferredThemes).sort((left, right) => preferredThemes[right] - preferredThemes[left])[0] || '';
        return pool.filter(entry => !topTheme || entry.theme === topTheme);
    }
    return pool;
}

function shufflePuzzleEntries(entries) {
    const list = Array.isArray(entries) ? entries.slice() : [];
    for (let index = list.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const temp = list[index];
        list[index] = list[swapIndex];
        list[swapIndex] = temp;
    }
    return list;
}

function stopPuzzleTicker() {
    if (puzzleTimer) {
        clearInterval(puzzleTimer);
        puzzleTimer = null;
    }
}

function isPuzzleSessionActive() {
    return Boolean(puzzleRuntime && puzzleRuntime.active);
}

function getPuzzleRemainingMs() {
    const runtime = ensurePuzzleRuntime();
    if (!runtime.active || !runtime.endsAt) return 0;
    return Math.max(0, runtime.endsAt - Date.now());
}

function completeTimedPuzzleSession() {
    const runtime = ensurePuzzleRuntime();
    runtime.completed = true;
    runtime.active = true;
    runtime.feedback = runtime.section === 'puzzle-battle'
        ? ('Battle over. Final score ' + runtime.score + ' vs ghost ' + runtime.ghostScore + '.')
        : ('Rush complete. You solved ' + runtime.score + ' puzzle' + (runtime.score === 1 ? '' : 's') + '.');
    runtime.tone = 'ready';
    if (runtime.section === 'puzzle-rush') {
        runtime.progress.rushBest = Math.max(runtime.progress.rushBest, runtime.score);
    }
    if (runtime.section === 'puzzle-battle') {
        runtime.progress.battleBest = Math.max(runtime.progress.battleBest, runtime.score);
    }
    savePuzzleProgress();
    stopPuzzleTicker();
    renderPlayView();
}

function ensurePuzzleTicker() {
    stopPuzzleTicker();
    const runtime = ensurePuzzleRuntime();
    if (!runtime.active || !runtime.endsAt) return;
    puzzleTimer = window.setInterval(() => {
        if (!isPuzzleSessionActive()) {
            stopPuzzleTicker();
            return;
        }
        if (getPuzzleRemainingMs() <= 0 && !runtime.completed) {
            completeTimedPuzzleSession();
            return;
        }
        if (runtime.section === 'puzzle-battle') {
            runtime.ghostScore = Math.max(runtime.ghostScore, Math.floor((runtime.durationSeconds - Math.ceil(getPuzzleRemainingMs() / 1000)) / 18));
        }
        renderPlayView();
    }, 1000);
}

function buildPuzzleQueue(section) {
    if (section === 'daily-puzzle') {
        const daily = getDailyPuzzleEntry();
        return daily ? [daily] : [];
    }
    const pool = getPuzzlePoolForSection(section);
    return shufflePuzzleEntries(pool);
}

function loadPuzzleEntryIntoBoard(entry) {
    const controller = ensureGameController();
    if (!controller || !entry) return false;
    controller.loadFEN(entry.fen);
    return true;
}

function resetPuzzleSessionState(section) {
    const runtime = ensurePuzzleRuntime();
    runtime.active = true;
    runtime.section = section;
    runtime.modeLabel = getPuzzleSectionLabel(section);
    runtime.queue = buildPuzzleQueue(section);
    runtime.queueIndex = 0;
    runtime.current = runtime.queue[0] ? clonePuzzleEntry(runtime.queue[0]) : null;
    runtime.step = 0;
    runtime.score = 0;
    runtime.solved = 0;
    runtime.misses = 0;
    runtime.feedback = '';
    runtime.tone = 'ready';
    runtime.hintVisible = false;
    runtime.revealed = false;
    runtime.completed = false;
    runtime.startedAt = Date.now();
    runtime.durationSeconds = section === 'puzzle-rush' ? 90 : (section === 'puzzle-battle' ? 120 : 0);
    runtime.endsAt = runtime.durationSeconds ? (runtime.startedAt + (runtime.durationSeconds * 1000)) : 0;
    runtime.ghostScore = 0;
    runtime.targetScore = section === 'puzzle-battle' ? 6 : 0;
    runtime.themeLabel = runtime.current ? String(runtime.current.theme || '') : '';
    if (runtime.current) {
        runtime.playerColor = runtime.current.playerColor || parseFEN(runtime.current.fen).activeColor || 'white';
    } else {
        runtime.playerColor = 'white';
    }
}

function syncPuzzleSideToMove() {
    const runtime = ensurePuzzleRuntime();
    const controller = ensureGameController();
    if (!runtime.active || !runtime.current || !controller) return;
    while (!runtime.completed && runtime.step < runtime.current.solution.length && currentGameState.activeColor !== runtime.playerColor) {
        const forced = controller.applyMoveFromUCI(runtime.current.solution[runtime.step]);
        if (!forced) {
            runtime.completed = true;
            runtime.feedback = 'Puzzle line could not be continued from the stored solution.';
            runtime.tone = 'over';
            break;
        }
        runtime.step += 1;
    }
}

function loadPuzzleQueueEntry(index) {
    const runtime = ensurePuzzleRuntime();
    runtime.queueIndex = Math.max(0, index);
    runtime.current = runtime.queue[runtime.queueIndex] ? clonePuzzleEntry(runtime.queue[runtime.queueIndex]) : null;
    runtime.step = 0;
    runtime.feedback = '';
    runtime.tone = 'ready';
    runtime.hintVisible = false;
    runtime.revealed = false;
    runtime.completed = false;
    runtime.themeLabel = runtime.current ? String(runtime.current.theme || '') : '';
    if (!runtime.current) return false;
    runtime.playerColor = runtime.current.playerColor || parseFEN(runtime.current.fen).activeColor || 'white';
    if (!loadPuzzleEntryIntoBoard(runtime.current)) return false;
    syncPuzzleSideToMove();
    return true;
}

function startPuzzleSectionSession(section) {
    applyPlayMode('play-human');
    resetPuzzleSessionState(section);
    const runtime = ensurePuzzleRuntime();
    if (!runtime.queue.length || !loadPuzzleQueueEntry(0)) {
        runtime.active = false;
        runtime.feedback = 'No puzzles are available for this section yet.';
        runtime.tone = 'over';
        stopPuzzleTicker();
        return false;
    }
    if (runtime.durationSeconds) {
        ensurePuzzleTicker();
    } else {
        stopPuzzleTicker();
    }
    return true;
}

function clearPuzzleSession() {
    const runtime = ensurePuzzleRuntime();
    runtime.active = false;
    runtime.current = null;
    runtime.queue = [];
    runtime.completed = false;
    runtime.feedback = '';
    runtime.endsAt = 0;
    stopPuzzleTicker();
}

function moveToNextPuzzleEntry() {
    const runtime = ensurePuzzleRuntime();
    if (!runtime.active) return false;
    const nextIndex = runtime.queueIndex + 1;
    if (nextIndex >= runtime.queue.length) {
        runtime.completed = true;
        runtime.feedback = runtime.section === 'daily-puzzle'
            ? 'Daily puzzle complete. Come back tomorrow for the next featured position.'
            : 'Puzzle set complete.';
        runtime.tone = 'ready';
        return false;
    }
    return loadPuzzleQueueEntry(nextIndex);
}

function updateDailyPuzzleProgress() {
    const runtime = ensurePuzzleRuntime();
    const progress = runtime.progress.daily;
    const today = getPuzzleDateStamp();
    if (progress.lastSolvedDate === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStamp = yesterday.getFullYear() + '-' + String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + String(yesterday.getDate()).padStart(2, '0');
    progress.streak = progress.lastSolvedDate === yesterdayStamp ? progress.streak + 1 : 1;
    progress.lastSolvedDate = today;
    progress.bestStreak = Math.max(progress.bestStreak, progress.streak);
    savePuzzleProgress();
}

function markCurrentPuzzleSolved() {
    const runtime = ensurePuzzleRuntime();
    runtime.solved += 1;
    runtime.score += 1;
    runtime.feedback = runtime.section === 'puzzle-rush'
        ? 'Correct. Next puzzle loaded.'
        : (runtime.section === 'puzzle-battle'
            ? 'Correct. Keep the pace up.'
            : 'Solved. You can review, restart, or load the next puzzle.');
    runtime.tone = 'ready';
    runtime.completed = runtime.section === 'daily-puzzle';
    if (runtime.section === 'daily-puzzle') {
        updateDailyPuzzleProgress();
    }
    if (runtime.section === 'puzzle-rush' || runtime.section === 'puzzle-battle') {
        moveToNextPuzzleEntry();
    }
}

function handleWrongPuzzleMove() {
    const runtime = ensurePuzzleRuntime();
    const controller = ensureGameController();
    runtime.misses += 1;
    if (controller) {
        controller.undoLastMove();
    }
    if (runtime.section === 'puzzle-rush') {
        runtime.feedback = 'Incorrect. Moving on to the next rush puzzle.';
        runtime.tone = 'over';
        moveToNextPuzzleEntry();
        return;
    }
    if (runtime.section === 'puzzle-battle') {
        runtime.ghostScore += 1;
        runtime.feedback = 'Incorrect. Ghost gains the point; next battle puzzle loaded.';
        runtime.tone = 'over';
        moveToNextPuzzleEntry();
        return;
    }
    runtime.feedback = 'That move does not match the stored puzzle line. Try again.';
    runtime.tone = 'over';
}

function processPuzzleMoveResult(moveEntry) {
    const runtime = ensurePuzzleRuntime();
    if (!runtime.active || runtime.completed || !runtime.current || !moveEntry) return;
    const expectedMove = runtime.current.solution[runtime.step];
    if (String(moveEntry.uci || '').toLowerCase() !== String(expectedMove || '').toLowerCase()) {
        handleWrongPuzzleMove();
        return;
    }

    runtime.step += 1;
    syncPuzzleSideToMove();

    if (runtime.step >= runtime.current.solution.length || getGameStatus(currentGameState).isOver) {
        markCurrentPuzzleSolved();
    } else {
        runtime.feedback = 'Correct so far. Keep calculating.';
        runtime.tone = 'ready';
    }
}

function revealPuzzleSolution() {
    const runtime = ensurePuzzleRuntime();
    const controller = ensureGameController();
    if (!runtime.active || !runtime.current || !controller) return;
    while (runtime.step < runtime.current.solution.length) {
        const applied = controller.applyMoveFromUCI(runtime.current.solution[runtime.step]);
        if (!applied) break;
        runtime.step += 1;
    }
    runtime.revealed = true;
    runtime.completed = true;
    runtime.feedback = 'Solution revealed on the board.';
    runtime.tone = 'ready';
    paintPosition(currentBoardFEN);
}

function restartPuzzleSession() {
    const runtime = ensurePuzzleRuntime();
    if (!runtime.active) return;
    loadPuzzleQueueEntry(runtime.queueIndex);
    paintPosition(currentBoardFEN);
}

function nextPuzzleSession() {
    const runtime = ensurePuzzleRuntime();
    if (!runtime.active) return;
    if (!moveToNextPuzzleEntry()) {
        renderPlayView();
        updatePlayState();
        return;
    }
    paintPosition(currentBoardFEN);
}

function formatPuzzleTimer(milliseconds) {
    const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return String(minutes) + ':' + String(seconds).padStart(2, '0');
}

function getPuzzleHintText(runtime) {
    if (!runtime || !runtime.current) return '';
    const move = runtime.current.solution[runtime.step] || runtime.current.solution[0] || '';
    if (!move) return '';
    return move.length >= 4
        ? ('Focus on the move from ' + move.slice(0, 2) + ' to ' + move.slice(2, 4) + '.')
        : ('Look for the move ' + move + '.');
}

function getPuzzleMeta() {
    const runtime = ensurePuzzleRuntime();
    if (!runtime.active || !runtime.current) return null;
    const currentIndex = runtime.queueIndex + 1;
    const total = runtime.queue.length;
    const remainingMs = getPuzzleRemainingMs();
    return {
        title: runtime.current.title || runtime.modeLabel,
        modeLabel: runtime.modeLabel,
        prompt: runtime.current.description || ('Find the move' + (runtime.themeLabel ? ' in the ' + runtime.themeLabel + ' theme.' : '.')),
        theme: runtime.themeLabel || runtime.current.theme || 'General',
        difficulty: runtime.current.difficulty || 'medium',
        score: runtime.score,
        solved: runtime.solved,
        misses: runtime.misses,
        queueLabel: total > 1 ? (String(currentIndex) + ' / ' + String(total)) : 'Featured',
        timerLabel: runtime.durationSeconds ? formatPuzzleTimer(remainingMs) : '',
        hint: runtime.hintVisible ? getPuzzleHintText(runtime) : '',
        feedback: runtime.feedback,
        tone: runtime.tone,
        revealed: runtime.revealed,
        completed: runtime.completed,
        bestLabel: runtime.section === 'puzzle-rush'
            ? String(runtime.progress.rushBest)
            : (runtime.section === 'puzzle-battle'
                ? String(runtime.progress.battleBest)
                : String(runtime.progress.daily.streak)),
        bestTitle: runtime.section === 'puzzle-rush'
            ? 'Best Rush'
            : (runtime.section === 'puzzle-battle' ? 'Best Battle' : 'Daily Streak'),
        ghostScore: runtime.section === 'puzzle-battle' ? runtime.ghostScore : null,
    };
}

function parseDelimitedPuzzleText(text, delimiter) {
    const lines = String(text || '').split(/\r?\n/).filter(Boolean);
    if (!lines.length) return [];
    const headers = lines[0].split(delimiter).map(value => String(value || '').trim());
    return lines.slice(1).map(line => {
        const values = line.split(delimiter);
        const row = {};
        headers.forEach((header, index) => {
            row[header] = String(values[index] || '').trim();
        });
        return row;
    });
}

function parsePuzzleImportText(text, fileName) {
    const source = String(text || '').trim();
    const lowerName = String(fileName || '').toLowerCase();
    if (!source) {
        return { ok: false, error: 'The selected file is empty.' };
    }

    let rawEntries = [];
    try {
        if (lowerName.endsWith('.json') || source.startsWith('[') || source.startsWith('{')) {
            const parsed = JSON.parse(source);
            if (Array.isArray(parsed)) {
                rawEntries = parsed;
            } else if (parsed && Array.isArray(parsed.puzzles)) {
                rawEntries = parsed.puzzles;
            } else if (parsed && Array.isArray(parsed.items)) {
                rawEntries = parsed.items;
            } else {
                rawEntries = [parsed];
            }
        } else if (lowerName.endsWith('.jsonl')) {
            rawEntries = source.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
        } else if (lowerName.endsWith('.tsv')) {
            rawEntries = parseDelimitedPuzzleText(source, '\t');
        } else if (lowerName.endsWith('.csv')) {
            rawEntries = parseDelimitedPuzzleText(source, ',');
        } else {
            rawEntries = source.split(/\r?\n/).filter(Boolean).map(line => {
                const parts = line.split('|');
                return {
                    fen: parts[0] || '',
                    moves: parts[1] || '',
                    theme: parts[2] || 'Imported',
                    title: parts[3] || '',
                };
            });
        }
    } catch (error) {
        return { ok: false, error: 'The puzzle file could not be parsed. Use JSON, JSONL, CSV, TSV, or FEN|moves text.' };
    }

    const normalized = rawEntries
        .map((entry, index) => normalizePuzzleEntry(entry, index, 'imported'))
        .filter(Boolean);
    if (!normalized.length) {
        return { ok: false, error: 'No valid puzzle rows were found. Each row needs a FEN and at least one UCI move.' };
    }
    return { ok: true, entries: normalized };
}

function mergeImportedPuzzleEntries(entries) {
    const runtime = ensurePuzzleRuntime();
    const existing = runtime.importedLibrary || [];
    const merged = {};
    existing.concat(entries || []).forEach(entry => {
        if (!entry || !entry.id) return;
        merged[entry.id] = clonePuzzleEntry(entry);
    });
    runtime.importedLibrary = Object.keys(merged).map(key => merged[key]);
    saveImportedPuzzleLibrary(runtime.importedLibrary);
    return runtime.importedLibrary.length;
}

async function importPuzzleDatabase() {
    if (!window.Chess2Storage || typeof window.Chess2Storage.openTextFile !== 'function') {
        return { ok: false, error: 'Puzzle import is unavailable because the file picker helper is missing.' };
    }
    const file = await window.Chess2Storage.openTextFile({ accept: '.json,.jsonl,.csv,.tsv,.txt,text/plain,application/json,text/csv' });
    if (!file || file.cancelled) {
        return { ok: false, cancelled: true, error: 'Import cancelled.' };
    }
    if (!file.ok) {
        return { ok: false, error: file.error || 'Unable to open the puzzle file.' };
    }

    const parsed = parsePuzzleImportText(file.text, file.name);
    if (!parsed.ok) {
        return parsed;
    }

    const total = mergeImportedPuzzleEntries(parsed.entries);
    return {
        ok: true,
        imported: parsed.entries.length,
        total,
        fileName: file.name,
    };
}

function createTrainingProgress() {
    const progress = {};
    getTrainingSections().forEach(section => {
        progress[section] = { attempted: 0, solved: 0, streak: 0, bestStreak: 0 };
    });
    return progress;
}

function createTrainingReviewState() {
    const review = {};
    const difficulty = {};
    getTrainingSections().forEach(section => {
        review[section] = { step: 0, records: {} };
        difficulty[section] = 'all';
    });
    return { review, difficulty };
}

function createTrainingSectionRuntime(section) {
    return {
        moveInput: '',
        selectedFrom: null,
        feedback: '',
        tone: 'info',
        hiddenBoard: section === 'blindfold',
        graded: false,
        selectedChoice: null,
        knightSelections: [],
        hintVisible: false,
    };
}

function normalizeTrainingProgressEntry(progress) {
    const attempted = Math.max(0, Number(progress && progress.attempted) || 0);
    const solved = Math.max(0, Math.min(attempted, Number(progress && progress.solved) || 0));
    const streak = Math.max(0, Number(progress && progress.streak) || 0);
    const bestStreak = Math.max(streak, Math.max(0, Number(progress && progress.bestStreak) || 0));
    return { attempted, solved, streak, bestStreak };
}

function normalizeTrainingCurrentIndex(section, index) {
    const deck = getTrainingDrillDeck(section);
    const value = Math.floor(Number(index));
    return Number.isInteger(value) && value >= 0 && value < deck.length ? value : null;
}

function normalizeTrainingReviewRecord(record, drill) {
    const normalized = createTrainingReviewRecord(drill);
    normalized.attempts = Math.max(0, Number(record && record.attempts) || 0);
    normalized.solved = Math.max(0, Math.min(normalized.attempts, Number(record && record.solved) || 0));
    normalized.interval = Math.max(0, Number(record && record.interval) || 0);
    normalized.dueStep = Math.max(0, Number(record && record.dueStep) || 0);
    normalized.lastResult = record && (record.lastResult === 'correct' || record.lastResult === 'incorrect')
        ? record.lastResult
        : '';
    normalized.lastSeenStep = Math.max(-1, Number(record && record.lastSeenStep) || -1);
    normalized.difficulty = drill.difficulty || 'medium';
    return normalized;
}

function loadTrainingHistory() {
    try {
        const stored = JSON.parse(localStorage.getItem(TRAINING_HISTORY_KEY) || '{}');
        const defaults = createTrainingReviewState();
        const persisted = {
            current: {},
            progress: createTrainingProgress(),
            review: defaults.review,
            difficulty: defaults.difficulty,
        };
        getTrainingSections().forEach(section => {
            const storedCurrent = stored && stored.current ? stored.current[section] : null;
            const storedProgress = stored && stored.progress ? stored.progress[section] : null;
            const storedReview = stored && stored.review ? stored.review[section] : null;
            const storedDifficulty = stored && stored.difficulty ? stored.difficulty[section] : null;
            const deck = getTrainingDrillDeck(section);
            const records = {};

            persisted.current[section] = normalizeTrainingCurrentIndex(section, storedCurrent);
            persisted.progress[section] = normalizeTrainingProgressEntry(storedProgress);
            persisted.difficulty[section] = TRAINING_DIFFICULTY_LABELS[storedDifficulty] ? storedDifficulty : 'all';
            persisted.review[section] = {
                step: Math.max(0, Number(storedReview && storedReview.step) || 0),
                records,
            };

            deck.forEach(drill => {
                if (!storedReview || !storedReview.records || !storedReview.records[drill.id]) return;
                records[drill.id] = normalizeTrainingReviewRecord(storedReview.records[drill.id], drill);
            });
        });
        return persisted;
    } catch (error) {
        return null;
    }
}

function saveTrainingHistory() {
    if (!trainingRuntime) return;
    try {
        const snapshot = {
            current: {},
            progress: {},
            review: {},
            difficulty: {},
        };
        getTrainingSections().forEach(section => {
            const deck = getTrainingDrillDeck(section);
            const reviewState = trainingRuntime.review && trainingRuntime.review[section]
                ? trainingRuntime.review[section]
                : { step: 0, records: {} };
            const records = {};
            deck.forEach(drill => {
                const record = reviewState.records ? reviewState.records[drill.id] : null;
                const normalized = normalizeTrainingReviewRecord(record, drill);
                if (!normalized.attempts && !normalized.dueStep && !normalized.lastResult) return;
                records[drill.id] = normalized;
            });
            snapshot.current[section] = normalizeTrainingCurrentIndex(section, trainingRuntime.current ? trainingRuntime.current[section] : null);
            snapshot.progress[section] = normalizeTrainingProgressEntry(trainingRuntime.progress ? trainingRuntime.progress[section] : null);
            snapshot.review[section] = {
                step: Math.max(0, Number(reviewState.step) || 0),
                records,
            };
            snapshot.difficulty[section] = TRAINING_DIFFICULTY_LABELS[trainingRuntime.difficulty && trainingRuntime.difficulty[section]]
                ? trainingRuntime.difficulty[section]
                : 'all';
        });
        localStorage.setItem(TRAINING_HISTORY_KEY, JSON.stringify(snapshot));
    } catch (error) {
        console.warn('UI.js: unable to persist training history.', error);
    }
}

function createTrainingRuntime() {
    const current = {};
    const sectionState = {};
    const persisted = loadTrainingHistory();
    getTrainingSections().forEach(section => {
        current[section] = persisted && persisted.current ? persisted.current[section] : null;
        sectionState[section] = createTrainingSectionRuntime(section);
    });
    const reviewState = createTrainingReviewState();
    return {
        current,
        progress: persisted && persisted.progress ? persisted.progress : createTrainingProgress(),
        sectionState,
        review: persisted && persisted.review ? persisted.review : reviewState.review,
        difficulty: persisted && persisted.difficulty ? persisted.difficulty : reviewState.difficulty,
    };
}

function getTrainingSectionRuntime(section) {
    if (!trainingRuntime || !trainingRuntime.sectionState) {
        trainingRuntime = createTrainingRuntime();
    }
    if (!trainingRuntime.sectionState[section]) {
        trainingRuntime.sectionState[section] = createTrainingSectionRuntime(section);
    }
    return trainingRuntime.sectionState[section];
}

function getTrainingProgress(section) {
    if (!trainingRuntime || !trainingRuntime.progress) {
        trainingRuntime = createTrainingRuntime();
    }
    if (!trainingRuntime.progress[section]) {
        trainingRuntime.progress[section] = { attempted: 0, solved: 0, streak: 0, bestStreak: 0 };
    }
    return trainingRuntime.progress[section];
}

function getTrainingDifficultyPreference(section) {
    if (!trainingRuntime || !trainingRuntime.difficulty) {
        trainingRuntime = createTrainingRuntime();
    }
    if (!trainingRuntime.difficulty[section]) {
        trainingRuntime.difficulty[section] = 'all';
    }
    return trainingRuntime.difficulty[section];
}

function setTrainingDifficultyPreference(section, difficulty) {
    if (!trainingRuntime || !trainingRuntime.difficulty) {
        trainingRuntime = createTrainingRuntime();
    }
    trainingRuntime.difficulty[section] = TRAINING_DIFFICULTY_LABELS[difficulty] ? difficulty : 'all';
    saveTrainingHistory();
}

function getTrainingReviewState(section) {
    if (!trainingRuntime || !trainingRuntime.review) {
        trainingRuntime = createTrainingRuntime();
    }
    if (!trainingRuntime.review[section]) {
        trainingRuntime.review[section] = { step: 0, records: {} };
    }
    return trainingRuntime.review[section];
}

function createTrainingReviewRecord(drill) {
    return {
        attempts: 0,
        solved: 0,
        interval: 0,
        dueStep: 0,
        lastResult: '',
        lastSeenStep: -1,
        difficulty: drill.difficulty || 'medium',
    };
}

function getTrainingReviewRecord(section, drill) {
    const reviewState = getTrainingReviewState(section);
    if (!reviewState.records[drill.id]) {
        reviewState.records[drill.id] = createTrainingReviewRecord(drill);
    }
    return reviewState.records[drill.id];
}

function applyTrainingResult(section, runtime, drill, correct) {
    const progress = getTrainingProgress(section);
    if (runtime.graded) return progress;
    const reviewState = getTrainingReviewState(section);
    const record = getTrainingReviewRecord(section, drill);
    const schedulerSettings = getTrainingSchedulerSettings(drill.difficulty);
    progress.attempted += 1;
    record.attempts += 1;
    record.lastSeenStep = reviewState.step;
    if (correct) {
        progress.solved += 1;
        progress.streak = (progress.streak || 0) + 1;
        progress.bestStreak = Math.max(progress.bestStreak || 0, progress.streak);
        record.solved += 1;
        record.interval = record.interval > 0
            ? Math.max(record.interval + 1, Math.round(record.interval * schedulerSettings.multiplier))
            : schedulerSettings.firstInterval;
        record.dueStep = reviewState.step + record.interval;
        record.lastResult = 'correct';
    } else {
        progress.streak = 0;
        record.interval = 1;
        record.dueStep = reviewState.step + 1;
        record.lastResult = 'incorrect';
    }
    runtime.graded = true;
    saveTrainingHistory();
    return progress;
}

function setTrainingCurrentIndex(section, index) {
    if (!trainingRuntime || !trainingRuntime.current) {
        trainingRuntime = createTrainingRuntime();
    }
    trainingRuntime.current[section] = normalizeTrainingCurrentIndex(section, index);
    saveTrainingHistory();
    return trainingRuntime.current[section];
}

function getTrainingDrillDeck(section) {
    if (!TRAINING_DRILL_CACHE[section]) {
        const rawDeck = TRAINING_DRILLS[section] || TRAINING_DRILLS.tactics;
        TRAINING_DRILL_CACHE[section] = rawDeck.map((drill, index) => Object.assign({
            id: drill.id || (section + '-' + (index + 1)),
            difficulty: drill.difficulty || getTrainingDifficultyForIndex(section, index),
        }, drill));
    }
    return TRAINING_DRILL_CACHE[section];
}

function getTrainingFilteredDrillIndices(section) {
    const deck = getTrainingDrillDeck(section);
    const preference = getTrainingDifficultyPreference(section);
    const filtered = deck
        .map((drill, index) => ({ drill, index }))
        .filter(entry => preference === 'all' || entry.drill.difficulty === preference)
        .map(entry => entry.index);
    return filtered.length ? filtered : deck.map((_, index) => index);
}

function countTrainingDueDrills(section) {
    const deck = getTrainingDrillDeck(section);
    const reviewState = getTrainingReviewState(section);
    return getTrainingFilteredDrillIndices(section).filter(index => {
        const record = getTrainingReviewRecord(section, deck[index]);
        return record.dueStep <= reviewState.step;
    }).length;
}

function getTrainingReviewStatus(section, drill) {
    const reviewState = getTrainingReviewState(section);
    const record = getTrainingReviewRecord(section, drill);
    if (record.attempts === 0) return 'New drill';
    if (record.dueStep <= reviewState.step) return 'Due now';
    const remaining = record.dueStep - reviewState.step;
    return 'Due in ' + remaining + ' drill' + (remaining === 1 ? '' : 's');
}

function selectTrainingDrillIndex(section, options) {
    const settings = Object.assign({ advanceStep: false, excludeCurrent: false }, options || {});
    const deck = getTrainingDrillDeck(section);
    const reviewState = getTrainingReviewState(section);
    if (settings.advanceStep) {
        reviewState.step += 1;
    }
    const currentIndex = trainingRuntime && trainingRuntime.current ? trainingRuntime.current[section] : null;
    const candidates = getTrainingFilteredDrillIndices(section).map(index => {
        const drill = deck[index];
        const record = getTrainingReviewRecord(section, drill);
        return {
            index,
            drill,
            record,
            dueNow: record.dueStep <= reviewState.step,
        };
    });
    let pool = candidates.filter(candidate => candidate.dueNow);
    if (!pool.length) {
        pool = candidates.slice();
    }
    if (settings.excludeCurrent && pool.length > 1 && Number.isInteger(currentIndex)) {
        const withoutCurrent = pool.filter(candidate => candidate.index !== currentIndex);
        if (withoutCurrent.length) {
            pool = withoutCurrent;
        }
    }
    pool.sort((left, right) => {
        if (left.dueNow !== right.dueNow) return left.dueNow ? -1 : 1;
        if (left.record.dueStep !== right.record.dueStep) return left.record.dueStep - right.record.dueStep;
        if (left.record.attempts !== right.record.attempts) return left.record.attempts - right.record.attempts;
        if (left.record.lastResult !== right.record.lastResult) {
            if (left.record.lastResult === 'incorrect') return -1;
            if (right.record.lastResult === 'incorrect') return 1;
        }
        return left.index - right.index;
    });
    return pool.length ? pool[0].index : 0;
}

function ensureTrainingCurrentIndex(section) {
    if (!trainingRuntime || !trainingRuntime.current) {
        trainingRuntime = createTrainingRuntime();
    }
    const currentIndex = trainingRuntime.current[section];
    const validIndices = getTrainingFilteredDrillIndices(section);
    if (!Number.isInteger(currentIndex) || !validIndices.includes(currentIndex)) {
        setTrainingCurrentIndex(section, selectTrainingDrillIndex(section, { advanceStep: false, excludeCurrent: false }));
    }
    return trainingRuntime.current[section];
}

function getCurrentTrainingDrill(section) {
    const deck = getTrainingDrillDeck(section);
    const index = ensureTrainingCurrentIndex(section);
    return deck[index % deck.length];
}

function resetTrainingSectionRuntime(section) {
    getTrainingSectionRuntime(section);
    trainingRuntime.sectionState[section] = createTrainingSectionRuntime(section);
}

function nextTrainingDrill(section) {
    if (!trainingRuntime || !trainingRuntime.current) {
        trainingRuntime = createTrainingRuntime();
    }
    setTrainingCurrentIndex(section, selectTrainingDrillIndex(section, { advanceStep: true, excludeCurrent: true }));
    resetTrainingSectionRuntime(section);
}

function shouldHideTrainingBoard(section, runtime) {
    return Boolean(runtime && runtime.hiddenBoard && /^(blindfold|visualization|memory)$/.test(section));
}

function getTrainingMoveDisplay(fen, uciMove) {
    const state = parseFEN(fen || START_FEN);
    return getOpeningMoveDisplay(state, uciMove || '');
}

function getTrainingChoiceLabel(choice) {
    if (choice === 'empty') return 'Empty square';
    if (!choice) return '-';
    const color = choice === choice.toUpperCase() ? 'White' : 'Black';
    const nameMap = {
        p: 'pawn',
        n: 'knight',
        b: 'bishop',
        r: 'rook',
        q: 'queen',
        k: 'king',
    };
    return (getPieceSymbol(choice) || '') + ' ' + color + ' ' + (nameMap[String(choice).toLowerCase()] || 'piece');
}

function buildTrainingHintMarkup(runtime, drill) {
    if (!runtime.hintVisible || !drill || !drill.hint) return '';
    return [
        '<div class="training-feedback training-feedback-info">',
        '<div class="engine-pv"><strong>Hint:</strong> ' + escapeMarkup(drill.hint) + '</div>',
        '</div>',
    ].join('');
}

function buildTrainingFeedbackMarkup(runtime, drill, section) {
    if (!runtime.feedback) return '';
    const extra = runtime.graded && drill && drill.explanation
        ? '<div class="engine-pv training-feedback-extra"><strong>Why:</strong> ' + escapeMarkup(drill.explanation) + '</div>'
        : '';
    return [
        '<div class="training-feedback training-feedback-' + escapeMarkup(runtime.tone || 'info') + '">',
        '<div class="engine-pv">' + escapeMarkup(runtime.feedback) + '</div>',
        extra,
        runtime.graded && /^(tactics|endgame|guess|blindfold)$/.test(section)
            ? '<div class="engine-pv"><strong>Best move:</strong> ' + escapeMarkup(getTrainingMoveDisplay(drill.fen, drill.bestMove)) + ' <span class="training-uci">(' + escapeMarkup(drill.bestMove) + ')</span></div>'
            : '',
        '</div>',
    ].join('');
}

function renderTrainingBoardMarkup(section, runtime, drill) {
    const state = parseFEN(drill.fen || START_FEN);
    const hidden = shouldHideTrainingBoard(section, runtime);
    const correctKnightTargets = runtime.graded && section === 'knight'
        ? new Set((drill.targets || []).map(square => String(square)))
        : null;
    const selectedKnightTargets = new Set((runtime.knightSelections || []).map(square => String(square)));
    const squares = [];

    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const square = FILES[file] + RANKS[rank];
            const piece = getPieceAt(state, square);
            const isDark = (rank + file) % 2 === 1;
            const classes = ['training-square', isDark ? 'dark' : 'light'];
            if (runtime.selectedFrom === square) classes.push('training-square-selected');
            if (section === 'knight' && selectedKnightTargets.has(square)) classes.push('training-square-picked');
            if (correctKnightTargets && correctKnightTargets.has(square)) classes.push('training-square-target');
            if (correctKnightTargets && runtime.graded && selectedKnightTargets.has(square) && !correctKnightTargets.has(square)) {
                classes.push('training-square-miss');
            }
            if ((section === 'visualization' || section === 'memory') && !hidden && drill.targetSquare === square) {
                classes.push('training-square-focus');
            }
            squares.push([
                '<button type="button" class="' + classes.join(' ') + '" data-training-square="' + escapeMarkup(square) + '">',
                '<span class="training-square-coord">' + escapeMarkup(square) + '</span>',
                '<span class="training-square-piece' + (hidden ? ' training-square-piece-hidden' : '') + '">' + escapeMarkup(hidden ? '' : getPieceSymbol(piece)) + '</span>',
                '</button>',
            ].join(''));
        }
    }

    return [
        '<div class="training-board-shell">',
        '<div class="training-board" aria-label="Training board">',
        squares.join(''),
        '</div>',
        hidden ? '<div class="engine-pv training-board-note">Board hidden: use coordinates and memory instead of visible pieces.</div>' : '',
        '</div>',
    ].join('');
}

function renderTrainingMoveComposer(section, runtime, drill) {
    const guessChoices = Array.isArray(drill.choices) && section === 'guess'
        ? '<div class="training-choice-grid">' + drill.choices.map(choice => '<button type="button" class="analysis-section-tab training-choice-btn' + (runtime.selectedChoice === choice ? ' active' : '') + '" data-training-choice="' + escapeMarkup(choice) + '">' + escapeMarkup(getTrainingMoveDisplay(drill.fen, choice)) + '</button>').join('') + '</div>'
        : '';
    const hintLabel = runtime.hintVisible ? 'Hide Hint' : 'Show Hint';
    return [
        '<div class="training-controls-grid">',
        '<label class="settings-field">',
        '<span class="settings-field-label">Enter move in UCI</span>',
        '<input type="text" class="settings-select training-move-input" data-training-move-input="true" value="' + escapeMarkup(runtime.moveInput || '') + '" placeholder="e2e4">',
        '<span class="settings-help">Click a source square and destination square on the board to compose the move automatically.</span>',
        '</label>',
        guessChoices,
        '<div class="play-action-bar settings-actions">',
        '<button type="button" class="play-action-btn" data-training-submit-move="true">Check Move</button>',
        '<button type="button" class="play-action-btn secondary" data-training-hint="true">' + escapeMarkup(hintLabel) + '</button>',
        '<button type="button" class="play-action-btn secondary" data-training-clear="true">Clear</button>',
        '<button type="button" class="play-action-btn secondary" data-training-reset="true">Reset Drill</button>',
        '<button type="button" class="play-action-btn secondary" data-training-next="true">Next Drill</button>',
        section === 'blindfold' ? '<button type="button" class="play-action-btn secondary" data-training-reveal="true">' + escapeMarkup(runtime.hiddenBoard ? 'Reveal Board' : 'Hide Board') + '</button>' : '',
        '</div>',
        '</div>',
    ].join('');
}

function renderTrainingRecallControls(section, runtime, drill) {
    const actionLabel = runtime.hiddenBoard ? 'Reveal Board' : 'Hide Board And Answer';
    const hintLabel = runtime.hintVisible ? 'Hide Hint' : 'Show Hint';
    const choicesMarkup = runtime.hiddenBoard
        ? '<div class="training-choice-grid">' + (drill.choices || []).map(choice => '<button type="button" class="analysis-section-tab training-choice-btn' + (runtime.selectedChoice === choice ? ' active' : '') + '" data-training-choice="' + escapeMarkup(choice) + '">' + escapeMarkup(getTrainingChoiceLabel(choice)) + '</button>').join('') + '</div>'
        : '<div class="engine-pv">Study the board first, then hide it and answer the square question.</div>';
    return [
        '<div class="training-controls-grid">',
        '<div class="engine-pv"><strong>Target square:</strong> ' + escapeMarkup(drill.targetSquare || '-') + '</div>',
        choicesMarkup,
        '<div class="play-action-bar settings-actions">',
        '<button type="button" class="play-action-btn" data-training-reveal="true">' + escapeMarkup(actionLabel) + '</button>',
        '<button type="button" class="play-action-btn secondary" data-training-hint="true">' + escapeMarkup(hintLabel) + '</button>',
        '<button type="button" class="play-action-btn secondary" data-training-reset="true">Reset Drill</button>',
        '<button type="button" class="play-action-btn secondary" data-training-next="true">Next Drill</button>',
        '</div>',
        '</div>',
    ].join('');
}

function renderKnightVisionControls(runtime, drill) {
    const hintLabel = runtime.hintVisible ? 'Hide Hint' : 'Show Hint';
    return [
        '<div class="training-controls-grid">',
        '<div class="engine-pv">Select every square attacked by the knight. The knight itself is only a reference anchor.</div>',
        '<div class="engine-pv"><strong>Selected:</strong> ' + escapeMarkup((runtime.knightSelections || []).join(', ') || 'none') + '</div>',
        '<div class="play-action-bar settings-actions">',
        '<button type="button" class="play-action-btn" data-training-submit-knight="true">Check Squares</button>',
        '<button type="button" class="play-action-btn secondary" data-training-hint="true">' + escapeMarkup(hintLabel) + '</button>',
        '<button type="button" class="play-action-btn secondary" data-training-clear="true">Clear Picks</button>',
        '<button type="button" class="play-action-btn secondary" data-training-reset="true">Reset Drill</button>',
        '<button type="button" class="play-action-btn secondary" data-training-next="true">Next Drill</button>',
        '</div>',
        '</div>',
    ].join('');
}

function renderTrainingActiveCard(section, runtime, drill) {
    let controlsMarkup = '';
    if (/^(tactics|endgame|guess|blindfold)$/.test(section)) {
        controlsMarkup = renderTrainingMoveComposer(section, runtime, drill);
    } else if (section === 'knight') {
        controlsMarkup = renderKnightVisionControls(runtime, drill);
    } else {
        controlsMarkup = renderTrainingRecallControls(section, runtime, drill);
    }

    return [
        '<section class="play-panel">',
        '<h2 class="play-panel-title">' + escapeMarkup(getTrainingSectionLabel(section)) + '</h2>',
        '<p class="settings-lead">' + escapeMarkup(drill.prompt || TRAINING_SECTION_DETAILS[section].description) + '</p>',
        drill.theme ? '<div class="engine-pv"><strong>Theme:</strong> ' + escapeMarkup(drill.theme) + '</div>' : '',
        '<div class="engine-pv"><strong>Difficulty:</strong> ' + escapeMarkup(getTrainingDifficultyLabel(drill.difficulty)) + ' <strong>Review:</strong> ' + escapeMarkup(getTrainingReviewStatus(section, drill)) + '</div>',
        '<div class="training-workspace-grid">',
        renderTrainingBoardMarkup(section, runtime, drill),
        '<div class="settings-card training-card">',
        '<h3 class="play-panel-title settings-subtitle">Current Drill</h3>',
        '<div class="engine-pv"><strong>Drill:</strong> ' + escapeMarkup(String((trainingRuntime && trainingRuntime.current && trainingRuntime.current[section] != null ? trainingRuntime.current[section] : 0) + 1)) + ' / ' + escapeMarkup(String(getTrainingDrillDeck(section).length)) + '</div>',
        '<div class="engine-pv"><strong>Focus:</strong> ' + escapeMarkup(TRAINING_SECTION_DETAILS[section].focus) + '</div>',
        '<div class="engine-pv"><strong>Format:</strong> ' + escapeMarkup(TRAINING_SECTION_DETAILS[section].format) + '</div>',
        controlsMarkup,
        buildTrainingHintMarkup(runtime, drill),
        buildTrainingFeedbackMarkup(runtime, drill, section),
        '</div>',
        '</div>',
        '</section>',
    ].join('');
}

function renderTrainingSummaryCard(section) {
    const progress = getTrainingProgress(section);
    const attempted = progress.attempted || 0;
    const solved = progress.solved || 0;
    const streak = progress.streak || 0;
    const bestStreak = progress.bestStreak || 0;
    const difficulty = getTrainingDifficultyPreference(section);
    const dueNow = countTrainingDueDrills(section);
    const accuracy = attempted ? Math.round((solved / attempted) * 100) + '%' : '0%';
    const detail = TRAINING_SECTION_DETAILS[section];
    return [
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Mode Summary</h2>',
        '<div class="engine-summary-grid">',
        '<div class="engine-stat"><span class="engine-stat-label">Current Mode</span><span class="engine-stat-value">' + escapeMarkup(getTrainingSectionLabel(section)) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Difficulty Filter</span><span class="engine-stat-value">' + escapeMarkup(getTrainingDifficultyLabel(difficulty)) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Deck Size</span><span class="engine-stat-value">' + escapeMarkup(String(getTrainingDrillDeck(section).length)) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Due Now</span><span class="engine-stat-value">' + escapeMarkup(String(dueNow)) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Attempted</span><span class="engine-stat-value">' + escapeMarkup(String(attempted)) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Solved</span><span class="engine-stat-value">' + escapeMarkup(String(solved)) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Accuracy</span><span class="engine-stat-value">' + escapeMarkup(accuracy) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Streak</span><span class="engine-stat-value">' + escapeMarkup(String(streak)) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Best Streak</span><span class="engine-stat-value">' + escapeMarkup(String(bestStreak)) + '</span></div>',
        '</div>',
        '<div class="engine-pv"><strong>Description:</strong> ' + escapeMarkup(detail.description) + '</div>',
        '<div class="engine-pv"><strong>Target Skill:</strong> ' + escapeMarkup(detail.focus) + '</div>',
        '<div class="play-action-bar settings-actions">',
        '<button type="button" class="play-action-btn secondary" data-training-route="analysis">Open Review Board</button>',
        '<button type="button" class="play-action-btn secondary" data-training-route="' + escapeMarkup(detail.primaryRoute) + '">' + escapeMarkup(detail.primaryAction) + '</button>',
        '</div>',
        '</section>',
    ].join('');
}

function handleTrainingSquareClick(section, square) {
    const runtime = getTrainingSectionRuntime(section);
    const drill = getCurrentTrainingDrill(section);
    if (!drill) return;

    if (section === 'knight') {
        const current = new Set(runtime.knightSelections || []);
        if (current.has(square)) current.delete(square);
        else current.add(square);
        runtime.knightSelections = Array.from(current);
        renderTrainingView();
        return;
    }

    if (!/^(tactics|endgame|guess|blindfold)$/.test(section)) return;

    const state = parseFEN(drill.fen || START_FEN);
    if (!runtime.selectedFrom) {
        const piece = getPieceAt(state, square);
        if (piece && pieceColor(piece) === state.activeColor) {
            runtime.selectedFrom = square;
            runtime.feedback = 'Selected ' + square + ' as the source square.';
            runtime.tone = 'info';
        } else {
            runtime.feedback = 'Pick a piece for the side to move first.';
            runtime.tone = 'info';
        }
        renderTrainingView();
        return;
    }

    if (runtime.selectedFrom === square) {
        runtime.selectedFrom = null;
        runtime.moveInput = '';
        runtime.feedback = 'Source square cleared.';
        runtime.tone = 'info';
        renderTrainingView();
        return;
    }

    const legalMoves = generateLegalMovesFrom(state, runtime.selectedFrom);
    const candidates = legalMoves.filter(move => move.to === square);
    if (candidates.length > 0) {
        const move = candidates.find(entry => String(entry.promotion || '').toLowerCase() === 'q') || candidates[0];
        runtime.moveInput = moveToUCI(move);
        runtime.feedback = 'Composed move ' + runtime.moveInput + ' from board clicks.';
        runtime.tone = 'info';
    } else {
        const piece = getPieceAt(state, square);
        if (piece && pieceColor(piece) === state.activeColor) {
            runtime.selectedFrom = square;
            runtime.feedback = 'Changed source square to ' + square + '.';
            runtime.tone = 'info';
        } else {
            runtime.feedback = 'That destination is not legal from the selected square.';
            runtime.tone = 'warning';
        }
    }
    renderTrainingView();
}

function submitTrainingMove(section) {
    const runtime = getTrainingSectionRuntime(section);
    const drill = getCurrentTrainingDrill(section);
    const state = parseFEN(drill.fen || START_FEN);
    const attempt = String(runtime.moveInput || '').trim().toLowerCase();
    if (!attempt) {
        runtime.feedback = 'Enter a move or compose one from the board first.';
        runtime.tone = 'info';
        renderTrainingView();
        return;
    }

    const legal = findLegalMoveByUCI(state, attempt);
    if (!legal) {
        runtime.feedback = 'That move is not legal in this position.';
        runtime.tone = 'warning';
        renderTrainingView();
        return;
    }

    if (attempt === String(drill.bestMove || '').toLowerCase()) {
        applyTrainingResult(section, runtime, drill, true);
        runtime.feedback = 'Correct. ' + getTrainingMoveDisplay(drill.fen, attempt) + ' is the best move here.';
        runtime.tone = 'success';
    } else {
        applyTrainingResult(section, runtime, drill, false);
        runtime.feedback = 'Not quite. Review the position and compare your move to the best continuation.';
        runtime.tone = 'warning';
    }
    renderTrainingView();
}

function submitKnightVision(section) {
    const runtime = getTrainingSectionRuntime(section);
    const drill = getCurrentTrainingDrill(section);
    const picked = Array.from(new Set(runtime.knightSelections || [])).sort();
    const targets = Array.from(new Set(drill.targets || [])).sort();
    const match = picked.length === targets.length && picked.every((square, index) => square === targets[index]);
    applyTrainingResult(section, runtime, drill, match);
    runtime.feedback = match
        ? 'Correct. You marked every attacked square.'
        : 'Not yet. Compare your picks with the highlighted target squares.';
    runtime.tone = match ? 'success' : 'warning';
    renderTrainingView();
}

function submitTrainingChoice(section, choice) {
    const runtime = getTrainingSectionRuntime(section);
    const drill = getCurrentTrainingDrill(section);
    runtime.selectedChoice = choice;

    if (section === 'guess') {
        runtime.moveInput = choice;
        submitTrainingMove(section);
        return;
    }

    if (!(section === 'visualization' || section === 'memory')) return;

    if (!runtime.hiddenBoard) {
        runtime.feedback = 'Hide the board first, then answer from memory.';
        runtime.tone = 'info';
        renderTrainingView();
        return;
    }

    const correct = String(choice) === String(drill.answer);
    applyTrainingResult(section, runtime, drill, correct);

    runtime.feedback = correct
        ? 'Correct. ' + getTrainingChoiceLabel(choice) + ' was on ' + drill.targetSquare + '.'
        : 'Incorrect. The correct answer was ' + getTrainingChoiceLabel(drill.answer) + '.';
    runtime.tone = correct ? 'success' : 'warning';
    renderTrainingView();
}

function createEmptyAnalysisInsights() {
    return {
        lastFen: '',
        lastUpdatedAt: 0,
        history: [],
        logLines: [],
        rootMoves: [],
        hint: null,
        threat: null,
        error: '',
        sourceMode: '',
    };
}

function resolveAnalysisSection(viewId) {
    switch (String(viewId || '')) {
        case 'analysis':
            return 'board';
        case 'eval':
            return 'eval';
        case 'pv':
            return 'pv';
        case 'search-stats':
            return 'stats';
        case 'threat-mode':
            return 'threat';
        case 'hint-mode':
            return 'hint';
        case 'logs':
            return 'logs';
        default:
            return 'board';
    }
}

function resolveOpeningsSection(viewId) {
    switch (String(viewId || '')) {
        case 'eco':
            return 'eco';
        case 'book':
            return 'book';
        case 'stats':
            return 'stats';
        case 'openings':
        default:
            return 'explorer';
    }
}

function getOpeningsSectionLabel(section) {
    return OPENINGS_SECTION_LABELS[section] || OPENINGS_SECTION_LABELS.explorer;
}

function getAnalysisSectionLabel(section) {
    return ANALYSIS_SECTION_LABELS[section] || ANALYSIS_SECTION_LABELS.board;
}

function resolveTrainingSection(viewId) {
    switch (String(viewId || '')) {
        case 'endgame-trainer':
            return 'endgame';
        case 'guess-move':
            return 'guess';
        case 'blindfold':
            return 'blindfold';
        case 'visualization':
            return 'visualization';
        case 'knight-vision':
            return 'knight';
        case 'memory':
            return 'memory';
        case 'tactics':
        case 'training':
        default:
            return 'tactics';
    }
}

function resolvePuzzleSection(viewId) {
    switch (String(viewId || '')) {
        case 'puzzle-rush':
        case 'puzzle-battle':
        case 'thematic-puzzles':
        case 'puzzle-import':
            return String(viewId);
        case 'daily-puzzle':
        case 'puzzles':
        default:
            return 'daily-puzzle';
    }
}

function getTrainingSectionLabel(section) {
    return TRAINING_SECTION_LABELS[section] || TRAINING_SECTION_LABELS.tactics;
}

function getPuzzleSectionLabel(section) {
    return PUZZLE_SECTION_LABELS[section] || PUZZLE_SECTION_LABELS['daily-puzzle'];
}

function resolveVariantSection(viewId) {
    switch (String(viewId || '')) {
        case 'king-hill':
        case 'three-check':
        case 'horde':
        case 'atomic':
        case 'crazyhouse':
        case 'bighouse':
        case 'bughouse':
        case 'capablanca':
        case 'custom-variants':
            return viewId === 'bighouse' ? 'bughouse' : String(viewId);
        case 'chess960':
        case 'variants':
        default:
            return 'chess960';
    }
}

function getVariantSectionLabel(section) {
    return VARIANT_SECTION_LABELS[section] || VARIANT_SECTION_LABELS.chess960;
}

function getVariantSections() {
    return Object.keys(VARIANT_SECTION_LABELS);
}

function getActiveVariantSection() {
    return VARIANT_SECTION_DETAILS[requestedVariantSection]
        ? requestedVariantSection
        : 'chess960';
}

const CAPABLANCA_START_BOARD = 'rnabqkcbnr/pppppppppp/10/10/10/10/PPPPPPPPPP/RNABQKCBNR';
const GOTHIC_START_BOARD = 'rnbaqkcbnr/pppppppppp/10/10/10/10/PPPPPPPPPP/RNBAQKCBNR';

function createVariantFen(board, extras) {
    const metadata = Object.keys(extras || {}).map(key => key + '=' + String(extras[key])).join(';');
    return board + ' w KQkq - 0 1' + (metadata ? ' [' + metadata + ']' : '');
}

function getVariantStartFEN(section, setupName) {
    switch (String(section || '')) {
        case 'three-check':
            return createVariantFen(START_FEN.split(' ')[0], { variant: 'three-check', checks: '0,0' });
        case 'crazyhouse':
            return createVariantFen(START_FEN.split(' ')[0], { variant: 'crazyhouse', wp: '-', bp: '-', promo: '-' });
        case 'bighouse':
        case 'bughouse':
            return createVariantFen(START_FEN.split(' ')[0], { variant: 'bughouse', wp: '-', bp: '-', promo: '-' });
        case 'capablanca':
            return createVariantFen(setupName === 'gothic' ? GOTHIC_START_BOARD : CAPABLANCA_START_BOARD, {
                variant: 'capablanca',
                files: 'abcdefghij',
                ranks: '87654321',
                setup: setupName === 'gothic' ? 'gothic' : 'capablanca',
            });
        default:
            return '';
    }
}

function getVariantDisplayName(state) {
    const variantId = getVariantId(state);
    if (variantId === 'standard') return 'Standard';
    if (variantId === 'capablanca' && state && state.variantSetup === 'gothic') return 'Gothic';
    if (variantId === 'three-check') return 'Three-Check';
    if (variantId === 'crazyhouse') return 'Crazyhouse';
    if (variantId === 'bighouse' || variantId === 'bughouse') return 'Bughouse';
    if (variantId === 'capablanca') return 'Capablanca';
    return getVariantSectionLabel(resolveVariantSection(variantId));
}

function activateVariantGame(section, setupName) {
    const startFen = getVariantStartFEN(section, setupName);
    if (!startFen) return false;
    const controller = ensureGameController();
    applyPlayMode('play');
    if (controller) {
        controller.configure({ startFEN: startFen });
        controller.loadFEN(startFen);
    }
    diagnosticsPreview = null;
    currentBoardFEN = startFen;
    currentGameState = parseFEN(startFen);
    return true;
}

function normalizeAnalysisInfo(info) {
    const safeInfo = info || {};
    return {
        depth: safeInfo.depth != null ? safeInfo.depth : null,
        seldepth: safeInfo.seldepth != null ? safeInfo.seldepth : null,
        score: safeInfo.score != null ? safeInfo.score : null,
        nodes: safeInfo.nodes != null ? safeInfo.nodes : null,
        nps: safeInfo.nps != null ? safeInfo.nps : null,
        time: safeInfo.time != null ? safeInfo.time : null,
        hashfull: safeInfo.hashfull != null ? safeInfo.hashfull : null,
        pv: Array.isArray(safeInfo.pv) ? safeInfo.pv.slice() : (safeInfo.pv ? [safeInfo.pv] : []),
        bestMove: safeInfo.bestMove || null,
    };
}

function resetAnalysisInsights(fen, sourceMode) {
    analysisInsights = createEmptyAnalysisInsights();
    analysisInsights.lastFen = fen || '';
    analysisInsights.sourceMode = sourceMode || '';
}

function appendAnalysisInfo(info) {
    const normalized = normalizeAnalysisInfo(info);
    analysisInsights.history.push(normalized);
    analysisInsights.history = analysisInsights.history.slice(-24);
    analysisInsights.logLines.push(formatSearchInfoLine(normalized));
    analysisInsights.logLines = analysisInsights.logLines.slice(-80);
}

function createAnalysisPosition(fen) {
    if (typeof window.Position !== 'function') {
        throw new Error('Position is not available.');
    }
    const validation = typeof window.validateFEN === 'function'
        ? window.validateFEN(fen)
        : { valid: true };
    if (!validation.valid) {
        throw new Error(validation.error || 'Invalid FEN.');
    }
    const pos = new window.Position();
    pos.loadFEN(fen || 'startpos');
    return pos;
}

function swapFenActiveColor(fen) {
    const state = parseFEN(fen);
    state.activeColor = oppositeColor(state.activeColor);
    return serializeFEN(state);
}

function buildAnalysisMoveInsight(fen, uciMove, info) {
    if (!fen || !uciMove) return null;

    const state = parseFEN(fen);
    const move = findLegalMoveByUCI(state, uciMove);
    if (!move) {
        return {
            sourceFen: fen,
            uci: uciMove,
            san: uciMove,
            score: info && info.score != null ? info.score : null,
            depth: info && info.depth != null ? info.depth : null,
            pv: info && Array.isArray(info.pv) ? info.pv.slice() : [],
            squares: [],
            sideToMove: state.activeColor,
        };
    }

    const nextState = applyMoveToState(state, move);
    let san = moveToUCI(move);
    if (window.Chess2Notation && typeof window.Chess2Notation.formatMoveRecord === 'function') {
        const notation = window.Chess2Notation.formatMoveRecord(move, state, nextState, {
            getGameStatus,
            moveToUCI,
            generateLegalMovesFrom,
        });
        if (notation && notation.san) {
            san = notation.san;
        }
    }

    return {
        sourceFen: fen,
        uci: moveToUCI(move),
        san,
        score: info && info.score != null ? info.score : null,
        depth: info && info.depth != null ? info.depth : null,
        pv: info && Array.isArray(info.pv) ? info.pv.slice() : [],
        squares: [move.from, move.to],
        from: move.from,
        to: move.to,
        nextFen: serializeFEN(nextState),
        sideToMove: state.activeColor,
    };
}

function computeAnalysisRootMoves(fen, depth, limit) {
    if (!window.SEARCH || typeof window.SEARCH.rootMoves !== 'function') {
        return [];
    }
    try {
        const pos = createAnalysisPosition(fen);
        return window.SEARCH.rootMoves(pos, Math.max(1, depth || 1)).slice(0, Math.max(1, limit || 4));
    } catch (error) {
        return [];
    }
}

function computeThreatInsight(fen, depth) {
    if (!window.SEARCH || typeof window.SEARCH.go !== 'function' || typeof window.SEARCH.getInfo !== 'function') {
        return null;
    }
    const threatFen = swapFenActiveColor(fen);
    const pos = createAnalysisPosition(threatFen);
    window.SEARCH.go(pos, { depth: Math.max(1, Math.min(4, depth || 2)) });
    const info = normalizeAnalysisInfo(window.SEARCH.getInfo());
    return buildAnalysisMoveInsight(threatFen, info.bestMove, info);
}

function getAnalysisHighlightSquares() {
    if (requestedAnalysisSection === 'hint' && analysisInsights.hint && Array.isArray(analysisInsights.hint.squares)) {
        return analysisInsights.hint.squares.slice();
    }
    if (requestedAnalysisSection === 'threat' && analysisInsights.threat && Array.isArray(analysisInsights.threat.squares)) {
        return analysisInsights.threat.squares.slice();
    }
    return getRenderedLastMoveSquares();
}

function getBoardDisplaySettings() {
    try {
        const stored = JSON.parse(localStorage.getItem('bbjs-settings') || '{}');
        return stored && typeof stored === 'object' ? stored : {};
    } catch (error) {
        return {};
    }
}

function getConfiguredMultiPvCount() {
    const settings = getBoardDisplaySettings();
    return Math.max(1, Math.min(4, Number(settings.multiPV) || 1));
}

function createArrowFromSquares(squares, options) {
    const arrowOptions = options || {};
    if (!Array.isArray(squares) || squares.length < 2 || !squares[0] || !squares[1]) {
        return null;
    }
    return {
        from: squares[0],
        to: squares[1],
        color: arrowOptions.color || '',
        opacity: arrowOptions.opacity != null ? arrowOptions.opacity : 0.94,
        variant: arrowOptions.variant || 'engine',
        strokeWidth: arrowOptions.strokeWidth != null ? arrowOptions.strokeWidth : null,
        dashArray: arrowOptions.dashArray || '',
    };
}

function createArrowFromUci(uciMove, options) {
    const arrowOptions = options || {};
    const moveText = String(uciMove || '').trim();
    if (moveText.length < 4) return null;
    return {
        from: moveText.slice(0, 2),
        to: moveText.slice(2, 4),
        color: arrowOptions.color || '',
        opacity: arrowOptions.opacity != null ? arrowOptions.opacity : 0.94,
        variant: arrowOptions.variant || 'engine',
        strokeWidth: arrowOptions.strokeWidth != null ? arrowOptions.strokeWidth : null,
        dashArray: arrowOptions.dashArray || '',
    };
}

function createMultiPvArrows(rootMoves, limit, baseOptions) {
    const rootMoveList = Array.isArray(rootMoves) ? rootMoves : [];
    const arrowLimit = Math.max(1, Math.min(rootMoveList.length, limit || 1));
    const palette = ['#f2c14e', '#f6d87c', '#f3e3a8', '#f8efc6'];
    const arrows = [];
    for (let index = 0; index < arrowLimit; index++) {
        const entry = rootMoveList[index];
        const arrow = createArrowFromUci(entry && entry.move, Object.assign({}, baseOptions, {
            color: palette[index] || (baseOptions && baseOptions.color) || '#f2c14e',
            opacity: 0.94 - (index * 0.14),
            strokeWidth: Math.max(7, 11 - index),
        }));
        if (arrow) arrows.push(arrow);
    }
    return arrows;
}

function getPlayBoardArrows() {
    const settings = getBoardDisplaySettings();
    if (settings.showArrows === false) {
        return [];
    }
    if (diagnosticsPreview) {
        const previewArrow = createArrowFromSquares(diagnosticsPreview.moveSquares, {
            color: '#5fd0ff',
            opacity: 0.98,
            variant: 'preview',
            strokeWidth: 10,
        });
        return previewArrow ? [previewArrow] : [];
    }
    const engineArrow = createArrowFromUci(
        currentEngineInfo && (currentEngineInfo.bestMove || (Array.isArray(currentEngineInfo.pv) ? currentEngineInfo.pv[0] : '')),
        {
            color: '#f2c14e',
            opacity: 0.94,
            variant: 'engine',
            strokeWidth: 11,
        }
    );
    return engineArrow ? [engineArrow] : [];
}

function getAnalysisBoardArrows() {
    const settings = getBoardDisplaySettings();
    if (settings.showArrows === false) {
        return [];
    }
    if (diagnosticsPreview) {
        const previewArrow = createArrowFromSquares(diagnosticsPreview.moveSquares, {
            color: '#5fd0ff',
            opacity: 0.98,
            variant: 'preview',
            strokeWidth: 10,
        });
        return previewArrow ? [previewArrow] : [];
    }
    if (requestedAnalysisSection === 'hint' && analysisInsights.hint) {
        const hintArrow = createArrowFromSquares(analysisInsights.hint.squares, {
            color: '#50d27f',
            opacity: 0.98,
            variant: 'hint',
            strokeWidth: 10,
            dashArray: '34 18',
        });
        if (hintArrow) return [hintArrow];
    }
    if (requestedAnalysisSection === 'threat' && analysisInsights.threat) {
        const threatArrow = createArrowFromSquares(analysisInsights.threat.squares, {
            color: '#ff8a6b',
            opacity: 0.98,
            variant: 'threat',
            strokeWidth: 10,
            dashArray: '8 14',
        });
        if (threatArrow) return [threatArrow];
    }
    if (Array.isArray(analysisInsights.rootMoves) && analysisInsights.rootMoves.length) {
        return createMultiPvArrows(analysisInsights.rootMoves, getConfiguredMultiPvCount(), {
            variant: 'engine',
        });
    }
    const engineArrow = createArrowFromUci(
        currentEngineInfo && (currentEngineInfo.bestMove || (Array.isArray(currentEngineInfo.pv) ? currentEngineInfo.pv[0] : '')),
        {
            color: '#f2c14e',
            opacity: 0.94,
            variant: 'engine',
            strokeWidth: 11,
        }
    );
    return engineArrow ? [engineArrow] : [];
}

function maybeStartAnalysisForSection(section) {
    const controller = ensureGameController();
    if (!controller) return;
    const snapshot = controller.getSnapshot();
    const targetSection = section || requestedAnalysisSection;
    if (snapshot.analysis.running) return;
    if (!snapshot.analysis.enabled && targetSection !== 'board') {
        startAnalysisSession();
    }
}

function scheduleOpeningsCatalogWarmup() {
    if (openingsCatalogWarmupScheduled) return;
    openingsCatalogWarmupScheduled = true;

    const runWarmup = function () {
        const openings = window.Chess2Openings;
        if (openings && typeof openings.primeCaches === 'function') {
            openings.primeCaches();
            return;
        }
        if (openings && typeof openings.getEcoCodeCatalog === 'function') {
            openings.getEcoCodeCatalog();
        }
    };

    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(runWarmup, { timeout: 1500 });
        return;
    }

    window.setTimeout(runWarmup, 0);
}

window.addEventListener('chess2:eco-encyclopedia-ready', function handleEcoEncyclopediaReady() {
    if (!document.body) return;
    scheduleOpeningsCatalogWarmup();
    paintPosition(currentBoardFEN);
});

function getPlayModeConfig(mode) {
    if (mode === 'play-online') {
        const localColor = multiplayerState && /^(white|black)$/i.test(String(multiplayerState.localColor || ''))
            ? String(multiplayerState.localColor || '').toLowerCase()
            : '';
        return {
            humanColors: localColor ? [localColor] : [],
            engineColors: [],
        };
    }
    return PLAY_MODE_CONFIGS[mode] || PLAY_MODE_CONFIGS.play;
}

function isHumanControlledColor(color) {
    return getPlayModeConfig(currentPlayMode).humanColors.includes(color);
}

function isEngineControlledColor(color) {
    return getPlayModeConfig(currentPlayMode).engineColors.includes(color);
}

function isPlayModeRoute(route) {
    return /^(play|play-e2e|play-human|play-online)$/.test(String(route || ''));
}

function applyPlayMode(mode) {
    const normalizedMode = /^(live|matchmaking)$/.test(String(mode || '')) ? 'play-online' : mode;
    currentPlayMode = PLAY_MODE_CONFIGS[normalizedMode] ? normalizedMode : 'play';
    if (gameController && typeof gameController.configure === 'function') {
        const modeConfig = getPlayModeConfig(currentPlayMode);
        gameController.configure({
            startFEN: getStartFENForMode(currentPlayMode),
            humanColor: modeConfig.humanColors[0] || null,
            engineColor: modeConfig.engineColors[0] || null,
            humanColors: modeConfig.humanColors.slice(),
            engineColors: modeConfig.engineColors.slice(),
        });
    }
    syncLocalClockState();
}

function createDefaultMultiplayerState() {
    const protocol = window.Chess2NetworkProtocol;
    const serverUrl = protocol && typeof protocol.getDefaultServerUrl === 'function'
        ? protocol.getDefaultServerUrl()
        : 'http://localhost:3000';
    return {
        available: false,
        connected: false,
        connecting: false,
        mode: 'idle',
        message: 'Online play is idle.',
        lastError: '',
        gameId: '',
        localColor: '',
        roomMode: '',
        joinUrl: '',
        joinInputValue: '',
        serverUrl,
        players: {
            white: false,
            black: false,
        },
        roomPlayers: {
            white: null,
            black: null,
        },
        profile: {
            id: '',
            displayName: 'Guest',
            rating: 1200,
            games: 0,
            wins: 0,
            losses: 0,
            draws: 0,
        },
        liveGames: [],
        leaderboard: [],
        recentResults: [],
        chatMessages: [],
        drawOffer: null,
        clubs: [],
        tournaments: [],
        matchContext: null,
        spectating: false,
        spectatingGameId: '',
        spectatorCount: 0,
        currentResult: null,
        queueSize: 0,
        rated: false,
    };
}

function loadGameOptions() {
    try {
        const stored = JSON.parse(localStorage.getItem(GAME_OPTIONS_KEY) || '{}');
        return normalizeGameOptions(Object.assign({}, GAME_OPTION_DEFAULTS, stored));
    } catch (error) {
        return Object.assign({}, GAME_OPTION_DEFAULTS);
    }
}

function saveGameOptions() {
    try {
        localStorage.setItem(GAME_OPTIONS_KEY, JSON.stringify(gameOptions));
    } catch (error) {
        console.warn('UI.js: unable to persist game options.', error);
    }
}

function loadMultiplayerChatDraft() {
    try {
        return String(localStorage.getItem(MULTIPLAYER_CHAT_DRAFT_KEY) || '').trim();
    } catch (error) {
        return '';
    }
}

function saveMultiplayerChatDraft(value) {
    multiplayerChatDraft = String(value || '');
    try {
        localStorage.setItem(MULTIPLAYER_CHAT_DRAFT_KEY, multiplayerChatDraft);
    } catch (error) {
        console.warn('UI.js: unable to persist multiplayer chat draft.', error);
    }
}

function normalizeGameOptions(options) {
    const next = Object.assign({}, GAME_OPTION_DEFAULTS, options || {});
    next.timeControl = Math.max(0, Number(next.timeControl) || 0);
    next.bonusMode = next.bonusMode === 'delay' ? 'delay' : 'increment';
    next.bonusSeconds = Math.max(0, Number(next.bonusSeconds) || 0);
    next.handicap = getHandicapPreset(next.handicap).value;
    return next;
}

function createInactiveLocalGameOptions() {
    return {
        applies: false,
        timeControl: 0,
        bonusMode: 'increment',
        bonusSeconds: 0,
        handicap: 'none',
        startFEN: START_FEN,
    };
}

function createAppliedLocalGameOptions(options) {
    const normalized = normalizeGameOptions(options);
    return Object.assign({}, normalized, {
        applies: true,
        startFEN: buildHandicapStartFEN(normalized.handicap),
    });
}

function createIdleClockState() {
    return {
        enabled: false,
        whiteMs: 0,
        blackMs: 0,
        activeColor: 'white',
        turnStartedAt: 0,
        running: false,
        flaggedColor: '',
        bonusMode: 'increment',
        bonusSeconds: 0,
    };
}

function getHandicapPreset(value) {
    return HANDICAP_PRESETS.find(preset => preset.value === value) || HANDICAP_PRESETS[0];
}

function buildHandicapStartFEN(handicap) {
    const preset = getHandicapPreset(handicap);
    if (!preset.removeSquare) return START_FEN;

    const state = parseFEN(START_FEN);
    setPieceAt(state, preset.removeSquare, null);

    if (preset.removeSquare === 'a1') state.castling = removeCastlingRights(state.castling, 'Q');
    if (preset.removeSquare === 'h1') state.castling = removeCastlingRights(state.castling, 'K');
    if (preset.removeSquare === 'a8') state.castling = removeCastlingRights(state.castling, 'q');
    if (preset.removeSquare === 'h8') state.castling = removeCastlingRights(state.castling, 'k');

    return serializeFEN(state);
}

function formatTimeControlLabel(seconds) {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    if (!safeSeconds) return 'Unlimited';
    if (safeSeconds % 60 === 0) {
        const minutes = safeSeconds / 60;
        return minutes + ' min';
    }
    return safeSeconds + ' sec';
}

function formatBonusLabel(mode, seconds) {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    if (!safeSeconds) return 'None';
    return safeSeconds + 's ' + (mode === 'delay' ? 'delay' : 'increment');
}

function formatGameOptionsSummary(options) {
    const safe = options && options.applies !== false
        ? options
        : normalizeGameOptions(options || gameOptions);
    return formatTimeControlLabel(safe.timeControl) + ' • ' + formatBonusLabel(safe.bonusMode, safe.bonusSeconds) + ' • ' + getHandicapPreset(safe.handicap).label;
}

function getStartFENForMode(mode) {
    if (mode === 'play-human' && activeLocalGameOptions && activeLocalGameOptions.applies) {
        return activeLocalGameOptions.startFEN || START_FEN;
    }
    return START_FEN;
}

function hasSupportedPlayBoardGeometry(state) {
    const filesLength = String((state && state.files) || FILES).length;
    const ranksLength = String((state && state.ranks) || RANKS).length;
    return (filesLength === 8 && ranksLength === 8) || (filesLength === 10 && ranksLength === 8);
}

function ensureSupportedPlayBoardState() {
    if (isPuzzleSessionActive()) return;
    if (currentPlayMode === 'play-online') return;
    if (hasSupportedPlayBoardGeometry(currentGameState)) return;

    const controller = ensureGameController();
    const startFEN = getStartFENForMode(currentPlayMode);
    if (!controller) {
        currentBoardFEN = startFEN;
        currentGameState = parseFEN(startFEN);
        return;
    }

    controller.configure({ startFEN });
    controller.startNewGame();
}

function shouldUseTimedLocalClock() {
    return currentPlayMode === 'play-human'
        && Boolean(activeLocalGameOptions && activeLocalGameOptions.applies)
        && Number(activeLocalGameOptions.timeControl) > 0;
}

function shouldRunLocalClock() {
    return shouldUseTimedLocalClock()
        && currentMoveIndex === moveHistory.length - 1
        && !localClockState.flaggedColor
        && !getGameStatus(currentGameState).isOver;
}

function getClockRemainingMs(color, now) {
    const baseMs = color === 'white' ? localClockState.whiteMs : localClockState.blackMs;
    if (!localClockState.enabled || !localClockState.running || localClockState.activeColor !== color) {
        return Math.max(0, baseMs);
    }

    const elapsed = Math.max(0, now - localClockState.turnStartedAt);
    if (localClockState.bonusMode === 'delay') {
        const delayMs = localClockState.bonusSeconds * 1000;
        return Math.max(0, baseMs - Math.max(0, elapsed - delayMs));
    }

    return Math.max(0, baseMs - elapsed);
}

function createClockSnapshot(now) {
    const timestamp = typeof now === 'number' ? now : Date.now();
    const whiteMs = getClockRemainingMs('white', timestamp);
    const blackMs = getClockRemainingMs('black', timestamp);
    const flaggedColor = localClockState.flaggedColor
        || (localClockState.enabled && localClockState.running && ((localClockState.activeColor === 'white' && whiteMs <= 0) || (localClockState.activeColor === 'black' && blackMs <= 0))
            ? localClockState.activeColor
            : '');

    return {
        enabled: localClockState.enabled,
        running: localClockState.running,
        activeColor: localClockState.activeColor,
        whiteMs,
        blackMs,
        flaggedColor,
        bonusMode: localClockState.bonusMode,
        bonusSeconds: localClockState.bonusSeconds,
    };
}

function formatClockTime(milliseconds) {
    const safeMs = Math.max(0, Number(milliseconds) || 0);
    if (safeMs <= 0) return '0:00';

    const totalSeconds = Math.floor(safeMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return hours + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    if (safeMs < 20000) {
        const tenths = Math.floor((safeMs % 1000) / 100);
        return minutes + ':' + String(seconds).padStart(2, '0') + '.' + tenths;
    }

    return minutes + ':' + String(seconds).padStart(2, '0');
}

function stopLocalClockTicker() {
    if (localClockTimer) {
        window.clearInterval(localClockTimer);
        localClockTimer = null;
    }
}

function ensureLocalClockTicker() {
    if (localClockTimer || !localClockState.enabled) return;
    localClockTimer = window.setInterval(() => {
        const snapshot = createClockSnapshot();
        if (snapshot.flaggedColor) {
            handleLocalClockFlag(snapshot.flaggedColor);
            return;
        }
        if (!localClockState.running) return;
        renderPlayView();
        if (isPlayViewActive()) {
            updatePlayState();
        }
    }, 200);
}

function resetLocalClockForActiveGame() {
    stopLocalClockTicker();
    localClockState = createIdleClockState();

    if (!shouldUseTimedLocalClock()) {
        renderPlayView();
        return;
    }

    const baseMs = Number(activeLocalGameOptions.timeControl) * 1000;
    localClockState = {
        enabled: true,
        whiteMs: baseMs,
        blackMs: baseMs,
        activeColor: 'white',
        turnStartedAt: Date.now(),
        running: true,
        flaggedColor: '',
        bonusMode: activeLocalGameOptions.bonusMode,
        bonusSeconds: activeLocalGameOptions.bonusSeconds,
    };
    ensureLocalClockTicker();
}

function pauseLocalClock() {
    const snapshot = createClockSnapshot();
    localClockState.whiteMs = snapshot.whiteMs;
    localClockState.blackMs = snapshot.blackMs;
    localClockState.running = false;
    localClockState.turnStartedAt = 0;
    if (!snapshot.flaggedColor) {
        stopLocalClockTicker();
    }
}

function resumeLocalClock() {
    if (!shouldUseTimedLocalClock() || localClockState.flaggedColor) return;
    if (localClockState.running) {
        ensureLocalClockTicker();
        return;
    }
    localClockState.running = true;
    localClockState.turnStartedAt = Date.now();
    ensureLocalClockTicker();
}

function syncLocalClockState() {
    if (!shouldUseTimedLocalClock()) {
        pauseLocalClock();
        return;
    }

    if (shouldRunLocalClock()) {
        resumeLocalClock();
    } else {
        pauseLocalClock();
    }
}

function handleLocalClockFlag(color) {
    const flaggedColor = color === 'black' ? 'black' : 'white';
    const now = createClockSnapshot();
    localClockState.whiteMs = now.whiteMs;
    localClockState.blackMs = now.blackMs;
    localClockState.running = false;
    localClockState.turnStartedAt = 0;
    localClockState.flaggedColor = flaggedColor;
    stopLocalClockTicker();
    renderPlayView();
}

function completeLocalClockTurn(movingColor) {
    if (!shouldUseTimedLocalClock() || !movingColor || localClockState.flaggedColor) return;

    const snapshot = createClockSnapshot();
    if (snapshot.flaggedColor) {
        handleLocalClockFlag(snapshot.flaggedColor);
        return;
    }

    if (movingColor === 'white') {
        localClockState.whiteMs = snapshot.whiteMs;
        if (localClockState.bonusMode === 'increment') {
            localClockState.whiteMs += localClockState.bonusSeconds * 1000;
        }
    } else {
        localClockState.blackMs = snapshot.blackMs;
        if (localClockState.bonusMode === 'increment') {
            localClockState.blackMs += localClockState.bonusSeconds * 1000;
        }
    }

    localClockState.activeColor = oppositeColor(movingColor);
    localClockState.turnStartedAt = Date.now();
    localClockState.running = true;
    ensureLocalClockTicker();
}

function hasPendingGameOptionChanges() {
    if (!activeLocalGameOptions || !activeLocalGameOptions.applies) return false;
    return ['timeControl', 'bonusMode', 'bonusSeconds', 'handicap'].some(key => activeLocalGameOptions[key] !== gameOptions[key]);
}

function getClockInfo() {
    const snapshot = createClockSnapshot();
    const activeOptions = activeLocalGameOptions && activeLocalGameOptions.applies
        ? activeLocalGameOptions
        : normalizeGameOptions(gameOptions);
    const flaggedColor = snapshot.flaggedColor;
    const activeColorLabel = snapshot.activeColor === 'black' ? 'Black' : 'White';
    let detail = 'New Human vs Human games use ' + formatGameOptionsSummary(gameOptions) + '.';

    if (currentPlayMode === 'play-human' && activeLocalGameOptions.applies) {
        detail = 'Current Human vs Human game uses ' + formatGameOptionsSummary(activeLocalGameOptions) + '.';
        if (flaggedColor) {
            detail = (flaggedColor === 'white' ? 'White' : 'Black') + ' has flagged on time.';
        } else if (snapshot.enabled) {
            detail += ' ' + activeColorLabel + ' clock is running.';
        } else {
            detail += ' This game is untimed.';
        }
        if (hasPendingGameOptionChanges()) {
            detail += ' Saved options changed and will apply on the next new game.';
        }
    }

    return {
        enabled: snapshot.enabled,
        running: snapshot.running,
        activeColor: snapshot.activeColor,
        flaggedColor,
        whiteClock: snapshot.enabled ? formatClockTime(snapshot.whiteMs) : 'Untimed',
        blackClock: snapshot.enabled ? formatClockTime(snapshot.blackMs) : 'Untimed',
        timeControlLabel: formatTimeControlLabel(activeOptions.timeControl),
        bonusLabel: formatBonusLabel(activeOptions.bonusMode, activeOptions.bonusSeconds),
        handicapLabel: getHandicapPreset(activeOptions.handicap).label,
        detail,
        pendingChanges: hasPendingGameOptionChanges(),
    };
}

function resolveSettingsSection(viewId) {
    switch (String(viewId || '')) {
        case 'increment':
            return 'increment';
        case 'handicap':
            return 'handicap';
        case 'time-controls':
        case 'settings':
        default:
            return 'time-controls';
    }
}

function updateGameOption(key, value) {
    gameOptions = normalizeGameOptions(Object.assign({}, gameOptions, { [key]: value }));
    saveGameOptions();
    renderSettingsView();
    renderPlayView();
}

function resetGameOptions() {
    gameOptions = Object.assign({}, GAME_OPTION_DEFAULTS);
    saveGameOptions();
    renderSettingsView();
    renderPlayView();
}

function renderSettingsView() {
    const root = document.getElementById('view-settings');
    if (!root) return;

    const activeHandicap = getHandicapPreset(gameOptions.handicap);
    const timeControlOptions = [60, 180, 300, 600, 900, 1800, 0];
    const bonusOptions = [0, 1, 2, 3, 5, 10, 30];
    const sectionTitle = requestedSettingsSection === 'increment'
        ? 'Increment / Delay'
        : (requestedSettingsSection === 'handicap' ? 'Handicap Modes' : 'Time Controls');
    let sectionMarkup = '';

    if (requestedSettingsSection === 'increment') {
        sectionMarkup = [
            '<div class="settings-grid">',
            '<label class="settings-field">',
            '<span class="settings-field-label">Bonus mode</span>',
            '<select class="settings-select" data-game-option="bonusMode">',
            '<option value="increment"' + (gameOptions.bonusMode === 'increment' ? ' selected' : '') + '>Increment</option>',
            '<option value="delay"' + (gameOptions.bonusMode === 'delay' ? ' selected' : '') + '>Delay</option>',
            '</select>',
            '<span class="settings-help">Increment adds time after each move. Delay waits before the clock starts counting down.</span>',
            '</label>',
            '<label class="settings-field">',
            '<span class="settings-field-label">Bonus seconds</span>',
            '<select class="settings-select" data-game-option="bonusSeconds">',
            bonusOptions.map(value => '<option value="' + value + '"' + (gameOptions.bonusSeconds === value ? ' selected' : '') + '>' + (value ? value + ' seconds' : 'None') + '</option>').join(''),
            '</select>',
            '<span class="settings-help">Applied only to Human vs Human timed games.</span>',
            '</label>',
            '</div>',
        ].join('');
    } else if (requestedSettingsSection === 'handicap') {
        sectionMarkup = [
            '<div class="settings-grid settings-grid-single">',
            '<label class="settings-field">',
            '<span class="settings-field-label">Starting position handicap</span>',
            '<select class="settings-select" data-game-option="handicap">',
            HANDICAP_PRESETS.map(preset => '<option value="' + preset.value + '"' + (gameOptions.handicap === preset.value ? ' selected' : '') + '>' + preset.label + '</option>').join(''),
            '</select>',
            '<span class="settings-help">' + activeHandicap.description + ' Applies when you start a new Human vs Human game.</span>',
            '</label>',
            '</div>',
        ].join('');
    } else {
        sectionMarkup = [
            '<div class="settings-grid settings-grid-single">',
            '<label class="settings-field">',
            '<span class="settings-field-label">Base time per side</span>',
            '<select class="settings-select" data-game-option="timeControl">',
            timeControlOptions.map(value => '<option value="' + value + '"' + (gameOptions.timeControl === value ? ' selected' : '') + '>' + formatTimeControlLabel(value) + '</option>').join(''),
            '</select>',
            '<span class="settings-help">Unlimited disables clocks. Any other value starts a timed Human vs Human game.</span>',
            '</label>',
            '</div>',
        ].join('');
    }

    root.innerHTML = [
        '<div class="settings-layout">',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Game Options</h2>',
        '<p class="settings-lead">These options apply to new Human vs Human games only. Engine games and online games keep their existing flow.</p>',
        '<div class="settings-tabs">',
        '<button type="button" class="board-ctrl-btn settings-tab' + (requestedSettingsSection === 'time-controls' ? ' active' : '') + '" data-settings-section="time-controls">Time Controls</button>',
        '<button type="button" class="board-ctrl-btn settings-tab' + (requestedSettingsSection === 'increment' ? ' active' : '') + '" data-settings-section="increment">Increment / Delay</button>',
        '<button type="button" class="board-ctrl-btn settings-tab' + (requestedSettingsSection === 'handicap' ? ' active' : '') + '" data-settings-section="handicap">Handicap Modes</button>',
        '</div>',
        '<div class="settings-card">',
        '<h3 class="play-panel-title settings-subtitle">' + sectionTitle + '</h3>',
        sectionMarkup,
        '</div>',
        '</section>',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Current Summary</h2>',
        '<div class="engine-summary-grid">',
        '<div class="engine-stat"><span class="engine-stat-label">Base Time</span><span class="engine-stat-value">' + formatTimeControlLabel(gameOptions.timeControl) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Bonus</span><span class="engine-stat-value">' + formatBonusLabel(gameOptions.bonusMode, gameOptions.bonusSeconds) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Handicap</span><span class="engine-stat-value">' + activeHandicap.label + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Applies To</span><span class="engine-stat-value">Human vs Human</span></div>',
        '</div>',
        '<div class="engine-pv">Start a new Human vs Human game to apply these options. The current live game is not rewritten mid-play.</div>',
        '<div class="play-action-bar settings-actions">',
        '<button type="button" class="play-action-btn" data-settings-action="start-human-game">Start Human vs Human Game</button>',
        '<button type="button" class="play-action-btn" data-settings-action="reset-options">Reset Options</button>',
        '</div>',
        '</section>',
        '</div>',
    ].join('');

    if (!root.dataset.bound) {
        root.dataset.bound = 'true';
        root.addEventListener('change', event => {
            const field = event.target.closest('[data-game-option]');
            if (!field) return;
            const key = field.getAttribute('data-game-option');
            const rawValue = field.value;
            const nextValue = /^(timeControl|bonusSeconds)$/.test(key) ? Number(rawValue) : rawValue;
            updateGameOption(key, nextValue);
        });

        root.addEventListener('click', event => {
            const sectionButton = event.target.closest('[data-settings-section]');
            if (sectionButton) {
                requestedSettingsSection = sectionButton.getAttribute('data-settings-section') || 'time-controls';
                renderSettingsView();
                return;
            }

            const actionButton = event.target.closest('[data-settings-action]');
            if (!actionButton) return;
            const action = actionButton.getAttribute('data-settings-action');
            if (action === 'reset-options') {
                resetGameOptions();
                return;
            }
            if (action === 'start-human-game') {
                if (typeof window.Chess2ShowView === 'function') {
                    window.Chess2ShowView('play-human');
                }
                startNewGame();
            }
        });
    }
}

function renderTrainingView() {
    const root = document.getElementById('view-training');
    if (!root) return;

    const section = getActiveTrainingSection();
    ensureTrainingCurrentIndex(section);
    const runtime = getTrainingSectionRuntime(section);
    const drill = getCurrentTrainingDrill(section);
    const tabsMarkup = getTrainingSections().map(trainingSection => {
        return '<button type="button" class="analysis-section-tab' + (section === trainingSection ? ' active' : '') + '" data-training-section="' + escapeMarkup(trainingSection) + '">' + escapeMarkup(getTrainingSectionLabel(trainingSection).replace(' Trainer', '')) + '</button>';
    }).join('');
    const difficultyTabsMarkup = getTrainingDifficultyKeys().map(difficulty => {
        return '<button type="button" class="analysis-section-tab' + (getTrainingDifficultyPreference(section) === difficulty ? ' active' : '') + '" data-training-difficulty="' + escapeMarkup(difficulty) + '">' + escapeMarkup(getTrainingDifficultyLabel(difficulty)) + '</button>';
    }).join('');

    root.innerHTML = [
        '<div class="settings-layout training-layout">',
        '<div>',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Training Workspace</h2>',
        '<p class="settings-lead">Each Training drawer item now opens a real drill. The deck now rotates by due review status instead of simple sequence, and you can filter by difficulty when you want easier or harder reps.</p>',
        '<div class="analysis-section-tabs training-section-tabs">',
        tabsMarkup,
        '</div>',
        '<div class="analysis-section-tabs training-section-tabs">',
        difficultyTabsMarkup,
        '</div>',
        '</section>',
        renderTrainingActiveCard(section, runtime, drill),
        '</div>',
        renderTrainingSummaryCard(section),
        '</div>',
    ].join('');

    if (!root.dataset.bound) {
        root.dataset.bound = 'true';
        root.addEventListener('click', event => {
            const activeSection = getActiveTrainingSection();
            const sectionButton = event.target.closest('[data-training-section]');
            if (sectionButton) {
                requestedTrainingSection = sectionButton.getAttribute('data-training-section') || 'tactics';
                renderTrainingView();
                return;
            }

            const difficultyButton = event.target.closest('[data-training-difficulty]');
            if (difficultyButton) {
                setTrainingDifficultyPreference(activeSection, difficultyButton.getAttribute('data-training-difficulty') || 'all');
                setTrainingCurrentIndex(activeSection, selectTrainingDrillIndex(activeSection, { advanceStep: false, excludeCurrent: false }));
                resetTrainingSectionRuntime(activeSection);
                renderTrainingView();
                return;
            }

            const squareButton = event.target.closest('[data-training-square]');
            if (squareButton) {
                handleTrainingSquareClick(activeSection, squareButton.getAttribute('data-training-square') || '');
                return;
            }

            const choiceButton = event.target.closest('[data-training-choice]');
            if (choiceButton) {
                submitTrainingChoice(activeSection, choiceButton.getAttribute('data-training-choice') || '');
                return;
            }

            if (event.target.closest('[data-training-submit-move]')) {
                submitTrainingMove(activeSection);
                return;
            }

            if (event.target.closest('[data-training-submit-knight]')) {
                submitKnightVision(activeSection);
                return;
            }

            if (event.target.closest('[data-training-hint]')) {
                const runtimeState = getTrainingSectionRuntime(activeSection);
                runtimeState.hintVisible = !runtimeState.hintVisible;
                renderTrainingView();
                return;
            }

            if (event.target.closest('[data-training-next]')) {
                nextTrainingDrill(activeSection);
                renderTrainingView();
                return;
            }

            if (event.target.closest('[data-training-reset]')) {
                resetTrainingSectionRuntime(activeSection);
                renderTrainingView();
                return;
            }

            if (event.target.closest('[data-training-clear]')) {
                const runtimeState = getTrainingSectionRuntime(activeSection);
                runtimeState.moveInput = '';
                runtimeState.selectedFrom = null;
                runtimeState.knightSelections = [];
                runtimeState.selectedChoice = null;
                runtimeState.feedback = '';
                runtimeState.tone = 'info';
                runtimeState.graded = false;
                renderTrainingView();
                return;
            }

            if (event.target.closest('[data-training-reveal]')) {
                const runtimeState = getTrainingSectionRuntime(activeSection);
                runtimeState.hiddenBoard = !runtimeState.hiddenBoard;
                renderTrainingView();
                return;
            }

            const routeButton = event.target.closest('[data-training-route]');
            if (!routeButton) return;
            const route = routeButton.getAttribute('data-training-route') || 'analysis';
            if (typeof window.Chess2ShowView === 'function') {
                window.Chess2ShowView(route);
            }
        });

        root.addEventListener('input', event => {
            const moveInput = event.target.closest('[data-training-move-input]');
            if (!moveInput) return;
            const runtimeState = getTrainingSectionRuntime(requestedTrainingSection);
            runtimeState.moveInput = String(moveInput.value || '').trim().toLowerCase();
        });

        root.addEventListener('keydown', event => {
            const moveInput = event.target.closest('[data-training-move-input]');
            if (!moveInput || event.key !== 'Enter') return;
            event.preventDefault();
            submitTrainingMove(requestedTrainingSection);
        });
    }
}

function launchVariantWorkspace(section, route) {
    const details = VARIANT_SECTION_DETAILS[section] || VARIANT_SECTION_DETAILS.chess960;
    const targetRoute = route || details.primaryRoute || 'play';
    const playableActivated = activateVariantGame(section, details.variantSetup || '');
    if (typeof window.Chess2ShowView === 'function') {
        window.Chess2ShowView(targetRoute);
    }
    if (playableActivated) {
        setPlayStatus(details.title + ' loaded.', 'ready');
        paintPosition(currentBoardFEN);
        return;
    }
    if (details.previewFEN) {
        renderFEN(details.previewFEN);
        setPlayStatus(details.title + ' sandbox loaded. ' + details.supportNote, 'ready');
    }
}

function renderPuzzleActionButtons(details) {
    const actions = [];
    if (details.primaryAction && details.primaryRoute) {
        actions.push('<button type="button" class="play-action-btn" data-puzzle-route="' + escapeMarkup(details.primaryRoute) + '">' + escapeMarkup(details.primaryAction) + '</button>');
    }
    if (details.secondaryAction && details.secondaryRoute) {
        actions.push('<button type="button" class="play-action-btn secondary" data-puzzle-route="' + escapeMarkup(details.secondaryRoute) + '">' + escapeMarkup(details.secondaryAction) + '</button>');
    }
    return actions.join('');
}

function renderPuzzlesSummaryCard(section) {
    const details = PUZZLE_SECTION_DETAILS[section] || PUZZLE_SECTION_DETAILS['daily-puzzle'];
    const runtime = ensurePuzzleRuntime();
    const importedCount = getImportedPuzzleLibrary().length;
    return [
        '<aside class="settings-card variant-summary-card">',
        '<h3 class="play-panel-title settings-subtitle">Puzzle Route Status</h3>',
        '<div class="engine-stats-grid">',
        '<div class="engine-stat"><span class="engine-stat-label">Section</span><span class="engine-stat-value">' + escapeMarkup(details.title) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Support</span><span class="engine-stat-value">' + escapeMarkup(details.support) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Imported</span><span class="engine-stat-value">' + escapeMarkup(String(importedCount)) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Daily Streak</span><span class="engine-stat-value">' + escapeMarkup(String(runtime.progress.daily.streak)) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Rush Best</span><span class="engine-stat-value">' + escapeMarkup(String(runtime.progress.rushBest)) + '</span></div>',
        '</div>',
        '<div class="engine-pv"><strong>Format:</strong> ' + escapeMarkup(details.format) + '</div>',
        '<div class="engine-pv"><strong>Current Note:</strong> ' + escapeMarkup(details.supportNote) + '</div>',
        '</aside>',
    ].join('');
}

function renderPuzzlesView() {
    const root = document.getElementById('view-puzzles');
    if (!root) return;

    const section = getActivePuzzleSection();
    const details = PUZZLE_SECTION_DETAILS[section] || PUZZLE_SECTION_DETAILS['daily-puzzle'];
    const runtime = ensurePuzzleRuntime();
    const importedCount = getImportedPuzzleLibrary().length;
    const puzzlePoolCount = getPuzzlePoolForSection(section).length;
    const tabsMarkup = getPuzzleSections().map(puzzleSection => {
        return '<button type="button" class="analysis-section-tab' + (puzzleSection === section ? ' active' : '') + '" data-puzzle-section="' + escapeMarkup(puzzleSection) + '">' + escapeMarkup(getPuzzleSectionLabel(puzzleSection)) + '</button>';
    }).join('');

    let sectionBody = [
        '<div class="settings-card variant-card">',
        '<h3 class="play-panel-title settings-subtitle">Format</h3>',
        '<div class="engine-pv">' + escapeMarkup(details.format) + '</div>',
        '<div class="engine-pv"><strong>Current Support:</strong> ' + escapeMarkup(details.supportNote) + '</div>',
        '<div class="engine-pv"><strong>Available Puzzles:</strong> ' + escapeMarkup(String(puzzlePoolCount || 0)) + '</div>',
        '<div class="play-action-bar settings-actions">',
        renderPuzzleActionButtons(details),
        '</div>',
        '</div>',
        '<div class="settings-card variant-card">',
        '<h3 class="play-panel-title settings-subtitle">Mode Notes</h3>',
        '<div class="engine-pv">' + escapeMarkup(details.summary) + '</div>',
        '<div class="engine-pv">Imported puzzle files immediately expand the pool used by daily, rush, battle, and thematic sessions.</div>',
        '</div>',
    ].join('');

    if (section === 'puzzle-import') {
        sectionBody = [
            '<div class="settings-card variant-card">',
            '<h3 class="play-panel-title settings-subtitle">Import Source</h3>',
            '<div class="engine-pv">Import JSON, JSONL, CSV, TSV, or plain text rows. Each puzzle needs a FEN plus at least one UCI move.</div>',
            '<div class="engine-pv">Supported columns include <strong>fen</strong>, <strong>solution</strong> or <strong>moves</strong>, plus optional <strong>theme</strong>, <strong>title</strong>, <strong>difficulty</strong>, and <strong>playerColor</strong>.</div>',
            '<div class="play-action-bar settings-actions">',
            '<button type="button" class="play-action-btn" data-puzzle-import-action="import">Import Puzzle File</button>',
            '<button type="button" class="play-action-btn secondary" data-puzzle-import-action="export">Export Imported Library</button>',
            '<button type="button" class="play-action-btn secondary" data-puzzle-import-action="clear">Clear Imported Library</button>',
            '</div>',
            '</div>',
            '<div class="settings-card variant-card">',
            '<h3 class="play-panel-title settings-subtitle">Library Status</h3>',
            '<div class="engine-pv"><strong>Built-in Puzzles:</strong> ' + escapeMarkup(String(BUILTIN_PUZZLE_LIBRARY.length)) + '</div>',
            '<div class="engine-pv"><strong>Imported Puzzles:</strong> ' + escapeMarkup(String(importedCount)) + '</div>',
            '<div class="engine-pv"><strong>Storage:</strong> Imported entries persist in local storage and feed all puzzle play modes immediately.</div>',
            '</div>',
        ].join('');
    }

    root.innerHTML = [
        '<div class="settings-layout variant-layout">',
        '<div>',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Puzzles Workspace</h2>',
        '<p class="settings-lead">Puzzle routes now either launch playable sessions on the main board or open the import workspace for managing the shared puzzle library.</p>',
        '<div class="analysis-section-tabs variant-section-tabs">',
        tabsMarkup,
        '</div>',
        '</section>',
        '<section class="play-panel variant-panel">',
        '<h2 class="play-panel-title">' + escapeMarkup(details.title) + '</h2>',
        '<div class="variant-badge-row">',
        '<span class="variant-support-pill">' + escapeMarkup(details.support) + '</span>',
        '<span class="variant-support-pill secondary">Library Ready</span>',
        '</div>',
        '<p class="settings-lead">' + escapeMarkup(details.summary) + '</p>',
        (runtime.feedback && section === 'puzzle-import'
            ? '<div class="engine-pv"><strong>Status:</strong> ' + escapeMarkup(runtime.feedback) + '</div>'
            : ''),
        '<div class="variant-grid">',
        sectionBody,
        '</div>',
        '</section>',
        '</div>',
        renderPuzzlesSummaryCard(section),
        '</div>',
    ].join('');

    if (!root.dataset.bound) {
        root.dataset.bound = 'true';
        root.addEventListener('click', event => {
            const sectionButton = event.target.closest('[data-puzzle-section]');
            if (sectionButton) {
                requestedPuzzleSection = resolvePuzzleSection(sectionButton.getAttribute('data-puzzle-section'));
                if (isPlayablePuzzleSection(requestedPuzzleSection) && typeof window.Chess2ShowView === 'function') {
                    window.Chess2ShowView(requestedPuzzleSection);
                    return;
                }
                renderPuzzlesView();
                return;
            }

            const importActionButton = event.target.closest('[data-puzzle-import-action]');
            if (importActionButton) {
                const action = importActionButton.getAttribute('data-puzzle-import-action');
                if (action === 'import') {
                    importPuzzleDatabase().then(result => {
                        const runtime = ensurePuzzleRuntime();
                        runtime.feedback = result && result.ok
                            ? ('Imported ' + result.imported + ' puzzles from ' + result.fileName + '.')
                            : ((result && !result.cancelled && result.error) || 'Puzzle import did not complete.');
                        runtime.tone = result && result.ok ? 'ready' : 'over';
                        renderPuzzlesView();
                    });
                    return;
                }
                if (action === 'export') {
                    if (window.Chess2Storage && typeof window.Chess2Storage.downloadText === 'function') {
                        window.Chess2Storage.downloadText('chess2-imported-puzzles.json', JSON.stringify(getImportedPuzzleLibrary(), null, 2));
                    }
                    return;
                }
                if (action === 'clear') {
                    const runtime = ensurePuzzleRuntime();
                    runtime.importedLibrary = [];
                    saveImportedPuzzleLibrary([]);
                    renderPuzzlesView();
                    return;
                }
            }

            const routeButton = event.target.closest('[data-puzzle-route]');
            if (!routeButton) return;
            const route = routeButton.getAttribute('data-puzzle-route') || 'tactics';
            if (isPlayablePuzzleSection(route)) {
                requestedPuzzleSection = route;
            }
            if (typeof window.Chess2ShowView === 'function') {
                window.Chess2ShowView(route);
            }
            if (route === 'matchmaking' && typeof startGlobalMatchmaking === 'function') {
                startGlobalMatchmaking();
            }
        });
    }
}

function renderVariantActionButtons(section, details) {
    const actions = [];
    if (details.primaryAction && details.primaryRoute) {
        actions.push('<button type="button" class="play-action-btn" data-variant-action="primary">' + escapeMarkup(details.primaryAction) + '</button>');
    }
    if (section === 'capablanca') {
        actions.push('<button type="button" class="play-action-btn secondary" data-variant-action="alternate">Load Gothic Setup</button>');
    }
    if (details.previewFEN) {
        actions.push('<button type="button" class="play-action-btn secondary" data-variant-action="analysis">Load On Analysis Board</button>');
    }
    actions.push('<button type="button" class="play-action-btn secondary" data-variant-action="play">Open Play Board</button>');
    return actions.join('');
}

function renderVariantsSummaryCard(section) {
    const details = VARIANT_SECTION_DETAILS[section] || VARIANT_SECTION_DETAILS.chess960;
    const previewReady = getVariantSections().filter(key => Boolean(VARIANT_SECTION_DETAILS[key].previewFEN)).length;
    const infoOnly = getVariantSections().filter(key => !VARIANT_SECTION_DETAILS[key].previewFEN).length;
    return [
        '<section class="play-panel variant-summary-card">',
        '<h2 class="play-panel-title">Variant Summary</h2>',
        '<div class="engine-summary-grid">',
        '<div class="engine-stat"><span class="engine-stat-label">Current Variant</span><span class="engine-stat-value">' + escapeMarkup(details.title) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Support Tier</span><span class="engine-stat-value">' + escapeMarkup(details.support) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Preview Routes</span><span class="engine-stat-value">' + escapeMarkup(String(previewReady)) + '</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Info-Only Routes</span><span class="engine-stat-value">' + escapeMarkup(String(infoOnly)) + '</span></div>',
        '</div>',
        '<div class="engine-pv"><strong>Support Note:</strong> ' + escapeMarkup(details.supportNote) + '</div>',
        '<div class="engine-pv"><strong>Current Route:</strong> ' + escapeMarkup(details.primaryRoute || 'play') + '</div>',
        '</section>',
    ].join('');
}

function renderVariantsView() {
    const root = document.getElementById('view-variants');
    if (!root) return;

    const section = getActiveVariantSection();
    const details = VARIANT_SECTION_DETAILS[section] || VARIANT_SECTION_DETAILS.chess960;
    const tabsMarkup = getVariantSections().map(variantSection => {
        return '<button type="button" class="analysis-section-tab' + (variantSection === section ? ' active' : '') + '" data-variant-section="' + escapeMarkup(variantSection) + '">' + escapeMarkup(getVariantSectionLabel(variantSection)) + '</button>';
    }).join('');

    root.innerHTML = [
        '<div class="settings-layout variant-layout">',
        '<div>',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Variants Workspace</h2>',
        '<p class="settings-lead">Each Variants drawer item now opens a working workspace. Routes with compatible 8x8 setups can load a representative board position immediately, while unsupported rule engines stay honest about current limits.</p>',
        '<div class="analysis-section-tabs variant-section-tabs">',
        tabsMarkup,
        '</div>',
        '</section>',
        '<section class="play-panel variant-panel">',
        '<h2 class="play-panel-title">' + escapeMarkup(details.title) + '</h2>',
        '<div class="variant-badge-row">',
        '<span class="variant-support-pill">' + escapeMarkup(details.support) + '</span>',
        details.previewFEN ? '<span class="variant-support-pill secondary">8x8 Preview Available</span>' : '<span class="variant-support-pill secondary">No Native Board Preview</span>',
        '</div>',
        '<p class="settings-lead">' + escapeMarkup(details.summary) + '</p>',
        '<div class="variant-grid">',
        '<div class="settings-card variant-card">',
        '<h3 class="play-panel-title settings-subtitle">Rules</h3>',
        '<div class="engine-pv">' + escapeMarkup(details.rules) + '</div>',
        '<div class="engine-pv"><strong>Current Support:</strong> ' + escapeMarkup(details.supportNote) + '</div>',
        details.previewFEN ? '<div class="engine-pv"><strong>Preview FEN:</strong> <span class="variant-fen">' + escapeMarkup(details.previewFEN) + '</span></div>' : '<div class="engine-pv"><strong>Preview FEN:</strong> Not available for this route.</div>',
        '<div class="play-action-bar settings-actions">',
        renderVariantActionButtons(section, details),
        '</div>',
        '</div>',
        '<div class="settings-card variant-card">',
        '<h3 class="play-panel-title settings-subtitle">Implementation Notes</h3>',
        '<div class="engine-pv">Use the primary action to jump into the closest supported workspace for this variant.</div>',
        '<div class="engine-pv">8x8 variants with orthodox pieces can load directly onto the board today.</div>',
        '<div class="engine-pv">Drop variants and 10-file variants still need dedicated controller, notation, and UI support before they become fully playable.</div>',
        '</div>',
        '</div>',
        '</section>',
        '</div>',
        renderVariantsSummaryCard(section),
        '</div>',
    ].join('');

    if (!root.dataset.bound) {
        root.dataset.bound = 'true';
        root.addEventListener('click', event => {
            const sectionButton = event.target.closest('[data-variant-section]');
            if (sectionButton) {
                requestedVariantSection = resolveVariantSection(sectionButton.getAttribute('data-variant-section'));
                renderVariantsView();
                return;
            }

            const actionButton = event.target.closest('[data-variant-action]');
            if (!actionButton) return;
            const action = actionButton.getAttribute('data-variant-action') || 'primary';
            const activeSection = getActiveVariantSection();
            const activeDetails = VARIANT_SECTION_DETAILS[activeSection] || VARIANT_SECTION_DETAILS.chess960;
            if (action === 'alternate' && activeSection === 'capablanca') {
                activateVariantGame(activeSection, 'gothic');
                if (typeof window.Chess2ShowView === 'function') {
                    window.Chess2ShowView('play');
                }
                setPlayStatus('Gothic setup loaded.', 'ready');
                paintPosition(currentBoardFEN);
                return;
            }
            if (action === 'analysis') {
                launchVariantWorkspace(activeSection, 'analysis');
                return;
            }
            if (action === 'play') {
                launchVariantWorkspace(activeSection, 'play');
                return;
            }
            launchVariantWorkspace(activeSection, activeDetails.primaryRoute);
        });
    }
}

function renderAboutView() {
    const root = document.getElementById('view-about');
    if (!root) return;

    root.innerHTML = [
        '<div class="settings-layout about-layout">',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">About BitboardJS Engine</h2>',
        '<p class="settings-lead">BitboardJS Engine is a browser-first chess workspace that combines play modes, analysis tools, openings data, multiplayer flows, and browser test harnesses inside one application shell.</p>',
        '<div class="engine-summary-grid">',
        '<div class="engine-stat"><span class="engine-stat-label">App</span><span class="engine-stat-value">BitboardJS Engine</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Board Modes</span><span class="engine-stat-value">2D and 3D</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">UI Model</span><span class="engine-stat-value">Single-page workspace</span></div>',
        '<div class="engine-stat"><span class="engine-stat-label">Build Stamp</span><span class="engine-stat-value">2026-03-11</span></div>',
        '</div>',
        '</section>',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Controls</h2>',
        '<div class="engine-pv"><strong>Navigation:</strong> Use the left drawer to switch between play, analysis, openings, multiplayer, tools, load/save, settings, and this about page.</div>',
        '<div class="engine-pv"><strong>Quick settings:</strong> The top-right gear button opens the same Settings workspace as the drawer link.</div>',
        '<div class="engine-pv"><strong>Board workflow:</strong> Play views share move history, board controls, engine summaries, and board overlays for last move, arrows, hints, and analysis lines.</div>',
        '</section>',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Notation And Openings</h2>',
        '<div class="engine-pv"><strong>Notation:</strong> Moves are tracked internally in UCI and formatted as SAN in the move list and opening displays.</div>',
        '<div class="engine-pv"><strong>Openings:</strong> The app includes an ECO encyclopedia, a curated explorer book, and bundled win/draw/loss summaries for stored opening lines.</div>',
        '<div class="engine-pv"><strong>Settings scope:</strong> Current game options apply to new Human vs Human games, while engine and online flows keep their own runtime behavior.</div>',
        '</section>',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Project Notes</h2>',
        '<div class="engine-pv">Repository docs describe the architecture, feature inventory, and browser-first testing workflow used by this project.</div>',
        '<div class="engine-pv"><strong>Included docs:</strong> README testing guidance plus architecture and feature notes under the docs folder.</div>',
        '<div class="engine-pv"><strong>Test model:</strong> Smoke, deep, and full suites run over the local HTTP server rather than raw file URLs.</div>',
        '</section>',
        '</div>',
    ].join('');
}

function isMultiplayerViewRoute(viewId) {
    return /^(live|matchmaking|spectate|chat|leaderboards|tournaments|clubs|multiplayer)$/.test(String(viewId || ''));
}

function resolveMultiplayerSection(viewId) {
    switch (String(viewId || 'live')) {
        case 'matchmaking':
        case 'spectate':
        case 'chat':
        case 'leaderboards':
        case 'tournaments':
        case 'clubs':
        case 'live':
            return String(viewId);
        case 'multiplayer':
        default:
            return 'live';
    }
}

function formatMultiplayerServerState(info) {
    if (info.connecting) return 'connecting';
    return info.connected ? 'connected' : 'offline';
}

function getMultiplayerInviteMessage() {
    const name = multiplayerState.profile && multiplayerState.profile.displayName ? multiplayerState.profile.displayName : 'A Chess2 player';
    const gameId = multiplayerState.gameId ? 'Game ID: ' + multiplayerState.gameId : 'No private game link is active yet.';
    const link = multiplayerState.joinUrl ? 'Join link: ' + multiplayerState.joinUrl : 'Create a private game to generate a shareable link.';
    return [name + ' invited you to a Chess2 online game.', link, gameId].join('\n');
}

function escapeMarkup(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderMultiplayerStat(label, value, extraClass) {
    return '<div class="engine-stat"><span class="engine-stat-label">' + escapeMarkup(label) + '</span><span class="engine-stat-value' + (extraClass ? ' ' + escapeMarkup(extraClass) : '') + '">' + escapeMarkup(value) + '</span></div>';
}

function renderMultiplayerAction(action, label, disabled, dataAttrs) {
    const attrs = dataAttrs && typeof dataAttrs === 'object'
        ? Object.keys(dataAttrs).map(key => ' data-' + escapeMarkup(key).replace(/[^a-z0-9\-]/gi, '') + '="' + escapeMarkup(String(dataAttrs[key] || '')) + '"').join('')
        : '';
    return '<button type="button" class="play-action-btn" data-multiplayer-action="' + escapeMarkup(action) + '"' + attrs + (disabled ? ' disabled' : '') + '>' + escapeMarkup(label) + '</button>';
}

function formatMultiplayerTime(value) {
    if (!value) return '-';
    try {
        return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (error) {
        return '-';
    }
}

function getRoomPlayerLabel(player, fallback) {
    if (!player) return fallback;
    const rating = player.rating ? ' (' + player.rating + ')' : '';
    return (player.displayName || fallback) + rating;
}

function renderMultiplayerOverview(info) {
    const detail = info.reconnecting
        ? 'Your online session is reconnecting right now.'
        : (info.opponentDisconnected
            ? 'Your opponent is temporarily offline and the game is being held for a reconnect.'
            : (info.message || 'Online multiplayer is idle.'));

    return [
        '<div class="engine-summary-grid">',
        renderMultiplayerStat('State', info.modeLabel || 'Offline'),
        renderMultiplayerStat('Server', formatMultiplayerServerState(info)),
        renderMultiplayerStat('Game', info.gameId || '-'),
        renderMultiplayerStat('Color', info.localColor || '-'),
        renderMultiplayerStat('White', getRoomPlayerLabel(info.roomPlayers && info.roomPlayers.white, info.whiteStatus || 'offline')),
        renderMultiplayerStat('Black', getRoomPlayerLabel(info.roomPlayers && info.roomPlayers.black, info.blackStatus || 'offline')),
        renderMultiplayerStat('Viewers', String(info.spectatorCount || 0)),
        renderMultiplayerStat('Queue', String(info.queueSize || 0)),
        '</div>',
        '<div class="engine-pv"><strong>Status:</strong> ' + escapeMarkup(detail) + '</div>',
        info.matchContext ? '<div class="engine-pv"><strong>Event:</strong> ' + escapeMarkup(formatMatchContextLabel(info.matchContext)) + '</div>' : '',
        info.drawOffer ? '<div class="engine-pv"><strong>Draw:</strong> ' + escapeMarkup(info.drawOffer.from === info.localColor ? 'Your draw offer is pending.' : 'Opponent offered a draw.') + '</div>' : '',
        info.currentResult && info.currentResult.summary ? '<div class="engine-pv"><strong>Result:</strong> ' + escapeMarkup(info.currentResult.summary) + '</div>' : '',
        '<div class="engine-pv"><strong>Server URL:</strong> ' + escapeMarkup(info.serverUrl || '-') + '</div>',
        info.joinUrl ? '<div class="engine-pv"><strong>Private Link:</strong> <span class="online-link">' + escapeMarkup(info.joinUrl) + '</span></div>' : ''
    ].join('');
}

function renderMultiplayerPrimaryActions(info) {
    const activeAssignment = getActiveTournamentAssignment(info);
    return [
        '<div class="online-actions">',
        renderMultiplayerAction('open-live-board', 'Open Live Board'),
        renderMultiplayerAction('start-matchmaking', 'Start Matchmaking', info.canCancel),
        renderMultiplayerAction('cancel-matchmaking', 'Cancel Queue', !info.canCancel),
        renderMultiplayerAction('create-private', 'Create Private Game', false),
        renderMultiplayerAction('copy-private-link', 'Copy Private Link', !info.joinUrl),
        renderMultiplayerAction('leave-game', 'Leave Game', !info.canLeave),
        renderMultiplayerAction('stop-spectating', 'Stop Spectating', !info.spectating),
        renderMultiplayerAction('join-tournament-match', info.matchContext ? 'Reopen Event Match' : 'Play Assigned Match', !activeAssignment, activeAssignment ? { tournamentId: activeAssignment.tournamentId || '', pairingId: activeAssignment.id || '' } : null),
        renderMultiplayerAction('refresh-all', 'Refresh', false),
        '</div>',
        '<div class="online-join-row multiplayer-join-row">',
        '<input type="text" class="online-join-input" data-multiplayer-join-input="true" value="' + escapeMarkup(info.joinInputValue || '') + '" placeholder="Enter private game code or /game/... link">',
        renderMultiplayerAction('join-private', 'Join', false),
        '</div>'
    ].join('');
}

function renderProfilePanel(info) {
    const profile = info.profile || {};
    return [
        '<div class="settings-card">',
        '<h3 class="play-panel-title settings-subtitle">Player Profile</h3>',
        '<label class="settings-field multiplayer-field">',
        '<span class="settings-field-label">Display name</span>',
        '<input type="text" class="online-join-input" data-multiplayer-profile-name="true" value="' + escapeMarkup(profile.displayName || 'Guest') + '" maxlength="24" placeholder="Enter display name">',
        '<span class="settings-help">This name is used for live games, room chat, and ratings.</span>',
        '</label>',
        '<div class="engine-summary-grid">',
        renderMultiplayerStat('Rating', String(profile.rating || 1200)),
        renderMultiplayerStat('Games', String(profile.games || 0)),
        renderMultiplayerStat('Wins', String(profile.wins || 0)),
        renderMultiplayerStat('Draws', String(profile.draws || 0)),
        renderMultiplayerStat('Losses', String(profile.losses || 0)),
        renderMultiplayerStat('Id', profile.id ? String(profile.id).slice(-6) : '-'),
        '</div>',
        '<div class="online-actions">',
        renderMultiplayerAction('save-profile', 'Save Profile', false),
        '</div>',
        '</div>'
    ].join('');
}

function renderLiveGamesList(info) {
    const games = Array.isArray(info.liveGames) ? info.liveGames : [];
    if (!games.length) {
        return '<div class="engine-pv">No public live games are running yet. Start matchmaking to create one.</div>';
    }
    return '<div class="multiplayer-list">' + games.map(game => {
        const white = game.players && game.players.white ? game.players.white : null;
        const black = game.players && game.players.black ? game.players.black : null;
        return [
            '<button type="button" class="multiplayer-list-item" data-multiplayer-action="spectate-game" data-game-id="' + escapeMarkup(game.gameId || '') + '">',
            '<span class="multiplayer-list-title">' + escapeMarkup(getRoomPlayerLabel(white, 'White') + ' vs ' + getRoomPlayerLabel(black, 'Black')) + '</span>',
            '<span class="multiplayer-list-meta">' + escapeMarkup((game.rated ? 'Rated' : 'Casual') + ' • ' + (game.moveCount || 0) + ' moves • ' + (game.spectatorCount || 0) + ' spectators • started ' + formatMultiplayerTime(game.startedAt)) + '</span>',
            game.matchContext ? '<span class="multiplayer-list-meta multiplayer-accent-meta">' + escapeMarkup(formatMatchContextLabel(game.matchContext)) + '</span>' : '',
            '</button>'
        ].join('');
    }).join('') + '</div>';
}

function renderRecentResultsList(info) {
    const results = Array.isArray(info.recentResults) ? info.recentResults : [];
    if (!results.length) {
        return '<div class="engine-pv">No online games have finished yet.</div>';
    }
    return '<div class="multiplayer-list">' + results.slice(0, 8).map(item => {
        return [
            '<div class="multiplayer-list-item static">',
            '<span class="multiplayer-list-title">' + escapeMarkup(item.summary || 'Completed online game') + '</span>',
            '<span class="multiplayer-list-meta">' + escapeMarkup((item.rated ? 'Rated' : 'Casual') + ' • ' + formatMultiplayerTime(item.endedAt) + ' • ' + (item.moveCount || 0) + ' moves') + '</span>',
            item.matchContext ? '<span class="multiplayer-list-meta multiplayer-accent-meta">' + escapeMarkup(formatMatchContextLabel(item.matchContext)) + '</span>' : '',
            '</div>'
        ].join('');
    }).join('') + '</div>';
}

function formatMatchContextLabel(matchContext) {
    if (!matchContext) return '';
    const eventName = matchContext.tournamentName || 'Tournament';
    const roundText = matchContext.roundNumber ? 'Round ' + matchContext.roundNumber : 'Event Match';
    return eventName + ' • ' + roundText + (matchContext.clubName ? ' • ' + matchContext.clubName : '');
}

function getActiveTournamentAssignment(info) {
    const profileId = info && info.profile && info.profile.id ? info.profile.id : '';
    if (!profileId || !Array.isArray(info && info.tournaments)) return null;
    for (const tournament of info.tournaments) {
        if (!tournament || tournament.status !== 'active') continue;
        const activeRound = Array.isArray(tournament.rounds)
            ? tournament.rounds.find(round => Number(round.roundNumber) === Number(tournament.currentRound || 0))
            : null;
        if (!activeRound || !Array.isArray(activeRound.pairings)) continue;
        const pairing = activeRound.pairings.find(entry => entry.whiteId === profileId || entry.blackId === profileId);
        if (pairing) {
            return Object.assign({ tournamentId: tournament.id || '', tournamentName: tournament.name || '' }, pairing);
        }
    }
    return null;
}

function renderLeaderboardTable(info) {
    const entries = Array.isArray(info.leaderboard) ? info.leaderboard : [];
    if (!entries.length) {
        return '<div class="engine-pv">No rated games have finished yet, so the leaderboard is still empty.</div>';
    }
    return '<div class="multiplayer-table">' + entries.slice(0, 10).map(entry => {
        return [
            '<div class="multiplayer-table-row">',
            '<span class="multiplayer-rank">#' + escapeMarkup(entry.rank) + '</span>',
            '<span class="multiplayer-name">' + escapeMarkup(entry.displayName || 'Guest') + '</span>',
            '<span class="multiplayer-score">' + escapeMarkup(String(entry.rating || 1200)) + '</span>',
            '<span class="multiplayer-record">' + escapeMarkup(String(entry.wins || 0) + '-' + String(entry.draws || 0) + '-' + String(entry.losses || 0)) + '</span>',
            '</div>'
        ].join('');
    }).join('') + '</div>';
}

function isChatRoomActive(info) {
    return ['in-game', 'spectating', 'waiting-private'].includes(String(info && info.mode || ''));
}

function resolveMultiplayerChatScope(info) {
    const hasRoom = isChatRoomActive(info);
    if (!hasRoom) return 'lobby';
    return requestedMultiplayerChatScope === 'lobby' ? 'lobby' : 'room';
}

function formatChatBadge(count) {
    const safeCount = Math.max(0, Number(count) || 0);
    return safeCount > 99 ? '99+' : String(safeCount);
}

function renderChatRoomEntry(info) {
    const games = Array.isArray(info.liveGames) ? info.liveGames.slice(0, 4) : [];
    if (games.length) {
        return [
            '<div class="settings-card">',
            '<h3 class="play-panel-title settings-subtitle">Open A Room</h3>',
            '<p class="settings-lead multiplayer-lead">Spectate a live game or create your own room first. Once you are in a room, chat becomes active here immediately.</p>',
            '<div class="multiplayer-list">',
            games.map(game => {
                const white = game.players && game.players.white ? game.players.white : null;
                const black = game.players && game.players.black ? game.players.black : null;
                return [
                    '<div class="multiplayer-list-item static compact">',
                    '<span class="multiplayer-list-title">' + escapeMarkup(getRoomPlayerLabel(white, 'White') + ' vs ' + getRoomPlayerLabel(black, 'Black')) + '</span>',
                    '<span class="multiplayer-list-meta">' + escapeMarkup((game.rated ? 'Rated' : 'Casual') + ' • ' + (game.spectatorCount || 0) + ' spectators') + '</span>',
                    '<div class="online-actions">',
                    renderMultiplayerAction('spectate-game', 'Spectate And Chat', false, { 'game-id': game.gameId || '', returnSection: 'chat' }),
                    '</div>',
                    '</div>'
                ].join('');
            }).join(''),
            '</div>',
            '<div class="online-actions">',
            renderMultiplayerAction('create-private', 'Create Private Room', false, { returnSection: 'chat' }),
            renderMultiplayerAction('start-matchmaking', 'Start Matchmaking', info.canCancel, { returnSection: 'chat' }),
            renderMultiplayerAction('open-live-board', 'Open Live Board', false),
            '</div>',
            '</div>'
        ].join('');
    }

    return [
        '<div class="settings-card">',
        '<h3 class="play-panel-title settings-subtitle">Open A Room</h3>',
        '<p class="settings-lead multiplayer-lead">No active room is attached right now. Create a private room, start matchmaking, or open the live board and then come back here to chat.</p>',
        '<div class="online-actions">',
        renderMultiplayerAction('create-private', 'Create Private Room', false, { returnSection: 'chat' }),
        renderMultiplayerAction('start-matchmaking', 'Start Matchmaking', info.canCancel, { returnSection: 'chat' }),
        renderMultiplayerAction('open-live-board', 'Open Live Board', false),
        '</div>',
        '</div>'
    ].join('');
}

function renderChatPanel(info) {
    const roomActive = isChatRoomActive(info);
    const chatScope = resolveMultiplayerChatScope(info);
    const messages = chatScope === 'room'
        ? (Array.isArray(info.chatMessages) ? info.chatMessages : [])
        : (Array.isArray(info.lobbyMessages) ? info.lobbyMessages : []);
    const lead = roomActive
        ? 'Chat with the current players and spectators in this room.'
        : (info.mode === 'finished'
            ? 'That game is already over. Open a live room, spectate a game, or start a new one to chat again.'
            : 'The lobby is always available, and room chat activates automatically once you join or spectate a game.');
    return [
        '<div class="settings-card">',
        '<h3 class="play-panel-title settings-subtitle">Chat</h3>',
        '<p class="settings-lead multiplayer-lead">' + escapeMarkup(lead) + '</p>',
        roomActive ? '<div class="settings-tabs multiplayer-chat-scope-tabs">'
            + '<button type="button" class="board-ctrl-btn settings-tab' + (chatScope === 'room' ? ' active' : '') + '" data-multiplayer-chat-scope="room">Room Chat' + ((info.roomUnreadCount || 0) ? ' (' + escapeMarkup(formatChatBadge(info.roomUnreadCount)) + ')' : '') + '</button>'
            + '<button type="button" class="board-ctrl-btn settings-tab' + (chatScope === 'lobby' ? ' active' : '') + '" data-multiplayer-chat-scope="lobby">Lobby Chat' + ((info.lobbyUnreadCount || 0) ? ' (' + escapeMarkup(formatChatBadge(info.lobbyUnreadCount)) + ')' : '') + '</button>'
            + '</div>' : '<div class="engine-pv"><strong>Channel:</strong> Global Lobby</div>',
        roomActive ? '<div class="engine-pv"><strong>Room:</strong> ' + escapeMarkup(info.gameId || '-') + (info.matchContext ? ' • ' + escapeMarkup(formatMatchContextLabel(info.matchContext)) : '') + '</div>' : '',
        '<div class="multiplayer-chat-log">',
        messages.length
            ? messages.slice(-25).map(message => '<div class="multiplayer-chat-message"><span class="multiplayer-chat-author">' + escapeMarkup((message.author && message.author.displayName) || 'Player') + '</span><span class="multiplayer-chat-text">' + escapeMarkup(message.text || '') + '</span></div>').join('')
            : '<div class="engine-summary-empty">No chat messages yet.</div>',
        '</div>',
        '<label class="settings-field multiplayer-field">',
        '<span class="settings-field-label">Message</span>',
        '<textarea class="multiplayer-textarea" data-multiplayer-chat-draft="true" rows="4" placeholder="' + escapeMarkup(chatScope === 'room' ? 'Type a room message' : 'Type a lobby message') + '"' + ((chatScope === 'room' && !roomActive) ? ' disabled' : '') + '>' + escapeMarkup(multiplayerChatDraft || '') + '</textarea>',
        '</label>',
        '<div class="online-actions">',
        renderMultiplayerAction('send-chat', chatScope === 'room' ? 'Send To Room' : 'Send To Lobby', chatScope === 'room' && !roomActive),
        renderMultiplayerAction('copy-invite', 'Copy Invite', !info.joinUrl),
        '</div>',
        '</div>',
        roomActive ? '' : renderChatRoomEntry(info)
    ].join('');
}

function isClubMember(club, profileId) {
    const memberIds = Array.isArray(club && club.memberIds) ? club.memberIds : [];
    return Boolean(profileId) && memberIds.includes(profileId);
}

function isTournamentParticipant(tournament, profileId) {
    const participantIds = Array.isArray(tournament && tournament.participantIds) ? tournament.participantIds : [];
    return Boolean(profileId) && participantIds.includes(profileId);
}

function renderClubMembers(club) {
    const members = Array.isArray(club && club.members) ? club.members : [];
    if (!members.length) {
        return '<div class="engine-pv">No members are listed for this club yet.</div>';
    }
    return '<div class="multiplayer-table multiplayer-table-compact">' + members.slice().sort((left, right) => (right.rating || 0) - (left.rating || 0)).map(member => [
        '<div class="multiplayer-table-row">',
        '<span class="multiplayer-rank">' + escapeMarkup(String((member.displayName || 'Guest').slice(0, 1)).toUpperCase()) + '</span>',
        '<span class="multiplayer-name">' + escapeMarkup(member.displayName || 'Guest') + '</span>',
        '<span class="multiplayer-score">' + escapeMarkup(String(member.rating || 1200)) + '</span>',
        '<span class="multiplayer-record">' + escapeMarkup(member.id ? String(member.id).slice(-6) : '-') + '</span>',
        '</div>'
    ].join('')).join('') + '</div>';
}

function renderClubRecentMatches(club) {
    const matches = Array.isArray(club && club.recentMatches) ? club.recentMatches : [];
    if (!matches.length) {
        return '<div class="engine-pv">Club history will appear as members finish online games and tournament rounds.</div>';
    }
    return '<div class="multiplayer-list">' + matches.slice(0, 4).map(match => [
        '<div class="multiplayer-list-item static compact">',
        '<span class="multiplayer-list-title">' + escapeMarkup(match.summary || 'Completed online game') + '</span>',
        '<span class="multiplayer-list-meta">' + escapeMarkup(formatMultiplayerTime(match.endedAt) + ' • ' + ((match.moveCount || 0) + ' moves')) + '</span>',
        match.matchContext ? '<span class="multiplayer-list-meta multiplayer-accent-meta">' + escapeMarkup(formatMatchContextLabel(match.matchContext)) + '</span>' : '',
        '</div>'
    ].join('')).join('') + '</div>';
}

function renderClubsPanel(info) {
    const clubs = Array.isArray(info.clubs) ? info.clubs : [];
    const profileId = info.profile && info.profile.id ? info.profile.id : '';
    return [
        '<div class="settings-card">',
        '<h3 class="play-panel-title settings-subtitle">Create Club</h3>',
        '<label class="settings-field multiplayer-field">',
        '<span class="settings-field-label">Club name</span>',
        '<input type="text" class="online-join-input" data-multiplayer-club-name="true" value="' + escapeMarkup(multiplayerClubDraft.name || '') + '" maxlength="40" placeholder="Club name">',
        '</label>',
        '<label class="settings-field multiplayer-field">',
        '<span class="settings-field-label">Description</span>',
        '<textarea class="multiplayer-textarea" data-multiplayer-club-description="true" rows="3" placeholder="Describe the club">' + escapeMarkup(multiplayerClubDraft.description || '') + '</textarea>',
        '</label>',
        '<div class="online-actions">',
        renderMultiplayerAction('create-club', 'Create Club', false),
        '</div>',
        '</div>',
        '<div class="settings-card">',
        '<h3 class="play-panel-title settings-subtitle">Club Directory</h3>',
        clubs.length
            ? '<div class="multiplayer-list">' + clubs.map(club => {
                const joined = isClubMember(club, profileId);
                const ownerSuffix = club.ownerName ? ' • Owner ' + club.ownerName : '';
                return [
                    '<div class="multiplayer-list-item static">',
                    '<span class="multiplayer-list-title">' + escapeMarkup(club.name || 'Club') + '</span>',
                    '<span class="multiplayer-list-meta">' + escapeMarkup((club.memberCount || 0) + ' members • ' + (club.linkedTournamentCount || 0) + ' tournaments' + ownerSuffix) + '</span>',
                    club.description ? '<span class="multiplayer-list-meta">' + escapeMarkup(club.description) + '</span>' : '',
                    renderClubMembers(club),
                    (Array.isArray(club.linkedTournaments) && club.linkedTournaments.length)
                        ? '<div class="engine-pv"><strong>Events:</strong> ' + escapeMarkup(club.linkedTournaments.map(tournament => (tournament.name || 'Tournament') + ' (' + (tournament.status || 'pending') + ')').join(' • ')) + '</div>'
                        : '<div class="engine-pv">No linked tournaments yet.</div>',
                    renderClubRecentMatches(club),
                    '<div class="online-actions">',
                    renderMultiplayerAction(joined ? 'leave-club' : 'join-club', joined ? 'Leave Club' : 'Join Club', false, { clubId: club.id || '' }),
                    '</div>',
                    '</div>'
                ].join('');
            }).join('') + '</div>'
            : '<div class="engine-pv">No clubs exist yet. Create one to persist a roster on the server.</div>',
        '</div>'
    ].join('');
}

function renderTournamentPairings(rounds, tournament, info) {
    if (!Array.isArray(rounds) || !rounds.length) {
        return '<div class="engine-pv">Tournament pairings will appear after the organizer starts the event.</div>';
    }
    const profileId = info && info.profile && info.profile.id ? info.profile.id : '';
    const visibleRounds = rounds.slice(0, 5);
    return '<div class="multiplayer-list">' + visibleRounds.map(round => [
        '<div class="multiplayer-list-item static">',
        '<span class="multiplayer-list-title">Round ' + escapeMarkup(String(round.roundNumber || 1)) + ' • ' + escapeMarkup(round.status || 'pending') + '</span>',
        '<div class="multiplayer-list multiplayer-nested-list">',
        (Array.isArray(round.pairings) ? round.pairings : []).map(pairing => {
            const assignedToProfile = Boolean(profileId) && (pairing.whiteId === profileId || pairing.blackId === profileId);
            return [
                '<div class="multiplayer-list-item static compact">',
                '<span class="multiplayer-list-title">' + escapeMarkup((pairing.whiteName || 'Bye') + ' vs ' + (pairing.blackName || 'Bye')) + '</span>',
                '<span class="multiplayer-list-meta">' + escapeMarkup((pairing.status || 'pending') + ' • ' + (pairing.result === 'pending' ? 'Awaiting result' : pairing.result.replace('-', ' '))) + '</span>',
                pairing.summary ? '<span class="multiplayer-list-meta">' + escapeMarkup(pairing.summary) + '</span>' : '',
                '<div class="online-actions">',
                assignedToProfile
                    ? renderMultiplayerAction('join-tournament-match', pairing.status === 'finished' ? 'Review Pairing' : 'Play Round Match', pairing.status === 'finished', { tournamentId: tournament.id || '', pairingId: pairing.id || '' })
                    : '',
                pairing.gameId && pairing.status === 'active'
                    ? renderMultiplayerAction('spectate-game', 'Spectate', false, { 'game-id': pairing.gameId || '' })
                    : '',
                '</div>',
                '</div>'
            ].join('');
        }).join('') || '<div class="engine-pv">No pairings scheduled.</div>',
        '</div>',
        '</div>'
    ].join('')).join('') + '</div>';
}

function renderTournamentStandings(standings, profileId) {
    if (!Array.isArray(standings) || !standings.length) {
        return '<div class="engine-pv">Standings will populate once players join the tournament.</div>';
    }
    return '<div class="multiplayer-table">' + standings.slice(0, 10).map((entry, index) => [
        '<div class="multiplayer-table-row' + ((profileId && entry.playerId === profileId) ? ' multiplayer-highlight-row' : '') + '">',
        '<span class="multiplayer-rank">#' + escapeMarkup(String(index + 1)) + '</span>',
        '<span class="multiplayer-name">' + escapeMarkup(entry.displayName || 'Guest') + '</span>',
        '<span class="multiplayer-score">' + escapeMarkup(String(entry.points != null ? entry.points : 0)) + '</span>',
        '<span class="multiplayer-record">' + escapeMarkup(String(entry.wins || 0) + '-' + String(entry.draws || 0) + '-' + String(entry.losses || 0)) + '</span>',
        '</div>'
    ].join('')).join('') + '</div>';
}

function renderTournamentsPanel(info) {
    const tournaments = Array.isArray(info.tournaments) ? info.tournaments : [];
    const clubs = Array.isArray(info.clubs) ? info.clubs : [];
    const profileId = info.profile && info.profile.id ? info.profile.id : '';
    return [
        '<div class="settings-card">',
        '<h3 class="play-panel-title settings-subtitle">Create Tournament</h3>',
        '<label class="settings-field multiplayer-field">',
        '<span class="settings-field-label">Tournament name</span>',
        '<input type="text" class="online-join-input" data-multiplayer-tournament-name="true" value="' + escapeMarkup(multiplayerTournamentDraft.name || '') + '" maxlength="48" placeholder="Tournament name">',
        '</label>',
        '<label class="settings-field multiplayer-field">',
        '<span class="settings-field-label">Description</span>',
        '<textarea class="multiplayer-textarea" data-multiplayer-tournament-description="true" rows="3" placeholder="Describe the event">' + escapeMarkup(multiplayerTournamentDraft.description || '') + '</textarea>',
        '</label>',
        '<label class="settings-field multiplayer-field">',
        '<span class="settings-field-label">Linked club</span>',
        '<select class="online-join-input" data-multiplayer-tournament-club="true">',
        '<option value="">Independent event</option>',
        clubs.map(club => '<option value="' + escapeMarkup(club.id || '') + '"' + ((multiplayerTournamentDraft.clubId || '') === (club.id || '') ? ' selected' : '') + '>' + escapeMarkup(club.name || 'Club') + '</option>').join(''),
        '</select>',
        '</label>',
        '<div class="online-actions">',
        renderMultiplayerAction('create-tournament', 'Create Tournament', false),
        '</div>',
        '</div>',
        '<div class="settings-card">',
        '<h3 class="play-panel-title settings-subtitle">Tournament Directory</h3>',
        tournaments.length
            ? '<div class="multiplayer-list">' + tournaments.map(tournament => {
                const joined = isTournamentParticipant(tournament, profileId);
                const isOwner = tournament.ownerId && tournament.ownerId === profileId;
                const statusText = tournament.status === 'active' ? 'Active' : (tournament.status === 'completed' ? 'Completed' : 'Pending');
                const activeRoundText = tournament.currentRound ? ' • Round ' + tournament.currentRound : '';
                const assignment = getActiveTournamentAssignment({ tournaments: [tournament], profile: info.profile });
                return [
                    '<div class="multiplayer-list-item static">',
                    '<span class="multiplayer-list-title">' + escapeMarkup(tournament.name || 'Tournament') + '</span>',
                    '<span class="multiplayer-list-meta">' + escapeMarkup(statusText + activeRoundText + ' • ' + ((tournament.participants && tournament.participants.length) || 0) + ' players' + (tournament.clubName ? ' • ' + tournament.clubName : '')) + '</span>',
                    tournament.description ? '<span class="multiplayer-list-meta">' + escapeMarkup(tournament.description) + '</span>' : '',
                    assignment ? '<div class="engine-pv"><strong>Your Round:</strong> ' + escapeMarkup((assignment.whiteName || 'White') + ' vs ' + (assignment.blackName || 'Black') + ' • ' + (assignment.status || 'pending')) + '</div>' : '',
                    renderTournamentStandings(tournament.standings, profileId),
                    renderTournamentPairings(tournament.rounds, tournament, info),
                    '<div class="online-actions">',
                    renderMultiplayerAction(joined ? 'leave-tournament' : 'join-tournament', joined ? 'Leave Tournament' : 'Join Tournament', tournament.status !== 'pending' && !joined, { tournamentId: tournament.id || '' }),
                    renderMultiplayerAction('start-tournament', 'Start Event', !isOwner || tournament.status !== 'pending' || ((tournament.participants && tournament.participants.length) || 0) < 2, { tournamentId: tournament.id || '' }),
                    renderMultiplayerAction('join-tournament-match', 'Play Assigned Match', !assignment || tournament.status !== 'active', assignment ? { tournamentId: tournament.id || '', pairingId: assignment.id || '' } : null),
                    '</div>',
                    '</div>'
                ].join('');
            }).join('') + '</div>'
            : '<div class="engine-pv">No tournaments exist yet. Create one and the server will persist the roster, pairings, and standings.</div>',
        '</div>'
    ].join('');
}

function renderMultiplayerSectionBody(section, info) {
    switch (section) {
        case 'matchmaking':
            return [
                '<div class="settings-card">',
                '<h3 class="play-panel-title settings-subtitle">Matchmaking</h3>',
                '<p class="settings-lead multiplayer-lead">Queue into the Socket.IO matchmaker or switch to a private room without leaving the multiplayer area.</p>',
                renderMultiplayerOverview(info),
                renderMultiplayerPrimaryActions(info),
                '</div>',
                '<div class="settings-card">',
                '<h3 class="play-panel-title settings-subtitle">Queue Notes</h3>',
                '<div class="engine-pv">Use <strong>Start Matchmaking</strong> to enter the shared queue. Rated results are recorded for public matchmaking games and flow into the leaderboard automatically.</div>',
                '</div>'
            ].join('');
        case 'spectate':
            return [
                '<div class="settings-card">',
                '<h3 class="play-panel-title settings-subtitle">Spectate</h3>',
                '<p class="settings-lead multiplayer-lead">Public matchmaking games are now broadcast as a live feed. Pick one below to join as a spectator.</p>',
                renderLiveGamesList(info),
                '<div class="online-actions">',
                renderMultiplayerAction('refresh-live-games', 'Refresh Live Games', false),
                renderMultiplayerAction('stop-spectating', 'Stop Spectating', !info.spectating),
                '</div>',
                '</div>'
            ].join('');
        case 'chat':
            return renderChatPanel(info);
        case 'leaderboards':
            return [
                '<div class="settings-card">',
                '<h3 class="play-panel-title settings-subtitle">Leaderboards</h3>',
                '<p class="settings-lead multiplayer-lead">Public matchmaking results now update an in-memory rating ladder. The table below refreshes from the Socket.IO service.</p>',
                renderLeaderboardTable(info),
                '<div class="online-actions">',
                renderMultiplayerAction('refresh-leaderboard', 'Refresh Leaderboard', false),
                renderMultiplayerAction('start-matchmaking', 'Play Rated Match', info.canCancel),
                '</div>',
                '</div>'
            ].join('');
        case 'tournaments':
            return renderTournamentsPanel(info);
        case 'clubs':
            return renderClubsPanel(info);
        case 'live':
        default:
            return [
                '<div class="settings-card">',
                '<h3 class="play-panel-title settings-subtitle">Live Games</h3>',
                '<p class="settings-lead multiplayer-lead">Manage your current online session, private rooms, queue state, and the public live feed from one place.</p>',
                renderMultiplayerOverview(info),
                renderMultiplayerPrimaryActions(info),
                renderLiveGamesList(info),
                '</div>'
            ].join('');
    }
}

function renderMultiplayerView() {
    const root = document.getElementById('view-multiplayer');
    if (!root) return;

    const info = getOnlineInfo();
    const activeSection = resolveMultiplayerSection(requestedMultiplayerSection);
    const chatScope = resolveMultiplayerChatScope(info);
    const client = ensureMultiplayerClient();
    if (activeSection === 'chat' && client) {
        if (chatScope === 'room') {
            client.markRoomChatSeen();
        } else {
            client.markLobbyChatSeen();
        }
    }
    const sectionTitles = {
        live: 'Live Games',
        matchmaking: 'Matchmaking',
        spectate: 'Spectate',
        chat: 'Chat',
        leaderboards: 'Leaderboards',
        tournaments: 'Tournaments',
        clubs: 'Clubs / Teams',
    };

    root.innerHTML = [
        '<div class="settings-layout multiplayer-layout">',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Multiplayer</h2>',
        '<p class="settings-lead">The multiplayer drawer entries now land in a dedicated hub instead of empty views. Live play still runs on the board view, and the rest of the menu now exposes the current online stack clearly.</p>',
        '<div class="settings-tabs multiplayer-tabs">',
        ['live', 'matchmaking', 'spectate', 'chat', 'leaderboards', 'tournaments', 'clubs'].map(section => '<button type="button" class="board-ctrl-btn settings-tab' + (activeSection === section ? ' active' : '') + '" data-multiplayer-section="' + section + '">' + sectionTitles[section] + (section === 'chat' && info.chatUnreadCount ? '<span class="multiplayer-tab-badge">' + escapeMarkup(formatChatBadge(info.chatUnreadCount)) + '</span>' : '') + '</button>').join(''),
        '</div>',
        renderMultiplayerSectionBody(activeSection, info),
        '</section>',
        '<section class="play-panel">',
        '<h2 class="play-panel-title">Current Status</h2>',
        renderProfilePanel(info),
        '<div class="settings-card">',
        '<h3 class="play-panel-title settings-subtitle">Recent Results</h3>',
        renderRecentResultsList(info),
        '</div>',
        '</section>',
        '</div>'
    ].join('');

    if (!root.dataset.bound) {
        root.dataset.bound = 'true';
        root.addEventListener('input', event => {
            const joinInput = event.target.closest('[data-multiplayer-join-input]');
            if (joinInput) {
                multiplayerState.joinInputValue = String(joinInput.value || '');
                return;
            }
            const chatDraft = event.target.closest('[data-multiplayer-chat-draft]');
            if (chatDraft) {
                saveMultiplayerChatDraft(chatDraft.value || '');
                return;
            }
            const clubNameInput = event.target.closest('[data-multiplayer-club-name]');
            if (clubNameInput) {
                multiplayerClubDraft.name = String(clubNameInput.value || '');
                return;
            }
            const clubDescriptionInput = event.target.closest('[data-multiplayer-club-description]');
            if (clubDescriptionInput) {
                multiplayerClubDraft.description = String(clubDescriptionInput.value || '');
                return;
            }
            const tournamentNameInput = event.target.closest('[data-multiplayer-tournament-name]');
            if (tournamentNameInput) {
                multiplayerTournamentDraft.name = String(tournamentNameInput.value || '');
                return;
            }
            const tournamentDescriptionInput = event.target.closest('[data-multiplayer-tournament-description]');
            if (tournamentDescriptionInput) {
                multiplayerTournamentDraft.description = String(tournamentDescriptionInput.value || '');
                return;
            }
            const tournamentClubInput = event.target.closest('[data-multiplayer-tournament-club]');
            if (tournamentClubInput) {
                multiplayerTournamentDraft.clubId = String(tournamentClubInput.value || '');
            }
        });

        root.addEventListener('change', event => {
            const tournamentClubInput = event.target.closest('[data-multiplayer-tournament-club]');
            if (tournamentClubInput) {
                multiplayerTournamentDraft.clubId = String(tournamentClubInput.value || '');
            }
        });

        root.addEventListener('click', event => {
            const sectionButton = event.target.closest('[data-multiplayer-section]');
            if (sectionButton) {
                requestedMultiplayerSection = resolveMultiplayerSection(sectionButton.getAttribute('data-multiplayer-section'));
                renderMultiplayerView();
                return;
            }

            const scopeButton = event.target.closest('[data-multiplayer-chat-scope]');
            if (scopeButton) {
                requestedMultiplayerChatScope = scopeButton.getAttribute('data-multiplayer-chat-scope') === 'lobby' ? 'lobby' : 'room';
                renderMultiplayerView();
                return;
            }

            const actionButton = event.target.closest('[data-multiplayer-action]');
            if (!actionButton) return;
            const action = actionButton.getAttribute('data-multiplayer-action');
            const returnSection = actionButton.getAttribute('data-returnsection');
            if (returnSection) {
                requestedMultiplayerSection = resolveMultiplayerSection(returnSection);
            }
            if (action === 'open-live-board') {
                showView('play-online');
                return;
            }
            if (action === 'spectate-game') {
                spectateLiveGame(actionButton.getAttribute('data-game-id') || '');
                return;
            }
            if (action === 'start-matchmaking') {
                requestedMultiplayerSection = 'matchmaking';
                startGlobalMatchmaking();
                renderMultiplayerView();
                return;
            }
            if (action === 'cancel-matchmaking') {
                const client = ensureMultiplayerClient();
                if (client) {
                    client.cancelMatchmaking();
                }
                renderMultiplayerView();
                return;
            }
            if (action === 'create-private') {
                createPrivateOnlineGame();
                renderMultiplayerView();
                return;
            }
            if (action === 'join-private') {
                joinPrivateOnlineGame(multiplayerState.joinInputValue);
                renderMultiplayerView();
                return;
            }
            if (action === 'copy-private-link') {
                copyPrivateGameLink();
                return;
            }
            if (action === 'stop-spectating') {
                stopSpectatingOnline();
                renderMultiplayerView();
                return;
            }
            if (action === 'leave-game') {
                leaveOnlineGame();
                renderMultiplayerView();
                return;
            }
            if (action === 'send-chat') {
                sendOnlineChatMessage(multiplayerChatDraft || '');
                return;
            }
            if (action === 'save-profile') {
                const nameInput = root.querySelector('[data-multiplayer-profile-name]');
                updateMultiplayerProfile(nameInput ? nameInput.value : '');
                return;
            }
            if (action === 'refresh-live-games' || action === 'refresh-leaderboard' || action === 'refresh-all') {
                refreshMultiplayerFeeds();
                return;
            }
            if (action === 'copy-invite') {
                if (window.Chess2Storage && typeof window.Chess2Storage.copyText === 'function') {
                    window.Chess2Storage.copyText(getMultiplayerInviteMessage());
                }
                return;
            }
            if (action === 'create-club') {
                createClub(multiplayerClubDraft);
                return;
            }
            if (action === 'join-club') {
                joinClub(actionButton.getAttribute('data-clubid') || '');
                return;
            }
            if (action === 'leave-club') {
                leaveClub(actionButton.getAttribute('data-clubid') || '');
                return;
            }
            if (action === 'create-tournament') {
                createTournament(multiplayerTournamentDraft);
                return;
            }
            if (action === 'join-tournament') {
                joinTournament(actionButton.getAttribute('data-tournamentid') || '');
                return;
            }
            if (action === 'leave-tournament') {
                leaveTournament(actionButton.getAttribute('data-tournamentid') || '');
                return;
            }
            if (action === 'start-tournament') {
                startTournament(actionButton.getAttribute('data-tournamentid') || '');
                return;
            }
            if (action === 'join-tournament-match') {
                joinTournamentMatch(
                    actionButton.getAttribute('data-tournamentid') || '',
                    actionButton.getAttribute('data-pairingid') || ''
                );
                return;
            }
        });
    }
}

function isOnlineModeActive() {
    return currentPlayMode === 'play-online';
}

function isOnlineSessionBusy() {
    return ['queueing', 'creating-private', 'joining-private', 'waiting-private', 'in-game'].includes(multiplayerState.mode);
}

function canReviewHistory() {
    return !isOnlineModeActive() && !isPuzzleSessionActive() && !(currentPlayMode === 'play-human' && shouldUseTimedLocalClock());
}

function canStartLocalGame() {
    return !isOnlineModeActive();
}

const DEFAULT_RESERVE_ORDER = ['Q', 'R', 'C', 'A', 'B', 'N', 'P'];
const DEFAULT_FILES = FILES;
const DEFAULT_RANKS = RANKS;

function createBoardMeta(files, ranks) {
    return {
        files: files || DEFAULT_FILES,
        ranks: ranks || DEFAULT_RANKS,
    };
}

function getBoardMeta(source) {
    if (source && typeof source.files === 'string' && typeof source.ranks === 'string') {
        return createBoardMeta(source.files, source.ranks);
    }
    if (currentGameState && typeof currentGameState.files === 'string' && typeof currentGameState.ranks === 'string') {
        return createBoardMeta(currentGameState.files, currentGameState.ranks);
    }
    return createBoardMeta(DEFAULT_FILES, DEFAULT_RANKS);
}

function inferFilesForWidth(width) {
    return 'abcdefghijklmnopqrstuvwxyz'.slice(0, Math.max(1, width || 8));
}

function inferRanksForHeight(height) {
    const size = Math.max(1, height || 8);
    let text = '';
    for (let rank = size; rank >= 1; rank--) {
        text += String(rank);
    }
    return text;
}

function createEmptyReserve() {
    const reserve = {};
    DEFAULT_RESERVE_ORDER.forEach(piece => {
        reserve[piece] = 0;
    });
    return reserve;
}

function cloneReserve(reserve) {
    return Object.assign(createEmptyReserve(), reserve || {});
}

function normalizePocketPieceCode(piece) {
    const code = String(piece || '').trim().toUpperCase();
    return DEFAULT_RESERVE_ORDER.includes(code) ? code : '';
}

function reservePiecesToText(reserve) {
    const counts = cloneReserve(reserve);
    return DEFAULT_RESERVE_ORDER.map(piece => piece.repeat(Math.max(0, counts[piece] || 0))).join('') || '-';
}

function parseReserveText(text) {
    const reserve = createEmptyReserve();
    const source = String(text || '').trim();
    if (!source || source === '-') return reserve;
    for (const char of source) {
        const piece = normalizePocketPieceCode(char);
        if (piece) reserve[piece] += 1;
    }
    return reserve;
}

function reserveToList(reserve) {
    const counts = cloneReserve(reserve);
    return DEFAULT_RESERVE_ORDER
        .filter(piece => (counts[piece] || 0) > 0)
        .map(piece => ({ piece, count: counts[piece] }));
}

function getVariantId(state) {
    return String((state && state.variantId) || 'standard');
}

function usesReserveDrops(state) {
    const variantId = getVariantId(state);
    return variantId === 'crazyhouse' || variantId === 'bighouse' || variantId === 'bughouse';
}

function usesThreeCheck(state) {
    return getVariantId(state) === 'three-check';
}

function usesTenFileCastling(state) {
    return getVariantId(state) === 'capablanca';
}

function parseFenExtras(parts, width, height) {
    const raw = parts.slice(6).join(' ').trim();
    if (!raw) return {};
    const match = raw.match(/^\[(.*)\]$/);
    if (!match) return {};

    const extras = {};
    match[1].split(';').forEach(entry => {
        const [key, value] = entry.split('=');
        if (!key) return;
        extras[String(key).trim()] = String(value == null ? '' : value).trim();
    });

    const files = extras.files || inferFilesForWidth(width);
    const ranks = extras.ranks || inferRanksForHeight(height);
    return {
        variantId: extras.variant || 'standard',
        files,
        ranks,
        reserve: {
            white: parseReserveText(extras.wp),
            black: parseReserveText(extras.bp),
        },
        checks: {
            white: Math.max(0, parseInt((extras.checks || '0,0').split(',')[0], 10) || 0),
            black: Math.max(0, parseInt((extras.checks || '0,0').split(',')[1], 10) || 0),
        },
        promotedSquares: String(extras.promo || '').trim() && extras.promo !== '-'
            ? String(extras.promo).split(',').map(value => value.trim()).filter(Boolean)
            : [],
        setup: extras.setup || '',
    };
}

function serializeFenExtras(state) {
    const variantId = getVariantId(state);
    const files = state.files || DEFAULT_FILES;
    const ranks = state.ranks || DEFAULT_RANKS;
    const hasReserve = usesReserveDrops(state);
    const hasChecks = usesThreeCheck(state);
    const hasPromo = hasReserve && Array.isArray(state.promotedSquares) && state.promotedSquares.length > 0;
    const hasCustomBoard = files !== DEFAULT_FILES || ranks !== DEFAULT_RANKS;
    const hasSetup = Boolean(state.variantSetup);
    if (variantId === 'standard' && !hasReserve && !hasChecks && !hasPromo && !hasCustomBoard && !hasSetup) {
        return '';
    }

    const parts = ['variant=' + variantId];
    if (hasCustomBoard) {
        parts.push('files=' + files);
        parts.push('ranks=' + ranks);
    }
    if (hasChecks) {
        const checks = state.checks || { white: 0, black: 0 };
        parts.push('checks=' + String(checks.white || 0) + ',' + String(checks.black || 0));
    }
    if (hasReserve) {
        parts.push('wp=' + reservePiecesToText(state.reserve && state.reserve.white));
        parts.push('bp=' + reservePiecesToText(state.reserve && state.reserve.black));
    }
    if (hasPromo) {
        parts.push('promo=' + state.promotedSquares.join(','));
    }
    if (hasSetup) {
        parts.push('setup=' + state.variantSetup);
    }
    return ' [' + parts.join(';') + ']';
}

function squareToIndex(square, source) {
    if (!square || square.length < 2) return -1;
    const meta = getBoardMeta(source);
    const file = meta.files.indexOf(square[0]);
    const rank = meta.ranks.indexOf(square.slice(1));
    if (file < 0 || rank < 0) return -1;
    return rank * meta.files.length + file;
}

function indexToSquare(index, source) {
    const meta = getBoardMeta(source);
    if (index < 0 || index >= meta.files.length * meta.ranks.length) return null;
    return meta.files[index % meta.files.length] + meta.ranks[Math.floor(index / meta.files.length)];
}

function squareToCoords(square, source) {
    const meta = getBoardMeta(source);
    const index = squareToIndex(square, meta);
    if (index < 0) return null;
    return { file: index % meta.files.length, rank: Math.floor(index / meta.files.length) };
}

function coordsToSquare(file, rank, source) {
    const meta = getBoardMeta(source);
    if (file < 0 || file >= meta.files.length || rank < 0 || rank >= meta.ranks.length) return null;
    return meta.files[file] + meta.ranks[rank];
}

function pieceColor(piece) {
    if (!piece) return null;
    return piece === piece.toUpperCase() ? 'white' : 'black';
}

function oppositeColor(color) {
    return color === 'white' ? 'black' : 'white';
}

function parseFEN(fen) {
    const parts = String(fen || START_FEN).trim().split(/\s+/);
    const rows = (parts[0] || START_FEN.split(' ')[0]).split('/');
    const parsedRows = rows.map(row => {
        const tokens = [];
        for (let index = 0; index < row.length; index++) {
            const char = row[index];
            if (/^[0-9]$/.test(char)) {
                let digits = char;
                while (index + 1 < row.length && /^[0-9]$/.test(row[index + 1])) {
                    index += 1;
                    digits += row[index];
                }
                tokens.push(parseInt(digits, 10));
            } else {
                tokens.push(char);
            }
        }
        return tokens;
    });
    const height = parsedRows.length;
    const width = parsedRows.reduce((maxWidth, row) => {
        const rowWidth = row.reduce((total, token) => total + (typeof token === 'number' ? token : 1), 0);
        return Math.max(maxWidth, rowWidth);
    }, 0) || 8;
    const extras = parseFenExtras(parts, width, height);
    const files = extras.files || inferFilesForWidth(width);
    const ranks = extras.ranks || inferRanksForHeight(height);
    const board = new Array(width * height).fill(null);

    for (let rank = 0; rank < height; rank++) {
        const row = parsedRows[rank] || [width];
        let file = 0;
        row.forEach(token => {
            if (typeof token === 'number') {
                file += token;
                return;
            }
            if (file < width) {
                board[rank * width + file] = token;
            }
            file += 1;
        });
    }

    return {
        board,
        files,
        ranks,
        variantId: extras.variantId || 'standard',
        variantSetup: extras.setup || '',
        reserve: {
            white: cloneReserve(extras.reserve && extras.reserve.white),
            black: cloneReserve(extras.reserve && extras.reserve.black),
        },
        checks: Object.assign({ white: 0, black: 0 }, extras.checks || {}),
        promotedSquares: Array.isArray(extras.promotedSquares) ? extras.promotedSquares.slice() : [],
        activeColor: parts[1] === 'b' ? 'black' : 'white',
        castling: parts[2] && parts[2] !== '-' ? parts[2] : '',
        enPassant: parts[3] && parts[3] !== '-' ? parts[3] : null,
        halfmove: Number.isFinite(Number(parts[4])) ? parseInt(parts[4], 10) : 0,
        fullmove: Number.isFinite(Number(parts[5])) ? parseInt(parts[5], 10) : 1,
    };
}

currentGameState = parseFEN(START_FEN);

function serializeFEN(state) {
    const meta = getBoardMeta(state);
    const rows = [];
    for (let rank = 0; rank < meta.ranks.length; rank++) {
        let row = '';
        let empty = 0;
        for (let file = 0; file < meta.files.length; file++) {
            const piece = state.board[(rank * meta.files.length) + file];
            if (piece) {
                if (empty > 0) {
                    row += String(empty);
                    empty = 0;
                }
                row += piece;
            } else {
                empty += 1;
            }
        }
        if (empty > 0) row += String(empty);
        rows.push(row);
    }

    const active = state.activeColor === 'black' ? 'b' : 'w';
    const castling = state.castling || '-';
    const enPassant = state.enPassant || '-';
    return rows.join('/') + ' ' + active + ' ' + castling + ' ' + enPassant + ' ' + state.halfmove + ' ' + state.fullmove + serializeFenExtras(state);
}

function cloneGameState(state) {
    return {
        board: state.board.slice(),
        files: state.files,
        ranks: state.ranks,
        variantId: getVariantId(state),
        variantSetup: state.variantSetup || '',
        reserve: {
            white: cloneReserve(state.reserve && state.reserve.white),
            black: cloneReserve(state.reserve && state.reserve.black),
        },
        checks: Object.assign({ white: 0, black: 0 }, state.checks || {}),
        promotedSquares: Array.isArray(state.promotedSquares) ? state.promotedSquares.slice() : [],
        activeColor: state.activeColor,
        castling: state.castling,
        enPassant: state.enPassant,
        halfmove: state.halfmove,
        fullmove: state.fullmove,
    };
}

function getPieceAt(state, square) {
    const index = squareToIndex(square, state);
    return index >= 0 ? state.board[index] : null;
}

function setPieceAt(state, square, piece) {
    const index = squareToIndex(square, state);
    if (index >= 0) state.board[index] = piece || null;
}

function findKingSquare(state, color) {
    const target = color === 'white' ? 'K' : 'k';
    const index = state.board.indexOf(target);
    return index >= 0 ? indexToSquare(index, state) : null;
}

function removeCastlingRights(castling, rights) {
    let next = castling || '';
    for (const right of rights) {
        next = next.replace(right, '');
    }
    return next;
}

function isSquareAttacked(state, square, byColor) {
    const coords = squareToCoords(square, state);
    const meta = getBoardMeta(state);
    if (!coords) return false;

    const pawnRank = coords.rank + (byColor === 'white' ? 1 : -1);
    for (const fileOffset of [-1, 1]) {
        const pawnSquare = coordsToSquare(coords.file + fileOffset, pawnRank, meta);
        const pawn = pawnSquare ? getPieceAt(state, pawnSquare) : null;
        if (pawn && pieceColor(pawn) === byColor && pawn.toLowerCase() === 'p') return true;
    }

    const knightSteps = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
    for (const [df, dr] of knightSteps) {
        const fromSquare = coordsToSquare(coords.file + df, coords.rank + dr, meta);
        const attacker = fromSquare ? getPieceAt(state, fromSquare) : null;
        if (!attacker || pieceColor(attacker) !== byColor) continue;
        const lower = attacker.toLowerCase();
        if (lower === 'n' || lower === 'a' || lower === 'c') return true;
    }

    const sliderSets = [
        { dirs: [[1, 1], [1, -1], [-1, 1], [-1, -1]], pieces: ['b', 'q', 'a'] },
        { dirs: [[1, 0], [-1, 0], [0, 1], [0, -1]], pieces: ['r', 'q', 'c'] },
    ];

    for (const slider of sliderSets) {
        for (const [df, dr] of slider.dirs) {
            let file = coords.file + df;
            let rank = coords.rank + dr;
            while (file >= 0 && file < meta.files.length && rank >= 0 && rank < meta.ranks.length) {
                const fromSquare = coordsToSquare(file, rank, meta);
                const attacker = getPieceAt(state, fromSquare);
                if (attacker) {
                    if (pieceColor(attacker) === byColor && slider.pieces.includes(attacker.toLowerCase())) {
                        return true;
                    }
                    break;
                }
                file += df;
                rank += dr;
            }
        }
    }

    for (let df = -1; df <= 1; df++) {
        for (let dr = -1; dr <= 1; dr++) {
            if (df === 0 && dr === 0) continue;
            const fromSquare = coordsToSquare(coords.file + df, coords.rank + dr, meta);
            const attacker = fromSquare ? getPieceAt(state, fromSquare) : null;
            if (attacker && pieceColor(attacker) === byColor && attacker.toLowerCase() === 'k') return true;
        }
    }

    return false;
}

function buildMove(fromSquare, toSquare, piece, state, extra) {
    const details = extra || {};
    return {
        from: fromSquare,
        to: toSquare,
        piece,
        captured: Object.prototype.hasOwnProperty.call(details, 'captured') ? details.captured : getPieceAt(state, toSquare),
        promotion: details.promotion || null,
        isEnPassant: Boolean(details.isEnPassant),
        isCastle: Boolean(details.isCastle),
        rookFrom: details.rookFrom || null,
        rookTo: details.rookTo || null,
        isDrop: Boolean(details.isDrop),
        dropPiece: details.dropPiece || '',
    };
}

function getPromotionPiecesForState(state, color) {
    const base = ['Q', 'R', 'B', 'N'];
    if ((state.files || '').length === 10 && getVariantId(state) === 'capablanca') {
        base.splice(1, 0, 'C', 'A');
    }
    return color === 'white' ? base : base.map(piece => piece.toLowerCase());
}

function generateSliderMoves(state, fromSquare, piece, directions, moves) {
    const from = squareToCoords(fromSquare, state);
    const meta = getBoardMeta(state);
    const color = pieceColor(piece);
    directions.forEach(([df, dr]) => {
        let file = from.file + df;
        let rank = from.rank + dr;
        while (file >= 0 && file < meta.files.length && rank >= 0 && rank < meta.ranks.length) {
            const toSquare = coordsToSquare(file, rank, meta);
            const targetPiece = getPieceAt(state, toSquare);
            if (!targetPiece) {
                moves.push(buildMove(fromSquare, toSquare, piece, state));
            } else {
                if (pieceColor(targetPiece) !== color) {
                    moves.push(buildMove(fromSquare, toSquare, piece, state));
                }
                break;
            }
            file += df;
            rank += dr;
        }
    });
}

function getCastlingLayout(state, color) {
    if (usesTenFileCastling(state)) {
        return color === 'white'
            ? {
                kingFrom: 'f1',
                kingSide: { right: 'K', rookFrom: 'j1', rookTo: 'h1', kingTo: 'i1' },
                queenSide: { right: 'Q', rookFrom: 'a1', rookTo: 'd1', kingTo: 'c1' },
            }
            : {
                kingFrom: 'f8',
                kingSide: { right: 'k', rookFrom: 'j8', rookTo: 'h8', kingTo: 'i8' },
                queenSide: { right: 'q', rookFrom: 'a8', rookTo: 'd8', kingTo: 'c8' },
            };
    }
    return color === 'white'
        ? {
            kingFrom: 'e1',
            kingSide: { right: 'K', rookFrom: 'h1', rookTo: 'f1', kingTo: 'g1' },
            queenSide: { right: 'Q', rookFrom: 'a1', rookTo: 'd1', kingTo: 'c1' },
        }
        : {
            kingFrom: 'e8',
            kingSide: { right: 'k', rookFrom: 'h8', rookTo: 'f8', kingTo: 'g8' },
            queenSide: { right: 'q', rookFrom: 'a8', rookTo: 'd8', kingTo: 'c8' },
        };
}

function collectCastlingPathSquares(state, fromSquare, toSquare) {
    const from = squareToCoords(fromSquare, state);
    const to = squareToCoords(toSquare, state);
    const step = to.file > from.file ? 1 : -1;
    const squares = [];
    for (let file = from.file; file !== to.file + step; file += step) {
        const square = coordsToSquare(file, from.rank, state);
        if (square) squares.push(square);
    }
    return squares;
}

function collectInteriorSquares(state, leftSquare, rightSquare) {
    const left = squareToCoords(leftSquare, state);
    const right = squareToCoords(rightSquare, state);
    const squares = [];
    const step = right.file > left.file ? 1 : -1;
    for (let file = left.file + step; file !== right.file; file += step) {
        const square = coordsToSquare(file, left.rank, state);
        if (square) squares.push(square);
    }
    return squares;
}

function generatePseudoLegalMoves(state, fromSquare) {
    const piece = getPieceAt(state, fromSquare);
    if (!piece) return [];

    const color = pieceColor(piece);
    const from = squareToCoords(fromSquare, state);
    const meta = getBoardMeta(state);
    if (!from) return [];

    const moves = [];
    const lower = piece.toLowerCase();
    if (lower === 'p') {
        const promotionPieces = getPromotionPiecesForState(state, color);
        const direction = color === 'white' ? -1 : 1;
        const startRank = color === 'white' ? meta.ranks.length - 2 : 1;
        const promotionRank = color === 'white' ? 0 : meta.ranks.length - 1;
        const oneForward = coordsToSquare(from.file, from.rank + direction, meta);
        if (oneForward && !getPieceAt(state, oneForward)) {
            if (from.rank + direction === promotionRank) {
                promotionPieces.forEach(promotion => moves.push(buildMove(fromSquare, oneForward, piece, state, { promotion })));
            } else {
                moves.push(buildMove(fromSquare, oneForward, piece, state));
            }

            const twoForward = coordsToSquare(from.file, from.rank + direction * 2, meta);
            if (from.rank === startRank && twoForward && !getPieceAt(state, twoForward)) {
                moves.push(buildMove(fromSquare, twoForward, piece, state));
            }
        }

        [-1, 1].forEach(fileOffset => {
            const captureSquare = coordsToSquare(from.file + fileOffset, from.rank + direction, meta);
            if (!captureSquare) return;
            const targetPiece = getPieceAt(state, captureSquare);
            if (targetPiece && pieceColor(targetPiece) !== color) {
                if (from.rank + direction === promotionRank) {
                    promotionPieces.forEach(promotion => moves.push(buildMove(fromSquare, captureSquare, piece, state, { promotion })));
                } else {
                    moves.push(buildMove(fromSquare, captureSquare, piece, state));
                }
            } else if (state.enPassant === captureSquare) {
                const capturedSquare = coordsToSquare(from.file + fileOffset, from.rank, meta);
                moves.push(buildMove(fromSquare, captureSquare, piece, state, {
                    captured: capturedSquare ? getPieceAt(state, capturedSquare) : null,
                    isEnPassant: true,
                }));
            }
        });
        return moves;
    }

    if (lower === 'n' || lower === 'a' || lower === 'c') {
        [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]].forEach(([df, dr]) => {
            const toSquare = coordsToSquare(from.file + df, from.rank + dr, meta);
            if (!toSquare) return;
            const targetPiece = getPieceAt(state, toSquare);
            if (!targetPiece || pieceColor(targetPiece) !== color) {
                moves.push(buildMove(fromSquare, toSquare, piece, state));
            }
        });
        if (lower === 'n') return moves;
    }

    if (lower === 'b' || lower === 'q' || lower === 'a') {
        generateSliderMoves(state, fromSquare, piece, [[1, 1], [1, -1], [-1, 1], [-1, -1]], moves);
    }
    if (lower === 'r' || lower === 'q' || lower === 'c') {
        generateSliderMoves(state, fromSquare, piece, [[1, 0], [-1, 0], [0, 1], [0, -1]], moves);
    }
    if (lower === 'b' || lower === 'q' || lower === 'a' || lower === 'r' || lower === 'c') {
        return moves;
    }

    if (lower === 'k') {
        for (let df = -1; df <= 1; df++) {
            for (let dr = -1; dr <= 1; dr++) {
                if (df === 0 && dr === 0) continue;
                const toSquare = coordsToSquare(from.file + df, from.rank + dr, meta);
                if (!toSquare) continue;
                const targetPiece = getPieceAt(state, toSquare);
                if (!targetPiece || pieceColor(targetPiece) !== color) {
                    moves.push(buildMove(fromSquare, toSquare, piece, state));
                }
            }
        }

        const layout = getCastlingLayout(state, color);
        const enemy = oppositeColor(color);
        if (fromSquare === layout.kingFrom) {
            [layout.kingSide, layout.queenSide].forEach(side => {
                if (!state.castling.includes(side.right)) return;
                const rookPiece = getPieceAt(state, side.rookFrom);
                if (!rookPiece || pieceColor(rookPiece) !== color || rookPiece.toLowerCase() !== 'r') return;
                const betweenSquares = collectInteriorSquares(state, layout.kingFrom, side.rookFrom);
                if (betweenSquares.some(square => getPieceAt(state, square))) return;
                const kingPath = collectCastlingPathSquares(state, layout.kingFrom, side.kingTo);
                if (kingPath.some(square => square !== layout.kingFrom && getPieceAt(state, square) && square !== side.rookFrom)) return;
                if (kingPath.some(square => isSquareAttacked(state, square, enemy))) return;
                moves.push(buildMove(fromSquare, side.kingTo, piece, state, {
                    isCastle: true,
                    rookFrom: side.rookFrom,
                    rookTo: side.rookTo,
                }));
            });
        }
    }

    return moves;
}

function generateLegalDropMoves(state, pieceCode) {
    if (!usesReserveDrops(state)) return [];
    const dropPiece = normalizePocketPieceCode(pieceCode);
    if (!dropPiece) return [];
    const reserve = state.reserve && state.reserve[state.activeColor] ? state.reserve[state.activeColor] : createEmptyReserve();
    if ((reserve[dropPiece] || 0) <= 0) return [];

    const meta = getBoardMeta(state);
    const moves = [];
    for (let rank = 0; rank < meta.ranks.length; rank++) {
        for (let file = 0; file < meta.files.length; file++) {
            const toSquare = coordsToSquare(file, rank, meta);
            if (getPieceAt(state, toSquare)) continue;
            if (dropPiece === 'P' && (rank === 0 || rank === meta.ranks.length - 1)) continue;
            const move = buildMove('@' + dropPiece, toSquare, state.activeColor === 'white' ? dropPiece : dropPiece.toLowerCase(), state, {
                isDrop: true,
                dropPiece,
                captured: null,
            });
            if (isMoveLegal(state, move)) moves.push(move);
        }
    }
    return moves;
}

function applyMoveToState(state, move) {
    const next = cloneGameState(state);
    const movingColor = pieceColor(move.piece) || state.activeColor;
    const promotedSquares = new Set(Array.isArray(state.promotedSquares) ? state.promotedSquares : []);
    const movingWasPromoted = move.from && promotedSquares.has(move.from);
    if (move.from) promotedSquares.delete(move.from);

    if (move.isDrop) {
        const dropPiece = normalizePocketPieceCode(move.dropPiece || move.piece);
        const reserve = next.reserve && next.reserve[movingColor] ? next.reserve[movingColor] : createEmptyReserve();
        reserve[dropPiece] = Math.max(0, (reserve[dropPiece] || 0) - 1);
        next.reserve[movingColor] = reserve;
        setPieceAt(next, move.to, movingColor === 'white' ? dropPiece : dropPiece.toLowerCase());
        next.enPassant = null;
        next.halfmove = dropPiece === 'P' ? 0 : next.halfmove + 1;
    } else {
        const fromCoords = squareToCoords(move.from, state);
        const toCoords = squareToCoords(move.to, state);
        setPieceAt(next, move.from, null);

        let capturedPiece = move.captured || null;
        let capturedSquare = move.to;
        if (move.isEnPassant) {
            capturedSquare = coordsToSquare(toCoords.file, fromCoords.rank, state);
            capturedPiece = capturedSquare ? getPieceAt(state, capturedSquare) : capturedPiece;
            setPieceAt(next, capturedSquare, null);
        } else if (capturedPiece) {
            setPieceAt(next, move.to, null);
        }

        if (usesReserveDrops(state) && capturedPiece) {
            const reservePiece = promotedSquares.has(capturedSquare) ? 'P' : normalizePocketPieceCode(capturedPiece);
            const reserve = next.reserve && next.reserve[movingColor] ? next.reserve[movingColor] : createEmptyReserve();
            if (reservePiece) reserve[reservePiece] = (reserve[reservePiece] || 0) + 1;
            next.reserve[movingColor] = reserve;
        }
        promotedSquares.delete(capturedSquare);

        setPieceAt(next, move.to, move.promotion || move.piece);

        if (move.isCastle && move.rookFrom && move.rookTo) {
            const rook = getPieceAt(next, move.rookFrom);
            setPieceAt(next, move.rookFrom, null);
            setPieceAt(next, move.rookTo, rook);
        }

        if (move.piece === 'K') next.castling = removeCastlingRights(next.castling, 'KQ');
        if (move.piece === 'k') next.castling = removeCastlingRights(next.castling, 'kq');
        ['a1', 'h1', 'a8', 'h8', 'j1', 'j8'].forEach(square => {
            if (move.from === square || move.to === square) {
                const rights = square === 'a1' ? 'Q' : square === 'h1' ? 'K' : square === 'a8' ? 'q' : square === 'h8' ? 'k' : square === 'j1' ? 'K' : 'k';
                next.castling = removeCastlingRights(next.castling, rights);
            }
        });

        if (move.piece.toLowerCase() === 'p' && Math.abs(fromCoords.rank - toCoords.rank) === 2) {
            next.enPassant = coordsToSquare(fromCoords.file, (fromCoords.rank + toCoords.rank) / 2, state);
        } else {
            next.enPassant = null;
        }

        if (move.piece.toLowerCase() === 'p' || capturedPiece) next.halfmove = 0;
        else next.halfmove += 1;

        if (move.promotion) {
            promotedSquares.add(move.to);
        } else if (movingWasPromoted) {
            promotedSquares.add(move.to);
        }
    }

    if (movingColor === 'black') next.fullmove += 1;
    next.activeColor = oppositeColor(movingColor);
    next.promotedSquares = Array.from(promotedSquares);

    if (usesThreeCheck(next)) {
        const checks = Object.assign({ white: 0, black: 0 }, state.checks || {});
        const checkedKing = findKingSquare(next, next.activeColor);
        if (checkedKing && isSquareAttacked(next, checkedKing, movingColor)) {
            checks[movingColor] = (checks[movingColor] || 0) + 1;
        }
        next.checks = checks;
    }

    return next;
}

function isMoveLegal(state, move) {
    const next = applyMoveToState(state, move);
    const movingColor = move.isDrop ? state.activeColor : pieceColor(move.piece);
    const kingSquare = findKingSquare(next, movingColor);
    return Boolean(kingSquare) && !isSquareAttacked(next, kingSquare, oppositeColor(movingColor));
}

function generateLegalMovesFrom(state, fromSquare) {
    const piece = getPieceAt(state, fromSquare);
    if (!piece || pieceColor(piece) !== state.activeColor) return [];
    return generatePseudoLegalMoves(state, fromSquare).filter(move => isMoveLegal(state, move));
}

function generateAllLegalMoves(state) {
    const moves = [];
    for (let index = 0; index < state.board.length; index++) {
        const piece = state.board[index];
        if (!piece || pieceColor(piece) !== state.activeColor) continue;
        moves.push(...generateLegalMovesFrom(state, indexToSquare(index, state)));
    }
    if (usesReserveDrops(state)) {
        DEFAULT_RESERVE_ORDER.forEach(piece => {
            moves.push(...generateLegalDropMoves(state, piece));
        });
    }
    return moves;
}

function getGameStatus(state) {
    if (usesThreeCheck(state)) {
        const checks = state.checks || { white: 0, black: 0 };
        if ((checks.white || 0) >= 3) {
            return { legalMoves: [], inCheck: true, isOver: true, result: 'white-wins', message: 'White wins by delivering three checks' };
        }
        if ((checks.black || 0) >= 3) {
            return { legalMoves: [], inCheck: true, isOver: true, result: 'black-wins', message: 'Black wins by delivering three checks' };
        }
    }

    const legalMoves = generateAllLegalMoves(state);
    const kingSquare = findKingSquare(state, state.activeColor);
    const inCheck = kingSquare ? isSquareAttacked(state, kingSquare, oppositeColor(state.activeColor)) : false;
    if (legalMoves.length > 0) {
        return { legalMoves, inCheck, isOver: false, result: null, message: null };
    }
    if (inCheck) {
        const winner = oppositeColor(state.activeColor);
        return {
            legalMoves,
            inCheck,
            isOver: true,
            result: winner + '-wins',
            message: (winner === 'white' ? 'White' : 'Black') + ' wins by checkmate',
        };
    }
    return {
        legalMoves,
        inCheck,
        isOver: true,
        result: 'draw',
        message: 'Draw by stalemate',
    };
}

function getPieceValue(piece) {
    switch ((piece || '').toLowerCase()) {
        case 'p': return 100;
        case 'n': return 320;
        case 'b': return 330;
        case 'r': return 500;
        case 'a': return 700;
        case 'c': return 820;
        case 'q': return 900;
        case 'k': return 0;
        default: return 0;
    }
}

function evaluateState(state, engineColor) {
    let score = 0;
    for (let index = 0; index < state.board.length; index++) {
        const piece = state.board[index];
        if (!piece) continue;
        const value = getPieceValue(piece);
        score += pieceColor(piece) === engineColor ? value : -value;
    }
    if (usesReserveDrops(state)) {
        const ownReserve = reserveToList(state.reserve && state.reserve[engineColor]);
        const oppReserve = reserveToList(state.reserve && state.reserve[oppositeColor(engineColor)]);
        ownReserve.forEach(entry => { score += getPieceValue(entry.piece) * entry.count; });
        oppReserve.forEach(entry => { score -= getPieceValue(entry.piece) * entry.count; });
    }
    const mobility = generateAllLegalMoves(state).length;
    score += state.activeColor === engineColor ? mobility * 3 : -mobility * 3;
    return score;
}

function scoreMoveHeuristic(move) {
    let score = 0;
    if (move.captured) score += getPieceValue(move.captured) - getPieceValue(move.piece) / 10;
    if (move.promotion) score += getPieceValue(move.promotion);
    if (move.isCastle) score += 40;
    if (move.isDrop) score += 24 + getPieceValue(move.dropPiece) / 20;
    return score;
}

function minimax(state, depth, alpha, beta, engineColor) {
    const status = getGameStatus(state);
    if (status.isOver) {
        if (status.result === 'draw') return 0;
        return state.activeColor === engineColor ? -100000 - depth : 100000 + depth;
    }
    if (depth <= 0) {
        return evaluateState(state, engineColor);
    }

    const orderedMoves = status.legalMoves.slice().sort((a, b) => scoreMoveHeuristic(b) - scoreMoveHeuristic(a));
    const maximizing = state.activeColor === engineColor;
    if (maximizing) {
        let bestScore = -Infinity;
        for (const move of orderedMoves) {
            const score = minimax(applyMoveToState(state, move), depth - 1, alpha, beta, engineColor);
            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }
        return bestScore;
    }

    let bestScore = Infinity;
    for (const move of orderedMoves) {
        const score = minimax(applyMoveToState(state, move), depth - 1, alpha, beta, engineColor);
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
    }
    return bestScore;
}

function chooseEngineMove(state, engineColor) {
    const legalMoves = generateAllLegalMoves(state);
    if (!legalMoves.length) return null;
    const orderedMoves = legalMoves.slice().sort((a, b) => scoreMoveHeuristic(b) - scoreMoveHeuristic(a));
    let bestMove = orderedMoves[0];
    let bestScore = -Infinity;
    for (const move of orderedMoves) {
        const nextState = applyMoveToState(state, move);
        const score = minimax(nextState, PLAY_CONFIG.searchDepth - 1, -Infinity, Infinity, engineColor);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}

function syncControllerSnapshot(snapshot) {
    if (!snapshot) return;
    if (diagnosticsPreview && snapshot.currentBoardFEN !== (diagnosticsPreview.liveSourceFen || diagnosticsPreview.sourceFen)) {
        diagnosticsPreview = null;
    }
    currentBoardFEN = snapshot.currentBoardFEN;
    currentGameState = snapshot.currentGameState;
    selectedSquare = snapshot.selectedSquare;
    legalTargets = snapshot.legalTargets.slice();
    lastMoveSquares = snapshot.lastMoveSquares.slice();
    moveHistory = snapshot.moveHistory.slice();
    currentMoveIndex = snapshot.currentMoveIndex;
    currentEngineInfo = snapshot.currentEngineInfo;
    engineThinking = snapshot.engineThinking;
    currentOpeningState = snapshot.opening || null;
}

function ensureGameController() {
    if (!gameController && typeof window.createGameController === 'function') {
        const modeConfig = getPlayModeConfig(currentPlayMode);
        gameController = window.createGameController({
            config: {
                startFEN: getStartFENForMode(currentPlayMode),
                humanColor: modeConfig.humanColors[0] || PLAY_CONFIG.humanColor,
                engineColor: modeConfig.engineColors[0] || PLAY_CONFIG.engineColor,
                humanColors: modeConfig.humanColors.slice(),
                engineColors: modeConfig.engineColors.slice(),
                canHumanMove(color) {
                    return isHumanControlledColor(color);
                },
            },
            parseFEN,
            serializeFEN,
            getPieceAt,
            pieceColor,
            generateLegalMovesFrom,
            generateLegalDropMoves,
            generateAllLegalMoves,
            applyMoveToState,
            moveToUCI,
            getGameStatus,
            findKingSquare,
            isSquareAttacked,
            oppositeColor,
            validateFEN(fen) {
                return typeof window.validateFEN === 'function'
                    ? window.validateFEN(fen)
                    : { valid: true };
            },
            notation: window.Chess2Notation || null,
            openings: OPENINGS_PROXY,
        });
        gameController.subscribe(syncControllerSnapshot);
    }

    return gameController;
}

function ensurePlayEngine() {
    if (!playEngine && typeof window.createPlayEngine === 'function') {
        try {
            playEngine = window.createPlayEngine({ preferWorker: true });
        } catch (error) {
            console.error('UI.js: failed to create engine instance.', error);
            playEngine = null;
        }
    }

    if (!playEngine && typeof window.createEngine === 'function') {
        try {
            playEngine = window.createEngine();
        } catch (error) {
            console.error('UI.js: failed to create local engine fallback.', error);
            playEngine = null;
        }
    }

    return playEngine;
}

function ensureMultiplayerClient() {
    if (!multiplayerClient && window.Chess2MatchmakingClient && typeof window.Chess2MatchmakingClient.create === 'function') {
        multiplayerClient = window.Chess2MatchmakingClient.create({
            onMatchStarted(payload) {
                startOnlineMatch(payload);
            },
            onSpectateStarted(payload) {
                startOnlineMatch(payload);
            },
            onMove(payload) {
                applyRemoteOnlineMove(payload);
            },
            onGameResult() {
                renderPlayView();
                updatePlayState();
            },
            onOpponentLeft() {
                setPlayStatus('Opponent left the online game.', 'over');
                renderPlayView();
            },
        });
        multiplayerClient.subscribe(state => {
            multiplayerState = Object.assign(createDefaultMultiplayerState(), state || {});
            applyPlayMode(currentPlayMode);
            if (requestedMultiplayerAction === 'auto-join' && multiplayerState.mode === 'idle') {
                requestedMultiplayerAction = null;
            }
            renderPlayView();
            updatePlayState();
        });
    }

    return multiplayerClient;
}

function startOnlineMatch(payload) {
    const controller = ensureGameController();
    cancelEngineTurn();
    applyPlayMode('play-online');
    if (controller) {
        controller.loadFEN((payload && payload.fen) || START_FEN);
        controller.setEngineInfo(null);
        controller.setEngineThinking(false);
    }
    diagnosticsPreview = null;
    if (typeof window.Chess2ShowView === 'function') {
        window.Chess2ShowView('play-online');
    }
    paintPosition(currentBoardFEN);
}

function applyRemoteOnlineMove(payload) {
    if (!payload || !payload.move || !payload.move.uci) return;
    const controller = ensureGameController();
    if (!controller) return;
    const applied = controller.applyMoveFromUCI(payload.move.uci);
    if (!applied) {
        console.warn('UI.js: failed to apply remote move', payload.move.uci);
        return;
    }
    paintPosition(currentBoardFEN);
}

function getOnlineInfo() {
    const players = Object.assign({ white: false, black: false }, multiplayerState.players || {});
    const localColor = String(multiplayerState.localColor || '').toLowerCase();
    const opponentColor = localColor === 'white'
        ? 'black'
        : (localColor === 'black' ? 'white' : '');
    const reconnecting = !multiplayerState.connected && Boolean(multiplayerState.reconnectToken);
    const opponentDisconnected = multiplayerState.mode === 'in-game'
        && Boolean(opponentColor)
        && !players[opponentColor];
    const drawOffer = multiplayerState.drawOffer || null;
    const playerSideActive = multiplayerState.mode === 'in-game' && (localColor === 'white' || localColor === 'black');
    const canRespondToDraw = Boolean(drawOffer && drawOffer.from && drawOffer.from !== localColor && playerSideActive);
    const canManageOwnDrawOffer = Boolean(drawOffer && drawOffer.from === localColor && playerSideActive);

    return {
        connected: Boolean(multiplayerState.connected),
        connecting: Boolean(multiplayerState.connecting),
        mode: multiplayerState.mode,
        modeLabel: formatMultiplayerMode(multiplayerState.mode),
        message: multiplayerState.lastError || multiplayerState.message,
        gameId: multiplayerState.gameId || '',
        localColor: multiplayerState.localColor || '',
        opponentColor,
        joinUrl: multiplayerState.joinUrl || '',
        joinInputValue: multiplayerState.joinInputValue || '',
        serverUrl: multiplayerState.serverUrl || '',
        reconnecting,
        opponentDisconnected,
        spectating: Boolean(multiplayerState.spectating),
        spectatorCount: Number(multiplayerState.spectatorCount) || 0,
        currentResult: multiplayerState.currentResult || null,
        roomPlayers: Object.assign({ white: null, black: null }, multiplayerState.roomPlayers || {}),
        profile: Object.assign({ id: '', displayName: 'Guest', rating: 1200, games: 0, wins: 0, losses: 0, draws: 0 }, multiplayerState.profile || {}),
        liveGames: Array.isArray(multiplayerState.liveGames) ? multiplayerState.liveGames.slice() : [],
        leaderboard: Array.isArray(multiplayerState.leaderboard) ? multiplayerState.leaderboard.slice() : [],
        recentResults: Array.isArray(multiplayerState.recentResults) ? multiplayerState.recentResults.slice() : [],
        chatMessages: Array.isArray(multiplayerState.chatMessages) ? multiplayerState.chatMessages.slice() : [],
        lobbyMessages: Array.isArray(multiplayerState.lobbyMessages) ? multiplayerState.lobbyMessages.slice() : [],
        drawOffer,
        clubs: Array.isArray(multiplayerState.clubs) ? multiplayerState.clubs.slice() : [],
        tournaments: Array.isArray(multiplayerState.tournaments) ? multiplayerState.tournaments.slice() : [],
        matchContext: multiplayerState.matchContext || null,
        roomUnreadCount: Number(multiplayerState.roomUnreadCount) || 0,
        lobbyUnreadCount: Number(multiplayerState.lobbyUnreadCount) || 0,
        chatUnreadCount: (Number(multiplayerState.roomUnreadCount) || 0) + (Number(multiplayerState.lobbyUnreadCount) || 0),
        queueSize: Number(multiplayerState.queueSize) || 0,
        rated: Boolean(multiplayerState.rated),
        players,
        whiteStatus: players.white ? 'connected' : 'offline',
        blackStatus: players.black ? 'connected' : 'offline',
        canCancel: ['queueing', 'creating-private', 'joining-private', 'waiting-private'].includes(multiplayerState.mode),
        canLeave: ['in-game', 'spectating', 'waiting-private', 'finished'].includes(multiplayerState.mode),
        canResign: playerSideActive,
        canOfferDraw: playerSideActive && !drawOffer,
        canAcceptDraw: canRespondToDraw,
        canDeclineDraw: canRespondToDraw,
        canCancelDraw: canManageOwnDrawOffer,
    };
}

function formatMultiplayerMode(mode) {
    switch (String(mode || 'idle')) {
        case 'queueing':
            return 'Matchmaking';
        case 'creating-private':
            return 'Creating';
        case 'waiting-private':
            return 'Private Host';
        case 'joining-private':
            return 'Joining';
        case 'in-game':
            return 'Online Game';
        case 'spectating':
            return 'Spectating';
        case 'finished':
            return 'Finished';
        default:
            return 'Offline';
    }
}

function startGlobalMatchmaking() {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    applyPlayMode('play-online');
    if (requestedMultiplayerSection === 'chat') {
        requestedMultiplayerChatScope = 'lobby';
    }
    return client.findMatch().then(() => {
        setPlayStatus('Looking for an online match...', 'thinking');
        return true;
    }).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to start matchmaking.', 'over');
        renderPlayView();
        return false;
    });
}

function createPrivateOnlineGame() {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    applyPlayMode('play-online');
    if (requestedMultiplayerSection === 'chat') {
        requestedMultiplayerChatScope = 'room';
    }
    return client.createPrivateGame().catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to create private game.', 'over');
        renderPlayView();
        return false;
    });
}

function joinPrivateOnlineGame(gameId) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    multiplayerState.joinInputValue = String(gameId || '').trim();
    applyPlayMode('play-online');
    return client.joinPrivateGame(gameId).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to join private game.', 'over');
        renderPlayView();
        return false;
    });
}

function spectateLiveGame(gameId) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    applyPlayMode('play-online');
    if (requestedMultiplayerSection === 'chat') {
        requestedMultiplayerChatScope = 'room';
    }
    return client.spectateGame(gameId).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to spectate that game.', 'over');
        renderPlayView();
        return false;
    });
}

function stopSpectatingOnline() {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.resolve(false);
    return client.stopSpectating().catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to stop spectating.', 'over');
        renderPlayView();
        return false;
    });
}

function updateMultiplayerProfile(displayName) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    return client.setProfile({
        id: multiplayerState.profile && multiplayerState.profile.id ? multiplayerState.profile.id : '',
        displayName,
    }).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to save multiplayer profile.', 'over');
        renderPlayView();
        return false;
    });
}

function sendOnlineChatMessage(text) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    const chatScope = resolveMultiplayerChatScope(getOnlineInfo());
    const sender = chatScope === 'room' ? client.sendChatMessage.bind(client) : client.sendLobbyChatMessage.bind(client);
    return sender(text).then(() => {
        saveMultiplayerChatDraft('');
        renderMultiplayerView();
        return true;
    }).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to send chat message.', 'over');
        renderPlayView();
        return false;
    });
}

function resignOnlineGame() {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    return client.resignGame().catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to resign the online game.', 'over');
        renderPlayView();
        return false;
    });
}

function sendOnlineDrawAction(action) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    return client.sendDrawAction(action).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to update draw state.', 'over');
        renderPlayView();
        return false;
    });
}

function refreshMultiplayerFeeds() {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.resolve(false);
    return Promise.all([
        client.requestLiveGames(),
        client.requestLeaderboard(),
        client.requestClubs(),
        client.requestTournaments(),
        client.requestLobbyChat(),
    ]).then(() => true).catch(() => false);
}

function createClub(input) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    return client.createClub(input).then(() => {
        multiplayerClubDraft = { name: '', description: '' };
        renderMultiplayerView();
        return true;
    }).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to create club.', 'over');
        renderMultiplayerView();
        return false;
    });
}

function joinClub(clubId) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    return client.joinClub(clubId).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to join club.', 'over');
        renderMultiplayerView();
        return false;
    });
}

function leaveClub(clubId) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    return client.leaveClub(clubId).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to leave club.', 'over');
        renderMultiplayerView();
        return false;
    });
}

function createTournament(input) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    return client.createTournament(input).then(() => {
        multiplayerTournamentDraft = { name: '', description: '', clubId: '' };
        renderMultiplayerView();
        return true;
    }).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to create tournament.', 'over');
        renderMultiplayerView();
        return false;
    });
}

function joinTournament(tournamentId) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    return client.joinTournament(tournamentId).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to join tournament.', 'over');
        renderMultiplayerView();
        return false;
    });
}

function leaveTournament(tournamentId) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    return client.leaveTournament(tournamentId).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to leave tournament.', 'over');
        renderMultiplayerView();
        return false;
    });
}

function startTournament(tournamentId) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    return client.startTournament(tournamentId).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to start tournament.', 'over');
        renderMultiplayerView();
        return false;
    });
}

function joinTournamentMatch(tournamentId, pairingId) {
    const client = ensureMultiplayerClient();
    if (!client) return Promise.reject(new Error('Multiplayer client unavailable.'));
    applyPlayMode('play-online');
    return client.joinTournamentMatch(tournamentId, pairingId).then(() => {
        requestedMultiplayerSection = 'tournaments';
        return true;
    }).catch(error => {
        setPlayStatus(error && error.message ? error.message : 'Unable to open the assigned tournament match.', 'over');
        renderMultiplayerView();
        return false;
    });
}

function leaveOnlineGame() {
    const client = ensureMultiplayerClient();
    if (!client) return;
    client.leaveGame();
    applyPlayMode('play');
    setPlayStatus('Left online game.', 'ready');
    renderPlayView();
}

function copyPrivateGameLink() {
    if (!multiplayerState.joinUrl) return Promise.resolve(false);
    if (window.Chess2Storage && typeof window.Chess2Storage.copyText === 'function') {
        return window.Chess2Storage.copyText(multiplayerState.joinUrl);
    }
    return Promise.resolve(false);
}

function ensurePlayView() {
    ensureGameController();

    if (!playView && window.Chess2PlayView && typeof window.Chess2PlayView.create === 'function') {
        playView = window.Chess2PlayView.create({
            files: FILES,
            ranks: RANKS,
            createPiece,
            onSquareClick(squareName) {
                if (boardMode !== '2d') return;
                handleBoardSquareClick(squareName);
            },
            onSelectReservePiece(pieceCode) {
                const controller = ensureGameController();
                if (!controller || !usesReserveDrops(currentGameState)) return;
                controller.selectReservePiece(pieceCode);
                refreshBoardAnnotations();
            },
            onNewGame() {
                if (!canStartLocalGame()) return;
                startNewGame();
            },
            onUndoMove() {
                if (isOnlineModeActive()) return;
                undoLastMove();
            },
            onGoStart() {
                if (!canReviewHistory()) return;
                navigateToMove(-1);
            },
            onGoPrevious() {
                if (!canReviewHistory()) return;
                navigateToMove(currentMoveIndex - 1);
            },
            onGoNext() {
                if (!canReviewHistory()) return;
                navigateToMove(currentMoveIndex + 1);
            },
            onGoEnd() {
                if (!canReviewHistory()) return;
                navigateToMove(moveHistory.length - 1);
            },
            canNewGame() {
                return canStartLocalGame();
            },
            canUndo() {
                if (isPuzzleSessionActive() || isOnlineModeActive() || (currentPlayMode === 'play-human' && shouldUseTimedLocalClock())) return false;
                const controller = ensureGameController();
                return controller ? controller.canUndo() : false;
            },
            canGoPrevious() {
                if (!canReviewHistory()) return false;
                const controller = ensureGameController();
                return controller ? controller.canGoPrevious() : false;
            },
            canGoNext() {
                if (!canReviewHistory()) return false;
                const controller = ensureGameController();
                return controller ? controller.canGoNext() : false;
            },
            onSelectMove(index, entry) {
                if (!canReviewHistory()) return;
                if (!entry || !entry.nextFen) return;
                navigateToMove(index);
            },
            onPlayOpeningMove(uciMove) {
                if (isOnlineModeActive()) return;
                const controller = ensureGameController();
                if (!controller) return;
                controller.applyMoveFromUCI(uciMove);
                paintPosition(currentBoardFEN);
            },
            onOpeningsView() {
                if (typeof window.Chess2ShowView === 'function') {
                    window.Chess2ShowView('openings');
                }
            },
            onPlayOnline() {
                startGlobalMatchmaking();
            },
            onCancelOnline() {
                const client = ensureMultiplayerClient();
                if (client) {
                    client.cancelMatchmaking();
                }
            },
            onCreatePrivateGame() {
                createPrivateOnlineGame();
            },
            onJoinPrivateGame(gameId) {
                joinPrivateOnlineGame(gameId);
            },
            onCopyPrivateLink() {
                copyPrivateGameLink();
            },
            onLeaveOnlineGame() {
                leaveOnlineGame();
            },
            onResignOnlineGame() {
                resignOnlineGame();
            },
            onOfferDraw() {
                sendOnlineDrawAction('offer');
            },
            onAcceptDraw() {
                sendOnlineDrawAction('accept');
            },
            onDeclineDraw() {
                sendOnlineDrawAction('decline');
            },
            onCancelDraw() {
                sendOnlineDrawAction('cancel');
            },
            onOpenGameOptions() {
                requestedSettingsSection = 'time-controls';
                if (typeof window.Chess2ShowView === 'function') {
                    window.Chess2ShowView('settings');
                }
            },
            onPuzzleHint() {
                const runtime = ensurePuzzleRuntime();
                if (!runtime.active) return;
                runtime.hintVisible = !runtime.hintVisible;
                renderPlayView();
            },
            onPuzzleReveal() {
                revealPuzzleSolution();
            },
            onPuzzleNext() {
                nextPuzzleSession();
            },
            onPuzzleRestart() {
                restartPuzzleSession();
            },
        });
    }

    return playView;
}

function ensureOpeningsView() {
    ensureGameController();

    if (!openingsView && window.Chess2OpeningsView && typeof window.Chess2OpeningsView.create === 'function') {
        openingsView = window.Chess2OpeningsView.create({
            onPlayMove(uciMove) {
                const controller = ensureGameController();
                if (!controller) return;
                controller.applyMoveFromUCI(uciMove);
                paintPosition(currentBoardFEN);
            },
            onLoadEcoLine(uciLine) {
                const controller = ensureGameController();
                if (!controller) return;
                const result = controller.importUCILine(uciLine);
                if (!result || result.ok === false) return;
                paintPosition(currentBoardFEN);
                renderOpeningsView();
            },
            onSelectMove(index) {
                navigateToMove(index);
                renderOpeningsView();
            },
            onChangeSection(section) {
                requestedOpeningsSection = resolveOpeningsSection(section);
                renderOpeningsView();
            },
            onShowPlay() {
                if (typeof window.Chess2ShowView === 'function') {
                    window.Chess2ShowView('play');
                }
            },
        });
    }

    return openingsView;
}

function ensureAnalysisView() {
    ensureGameController();

    if (!analysisView && window.Chess2AnalysisView && typeof window.Chess2AnalysisView.create === 'function') {
        analysisView = window.Chess2AnalysisView.create({
            files: FILES,
            ranks: RANKS,
            createPiece,
            onSquareClick(squareName) {
                handleBoardSquareClick(squareName);
            },
            onStartAnalysis() {
                startAnalysisSession();
            },
            onStopAnalysis() {
                stopAnalysisSession();
            },
            onChangeSection(section) {
                requestedAnalysisSection = resolveAnalysisSection(section);
                renderAnalysisView();
                maybeStartAnalysisForSection(requestedAnalysisSection);
            },
            onPreviewMove(fen, uciMove) {
                return previewAnalysisMove(fen, uciMove);
            },
            onPlayMove(fen, uciMove) {
                return playAnalysisMove(fen, uciMove);
            },
            onClearPreview() {
                return clearAnalysisPreview();
            },
            onSelectMove(index) {
                navigateToMove(index);
                renderAnalysisView();
            },
            onSyncCurrent() {
                navigateToMove(moveHistory.length - 1);
                renderAnalysisView();
            },
        });
    }

    return analysisView;
}

function ensureLoadSaveView() {
    ensureGameController();

    if (!loadSaveView && window.Chess2LoadSaveView && typeof window.Chess2LoadSaveView.create === 'function') {
        loadSaveView = window.Chess2LoadSaveView.create({
            getSnapshot() {
                const controller = ensureGameController();
                return controller ? controller.getSnapshot() : null;
            },
            onLoadFEN(fen) {
                const controller = ensureGameController();
                if (!controller) return { ok: false, error: 'Controller unavailable.' };
                const result = controller.loadFEN(fen);
                if (result && result.ok) paintPosition(currentBoardFEN);
                return result;
            },
            onCopyFEN() {
                const controller = ensureGameController();
                return window.Chess2Storage && controller ? window.Chess2Storage.copyText(controller.exportFEN()) : Promise.resolve(false);
            },
            onDownloadFEN() {
                const controller = ensureGameController();
                if (window.Chess2Storage && controller) window.Chess2Storage.downloadText('position.fen', controller.exportFEN());
            },
            onCopyPGN() {
                const controller = ensureGameController();
                return window.Chess2Storage && controller ? window.Chess2Storage.copyText(controller.exportPGN()) : Promise.resolve(false);
            },
            onImportPGN(text) {
                const controller = ensureGameController();
                if (!controller || typeof controller.importPGN !== 'function') {
                    return { ok: false, error: 'Controller unavailable.' };
                }
                const result = controller.importPGN(text);
                if (result && result.ok) {
                    if (typeof window.Chess2ShowView === 'function') {
                        window.Chess2ShowView('play');
                    }
                    paintPosition(currentBoardFEN);
                }
                return result;
            },
            onPickPGN() {
                const controller = ensureGameController();
                if (!window.Chess2Storage || typeof window.Chess2Storage.openTextFile !== 'function') {
                    return Promise.resolve({ ok: false, error: 'File picker unavailable.' });
                }
                if (!controller || typeof controller.importPGN !== 'function') {
                    return Promise.resolve({ ok: false, error: 'Controller unavailable.' });
                }
                return window.Chess2Storage.openTextFile({
                    accept: '.pgn,.txt,text/plain,application/x-chess-pgn'
                }).then(fileResult => {
                    if (!fileResult || !fileResult.ok) return fileResult;
                    const importResult = controller.importPGN(fileResult.text);
                    if (!(importResult && importResult.ok)) return importResult;
                    if (typeof window.Chess2ShowView === 'function') {
                        window.Chess2ShowView('play');
                    }
                    paintPosition(currentBoardFEN);
                    return {
                        ok: true,
                        name: fileResult.name,
                        text: fileResult.text,
                        importedMoves: importResult.importedMoves,
                    };
                });
            },
            onDownloadPGN() {
                const controller = ensureGameController();
                if (window.Chess2Storage && controller) window.Chess2Storage.downloadText('game.pgn', controller.exportPGN());
            },
            onImportUCILine(text) {
                const controller = ensureGameController();
                if (!controller) return { ok: false, error: 'Controller unavailable.' };
                const result = controller.importUCILine(text);
                if (result && result.ok) paintPosition(currentBoardFEN);
                return result;
            },
            onCopyUCILine() {
                const controller = ensureGameController();
                return window.Chess2Storage && controller ? window.Chess2Storage.copyText(controller.exportUCILine()) : Promise.resolve(false);
            },
        });
    }

    return loadSaveView;
}

function ensureToolsView() {
    ensureGameController();

    if (!toolsView && window.Chess2ToolsView && typeof window.Chess2ToolsView.create === 'function') {
        toolsView = window.Chess2ToolsView.create({
            getSnapshot() {
                const controller = ensureGameController();
                return controller ? controller.getSnapshot() : null;
            },
            getModuleStatus() {
                const engine = ensurePlayEngine();
                const nnueStatus = window.NNUE && typeof window.NNUE.getStatus === 'function'
                    ? window.NNUE.getStatus()
                    : null;
                return {
                    protocol: typeof window.location !== 'undefined' ? window.location.protocol : 'unknown',
                    engineMode: engine && engine.mode ? engine.mode : 'unknown',
                    BB_ATTACKS: typeof window.BB_ATTACKS !== 'undefined',
                    Position: typeof window.Position !== 'undefined',
                    MoveGen: typeof window.MoveGen !== 'undefined',
                    ZOBRIST: typeof window.ZOBRIST !== 'undefined',
                    TT: typeof window.TT !== 'undefined',
                    ORDER: typeof window.ORDER !== 'undefined',
                    STACK: typeof window.STACK !== 'undefined',
                    EVAL: typeof window.EVAL !== 'undefined',
                    NNUE: typeof window.NNUE !== 'undefined',
                    nnueStatus,
                    SEARCH: typeof window.SEARCH !== 'undefined',
                    PERFT: typeof window.PERFT !== 'undefined',
                };
            },
            getReferencePositions() {
                return getDiagnosticReferencePositions();
            },
            getPreviewInfo() {
                return diagnosticsPreview ? {
                    sourceFen: diagnosticsPreview.sourceFen,
                    previewFen: diagnosticsPreview.fen,
                    moveUci: diagnosticsPreview.moveUci,
                    moveSAN: diagnosticsPreview.moveSAN,
                } : null;
            },
            getTTSummary() {
                return getTTStats();
            },
            getTestLinks() {
                return [
                    { id: 'hub', label: 'Browser Test Hub', description: 'Open the browser-first suite launcher.', href: 'tests/index.html' },
                    { id: 'smoke', label: 'Smoke Suite', description: 'Fast daily browser regression pass.', href: 'tests/engine-smoke.html' },
                    { id: 'deep', label: 'Deep Suite', description: 'Deeper search and divide checks.', href: 'tests/engine-deep.html' },
                    { id: 'full', label: 'Full Suite', description: 'Combined smoke and deep pass.', href: 'tests/engine-tests.html' },
                    { id: 'harness', label: 'Manual Engine Harness', description: 'Manual diagnostics and reference comparisons.', href: 'engine-harness.html' },
                    { id: 'scan-kqk', label: 'KQK Scan', description: 'Open the KQK mate scan page.', href: 'tests/scanKQK.html' },
                    { id: 'scan-simple-mates', label: 'Simple Mate Scan', description: 'Open the simple mate scan page.', href: 'tests/scanSimpleMates.html' },
                ];
            },
            useCurrentPosition() {
                const controller = ensureGameController();
                return controller ? controller.exportFEN() : currentBoardFEN;
            },
            validateFEN(fen) {
                return typeof window.validateFEN === 'function'
                    ? window.validateFEN(fen)
                    : { valid: true };
            },
            previewInspectedMove(fen, uciMove) {
                const preview = createDiagnosticsPreview(fen, uciMove);
                if (!preview) {
                    throw new Error('Unable to build a preview for that move.');
                }
                diagnosticsPreview = preview;
                if (typeof window.Chess2ShowView === 'function') {
                    window.Chess2ShowView('play');
                } else {
                    paintPosition(currentBoardFEN);
                }
                return {
                    ok: true,
                    message: 'Previewing ' + preview.moveSAN + ' (' + preview.moveUci + ') on the board.',
                };
            },
            clearInspectedPreview() {
                if (!diagnosticsPreview) {
                    return { ok: true, message: 'No preview is active.' };
                }
                diagnosticsPreview = null;
                paintPosition(currentBoardFEN);
                return { ok: true, message: 'Preview cleared.' };
            },
            playInspectedMove(fen, uciMove) {
                const preview = createDiagnosticsPreview(fen, uciMove);
                const controller = ensureGameController();
                const snapshot = controller ? controller.getSnapshot() : null;
                if (!preview || !controller || !snapshot) {
                    throw new Error('Unable to play that move from the current controller state.');
                }
                if (snapshot.currentBoardFEN !== preview.sourceFen) {
                    throw new Error('The live board does not match the inspected FEN. Use Current Position before inspecting, or load the same position first.');
                }
                if (snapshot.currentMoveIndex !== snapshot.moveHistory.length - 1) {
                    throw new Error('Return to the live position before playing a move from Move Inspector.');
                }
                diagnosticsPreview = null;
                const applied = controller.applyEngineMoveFromUCI(preview.moveUci);
                if (!applied) {
                    throw new Error('That move is no longer legal in the live position.');
                }
                if (typeof window.Chess2ShowView === 'function') {
                    window.Chess2ShowView('play');
                }
                paintPosition(currentBoardFEN);
                return {
                    ok: true,
                    message: 'Played ' + preview.moveSAN + ' (' + preview.moveUci + ') into the live game.',
                };
            },
            runQuickCheck() {
                if (!window.PERFT || typeof window.PERFT.perft !== 'function' || typeof window.Position !== 'function') {
                    throw new Error('PERFT is not available.');
                }

                const pos = new window.Position();
                pos.loadFEN('startpos');
                const d1 = window.PERFT.perft(pos, 1, 0);
                const d2 = window.PERFT.perft(pos, 2, 0);
                const d3 = window.PERFT.perft(pos, 3, 0);
                return {
                    ok: d1 === 20 && d2 === 400 && d3 === 8902,
                    lines: [
                        'startpos perft',
                        'depth 1: ' + d1,
                        'depth 2: ' + d2,
                        'depth 3: ' + d3,
                    ],
                };
            },
            runPerft(fen, depth) {
                const pos = createDiagnosticPosition(fen);
                const nodes = window.PERFT.perft(pos, depth, 0);
                return {
                    ok: true,
                    lines: [
                        'perft result',
                        'fen: ' + pos.toFEN(),
                        'depth: ' + depth,
                        'nodes: ' + nodes,
                    ],
                };
            },
            inspectMoves(fen, depth) {
                const pos = createDiagnosticPosition(fen);
                const list = new window.MoveList();
                window.MoveGen.generateLegalMoves(pos, list);
                const scoredMoves = new Map();
                const topScores = [];
                const rows = [];

                const lines = [
                    'move inspector',
                    'fen: ' + pos.toFEN(),
                    'side to move: ' + (pos.side === window.ChessCore.COLOR_BLACK ? 'black' : 'white'),
                    'legal moves: ' + list.count,
                ];

                if (window.SEARCH && typeof window.SEARCH.rootMoves === 'function') {
                    const rootMoves = window.SEARCH.rootMoves(pos, Math.max(1, depth)).slice(0, 12);
                    lines.push('');
                    lines.push('top root scores');
                    rootMoves.forEach((entry, index) => {
                        scoredMoves.set(entry.move, entry.score);
                        topScores.push({
                            rank: index + 1,
                            uci: entry.move,
                            score: entry.score,
                        });
                        lines.push(String(index + 1).padStart(2, ' ') + '. ' + entry.move + '  score=' + entry.score);
                    });
                }

                lines.push('');
                lines.push('legal move list');
                for (let index = 0; index < list.count; index++) {
                    const row = buildInspectedMoveRecord(pos, list, list.moves[index], index + 1, scoredMoves);
                    rows.push(row);
                    lines.push(formatInspectedMove(row));
                }

                return {
                    ok: true,
                    kind: 'move-inspector',
                    summary: {
                        fen: pos.toFEN(),
                        sideToMove: pos.side === window.ChessCore.COLOR_BLACK ? 'black' : 'white',
                        legalMoves: list.count,
                    },
                    topScores,
                    rows,
                    lines,
                };
            },
            runDivide(fen, depth) {
                const pos = createDiagnosticPosition(fen);
                const results = window.PERFT.divide(pos, depth);
                const lines = [
                    'divide result',
                    'fen: ' + pos.toFEN(),
                    'depth: ' + depth,
                ];

                let total = 0;
                results.forEach(entry => {
                    total += entry.nodes;
                    lines.push(entry.move + ': ' + entry.nodes);
                });
                lines.push('total: ' + total);

                return { ok: true, lines };
            },
            runDivideDiff(fen, depth) {
                const pos = createDiagnosticPosition(fen);
                const results = window.PERFT.divide(pos, depth);
                const reference = getDivideReferenceForFEN(pos.toFEN(), depth);
                const lines = [
                    'divide diff',
                    'fen: ' + pos.toFEN(),
                    'depth: ' + depth,
                ];

                if (!reference) {
                    lines.push('reference: unavailable for this position/depth');
                    lines.push('available divide references: start position depth 2 and 3; Kiwipete depth 4');
                    return { ok: false, lines };
                }

                const actualMap = new Map(results.map(entry => [entry.move, entry.nodes]));
                const referenceMoves = Object.keys(reference).sort();
                const extraMoves = [];
                let mismatchCount = 0;

                lines.push('reference move count: ' + referenceMoves.length);
                lines.push('actual move count: ' + results.length);
                lines.push('');

                referenceMoves.forEach(move => {
                    const expected = reference[move];
                    const actual = actualMap.has(move) ? actualMap.get(move) : null;
                    const ok = actual === expected;
                    if (!ok) mismatchCount++;
                    lines.push((ok ? 'OK   ' : 'DIFF ') + move + '  expected=' + expected + '  actual=' + (actual == null ? '(missing)' : actual));
                    actualMap.delete(move);
                });

                actualMap.forEach((nodes, move) => {
                    extraMoves.push(move + '=' + nodes);
                });

                if (extraMoves.length) {
                    lines.push('');
                    lines.push('extra moves');
                    extraMoves.sort().forEach(item => lines.push(item));
                }

                lines.push('');
                lines.push('summary: ' + (mismatchCount === 0 && extraMoves.length === 0 ? 'reference match' : 'differences found'));
                return { ok: mismatchCount === 0 && extraMoves.length === 0, lines };
            },
            inspectTT(fen) {
                const pos = createDiagnosticPosition(fen);
                const stats = getTTStats();
                const current = window.TT && typeof window.TT.inspect === 'function'
                    ? window.TT.inspect(pos.hash)
                    : null;

                const lines = [
                    'tt inspector',
                    'fen: ' + pos.toFEN(),
                    'hash: ' + formatHash(pos.hash),
                    'hashfull: ' + stats.hashfull + ' / 1000',
                    'entries: ' + stats.size + ' / ' + stats.maxEntries,
                    'generation: ' + stats.generation,
                    '',
                ];

                if (!current) {
                    lines.push('current hash: no TT entry');
                    lines.push('run a local TT warm-up search to populate this position.');
                    return { ok: true, lines };
                }

                lines.push('current hash entry');
                lines.push('move: ' + (current.move ? window.MoveGen.moveToUCI(current.move) : '(none)'));
                lines.push('depth: ' + current.depth);
                lines.push('score: ' + current.score);
                lines.push('bound: ' + formatTTBound(current.bound));
                lines.push('stored generation: ' + current.generation);
                return { ok: true, lines };
            },
            warmTT(fen, depth) {
                const pos = createDiagnosticPosition(fen);
                if (!window.SEARCH || typeof window.SEARCH.go !== 'function') {
                    throw new Error('SEARCH is not available.');
                }
                const result = window.SEARCH.go(pos, { depth: Math.max(1, depth) });
                const info = typeof window.SEARCH.getInfo === 'function' ? window.SEARCH.getInfo() : null;
                const stats = getTTStats();
                return {
                    ok: true,
                    lines: [
                        'tt warm-up complete',
                        'fen: ' + pos.toFEN(),
                        'depth: ' + depth,
                        'best move: ' + (result && result.bestMove ? window.MoveGen.moveToUCI(result.bestMove) : '(none)'),
                        'score: ' + (result && result.bestScore != null ? result.bestScore : '-'),
                        'hashfull: ' + stats.hashfull + ' / 1000',
                        'entries: ' + stats.size + ' / ' + stats.maxEntries,
                        'info: ' + JSON.stringify(info || {}, null, 2),
                    ],
                };
            },
            clearTT() {
                if (!window.TT || typeof window.TT.clear !== 'function') {
                    throw new Error('TT.clear is not available.');
                }
                window.TT.clear();
                const stats = getTTStats();
                return {
                    ok: true,
                    lines: [
                        'tt cleared',
                        'entries: ' + stats.size,
                        'generation: ' + stats.generation,
                        'hashfull: ' + stats.hashfull + ' / 1000',
                    ],
                };
            },
            inspectZobrist(fen) {
                const pos = createDiagnosticPosition(fen);
                if (!window.ZOBRIST || typeof window.ZOBRIST.hashPosition !== 'function') {
                    throw new Error('ZOBRIST is not available.');
                }

                const lines = [
                    'zobrist viewer',
                    'fen: ' + pos.toFEN(),
                    'hash: ' + formatHash(pos.hash),
                    'side key active: ' + (pos.side === window.ChessCore.COLOR_BLACK ? 'yes' : 'no'),
                    'castling: ' + (pos.castling || '-'),
                    'en passant: ' + (pos.enPassant >= 0 ? window.ChessCore.squareToString(pos.enPassant) : '-'),
                    '',
                    'hash components',
                ];

                getZobristComponents(pos).forEach(component => {
                    lines.push(component.label + ': ' + component.value);
                });

                return { ok: true, lines };
            },
            async runSearch(fen, depth) {
                const engine = ensurePlayEngine();
                if (!engine || typeof engine.setPosition !== 'function' || typeof engine.go !== 'function') {
                    throw new Error('Engine is not available.');
                }

                await Promise.resolve(engine.setPosition(fen));
                const result = await engine.go({ depth: Math.max(1, depth) });
                const info = typeof engine.getInfo === 'function' ? engine.getInfo() : result;
                return {
                    ok: Boolean(result && result.bestMove),
                    lines: [
                        'search result',
                        'fen: ' + fen,
                        'depth: ' + depth,
                        'mode: ' + (engine.mode || 'unknown'),
                        'best move: ' + ((result && result.bestMove) || '(none)'),
                        'score: ' + ((result && result.score) != null ? result.score : '-'),
                        'info: ' + JSON.stringify(info || {}, null, 2),
                    ],
                };
            },
            async runSmoke(fen) {
                const scenarios = [
                    { name: 'Direct', options: { preferWorker: false } },
                    { name: 'Worker', options: { preferWorker: true } },
                ];
                const lines = ['running smoke tests', ''];

                for (const scenario of scenarios) {
                    const engine = window.createPlayEngine(scenario.options);
                    try {
                        await Promise.resolve(engine.setPosition(fen));
                        const result = await engine.go({ depth: 1 });
                        lines.push((result && result.bestMove ? 'PASS ' : 'FAIL ') + scenario.name + ' [' + (engine.mode || 'unknown') + ']: ' + ((result && result.bestMove) || '(none)'));
                    } catch (error) {
                        lines.push('FAIL ' + scenario.name + ' [' + (engine.mode || 'unknown') + ']: ' + (error && error.message ? error.message : String(error)));
                    } finally {
                        if (engine && typeof engine.destroy === 'function') {
                            engine.destroy();
                        }
                    }
                }

                return { ok: true, lines };
            },
            runSearchTree(fen, depth) {
                const pos = createDiagnosticPosition(fen);
                if (!window.SEARCH || typeof window.SEARCH.go !== 'function' || typeof window.SEARCH.setDebugHooks !== 'function') {
                    throw new Error('SEARCH debug hooks are not available.');
                }

                const traceLines = [];
                const counts = Object.create(null);
                let maxPly = 0;
                window.SEARCH.setDebugHooks({
                    onEvent(payload) {
                        counts[payload.event] = (counts[payload.event] || 0) + 1;
                        if (typeof payload.ply === 'number') {
                            maxPly = Math.max(maxPly, payload.ply);
                        }
                        if (traceLines.length < 240) {
                            traceLines.push(formatSearchDebugEvent(payload));
                        }
                    },
                });

                try {
                    const result = window.SEARCH.go(pos, { depth: Math.max(1, depth) });
                    const info = typeof window.SEARCH.getInfo === 'function' ? window.SEARCH.getInfo() : null;
                    const lines = [
                        'search tree visualizer',
                        'fen: ' + pos.toFEN(),
                        'depth: ' + depth,
                        'best move: ' + (result && result.bestMove ? window.MoveGen.moveToUCI(result.bestMove) : '(none)'),
                        'score: ' + (result && result.bestScore != null ? result.bestScore : '-'),
                        'max ply observed: ' + maxPly,
                        'events captured: ' + Object.keys(counts).sort().map(key => key + '=' + counts[key]).join(', '),
                        'info: ' + JSON.stringify(info || {}, null, 2),
                        '',
                        'event trace',
                    ];

                    if (!traceLines.length) {
                        lines.push('(no debug events emitted)');
                    } else {
                        traceLines.forEach(line => lines.push(line));
                    }
                    return { ok: true, lines };
                } finally {
                    if (typeof window.SEARCH.clearDebugHooks === 'function') {
                        window.SEARCH.clearDebugHooks();
                    }
                }
            },
            runLoggingConsole(fen, depth) {
                const pos = createDiagnosticPosition(fen);
                if (!window.SEARCH || typeof window.SEARCH.go !== 'function') {
                    throw new Error('SEARCH is not available.');
                }

                const iterationLogs = [];
                const debugLogs = [];
                if (typeof window.SEARCH.setDebugHooks === 'function') {
                    window.SEARCH.setDebugHooks({
                        onEvent(payload) {
                            if (debugLogs.length < 120) {
                                debugLogs.push(formatSearchDebugEvent(payload));
                            }
                        },
                    });
                }

                try {
                    const result = window.SEARCH.go(pos, {
                        depth: Math.max(1, depth),
                        onInfo(info) {
                            if (iterationLogs.length < 32) {
                                iterationLogs.push(formatSearchInfoLine(info));
                            }
                        },
                    });
                    const info = typeof window.SEARCH.getInfo === 'function' ? window.SEARCH.getInfo() : null;
                    const lines = [
                        'logging console',
                        'fen: ' + pos.toFEN(),
                        'depth: ' + depth,
                        'best move: ' + (result && result.bestMove ? window.MoveGen.moveToUCI(result.bestMove) : '(none)'),
                        'final score: ' + (result && result.bestScore != null ? result.bestScore : '-'),
                        '',
                        'iteration logs',
                    ];

                    if (!iterationLogs.length) {
                        lines.push('(engine did not emit iterative info callbacks in this path)');
                    } else {
                        iterationLogs.forEach(line => lines.push(line));
                    }

                    lines.push('');
                    lines.push('debug events');
                    if (!debugLogs.length) {
                        lines.push('(no debug events captured)');
                    } else {
                        debugLogs.forEach(line => lines.push(line));
                    }

                    lines.push('');
                    lines.push('final info');
                    lines.push(JSON.stringify(info || {}, null, 2));
                    return { ok: true, lines };
                } finally {
                    if (window.SEARCH && typeof window.SEARCH.clearDebugHooks === 'function') {
                        window.SEARCH.clearDebugHooks();
                    }
                }
            },
            runBenchmark(fen, depth, iterations) {
                if (typeof performance === 'undefined' || !window.SEARCH || typeof window.SEARCH.go !== 'function' || !window.PERFT || typeof window.PERFT.perft !== 'function') {
                    throw new Error('Benchmark dependencies are not available.');
                }

                const count = Math.max(1, iterations);
                let searchTotalMs = 0;
                let perftTotalMs = 0;
                let lastBestMove = null;
                let lastSearchInfo = null;
                let perftNodes = 0;

                for (let index = 0; index < count; index++) {
                    const searchPos = createDiagnosticPosition(fen);
                    let startedAt = performance.now();
                    const searchResult = window.SEARCH.go(searchPos, { depth: Math.max(1, depth) });
                    searchTotalMs += performance.now() - startedAt;
                    lastBestMove = searchResult && searchResult.bestMove ? window.MoveGen.moveToUCI(searchResult.bestMove) : null;
                    lastSearchInfo = typeof window.SEARCH.getInfo === 'function' ? window.SEARCH.getInfo() : null;

                    const perftPos = createDiagnosticPosition(fen);
                    startedAt = performance.now();
                    perftNodes = window.PERFT.perft(perftPos, Math.max(1, depth), 0);
                    perftTotalMs += performance.now() - startedAt;
                }

                const avgSearchMs = searchTotalMs / count;
                const avgPerftMs = perftTotalMs / count;
                const searchNodes = lastSearchInfo && typeof lastSearchInfo.nodes === 'number' ? lastSearchInfo.nodes : 0;
                const searchNps = avgSearchMs > 0 ? Math.round((searchNodes / avgSearchMs) * 1000) : 0;
                const perftNps = avgPerftMs > 0 ? Math.round((perftNodes / avgPerftMs) * 1000) : 0;

                return {
                    ok: true,
                    lines: [
                        'benchmark',
                        'fen: ' + fen,
                        'depth: ' + depth,
                        'iterations: ' + count,
                        '',
                        'search benchmark',
                        'avg ms: ' + avgSearchMs.toFixed(2),
                        'last best move: ' + (lastBestMove || '(none)'),
                        'last nodes: ' + searchNodes,
                        'estimated nps: ' + searchNps,
                        '',
                        'perft benchmark',
                        'avg ms: ' + avgPerftMs.toFixed(2),
                        'nodes: ' + perftNodes,
                        'estimated nps: ' + perftNps,
                    ],
                };
            },
            runStressTest(fen, depth, iterations) {
                if (!window.SEARCH || typeof window.SEARCH.go !== 'function' || !window.PERFT || typeof window.PERFT.perft !== 'function') {
                    throw new Error('Stress test dependencies are not available.');
                }

                const count = Math.max(1, iterations);
                const failures = [];
                const searchMoves = [];
                let lastPerftNodes = null;

                for (let index = 0; index < count; index++) {
                    try {
                        const searchPos = createDiagnosticPosition(fen);
                        const result = window.SEARCH.go(searchPos, { depth: Math.max(1, depth) });
                        const bestMove = result && result.bestMove ? window.MoveGen.moveToUCI(result.bestMove) : null;
                        if (!bestMove) {
                            failures.push('iteration ' + (index + 1) + ': search returned no best move');
                        } else {
                            searchMoves.push(bestMove);
                        }

                        const hashed = window.ZOBRIST && typeof window.ZOBRIST.hashPosition === 'function'
                            ? window.ZOBRIST.hashPosition(searchPos)
                            : searchPos.hash;
                        if (searchPos.hash !== hashed) {
                            failures.push('iteration ' + (index + 1) + ': search position hash drifted after search');
                        }

                        const perftPos = createDiagnosticPosition(fen);
                        const nodes = window.PERFT.perft(perftPos, Math.max(1, depth), 0);
                        if (lastPerftNodes == null) {
                            lastPerftNodes = nodes;
                        } else if (lastPerftNodes !== nodes) {
                            failures.push('iteration ' + (index + 1) + ': perft changed from ' + lastPerftNodes + ' to ' + nodes);
                        }
                    } catch (error) {
                        failures.push('iteration ' + (index + 1) + ': ' + (error && error.message ? error.message : String(error)));
                    }
                }

                return {
                    ok: failures.length === 0,
                    lines: [
                        'stress test',
                        'fen: ' + fen,
                        'depth: ' + depth,
                        'iterations: ' + count,
                        'unique search best moves: ' + (Array.from(new Set(searchMoves)).join(', ') || '-'),
                        'stable perft nodes: ' + (lastPerftNodes == null ? '-' : lastPerftNodes),
                        '',
                        failures.length ? 'failures' : 'result',
                    ].concat(failures.length ? failures : ['all iterations completed without detected drift.']),
                };
            },
        });
    }

    return toolsView;
}

function createDiagnosticPosition(fen) {
    if (typeof window.Position !== 'function') {
        throw new Error('Position is not available.');
    }
    if (!window.PERFT || typeof window.PERFT.perft !== 'function') {
        throw new Error('PERFT is not available.');
    }

    const validation = typeof window.validateFEN === 'function'
        ? window.validateFEN(fen)
        : { valid: true };
    if (!validation.valid) {
        throw new Error(validation.error || 'Invalid FEN.');
    }

    const pos = new window.Position();
    pos.loadFEN(fen || 'startpos');
    return pos;
}

function getDiagnosticReferencePositions() {
    const startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const kiwipeteFEN = 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1';
    const position3FEN = '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1';
    const perftSuite = window.PERFT && Array.isArray(window.PERFT.SUITE)
        ? window.PERFT.SUITE.map((entry, index) => ({
            id: 'perft-' + String(index + 1),
            name: entry.name,
            fen: entry.fen,
            defaultDepth: entry.expected[3] ? 3 : (entry.expected[2] ? 2 : 1),
            expected: entry.expected || null,
            category: 'Perft Reference',
            divideReferenceDepths: entry.fen === startFEN
                ? [2, 3]
                : (entry.fen === kiwipeteFEN ? [4] : (entry.fen === position3FEN ? [5] : [])),
            divideReference: entry.fen === startFEN ? {
                2: {
                    a2a3: 20, a2a4: 20, b1a3: 20, b1c3: 20, b2b3: 20, b2b4: 20,
                    c2c3: 20, c2c4: 20, d2d3: 20, d2d4: 20, e2e3: 20, e2e4: 20,
                    f2f3: 20, f2f4: 20, g1f3: 20, g1h3: 20, g2g3: 20, g2g4: 20,
                    h2h3: 20, h2h4: 20,
                },
                3: {
                    a2a3: 380, a2a4: 420, b1a3: 400, b1c3: 440, b2b3: 420, b2b4: 421,
                    c2c3: 420, c2c4: 441, d2d3: 539, d2d4: 560, e2e3: 599, e2e4: 600,
                    f2f3: 380, f2f4: 401, g1f3: 440, g1h3: 400, g2g3: 420, g2g4: 421,
                    h2h3: 380, h2h4: 420,
                },
            } : (entry.fen === kiwipeteFEN ? {
                4: {
                    e1g1: 86975, e1c1: 79803, g2h3: 82759, g2g3: 77468, g2g4: 75677,
                    b2b3: 81066, a2a3: 94405, a2a4: 90978, d5e6: 97464, d5d6: 79551,
                    c3a4: 91447, c3b5: 81498, c3d1: 84782, c3b1: 84773, e5c6: 83885,
                    e5d7: 93913, e5f7: 88799, e5g6: 83866, e5g4: 79912, e5d3: 77431,
                    e5c4: 77752, f3g3: 94461, f3h3: 98524, f3e3: 92505, f3d3: 83727,
                    f3f4: 90488, f3f5: 104992, f3f6: 77838, f3g4: 92037, f3h5: 95034,
                    d2e3: 90274, d2f4: 84869, d2g5: 87951, d2h6: 82323, d2c1: 83037,
                    e2d3: 85119, e2c4: 84835, e2b5: 79739, e2a6: 69334, e2f1: 88728,
                    e2d1: 74963, a1b1: 83348, a1c1: 83263, a1d1: 79695, h1g1: 84876,
                    h1f1: 81563, e1f1: 77887, e1d1: 79989,
                },
            } : (entry.fen === position3FEN ? {
                5: {
                    b4f4: 10776, b4b1: 69665, b4b2: 48498, b4b3: 59719, b4a4: 45591,
                    b4c4: 63781, b4d4: 59574, b4e4: 54192, a5a4: 52943, a5a6: 59028,
                    e2e4: 36889, e2e3: 45326, g2g4: 53895, g2g3: 14747,
                },
            } : null)),
            referenceSource: entry.fen === startFEN
                ? 'Start position divide counts match the published Stockfish divide on chessprogramming.org.'
                : (entry.fen === kiwipeteFEN
                    ? 'Kiwipete perft(4) divide counts from H.G. Muller, TalkChess, Thu Mar 26 2015.'
                    : (entry.fen === position3FEN
                        ? 'Position 3 perft(5) divide counts from the published Critter/Gaviota output in the TalkChess thread "Impossible perft question".'
                        : '')),
        }))
        : [];

    return perftSuite.concat([
        {
            id: 'tactic-mate-net',
            name: 'Tactic — Mate Net',
            fen: '6k1/5ppp/8/8/8/5Q2/5PPP/6K1 w - - 0 1',
            defaultDepth: 2,
            category: 'Tactical Preset',
            note: 'Simple forcing position for fast smoke searches.',
        },
        {
            id: 'tactic-knight-fork',
            name: 'Tactic — Knight Fork Pressure',
            fen: 'r3k2r/ppp2ppp/2n5/3Np3/4P3/8/PPP2PPP/R3K2R w KQkq - 0 1',
            defaultDepth: 3,
            category: 'Tactical Preset',
            note: 'Useful for move ordering and tactical root move comparisons.',
        },
        {
            id: 'tactic-endgame-race',
            name: 'Tactic — Endgame Pawn Race',
            fen: '8/2k5/3p4/3P4/2P5/8/5K2/8 w - - 0 1',
            defaultDepth: 4,
            category: 'Tactical Preset',
            note: 'Small material endgame for hash and move generation checks.',
        },
    ]);
}

function buildInspectedMoveRecord(pos, list, move, ordinal, scoredMoves) {
    const core = window.ChessCore;
    const uci = window.MoveGen.moveToUCI(move);
    const from = core.squareToString(core.moveFrom(move));
    const to = core.squareToString(core.moveTo(move));
    const flags = core.moveFlags(move);
    const promo = core.movePromo(move);
    const capture = core.moveCapture(move);
    return {
        index: ordinal,
        uci,
        lan: formatMoveLAN(move),
        san: formatMoveSAN(pos, list, move),
        from,
        to,
        pinned: isAbsolutelyPinned(pos, core.moveFrom(move)),
        check: moveGivesCheck(pos, move),
        flags: String(flags),
        capture: capture || '',
        promo: promo || '',
        score: scoredMoves && scoredMoves.has(uci) ? scoredMoves.get(uci) : null,
    };
}

function formatInspectedMove(record) {
    const parts = [
        String(record.index).padStart(2, ' ') + '.',
        'uci=' + record.uci,
        'lan=' + record.lan,
        'san=' + record.san,
        '[' + record.from + ' -> ' + record.to + ']',
        'pinned=' + (record.pinned ? 'yes' : 'no'),
        'check=' + (record.check ? 'yes' : 'no'),
        'flags=' + record.flags,
    ];
    if (record.capture) parts.push('capture=' + record.capture);
    if (record.promo) parts.push('promo=' + record.promo);
    if (record.score != null) parts.push('score=' + record.score);
    return parts.join(' ');
}

function formatMoveLAN(move) {
    const core = window.ChessCore;
    const flags = core.moveFlags(move);
    if (flags === core.FLAG_KING_CASTLE) return 'O-O';
    if (flags === core.FLAG_QUEEN_CASTLE) return 'O-O-O';

    const piece = core.movePiece(move);
    const prefix = piece === core.PIECE_PAWN ? '' : pieceLetter(piece);
    const separator = core.moveCapture(move) !== core.PIECE_NONE || flags === core.FLAG_EP_CAPTURE ? 'x' : '-';
    const suffix = core.movePromo(move) ? '=' + pieceLetter(core.movePromo(move)) : '';
    return prefix + core.squareToString(core.moveFrom(move)) + separator + core.squareToString(core.moveTo(move)) + suffix;
}

function formatMoveSAN(pos, list, move) {
    const core = window.ChessCore;
    const flags = core.moveFlags(move);
    const piece = core.movePiece(move);
    const capture = core.moveCapture(move) !== core.PIECE_NONE || flags === core.FLAG_EP_CAPTURE;
    let base = '';

    if (flags === core.FLAG_KING_CASTLE) {
        base = 'O-O';
    } else if (flags === core.FLAG_QUEEN_CASTLE) {
        base = 'O-O-O';
    } else if (piece === core.PIECE_PAWN) {
        const from = core.squareToString(core.moveFrom(move));
        const to = core.squareToString(core.moveTo(move));
        base = capture ? from[0] + 'x' + to : to;
    } else {
        base = pieceLetter(piece)
            + getSanDisambiguation(list, move)
            + (capture ? 'x' : '')
            + core.squareToString(core.moveTo(move));
    }

    if (core.movePromo(move)) {
        base += '=' + pieceLetter(core.movePromo(move));
    }

    return base + getSanSuffix(pos, move);
}

function getSanDisambiguation(list, move) {
    const core = window.ChessCore;
    const from = core.moveFrom(move);
    const to = core.moveTo(move);
    const piece = core.movePiece(move);
    const promo = core.movePromo(move);
    const fromFile = from % 8;
    const fromRank = Math.floor(from / 8);
    let sameFile = false;
    let sameRank = false;
    let ambiguous = false;

    for (let index = 0; index < list.count; index++) {
        const other = list.moves[index];
        if (other === move) continue;
        if (core.movePiece(other) !== piece) continue;
        if (core.moveTo(other) !== to) continue;
        if (core.movePromo(other) !== promo) continue;
        ambiguous = true;
        if ((core.moveFrom(other) % 8) === fromFile) sameFile = true;
        if (Math.floor(core.moveFrom(other) / 8) === fromRank) sameRank = true;
    }

    if (!ambiguous) return '';
    if (!sameFile) return core.squareToString(from)[0];
    if (!sameRank) return core.squareToString(from)[1];
    return core.squareToString(from);
}

function getSanSuffix(pos, move) {
    const clone = new window.Position();
    clone.loadFEN(pos.toFEN());
    clone.makeMove(move);
    if (!clone.isInCheck(clone.side)) return '';

    const replyList = new window.MoveList();
    window.MoveGen.generateLegalMoves(clone, replyList);
    return replyList.count === 0 ? '#' : '+';
}

function moveGivesCheck(pos, move) {
    const clone = new window.Position();
    clone.loadFEN(pos.toFEN());
    clone.makeMove(move);
    return clone.isInCheck(clone.side);
}

function isAbsolutelyPinned(pos, square) {
    const core = window.ChessCore;
    const piece = pos.board[square];
    if (!piece) return false;
    if (core.pieceColor(piece) !== pos.side) return false;
    if (piece.toLowerCase() === 'k') return false;

    const clone = new window.Position();
    clone.loadFEN(pos.toFEN());
    clone.board[square] = null;
    clone._rebuildBitboards();
    return clone.isInCheck(pos.side);
}

function pieceLetter(pieceCode) {
    const core = window.ChessCore;
    switch (pieceCode) {
        case core.PIECE_KNIGHT: return 'N';
        case core.PIECE_BISHOP: return 'B';
        case core.PIECE_ROOK: return 'R';
        case core.PIECE_QUEEN: return 'Q';
        case core.PIECE_KING: return 'K';
        default: return '';
    }
}

function getDivideReferenceForFEN(fen, depth) {
    const positions = getDiagnosticReferencePositions();
    const normalizedFen = fen === 'startpos'
        ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        : fen;
    const match = positions.find(entry => entry.fen === normalizedFen && entry.divideReference && entry.divideReference[depth]);
    return match ? match.divideReference[depth] : null;
}

function getTTStats() {
    if (!window.TT) {
        return { size: 0, maxEntries: 0, generation: 0, hashfull: 0 };
    }
    if (typeof window.TT.stats === 'function') {
        return window.TT.stats();
    }
    return {
        size: 0,
        maxEntries: 0,
        generation: 0,
        hashfull: typeof window.TT.hashfull === 'function' ? window.TT.hashfull() : 0,
    };
}

function createDiagnosticsPreview(fen, uciMove) {
    const state = parseFEN(fen);
    const move = findLegalMoveByUCI(state, uciMove);
    if (!move) return null;

    const nextState = applyMoveToState(state, move);
    return {
        sourceFen: serializeFEN(state),
        fen: serializeFEN(nextState),
        currentGameState: nextState,
        moveSquares: [move.from, move.to],
        moveUci: moveToUCI(move),
        moveSAN: move.san || moveToUCI(move),
    };
}

function getRenderedBoardFEN() {
    return diagnosticsPreview ? diagnosticsPreview.fen : currentBoardFEN;
}

function getRenderedGameState() {
    return diagnosticsPreview ? diagnosticsPreview.currentGameState : currentGameState;
}

function getRenderedLastMoveSquares() {
    return diagnosticsPreview ? diagnosticsPreview.moveSquares.slice() : lastMoveSquares.slice();
}

function getRenderedSelectedSquare() {
    return diagnosticsPreview ? null : selectedSquare;
}

function getRenderedLegalTargets() {
    return diagnosticsPreview ? [] : legalTargets.slice();
}

function getRenderedCheckSquare() {
    const state = getRenderedGameState();
    const kingSquare = findKingSquare(state, state.activeColor);
    return kingSquare && isSquareAttacked(state, kingSquare, oppositeColor(state.activeColor))
        ? kingSquare
        : null;
}

function formatTTBound(bound) {
    if (!window.TT) return String(bound);
    if (bound === window.TT.EXACT) return 'EXACT';
    if (bound === window.TT.LOWER) return 'LOWER';
    if (bound === window.TT.UPPER) return 'UPPER';
    return String(bound);
}

function formatSearchInfoLine(info) {
    const safeInfo = info || {};
    const parts = [];
    if (safeInfo.depth != null) parts.push('depth=' + safeInfo.depth);
    if (safeInfo.seldepth != null) parts.push('seldepth=' + safeInfo.seldepth);
    if (safeInfo.score != null) parts.push('score=' + safeInfo.score);
    if (safeInfo.nodes != null) parts.push('nodes=' + safeInfo.nodes);
    if (safeInfo.hashfull != null) parts.push('hashfull=' + safeInfo.hashfull);
    if (safeInfo.time != null) parts.push('time=' + safeInfo.time + 'ms');
    if (safeInfo.bestMove) parts.push('best=' + safeInfo.bestMove);
    if (Array.isArray(safeInfo.pv) && safeInfo.pv.length) parts.push('pv=' + safeInfo.pv.join(' '));
    return parts.join(' | ') || JSON.stringify(safeInfo);
}

function formatSearchDebugEvent(payload) {
    const safePayload = payload || {};
    const keys = Object.keys(safePayload).filter(key => key !== 'event').sort();
    const values = keys.map(key => key + '=' + formatSearchDebugValue(key, safePayload[key]));
    return [safePayload.event || 'event', values.join(' | ')].filter(Boolean).join(' :: ');
}

function formatSearchDebugValue(key, value) {
    if (value == null) return String(value);
    if (key === 'move') {
        return formatDebugMove(value);
    }
    if (typeof value === 'bigint') {
        return '0x' + value.toString(16);
    }
    if (Array.isArray(value)) {
        return value.map(entry => formatSearchDebugValue('', entry)).join(' ');
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}

function formatDebugMove(move) {
    if (!move) return '(none)';
    if (typeof move === 'string') return move;
    if (window.MoveGen && typeof window.MoveGen.moveToUCI === 'function') {
        try {
            return window.MoveGen.moveToUCI(move);
        } catch (error) {
            return String(move);
        }
    }
    return String(move);
}

function formatHash(hash) {
    return '0x' + BigInt.asUintN(64, hash).toString(16).padStart(16, '0');
}

function getZobristComponents(pos) {
    const components = [];
    const core = window.ChessCore;

    for (let square = 0; square < 64; square++) {
        const piece = pos.board[square];
        if (!piece) continue;
        const pieceIndex = core.pieceIndexFromChar(piece);
        if (pieceIndex < 0) continue;
        components.push({
            label: piece + '@' + core.squareToString(square),
            value: formatHash(window.ZOBRIST.pieceKeys[pieceIndex][square]),
        });
    }

    let castlingMask = 0;
    if ((pos.castling || '').includes('K')) castlingMask |= 1;
    if ((pos.castling || '').includes('Q')) castlingMask |= 2;
    if ((pos.castling || '').includes('k')) castlingMask |= 4;
    if ((pos.castling || '').includes('q')) castlingMask |= 8;
    components.push({
        label: 'castling mask ' + castlingMask,
        value: formatHash(window.ZOBRIST.castlingKeys[castlingMask]),
    });

    if (pos.enPassant >= 0) {
        components.push({
            label: 'en passant ' + core.squareToString(pos.enPassant),
            value: formatHash(window.ZOBRIST.enPassantKeys[pos.enPassant % 8]),
        });
    }

    if (pos.side === core.COLOR_BLACK) {
        components.push({
            label: 'side to move',
            value: formatHash(window.ZOBRIST.side()),
        });
    }

    return components;
}

function isExternalEngineCompatibleState(state) {
    const meta = getBoardMeta(state);
    return meta.files.length === 8 && meta.ranks.length === 8 && !usesReserveDrops(state) && getVariantId(state) !== 'capablanca';
}

function syncPlayEnginePosition() {
    ensureGameController();
    const engine = ensurePlayEngine();
    if (!engine || typeof engine.setPosition !== 'function') return Promise.resolve();
    if (!isExternalEngineCompatibleState(getRenderedGameState())) return Promise.resolve();
    try {
        return Promise.resolve(engine.setPosition(getRenderedBoardFEN()));
    } catch (error) {
        return Promise.reject(error);
    }
}

function moveToUCI(move) {
    if (move && move.isDrop) {
        const piece = normalizePocketPieceCode(move.dropPiece || move.piece);
        return piece.toUpperCase() + '@' + move.to;
    }
    return move.from + move.to + (move.promotion ? move.promotion.toLowerCase() : '');
}

function findLegalMoveByUCI(state, uciMove) {
    const needle = String(uciMove || '').trim().toLowerCase();
    return generateAllLegalMoves(state).find(move => moveToUCI(move) === needle) || null;
}

function getPlayStatusElement() {
    return document.getElementById('play-status');
}

function setPlayStatus(message, tone) {
    const view = ensurePlayView();
    if (view && typeof view.renderStatus === 'function') {
        view.renderStatus(message, tone);
        return;
    }

    const statusEl = getPlayStatusElement();
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'play-status' + (tone ? ' ' + tone : '');
}

function cancelEngineTurn() {
    if (engineThinkTimer) {
        clearTimeout(engineThinkTimer);
        engineThinkTimer = null;
    }
    const engine = ensurePlayEngine();
    if (engine && typeof engine.stop === 'function') {
        engine.stop();
    }
    const controller = ensureGameController();
    if (controller) {
        controller.setEngineThinking(false);
    } else {
        engineThinking = false;
    }
}

function isPlayViewActive() {
    const playView = document.getElementById('view-play');
    return Boolean(playView && playView.classList.contains('active'));
}

function updatePlayState() {
    syncLocalClockState();

    if (isPuzzleSessionActive()) {
        const runtime = ensurePuzzleRuntime();
        if (runtime.endsAt && getPuzzleRemainingMs() <= 0 && !runtime.completed) {
            completeTimedPuzzleSession();
            return;
        }
        if (runtime.completed) {
            setPlayStatus(runtime.feedback || (runtime.section === 'daily-puzzle' ? 'Daily puzzle complete.' : 'Puzzle session complete.'), runtime.tone || 'ready');
            return;
        }
        if (runtime.feedback && runtime.tone === 'over') {
            setPlayStatus(runtime.feedback, 'over');
            return;
        }
        setPlayStatus(runtime.feedback || ('Solve the ' + (runtime.modeLabel || 'puzzle') + '.'), 'ready');
        return;
    }

    if (diagnosticsPreview) {
        setPlayStatus('Previewing ' + diagnosticsPreview.moveSAN + ' (' + diagnosticsPreview.moveUci + ') from Move Inspector', 'ready');
        return;
    }

    if (currentMoveIndex !== moveHistory.length - 1) {
        cancelEngineTurn();
        setPlayStatus(currentMoveIndex >= 0 ? 'Reviewing move ' + (currentMoveIndex + 1) : 'Reviewing starting position', 'ready');
        return;
    }

    const clockInfo = getClockInfo();
    if (clockInfo.flaggedColor) {
        cancelEngineTurn();
        setPlayStatus((clockInfo.flaggedColor === 'white' ? 'White' : 'Black') + ' loses on time', 'over');
        return;
    }

    const status = getGameStatus(currentGameState);
    if (status.isOver) {
        cancelEngineTurn();
        setPlayStatus(status.message, 'over');
        return;
    }

    if (isOnlineModeActive()) {
        cancelEngineTurn();
        const online = getOnlineInfo();
        if (online.currentResult && online.currentResult.summary) {
            setPlayStatus(online.currentResult.summary, 'over');
            return;
        }
        if (online.reconnecting) {
            setPlayStatus('Reconnecting to the multiplayer server and restoring your session...', 'thinking');
            return;
        }

        if (online.mode === 'spectating') {
            setPlayStatus('Spectating live game ' + (online.gameId || '') + '.', 'thinking');
            return;
        }

        if (online.mode === 'in-game') {
            if (online.opponentDisconnected) {
                setPlayStatus('Opponent disconnected. Holding the game open for reconnect...', 'thinking');
                return;
            }

            const localColor = String(multiplayerState.localColor || '').toLowerCase();
            if (localColor && currentGameState.activeColor === localColor) {
                setPlayStatus('Your move as ' + localColor, 'ready');
            } else if (localColor) {
                setPlayStatus('Waiting for opponent. You are ' + localColor + '.', 'thinking');
            } else {
                setPlayStatus('Online game in progress.', 'ready');
            }
            return;
        }

        if (online.message) {
            setPlayStatus(online.message, online.mode === 'idle' ? 'ready' : 'thinking');
            return;
        }

        setPlayStatus('Online play is idle.', 'ready');
        return;
    }

    const sideLabel = currentGameState.activeColor === 'white' ? 'White' : 'Black';
    if (engineThinking) {
        setPlayStatus('Engine thinking for ' + sideLabel.toLowerCase() + '...', 'thinking');
        return;
    }

    if (isEngineControlledColor(currentGameState.activeColor)) {
        setPlayStatus('Engine to move as ' + sideLabel.toLowerCase(), 'thinking');
        if (isPlayViewActive()) scheduleEngineTurn();
        return;
    }

    if (isHumanControlledColor(currentGameState.activeColor)) {
        if (currentPlayMode === 'play-human' && shouldUseTimedLocalClock()) {
            setPlayStatus(sideLabel + ' to move • ' + formatTimeControlLabel(activeLocalGameOptions.timeControl) + ' with ' + formatBonusLabel(activeLocalGameOptions.bonusMode, activeLocalGameOptions.bonusSeconds), 'ready');
            return;
        }
        setPlayStatus(sideLabel + ' to move', 'ready');
        return;
    }

    setPlayStatus('No controller assigned for ' + sideLabel.toLowerCase(), 'ready');
}

function scheduleEngineTurn() {
    cancelEngineTurn();

    if (!isPlayViewActive() || !isEngineControlledColor(currentGameState.activeColor)) {
        updatePlayState();
        return;
    }

    const status = getGameStatus(currentGameState);
    if (status.isOver) {
        updatePlayState();
        return;
    }

    const controller = ensureGameController();
    if (controller) {
        controller.setEngineThinking(true);
    } else {
        engineThinking = true;
    }
    const engineColor = currentGameState.activeColor;
    setPlayStatus('Engine thinking for ' + engineColor + '...', 'thinking');
    const scheduledFen = currentBoardFEN;
    const requestId = ++engineRequestId;

    engineThinkTimer = window.setTimeout(() => {
        engineThinkTimer = null;
        if (!isPlayViewActive() || currentBoardFEN !== scheduledFen || currentGameState.activeColor !== engineColor || !isEngineControlledColor(currentGameState.activeColor)) {
            if (controller) controller.setEngineThinking(false);
            else engineThinking = false;
            updatePlayState();
            return;
        }

        const engine = ensurePlayEngine();
        if (engine && typeof engine.go === 'function') {
            Promise.resolve(syncPlayEnginePosition())
                .then(() => engine.go({ depth: PLAY_CONFIG.searchDepth }, info => {
                    const nextInfo = info || (typeof engine.getInfo === 'function' ? engine.getInfo() : null);
                    if (controller) controller.setEngineInfo(nextInfo);
                    else currentEngineInfo = nextInfo;
                    renderPlayView();
                    if (engineThinking && requestId === engineRequestId) {
                        setPlayStatus('Engine thinking for ' + engineColor + '...', 'thinking');
                    }
                }))
                .then(result => {
                    if (requestId !== engineRequestId || !isPlayViewActive() || currentGameState.activeColor !== engineColor || !isEngineControlledColor(currentGameState.activeColor)) {
                        return;
                    }

                    const move = findLegalMoveByUCI(currentGameState, result && result.bestMove);
                    if (controller) {
                        controller.setEngineThinking(false);
                        controller.setEngineInfo(result || (typeof engine.getInfo === 'function' ? engine.getInfo() : null));
                    } else {
                        engineThinking = false;
                        currentEngineInfo = result || (typeof engine.getInfo === 'function' ? engine.getInfo() : null);
                    }

                    if (!move) {
                        updatePlayState();
                        return;
                    }

                    commitGameState(applyMoveToState(currentGameState, move), [move.from, move.to], move);
                })
                .catch(error => {
                    console.error('UI.js: engine.go failed, using fallback move picker.', error);
                    if (requestId !== engineRequestId) return;

                    const fallbackMove = chooseEngineMove(currentGameState, engineColor);
                    if (controller) controller.setEngineThinking(false);
                    else engineThinking = false;
                    if (!fallbackMove) {
                        updatePlayState();
                        return;
                    }
                    commitGameState(applyMoveToState(currentGameState, fallbackMove), [fallbackMove.from, fallbackMove.to], fallbackMove);
                });
            return;
        }

        const move = chooseEngineMove(currentGameState, engineColor);
        if (controller) controller.setEngineThinking(false);
        else engineThinking = false;

        if (!move) {
            updatePlayState();
            return;
        }

        commitGameState(applyMoveToState(currentGameState, move), [move.from, move.to], move);
    }, PLAY_CONFIG.engineDelayMs);
}

function startAnalysisSession() {
    const controller = ensureGameController();
    if (!controller) return;

    if (!isExternalEngineCompatibleState(getRenderedGameState())) {
        resetAnalysisInsights(getRenderedBoardFEN(), 'variant-local');
        analysisInsights.error = 'Engine analysis is currently limited to orthodox 8x8 positions. This variant remains playable on the board, but engine analysis is disabled.';
        controller.stopAnalysis(false);
        renderAnalysisView();
        return;
    }

    const analysisState = controller.startAnalysis();
    const requestId = analysisState.requestId;
    const engine = ensurePlayEngine();
    const analysisFen = getRenderedBoardFEN();

    resetAnalysisInsights(analysisFen, engine && engine.mode ? engine.mode : 'unknown');
    renderAnalysisView();

    if (!engine || typeof engine.go !== 'function') {
        analysisInsights.error = 'Engine is not available for analysis.';
        controller.setAnalysisRunning(false);
        renderAnalysisView();
        return;
    }

    Promise.resolve(engine.setPosition(analysisFen))
        .then(() => engine.go({ depth: Math.max(3, PLAY_CONFIG.searchDepth + 1) }, info => {
            const snapshot = controller.getSnapshot();
            if (!snapshot.analysis.enabled || snapshot.analysis.requestId !== requestId) return;
            const normalized = normalizeAnalysisInfo(info || (typeof engine.getInfo === 'function' ? engine.getInfo() : null));
            appendAnalysisInfo(normalized);
            controller.setEngineInfo(normalized);
            renderAnalysisView();
        }))
        .then(result => {
            const snapshot = controller.getSnapshot();
            if (!snapshot.analysis.enabled || snapshot.analysis.requestId !== requestId) return;
            const normalized = normalizeAnalysisInfo(typeof engine.getInfo === 'function' ? engine.getInfo() : result);
            const lastInfo = analysisInsights.history[analysisInsights.history.length - 1];
            if (!lastInfo || lastInfo.depth !== normalized.depth || lastInfo.bestMove !== normalized.bestMove) {
                appendAnalysisInfo(normalized);
            }
            analysisInsights.rootMoves = computeAnalysisRootMoves(analysisFen, normalized.depth || Math.max(2, PLAY_CONFIG.searchDepth + 1), 4);
            analysisInsights.hint = buildAnalysisMoveInsight(analysisFen, normalized.bestMove, normalized);
            try {
                analysisInsights.threat = computeThreatInsight(analysisFen, Math.max(2, normalized.depth || PLAY_CONFIG.searchDepth));
            } catch (error) {
                analysisInsights.threat = null;
                analysisInsights.error = error && error.message ? error.message : String(error);
            }
            analysisInsights.lastUpdatedAt = Date.now();
            controller.setEngineInfo(normalized);
            controller.setAnalysisRunning(false);
            renderAnalysisView();
        })
        .catch(error => {
            console.error('UI.js: analysis session failed.', error);
            const snapshot = controller.getSnapshot();
            if (snapshot.analysis.requestId === requestId) {
                controller.setAnalysisRunning(false);
            }
            analysisInsights.error = error && error.message ? error.message : String(error);
            renderAnalysisView();
        });
}

function stopAnalysisSession() {
    const controller = ensureGameController();
    const engine = ensurePlayEngine();
    if (engine && typeof engine.stop === 'function') {
        engine.stop();
    }
    if (controller) {
        controller.stopAnalysis();
    }
}

function setAnalysisActionFeedback(message, tone) {
    analysisActionFeedback = {
        message: message || '',
        tone: tone || '',
    };
}

function previewAnalysisMove(fen, uciMove) {
    const preview = createDiagnosticsPreview(fen, uciMove);
    if (!preview) {
        throw new Error('Unable to build a preview for that move.');
    }
    preview.liveSourceFen = currentBoardFEN;
    diagnosticsPreview = preview;
    setAnalysisActionFeedback('Previewing ' + preview.moveSAN + ' (' + preview.moveUci + ') on the analysis board.', 'info');
    paintPosition(currentBoardFEN);
    return {
        ok: true,
        message: 'Previewing ' + preview.moveSAN + ' (' + preview.moveUci + ') on the analysis board.',
    };
}

function clearAnalysisPreview() {
    if (!diagnosticsPreview) {
        return { ok: true, message: 'No preview is active.' };
    }
    diagnosticsPreview = null;
    setAnalysisActionFeedback('Analysis preview cleared.', 'info');
    paintPosition(currentBoardFEN);
    return { ok: true, message: 'Analysis preview cleared.' };
}

function playAnalysisMove(fen, uciMove) {
    const preview = createDiagnosticsPreview(fen, uciMove);
    const controller = ensureGameController();
    const snapshot = controller ? controller.getSnapshot() : null;
    if (!preview || !controller || !snapshot) {
        setAnalysisActionFeedback('Unable to play that move from the current controller state.', 'error');
        renderAnalysisView();
        return { ok: false, message: 'Unable to play that move from the current controller state.' };
    }
    if (snapshot.currentBoardFEN !== preview.sourceFen) {
        const message = 'This move does not belong to the current live position. Threat-mode moves are preview-only unless the live board matches that scenario.';
        setAnalysisActionFeedback(message, 'error');
        renderAnalysisView();
        return { ok: false, message };
    }
    if (snapshot.currentMoveIndex !== snapshot.moveHistory.length - 1) {
        const message = 'Return to the live position before playing a move from analysis.';
        setAnalysisActionFeedback(message, 'error');
        renderAnalysisView();
        return { ok: false, message };
    }

    diagnosticsPreview = null;
    const applied = controller.applyEngineMoveFromUCI(preview.moveUci);
    if (!applied) {
        const message = 'That move is no longer legal in the live position.';
        setAnalysisActionFeedback(message, 'error');
        renderAnalysisView();
        return { ok: false, message };
    }

    const message = 'Played ' + preview.moveSAN + ' (' + preview.moveUci + ') into the live position.';
    setAnalysisActionFeedback(message, 'success');
    paintPosition(currentBoardFEN);
    return { ok: true, message };
}

function clearSelectionState() {
    const controller = ensureGameController();
    if (controller) {
        controller.clearSelection();
        return;
    }

    selectedSquare = null;
    legalTargets = [];
}

function refreshBoardAnnotations() {
    renderPlayView();
    renderAnalysisView();

    const renderedState = getRenderedGameState();
    const renderedSelectedSquare = getRenderedSelectedSquare();
    const renderedLegalTargets = getRenderedLegalTargets();
    const renderedLastMoveSquares = getRenderedLastMoveSquares();
    const checkedKing = findKingSquare(renderedState, renderedState.activeColor);
    if (checkedKing && isSquareAttacked(renderedState, checkedKing, oppositeColor(renderedState.activeColor))) {
        if (board3D) {
            board3D.clearHighlights();
            if (renderedSelectedSquare) board3D.highlightSquare(renderedSelectedSquare, 'select');
            renderedLegalTargets.forEach(squareName => board3D.highlightSquare(squareName, 'legal'));
            renderedLastMoveSquares.forEach(squareName => board3D.highlightSquare(squareName, 'lastmove'));
            board3D.highlightSquare(checkedKing, 'check');
        }
    } else if (board3D) {
        board3D.clearHighlights();
        if (renderedSelectedSquare) board3D.highlightSquare(renderedSelectedSquare, 'select');
        renderedLegalTargets.forEach(squareName => board3D.highlightSquare(squareName, 'legal'));
        renderedLastMoveSquares.forEach(squareName => board3D.highlightSquare(squareName, 'lastmove'));
    }
}

function commitGameState(nextState, moveSquares, moveRecord) {
    const controller = ensureGameController();
    if (controller && moveRecord) {
        controller.commitMove(moveRecord);
        paintPosition(currentBoardFEN);
        return;
    }

    currentGameState = nextState;
    currentBoardFEN = serializeFEN(nextState);
    lastMoveSquares = moveSquares ? moveSquares.slice() : [];
    clearSelectionState();
    paintPosition(currentBoardFEN);
}

function selectSquare(squareName) {
    const controller = ensureGameController();
    if (controller) {
        controller.selectSquare(squareName);
    }
    refreshBoardAnnotations();
}

async function handleBoardSquareClick(squareName) {
    const controller = ensureGameController();
    if (!controller) return;

    const view = ensurePlayView();
    const previousMoveCount = moveHistory.length;
    const previousActiveColor = currentGameState.activeColor;
    await controller.handleSquareClick(squareName, {
        choosePromotion(color) {
            return view && typeof view.choosePromotion === 'function'
                ? view.choosePromotion(color)
                : Promise.resolve(null);
        },
    });

    if (isOnlineModeActive() && multiplayerState.mode === 'in-game' && moveHistory.length > previousMoveCount) {
        const lastMove = moveHistory[moveHistory.length - 1];
        const localColor = String(multiplayerState.localColor || '').toLowerCase();
        if (lastMove && lastMove.uci && (!localColor || lastMove.side === localColor)) {
            const client = ensureMultiplayerClient();
            if (client) {
                const gameStatus = getGameStatus(currentGameState);
                client.sendMove({
                    uci: lastMove.uci,
                    fen: currentBoardFEN,
                    result: gameStatus.isOver ? gameStatus.result : '',
                    resultReason: gameStatus.isOver ? (gameStatus.result === 'draw' ? 'stalemate' : 'checkmate') : '',
                }).catch(error => {
                    console.error('UI.js: failed to send online move.', error);
                    setPlayStatus(error && error.message ? error.message : 'Failed to send move to opponent.', 'over');
                    renderPlayView();
                });
            }
        }
    }

    if (currentPlayMode === 'play-human' && moveHistory.length > previousMoveCount) {
        completeLocalClockTurn(previousActiveColor);
    }

    if (isPuzzleSessionActive() && moveHistory.length > previousMoveCount) {
        processPuzzleMoveResult(moveHistory[moveHistory.length - 1]);
    }

    paintPosition(currentBoardFEN);
}

function bindBoardInteraction() {}

window.getCurrentBoardFEN = function () {
    return currentBoardFEN;
};

function getBoardElements() {
    return {
        board2D: document.getElementById('chessboard'),
        board3DContainer: document.getElementById('board-3d-container'),
        toggle3DButton: document.getElementById('btn-toggle-3d'),
        flipBoardButton: document.getElementById('btn-flip-board'),
        resetViewButton: document.getElementById('btn-reset-view'),
    };
}

function canUse3DForCurrentBoard() {
    if (typeof window.Board3D !== 'function' || !window.THREE) {
        return false;
    }
    const meta = getBoardMeta(getRenderedGameState());
    return meta.files.length === 8 && meta.ranks.length === 8;
}

function ensureBoard3D(options) {
    const settings = options || {};
    const { board3DContainer } = getBoardElements();
    if (!board3DContainer || typeof window.Board3D !== 'function' || !window.THREE) {
        return null;
    }

    if (!board3D && !settings.createIfMissing) {
        return null;
    }

    if (!board3D) {
        try {
            board3D = new window.Board3D(board3DContainer, {
                renderStyle: settings.renderStyle || getCurrent3DRenderStyle(),
                onSquareClick(squareName) {
                    handleBoardSquareClick(squareName).catch(error => {
                        console.error('UI.js: failed to handle 3D square click.', error);
                    });
                },
            });
        } catch (error) {
            console.error('UI.js: failed to initialize 3D board.', error);
            board3D = null;
        }
    }

    if (!board3D) {
        return null;
    }

    if (settings.renderStyle && typeof board3D.setRenderStyle === 'function') {
        board3D.setRenderStyle(settings.renderStyle);
    }

    if (board3D && typeof board3D.refreshTheme === 'function') {
        board3D.refreshTheme();
    }

    return board3D;
}

function syncBoardOrientation() {
    const play = ensurePlayView();
    if (play && typeof play.setBoardFlipped === 'function') {
        play.setBoardFlipped(boardFlipped);
    }

    const threeBoard = board3D || (boardMode === '3d' ? ensureBoard3D({ createIfMissing: true, renderStyle: getCurrent3DRenderStyle() }) : null);
    if (threeBoard && typeof threeBoard.setFlipped === 'function') {
        threeBoard.setFlipped(boardFlipped);
    }
}

function updateDesktopBoardSizing() {
    const wrapper = document.getElementById('board-wrapper');
    const boardArea = document.getElementById('board-area');
    const playMain = document.querySelector('#view-play .play-main');
    const controlsBar = document.getElementById('board-controls-bar');
    const playStatus = document.getElementById('play-status');
    const playControls = document.getElementById('play-controls');
    const playViewRoot = document.getElementById('view-play');
    if (!wrapper || !boardArea) return;

    if (!window.matchMedia || !window.matchMedia('(min-width: 861px)').matches) {
        wrapper.style.removeProperty('width');
        wrapper.style.removeProperty('height');
        return;
    }

    const meta = getBoardMeta(getRenderedGameState());
    const filesCount = Math.max(1, meta.files.length || 8);
    const ranksCount = Math.max(1, meta.ranks.length || 8);
    const aspectRatio = filesCount / ranksCount;
    const sizingBuffer = 16;
    const availableWidth = Math.max(0, boardArea.clientWidth - sizingBuffer);
    const heightCandidates = [];

    if (boardArea.clientHeight > 0) {
        heightCandidates.push(Math.max(0, boardArea.clientHeight - sizingBuffer));
    }

    if (playMain && playMain.clientHeight > 0) {
        const occupiedHeight = [controlsBar, playStatus, playControls].reduce((total, element) => {
            return total + (element ? element.getBoundingClientRect().height : 0);
        }, 0);
        heightCandidates.push(Math.max(0, playMain.clientHeight - occupiedHeight - 40));
    }

    if (playViewRoot && playViewRoot.clientHeight > 0) {
        const occupiedHeight = [controlsBar, playStatus, playControls].reduce((total, element) => {
            return total + (element ? element.getBoundingClientRect().height : 0);
        }, 0);
        heightCandidates.push(Math.max(0, playViewRoot.clientHeight - occupiedHeight - 56));
    }

    const availableHeight = heightCandidates.length
        ? Math.max(0, Math.min.apply(null, heightCandidates.filter(value => value > 0)))
        : 0;
    if (!availableWidth || !availableHeight) return;

    let targetWidth = Math.min(availableWidth, availableHeight * aspectRatio);
    let targetHeight = targetWidth / aspectRatio;

    if (targetHeight > availableHeight) {
        targetHeight = availableHeight;
        targetWidth = targetHeight * aspectRatio;
    }

    wrapper.style.width = Math.floor(targetWidth) + 'px';
    wrapper.style.height = Math.floor(targetHeight) + 'px';
}

function scheduleDesktopBoardSizing() {
    if (boardSizingFrame) {
        window.cancelAnimationFrame(boardSizingFrame);
    }
    boardSizingFrame = window.requestAnimationFrame(() => {
        boardSizingFrame = 0;
        updateDesktopBoardSizing();
    });
}

function ensureBoardResizeObserver() {
    if (boardResizeObserver || typeof window.ResizeObserver !== 'function') {
        return;
    }

    boardResizeObserver = new window.ResizeObserver(() => {
        scheduleDesktopBoardSizing();
    });

    ['view-play', 'board-area', 'board-wrapper', 'play-controls', 'play-sidebar'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            boardResizeObserver.observe(element);
        }
    });

    const playMain = document.querySelector('#view-play .play-main');
    if (playMain) {
        boardResizeObserver.observe(playMain);
    }
}

function syncBoardVisibility() {
    const { board2D, board3DContainer, toggle3DButton, flipBoardButton, resetViewButton } = getBoardElements();
    const canUse3D = canUse3DForCurrentBoard();
    if (!canUse3D && boardMode === '3d') {
        boardMode = '2d';
    }

    let show3D = canUse3D && boardMode === '3d';
    const threeBoard = show3D
        ? ensureBoard3D({ createIfMissing: true, renderStyle: getCurrent3DRenderStyle() })
        : board3D;
    if (show3D && !threeBoard) {
        boardMode = '2d';
        show3D = false;
    }

    scheduleDesktopBoardSizing();

    if (board2D) {
        board2D.style.display = show3D ? 'none' : 'grid';
    }

    if (board3DContainer) {
        board3DContainer.style.display = show3D ? 'block' : 'none';
    }

    if (threeBoard) {
        if (typeof threeBoard.setFlipped === 'function') {
            threeBoard.setFlipped(boardFlipped);
        }
        if (show3D) {
            threeBoard.show();
            threeBoard.renderFEN(currentBoardFEN);
        } else {
            threeBoard.hide();
        }
    }

    if (toggle3DButton) {
        toggle3DButton.classList.toggle('active', show3D);
        toggle3DButton.disabled = !canUse3D;
        toggle3DButton.textContent = show3D ? '⬛ 3D' : '⬜ 2D';
        toggle3DButton.title = canUse3D ? 'Toggle 2D/3D view' : '3D view unavailable';
    }

    if (flipBoardButton) {
        flipBoardButton.disabled = false;
    }

    if (resetViewButton) {
        resetViewButton.disabled = !show3D;
    }
}

function setBoardMode(nextMode) {
    boardMode = nextMode === '3d' ? '3d' : '2d';
    syncBoardVisibility();
}

function initBoardControls() {
    const { toggle3DButton, flipBoardButton, resetViewButton } = getBoardElements();
    const view = ensurePlayView();

    if (view && typeof view.init === 'function') {
        view.init();
    }

    if (!boardResizeBound) {
        boardResizeBound = true;
        window.addEventListener('resize', scheduleDesktopBoardSizing);
    }

    ensureBoardResizeObserver();

    if (toggle3DButton && !toggle3DButton.dataset.bound) {
        toggle3DButton.dataset.bound = 'true';
        toggle3DButton.addEventListener('click', () => {
            if (boardMode === '3d') {
                setBoardMode('2d');
                return;
            }

            if (!canUse3DForCurrentBoard()) {
                setBoardMode('2d');
                return;
            }

            if (!ensureBoard3D({ createIfMissing: true, renderStyle: getCurrent3DRenderStyle() })) {
                setBoardMode('2d');
                return;
            }

            setBoardMode('3d');
        });
    }

    if (flipBoardButton && !flipBoardButton.dataset.bound) {
        flipBoardButton.dataset.bound = 'true';
        flipBoardButton.addEventListener('click', () => {
            boardFlipped = !boardFlipped;
            syncBoardOrientation();
        });
    }

    if (resetViewButton && !resetViewButton.dataset.bound) {
        resetViewButton.dataset.bound = 'true';
        resetViewButton.addEventListener('click', () => {
            const threeBoard = board3D || ensureBoard3D({ createIfMissing: true, renderStyle: getCurrent3DRenderStyle() });
            if (boardMode === '3d' && threeBoard) {
                threeBoard.resetView();
            }
        });
    }

    boardMode = '2d';
    syncBoardVisibility();
    syncBoardOrientation();
}

// ============================
//   BOARD RENDERING — global so fen-loader.js (and future modules) can call them
// ============================

/** Builds the 64 square divs with coordinate labels. Call once per new game. */
function renderBoard() {
    const board = document.getElementById('chessboard');
    if (!board) return;

    const view = ensurePlayView();
    if (view && typeof view.init === 'function') {
        view.init();
        renderPlayView();
        syncBoardVisibility();
        updatePlayState();
        return;
    }
}

/** Places pieces from a FEN string without touching coordinate labels. */
function renderFEN(fen, options) {
    const settings = options || {};
    const controller = ensureGameController();
    if (controller) {
        cancelEngineTurn();
        controller.loadFEN(fen, settings);
        paintPosition(currentBoardFEN);
        return;
    }

    paintPosition(fen);
}

function paintPosition(fen) {
    renderPlayView();
    scheduleDesktopBoardSizing();
    renderAnalysisView();
    renderOpeningsView();
    renderLoadSaveView();
    renderToolsView();

    if (board3D && boardMode === '3d') {
        board3D.renderFEN(getRenderedBoardFEN());
    }

    syncPlayEnginePosition().catch(error => {
        console.error('UI.js: failed to sync engine position.', error);
    });
    refreshBoardAnnotations();
    updatePlayState();

    const controller = ensureGameController();
    if (isAnalysisViewActive() && controller && !diagnosticsPreview) {
        const snapshot = controller.getSnapshot();
        if (snapshot.analysis.enabled && !snapshot.analysis.running) {
            startAnalysisSession();
        }
    }
}

function getRenderedOpeningState(state, openingState) {
    const baseState = state || getRenderedGameState();
    const source = openingState || currentOpeningState || { line: [], sanLine: [], recognized: null, nextMoves: [] };
    return {
        line: copyArraySafe(source.line),
        sanLine: copyArraySafe(source.sanLine),
        recognized: source.recognized ? Object.assign({}, source.recognized) : null,
        nextMoves: copyArraySafe(source.nextMoves).map(move => Object.assign({}, move, {
            display: getOpeningMoveDisplay(baseState, move.uci),
            primary: move.primary ? Object.assign({}, move.primary) : null,
        })),
    };
}

function copyArraySafe(value, limit) {
    if (!Array.isArray(value)) return [];
    if (typeof limit === 'number') return value.slice(0, limit);
    return value.slice();
}

function getOpeningMoveDisplay(state, uciMove) {
    if (!state || !uciMove) return String(uciMove || '');
    const move = findLegalMoveByUCI(state, uciMove);
    if (!move) return String(uciMove || '');

    const nextState = applyMoveToState(state, move);
    if (window.Chess2Notation && typeof window.Chess2Notation.formatMoveRecord === 'function') {
        const notation = window.Chess2Notation.formatMoveRecord(move, state, nextState, {
            getGameStatus,
            moveToUCI,
            generateLegalMovesFrom,
        });
        if (notation && notation.san) return notation.san;
    }

    return moveToUCI(move);
}

function isAnalysisViewActive() {
    const view = document.getElementById('view-analysis');
    return Boolean(view && view.classList.contains('active'));
}

function isOpeningsViewActive() {
    const view = document.getElementById('view-openings');
    return Boolean(view && view.classList.contains('active'));
}

// ============================
//   ELEMENTS
// ============================
const menuButton    = document.getElementById('menu-button');
const settingsButton = document.getElementById('settings-button');
const sideDrawer    = document.getElementById('side-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const isTestHarnessPage = /\/tests\//.test(window.location && window.location.pathname || '') || Boolean(document.getElementById('results'));

if (!menuButton || !sideDrawer) {
    if (!isTestHarnessPage) {
        console.error("UI.js: Critical elements missing — check your HTML.");
    }
} else {

    // ============================
    //   DRAWER
    // ============================
    function openDrawer() {
        sideDrawer.classList.add('open');
        if (drawerOverlay) drawerOverlay.classList.add('visible');
    }

    function closeDrawer() {
        sideDrawer.classList.remove('open');
        if (drawerOverlay) drawerOverlay.classList.remove('visible');
    }

    menuButton.addEventListener('click', function (e) {
        e.stopPropagation();
        sideDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });

    if (settingsButton) {
        settingsButton.addEventListener('click', function (e) {
            e.stopPropagation();
            requestedSettingsSection = 'time-controls';
            showView('settings');
        });
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    // ============================
    //   SUBMENUS
    // ============================
    document.querySelectorAll('#side-drawer li.submenu > span.submenu-label')
        .forEach(label => {
            label.addEventListener('click', function (e) {
                e.stopPropagation();
                this.parentElement.classList.toggle('open');
            });
        });

    // ============================
    //   VIEW SWITCHING
    // ============================
    const views = document.querySelectorAll('.view');

    function showView(viewId) {
        let puzzleLaunch = false;
        if (isPlayablePuzzleSection(viewId)) {
            requestedPuzzleSection = resolvePuzzleSection(viewId);
            const started = startPuzzleSectionSession(requestedPuzzleSection);
            if (!started) {
                viewId = 'puzzle-import';
            } else {
                puzzleLaunch = true;
                viewId = 'play-human';
            }
        }
        if (isPlayModeRoute(viewId)) {
            if (!puzzleLaunch) {
                clearPuzzleSession();
            }
            applyPlayMode(viewId);
        } else if (String(viewId || '') !== 'puzzle-import') {
            clearPuzzleSession();
        }
        const normalizedViewId = normalizeViewId(viewId);
        if (normalizedViewId === 'analysis') {
            requestedAnalysisSection = resolveAnalysisSection(viewId);
        }
        if (normalizedViewId === 'openings') {
            requestedOpeningsSection = resolveOpeningsSection(viewId);
        }
        if (normalizedViewId === 'training') {
            requestedTrainingSection = resolveTrainingSection(viewId);
        }
        if (normalizedViewId === 'puzzles') {
            requestedPuzzleSection = resolvePuzzleSection(viewId);
        }
        if (normalizedViewId === 'variants') {
            requestedVariantSection = resolveVariantSection(viewId);
        }
        if (normalizedViewId !== 'play') {
            cancelEngineTurn();
        }
        if (normalizedViewId !== 'analysis') {
            stopAnalysisSession();
        }
        views.forEach(v => v.classList.remove('active'));
        const target = document.getElementById('view-' + normalizedViewId);
        if (target) target.classList.add('active');

        if (normalizedViewId === 'play') {
            ensureSupportedPlayBoardState();
            initBoardControls();
            renderBoard();
            renderFEN(currentBoardFEN, { preserveHistory: true, skipHistoryReset: true });
        }

        if (normalizedViewId === 'analysis') {
            const analysis = ensureAnalysisView();
            if (analysis && typeof analysis.init === 'function') {
                analysis.init();
            }
            renderAnalysisView();
            const controller = ensureGameController();
            if (controller) {
                const snapshot = controller.getSnapshot();
                if (snapshot.analysis.enabled && !snapshot.analysis.running) {
                    startAnalysisSession();
                } else if (!snapshot.analysis.enabled && requestedAnalysisSection !== 'board') {
                    startAnalysisSession();
                }
            }
        }

        if (normalizedViewId === 'loadsave') {
            const loadsave = ensureLoadSaveView();
            if (loadsave && typeof loadsave.init === 'function') {
                loadsave.init();
            }
            renderLoadSaveView();
        }

        if (normalizedViewId === 'multiplayer') {
            renderMultiplayerView();
        }

        if (normalizedViewId === 'tools') {
            const tools = ensureToolsView();
            if (tools && typeof tools.init === 'function') {
                tools.init();
            }
            if (tools && typeof tools.setActivePanel === 'function') {
                tools.setActivePanel(requestedToolsPanel);
            }
            renderToolsView();
        }

        if (normalizedViewId === 'openings') {
            const openings = ensureOpeningsView();
            if (openings && typeof openings.init === 'function') {
                openings.init();
            }
            renderOpeningsView();
        }

        if (normalizedViewId === 'training') {
            renderTrainingView();
        }

        if (normalizedViewId === 'puzzles') {
            renderPuzzlesView();
        }

        if (normalizedViewId === 'variants') {
            renderVariantsView();
        }

        if (normalizedViewId === 'settings') {
            renderSettingsView();
        }

        if (normalizedViewId === 'about') {
            renderAboutView();
        }

        // Hook: let feature modules react to view changes
        if (normalizedViewId === 'fen-load') {
            // initFenLoader is defined in fen-loader.js — guard in case script not loaded yet
            if (typeof initFenLoader === 'function') initFenLoader();
        }
    }

    window.Chess2ShowView = showView;

    function normalizeViewId(viewId) {
        if (/^(play|play-e2e|play-human|play-online)$/.test(String(viewId || ''))) {
            return 'play';
        }
        if (/^(analysis|eval|pv|search-stats|threat-mode|hint-mode|logs)$/.test(String(viewId || ''))) {
            return 'analysis';
        }
        if (/^(training|tactics|endgame-trainer|guess-move|blindfold|visualization|knight-vision|memory)$/.test(String(viewId || ''))) {
            return 'training';
        }
        if (/^(puzzles|daily-puzzle|puzzle-rush|puzzle-battle|thematic-puzzles|puzzle-import)$/.test(String(viewId || ''))) {
            return 'puzzles';
        }
        if (/^(variants|chess960|king-hill|three-check|horde|atomic|crazyhouse|bughouse|bighouse|capablanca|custom-variants)$/.test(String(viewId || ''))) {
            return 'variants';
        }
        if (isMultiplayerViewRoute(viewId)) {
            return 'multiplayer';
        }
        if (/^(time-controls|increment|handicap|settings)$/.test(String(viewId || ''))) {
            return 'settings';
        }
        if (/^(pgn-import|pgn-export|fen-save|epd|loadsave)$/.test(String(viewId || ''))) {
            return 'loadsave';
        }
        if (/^(perft|move-inspector|zobrist-viewer|tt-inspector|search-tree|logging-console|benchmark|stress-test|tests|tools)$/.test(String(viewId || ''))) {
            return 'tools';
        }
        if (/^(eco|openings|book|stats)$/.test(String(viewId || ''))) {
            return 'openings';
        }
        return viewId;
    }

    function resolveToolsPanel(viewId) {
        switch (String(viewId || '')) {
            case 'move-inspector':
                return 'moves';
            case 'zobrist-viewer':
                return 'zobrist';
            case 'tt-inspector':
                return 'tt';
            case 'search-tree':
                return 'search-tree';
            case 'logging-console':
                return 'logging';
            case 'benchmark':
                return 'benchmark';
            case 'stress-test':
                return 'stress';
            case 'tests':
                return 'tests';
            case 'perft':
            case 'tools':
            default:
                return 'perft';
        }
    }

    function openStandalonePath(path) {
        if (!path || typeof window === 'undefined' || typeof window.open !== 'function') return;
        window.open(path, '_blank', 'noopener');
    }

    document.querySelectorAll('#side-drawer [data-view]').forEach(item => {
        item.addEventListener('click', function () {
            const viewId = this.getAttribute('data-view');
            if (normalizeViewId(viewId) === 'analysis') {
                requestedAnalysisSection = resolveAnalysisSection(viewId);
            }
            if (normalizeViewId(viewId) === 'openings') {
                requestedOpeningsSection = resolveOpeningsSection(viewId);
            }
            if (normalizeViewId(viewId) === 'training') {
                requestedTrainingSection = resolveTrainingSection(viewId);
            }
            if (normalizeViewId(viewId) === 'puzzles') {
                requestedPuzzleSection = resolvePuzzleSection(viewId);
            }
            if (normalizeViewId(viewId) === 'variants') {
                requestedVariantSection = resolveVariantSection(viewId);
            }
            if (isMultiplayerViewRoute(viewId)) {
                requestedMultiplayerSection = resolveMultiplayerSection(viewId);
            }
            if (normalizeViewId(viewId) === 'tools') {
                requestedToolsPanel = resolveToolsPanel(viewId);
            }
            if (normalizeViewId(viewId) === 'settings') {
                requestedSettingsSection = resolveSettingsSection(viewId);
            }
            if (String(viewId || '') === 'matchmaking') {
                requestedMultiplayerAction = 'matchmaking';
            } else {
                requestedMultiplayerAction = null;
            }
            showView(viewId);
            if (String(viewId || '') === 'matchmaking') {
                startGlobalMatchmaking();
            }
            closeDrawer();
        });
    });

    document.querySelectorAll('#side-drawer [data-url]').forEach(item => {
        item.addEventListener('click', function () {
            const path = this.getAttribute('data-url');
            openStandalonePath(path);
            closeDrawer();
        });
    });

    showView('home');

    const protocol = window.Chess2NetworkProtocol;
    const initialGameId = protocol && typeof protocol.extractPrivateGameId === 'function'
        ? protocol.extractPrivateGameId(window.location && window.location.href)
        : '';
    if (initialGameId) {
        requestedMultiplayerAction = 'auto-join';
        multiplayerState.joinInputValue = initialGameId;
        showView('play-online');
        joinPrivateOnlineGame(initialGameId);
    }

    // ============================
    //   PLAY NOW BUTTON
    // ============================
    const startPlaying = document.getElementById('start-playing');
    if (startPlaying) {
        startPlaying.addEventListener('click', function () {
            showView('play');
        });
    }

    // ============================
    //   THEME SWITCHING
    // ============================
    document.querySelectorAll('[data-theme]').forEach(item => {
        item.addEventListener('click', function () {
            applyTheme(this.dataset.theme);
            closeDrawer();
        });
    });

    document.querySelectorAll('[data-piece-set]').forEach(item => {
        item.addEventListener('click', function () {
            applyPieceSet(this.dataset.pieceSet);
            closeDrawer();
        });
    });

    document.querySelectorAll('[data-3d-style]').forEach(item => {
        item.addEventListener('click', function () {
            apply3DRenderStyle(this.getAttribute('data-3d-style'));
            closeDrawer();
        });
    });

    apply3DRenderStyle(getCurrent3DRenderStyle(), { skipRender: true });

    console.log("UI.js: init complete");
}

function renderPlayView() {
    const view = ensurePlayView();
    if (!view || typeof view.render !== 'function') return;

    const statusEl = getPlayStatusElement();
    const previewStatus = diagnosticsPreview
        ? 'Previewing ' + diagnosticsPreview.moveSAN + ' (' + diagnosticsPreview.moveUci + ') from Move Inspector'
        : '';
    const renderedSelectedSquare = getRenderedSelectedSquare();
    const renderedLegalTargets = getRenderedLegalTargets();
    const liveView = currentMoveIndex === moveHistory.length - 1;
    const activeColor = currentGameState.activeColor;
    const turnControl = isEngineControlledColor(activeColor)
        ? 'engine'
        : (isHumanControlledColor(activeColor) ? 'human' : 'unassigned');

    view.render({
        fen: getRenderedBoardFEN(),
        files: currentGameState.files || FILES,
        ranks: currentGameState.ranks || RANKS,
        selectedSquare: renderedSelectedSquare,
        selectedReservePiece: currentGameState && currentGameState.activeColor && ensureGameController() ? ensureGameController().getSnapshot().selectedReservePiece : null,
        legalTargets: renderedLegalTargets,
        lastMoveSquares: getRenderedLastMoveSquares(),
        checkSquare: getRenderedCheckSquare(),
        arrows: getPlayBoardArrows(),
        moveHistory,
        activeMoveIndex: currentMoveIndex,
        openingInfo: getRenderedOpeningState(),
        engineInfo: currentEngineInfo,
        thinkingInfo: {
            mode: currentPlayMode,
            sideToMove: activeColor,
            turnControl,
            thinkingState: engineThinking ? 'thinking' : 'idle',
            liveState: liveView ? 'live' : 'review',
            inputMode: 'click + drag',
            note: 'Click a source and destination square, or drag from source to destination inside the browser board.',
        },
        positionMeta: {
            halfmoveClock: currentGameState.halfmove,
            fullmoveNumber: currentGameState.fullmove,
            selectionState: renderedSelectedSquare ? renderedSelectedSquare : 'idle',
            legalTargetCount: renderedLegalTargets.length,
            activeColor,
            boardLabel: (currentGameState.files || FILES).length + 'x' + (currentGameState.ranks || RANKS).length,
            variantLabel: getVariantDisplayName(currentGameState),
            reserve: usesReserveDrops(currentGameState)
                ? {
                    white: reserveToList(currentGameState.reserve && currentGameState.reserve.white),
                    black: reserveToList(currentGameState.reserve && currentGameState.reserve.black),
                }
                : null,
            selectedReservePiece: ensureGameController() ? ensureGameController().getSnapshot().selectedReservePiece : null,
            fen: getRenderedBoardFEN(),
            puzzle: getPuzzleMeta(),
        },
        clockInfo: getClockInfo(),
        onlineInfo: getOnlineInfo(),
        statusMessage: previewStatus || (statusEl ? statusEl.textContent : ''),
        statusTone: diagnosticsPreview ? 'ready' : (statusEl ? statusEl.className.replace('play-status', '').trim() : ''),
    });
}

function renderOpeningsView() {
    if (!isOpeningsViewActive()) return;
    const view = ensureOpeningsView();
    const controller = ensureGameController();
    if (!view || !controller || typeof view.render !== 'function') return;

    if ((!Array.isArray(window.Chess2EcoEncyclopediaData) || !window.Chess2EcoEncyclopediaData.length)
        && typeof window.Chess2LoadEcoEncyclopedia === 'function') {
        window.Chess2LoadEcoEncyclopedia().catch(error => {
            console.error('UI.js: failed to request ECO encyclopedia load.', error);
        });
    }

    const snapshot = controller.getSnapshot();
    const ecoCatalog = window.Chess2Openings && typeof window.Chess2Openings.getEcoCodeCatalog === 'function'
        ? window.Chess2Openings.getEcoCodeCatalog()
        : [];
    const explorerBookCatalog = window.Chess2Openings && typeof window.Chess2Openings.getExplorerBookCatalog === 'function'
        ? window.Chess2Openings.getExplorerBookCatalog()
        : [];
    view.render(Object.assign({}, snapshot, {
        ecoCatalog,
        explorerBookCatalog,
        openingsSection: requestedOpeningsSection,
        openingsSectionLabel: getOpeningsSectionLabel(requestedOpeningsSection),
        opening: getRenderedOpeningState(snapshot.currentGameState, snapshot.opening),
    }));
}

function renderAnalysisView() {
    const view = ensureAnalysisView();
    if (!view || typeof view.render !== 'function') return;
    const controller = ensureGameController();
    const analysisState = controller ? controller.getSnapshot().analysis : null;

    view.render({
        fen: getRenderedBoardFEN(),
        files: getRenderedGameState().files || FILES,
        ranks: getRenderedGameState().ranks || RANKS,
        selectedSquare: getRenderedSelectedSquare(),
        legalTargets: getRenderedLegalTargets(),
        lastMoveSquares: getAnalysisHighlightSquares(),
        checkSquare: getRenderedCheckSquare(),
        arrows: getAnalysisBoardArrows(),
        moveHistory,
        activeMoveIndex: currentMoveIndex,
        engineInfo: currentEngineInfo,
        analysis: analysisState,
        analysisSection: requestedAnalysisSection,
        analysisSectionLabel: getAnalysisSectionLabel(requestedAnalysisSection),
        analysisInsights,
        analysisActionFeedback,
        analysisPreview: diagnosticsPreview ? {
            sourceFen: diagnosticsPreview.sourceFen,
            previewFen: diagnosticsPreview.fen,
            moveUci: diagnosticsPreview.moveUci,
            moveSAN: diagnosticsPreview.moveSAN,
        } : null,
    });
}

function renderLoadSaveView() {
    const view = ensureLoadSaveView();
    const controller = ensureGameController();
    if (!view || !controller || typeof view.render !== 'function') return;
    view.render(controller.getSnapshot());
}

function renderToolsView() {
    const view = ensureToolsView();
    const controller = ensureGameController();
    if (!view || typeof view.render !== 'function') return;
    view.render({
        snapshot: controller ? controller.getSnapshot() : null,
        moduleStatus: view.getModuleStatus ? view.getModuleStatus() : null,
        preview: diagnosticsPreview ? {
            sourceFen: diagnosticsPreview.sourceFen,
            previewFen: diagnosticsPreview.fen,
            moveUci: diagnosticsPreview.moveUci,
            moveSAN: diagnosticsPreview.moveSAN,
        } : null,
    });
}

function navigateToMove(index) {
    cancelEngineTurn();
    const controller = ensureGameController();
    if (controller) {
        controller.navigateToMove(index);
        paintPosition(currentBoardFEN);
    }
}

function startNewGame() {
    cancelEngineTurn();
    if (isPuzzleSessionActive()) {
        restartPuzzleSession();
        return;
    }
    const controller = ensureGameController();
    if (controller) {
        if (currentPlayMode === 'play-human') {
            activeLocalGameOptions = createAppliedLocalGameOptions(gameOptions);
        } else {
            activeLocalGameOptions = createInactiveLocalGameOptions();
        }
        controller.configure({
            startFEN: getStartFENForMode(currentPlayMode),
        });
        controller.startNewGame();
    }
    resetLocalClockForActiveGame();
    paintPosition(currentBoardFEN);
}

function undoLastMove() {
    cancelEngineTurn();
    const controller = ensureGameController();
    if (controller) {
        controller.undoLastMove();
    }
    paintPosition(currentBoardFEN);
}