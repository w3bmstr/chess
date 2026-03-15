import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const workspaceRoot = process.cwd();
const args = process.argv.slice(2);

const options = {
    searchDepth: 0,
    movetime: 40,
    hardLimit: 120,
    output: path.join(workspaceRoot, 'data', 'books', 'opening_explorer_wdl_data.js'),
    preserveExistingWdl: true,
    dryRun: false,
};

for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--search-depth') {
        options.searchDepth = Math.max(0, Math.min(16, Number(args[index + 1]) || 0));
        index += 1;
        continue;
    }
    if (token === '--movetime') {
        options.movetime = Math.max(20, Math.min(2000, Number(args[index + 1]) || 40));
        index += 1;
        continue;
    }
    if (token === '--hard-limit') {
        options.hardLimit = Math.max(options.movetime, Math.min(3000, Number(args[index + 1]) || 120));
        index += 1;
        continue;
    }
    if (token === '--output') {
        options.output = path.resolve(workspaceRoot, args[index + 1] || options.output);
        index += 1;
        continue;
    }
    if (token === '--replace-wdl') {
        options.preserveExistingWdl = false;
        continue;
    }
    if (token === '--dry-run') {
        options.dryRun = true;
        continue;
    }
}

const SCRIPT_PATHS = [
    'engine/core/magic.js',
    'engine/core/bitboards.js',
    'engine/core/position.js',
    'engine/core/movegen.js',
    'engine/core/zobrist.js',
    'engine/search/tt.js',
    'engine/search/ordering.js',
    'engine/search/stack.js',
    'engine/eval/pst.js',
    'engine/eval/pawns.js',
    'engine/eval/mobility.js',
    'engine/eval/king_safety.js',
    'engine/eval/threats.js',
    'engine/eval/nnue.js',
    'engine/eval/eval.js',
    'engine/search/search.js',
];

function loadBrowserGlobalData(filePath, globalProperty) {
    const source = fs.readFileSync(filePath, 'utf8');
    const context = { window: {} };
    context.window = context;
    context.self = context;
    vm.createContext(context);
    vm.runInContext(source, context);
    return context[globalProperty] || context.window[globalProperty];
}

function createEngineContext() {
    const context = {
        console,
        setTimeout,
        clearTimeout,
        Date,
        Math,
        JSON,
        BigInt,
        Uint8Array,
        Uint16Array,
        Uint32Array,
        Int16Array,
        Int32Array,
        Float32Array,
        Float64Array,
        ArrayBuffer,
        DataView,
        performance: { now: () => Date.now() },
    };
    context.window = context;
    context.self = context;
    vm.createContext(context);
    for (const relativePath of SCRIPT_PATHS) {
        const scriptPath = path.join(workspaceRoot, relativePath);
        const source = fs.readFileSync(scriptPath, 'utf8');
        vm.runInContext(source, context, { filename: scriptPath });
    }
    return context;
}

function createPositionFromMoves(engineContext, moves) {
    const pos = new engineContext.Position();
    pos.loadFEN('startpos');
    for (const uciMove of moves) {
        const move = engineContext.MoveGen.uciToMove(pos, uciMove);
        if (!move) {
            throw new Error('Illegal move in line: ' + uciMove + ' (' + moves.join(' ') + ')');
        }
        pos.makeMove(move);
    }
    return pos;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function cpToWdl(whiteCp, total, source) {
    const cp = clamp(Number(whiteCp) || 0, -1200, 1200);
    const decisiveScale = clamp(Math.abs(cp) / 700, 0, 0.88);
    const drawRate = clamp(0.72 - decisiveScale * 0.52, 0.12, 0.72);
    const decisiveRate = 1 - drawRate;
    const whiteDecisiveShare = 1 / (1 + Math.exp(-cp / 120));
    let white = Math.round(total * decisiveRate * whiteDecisiveShare);
    let black = Math.round(total * decisiveRate * (1 - whiteDecisiveShare));
    let draws = total - white - black;
    if (draws < 0) {
        draws = 0;
        const overflow = white + black - total;
        if (overflow > 0) {
            if (white >= black) white -= overflow;
            else black -= overflow;
        }
    }
    return {
        white,
        draws,
        black,
        total,
        source,
        cp,
    };
}

function buildEntryKey(entry) {
    return String(entry.eco || '-') + '|' + (Array.isArray(entry.moves) ? entry.moves.join(' ') : '');
}

function loadExistingWdlMap(filePath) {
    if (!fs.existsSync(filePath)) return new Map();
    const source = loadBrowserGlobalData(filePath, 'Chess2OpeningExplorerWdlData');
    const entries = source && Array.isArray(source.entries) ? source.entries : [];
    const map = new Map();
    for (const entry of entries) {
        const key = String(entry && entry.key || '').trim();
        if (!key || !entry || !entry.wdl) continue;
        map.set(key, entry.wdl);
    }
    return map;
}

function serialize(entries) {
    return [
        '(function (global) {',
        '\tglobal.Chess2OpeningExplorerWdlData = ' + JSON.stringify({ generatedAt: new Date().toISOString(), entries }, null, 4) + ';',
        '})(window);',
        '',
    ].join('\n');
}

function main() {
    const openingBookPath = path.join(workspaceRoot, 'data', 'books', 'opening_explorer_book_data.js');
    const existingWdlPath = path.join(workspaceRoot, 'data', 'books', 'opening_explorer_wdl_data.js');
    const openingBook = loadBrowserGlobalData(openingBookPath, 'Chess2OpeningExplorerBookData');
    const existingWdlMap = loadExistingWdlMap(existingWdlPath);
    if (!Array.isArray(openingBook) || !openingBook.length) {
        throw new Error('Opening explorer book is empty or missing.');
    }

    const engineContext = createEngineContext();
    const sourceLabel = options.preserveExistingWdl
        ? 'engine-static-cp-v3'
        : 'engine-blended-search-depth-' + String(options.searchDepth)
            + '-movetime-' + String(options.movetime)
            + '-cp-to-wdl-v3';
    const entries = [];

    for (let i = 0; i < openingBook.length; i += 1) {
        const opening = openingBook[i];
        const moves = Array.isArray(opening.moves) ? opening.moves.map(move => String(move || '').trim()).filter(Boolean) : [];
        const key = buildEntryKey({ eco: opening.eco, moves });
        const weight = Math.max(1, Math.round(Number(opening.weight) || 1));
        const total = Math.max(720, weight * 18);

        const pos = createPositionFromMoves(engineContext, moves);
        const staticScore = Number(engineContext.EVAL.evaluate(pos)) || 0;
        let searchScore = staticScore;
        if (options.searchDepth > 0) {
            const searchResult = engineContext.SEARCH.go(pos, {
                depth: options.searchDepth,
                movetime: options.movetime,
                hardLimit: options.hardLimit,
            });
            const info = engineContext.SEARCH.getInfo ? engineContext.SEARCH.getInfo() : {};
            const maybeScore = Number(info && info.score != null ? info.score : searchResult && searchResult.bestScore);
            if (Number.isFinite(maybeScore)) searchScore = maybeScore;
        }

        const sideSign = pos.side === engineContext.ChessCore.COLOR_WHITE ? 1 : -1;
        const whiteCp = Math.round((staticScore * 0.65 + searchScore * 0.35) * sideSign);

        const existingWdl = existingWdlMap.get(key);
        const wdl = (options.preserveExistingWdl && existingWdl)
            ? {
                white: Math.max(0, Math.round(Number(existingWdl.white) || 0)),
                draws: Math.max(0, Math.round(Number(existingWdl.draws) || 0)),
                black: Math.max(0, Math.round(Number(existingWdl.black) || 0)),
                total: Math.max(0, Math.round(Number(existingWdl.total) || 0)),
                source: sourceLabel,
                cp: clamp(whiteCp, -1200, 1200),
            }
            : cpToWdl(whiteCp, total, sourceLabel);

        entries.push({
            key,
            eco: String(opening.eco || ''),
            moves,
            wdl,
        });

        if ((i + 1) % 25 === 0 || i + 1 === openingBook.length) {
            console.log('Processed opening eval entries: ' + String(i + 1) + '/' + String(openingBook.length));
        }
    }

    if (!options.dryRun) {
        fs.writeFileSync(options.output, serialize(entries), 'utf8');
    }

    const summary = {
        output: options.output,
        dryRun: options.dryRun,
        searchDepth: options.searchDepth,
        movetime: options.movetime,
        hardLimit: options.hardLimit,
        preserveExistingWdl: options.preserveExistingWdl,
        entries: entries.length,
        source: sourceLabel,
    };
    console.log(JSON.stringify(summary, null, 2));
}

try {
    main();
} catch (error) {
    const detail = error && error.stack ? error.stack : String(error);
    const errorPath = path.join(workspaceRoot, 'tmp', 'wdl-gen-error.log');
    try {
        fs.mkdirSync(path.dirname(errorPath), { recursive: true });
        fs.writeFileSync(errorPath, detail + '\n', 'utf8');
    } catch (_writeError) {
        // Ignore logging failure and still print to stderr.
    }
    console.error(detail);
    process.exit(1);
}
