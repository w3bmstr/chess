(function (global) {
    function normalizeUrl(value) {
        return typeof value === 'string' && value.trim()
            ? value.trim().replace(/\/$/, '')
            : '';
    }

    function detectPublicBaseUrl() {
        if (!global.location || !global.location.origin) {
            return '';
        }

        const origin = normalizeUrl(global.location.origin);
        const hostname = String(global.location.hostname || '').toLowerCase();
        if (!hostname.endsWith('github.io')) {
            return origin;
        }

        const parts = String(global.location.pathname || '')
            .split('/')
            .filter(Boolean);
        return origin + (parts.length ? '/' + parts[0] : '');
    }

    // Set this to your deployed Node/Socket.IO backend URL before publishing multiplayer.
    // Example: global.CHESS2_SOCKET_SERVER_URL = 'https://your-backend.example.com';
    global.CHESS2_SOCKET_SERVER_URL = normalizeUrl(global.CHESS2_SOCKET_SERVER_URL);

    // Public site URL used for shareable private-game links.
    // If not configured, auto-detect from current origin (and repo base path on GitHub Pages).
    global.CHESS2_PUBLIC_BASE_URL = normalizeUrl(global.CHESS2_PUBLIC_BASE_URL) || detectPublicBaseUrl();

    // Local vendored Socket.IO client script used for offline-capable boot.
    global.CHESS2_SOCKET_CLIENT_SCRIPT_URL = normalizeUrl(global.CHESS2_SOCKET_CLIENT_SCRIPT_URL) || 'vendor/socket.io/socket.io.min.js';
})(window);
