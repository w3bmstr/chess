// engine_worker.js
// UI-side engine bridge that prefers the Worker transport and falls back to the local engine.

(function (global) {
    function createLocalEngineBridge() {
        if (typeof global.createEngine !== 'function') {
            throw new Error('createEngine is not available.');
        }

        const engine = global.createEngine();
        return {
            mode: 'local',
            setPosition(fen) {
                engine.setPosition(fen);
            },
            makeMove(move) {
                return engine.makeMove(move);
            },
            go(options, onInfo) {
                return engine.go(options, onInfo);
            },
            stop() {
                engine.stop();
            },
            getBestMove() {
                return engine.getBestMove();
            },
            getInfo() {
                return engine.getInfo();
            },
            getNNUEStatus() {
                return typeof engine.getNNUEStatus === 'function' ? engine.getNNUEStatus() : { ready: false, source: 'unavailable' };
            },
            loadNNUE(network, options) {
                if (typeof engine.loadNNUE !== 'function') {
                    throw new Error('loadNNUE is not available.');
                }
                return engine.loadNNUE(network, options);
            },
            resetNNUE() {
                if (typeof engine.resetNNUE !== 'function') {
                    throw new Error('resetNNUE is not available.');
                }
                return engine.resetNNUE();
            },
            getFEN() {
                return typeof engine.getFEN === 'function' ? engine.getFEN() : null;
            },
            destroy() {},
        };
    }

    function createWorkerEngineBridge(options) {
        if (typeof global.Worker !== 'function') {
            throw new Error('Web Workers are not supported in this environment.');
        }

        const opts = options || {};
        const requestTimeoutMs = Math.max(1000, Number(opts.requestTimeoutMs) || 15000);
        const goTimeoutMs = Math.max(requestTimeoutMs, Number(opts.goTimeoutMs) || 45000);
        const worker = new global.Worker('worker.js');
        let nextRequestId = 1;
        let lastInfo = { depth: 0, score: 0, nodes: 0, pv: [], bestMove: null };
        let lastBestMove = null;
        let disposed = false;
        let workerFailed = false;
        let activeGo = null;
        const pending = new Map();

        function timeoutForType(type) {
            return type === 'go' ? goTimeoutMs : requestTimeoutMs;
        }

        function clearEntryTimeout(entry) {
            if (!entry || !entry.timeoutId) return;
            global.clearTimeout(entry.timeoutId);
            entry.timeoutId = 0;
        }

        function settlePending(requestId, action, payload) {
            const entry = pending.get(requestId);
            if (!entry) return null;
            pending.delete(requestId);
            clearEntryTimeout(entry);
            if (action === 'resolve') {
                entry.resolve(payload);
            } else {
                entry.reject(payload);
            }
            return entry;
        }

        function rejectAllPending(error) {
            pending.forEach(entry => {
                clearEntryTimeout(entry);
                entry.reject(error);
            });
            pending.clear();
            activeGo = null;
        }

        function failWorker(error) {
            if (workerFailed || disposed) return;
            workerFailed = true;
            const failure = error instanceof Error ? error : new Error(String(error || 'Worker engine failed.'));
            rejectAllPending(failure);
            try {
                worker.terminate();
            } catch (_error) {
                // Ignore termination failures when the worker is already gone.
            }
        }

        function makeDeferred(type, onInfo) {
            const requestId = nextRequestId++;
            let resolveRef;
            let rejectRef;
            const promise = new Promise((resolve, reject) => {
                resolveRef = resolve;
                rejectRef = reject;
            });

            const timeoutId = global.setTimeout(() => {
                const timeoutError = new Error('Worker command "' + type + '" timed out.');
                const settled = settlePending(requestId, 'reject', timeoutError);
                if (settled && activeGo && activeGo.requestId === requestId) {
                    activeGo = null;
                }
                failWorker(timeoutError);
            }, timeoutForType(type));

            pending.set(requestId, {
                requestId,
                type,
                resolve: resolveRef,
                reject: rejectRef,
                onInfo,
                timeoutId,
            });

            return { requestId, promise };
        }

        function send(type, payload, requestId) {
            if (disposed || workerFailed) {
                throw new Error('Worker engine is unavailable.');
            }
            worker.postMessage(Object.assign({ type, requestId }, payload || {}));
        }

        worker.addEventListener('message', event => {
            if (disposed || workerFailed) return;
            const data = event.data || {};
            const requestId = data.requestId;

            if (data.type === 'info') {
                lastInfo = data.info || lastInfo;
                if (activeGo && typeof activeGo.onInfo === 'function') {
                    activeGo.onInfo(lastInfo);
                }
                return;
            }

            if (data.type === 'bestmove') {
                lastBestMove = data.bestMove || null;
                const result = { bestMove: data.bestMove || null, score: data.score || 0 };
                if (requestId) {
                    settlePending(requestId, 'resolve', result);
                    if (activeGo && activeGo.requestId === requestId) activeGo = null;
                } else if (activeGo) {
                    clearEntryTimeout(activeGo);
                    pending.delete(activeGo.requestId);
                    activeGo.resolve(result);
                    activeGo = null;
                }
                return;
            }

            if (data.type === 'nnue-status') {
                if (requestId) {
                    settlePending(requestId, 'resolve', data.nnue || { ready: false, source: 'unavailable' });
                }
                return;
            }

            if (data.type === 'error') {
                const error = new Error(data.message || 'Worker engine error');
                if (requestId) {
                    settlePending(requestId, 'reject', error);
                    if (activeGo && activeGo.requestId === requestId) activeGo = null;
                    return;
                }

                if (activeGo) {
                    clearEntryTimeout(activeGo);
                    pending.delete(activeGo.requestId);
                    activeGo.reject(error);
                    activeGo = null;
                    return;
                }

                failWorker(error);
                return;
            }

            if (!requestId) return;

            if (data.type === 'position-set' || data.type === 'move-made' || data.type === 'stopped') {
                settlePending(requestId, 'resolve', data);
                if (activeGo && activeGo.requestId === requestId) activeGo = null;
            }
        });

        worker.addEventListener('error', event => {
            if (disposed) return;
            const message = event && event.message ? event.message : 'Worker engine encountered an error.';
            failWorker(new Error(message));
        });

        worker.addEventListener('messageerror', () => {
            if (disposed) return;
            failWorker(new Error('Worker engine message parsing failed.'));
        });

        return {
            mode: 'worker',
            setPosition(fen) {
                const deferred = makeDeferred('setPosition');
                try {
                    send('setPosition', { fen }, deferred.requestId);
                } catch (error) {
                    settlePending(deferred.requestId, 'reject', error);
                    failWorker(error);
                }
                return deferred.promise;
            },
            makeMove(move) {
                const deferred = makeDeferred('makeMove');
                try {
                    send('makeMove', { move }, deferred.requestId);
                } catch (error) {
                    settlePending(deferred.requestId, 'reject', error);
                    failWorker(error);
                }
                return deferred.promise.then(result => Boolean(result.ok));
            },
            go(options, onInfo) {
                const deferred = makeDeferred('go', onInfo);
                activeGo = pending.get(deferred.requestId) || null;
                try {
                    send('go', { options: options || {} }, deferred.requestId);
                } catch (error) {
                    settlePending(deferred.requestId, 'reject', error);
                    failWorker(error);
                }
                return deferred.promise;
            },
            stop() {
                const deferred = makeDeferred('stop');
                try {
                    send('stop', {}, deferred.requestId);
                } catch (error) {
                    settlePending(deferred.requestId, 'reject', error);
                    failWorker(error);
                }
                if (activeGo) {
                    activeGo = null;
                }
                return deferred.promise;
            },
            getBestMove() {
                return lastBestMove;
            },
            getInfo() {
                return lastInfo;
            },
            getNNUEStatus() {
                const deferred = makeDeferred('getNNUEStatus');
                try {
                    send('getNNUEStatus', {}, deferred.requestId);
                } catch (error) {
                    settlePending(deferred.requestId, 'reject', error);
                    failWorker(error);
                }
                return deferred.promise;
            },
            loadNNUE(network, options) {
                const deferred = makeDeferred('loadNNUE');
                try {
                    send('loadNNUE', { network, options: options || {} }, deferred.requestId);
                } catch (error) {
                    settlePending(deferred.requestId, 'reject', error);
                    failWorker(error);
                }
                return deferred.promise;
            },
            resetNNUE() {
                const deferred = makeDeferred('resetNNUE');
                try {
                    send('resetNNUE', {}, deferred.requestId);
                } catch (error) {
                    settlePending(deferred.requestId, 'reject', error);
                    failWorker(error);
                }
                return deferred.promise;
            },
            getFEN() {
                return null;
            },
            destroy() {
                if (disposed) return;
                disposed = true;
                workerFailed = true;
                rejectAllPending(new Error('Engine bridge disposed.'));
                try {
                    worker.terminate();
                } catch (_error) {
                    // Ignore termination failures for already-closed workers.
                }
            },
        };
    }

    function createPlayEngine(options) {
        const opts = options || {};
        const isFileOrigin = typeof global.location !== 'undefined' && global.location && global.location.protocol === 'file:';
        if (opts.preferWorker !== false) {
            if (isFileOrigin) {
                return createLocalEngineBridge();
            }
            try {
                const workerBridge = createWorkerEngineBridge(opts);
                let localBridge = null;
                let activeBridge = workerBridge;

                function ensureLocalBridge() {
                    if (!localBridge) {
                        localBridge = createLocalEngineBridge();
                    }
                    return localBridge;
                }

                function switchToLocalBridge(reason) {
                    if (activeBridge && activeBridge.mode === 'local') {
                        return activeBridge;
                    }
                    console.warn('engine_worker.js: switching to local engine bridge.', reason);
                    try {
                        if (workerBridge && typeof workerBridge.destroy === 'function') {
                            workerBridge.destroy();
                        }
                    } catch (_error) {
                        // Ignore worker teardown errors while switching transport.
                    }
                    activeBridge = ensureLocalBridge();
                    return activeBridge;
                }

                function invoke(methodName, args) {
                    const target = activeBridge;
                    let result;
                    try {
                        result = target[methodName].apply(target, args);
                    } catch (error) {
                        if (target.mode === 'worker') {
                            const fallback = switchToLocalBridge(error);
                            return fallback[methodName].apply(fallback, args);
                        }
                        throw error;
                    }

                    if (result && typeof result.then === 'function') {
                        return result.catch(error => {
                            if (target.mode === 'worker') {
                                const fallback = switchToLocalBridge(error);
                                return fallback[methodName].apply(fallback, args);
                            }
                            throw error;
                        });
                    }

                    return result;
                }

                return {
                    get mode() {
                        return activeBridge && activeBridge.mode ? activeBridge.mode : 'local';
                    },
                    setPosition(fen) {
                        return invoke('setPosition', [fen]);
                    },
                    makeMove(move) {
                        return invoke('makeMove', [move]);
                    },
                    go(optionsArg, onInfo) {
                        return invoke('go', [optionsArg, onInfo]);
                    },
                    stop() {
                        return invoke('stop', []);
                    },
                    getBestMove() {
                        return invoke('getBestMove', []);
                    },
                    getInfo() {
                        return invoke('getInfo', []);
                    },
                    getNNUEStatus() {
                        return invoke('getNNUEStatus', []);
                    },
                    loadNNUE(network, nnueOptions) {
                        return invoke('loadNNUE', [network, nnueOptions]);
                    },
                    resetNNUE() {
                        return invoke('resetNNUE', []);
                    },
                    getFEN() {
                        return invoke('getFEN', []);
                    },
                    destroy() {
                        try {
                            if (workerBridge && typeof workerBridge.destroy === 'function') {
                                workerBridge.destroy();
                            }
                        } catch (_error) {
                            // Ignore worker teardown failures.
                        }
                        try {
                            if (localBridge && typeof localBridge.destroy === 'function') {
                                localBridge.destroy();
                            }
                        } catch (_error) {
                            // Ignore local teardown failures.
                        }
                    },
                };
            } catch (error) {
                console.warn('engine_worker.js: worker transport unavailable, falling back to local engine.', error);
            }
        }
        return createLocalEngineBridge();
    }

    global.createPlayEngine = createPlayEngine;
})(typeof self !== 'undefined' ? self : window);