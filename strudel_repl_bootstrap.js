/**
 * cloud-5 standalone Strudel REPL: always start with the canonical welcome
 * pattern when opened as a top-level page without a shared URL (no hash /
 * short-link query). Embedded piece overlays load strudel_repl.html in an
 * iframe and are left unchanged.
 */
(function () {
  // cloud-5 pieces embed the REPL in an iframe; only reset the top-level page.
  if (window.parent !== window || new URLSearchParams(window.location.search).get('cloud5-embed')) {
    return;
  }

  function hasUrlCode() {
    const href = window.location.href;
    const codeParam = href.split('#')[1] || '';
    if (codeParam) {
      return true;
    }
    const hash = href.split('?')[1]?.split('#')?.[0]?.split('&')?.[0];
    return Boolean(hash);
  }

  if (hasUrlCode()) {
    return;
  }

  // @nanostores/persistent map keys: prefix + field name (e.g. strudel-settingslatestCode).
  const latestCodeKey = /^strudel-settings\d*latestCode$/;

  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && latestCodeKey.test(key)) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn('strudel_repl_bootstrap: failed to clear latestCode', err);
  }
})();
