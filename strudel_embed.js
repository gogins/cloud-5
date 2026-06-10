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
  const url = new URL('/strudel_repl.html', window.location.origin);
  url.hash = strudelCodeToHash(code);
  return url.href;
}

class StrudelReplComponent extends HTMLElement {
  constructor() {
    super();
    this.play_button = null;
    this.update_button = null;
    this.i_frame = null;
    this.content_window = null;
    this.content_document = null;
    this._ready = null;
  }

  _extractCode() {
    return (this.innerHTML + '').replace('<!--', '').replace('-->', '').trim();
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

  connectedCallback() {
    this._ready = null;
    const code = this._extractCode();
    const iframe = document.createElement('iframe');
    const src = strudelReplUrl(code);
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
    });
    this.replaceChildren(iframe);
    this.i_frame = iframe;
    this.content_window = iframe.contentWindow;
    this.content_document = iframe.contentDocument;
  }

  _mirror() {
    return this.i_frame?.contentWindow?.strudelMirror;
  }

  async startPlaying() {
    console.log('StrudelReplComponent.startPlaying');
    await this.whenReady();
    const mirror = this._mirror();
    if (mirror) {
      if (!mirror.repl?.scheduler?.started) {
        await mirror.toggle();
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
    this.innerHTML = '<!-- ' + tidal_code + ' -->';
    this.connectedCallback();
  }

  getCode() {
    return this._extractCode();
  }

  async setCsound(csound_) {
    await this.whenReady();
    if (!this.i_frame?.contentWindow) return;
    this.i_frame.contentWindow.csound = csound_;
    this.i_frame.contentWindow.__csound__ = csound_;
  }

  async setCsoundAC(csoundac_) {
    await this.whenReady();
    if (!this.i_frame?.contentWindow) return;
    if (!csoundac_) {
      csoundac_ = await get_csound_ac();
    }
    this.i_frame.contentWindow.csoundac = csoundac_;
    this.i_frame.contentWindow.__csoundac__ = csoundac_;
  }

  setParameters(parameters_) {
    if (!this.i_frame?.contentWindow) return;
    this.i_frame.contentWindow.__parameters__ = parameters_;
  }
}

customElements.define('strudel-repl-component', StrudelReplComponent);
