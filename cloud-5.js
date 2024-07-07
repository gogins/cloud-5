/**
 * This script defines custom HTML elements and supporting code for the 
 * cloud-5 system. Once a custom element is used in the body of a Web page, 
 * its DOM object can be obtained, and then not only DOM methods but also 
 * custom methods can be called.
 * 
 * In general, rather than subclassing these custom elements (although that 
 * is possible), users should define and set addon functions, code text, and 
 * other properties of the custom elements. All such user-defined properties 
 * have names ending in `_addon`.
 * 
 * To simplify both usage and maintenance, internal styles are usually not 
 * used. Default styles are defined in the csound-5.css cascading style sheet. 
 * These styles can be overridden by the user.
 * 
 * Usage:
 * 
 * 1. Include the csound-5.js and csound-5.css scripts in the Web page.
 * 2. Lay out and style the required custom elements as with any other HTNL 
 *    elements. The w3.css style sheet is used internally and should also be 
 *    included.
 * 3. In a script element of the Web page:
 *    a. Define addons as JavaScript variables.
 *    b. Obtain DOM objects from custom elements.
 *    c. Assign custom elements and addons to their respective properties.
 */

/**
 * Holds refernces to windows that must be closed on exit.
 */
globalThis.windows_to_close = [];

/**
 * Close all secondary windows on exit.
 */
window.addEventListener("beforeunload", (event) => {
  for (let window_to_close of globalThis.windows_to_close()) {
    try {
      window_to_close.close()
    } catch (ex) {
      console.warn(ex);
    }
  }
  globalThis.windows_to_close = [];
});

/**
 * Sets up the piece, and defines menu buttons. The user may assign the DOM 
 * objects of other cloud-5 elements to the `_overlay` properties. 
 */
class Cloud5Piece extends HTMLElement {
  constructor() {
    super();
    this.csound = null;
    this.csoundac = null;
  }
  #csound_code_addon = null;
  /**
    * May be assigned the text of a Csound .csd patch. If so, the Csound 
    * patch will be compiled and run for every performance.
    */
  set csound_code_addon(code) {
    this.#csound_code_addon = code;
  }
  get csound_code_addon() {
    return this.#csound_code_addon;
  }
  #shader_overlay = null;
  /**
  * May be assigned an instance of a cloud5-shader overlay. If so, 
  * the GLSL shader will run at all times, and will normally create the 
  * background for other overlays. The shader overlay may call 
  * addon functions either to visualize the audio of the performance, 
  * and/or to sample the video canvas to generate notes for performance by 
  * Csound.
  */
  set shader_overlay(shader) {
    this.#shader_overlay = shader;
    // Back reference for shader to access Csound, etc.
    shader.cloud5_piece = this;
    this.show(this.#shader_overlay);
  }
  get shader_overlay() {
    return this.#shader_overlay;
  }
  /**
   * May be assigned the URL of a Web page to implement HTML-based controls 
   * for the performance. This is normally used only if there is a secondary 
   * display to use for these controls, so that the primary display can become 
   * fullscreen. The resulting Web page can obtain a reference to this piece 
   * from its `window.opener`, which is the window that opens the HTML 
   * controls window, and the opener can be used to control all aspects of the 
   * piece.
   * 
   * For this to work the HTML controls and the piece must have the same 
   * origin.
   */
  html_controls_url_addon = null;
  /**
   * Stores a reference to the HTML controls window; this reference will be 
   * used to close the HTML controls window upon leaving fullscreen.
   */
  html_controls_window = null;
  #control_parameters_addon = null;
  /**
    * May be assigned a JavaScript object consisting of Csound control 
    * parameters, with default values. The naming convention must be global 
    * Csound variable type, underscore{ , Csound instrument name}, 
    * underscore, Csound control channel name. For example:
    * 
    * control_parameters_addon = {
    *  "gk_Duration_factor": 0.8682696259761612,
    *  "gk_Iterations": 4,
    *  "gk_MasterOutput_level": -2.383888203863542,
    *  "gk_Shimmer_wetDry": 0.06843403205918619
    * };
    *
    * The Csound orchestra should define matching control channels. Such 
    * parameters may also be used to control other processes.
    */
  set control_parameters_addon(parameters) {
    this.#control_parameters_addon = parameters;
  }
  get control_parameters_addon() {
    return this.#control_parameters_addon;
  }
  #score_generator_function_addon = null;
  /**
   * May be assigned a score generating function. If so, the score generator 
   * will be called for each performance, and must generate and return a 
   * CsoundAC Score, which will be translated to a Csound score in text 
   * format, appended to the Csound patch, displayed in the piano roll 
   * overlay, and played or rendered by Csound.
   */
  set score_generator_function_addon(score_generator_function) {
    this.#score_generator_function_addon = score_generator_function;
  }
  get score_generator_function_addon() {
    return this.#score_generator_function_addon;
  }
  #piano_roll_overlay = null;
  /**
   * May be assigned the DOM object of a <cloud5-piano-roll> element overlay. 
   * If so, the Score button will show or hide an animated, zoomable piano 
   * roll display of the generated CsoundAC Score.
   */
  set piano_roll_overlay(piano_roll) {
    this.#piano_roll_overlay = piano_roll;
    this.#piano_roll_overlay.cloud5_piece = this;
  }
  get piano_roll_overlay() {
    return this.#piano_roll_overlay;
  }
  /**
   * May be assigned the DOM object of a <cloud5-log> element overlay. If so, 
   * the Log button will show or hide a scrolling view of messages from Csound or 
   * other sources.
   */
  #log_overlay = null;
  #about_overlay = null;
  /**
   * May be assigned the DOM object of a <cloud5-about> element overlay. If 
   * so, the About button will show or hide the overlay. The inner HTML of 
   * this element may contain license information, authorship, credits, 
   * program notes for the piece, or other information.
   */
  get about_overlay() {
    return this.#about_overlay;
  }
  set about_overlay(overlay) {
    this.#about_overlay = overlay;
  }
  /**
   * Called by Csound during performance, and prints the message to the 
   * scrolling text area of a <csound5-log> element overlay. This function may 
   * also be called by user code.
   * 
   * @param {string} message 
   */
  csound_message_callback = async function (message) {
    if (message === null) {
      return;
    }
    this.log_overlay?.log(message);
    let level_left = -100;
    let level_right = -100;
    if (non_csound(this.csound) == false) {
      let score_time = await this.csound.GetScoreTime();
      level_left = await this.csound.GetControlChannel("gk_MasterOutput_output_level_left");
      level_right = await this.csound.GetControlChannel("gk_MasterOutput_output_level_right");
      let delta = score_time;
      // calculate (and subtract) whole days
      let days = Math.floor(delta / 86400);
      delta -= days * 86400;
      // calculate (and subtract) whole hours
      let hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;
      // calculate (and subtract) whole minutes
      let minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;
      // what's left is seconds
      let seconds = delta % 60;  // in theory the modulus is not required
      if (level_left > 0) {
        $("#vu_meter_left").css("color", "red");
      } else if (level_left > -12) {
        $("#vu_meter_left").css("color", "orange")
      } else {
        $("#vu_meter_left").css("color", "lightgreen");
      }
      if (level_right > 0) {
        $("#vu_meter_right").css("color", "red");
      } else if (level_right > -12) {
        $("#vu_meter_right").css("color", "orange")
      } else {
        $("#vu_meter_right").css("color", "lightgreen");
      }
      $("#mini_console").html(sprintf("d:%4d h:%02d m:%02d s:%06.3f", days, hours, minutes, seconds));
      $("#vu_meter_left").html(sprintf("L%+7.1f dBA", level_right));
      $("#vu_meter_right").html(sprintf("R%+7.1f dBA", level_right));
    };
  }
  /**
   * A convenience function for printing the message in the 
   * scrolling <csound5-log> element overlay.
   * @param {string} message 
   */
  log(message) {
    this.csound_message_callback(message);
  }
  /**
    * Metadata to be written to output files. The user may assign 
    * values to any of these fields.
    */
  metadata = {
    "artist": null,
    "copyright": null,
    "performer": null,
    "title": null,
    "album": null,
    "track": null,
    "tracknumber": null,
    "date": null,
    "publisher": null,
    "comment": null,
    "license": null,
    "genre": null,
  };
  connectedCallback() {
    this.innerHTML = `
    <div class="w3-bar" id="main_menu" style="position:fixed;background:transparent;z-index:1000;">
    <ul class="menu">
        <li id="menu_item_play" title="Play piece on system audio output" class="w3-btn w3-hover-text-light-green">
            Play</li>
        <li id="menu_item_render" title="Render piece to soundfile" class="w3-btn w3-hover-text-light-green">Render
        </li>
        <li id="menu_item_record" title="Record live audio to soundfile" class="w3-btn w3-hover-text-light-green">Record</li>
        <li id="menu_item_stop" title="Stop performance" class="w3-btn w3-hover-text-light-green">Stop</li>
        <li id="menu_item_fullscreen" class="w3-btn w3-hover-text-light-green">Fullscreen</li>
        <li id="menu_item_strudel" class="w3-btn w3-hover-text-light-green" style="display:none;">Strudel</li>
        <li id="menu_item_piano_roll" title="Show/hide piano roll score" class="w3-btn w3-hover-text-light-green" style="display:none;">Score
        </li>
        <li id="menu_item_log" title="Show/hide message log" class="w3-btn w3-hover-text-light-green">Log
        </li>
        <li id="menu_item_about" title="Show/hide information about this piece"
            class="w3-btn w3-hover-text-light-green">About</li>
        <li id="mini_console" class="w3-btn w3-text-green w3-hover-text-light-green"></li>
        <li id="vu_meter_left" class="w3-btn w3-hover-text-light-green"></li>
        <li id="vu_meter_right" class="w3-btn w3-hover-text-light-green"></li>
        <li id="menu_item_dat_gui"
            title="Show/hide performance controls; 'Save' copies all control parameters to system clipboard"
            class="w3-btn w3-left-align w3-hover-text-light-green w3-right"></li>
      </ul>
    </div>`;
    this.vu_meter_left = document.querySelector("#vu_mter_left");
    this.vu_meter_right = document.querySelector("#vu_mter_right");
    this.mini_console = document.querySelector("#mini_console");
    let menu_item_play = document.querySelector('#menu_item_play');
    menu_item_play.onclick = ((event) => {
      console.info("menu_item_play click...");
      this.show(this.piano_roll_overlay)
      // this.hide(this.strudel_overlay);
      // this.hide(this.shader_overlay);
      this.hide(this.log_overlay);
      this.hide(this.about_overlay);
      (() => this.render(false))();
    });
    let menu_item_render = document.querySelector('#menu_item_render');
    menu_item_render.onclick = ((event) => {
      console.info("menu_item_render click...");
      this.show(this.piano_roll_overlay)
      this.hide(this.strudel_overlay);
      // this.hide(this.shader_overlay);
      this.hide(this.log_overlay);
      this.hide(this.about_overlay);
      (() => this.render(true))();
    });
    let menu_item_record = document.querySelector('#menu_item_record');
    menu_item_record.onclick = ((event) => {
      this.log("menu_item_record click...\n");
      // Start recording if not already recording, 
      // stop recording if already recording.
      if (menu_item_record.innerText == "Record") {
        this.csound.SetControlChannel("gk_record", 1);
        menu_item_record.innerText = "Pause";
        this.log("Csound has started recording...\n");
      } else {
        this.csound.SetControlChannel("gk_record", 0);
        menu_item_record.innerText = "Record";
        this.log("Csound has stopped recording.\n");
        let soundefile_url = url_for_soundfile(this.csound);
      }
    });
    let menu_item_stop = document.querySelector('#menu_item_stop');
    menu_item_stop.onclick = ((event) => {
      console.info("menu_item_stop click...");
      this.stop();
    });
    let menu_item_fullscreen = document.querySelector('#menu_item_fullscreen');
    menu_item_fullscreen.onclick = (async (event) => {
      console.info("menu_item_fullscreen click...");
      try {
        if (this.#shader_overlay?.canvas?.requestFullscreen) {
          let new_window = null;
          // Make the shader canvas fullscreen in the primary window.
          await this.#shader_overlay.canvas.requestFullscreen();
          // Try to make the HTML controls, if available, fullscreen 
          // in the secondary window.
          const secondary_screen = (await getScreenDetails()).screens.find(
            (screen) => screen.isExtended,
          );
          if (secondary_screen && this?.html_controls_url_addon) {
            let permissions_granted = false;
            const { state } = await navigator.permissions.query({ name: 'window-management' });
            if (state === 'granted') {
              permissions_granted = true;
            }
          }
          const url = window.location.origin + this?.html_controls_url_addon;
          const window_features = `top=${secondary_screen.availTop}, left=${secondary_screen.availLeft}, width=${secondary_screen.availWidth}, height=${secondary_screen.availHeight}`;
          let opened_window = window.open(url, 'HTMLControls', window_features);
          if (!opened_window || opened_window.closed || typeof opened_window.closed == 'undefined') {
            alert("Your browser is blocking popups. Please allow popups and redirects in the browser settings for this Web site.")
            return;
          } else {
            this.html_controls_window = opened_window;
          }
          globalThis.windows_to_close.push(this.html_controls_window);
          if (this.html_controls_window) {
            // These will pile up and that would be a problem... if users 
            // repeatedly toggled fullscreen.
            window.addEventListener("fullscreenchange", (event) => {
              if (document.fullscreenElement) {
              } else {
                this.html_controls_window.close();
                (value) => {
                  globalThis.windows_to_close = globalThis.windows_to_close.filter(function (ele) {
                    return ele != value;
                  });
                }
              }
            });
          }
        }
      } catch (ex) {
        alert(ex.message + "\nIn the browser's 'Site permissions' for this Web site, set 'Pop-ups and redirects' to 'Allow' and 'Window management' to 'Allow'.");
      };
    });
    let menu_item_strudel = document.querySelector('#menu_item_strudel');
    menu_item_strudel.onclick = ((event) => {
      console.info("menu_item_strudel click...");
      //this.hide(this.piano_roll_overlay)
      this.toggle(this.strudel_overlay);
      // this.hide(this.shader_overlay);
      // this.hide(this.log_overlay);
      this.hide(this.about_overlay);
    });
    let menu_item_piano_roll = document.querySelector('#menu_item_piano_roll');
    menu_item_piano_roll.onclick = ((evemt) => {
      console.info("menu_item_piano_roll click...");
      this.toggle(this.piano_roll_overlay)
      //this.hide(this.strudel_overlay);
      // this.hide(this.shader_overlay);
      // this.hide(this.log_overlay);
      this.hide(this.about_overlay);
    });
    let menu_item_log = document.querySelector('#menu_item_log');
    menu_item_log.onclick = ((event) => {
      console.info("menu_item_log click...");
      //this.show(this.piano_roll_overlay)
      //this.hide(this.strudel_overlay);
      //this.hide(this.shader_overlay);
      this.toggle(this.log_overlay);
      this.hide(this.about_overlay);
    });
    let menu_item_about = document.querySelector('#menu_item_about');
    menu_item_about.onclick = ((event) => {
      console.info("menu_item_about click...");
      this.hide(this.piano_roll_overlay)
      this.hide(this.strudel_overlay);
      ///this.hide(this.shader_overlay);
      this.hide(this.log_overlay);
      this.toggle(this.about_overlay);
      this.strudel_component?.focus(true);
    });
    // Ensure that the dat.gui controls are children of the _Controls_ button.
    let dat_gui_parameters = { autoPlace: false, closeOnTop: true, closed: true, width: 400, useLocalStorage: false };
    this.gui = new dat.GUI(dat_gui_parameters);
    let dat_gui = document.getElementById('menu_item_dat_gui');
    dat_gui.appendChild(this.gui.domElement);
    document.onkeydown = ((e) => {
      let e_char = String.fromCharCode(e.keyCode || e.charCode);
      if (e.ctrlKey === true) {
        if (e_char === 'H') {
          let console = document.getElementById("console");
          if (console.style.display === "none") {
            console.style.display = "block";
          } else {
            console.style.display = "none";
          }
          this.gui.closed = true;
          gui.closed = false;
        } else if (e_char === 'G') {
          this.score_generator_function_addon();
        } else if (e_char === 'P') {
          this.play();
        } else if (e_char === 'S') {
          this.stop();
        } else if (e_char === 'C') {
          this?.piano_roll_overlay.recenter();
        }
      }
    });
    this.show(this.shader_overlay);
    window.addEventListener('load', function (event) {
      const save_button = this.gui.domElement.querySelector('span.button.save');
      save_button.addEventListener('click', function (event) {
        this.copy_parameters()
      }.bind(this));
    }.bind(this));
    window.addEventListener("unload", function (event) {
      nw_window?.close();
    });
  }

  /**
    * Copies all _current_ dat.gui parameters to the system clipboard in 
    * JSON format.
    * 
    * @param {Object} parameters A dictionary containing the current state of all 
    * controls; keys are control parameter names, values are control parameter 
    * values. This can be pasted from the clipboard it source code, as a 
    * convenient method of updating a piece with parameters that have been tweaked 
    * during performance.
    */
  copy_parameters() {
    const json_text = JSON.stringify(this?.control_parameters_addon, null, 4);
    navigator.clipboard.writeText(json_text);
    /// console.info("Copied all control parameters to system clipboard.\n")
    this?.csound.Message("Copied all control parameters to system clipboard.\n")
  }

  /**
   * @function render
   * 
   * @memberof Cloud5Piece
   * 
   * @description Invokes Csound and/or Strudel to perform music, by default to 
   * the audio output interface, but optionally to a local soundfile. Acts as an 
   * async member function because it is bound to this.
   * 
   * @param {Boolean} is_offline If true, renders to a local soundfile.
   */
  render = async function (is_offline) {
    this.csound = await get_csound((message) => this.csound_message_callback(message));
    if (non_csound(this.csound)) {
      return;
    }
    this?.log_overlay.clear();
    this.csoundac = await createCsoundAC();
    for (const key in this.metadata) {
      const value = this.metadata[key];
      if (value !== null) {
        // CsoundAudioNode does not have the metadata facility.
        this.csound?.setMetadata(key, value);
      }
    }
    let csd;
    csd = this.csound_code_addon.slice();
    if (this.score_generator_function_addon) {
      let score = await this.score_generator_function_addon();
      if (score) {
        let csound_score = await score.getCsoundScore(12., false);
        csound_score = csound_score.concat("\n</CsScore>");
        csd = this.csound_code_addon.replace("</CsScore>", csound_score);
      }
    }
    if (is_offline == true) {
      csd = csd.replace("-odac", "-o" + document.title + ".wav");
    }
    // Save the .csd file so we can debug a failing orchestra,
    // instead of it just nullifying Csound.        
    const csd_filename = document.title + '-generated.csd';
    write_file(csd_filename, csd);
    try {
      let result = await this.csound.CompileCsdText(csd);
      this.csound_message_callback("CompileCsdText returned: " + result + "\n");
    } catch (e) {
      alert(e);
    }
    await this.csound.Start();
    // Send _current_ dat.gui parameter values to Csound 
    // before actually performing.
    this.send_parameters(this.control_parameters_addon);
    this.csound_message_callback("Csound has started...\n");
    if (is_offline == false) {
      await this.csound.Perform();
      if (typeof strudel_view !== 'undefined') {
        if (strudel_view !== null) {
          console.info("strudel_view:", this.strudel_view);
          strudel_view?.setCsound(this.csound);
          strudel_view?.setCsoundAC(this.csoundac);
          strudel_view?.setParameters(this.control_parameters_addon);
          strudel_view?.startPlaying();
        }
      }
    } else {
      // Returns before finishing because Csound will perform in a separate 
      // thread.
      await this.csound.performAndPostProcess();
    }
    this?.piano_roll_overlay?.trackScoreTime();
    this?.csound_message_callback("Csound is playing...\n");
  }
  /**
   * Stops Csound and Strudel from performing.
   */
  stop = async function () {
    this.piano_roll_overlay?.stop();
    await this.csound.Stop();
    await this.csound.Cleanup();
    this.csound.Reset();
    this.strudel_view?.stopPlaying();
    this.csound_message_callback("Csound has stopped.\n");
  };
  /**
   * Helper function to show custom element overlays.
   * 
   * @param {Object} overlay 
   */
  show(overlay) {
    if (overlay) {
      overlay.style.display = 'block';
    }
  }
  /**
   * Helper function to hide custom element overlays.
   * 
   * @param {Object} overlay 
   */
  hide(overlay) {
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
  /**
   * Helper function to show the overlay if it is 
   * hidden, or to hide the overlay if it is visible
   * 
   * @param {Object} overlay 
   */
  toggle(overlay) {
    if (overlay) {
      if (overlay.checkVisibility() == true) {
        this.hide(overlay);
      } else {
        this.show(overlay);
      }
    }
  }
  /**
   * Sends a dictionary of parameters to Csound at the start of performance. 
   * The keys are the literal Csound control channel names, and the values are 
   * the values of those channels.
   * 
   * @param {Object} parameters 
   */
  send_parameters(parameters) {
    if (non_csound(this.csound) == false) {
      this.csound.Message("Sending initial state of control perameters to Csound...\n")
      for (const [name, value] of Object.entries(parameters)) {
        this.csound.Message(name + ": " + value + "\n");
        this.csound.SetControlChannel(name, parseFloat(value));
      }
    }
  }
  /**
   * Adds a new folder to the Controls menu of the piece.
   * 
   * @param {string} name The name of the folder. 
   * @returns {Object} The new folder.
   */
  menu_folder_addon(name) {
    let folder = this.gui.addFolder(name);
    return folder;
  }
  /**
   * Adds a new slider to a folder of the Controls menu of the piece.
   * 
   * @param {Object} gui_folder The folder in which to place the slider.
   * @param {string} token The name of the slider, usually the name of a 
   * Csound message channel.
   * @param {number} minimum The minimum value of the slider (may be 
   * negative).
   * @param {number} maximum The maximum value of the slider.
   * @param {number} step An optional value for the granularity of values.
   */
  menu_slider_addon(gui_folder, token, minimum, maximum, step, name_) {
    const on_parameter_change = ((value) => {
      this.gk_update(token, value);
    });
    if (name_) {
      gui_folder.add(this.control_parameters_addon, token, minimum, maximum, step).name(name_).listen().onChange(on_parameter_change);
    } else {
      gui_folder.add(this.control_parameters_addon, token, minimum, maximum, step).listen().onChange(on_parameter_change);
    }
    // Remembers parameter values. Required for the 'Revert' button to 
    // work, and to be able to save/restore new presets.
    this.gui.remember(this.control_parameters_addon);
  }
  /**
   * Called by the browser when the user updates the value of a control in the 
   * Controls menu, and sends the update to the Csound control channel with 
   * the same name.
   * 
   * @param {string} name The literal name of the Csound control channel.
   * @param {number} value The current value of that channel.
   */
  gk_update(name, value) {
    const numberValue = parseFloat(value);
    console.info("gk_update: name: " + name + " value: " + numberValue);
    if (non_csound(this.csound) == false) {
      this.csound.SetControlChannel(name, numberValue);
    }
  }
  /**
   * Adds a user-defined onclick handler function to the Controls menu of the 
   * piece.
   * 
   * @param {Object} control_parameters_addon Dictionary containing all control parameters.
   * @param {Object} gui_folder The folder to which the command will be added.
   * @param {string} name The name of the command.
   * @param {Function} onclick User-defined function to execute the command.
   */
  menu_add_command(control_parameters_addon, gui_folder, name, onclick) {
    control_parameters_addon['name'] = onclick;
    gui_folder.add(this.control_parameters_addon, name)
  }
}
customElements.define("cloud5-piece", Cloud5Piece);

/**
 * Displays a CsoundAC Score as a 3-dimensional piano roll. During 
 * performance, a moving red ball indicates the current position of 
 * the performance in the score. The user may use the trackball 
 * to zoom in or out of the score, to drag it, or to spin it around.
 */
class Cloud5PianoRoll extends HTMLElement {
  constructor() {
    super();
    this.cloud5_piece = null;
    this.silencio_score = new Silencio.Score();
    this.csoundac_score = null;
    this.canvas = null;
    this.interval_id = null;
  }
  connectedCallback() {
    this.innerHTML = `
     <canvas id="display" class="cloud5-score-canvas">
    `;
    this.canvas = this.querySelector('#display');
    if (this.csoundac_score !== null) {
      this.draw(this.csoundac_score);
    }
    let menu_button = document.getElementById("menu_item_piano_roll");
    menu_button.style.display = 'inline';
  }
  /**
   * Called by the browser to update the display of the Score. It is 
   * translated to a Silencio.Score object, which is what is actually 
   * displayed.
   * 
   * @param {CsoundAC.Score} score A generated CsoundAC.Score object.
   */
  draw_csoundac_score(score) {
    this.silencio_score = new Silencio.Score();
    let i;
    let n = score.size();
    for (i = 0; i < n; ++i) {
      let event = score.get(i);
      let p0_time = event.getTime();
      let p1_duration = event.getDuration();
      let p2_status = event.getStatus();
      let p3_channel = event.getChannel();
      let p4_key = event.getKey();
      let p5_velocity = event.getVelocity();
      let p6_x = event.getHeight();
      let p7_y = event.getPan();
      let p8_z = event.getDepth();
      let p9_phase = event.getPhase();
      this.silencio_score.add(p0_time, p1_duration, p2_status, p3_channel, p4_key, p5_velocity, p6_x, p7_y, p8_z, p9_phase);
    }
    this.draw_silencio_score(this.silencio_score);
  }
  /**
   * A updates the WebGL display of the generated Silencio Score object.
   * 
   * @param {Silencio.Score} score 
   */
  draw_silencio_score(score) {
    this.silencio_score = score;
    this.silencio_score.draw3D(this.canvas);
  }
  /**
   * Called by a timer during performance to update the play 
   * position in the piano roll display.
   */
  trackScoreTime() {
    if (non_csound(this?.cloud5_piece?.csound)) {
      return;
    }
    let interval_callback = async function () {
      let score_time = await this?.cloud5_piece?.csound?.GetScoreTime();
      this?.silencio_score.progress3D(score_time);
    };
    let bound_interval_callback = interval_callback.bind(this);
    this.interval_id = setInterval(bound_interval_callback, 200);
  }
  /**
   * Stops the timer that is updating the play position of the score.
   */
  stop() {
    clearInterval(this.interval_id);
  }
  recenter() {
    this.silencio_score.lookAtFullScore3D();
  }
}
customElements.define("cloud5-piano-roll", Cloud5PianoRoll);

/**
 * Contains an instance of the Strudel REPL that can use Csound as an output,
 * and that starts and stops along wth Csound.
 */
class Cloud5Strudel extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
    <strudel-repl-component id="strudel_view" class='cloud5-strudel-repl' style='position:fixed;z-index:4001;'>
        <!--
        ${this.#strudel_code_addon}
        -->
    </strudel-repl-component>
    `;
    this.strudel_component = this.querySelector('#strudel_view');
    this.strudel_component.addEventListener("focusout", (event) => {
      console.log("strudel_component lost focus.");
    });

    let menu_button = document.getElementById("menu_item_strudel");
    menu_button.style.display = 'inline';
  }
  /**
   * Starts the Strudel performance loop (the Cyclist).
   */
  start() {
    this.strudel_component.startPlaying();

  }
  /**
   * Stops the Strudel performance loop (the Cyclist).
   */
  stop() {
    this.strudel_component.stopPlaying();

  }
  #strudel_code_addon = null;
  /**
    * Contains the text of a user-defined Strudel patch, exactly as would 
    * normally be entered by the user in the Strudel REPL. This patch may 
    * also import and reference modules defined by the cloud-5 system, such 
    * as statefulpatterns.mjs or csoundac.js.
    */
  set strudel_code_addon(code) {
    this.#strudel_code_addon = code;
    // Reconstruct the element.
    this.connectedCallback();
  }
  get strudel_code_addon() {
    return this.#strudel_code_addon;
  }
  #control_parameters_addon = null;
  /**
    * Gets or sets optional control parameters.
    */
  set control_parameters_addon(parameters_) {
    this.#control_parameters_addon = parameters_;
    globalThis.parameters = parameters_;
    // Reconstruct the element.
    this.connectedCallback();
  }
  get control_parameters_addon() {
    return this.#control_parameters_addon;
  }
}
customElements.define("cloud5-strudel", Cloud5Strudel);

/**
 * Presents visuals generated by a GLSL shader. These visuals can show a 
 * visualization of the music, or be sampled to generate notes for Csound to 
 * perform.
 * 
 * The SWSS glsl function accepts a dictionary of parameters, documented 
 * here: https://github.com/google/swissgl/blob/main/docs/API.md. The most 
 * often used of these parameters have setters in this class.
 */
class Cloud5Shader extends HTMLElement {
  constructor() {
    super();
    /**
     * The user may define a vertex shader in GLSL code for generating 
     * visuals, and assign a string containing the code to this property.
     */
    this.glsl_parameters = {};
    /**
     * The user may define a function that will be called at intervals to 
     * receive a real-time FFT analysis of the audio; the function should 
     * downsample and/or otherwise process the analysis to generate CsoundAC 
     * Notes, which must be returned in a CsoundAC Score. The user-defined 
     * function must be assigned to this property.
     */
    this.shader_sampler_hook = null;
    /**
     * The user may define a function that will be called at intervals to 
     * receive an FFT analysis of the performance; the function should use 
     * these to compute GLSL uniforms that will in some way control the 
     * appearance and behavior of the shader visuals. The user-defined 
     * function must be assigned to this property.
     */
    this.audio_visualizer_hook = null;
  }
  /**
    * Called by the browser whenever this element is added to the document.
    */
  connectedCallback() {
    this.canvas = document.createElement('canvas');
    this.appendChild(this.canvas);
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.margin_top = '40px';
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    //this.canvas.style.zIndex = '0';
    this.glsl = SwissGL(this.canvas);
    this.slowdown = 1000;
  }
  #shader_parameters_addon = null;
  /** 
   * Several objects must be defined at the same time before creating the 
   * shader. These objects are passed in these options. */
  set shader_parameters_addon(options) {
    this.#shader_parameters_addon = options;
    this.glsl = SwissGL(this.canvas);
    let render = ((t) => {
      t /= 1000;
      this.glsl({ ...this.#shader_parameters_addon, t });
      requestAnimationFrame(render);
    });
    requestAnimationFrame(render);
  }
  get shader_parameters_addon() {
    return this.#shader_parameters_addon;
  }
  #cloud5_piece = null;
  /**
    * Back reference to the piece, which can be used e.g. to get a reference to 
    * Csound.
    */
  set cloud5_piece(piece) {
    this.#cloud5_piece = piece;
  }
  get cloud5_piece() {
    return this.#cloud5_piece;
  }
}
customElements.define("cloud5-shader", Cloud5Shader);

/**
 * Presents visuals generated by a GLSL shader. These visuals can show a 
 * visualization of the music, or be sampled to generate notes for Csound to 
 * perform.
 * 
 * This class is specifically designed to simplify the use of shaders 
 * developed in or adapted from the ShaderToy Web site. Other types of shader 
 * also can be used.
 */
class Cloud5ShaderToy extends HTMLElement {
  gl = null;
  shader_program = null;
  vertex_shader = `#version 300 es
  in vec2 inPos;
  void main() {
      gl_Position = vec4(inPos.xy, 0.0, 1.0);
  }`;
  analyser = null;
  uniforms = {};
  uniform_locations = {};
  attributes = null;
  set_uniforms = null;
  get_attributes = null;
  frequency_domain_data = null;
  time_domain_data = null;
  image_sample_buffer = null;
  channel0_texture_unit = null;
  channel0_texture = null;
  channel0_sampler = null;
  current_events = {};
  prior_events = {};
  rendering_frame = 0;
  image_sample_buffer = null;
  prior_image_sample_buffer = null;
  vertex_shader_code_addon = `#version 300 es
  in vec2 inPos;
  void main() {
      gl_Position = vec4(inPos.xy, 0.0, 1.0);
  }
  `;
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
     <canvas id="display" class="cloud5-shader-canvas">
    `;
    this.canvas = this.querySelector('#display');
  }
  #cloud5_piece = null;
  /**
   * Back reference to the piece, which can be used e.g. to get a reference to 
   * Csound.
   */
  set cloud5_piece(piece) {
    this.#cloud5_piece = piece;
  }
  get cloud5_piece() {
    return this.#cloud5_piece;
  }
  #shader_parameters_addon = null;
  /**
   * A number of parameters must be up to date at the same time before the 
   * shader program can be compiled. These are passed to this property in an 
   * object, upon which the shader is compiled and begins to run. The 
   * paramameters are:
   * <pre>
   * {
   *  fragment_shader_addon: code,    \\ Required GLSL code.
   *  vertex_shader_addon: code,      \\ Has a default value, but may be 
   *                                  \\ overridden with custom GLSL code.
   *  pre_draw_frame_function_addon,  \\ Optional JavaScript function to be 
   *                                  \\ caalled in the animation loop before 
   *                                  \\ drawing each frame, e.g. for setting 
   *                                  \\ program uniforms.
   *  post_draw_frame_function_addon, \\ Optional JavaScript function to called 
   *                                  \\ the animation loop immediately after 
   *                                  \\ drawing each frame, e.g. for getting 
   *                                  \\ attributes or reading buffers.                
   * }
   * </pre>
   */
  set shader_parameters_addon(shader_parameters) {
    this.#shader_parameters_addon = shader_parameters;
    this.create_shader();
  }
  get shader_parameters_addon() {
    return this.#shader_parameters_addon;
  }
  /**
   * Compiles the shader program, and starts rendering the shader.
   */
  create_shader() {
    // Assign parameters fields to this.
    if (this.#shader_parameters_addon.vertex_shader_code_addon) {
      this.vertex_shader_code_addon = this.#shader_parameters_addon.vertex_shader_code_addon;
    }
    this.fragment_shader_code_addon = this.#shader_parameters_addon.fragment_shader_code_addon;
    this.pre_draw_frame_function_addon = this.#shader_parameters_addon.pre_draw_frame_function_addon;
    this.post_draw_frame_function_addon = this.#shader_parameters_addon.post_draw_frame_function_addon;
    this.prepare_canvas();
    this.compile_shader();
    this.get_uniforms();
    this?.set_attributes();
    requestAnimationFrame((milliseconds) => this.render_frame(milliseconds));
  }
  /**
   * Called by the browser when the element is resized.
   */
  resize() {
    this.webgl_viewport_size = [window.innerWidth, window.innerHeight];
    this.canvas.width = this.webgl_viewport_size[0] * window.devicePixelRatio;
    this.canvas.height = this.webgl_viewport_size[1] * window.devicePixelRatio;
    this.image_sample_buffer = new Uint8ClampedArray(this.canvas.width * 4);
    this.prior_image_sample_buffer = new Uint8ClampedArray(this.canvas.width * 4);
    console.info("resize: image_sample_buffer.length: " + this.image_sample_buffer.length);
  }
  /**
   * Prepares the element's canvas for use by WebGL.
   */
  prepare_canvas() {
    // Set up for high-resolution displays.
    let devicePixelRatio_ = window.devicePixelRatio || 1
    this.canvas.width = this.canvas.clientWidth * devicePixelRatio_;
    this.canvas.height = this.canvas.clientHeight * devicePixelRatio_;
    console.info("canvas.height: " + this.canvas.height);
    console.info("canvas.width:  " + this.canvas.width);
    this.gl = this.canvas.getContext("webgl2", { antialias: true });
    if (!this.gl) {
      alert("Could not create webgl2 context.");
    }
    let extensions = this.gl.getSupportedExtensions();
    console.info("Supported extensions:\n" + extensions);
    if ("gpu" in navigator) {
      var gpu_adapter = navigator.gpu.requestAdapter();
      console.info("WebGPU adapter: " + gpu_adapter);
    } else {
      console.warn("WebGPU is not available on this platform.");
    }
    var EXT_color_buffer_float = this.gl.getExtension("EXT_color_buffer_float");
    if (!EXT_color_buffer_float) {
      alert("EXT_color_buffer_float is not available on this platform.");
    }
    this.mouse_position = [0, 0, 0, 0];
    this.canvas.addEventListener('mousemove', ((e) => {
      this.mouse_position = [e.clientX, e.clientY];
    }));
    this.audio_texture_level = 0;
    this.audio_texture_internalFormat = this.gl.R32F;
    this.audio_texture_width = 512;
    this.audio_texture_height = 2;
    this.audio_texture_border = 0;
    this.audio_texture_srcFormat = this.gl.RED;
    this.audio_texture_srcType = this.gl.FLOAT;
    this.frequency_domain_data = new Uint8Array(this.audio_texture_width * 2);
    this.time_domain_data = new Uint8Array(this.audio_texture_width * 2);
    this.audio_data = new Float32Array(this.audio_texture_width * 2);
    this.image_sample_buffer = new Uint8ClampedArray();
    this.channel0_texture_unit = 0;
    this.channel0_texture = this.gl.createTexture();
    this.channel0_texture.name = "channel0_texture";
    this.channel0_sampler = this.gl.createSampler();
    this.channel0_sampler.name = "channel0_sampler";
    this.current_events = {};
    this.prior_events = {};
    this.rendering_frame = 0;
    this.midpoint = this.audio_texture_width / 2;
  }

  write_audio_texture(analyser, texture_unit, texture, sampler) {
    if (analyser != null) {
      analyser.getByteFrequencyData(this.frequency_domain_data);
      analyser.getByteTimeDomainData(this.time_domain_data);
      for (let i = 0; i < this.audio_texture_width; ++i) {
        // Map frequency domain magnitudes to [0, 1].
        let sample = this.frequency_domain_data[i];
        sample = sample / 255.;
        this.audio_data[i] = sample;
      }
      this.audio_data_width = this.audio_texture_width * 2;
      for (let j = 0; j < this.audio_texture_width; ++j) {
        // Map time domain amplitudes to [-1, 1].
        let sample = this.time_domain_data[j];
        sample = sample / 255.;
        this.audio_data[this.audio_texture_width + j] = sample;
      }
    }
    this.gl.activeTexture(this.gl.TEXTURE0 + texture_unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.bindSampler(texture_unit, sampler);
    this.gl.texImage2D(this.gl.TEXTURE_2D,
      this.audio_texture_level,
      this.audio_texture_internalFormat,
      this.audio_texture_width,
      this.audio_texture_height,
      this.audio_texture_border,
      this.audio_texture_srcFormat,
      this.audio_texture_srcType,
      this.audio_data);
    this.gl.samplerParameteri(sampler, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.samplerParameteri(sampler, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.samplerParameteri(sampler, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.samplerParameteri(sampler, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.samplerParameteri(sampler, this.gl.TEXTURE_WRAP_R, this.gl.CLAMP_TO_EDGE);
    this.gl.samplerParameteri(sampler, this.gl.TEXTURE_COMPARE_MODE, this.gl.NONE);
    this.gl.samplerParameteri(sampler, this.gl.TEXTURE_COMPARE_FUNC, this.gl.LEQUAL);
    if (false && analyser) { // For debugging.
      let is_texture = gl.isTexture(texture);
      let uniform_count = gl.getProgramParameter(shader_program, gl.ACTIVE_UNIFORMS);
      let uniform_index;
      for (let uniform_index = 0; uniform_index < uniform_count; ++uniform_index) {
        uniform_info = gl.getActiveUniform(shader_program, uniform_index);
        console.log(uniform_info);
        const location = gl.getUniformLocation(shader_program, uniform_info.name);
        const value = gl.getUniform(shader_program, location);
        console.log("Uniform location: " + location);
        console.log("Uniform value: " + value);
      }
      const unit = gl.getUniform(shader_program, shader_program.iChannel0);
      console.log("Sampler texture unit: " + unit);
      console.log("Texture unit: " + texture_unit);
      gl.activeTexture(gl.TEXTURE0 + texture_unit);
      let texture2D = gl.getParameter(gl.TEXTURE_BINDING_2D);
      console.log("Texture binding 2D " + texture2D);
      var debug_framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, debug_framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2D, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        console.log("These attachments don't work.");
      }
      // Read the contents of the debug_framebuffer (data stores the pixel data).
      var data = new Float32Array(1024);
      // What comes out, should be what went in.
      gl.readPixels(0, 0, 512, 2, gl.RED, gl.FLOAT, data);
      //console.log("\nfrequency domain: \n" + data.slice(0, 512));
      //console.log("time domain: \n" + data.slice(512));
      gl.deleteFramebuffer(debug_framebuffer);
    }
  }

  /**
   * Actually compiles and links the vertex shader and fragment shader.
   */
  compile_shader() {
    let WEBGL_debug_shaders = this.gl.getExtension("WEBGL_debug_shaders");
    this.webgl_viewport_size = null;
    this.webgl_buffers = {};
    this.shader_program = this.gl.createProgram();
    for (let i = 0; i < 2; ++i) {
      let shader_code = (i == 0 ? this.vertex_shader_code_addon : this.fragment_shader_code_addon);
      let shader_object = this.gl.createShader(i == 0 ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(shader_object, shader_code);
      this.gl.compileShader(shader_object);
      let status = this.gl.getShaderParameter(shader_object, this.gl.COMPILE_STATUS);
      if (!status) {
        console.warn(this.gl.getShaderInfoLog(shader_object));
      }
      this.gl.attachShader(this.shader_program, shader_object);
      this.gl.linkProgram(this.shader_program);
      console.info("translated shader:" + WEBGL_debug_shaders.getTranslatedShaderSource(shader_object));
    }
    status = this.gl.getProgramParameter(this.shader_program, this.gl.LINK_STATUS);
    if (!status) {
      console.warn(this.gl.getProgramInfoLog(this.shader_program));
    }
    this.shader_program.inPos = this.gl.getAttribLocation(this.shader_program, "inPos");
    this.shader_program.iMouse = this.gl.getUniformLocation(this.shader_program, "iMouse");
    this.shader_program.iResolution = this.gl.getUniformLocation(this.shader_program, "iResolution");
    this.shader_program.iTime = this.gl.getUniformLocation(this.shader_program, "iTime");
    this.shader_program.iTimeDelta = this.gl.getUniformLocation(this.shader_program, "iTimeDelta");
    this.shader_program.iFrame = this.gl.getUniformLocation(this.shader_program, "iFrame");
    this.shader_program.iChannel0 = this.gl.getUniformLocation(this.shader_program, "iChannel0");
    this.shader_program.iChannel1 = this.gl.getUniformLocation(this.shader_program, "iChannel1");
    this.shader_program.iChannel2 = this.gl.getUniformLocation(this.shader_program, "iChannel2");
    this.shader_program.iChannel3 = this.gl.getUniformLocation(this.shader_program, "iChannel3");
    this.shader_program.iSampleRate = this.gl.getUniformLocation(this.shader_program, "iSampleRate");
    this.gl.useProgram(this.shader_program);

    this.gl.uniform1f(this.shader_program.iSampleRate, 48000.);
    var pos = [-1, -1,
      1, -1,
      1, 1,
    -1, 1];
    var inx = [0, 1, 2, 0, 2, 3];
    this.webgl_buffers.pos = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_buffers.pos);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(pos), this.gl.STATIC_DRAW);
    this.webgl_buffers.inx = this.gl.createBuffer();
    this.webgl_buffers.inx.len = inx.length;
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_buffers.inx);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(inx), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.shader_program.inPos);
    this.gl.vertexAttribPointer(this.shader_program.inPos, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this?.write_audio_texture(this.analyser, this.channel0_texture_unit, this.channel0_texture, this.channel0_sampler);
    window.onresize = ((event) => this.resize(event));
    this.resize();
    requestAnimationFrame((milliseconds) => this.render_frame(milliseconds));
  }

  set_attributes() {

  }
  /**
   * Obtains all active uniforms from the compiled GLSL shader.
   * Addons may use these to control the shader.
   */
  get_uniforms() {
    // Obtains all active uniforms and their locations, with which visuals 
    // can be controlled.
    this.uniforms = {};
    this.uniform_locations = {};
    let uniform_count = this.gl.getProgramParameter(this.shader_program, this.gl.ACTIVE_UNIFORMS);
    for (let uniform_index = 0; uniform_index < uniform_count; ++uniform_index) {
      let uniform_info = this.gl.getActiveUniform(this.shader_program, uniform_index);
      this.uniforms[uniform_info.name] = uniform_info;
      let uniform_location = this.gl.getUniformLocation(this.shader_program, uniform_info.name);
      this.uniform_locations[uniform_info.name] = uniform_location;
    }
  }
  // Obtains all program attributes, which can be used to sample the visuals in 
  // order to generate notes.
  get_attributes() {

  }
  /**
   * Called by the browseer to run the shader in an endless loop of animation frames.
   * 
   * @param {number} milliseconds The time since the start of the loop.
   */
  render_frame(milliseconds) {
    // Here we create an AnalyserNode as soon as Csound is available.
    if (this.analyser) {
    } else {
      let csound = this?.cloud5_piece?.csound;
      if (csound) {
        this.analyser = new AnalyserNode(csound.context);
        this.analyser.fftSize = 2048;
        console.info("Analyzer buffer size: " + this.analyser.frequencyBinCount);
        csound.connect(this.analyser);
      }
    }
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Custom uniforms may be set in this addon. Such uniforms can be used 
    // e.g. to control audio visualizations.
    if (this.pre_draw_frame_function_addon) {
      this.pre_draw_frame_function_addon();
    }
    // There are some default uniforms, modeled on ShaderToy.
    let seconds = milliseconds / 1000;
    this.gl.uniform1f(this.shader_program.iTime, seconds);
    this.gl.uniform3f(this.shader_program.iResolution, this.canvas.width, this.canvas.height, 0);
    this.gl.uniform4f(this.shader_program.iMouse, this.mouse_position[0], this.mouse_position[1], 0, 0);
    this?.write_audio_texture(this.analyser, this.channel0_texture_unit, this.channel0_texture, this.channel0_sampler);
    // Actually render the frame.
    this.gl.drawElements(this.gl.TRIANGLES, this.webgl_buffers.inx.len, this.gl.UNSIGNED_SHORT, 0);
    // Custom attributes may be accessed in this addon. Such attributes can be 
    // used e.g. to sample visuals and translate them to musical notes.
    if (this.post_draw_frame_function_addon) {
      this.post_draw_frame_function_addon();
    }
    this.rendering_frame++;
    requestAnimationFrame((milliseconds) => this.render_frame(milliseconds));
  }
}
customElements.define("cloud5-shadertoy", Cloud5ShaderToy);

/**
 * Displays a scrolling list of runtime messages from Csound and/or other 
 * sources.
 */
class Cloud5Log extends HTMLElement {
  constructor() {
    super();
    this.cloud5_piece = null;
  }
  connectedCallback() {
    this.innerHTML = `<div 
      id='console_view' 
      class="cloud5-log-editor no-scroll">`;
    this.message_callback_buffer = "";
    this.console_editor = ace.edit("console_view");
    this.console_editor.setShowPrintMargin(false);
    this.console_editor.setDisplayIndentGuides(false);
    this.console_editor.renderer.setOption("showGutter", false);
    this.console_editor.renderer.setOption("showLineNumbers", true);
  };
  /**
   * Displays the message at the bottom of the scrolling text area.
   * 
   * @param {string} message 
   */
  log(message) {
    // Split in case the newline is in the middle of the message but 
    // not at the end?
    this.message_callback_buffer = this.message_callback_buffer + message;
    if (this.message_callback_buffer.endsWith("\n")) {
      console.info(this.message_callback_buffer);
      let lines = this.console_editor.getSession().getLength();
      // Prevent the console editor from hogging memory.
      if (lines > 5000) {
        this.console_editor.getSession().removeFullLines(0, 2500);
        lines = this.console_editor.getSession().getLength();
      }
      this.console_editor.moveCursorTo(lines, 0);
      this.console_editor.scrollToLine(lines);
      this.console_editor.insert(this.message_callback_buffer);
      this.message_callback_buffer = "";
    };
  }
  /**
   * Clears the message display.
   */
  clear() {
    this.console_editor.setValue('');
  }
};
customElements.define("cloud5-log", Cloud5Log);

/**
 * May contain license, authorship, credits, and program notes as inner HTML.
 */
class Cloud5About extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define("cloud5-about", Cloud5About);

// A sad workaround....
try {
  var fs = require("fs");
  var __dirname = fs.realpathSync.native(".");
} catch (e) {
  console.warn(e);
}

/**
 * The title of a piece is always the basename of the document.
 */
document.title = document.location.pathname.replace("/", "").replace(".html", "");

/**
 * Tries to clear all browser caches upon loading.
 */
if ('caches' in window) {
  caches.keys().then(function (names) {
    for (let name of names)
      caches.delete(name);
    console.info(`deleted ${name} from caches.`);
  });
}

/**
 * Tests if Csound is null or undefined.
 */
function non_csound(csound_) {
  if (typeof csound_ === 'undefined') {
    console.warn("csound is undefined.");
    console.trace();
    return true;
  }
  if (csound_ === null) {
    console.warn("csound is null.");
    console.trace();
    return true;
  }
  return false;
}

/**
 * Replaces the order of instruments in a Silencio Score with a new order.
 * Instrument numbers are re-ordered as if they are integers. The 
 * new_order parameter is a map, e.g. `{1:5, 3:1, 4:17}`. The map need not 
 * be complete.
 *
 * @param {Silencio.Score} score A generated CsoundAC Score.
 * @param {Object} new_order_ A map assigning new Csound instrument numbers 
 * (values) to old Csound instrument numbers (keys)
 */
function arrange_silencio(score, new_order_) {
  console.info("arrange: reassigning instrument numbers...")
  let new_order = new Map(Object.entries(new_order_));
  // Renumber the insnos in the Score. Fractional parts of old insnos are 
  // preserved.
  for (i = 0, n = score.data.length; i < n; ++i) {
    let event_ = score.data[i];
    let current_insno = event_.channel;
    let current_insno_integer = Math.floor(current_insno);
    let string_key = current_insno_integer.toString();
    if (new_order.has(string_key)) {
      let new_insno_integer = new_order.get(string_key);
      let new_insno_fraction = current_insno - current_insno_integer;
      let new_insno = new_insno_integer + new_insno_fraction;
      console.info("renumbered: " + event_.toIStatement());
      event_.channel = new_insno;
      score.data[i] = event_;
      console.info("        to: " + score.data[i].toIStatement());
    }
  }
  console.info("arrange: finished reassigning instrument numbers.\n")
}

/**
 * Replaces the order of instruments in a generated CsoundAC Score with a new 
 * order. Instrument numbers are re-ordered as if they are integers. The 
 * new_order parameter is a map, e.g. `{1:5, 3:1, 4:17}`. The map need not 
 * be complete.
 *
 * @param {CsoundAC.Score} score A generated CsoundAC Score.
 * @param {Object} new_order_ A map assigning new Csound instrument numbers 
 * (values) to old Csound instrument numbers (keys)
 */
function arrange(score, new_order_) {
  console.info("arrange: reassigning instrument numbers...\n")
  let new_order = new Map(Object.entries(new_order_));
  // Renumber the insnos in the Score. Fractional parts of old insnos are 
  // preserved.
  for (i = 0, n = score.size(); i < n; ++i) {
    let event_ = score.get(i);
    let current_insno = event_.getInstrument();
    let current_insno_integer = Math.floor(current_insno);
    let string_key = current_insno_integer.toString();
    if (new_order.has(string_key)) {
      let new_insno_integer = new_order.get(string_key);
      let new_insno_fraction = current_insno - current_insno_integer;
      let new_insno = new_insno_integer + new_insno_fraction;
      console.info("renumbered: " + event_.toIStatement());
      event_.setInstrument(new_insno);
      score.set(i, event_);
      console.info("        to: " + event_.toIStatement());
    }
  }
  console.info("arrange: finished reassigning instrument numbers.\n")
}

/**
 * May be called to store data to the local filesystem. This is used e.g. to 
 * save a copy of the generated Csound .csd file before starting the 
 * performance. This can help with debugging. Note that in a browser-based 
 * performance, the local filesystem is inside the sandbox.
 * 
 * @param {string} filepath 
 * @param {string} data 
 */
function write_file(filepath, data) {
  try {
    // Sync, so a bad .csd file doesn't blow up Csound 
    // before the .csd file is written so it can be tested!
    fs.writeFileSync(filepath, data, function (err) {
      console.error(err);
    });
  } catch (err) {
    try {
      navigator.clipboard.writeText(data);
      console.info("Copied generated csd to system clipboard.\n")
    } catch (err1) {
      console.warn(err1);
    }
  }
}

/**
 * Called by the browser to resize arrays that are used to sample the WebGL
 * canvas during performance.
 */
function resize() {
  webgl_viewport_size = [window.innerWidth, window.innerHeight];
  canvas.width = webgl_viewport_size[0] * window.devicePixelRatio;
  canvas.height = webgl_viewport_size[1] * window.devicePixelRatio;
  image_sample_buffer = new Uint8ClampedArray(canvas.width * 4);
  prior_image_sample_buffer = new Uint8ClampedArray(canvas.width * 4);
  console.info("resize: image_sample_buffer.length: " + image_sample_buffer.length);
}

function client_wait_async(gl, sync, flags, interval_ms) {
  return new Promise((resolve, reject) => {
    function test() {
      const result = gl.clientWaitSync(sync, flags, 0);
      if (result === gl.WAIT_FAILED) {
        reject();
        return;
      }
      // This is the workaround for platforms where maximum 
      // timeout is always 0.
      if (result === gl.TIMEOUT_EXPIRED) {
        setTimeout(test, interval_ms);
        return;
      }
      resolve();
    }
    test();
  });
}

async function get_buffer_sub_data_async(gl, target, buffer, srcByteOffset, dstBuffer,
  /* optional */ dstOffset, /* optional */ length) {
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  gl.flush();
  await client_wait_async(gl, sync, 0, 10);
  gl.deleteSync(sync);
  gl.bindBuffer(target, buffer);
  gl.getBufferSubData(target, srcByteOffset, dstBuffer, dstOffset, length);
  gl.bindBuffer(target, null);
}

/**
 * @function rgb_to_hsv 
 * 
 * @description Converts an RGB color value to HSV. The formula is 
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * 
 * @param {Array} rgb RGB color in [0, 255]
 * @returns {Array} An HSV color in [0, 1].
 */
var rgb_to_hsv = function (rgb) {
  r = rgb[0] / 255;
  g = rgb[1] / 255;
  b = rgb[2] / 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, v = max;
  let d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max == min) {
    h = 0;
  } else {
    // More efficient than switch?
    if (max == r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max == g) {
      h = (b - r) / d + 2;
    } else if (max == b) {
      h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h, s, v];
}

async function read_pixels_async(gl, x, y, w, h, format, type, sample) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buffer);
  gl.bufferData(gl.PIXEL_PACK_BUFFER, sample.byteLength, gl.STREAM_READ);
  gl.readPixels(x, y, w, h, format, type, 0);
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
  await get_buffer_sub_data_async(gl, gl.PIXEL_PACK_BUFFER, buffer, 0, sample);
  gl.deleteBuffer(buffer);
}

/**
 * Called by cloud-5 when sampling the WebGL video canvas to 
 * reduce the bandwidth of the data, e.g. in preparation for 
 * translating it to musical notes.
 * 
 * Adapts https://github.com/pingec/downsample-lttb from time 
 * series data to vectors of float HSV pixels. Our data is not 
 * [[time, value], [time, value],...], but rather 
 * [[column, value, [h,s,v]],...]. The algorithm uses 
 * column and value, but [h,s,v] go along for the ride.
 * 
 * @param {Array} data Data from the canvas, e.g. a row of pixels.
 * @param {Array} buckets Placeholder data.
 * @returns {Array} The downsampled data.
 */
function downsample_lttb(data, buckets) {
  if (buckets >= data.length || buckets === 0) {
    return data; // Nothing to do
  }
  let sampled_data = [],
    sampled_data_index = 0;
  // Bucket size. Leave room for start and end data points
  let bucket_size = (data.length - 2) / (buckets - 2);
  // Triangles are points {a, b, c}.
  let a = 0,  // Initially a is the first point in the triangle
    max_area_point,
    max_area,
    area,
    next_a;
  sampled_data[sampled_data_index++] = data[a]; // Always add the first point
  for (let i = 0; i < buckets - 2; i++) {
    // Calculate point average for next bucket (containing c)
    let avg_x = 0,
      avg_y = 0,
      avg_range_start = Math.floor((i + 1) * bucket_size) + 1,
      avg_range_end = Math.floor((i + 2) * bucket_size) + 1;
    avg_range_end = avg_range_end < data.length ? avg_range_end : data.length;
    let avg_range_length = avg_range_end - avg_range_start;
    for (; avg_range_start < avg_range_end; avg_range_start++) {
      avg_x += data[avg_range_start][0] * 1; // * 1 enforces Number (value may be Date)
      avg_y += data[avg_range_start][1] * 1;
    }
    avg_x /= avg_range_length;
    avg_y /= avg_range_length;
    // Get the range for this bucket
    let range_offs = Math.floor((i + 0) * bucket_size) + 1,
      range_to = Math.floor((i + 1) * bucket_size) + 1;
    // Point a
    let point_a_x = data[a][0] * 1, // enforce Number (value may be Date)
      point_a_y = data[a][1] * 1;
    max_area = area = -1;
    for (; range_offs < range_to; range_offs++) {
      // Calculate triangle area over three buckets
      area = Math.abs((point_a_x - avg_x) * (data[range_offs][1] - point_a_y) -
        (point_a_x - data[range_offs][0]) * (avg_y - point_a_y)
      ) * 0.5;
      if (area > max_area) {
        max_area = area;
        max_area_point = data[range_offs];
        next_a = range_offs; // Next a is this b
      }
    }
    // Pick this point from the bucket; it is the point with the maximum
    // area by value, but that point actually includes [h,s,v].
    sampled_data[sampled_data_index++] = max_area_point;
    a = next_a; // This a is the next a (chosen b)
  }
  sampled_data[sampled_data_index++] = data[data.length - 1]; // Always add last
  return sampled_data; ///sampled_data;
}

/**
  * Creates a URL for a soundfile recorded by this piece.
  * All such files exist by default in the Emscripten MEMFS filesystem 
  * at '/'.
  */
async function url_for_soundfile(csound) {
  try {
    let soundfile_name = document.title + ".wav";
    // But see https://mimetype.io/audio/vnd.wav.
    let mime_type = "audio/wav";
    let file_data = await csound.GetFileData(soundfile_name);
    console.info(`Offering download of "${soundfile_name}", with ${file_data.length} bytes...`);
    var a = document.createElement('a');
    a.download = soundfile_name;
    a.href = URL.createObjectURL(new Blob([file_data], { type: mime_type }));
    // We hide the download link and automatically click it.
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 2000);
    // 
  } catch (x) {
    console.log(x);
  }
}

/**
 * Generates a new copy(s) of the Score in canon to the original, at the 
 * specified delay in seconds and transposition in semitones (which may be 
 * fractional). If a Scale is supplied, the new Score is conformed to that 
 * Scale.
 * @param {CsoundAC.Score} Score or fragment of score. 
 * @param {number} delay in seconds.
 * @param {number} transposition in semitones.
 * @param {number} layers.
 * @param {CsoundAC.Scale} csoundac_scale if supplied, the new voice will 
 * be conformed to this scale.
 * @returns a modified {Score}
 */
function canon(CsoundAC, csoundac_score, delay, transposition, layers, csoundac_scale) {
  let new_score = new CsoundAC.Score();
  // Append both an event and that event in canon to the new Score.
  for (let layer = 1; layer <= layers; ++layer) {
    for (let i = 0; i < csoundac_score.size(); ++i) {
      let event = csoundac_score.get(i);
      if (layer == 1) {
        new_score.append_event(event);
      }
      let new_time = event.getTime() + (delay * layer);
      event.setTime(new_time);
      let new_key = event.getKey() + (transposition * layer);
      event.setKey(new_key);
      new_score.append_event(event);
    }
  }
  if (csoundac_scale) {
    CsoundAC.apply(new_score, csoundac_scale, 0, 1000000, true);
  }
  return new_score;
}




