(function (global) {
	const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	const ecoEncyclopediaCache = { source: null, book: [] };
	const openingBookCache = { source: null, book: [] };
	const familyBookCache = { source: null, book: new Map() };
	const openingWdlCache = { source: null, map: new Map() };
	const ECO_NAME_OVERRIDES = {
		D72: {
			name: 'Grunfeld Defense',
			familyLabel: 'Grunfeld Defense',
		},
	};
	const ECO_PRIMARY_LINE_LABELS = {
		C60: 'Ruy Lopez',
		D72: 'Grunfeld Defense: Kemeri (Botvinnik)',
	};
	let positionIndexCache = null;
	let positionIndexSource = null;
	let ecoCodeCatalogCache = null;
	let ecoCodeCatalogSource = null;
	let exportedEcoCodeCatalogCache = null;
	let exportedEcoCodeCatalogSource = null;

	function getEcoEncyclopediaSource() {
		return Array.isArray(global.Chess2EcoEncyclopediaData) ? global.Chess2EcoEncyclopediaData : [];
	}

	function getOpeningBookSource() {
		if (Array.isArray(global.Chess2OpeningBookData) && global.Chess2OpeningBookData.length) {
			return global.Chess2OpeningBookData;
		}
		return getEcoEncyclopediaSource();
	}

	function getEcoReferenceTitles() {
		return global.Chess2EcoReferenceTitles && typeof global.Chess2EcoReferenceTitles === 'object'
			? global.Chess2EcoReferenceTitles
			: {};
	}

	function getOpeningWdlSource() {
		return global.Chess2OpeningExplorerWdlData && Array.isArray(global.Chess2OpeningExplorerWdlData.entries)
			? global.Chess2OpeningExplorerWdlData.entries
			: [];
	}

	function getOpeningWdlMap() {
		const source = getOpeningWdlSource();
		if (openingWdlCache.source === source) return openingWdlCache.map;
		openingWdlCache.source = source;
		openingWdlCache.map = new Map();
		for (const entry of source) {
			const key = String(entry && entry.key || '').trim();
			if (!key) continue;
			openingWdlCache.map.set(key, normalizeWdl(entry && entry.wdl));
		}
		return openingWdlCache.map;
	}

	function ensureBookCache(cache, source) {
		if (cache.source === source) return cache.book;
		cache.source = source;
		cache.book = buildOpeningBook(source);
		return cache.book;
	}

	function getEcoEncyclopedia() {
		return ensureBookCache(ecoEncyclopediaCache, getEcoEncyclopediaSource());
	}

	function getOpeningBook() {
		return ensureBookCache(openingBookCache, getOpeningBookSource());
	}

	function getRecognitionBook() {
		return getOpeningBook();
	}

	function getFamilyBook() {
		const recognitionBook = getRecognitionBook();
		if (familyBookCache.source === recognitionBook) return familyBookCache.book;
		familyBookCache.source = recognitionBook;
		familyBookCache.book = buildFamilyBook(recognitionBook);
		return familyBookCache.book;
	}

	function buildOpeningBook(entries) {
		const wdlMap = getOpeningWdlMap();
		return entries.map((entry, index) => {
			const override = ECO_NAME_OVERRIDES[String(entry && entry.eco || '').trim()] || null;
			const name = override && override.name ? override.name : (entry.name || 'Opening');
			const variation = entry.variation || '';
			const label = formatOpeningName({ name, variation });
			const moves = normalizeMoves(entry.moves);
			const key = buildOpeningKey({ eco: entry.eco || '-', moves });
			return {
				id: entry.id || (entry.eco || 'book') + '-' + String(index + 1),
				key,
				eco: entry.eco || '-',
				name,
				variation,
				label,
				aliases: normalizeAliasList(entry.aliases != null ? entry.aliases : entry.alias, name, label),
				family: entry.family || label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
				familyLabel: override && override.familyLabel ? override.familyLabel : (entry.familyLabel || name || 'Opening Family'),
				moves,
				pgnText: normalizePgn(entry.pgn),
				rawPgn: normalizePgn(entry.pgn),
				weight: toWeight(entry.weight),
				moveText: Array.isArray(entry.moves) ? formatMoveLine(entry.moves) : '',
				wdl: wdlMap.get(key) || createEmptyWdl(),
			};
		});
	}

	function buildFamilyBook(entries) {
		const families = new Map();
		for (const entry of entries) {
			if (!families.has(entry.family)) families.set(entry.family, []);
			families.get(entry.family).push(entry);
		}
		families.forEach(group => {
			group.sort((left, right) => right.weight - left.weight || left.moves.length - right.moves.length || left.label.localeCompare(right.label));
		});
		return families;
	}

	function buildEcoCodeCatalog(openingEntries) {
		const entriesByEco = new Map();
		for (const entry of openingEntries) {
			if (!entriesByEco.has(entry.eco)) entriesByEco.set(entry.eco, []);
			entriesByEco.get(entry.eco).push(entry);
		}

		return Array.from(entriesByEco.entries()).map(([eco, exactEntries]) => {
			exactEntries.sort((left, right) => right.weight - left.weight
				|| getEcoPrimaryLinePriority(eco, right) - getEcoPrimaryLinePriority(eco, left)
				|| left.moves.length - right.moves.length
				|| left.label.localeCompare(right.label));
			const exactWeight = exactEntries.reduce((sum, entry) => sum + entry.weight, 0) || 1;
			const primary = exactEntries[0] || null;
			const canonicalTitle = getCanonicalEcoTitle(eco, primary);
			const group = primary ? (primary.familyLabel || primary.name || canonicalTitle) : canonicalTitle;
			const aliases = mergeAliasLists(exactEntries, [canonicalTitle, group]);
			const exactWdl = mergeWdl(exactEntries.map(entry => entry.wdl));
			return {
				eco,
				name: canonicalTitle,
				group,
				aliases,
				referenceTitle: canonicalTitle,
				description: primary ? buildCatalogDescription(primary, exactEntries.length, aliases) : 'No exact encyclopedia lines stored for this code.',
				entryCount: exactEntries.length,
				wdl: exactWdl,
				wdlSummary: formatWdlSummary(exactWdl),
				lines: exactEntries.map(entry => summarizeEntry(entry, exactWeight)),
			};
		}).sort((left, right) => left.eco.localeCompare(right.eco));
	}

	function buildOpeningKey(entry) {
		return String(entry && entry.eco || '-').trim() + '|' + normalizeMoves(entry && entry.moves).join(' ');
	}

	function createEmptyWdl() {
		return {
			white: 0,
			draws: 0,
			black: 0,
			total: 0,
			source: '',
			cp: null,
		};
	}

	function normalizeWdl(value) {
		const safe = value || {};
		const white = Math.max(0, Math.round(Number(safe.white) || 0));
		const draws = Math.max(0, Math.round(Number(safe.draws) || 0));
		const black = Math.max(0, Math.round(Number(safe.black) || 0));
		const total = Math.max(0, Math.round(Number(safe.total) || (white + draws + black)));
		return {
			white,
			draws,
			black,
			total,
			source: String(safe.source || ''),
			cp: safe.cp != null && isFinite(Number(safe.cp)) ? Number(safe.cp) : null,
		};
	}

	function mergeWdl(items) {
		const merged = createEmptyWdl();
		for (const item of Array.isArray(items) ? items : []) {
			const wdl = normalizeWdl(item);
			merged.white += wdl.white;
			merged.draws += wdl.draws;
			merged.black += wdl.black;
			merged.total += wdl.total;
			if (!merged.source && wdl.source) merged.source = wdl.source;
		}
		return merged;
	}

	function formatWdlPercent(part, total) {
		const safeTotal = Number(total) || 0;
		if (!safeTotal) return '0%';
		const value = (Number(part) || 0) * 100 / safeTotal;
		return value >= 10 ? value.toFixed(0) + '%' : value.toFixed(1) + '%';
	}

	function formatWdlSummary(wdl) {
		const safe = normalizeWdl(wdl);
		if (!safe.total) return 'W 0% • D 0% • L 0%';
		return 'W ' + formatWdlPercent(safe.white, safe.total) + ' • D ' + formatWdlPercent(safe.draws, safe.total) + ' • L ' + formatWdlPercent(safe.black, safe.total);
	}

	function getCanonicalEcoTitle(eco, primary) {
		const referenceTitles = getEcoReferenceTitles();
		return referenceTitles[eco] || (primary ? primary.label : eco);
	}

	function normalizeMoves(moves) {
		if (!Array.isArray(moves)) return [];
		return moves.map(move => String(move || '').trim().toLowerCase()).filter(Boolean);
	}

	function normalizePgn(text) {
		return String(text || '').replace(/\s+/g, ' ').trim();
	}

	function normalizeAliasList(value, primaryName, label) {
		const rawAliases = Array.isArray(value)
			? value
			: (typeof value === 'string' && value.trim() ? [value] : []);
		const blocked = new Set([
			String(primaryName || '').trim().toLowerCase(),
			String(label || '').trim().toLowerCase(),
		].filter(Boolean));
		const seen = new Set();
		const aliases = [];
		for (const item of rawAliases) {
			const alias = String(item || '').trim();
			if (!alias) continue;
			const key = alias.toLowerCase();
			if (blocked.has(key) || seen.has(key)) continue;
			seen.add(key);
			aliases.push(alias);
		}
		return aliases;
	}

	function mergeAliasLists(entries, blockedValues) {
		const blocked = new Set((Array.isArray(blockedValues) ? blockedValues : []).map(value => String(value || '').trim().toLowerCase()).filter(Boolean));
		const seen = new Set();
		const aliases = [];
		for (const entry of Array.isArray(entries) ? entries : []) {
			for (const alias of copyArray(entry && entry.aliases)) {
				const value = String(alias || '').trim();
				if (!value) continue;
				const key = value.toLowerCase();
				if (blocked.has(key) || seen.has(key)) continue;
				seen.add(key);
				aliases.push(value);
			}
		}
		return aliases;
	}

	function copyArray(value, limit) {
		if (!Array.isArray(value)) return [];
		if (typeof limit === 'number') return value.slice(0, limit);
		return value.slice();
	}

	function toWeight(value) {
		const numeric = Number(value);
		return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric) : 1;
	}

	function canParsePgnLines() {
		return Boolean(global.parseFEN && global.applyMoveToState && global.generateAllLegalMoves && global.moveToUCI && global.Chess2Notation && typeof global.Chess2Notation.formatMoveRecord === 'function' && typeof global.getGameStatus === 'function');
	}

	function ensureBookEntriesMaterialized(entries) {
		if (!Array.isArray(entries) || !entries.length) return;
		if (!canParsePgnLines()) return;
		for (const entry of entries) {
			if (!Array.isArray(entry.moves) || !entry.moves.length) {
				entry.moves = parsePgnToMoves(entry.rawPgn);
			}
			if (!entry.moveText) entry.moveText = formatMoveLine(entry.moves);
		}
	}

	function parsePgnToMoves(pgnText) {
		const tokens = tokenizePgn(pgnText);
		if (!tokens.length) return [];
		let state = global.parseFEN(START_FEN);
		const moves = [];
		for (const token of tokens) {
			const move = resolveMoveBySAN(state, token);
			if (!move) return [];
			moves.push(global.moveToUCI(move));
			state = global.applyMoveToState(state, move);
		}
		return moves;
	}

	function tokenizePgn(pgnText) {
		return normalizePgn(pgnText)
			.replace(/\{[^}]*\}/g, ' ')
			.replace(/\d+\.(?:\.\.)?/g, ' ')
			.split(/\s+/)
			.map(normalizeSanToken)
			.filter(Boolean)
			.filter(token => token !== '*' && token !== '1-0' && token !== '0-1' && token !== '1/2-1/2');
	}

	function normalizeSanToken(token) {
		return String(token || '')
			.replace(/0-0-0/g, 'O-O-O')
			.replace(/0-0/g, 'O-O')
			.replace(/[!?]+$/g, '')
			.trim();
	}

	function stripSanSuffix(token) {
		return normalizeSanToken(token).replace(/[+#]+$/g, '');
	}

	function resolveMoveBySAN(state, sanToken) {
		const legalMoves = global.generateAllLegalMoves(state);
		const target = stripSanSuffix(sanToken);
		for (const move of legalMoves) {
			const nextState = global.applyMoveToState(state, move);
			const record = global.Chess2Notation.formatMoveRecord(move, state, nextState, {
				getGameStatus: global.getGameStatus,
				moveToUCI: global.moveToUCI,
			});
			if (stripSanSuffix(record && record.san) === target) return move;
		}
		return null;
	}

	function isPrefix(prefix, fullLine) {
		if (prefix.length > fullLine.length) return false;
		for (let index = 0; index < prefix.length; index++) {
			if (prefix[index] !== fullLine[index]) return false;
		}
		return true;
	}

	function formatOpeningName(entry) {
		return entry.variation ? entry.name + ': ' + entry.variation : entry.name;
	}

	function formatMoveLine(moves) {
		return normalizeMoves(moves).join(' ');
	}

	function formatPopularity(weight, totalWeight) {
		if (!totalWeight) return '0%';
		const value = weight * 100 / totalWeight;
		return value.toFixed(value >= 10 ? 0 : 1) + '%';
	}

	function hashGameState(state) {
		const basis = 0xcbf29ce484222325n;
		const prime = 0x100000001b3n;
		const text = [
			Array.isArray(state && state.board) ? state.board.map(piece => piece || '.').join('') : '',
			state && state.activeColor ? state.activeColor : '',
			state && state.castling ? state.castling : '-',
			state && state.enPassant ? state.enPassant : '-',
		].join('|');
		let hash = basis;
		for (let index = 0; index < text.length; index++) {
			hash ^= BigInt(text.charCodeAt(index));
			hash = BigInt.asUintN(64, hash * prime);
		}
		return '0x' + hash.toString(16).padStart(16, '0');
	}

	function resolveMoveByUCI(state, uciMove) {
		if (!global.generateAllLegalMoves || !global.moveToUCI) return null;
		const needle = String(uciMove || '').trim().toLowerCase();
		return global.generateAllLegalMoves(state).find(move => global.moveToUCI(move) === needle) || null;
	}

	function simulateLine(moves) {
		if (!global.parseFEN || !global.applyMoveToState) return null;
		let state = global.parseFEN(START_FEN);
		for (const uciMove of normalizeMoves(moves)) {
			const move = resolveMoveByUCI(state, uciMove);
			if (!move) return null;
			state = global.applyMoveToState(state, move);
		}
		return state;
	}

	function ensurePositionIndex() {
		const recognitionBook = getRecognitionBook();
		if (positionIndexCache && positionIndexSource === recognitionBook) return positionIndexCache;
		ensureBookEntriesMaterialized(recognitionBook);
		const byHash = new Map();
		for (const entry of recognitionBook) {
			if (!Array.isArray(entry.moves) || !entry.moves.length) continue;
			const finalState = simulateLine(entry.moves);
			entry.finalHash = finalState ? hashGameState(finalState) : null;
			if (!entry.finalHash) continue;
			if (!byHash.has(entry.finalHash)) byHash.set(entry.finalHash, []);
			byHash.get(entry.finalHash).push(entry);
		}
		byHash.forEach(group => {
			group.sort((left, right) => right.weight - left.weight || left.moves.length - right.moves.length || left.label.localeCompare(right.label));
		});
		positionIndexSource = recognitionBook;
		positionIndexCache = byHash;
		return positionIndexCache;
	}

	function summarizeEntry(entry, totalWeight) {
		const wdl = normalizeWdl(entry.wdl);
		return {
			id: entry.id,
			key: entry.key || buildOpeningKey(entry),
			eco: entry.eco,
			label: entry.label,
			aliases: copyArray(entry.aliases),
			family: entry.family,
			familyLabel: entry.familyLabel,
			moves: entry.moves.slice(),
			moveText: entry.moveText,
			pgnText: entry.pgnText || '',
			weight: entry.weight,
			popularity: formatPopularity(entry.weight, totalWeight),
			wdl,
			wdlSummary: formatWdlSummary(wdl),
			finalHash: entry.finalHash || null,
		};
	}

	function buildCatalogDescription(primary, count, aliases) {
		const lineLabel = primary && primary.pgnText ? primary.pgnText : (primary && primary.moveText ? primary.moveText : 'No line text stored.');
		const aliasText = Array.isArray(aliases) && aliases.length ? ' Aliases: ' + aliases.join(' • ') + '.' : '';
		return String(count) + ' recorded line' + (count === 1 ? '' : 's') + '. Primary line: ' + lineLabel + '.' + aliasText;
	}

	function getEcoPrimaryLinePriority(eco, entry) {
		const preferredLabel = ECO_PRIMARY_LINE_LABELS[String(eco || '').trim()];
		if (!preferredLabel) return 0;
		return entry && entry.label === preferredLabel ? 1 : 0;
	}

	function ensureEcoCodeCatalog() {
		const encyclopedia = getEcoEncyclopedia();
		if (ecoCodeCatalogCache && ecoCodeCatalogSource === encyclopedia) return ecoCodeCatalogCache;
		ecoCodeCatalogCache = buildEcoCodeCatalog(encyclopedia);
		ecoCodeCatalogSource = encyclopedia;
		return ecoCodeCatalogCache;
	}

	function cloneCatalogLine(line) {
		return Object.assign({}, line, {
			aliases: copyArray(line && line.aliases),
			moves: copyArray(line && line.moves),
		});
	}

	function cloneCatalogEntry(entry) {
		return {
			eco: entry.eco,
			name: entry.name,
			group: entry.group,
			aliases: copyArray(entry.aliases),
			description: entry.description,
			entryCount: entry.entryCount,
			lines: Array.isArray(entry.lines) ? entry.lines.map(cloneCatalogLine) : [],
		};
	}

	function getExportedEcoCodeCatalog() {
		const catalog = ensureEcoCodeCatalog();
		if (exportedEcoCodeCatalogCache && exportedEcoCodeCatalogSource === catalog) return exportedEcoCodeCatalogCache;
		exportedEcoCodeCatalogSource = catalog;
		exportedEcoCodeCatalogCache = catalog.map(cloneCatalogEntry);
		return exportedEcoCodeCatalogCache;
	}

	function getRecognitionScore(entry, line) {
		const entryPrefixesLine = isPrefix(entry.moves, line);
		const linePrefixesEntry = isPrefix(line, entry.moves);
		if (!entryPrefixesLine && !linePrefixesEntry) return -1;
		const matchedPly = Math.min(entry.moves.length, line.length);
		return matchedPly * 100000 + (entryPrefixesLine ? 10000 : 0) + entry.weight;
	}

	function getHashMatches(currentHash) {
		if (!currentHash) return [];
		const index = ensurePositionIndex();
		return copyArray(index.get(currentHash));
	}

	function getRecognizedOpening(line, currentHash) {
		if (!Array.isArray(line) || !line.length) return null;
		const recognitionBook = getRecognitionBook();
		ensureBookEntriesMaterialized(recognitionBook);
		let bestEntry = null;
		let bestScore = -1;
		for (const entry of recognitionBook) {
			if (!Array.isArray(entry.moves) || !entry.moves.length) continue;
			const score = getRecognitionScore(entry, line);
			if (score > bestScore) {
				bestScore = score;
				bestEntry = entry;
			}
		}

		const hashMatches = currentHash ? getHashMatches(currentHash) : [];
		if ((!bestEntry || bestScore < 0) && hashMatches.length) {
			bestEntry = hashMatches[0];
		}
		if (!bestEntry) return null;

		const familyBook = getFamilyBook();
		const familyEntries = copyArray(familyBook.get(bestEntry.family));
		if (!familyEntries.length) familyEntries.push(bestEntry);
		const familyWeight = familyEntries.reduce((sum, entry) => sum + entry.weight, 0);
		const transpositionSource = hashMatches.length > 1
			? hashMatches
			: familyEntries.filter(entry => entry.moveText !== bestEntry.moveText);
		const transpositionWeight = transpositionSource.reduce((sum, entry) => sum + entry.weight, 0) || familyWeight;
		const transpositions = transpositionSource
			.filter(entry => entry.moveText !== bestEntry.moveText)
			.slice(0, 8)
			.map(entry => summarizeEntry(entry, transpositionWeight));

		return {
			id: bestEntry.id,
			key: bestEntry.key || buildOpeningKey(bestEntry),
			eco: bestEntry.eco,
			name: bestEntry.name,
			variation: bestEntry.variation,
			label: bestEntry.label,
			aliases: copyArray(bestEntry.aliases),
			family: bestEntry.family,
			familyLabel: bestEntry.familyLabel,
			moves: bestEntry.moves.slice(),
			moveText: bestEntry.moveText,
			matchedPly: Math.min(line.length, bestEntry.moves.length),
			isExact: line.length === bestEntry.moves.length,
			weight: bestEntry.weight,
			popularity: formatPopularity(bestEntry.weight, familyWeight),
			wdl: normalizeWdl(bestEntry.wdl),
			wdlSummary: formatWdlSummary(bestEntry.wdl),
			familyWeight,
			familySize: familyEntries.length,
			finalHash: bestEntry.finalHash || currentHash || null,
			hashMatched: Boolean(currentHash && hashMatches.some(entry => entry.id === bestEntry.id)),
			transpositions,
		};
	}

	function getExplorerMoves(line) {
		const openingBook = getOpeningBook();
		ensureBookEntriesMaterialized(openingBook);
		const nextMoves = new Map();
		let totalWeight = 0;
		const totalWdlParts = [];
		for (const entry of openingBook) {
			if (!isPrefix(line, entry.moves) || entry.moves.length <= line.length) continue;
			const nextMove = entry.moves[line.length];
			totalWeight += entry.weight;
			totalWdlParts.push(entry.wdl);
			if (!nextMoves.has(nextMove)) {
				nextMoves.set(nextMove, {
					uci: nextMove,
					weight: 0,
					branchCount: 0,
					transitions: [],
					families: new Map(),
					wdl: createEmptyWdl(),
				});
			}
			const item = nextMoves.get(nextMove);
			item.weight += entry.weight;
			item.branchCount += 1;
			item.wdl = mergeWdl([item.wdl, entry.wdl]);
			item.transitions.push({
				key: entry.key || buildOpeningKey(entry),
				eco: entry.eco,
				label: entry.label,
				aliases: copyArray(entry.aliases),
				family: entry.family,
				familyLabel: entry.familyLabel,
				weight: entry.weight,
				wdl: normalizeWdl(entry.wdl),
				wdlSummary: formatWdlSummary(entry.wdl),
				moveText: entry.moveText,
				finalHash: entry.finalHash || null,
			});
			if (!item.families.has(entry.family)) {
				item.families.set(entry.family, { family: entry.family, familyLabel: entry.familyLabel, weight: 0 });
			}
			item.families.get(entry.family).weight += entry.weight;
		}

		return Array.from(nextMoves.values()).map(item => {
			const familyList = Array.from(item.families.values()).sort((left, right) => right.weight - left.weight || left.familyLabel.localeCompare(right.familyLabel));
			const transitions = item.transitions
				.sort((left, right) => right.weight - left.weight || left.label.localeCompare(right.label))
				.slice(0, 6)
				.map(transition => ({
					key: transition.key,
					eco: transition.eco,
					label: transition.label,
					aliases: copyArray(transition.aliases),
					family: transition.family,
					familyLabel: transition.familyLabel,
					weight: transition.weight,
					wdl: normalizeWdl(transition.wdl),
					wdlSummary: transition.wdlSummary,
					moveText: transition.moveText,
					popularity: formatPopularity(transition.weight, item.weight),
					finalHash: transition.finalHash,
				}));
			return {
				uci: item.uci,
				weight: item.weight,
				branchCount: item.branchCount,
				popularity: formatPopularity(item.weight, totalWeight),
				wdl: normalizeWdl(item.wdl),
				wdlSummary: formatWdlSummary(item.wdl),
				primary: transitions[0] || null,
				transitions,
				families: familyList,
				transpositionCount: Math.max(0, transitions.length - 1),
				barPercent: totalWeight ? Math.max(4, Math.round(item.weight * 100 / totalWeight)) : 0,
			};
		}).sort((left, right) => right.weight - left.weight || right.branchCount - left.branchCount || left.uci.localeCompare(right.uci));
	}

	function getOpeningState(payload) {
		const settings = payload || {};
		const line = normalizeMoves(settings.uciLine);
		const sanLine = copyArray(settings.sanLine, line.length);
		const currentState = settings.currentGameState || simulateLine(line);
		const currentHash = currentState ? hashGameState(currentState) : null;
		const encyclopedia = getEcoEncyclopedia();
		const openingBook = getOpeningBook();
		const currentWdl = mergeWdl(getExplorerMoves(line).map(move => move.wdl));
		return {
			line,
			sanLine,
			currentHash,
			recognized: getRecognizedOpening(line, currentHash),
			nextMoves: getExplorerMoves(line),
			currentWdl,
			currentWdlSummary: formatWdlSummary(currentWdl),
			catalogSize: encyclopedia.length,
			explorerBookSize: openingBook.length,
		};
	}

	global.Chess2Openings = {
		getCatalog() {
			const encyclopedia = getEcoEncyclopedia();
			return encyclopedia.map(entry => summarizeEntry(entry, 1));
		},
		getEcoCodeCatalog() {
			return getExportedEcoCodeCatalog();
		},
		getEncyclopediaCatalog() {
			const encyclopedia = getEcoEncyclopedia();
			return encyclopedia.map(entry => summarizeEntry(entry, 1));
		},
		getExplorerBookCatalog() {
			const openingBook = getOpeningBook();
			ensureBookEntriesMaterialized(openingBook);
			return openingBook.map(entry => summarizeEntry(entry, 1));
		},
		hashGameState,
		getOpeningState,
		primeCaches() {
			getExportedEcoCodeCatalog();
		},
	};
})(window);