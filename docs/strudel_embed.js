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
      iframe.setAttribute('width', '800');
      iframe.setAttribute('height', '600');
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
      console.log("location.origin: ", location.origin);
      // Fix up the "home" part of the URI to work with my version of Strudel's REPL.
      // We need to find the part of the pathname in between the origin 
      // and the file name, and insert that into the request URI.
      let src;
      let last_slash = location.href.lastIndexOf("/");
      if (last_slash > origin.length) {
        let to_insert = location.href.substring(origin.length, last_slash);
        src = `${location.origin}${to_insert}/strudel_repl.html#${encodeURIComponent(btoa(code))}`;
      } else {
        src = `${location.origin}/strudel_repl.html#${encodeURIComponent(btoa(code))}`;
      }
      console.log("src:", src);
      iframe.setAttribute('src', src);
      iframe.setAttribute('allow-same-origin', '');
      iframe.setAttribute('allowfullscreen', '');
      this.appendChild(iframe);
      iframe.setAttribute('width', '800px');
      iframe.setAttribute('height', '600px');
      iframe.style.display = "visible";
      this.i_frame = iframe;
    });
  }
  startPlaying() {
    console.log("StrudelReplComponent.startPlaying:");
    this.buttons = this.i_frame.contentDocument.getElementsByTagName("button");
    // TODO: Remove dependency on jQuery and find a reliable method of 
    // obtaining the buttons.
    if ($(this.buttons[0]).text() == "play") {
        $(this.buttons[0]).click();
    }
  }
  stopPlaying() {
    console.log("StrudelReplComponent.stopPlaying:");
    this.buttons = this.i_frame.contentDocument.getElementsByTagName("button");
    // TODO: Remove dependency on jQuery and find a reliable method of 
    // obtaining the buttons.
    if ($(this.buttons[0]).text() == "stop") {
        $(this.buttons[0]).click();
    }
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
    // Fix up the "home" part of the URI to work with Strudel's REPL.
    // We need to find the part of the pathname in between the origin 
    // and the file name, and insert that into the request URI.
    let src;
    let last_slash = location.href.lastIndexOf("/");
    if (last_slash > origin.length) {
    let to_insert = location.href.substring(origin.length, last_slash);
    src = `${location.origin}/${to_insert}#${encodeURIComponent(btoa(tidal_code))}`;
    } else {
    src = `${location.origin}#${encodeURIComponent(btoa(tidal_code))}`;
    }
    console.log("src:", src);
    iframe.setAttribute('src', src);
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
