/**
 * NW.js crash/debug helper. Load after CsoundAC.js, before PLSystem.js.
 * Append ?debug=1 to the page URL to auto-run the score generator on load.
 * Log file: cloud5-nwjs-debug.log in the NW.js app directory (playpen dist root).
 */
(function () {
    const LOG_NAME = 'cloud5-nwjs-debug.log';
    const enabled = /(?:\?|&)debug(?:=1|=true)?(?:&|$)/i.test(location.search);
    const in_nwjs = (typeof process !== 'undefined' && process.versions && process.versions.nw);

    function append(line) {
        const msg = new Date().toISOString() + ' ' + line + '\n';
        try {
            if (typeof require === 'function') {
                require('fs').appendFileSync(LOG_NAME, msg);
            }
        } catch (_) { /* browser without fs */ }
        console.error('[cloud5-debug] ' + line);
    }

    globalThis.cloud5_nwjs_debug = append;
    globalThis.cloud5_nwjs_debug_auto_score = enabled || in_nwjs;

    append('harness start enabled=' + enabled +
        ' pid=' + (typeof process !== 'undefined' ? process.pid : '?') +
        ' cwd=' + (typeof process !== 'undefined' && process.cwd ? process.cwd() : '?'));

    window.addEventListener('error', function (e) {
        append('window.error: ' + e.message + ' @ ' + e.filename + ':' + e.lineno +
            '\n' + (e.error && e.error.stack ? e.error.stack : ''));
    });
    window.addEventListener('unhandledrejection', function (e) {
        const r = e.reason;
        append('unhandledrejection: ' + (r && r.stack ? r.stack : (r && r.message ? r.message : String(r))));
    });
    if (typeof process !== 'undefined' && process.on) {
        process.on('uncaughtException', function (err) {
            append('uncaughtException: ' + (err && err.stack ? err.stack : String(err)));
        });
    }

    function wrapCreateCsoundAC() {
        if (typeof globalThis.createCsoundAC !== 'function') {
            return;
        }
        if (globalThis.createCsoundAC.__cloud5_debug_wrapped) {
            return;
        }
        const orig = globalThis.createCsoundAC;
        globalThis.createCsoundAC = async function () {
            append('createCsoundAC()...');
            const mod = await orig();
            append('createCsoundAC() returned');
            if (mod && !mod.__cloud5_abort_wrapped) {
                mod.__cloud5_abort_wrapped = true;
                const prevAbort = mod.onAbort;
                mod.onAbort = function (reason) {
                    append('WASM onAbort: ' + reason);
                    if (typeof prevAbort === 'function') {
                        prevAbort(reason);
                    }
                };
            }
            return mod;
        };
        globalThis.createCsoundAC.__cloud5_debug_wrapped = true;
        append('createCsoundAC wrapped');
    }

    wrapCreateCsoundAC();
})();
