class Strudel extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    setTimeout(() => {
      const code = (this.innerHTML + '').replace('<!--', '').replace('-->', '').trim();
      const iframe = document.createElement('iframe');
      const src = `https://strudel.tidalcycles.org/#${encodeURIComponent(btoa(code))}`;
      // const src = `http://localhost:3000/#${encodeURIComponent(btoa(code))}`;
      iframe.setAttribute('src', src);
      iframe.setAttribute('width', '600');
      iframe.setAttribute('height', '400');
      this.appendChild(iframe);
    });
  }
}
customElements.define('strudel-repl', Strudel);

/**
 * This class embeds the Strudel REPL in an IFrame with a (basic) API so that 
 * the host of the IFrame can programmatically control Strudel.
 */
class StrudelReplComponent extends HTMLElement {
  constructor() {
    super();
      this.play_button = null;
      this.update_button = null;
      this.i_frame = null;
  }
  connectedCallback() {
    setTimeout(() => {
      const code = (this.innerHTML + '').replace('<!--', '').replace('-->', '').trim();
      let iframe = document.createElement('iframe');

      origin = location.origin;
      console.log("origin: ", origin);
      const src = `${location.origin}/cloud-music#${encodeURIComponent(btoa(code))}`;
      console.log("src:", src);
      iframe.setAttribute('src', src);
      iframe.setAttribute('width', '800');
      iframe.setAttribute('height', '600');
      iframe.setAttribute('allow-same-origin', '');
      iframe.setAttribute('allowfullscreen', '');
      this.appendChild(iframe);
      iframe.style.display = "visible";
      this.i_frame = iframe;
    });
  }
  show() {
    this.i_frame.contentDocument.getElementById("root").style.display="block";
  }
  hide() {
    this.i_frame.contentDocument.getElementById("root").style.display="none";
  }
  togglePlay() {
    console.log("StrudelReplComponent.togglePlay:");
    this.buttons = this.i_frame.contentDocument.getElementsByTagName("button");
    // TODO: Remove dependency on jQuery and find a reliable method of 
    // obtaining the buttons.
    $(this.buttons[0]).click();
  }
  updateRepl() {
    console.log("StrudelReplComponent.updateRepl:");
    this.buttons = this.i_frame.contentDocument.getElementsByTagName("BUTTON");
    $(this.buttons[1]).click();
  }
  setCode(tidal_code) {
    tidal_code = '<!-- ' + tidal_code + ' -->';
    this.innerHTML = tidal_code;
    const src = `${location.origin}#${encodeURIComponent(btoa(tidal_code))}`;
    this.i_frame.setAttribute('src', src);
  }
  getCode() {
    const code = (this.innerHTML + '').replace('<!--', '').replace('-->', '').trim();
    return code;
  }
  setCsound(csound_) {
    this.i_frame.contentWindow.__csound__ = csound_;
  }
}

customElements.define('strudel-repl-component', StrudelReplComponent);
