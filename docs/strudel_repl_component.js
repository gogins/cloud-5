class StrudelReplComponent extends HTMLElement {
  constructor() {
    super();
      this.csound = null;
  }
  connectedCallback() {
    setTimeout(() => {
      const code = (this.innerHTML + '').replace('<!--', '').replace('-->', '').trim();
      const iframe = document.createElement('iframe');
         origin = location.origin;
        console.log("origin: ", origin);
      const src = `${location.origin}/#${encodeURIComponent(btoa(code))}`;
      iframe.setAttribute('src', src);
      iframe.setAttribute('width', '600');
      iframe.setAttribute('height', '400');
      this.appendChild(iframe);
    });
  }
  startRepl() {
      console.log("StrudelReplComponent.startRepl:");
  }
  stopRepl() {
       console.log("StrudelReplComponent.stopRepl:");
  }
  updateRepl() {
      console.log("StrudelReplComponent.updateRepl:");
  }
  setCsound(csound_) {
      console.log("StrudelReplComponent.setCsound:");
    this.csound = csound_;
      // Wire up the Csound output.
  }
  getCsound() {
      console.log("StrudelReplComponent.getCsound:");
    return this.csound;
  }
}

customElements.define('strudel-repl-component', StrudelReplComponent);
