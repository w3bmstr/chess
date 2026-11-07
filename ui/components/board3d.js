// ============================================================
//  board3d.js — Three.js 3D chess board
//  Supports legacy emoji pieces, Staunton STL meshes, and an
//  optional scene GLB overlay if exported later.
// ============================================================

class Board3D {
    static LEGACY_SYMBOLS = {
        K:'🧑‍🚀', Q:'👩‍🚀', R:'🤖', B:'🧙', N:'🐎', P:'🧑‍✈️',
        k:'🦹',  q:'🧙‍♂️', r:'👾', b:'😈', n:'🐉', p:'👤'
    };

    static RENDER_STYLES = ['legacy', 'staunton', 'staunton-ivory', 'staunton-bronze', 'scene'];

    static STAUNTON_STL_PATHS = {
        p: [
            '/data/assets/3d/staunton/Pawn (Solid Base).stl',
            'data/assets/3d/staunton/Pawn (Solid Base).stl',
            '/Pawn (Solid Base).stl',
            'Pawn (Solid Base).stl',
            '/Staunton Chess Set/Solid Bases/Pawn (Solid Base).stl',
            'Staunton Chess Set/Solid Bases/Pawn (Solid Base).stl'
        ],
        n: [
            '/data/assets/3d/staunton/Knight (Solid Base).stl',
            'data/assets/3d/staunton/Knight (Solid Base).stl',
            '/Knight (Solid Base).stl',
            'Knight (Solid Base).stl',
            '/Knight (Solid Base) .stl',
            'Knight (Solid Base) .stl',
            '/Knight (Solid Base) (1).stl',
            'Knight (Solid Base) (1).stl',
            '/Staunton Chess Set/Solid Bases/Knight (Solid Base).stl',
            'Staunton Chess Set/Solid Bases/Knight (Solid Base).stl'
        ],
        b: [
            '/data/assets/3d/staunton/Bishop (Solid Base).stl',
            'data/assets/3d/staunton/Bishop (Solid Base).stl',
            '/Bishop (Solid Base).stl',
            'Bishop (Solid Base).stl',
            '/Staunton Chess Set/Solid Bases/Bishop (Solid Base).stl',
            'Staunton Chess Set/Solid Bases/Bishop (Solid Base).stl'
        ],
        r: [
            '/data/assets/3d/staunton/Rook (Solid Base).stl',
            'data/assets/3d/staunton/Rook (Solid Base).stl',
            '/Rook (Solid Base).stl',
            'Rook (Solid Base).stl',
            '/Staunton Chess Set/Solid Bases/Rook (Solid Base).stl',
            'Staunton Chess Set/Solid Bases/Rook (Solid Base).stl'
        ],
        q: [
            '/data/assets/3d/staunton/Queen (Solid Base).stl',
            'data/assets/3d/staunton/Queen (Solid Base).stl',
            '/Queen (Solid Base).stl',
            'Queen (Solid Base).stl',
            '/Staunton Chess Set/Solid Bases/Queen (Solid Base).stl',
            'Staunton Chess Set/Solid Bases/Queen (Solid Base).stl'
        ],
        k: [
            '/data/assets/3d/staunton/King (Solid Base).stl',
            'data/assets/3d/staunton/King (Solid Base).stl',
            '/King (Solid Base).stl',
            'King (Solid Base).stl',
            '/Staunton Chess Set/Solid Bases/King (Solid Base).stl',
            'Staunton Chess Set/Solid Bases/King (Solid Base).stl'
        ]
    };

    static STAUNTON_MATERIALS = {
        staunton: {
            white: { color: 0xe7ddc7, accentColor: 0xbca579, roughness: 0.52, metalness: 0.08 },
            black: { color: 0x2f3138, accentColor: 0x1a1d23, roughness: 0.64, metalness: 0.08 }
        },
        'staunton-ivory': {
            white: { color: 0xf2ead7, accentColor: 0xd5c3a1, roughness: 0.42, metalness: 0.18 },
            black: { color: 0x47515d, accentColor: 0x252d36, roughness: 0.5, metalness: 0.2 }
        },
        'staunton-bronze': {
            white: { color: 0xc59a4a, accentColor: 0x8a6434, roughness: 0.33, metalness: 0.68 },
            black: { color: 0x1d1f24, accentColor: 0x050608, roughness: 0.46, metalness: 0.36 }
        }
    };

    static STAUNTON_HEIGHTS = {
        p: 0.78,
        n: 0.9,
        b: 0.98,
        r: 0.88,
        q: 1.08,
        k: 1.16
    };

    static SCENE_GLB_URL = '/data/assets/3d/staunton/Chess Scene.glb';
    static _stauntonGeometryCache = new Map();
    static _stauntonGeometryPromises = new Map();
    static _stauntonMissingPieces = new Set();
    static _stauntonAssetsUnavailable = false;

    constructor(container, options) {
        this.container = container;
        this.onSquareClick = options && typeof options.onSquareClick === 'function' ? options.onSquareClick : null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.active = false;
        this.renderStyle = Board3D.normalizeRenderStyle(options && options.renderStyle);
        this.lastFEN = '';

        this.squareMeshes = [];
        this.pieceMeshes = [];
        this.highlights = [];
        this.boardVisuals = [];
        this.sceneRoot = null;
        this.sceneLoadPromise = null;
        this.sceneLoadFailed = false;

        this.drag = false;
        this.prev = { x: 0, y: 0 };
        this.dragMoved = false;
        this.touchOrbitActive = false;
        this.orbit = { theta: Math.PI * 0.25, phi: Math.PI * 0.33 };
        this.flipped = false;
        this.camR = 13;
        this.raycaster = null;
        this.pointer = null;

        this._init();
    }

    static normalizeRenderStyle(style) {
        const aliases = {
            'stl-classic': 'staunton',
            'stl-ivory': 'staunton-ivory',
            'stl-bronze': 'staunton-bronze'
        };
        const raw = String(style || '').trim().toLowerCase();
        const normalized = aliases[raw] || raw;
        return Board3D.RENDER_STYLES.includes(normalized) ? normalized : 'legacy';
    }

    static nextRenderStyle(style) {
        const normalized = Board3D.normalizeRenderStyle(style);
        const index = Board3D.RENDER_STYLES.indexOf(normalized);
        return Board3D.RENDER_STYLES[(index + 1) % Board3D.RENDER_STYLES.length];
    }

    static isStauntonStyle(style) {
        const normalized = Board3D.normalizeRenderStyle(style);
        return normalized === 'staunton' || normalized === 'staunton-ivory' || normalized === 'staunton-bronze';
    }

    static getStauntonPalette(style) {
        const normalized = Board3D.normalizeRenderStyle(style);
        return Board3D.STAUNTON_MATERIALS[normalized] || Board3D.STAUNTON_MATERIALS.staunton;
    }

    _init() {
        const THREE = window.THREE;
        const width = this.container.clientWidth || 600;
        const height = this.container.clientHeight || 600;
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.scene = new THREE.Scene();
        this._updateSceneBg();

        this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
        this._applyOrbit();

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 0.48);
        this.scene.add(ambient);

        const sun = new THREE.DirectionalLight(0xffffff, 0.95);
        sun.position.set(6, 14, 8);
        sun.castShadow = true;
        sun.shadow.camera.left = -8;
        sun.shadow.camera.right = 8;
        sun.shadow.camera.top = 8;
        sun.shadow.camera.bottom = -8;
        sun.shadow.mapSize.set(2048, 2048);
        this.scene.add(sun);

        const fill = new THREE.DirectionalLight(0x8899cc, 0.35);
        fill.position.set(-6, 8, -8);
        this.scene.add(fill);

        this._buildBoard();
        this._bindEvents();
        this._syncSceneMode();
        this._startLoop();
    }

    _trackBoardVisual(object3d) {
        this.boardVisuals.push(object3d);
        return object3d;
    }

    _buildBoard() {
        const THREE = window.THREE;
        const css = getComputedStyle(document.body);

        const lightHex = css.getPropertyValue('--sq-light').trim() || '#f0d9b5';
        const darkHex = css.getPropertyValue('--sq-dark').trim() || '#b58863';
        const frameHex = css.getPropertyValue('--board-frame').trim() || '#3a2f1b';

        const lightCol = new THREE.Color(lightHex);
        const darkCol = new THREE.Color(darkHex);
        const frameCol = new THREE.Color(frameHex);

        this.frameMesh = this._trackBoardVisual(new THREE.Mesh(
            new THREE.BoxGeometry(9.2, 0.32, 9.2),
            new THREE.MeshLambertMaterial({ color: frameCol })
        ));
        this.frameMesh.position.y = -0.22;
        this.frameMesh.receiveShadow = true;
        this.scene.add(this.frameMesh);

        this.plinthMesh = this._trackBoardVisual(new THREE.Mesh(
            new THREE.BoxGeometry(9.6, 0.1, 9.6),
            new THREE.MeshLambertMaterial({ color: frameCol.clone().multiplyScalar(0.7) })
        ));
        this.plinthMesh.position.y = -0.4;
        this.plinthMesh.receiveShadow = true;
        this.scene.add(this.plinthMesh);

        const sqGeo = new THREE.BoxGeometry(1, 0.18, 1);
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const isLight = (rank + file) % 2 === 0;
                const square = this._trackBoardVisual(new THREE.Mesh(
                    sqGeo,
                    new THREE.MeshLambertMaterial({ color: isLight ? lightCol.clone() : darkCol.clone() })
                ));
                square.position.set(file - 3.5, 0, rank - 3.5);
                square.receiveShadow = true;
                square.userData = {
                    rank,
                    file,
                    sqName: 'abcdefgh'[file] + '87654321'[rank],
                    isLight
                };
                this.scene.add(square);
                this.squareMeshes[rank * 8 + file] = square;
            }
        }

        this._buildCoordLabels();
    }

    _buildCoordLabels() {
        const THREE = window.THREE;
        const files = 'abcdefgh';
        const ranks = '87654321';
        const textCol = getComputedStyle(document.body).getPropertyValue('--sq-light').trim() || '#f0d9b5';

        const makeLabel = (text, x, z) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 64, 64);
            ctx.font = 'bold 38px sans-serif';
            ctx.fillStyle = textCol;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 32, 32);
            const mesh = this._trackBoardVisual(new THREE.Mesh(
                new THREE.PlaneGeometry(0.45, 0.45),
                new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false })
            ));
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.set(x, 0.1, z);
            this.scene.add(mesh);
        };

        for (let i = 0; i < 8; i++) {
            makeLabel(files[i], i - 3.5, 4.2);
            makeLabel(ranks[i], -4.2, i - 3.5);
        }
    }

    renderFEN(fen) {
        this.lastFEN = String(fen || '');
        this._clearPieces();
        this._syncSceneMode();

        if (Board3D.isStauntonStyle(this.renderStyle) && !Board3D._stauntonAssetsUnavailable) {
            this._ensureStauntonAssets().then(() => {
                if (this.lastFEN === String(fen || '')) this.renderFEN(this.lastFEN);
            }).catch(error => {
                console.warn('Board3D: failed to load Staunton STL assets.', error);
            });
        }

        if (this.renderStyle === 'scene') {
            this._ensureSceneAsset().catch(error => {
                console.warn('Board3D: scene GLB unavailable, using generated board.', error);
            });
        }

        const rows = this.lastFEN.split(' ')[0].split('/');
        for (let rank = 0; rank < 8; rank++) {
            let file = 0;
            for (const ch of rows[rank]) {
                if (isNaN(ch)) {
                    if (this.renderStyle === 'legacy') {
                        this._spawnLegacyPiece(ch, file, rank);
                    } else {
                        this._spawnStauntonPiece(ch, file, rank);
                    }
                    file += 1;
                } else {
                    file += parseInt(ch, 10);
                }
            }
        }
    }

    setRenderStyle(style) {
        const normalized = Board3D.normalizeRenderStyle(style);
        if (this.renderStyle === normalized) return;
        this.renderStyle = normalized;
        this._syncSceneMode();
        if (this.lastFEN) this.renderFEN(this.lastFEN);
    }

    _clearPieces() {
        this.pieceMeshes.forEach(mesh => {
            if (mesh && mesh.parent) mesh.parent.remove(mesh);
        });
        this.pieceMeshes = [];
    }

    _spawnLegacyPiece(fenChar, file, rank) {
        const THREE = window.THREE;
        const symbol = Board3D.LEGACY_SYMBOLS[fenChar];
        if (!symbol) return;

        const isWhite = fenChar === fenChar.toUpperCase();
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = isWhite ? 'rgba(255,240,200,0.55)' : 'rgba(80,40,180,0.45)';
        ctx.fill();
        ctx.font = `${size * 0.62}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, size / 2, size / 2 + 8);

        const group = new THREE.Group();
        group.position.set(file - 3.5, 0.12, rank - 3.5);

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(0.82, 0.82),
            new THREE.MeshBasicMaterial({
                map: new THREE.CanvasTexture(canvas),
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide
            })
        );
        plane.rotation.x = -Math.PI / 2;
        group.add(plane);
        this.scene.add(group);
        this.pieceMeshes.push(group);
    }

    _spawnStauntonPiece(fenChar, file, rank) {
        const THREE = window.THREE;
        const pieceType = String(fenChar || '').toLowerCase();
        const geometry = Board3D._stauntonGeometryCache.get(pieceType);
        if (!(geometry instanceof THREE.BufferGeometry)) {
            this._spawnFallbackStauntonPiece(fenChar, file, rank);
            return;
        }

        const isWhite = fenChar === fenChar.toUpperCase();
        const palette = Board3D.getStauntonPalette(this.renderStyle);
        const sidePalette = isWhite ? palette.white : palette.black;
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
            color: sidePalette.color,
            roughness: sidePalette.roughness,
            metalness: sidePalette.metalness
        }));
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(file - 3.5, 0.09, rank - 3.5);
        if (pieceType === 'n') {
            mesh.rotation.y = fenChar === 'N' ? Math.PI : 0;
        }
        this.scene.add(mesh);
        this.pieceMeshes.push(mesh);
    }

    _spawnFallbackStauntonPiece(fenChar, file, rank) {
        const THREE = window.THREE;
        const isWhite = fenChar === fenChar.toUpperCase();
        const pieceType = String(fenChar || '').toLowerCase();
        const palette = Board3D.getStauntonPalette(this.renderStyle);
        const sidePalette = isWhite ? palette.white : palette.black;
        const bodyMat = new THREE.MeshStandardMaterial({
            color: sidePalette.color,
            roughness: Math.min(0.95, sidePalette.roughness + 0.04),
            metalness: sidePalette.metalness
        });
        const accentMat = new THREE.MeshStandardMaterial({
            color: sidePalette.accentColor,
            roughness: Math.min(0.95, sidePalette.roughness + 0.14),
            metalness: Math.max(0, sidePalette.metalness - 0.04)
        });

        const root = new THREE.Group();
        root.position.set(file - 3.5, 0.08, rank - 3.5);
        const addPart = (geometry, material, y) => {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = y;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            root.add(mesh);
            return mesh;
        };

        addPart(new THREE.CylinderGeometry(0.31, 0.36, 0.14, 24), accentMat, 0.07);
        addPart(new THREE.CylinderGeometry(0.24, 0.29, 0.1, 24), bodyMat, 0.17);

        if (pieceType === 'p') {
            addPart(new THREE.CylinderGeometry(0.14, 0.18, 0.38, 20), bodyMat, 0.4);
            addPart(new THREE.SphereGeometry(0.115, 20, 16), accentMat, 0.64);
        } else if (pieceType === 'n') {
            addPart(new THREE.CylinderGeometry(0.15, 0.21, 0.32, 20), bodyMat, 0.36);
            const head = addPart(new THREE.BoxGeometry(0.22, 0.34, 0.12), bodyMat, 0.62);
            head.rotation.z = -0.22;
            addPart(new THREE.ConeGeometry(0.06, 0.15, 12), accentMat, 0.83);
        } else if (pieceType === 'b') {
            addPart(new THREE.CylinderGeometry(0.14, 0.2, 0.44, 22), bodyMat, 0.42);
            addPart(new THREE.SphereGeometry(0.12, 20, 16), bodyMat, 0.7);
            const mitre = addPart(new THREE.BoxGeometry(0.03, 0.18, 0.2), accentMat, 0.74);
            mitre.rotation.z = 0.42;
        } else if (pieceType === 'r') {
            addPart(new THREE.CylinderGeometry(0.15, 0.2, 0.46, 20), bodyMat, 0.43);
            addPart(new THREE.CylinderGeometry(0.21, 0.21, 0.12, 24), accentMat, 0.72);
            for (let i = 0; i < 4; i++) {
                const crenel = addPart(new THREE.BoxGeometry(0.08, 0.08, 0.08), bodyMat, 0.8);
                const angle = i * (Math.PI / 2);
                crenel.position.x = Math.cos(angle) * 0.14;
                crenel.position.z = Math.sin(angle) * 0.14;
            }
        } else if (pieceType === 'q') {
            addPart(new THREE.CylinderGeometry(0.14, 0.2, 0.52, 22), bodyMat, 0.46);
            addPart(new THREE.TorusGeometry(0.11, 0.03, 12, 24), accentMat, 0.72);
            addPart(new THREE.SphereGeometry(0.12, 20, 16), bodyMat, 0.84);
        } else if (pieceType === 'k') {
            addPart(new THREE.CylinderGeometry(0.14, 0.2, 0.56, 22), bodyMat, 0.48);
            addPart(new THREE.SphereGeometry(0.1, 20, 16), accentMat, 0.82);
            addPart(new THREE.BoxGeometry(0.05, 0.2, 0.05), bodyMat, 1.02);
            addPart(new THREE.BoxGeometry(0.16, 0.05, 0.05), bodyMat, 0.97);
        } else {
            // For non-standard piece codes, keep a simple solid 3D marker instead of 2D sprites.
            addPart(new THREE.CylinderGeometry(0.15, 0.22, 0.5, 20), bodyMat, 0.46);
            addPart(new THREE.SphereGeometry(0.1, 18, 14), accentMat, 0.8);
        }

        this.scene.add(root);
        this.pieceMeshes.push(root);
    }

    async _ensureStauntonAssets() {
        if (Board3D._stauntonAssetsUnavailable) {
            return;
        }
        const entries = Object.entries(Board3D.STAUNTON_STL_PATHS);
        await Promise.all(entries.map(([pieceType, pathCandidates]) => {
            if (Board3D._stauntonGeometryCache.has(pieceType)) return Promise.resolve(Board3D._stauntonGeometryCache.get(pieceType));
            if (Board3D._stauntonMissingPieces.has(pieceType)) return Promise.resolve(null);
            if (Board3D._stauntonGeometryPromises.has(pieceType)) return Board3D._stauntonGeometryPromises.get(pieceType);

            const promise = this._loadStauntonGeometry(pieceType, pathCandidates)
                .then(geometry => {
                    Board3D._stauntonGeometryCache.set(pieceType, geometry);
                    Board3D._stauntonGeometryPromises.delete(pieceType);
                    return geometry;
                })
                .catch(error => {
                    Board3D._stauntonGeometryPromises.delete(pieceType);
                    Board3D._stauntonMissingPieces.add(pieceType);
                    console.warn(`Board3D: STL missing for piece '${pieceType}', using procedural fallback for that piece.`, error);
                    return null;
                });
            Board3D._stauntonGeometryPromises.set(pieceType, promise);
            return promise;
        }));

        if (!Board3D._stauntonGeometryCache.size) {
            Board3D._stauntonAssetsUnavailable = true;
            throw new Error('No Staunton STL assets were loaded.');
        }
    }

    async _loadStauntonGeometry(pieceType, paths) {
        const candidates = Array.isArray(paths) ? paths : [paths];
        let lastError = null;

        for (const path of candidates) {
            try {
                const response = await fetch(encodeURI(path));
                if (!response.ok) throw new Error(`Failed to load STL: ${path}`);
                const buffer = await response.arrayBuffer();
                const geometry = Board3D.parseStlGeometry(buffer);
                return Board3D.normalizeStauntonGeometry(geometry, pieceType, window.THREE);
            } catch (error) {
                lastError = error;
            }
        }

        const reason = lastError && lastError.message ? ` (${lastError.message})` : '';
        throw new Error(`Failed to load STL for piece '${pieceType}'. Tried: ${candidates.join(', ')}${reason}`);
    }

    static parseStlGeometry(arrayBuffer) {
        return Board3D.isBinaryStl(arrayBuffer)
            ? Board3D.parseBinaryStl(arrayBuffer)
            : Board3D.parseAsciiStl(arrayBuffer);
    }

    static isBinaryStl(arrayBuffer) {
        if (arrayBuffer.byteLength < 84) return false;
        const view = new DataView(arrayBuffer);
        const faces = view.getUint32(80, true);
        return 84 + faces * 50 === arrayBuffer.byteLength;
    }

    static parseBinaryStl(arrayBuffer) {
        const THREE = window.THREE;
        const view = new DataView(arrayBuffer);
        const faces = view.getUint32(80, true);
        const positions = new Float32Array(faces * 9);
        const normals = new Float32Array(faces * 9);
        let offset = 84;
        let cursor = 0;
        for (let face = 0; face < faces; face++) {
            const nx = view.getFloat32(offset, true);
            const ny = view.getFloat32(offset + 4, true);
            const nz = view.getFloat32(offset + 8, true);
            offset += 12;
            for (let vertex = 0; vertex < 3; vertex++) {
                positions[cursor] = view.getFloat32(offset, true);
                positions[cursor + 1] = view.getFloat32(offset + 4, true);
                positions[cursor + 2] = view.getFloat32(offset + 8, true);
                normals[cursor] = nx;
                normals[cursor + 1] = ny;
                normals[cursor + 2] = nz;
                offset += 12;
                cursor += 3;
            }
            offset += 2;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        return geometry;
    }

    static parseAsciiStl(arrayBuffer) {
        const THREE = window.THREE;
        const text = new TextDecoder().decode(arrayBuffer);
        const positions = [];
        const normals = [];
        const facetRegex = /facet\s+normal\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)[\s\S]*?outer\s+loop([\s\S]*?)endloop/gi;
        let facet = null;
        while ((facet = facetRegex.exec(text))) {
            const nx = parseFloat(facet[1]);
            const ny = parseFloat(facet[2]);
            const nz = parseFloat(facet[3]);
            const block = facet[4];
            const vertexRegex = /vertex\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)/gi;
            let vertex = null;
            while ((vertex = vertexRegex.exec(block))) {
                positions.push(parseFloat(vertex[1]), parseFloat(vertex[2]), parseFloat(vertex[3]));
                normals.push(nx, ny, nz);
            }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        return geometry;
    }

    static normalizeStauntonGeometry(sourceGeometry, pieceType, THREE) {
        const geometry = sourceGeometry.clone();
        geometry.computeBoundingBox();
        const bounds = geometry.boundingBox;
        if (!bounds) return geometry;

        const initialSize = new THREE.Vector3();
        bounds.getSize(initialSize);
        if (initialSize.z > initialSize.y * 1.1) {
            geometry.rotateX(-Math.PI / 2);
            geometry.computeBoundingBox();
        } else if (initialSize.x > initialSize.y * 1.2 && initialSize.x > initialSize.z) {
            geometry.rotateZ(Math.PI / 2);
            geometry.computeBoundingBox();
        }

        const box = geometry.boundingBox;
        const center = new THREE.Vector3();
        box.getCenter(center);
        geometry.translate(-center.x, -box.min.y, -center.z);

        geometry.computeBoundingBox();
        const finalBox = geometry.boundingBox;
        const size = new THREE.Vector3();
        finalBox.getSize(size);
        const targetHeight = Board3D.STAUNTON_HEIGHTS[pieceType] || 0.9;
        const targetFootprint = 0.64;
        const scale = Math.min(
            targetHeight / Math.max(size.y, 0.001),
            targetFootprint / Math.max(Math.max(size.x, size.z), 0.001)
        );
        geometry.scale(scale, scale, scale);
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        return geometry;
    }

    async _ensureSceneAsset() {
        if (this.sceneRoot || this.sceneLoadFailed) {
            this._syncSceneMode();
            return this.sceneRoot;
        }
        if (this.sceneLoadPromise) return this.sceneLoadPromise;

        this.sceneLoadPromise = this._loadSceneGlb(Board3D.SCENE_GLB_URL)
            .then(root => {
                this.sceneRoot = root;
                this.scene.add(root);
                this._fitSceneRoot(root);
                this._syncSceneMode();
                return root;
            })
            .catch(error => {
                this.sceneLoadFailed = true;
                throw error;
            })
            .finally(() => {
                this.sceneLoadPromise = null;
            });

        return this.sceneLoadPromise;
    }

    async _loadSceneGlb(url) {
        const response = await fetch(encodeURI(url));
        if (!response.ok) throw new Error(`Failed to load GLB scene: ${url}`);
        const arrayBuffer = await response.arrayBuffer();
        return Board3D.parseGlbScene(arrayBuffer, window.THREE);
    }

    _fitSceneRoot(root) {
        const THREE = window.THREE;
        const box = new THREE.Box3().setFromObject(root);
        if (box.isEmpty()) return;
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        const scale = size.x > 0 && size.z > 0 ? Math.min(9 / size.x, 9 / size.z) : 1;
        root.scale.setScalar(scale);
        root.position.set(-center.x * scale, -box.min.y * scale - 0.4, -center.z * scale);
    }

    _syncSceneMode() {
        const useScene = this.renderStyle === 'scene' && Boolean(this.sceneRoot);
        this.boardVisuals.forEach(mesh => { mesh.visible = !useScene; });
        if (this.sceneRoot) this.sceneRoot.visible = useScene;
    }

    static parseGlbScene(arrayBuffer, THREE) {
        const view = new DataView(arrayBuffer);
        if (view.getUint32(0, true) !== 0x46546c67) throw new Error('Invalid GLB header.');
        const version = view.getUint32(4, true);
        if (version !== 2) throw new Error(`Unsupported GLB version ${version}.`);

        let offset = 12;
        let json = null;
        let binChunk = null;
        while (offset < arrayBuffer.byteLength) {
            const chunkLength = view.getUint32(offset, true);
            const chunkType = view.getUint32(offset + 4, true);
            offset += 8;
            const chunkData = arrayBuffer.slice(offset, offset + chunkLength);
            offset += chunkLength;
            if (chunkType === 0x4E4F534A) {
                json = JSON.parse(new TextDecoder().decode(chunkData));
            } else if (chunkType === 0x004E4942) {
                binChunk = chunkData;
            }
        }

        if (!json || !binChunk) throw new Error('GLB missing JSON or BIN chunk.');

        const meshes = (json.meshes || []).map(meshDef => {
            const group = new THREE.Group();
            (meshDef.primitives || []).forEach(primitive => {
                const geometry = Board3D._buildGlbGeometry(json, binChunk, primitive, THREE);
                const material = Board3D._buildGlbMaterial(json, primitive, THREE);
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                group.add(mesh);
            });
            return group;
        });

        const buildNode = nodeIndex => {
            const nodeDef = (json.nodes || [])[nodeIndex] || {};
            const node = new THREE.Group();
            if (typeof nodeDef.mesh === 'number' && meshes[nodeDef.mesh]) {
                node.add(meshes[nodeDef.mesh].clone(true));
            }
            if (Array.isArray(nodeDef.matrix) && nodeDef.matrix.length === 16) {
                const matrix = new THREE.Matrix4();
                matrix.fromArray(nodeDef.matrix);
                node.applyMatrix4(matrix);
            } else {
                if (Array.isArray(nodeDef.translation)) node.position.fromArray(nodeDef.translation);
                if (Array.isArray(nodeDef.rotation)) node.quaternion.fromArray(nodeDef.rotation);
                if (Array.isArray(nodeDef.scale)) node.scale.fromArray(nodeDef.scale);
            }
            (nodeDef.children || []).forEach(childIndex => node.add(buildNode(childIndex)));
            return node;
        };

        const root = new THREE.Group();
        const sceneDef = (json.scenes || [])[json.scene || 0] || {};
        (sceneDef.nodes || []).forEach(nodeIndex => root.add(buildNode(nodeIndex)));
        return root;
    }

    static _buildGlbGeometry(json, binChunk, primitive, THREE) {
        const geometry = new THREE.BufferGeometry();
        const attributes = primitive.attributes || {};
        Object.keys(attributes).forEach(name => {
            const accessorIndex = attributes[name];
            const data = Board3D._readGlbAccessor(json, binChunk, accessorIndex);
            const key = name === 'POSITION' ? 'position' : name === 'NORMAL' ? 'normal' : name === 'TEXCOORD_0' ? 'uv' : null;
            if (!key) return;
            geometry.setAttribute(key, new THREE.BufferAttribute(data.array, data.itemSize));
        });
        if (primitive.indices != null) {
            const indexData = Board3D._readGlbAccessor(json, binChunk, primitive.indices);
            geometry.setIndex(new THREE.BufferAttribute(indexData.array, 1));
        }
        if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        return geometry;
    }

    static _buildGlbMaterial(json, primitive, THREE) {
        const materialDef = primitive.material != null ? (json.materials || [])[primitive.material] : null;
        const pbr = materialDef && materialDef.pbrMetallicRoughness ? materialDef.pbrMetallicRoughness : null;
        const baseColor = pbr && Array.isArray(pbr.baseColorFactor) ? pbr.baseColorFactor : [0.75, 0.75, 0.75, 1];
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(baseColor[0], baseColor[1], baseColor[2]),
            transparent: baseColor[3] < 1,
            opacity: baseColor[3],
            metalness: pbr && typeof pbr.metallicFactor === 'number' ? pbr.metallicFactor : 0.1,
            roughness: pbr && typeof pbr.roughnessFactor === 'number' ? pbr.roughnessFactor : 0.8
        });
    }

    static _readGlbAccessor(json, binChunk, accessorIndex) {
        const accessor = (json.accessors || [])[accessorIndex];
        const bufferView = (json.bufferViews || [])[accessor.bufferView];
        const itemSize = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 }[accessor.type] || 1;
        const component = Board3D._getGlbComponentInfo(accessor.componentType);
        const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
        const elementCount = accessor.count * itemSize;
        const byteLength = elementCount * component.bytes;
        let array = new component.ArrayType(binChunk.slice(byteOffset, byteOffset + byteLength));

        if (bufferView.byteStride && bufferView.byteStride !== itemSize * component.bytes) {
            const interleaved = new component.ArrayType(elementCount);
            const dataView = new DataView(binChunk, byteOffset, bufferView.byteStride * accessor.count);
            for (let item = 0; item < accessor.count; item++) {
                for (let value = 0; value < itemSize; value++) {
                    const readOffset = item * bufferView.byteStride + value * component.bytes;
                    interleaved[item * itemSize + value] = component.read(dataView, readOffset);
                }
            }
            array = interleaved;
        }

        return { array, itemSize };
    }

    static _getGlbComponentInfo(componentType) {
        switch (componentType) {
            case 5121: return { ArrayType: Uint8Array, bytes: 1, read: (view, offset) => view.getUint8(offset) };
            case 5123: return { ArrayType: Uint16Array, bytes: 2, read: (view, offset) => view.getUint16(offset, true) };
            case 5125: return { ArrayType: Uint32Array, bytes: 4, read: (view, offset) => view.getUint32(offset, true) };
            case 5126: return { ArrayType: Float32Array, bytes: 4, read: (view, offset) => view.getFloat32(offset, true) };
            default: throw new Error(`Unsupported GLB component type ${componentType}.`);
        }
    }

    clearHighlights() {
        this.highlights.forEach(mesh => {
            if (mesh && mesh.parent) mesh.parent.remove(mesh);
        });
        this.highlights = [];
    }

    highlightSquare(sqName, type = 'select') {
        const THREE = window.THREE;
        const file = 'abcdefgh'.indexOf(sqName[0]);
        const rank = '87654321'.indexOf(sqName[1]);
        if (file < 0 || rank < 0) return;

        const colors = {
            select: 0x14cc28,
            lastmove: 0xd4d737,
            legal: 0x226699,
            check: 0xff2020
        };

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.96, 0.96),
            new THREE.MeshBasicMaterial({ color: colors[type] || 0xffff00, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(file - 3.5, 0.1, rank - 3.5);
        this.scene.add(mesh);
        this.highlights.push(mesh);
    }

    _applyOrbit() {
        const { theta, phi } = this.orbit;
        const r = this.camR;
        this.camera.position.set(
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.cos(theta)
        );
        this.camera.lookAt(0, 0, 0);
    }

    resetView() {
        this.orbit = {
            theta: Math.PI * 0.25 + (this.flipped ? Math.PI : 0),
            phi: Math.PI * 0.33
        };
        this._applyOrbit();
    }

    flipView() {
        this.flipped = !this.flipped;
        this.orbit.theta += Math.PI;
        this._applyOrbit();
    }

    setFlipped(flipped) {
        if (this.flipped === Boolean(flipped)) return;
        this.flipView();
    }

    refreshTheme() {
        const THREE = window.THREE;
        const css = getComputedStyle(document.body);
        const lightC = new THREE.Color(css.getPropertyValue('--sq-light').trim() || '#f0d9b5');
        const darkC = new THREE.Color(css.getPropertyValue('--sq-dark').trim() || '#b58863');
        const frameC = new THREE.Color(css.getPropertyValue('--board-frame').trim() || '#3a2f1b');
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const square = this.squareMeshes[rank * 8 + file];
                if (!square) continue;
                square.material.color.set((rank + file) % 2 === 0 ? lightC : darkC);
            }
        }
        if (this.frameMesh) this.frameMesh.material.color.set(frameC);
        if (this.plinthMesh) this.plinthMesh.material.color.set(frameC.clone().multiplyScalar(0.7));
        this._updateSceneBg();
    }

    _updateSceneBg() {
        const THREE = window.THREE;
        const bgHex = getComputedStyle(document.body).getPropertyValue('--page-bg').trim() || '#1a1a2e';
        if (this.scene) this.scene.background = new THREE.Color(bgHex);
    }

    show() {
        this.active = true;
        this.container.style.display = 'block';
        this.resize();
        this._startLoop();
    }

    hide() {
        this.active = false;
        this.container.style.display = 'none';
    }

    resize() {
        const width = this.container.clientWidth || 600;
        const height = this.container.clientHeight || 600;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    _startLoop() {
        if (this._loopRunning) return;
        this._loopRunning = true;
        const loop = () => {
            if (!this.active) {
                this._loopRunning = false;
                return;
            }
            requestAnimationFrame(loop);
            this.renderer.render(this.scene, this.camera);
        };
        loop();
    }

    _bindEvents() {
        const el = this.renderer.domElement;

        const midpoint = touches => {
            if (!touches || touches.length < 2) return null;
            return {
                x: (touches[0].clientX + touches[1].clientX) / 2,
                y: (touches[0].clientY + touches[1].clientY) / 2,
            };
        };

        const resetTouchState = () => {
            this.drag = false;
            this.dragMoved = false;
            this.touchOrbitActive = false;
        };

        el.addEventListener('mousedown', event => {
            this.drag = true;
            this.dragMoved = false;
            this.prev = { x: event.clientX, y: event.clientY };
        });
        window.addEventListener('mousemove', event => {
            if (!this.drag) return;
            const dx = event.clientX - this.prev.x;
            const dy = event.clientY - this.prev.y;
            if (Math.abs(dx) + Math.abs(dy) > 2) this.dragMoved = true;
            this.orbit.theta -= dx * 0.012;
            this.orbit.phi = Math.max(0.18, Math.min(1.45, this.orbit.phi + dy * 0.012));
            this.prev = { x: event.clientX, y: event.clientY };
            this._applyOrbit();
        });
        window.addEventListener('mouseup', event => {
            if (this.drag && !this.dragMoved) {
                this._emitSquareClickAt(event.clientX, event.clientY);
            }
            this.drag = false;
            this.dragMoved = false;
            this.touchOrbitActive = false;
        });

        el.addEventListener('touchstart', event => {
            this.drag = true;
            this.dragMoved = false;
            this.touchOrbitActive = event.touches.length >= 2;
            if (this.touchOrbitActive) {
                const mid = midpoint(event.touches);
                if (mid) this.prev = mid;
            } else {
                this.prev = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            }
        }, { passive: false });

        el.addEventListener('touchmove', event => {
            if (!this.drag) return;

            if (event.touches.length >= 2 || this.touchOrbitActive) {
                const mid = midpoint(event.touches);
                if (mid) {
                    const dx = mid.x - this.prev.x;
                    const dy = mid.y - this.prev.y;
                    if (Math.abs(dx) + Math.abs(dy) > 2) this.dragMoved = true;
                    this.touchOrbitActive = true;
                    this.orbit.theta -= dx * 0.01;
                    this.orbit.phi = Math.max(0.18, Math.min(1.45, this.orbit.phi + dy * 0.01));
                    this.prev = mid;
                    this._applyOrbit();
                }
                event.preventDefault();
                return;
            }

            const dx = event.touches[0].clientX - this.prev.x;
            const dy = event.touches[0].clientY - this.prev.y;
            if (Math.abs(dx) + Math.abs(dy) > 12) this.dragMoved = true;
            this.prev = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            event.preventDefault();
        }, { passive: false });

        el.addEventListener('touchend', event => {
            const touch = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0] : null;
            if (this.drag && !this.dragMoved && !this.touchOrbitActive && touch) {
                this._emitSquareClickAt(touch.clientX, touch.clientY);
            }

            if (event.touches && event.touches.length) {
                this.touchOrbitActive = event.touches.length >= 2;
                if (this.touchOrbitActive) {
                    const mid = midpoint(event.touches);
                    if (mid) this.prev = mid;
                } else {
                    this.prev = { x: event.touches[0].clientX, y: event.touches[0].clientY };
                }
                return;
            }

            resetTouchState();
        });

        el.addEventListener('touchcancel', () => {
            resetTouchState();
        });

        el.addEventListener('wheel', event => {
            this.camR = Math.max(7, Math.min(22, this.camR + event.deltaY * 0.02));
            this._applyOrbit();
            event.preventDefault();
        }, { passive: false });

        window.addEventListener('resize', () => this.resize());
    }

    _emitSquareClickAt(clientX, clientY) {
        const square = this._pickSquareFromClientPoint(clientX, clientY);
        if (!square || typeof this.onSquareClick !== 'function') return;
        this.onSquareClick(square);
    }

    _pickSquareFromClientPoint(clientX, clientY) {
        if (!this.raycaster || !this.pointer || !this.camera || !this.squareMeshes.length) return null;
        const rect = this.renderer.domElement.getBoundingClientRect();
        if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return null;
        this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const hits = this.raycaster.intersectObjects(this.squareMeshes, false);
        if (!hits.length) return null;
        const sqName = hits[0] && hits[0].object && hits[0].object.userData ? hits[0].object.userData.sqName : null;
        return typeof sqName === 'string' ? sqName : null;
    }

    destroy() {
        this.active = false;
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

window.Board3D = Board3D;
