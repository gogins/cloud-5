/**
 * Embeds the Strudel REPL in an iframe with a basic API so the host page can
 * wire Csound and control playback.
 */
function strudelCodeToHash(code) {
  const utf8Bytes = new TextEncoder().encode(code);
  let binaryString = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < utf8Bytes.length; i += chunkSize) {
    const chunk = utf8Bytes.subarray(i, i + chunkSize);
    binaryString += String.fromCharCode.apply(null, chunk);
  }
  return encodeURIComponent(btoa(binaryString));
}

function strudelReplUrl(code) {
  const url = new URL('strudel_repl.html', window.location.href);
  url.hash = strudelCodeToHash(code);
  return url.href;
}

function publishTopGlobal(name, value) {
  window.top.globalThis[name] = value;
}

function hostCsound() {
  const top = window.top;
  return top.globalThis?.csound ?? top.csound;
}

function isInsideCloud5Strudel(element) {
  return Boolean(element?.closest?.('cloud5-strudel'));
}

class StrudelReplComponent extends HTMLElement {
  static #instances = new Set();

  static all() {
    return [...StrudelReplComponent.#instances];
  }

  static standalone() {
    return StrudelReplComponent.all().filter((el) => !isInsideCloud5Strudel(el));
  }

  static armAllIframeAudio() {
    for (const comp of StrudelReplComponent.all()) {
      comp._armIframeAudio();
    }
  }

  static async startAll(csound, csoundac, parameters) {
    StrudelReplComponent.armAllIframeAudio();
    await Promise.all(
      StrudelReplComponent.standalone().map(async (comp) => {
        comp.setCsound(csound);
        comp.setCsoundAC(csoundac);
        if (parameters) {
          comp.setParameters(parameters);
        }
        await comp.startPlaying();
      }),
    );
  }

  static async stopAll() {
    await Promise.all(StrudelReplComponent.all().map((comp) => comp.stopPlaying()));
  }

  static prepareStrudelMenuToggle() {
    for (const comp of StrudelReplComponent.all()) {
      comp._prepareStrudelMenuToggle();
    }
  }

  constructor() {
    super();
    this.play_button = null;
    this.update_button = null;
    this.i_frame = null;
    this.content_window = null;
    this.content_document = null;
    this._ready = null;
    this._piece_code = '';
    this._pendingCsound = undefined;
    this._pendingCsoundAC = undefined;
    this._pendingParameters = undefined;
    this._keepAliveActive = false;
    this._layoutStyleAttribute = null;
  }

  connectedCallback() {
    StrudelReplComponent.#instances.add(this);
    if (this._layoutStyleAttribute == null) {
      this._layoutStyleAttribute = this.getAttribute('style') ?? '';
    }
    this._mountRepl();
    requestAnimationFrame(() => this._ensureReplHostAlive());
  }

  disconnectedCallback() {
    StrudelReplComponent.#instances.delete(this);
  }

  _extractCode() {
    for (const node of this.childNodes) {
      if (node.nodeType === Node.COMMENT_NODE) {
        const code = node.textContent.trim();
        if (code) {
          return code;
        }
      }
    }
    return (this.innerHTML + '').replace('<!--', '').replace('-->', '').trim();
  }

  _mountRepl() {
    this._ready = null;
    const code = this._extractCode();
    if (code) {
      this._piece_code = code;
    }
    if (!this._piece_code) {
      requestAnimationFrame(() => {
        const retry = this._extractCode();
        if (retry && !this.i_frame) {
          this._piece_code = retry;
          this._mountRepl();
        }
      });
      return;
    }
    if (this.i_frame) {
      return;
    }
    const iframe = document.createElement('iframe');
    const src = strudelReplUrl(this._piece_code);
    console.log('StrudelReplComponent src:', src);
    iframe.setAttribute('src', src);
    iframe.setAttribute('allow', 'autoplay');
    iframe.setAttribute('width', '1200');
    iframe.setAttribute('height', '800');
    iframe.style.display = 'visible';
    iframe.style.background = 'transparent';
    iframe.addEventListener('load', () => {
      this.content_window = iframe.contentWindow;
      this.content_document = iframe.contentDocument;
      this._syncHostBindingsToIframe();
      this._ensureReplHostAlive();
    });
    this.replaceChildren(iframe);
    this.i_frame = iframe;
    this.content_window = iframe.contentWindow;
    this.content_document = iframe.contentDocument;
    this._ensureReplHostAlive();
  }

  _restoreLayoutStyle() {
    if (this._layoutStyleAttribute != null) {
      this.setAttribute('style', this._layoutStyleAttribute);
    }
  }

  /**
   * Host pages often hide the overlay with display:none, which prevents the
   * iframe REPL from fully initializing. Shrink and hide in place without
   * changing the piece's position or z-index.
   */
  _ensureReplHostAlive() {
    if (this._keepAliveActive) {
      return;
    }
    if (window.getComputedStyle(this).display === 'none') {
      this._keepAliveActive = true;
      this.style.setProperty('display', 'block', 'important');
      this.style.setProperty('visibility', 'hidden', 'important');
      this.style.setProperty('width', '0', 'important');
      this.style.setProperty('height', '0', 'important');
      this.style.setProperty('overflow', 'hidden', 'important');
      this.style.setProperty('pointer-events', 'none', 'important');
    }
  }

  _endKeepAlive() {
    if (!this._keepAliveActive) {
      return;
    }
    this._restoreLayoutStyle();
    this._keepAliveActive = false;
  }

  /**
   * Run in capture phase before legacy jQuery menu toggles. Restore the piece
   * layout, then leave display:none so jQuery .show() / .hide() keep working.
   */
  _prepareStrudelMenuToggle() {
    if (!this._keepAliveActive) {
      return;
    }
    this._endKeepAlive();
    this.style.display = 'none';
  }

  /**
   * Strudel arms WebAudio on the iframe document's first mousedown. Relay the
   * host Play gesture into each iframe while the user activation is fresh.
   */
  _armIframeAudio() {
    const win = this.i_frame?.contentWindow;
    const doc = this.i_frame?.contentDocument;
    if (!win || !doc) {
      return;
    }
    const eventInit = { bubbles: true, cancelable: true, view: win };
    doc.dispatchEvent(new MouseEvent('mousedown', eventInit));
    doc.dispatchEvent(new MouseEvent('mouseup', eventInit));
    doc.dispatchEvent(new MouseEvent('click', eventInit));
  }

  whenReady() {
    if (!this._ready) {
      this._ready = new Promise((resolve) => {
        const deadline = Date.now() + 120000;
        const finish = () => resolve(this);
        const poll = () => {
          if (this.i_frame?.contentWindow?.strudelMirror) {
            finish();
            return;
          }
          if (Date.now() > deadline) {
            console.warn('Strudel REPL not ready within timeout');
            finish();
            return;
          }
          setTimeout(poll, 100);
        };
        if (this.i_frame) {
          this.i_frame.addEventListener('load', poll, { once: true });
        }
        poll();
      });
    }
    return this._ready;
  }

  _mirror() {
    return this.i_frame?.contentWindow?.strudelMirror;
  }

  _syncHostBindingsToIframe() {
    const win = this.i_frame?.contentWindow;
    if (!win) {
      return;
    }
    if (this._pendingCsound !== undefined) {
      win.csound = this._pendingCsound;
      win.__csound__ = this._pendingCsound;
    }
    if (this._pendingCsoundAC !== undefined) {
      win.csoundac = this._pendingCsoundAC;
      win.__csoundac__ = this._pendingCsoundAC;
    }
    if (this._pendingParameters !== undefined) {
      win.__parameters__ = this._pendingParameters;
    }
  }

  async startPlaying() {
    console.log('StrudelReplComponent.startPlaying');
    this._ensureReplHostAlive();
    this._armIframeAudio();
    this._syncHostBindingsToIframe();
    await this.whenReady();
    const mirror = this._mirror();
    if (mirror) {
      if (!mirror.repl?.scheduler?.started) {
        await mirror.evaluate();
      }
      return;
    }
    this.i_frame?.contentDocument?.querySelector('button[title="play"]')?.click();
  }

  async stopPlaying() {
    console.log('StrudelReplComponent.stopPlaying');
    await this.whenReady();
    const mirror = this._mirror();
    if (mirror?.repl?.scheduler?.started) {
      await mirror.toggle();
      return;
    }
    this.i_frame?.contentDocument?.querySelector('button[title="stop"]')?.click();
  }

  updateRepl() {
    console.log('StrudelReplComponent.updateRepl');
    this.i_frame?.contentDocument?.querySelector('button[title="update"]')?.click();
  }

  setCode(tidal_code) {
    this._piece_code = tidal_code;
    this.i_frame = null;
    this._ready = null;
    this._keepAliveActive = false;
    this.innerHTML = '<!-- ' + tidal_code + ' -->';
    this._mountRepl();
  }

  getCode() {
    return this._piece_code || this._extractCode();
  }

  setCsound(csound_) {
    this._pendingCsound = csound_;
    publishTopGlobal('csound', csound_);
    publishTopGlobal('__csound__', csound_);
    this._syncHostBindingsToIframe();
    void this.whenReady().then(() => this._syncHostBindingsToIframe());
  }

  setCsoundAC(csoundac_) {
    if (!csoundac_ && typeof get_csound_ac === 'function') {
      void get_csound_ac().then((resolved) => this.setCsoundAC(resolved));
      return;
    }
    this._pendingCsoundAC = csoundac_;
    publishTopGlobal('csound_ac', csoundac_);
    publishTopGlobal('csoundac', csoundac_);
    publishTopGlobal('__csoundac__', csoundac_);
    this._syncHostBindingsToIframe();
    void this.whenReady().then(() => this._syncHostBindingsToIframe());
  }

  setParameters(parameters_) {
    this._pendingParameters = parameters_;
    publishTopGlobal('__parameters__', parameters_);
    this._syncHostBindingsToIframe();
    void this.whenReady().then(() => this._syncHostBindingsToIframe());
  }
}

customElements.define('strudel-repl-component', StrudelReplComponent);

async function startStrudelForHost(csound) {
  if (!csound?.is_playing) {
    return;
  }
  let csoundac =
    window.top.globalThis.csound_ac ??
    window.top.globalThis.csoundac ??
    window.top.globalThis.CsoundAC;
  if (!csoundac && typeof get_csound_ac === 'function') {
    try {
      csoundac = await get_csound_ac();
    } catch (_) {
      /* CsoundAC may not be ready yet */
    }
  }
  const parameters = window.top.globalThis.__parameters__;
  await StrudelReplComponent.startAll(csound, csoundac, parameters);
}

function wireMainTransportToStrudel() {
  const armOnHostGesture = (event) => {
    if (
      event.target.closest?.('#menu_item_play') ||
      event.target.closest?.('#menu_item_render')
    ) {
      StrudelReplComponent.armAllIframeAudio();
    }
  };

  document.addEventListener('mousedown', armOnHostGesture, true);

  document.addEventListener(
    'click',
    (event) => {
      if (event.target.closest?.('#menu_item_stop')) {
        void StrudelReplComponent.stopAll();
        return;
      }
      const playButton = event.target.closest?.('#menu_item_play');
      if (playButton) {
        if ((playButton.textContent || '').trim().toLowerCase() === 'stop') {
          void StrudelReplComponent.stopAll();
        }
        return;
      }
      if (
        event.target.closest?.('#menu_item_tidal') ||
        event.target.closest?.('#menu_item_strudel')
      ) {
        StrudelReplComponent.prepareStrudelMenuToggle();
      }
    },
    true,
  );

  window.addEventListener('cloud5:csound-playing', (event) => {
    void startStrudelForHost(event.detail?.csound ?? hostCsound());
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireMainTransportToStrudel);
} else {
  wireMainTransportToStrudel();
}
