/**
 * This script defines custom HTML elements and supporting code for the 
 * cloud-5 system. Once a custom element is used in the body of a Web page, 
 * its DOM object can be obtained, and then not only DOM methods but also 
 * custom methods can be called.
 * 
 * There are two methods of extending the cloud-5 system:
 * 
 * 1. Set addon functions, code text, and other properties of the custom 
 *    elements. All such user-defined properties have names ending in 
 *    `_addon`.
 * 2. Define new custom elements that derive from the `Cloud5Element` base 
 *    class, or from other cloud-5 custom elements. These new custom elements 
 *    will automatically be given menu buttons and show/hide behavior by the
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
  for (let window_to_close of globalThis.windows_to_close) {
    try {
      window_to_close.close()
    } catch (ex) {
      console.warn(ex);
    }
  }
  globalThis.windows_to_close = [];
});

/**
 * Create a full-viewport WebGL2 canvas inside `container` and return {gl, canvas}.
 * Transparent by default so lower layers (e.g., your shader background) can show through.
 */
function obtainWebGL2(container, {
  alpha = true,
  antialias = true,
  premultipliedAlpha = true,
  preserveDrawingBuffer = false,
  desynchronized = true,          // lower latency on some browsers
  powerPreference = 'high-performance'
} = {}) {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%', border: '0',
    display: 'block', pointerEvents: 'none' // keep clicks for UI above
  });
  container.appendChild(canvas);

  // Try WebGL2 first.
  let gl = canvas.getContext('webgl2', {
    alpha, antialias, premultipliedAlpha, preserveDrawingBuffer,
    desynchronized, powerPreference
  });

  // Optional fallback to WebGL1 (if you want it)
  if (!gl) {
    gl = canvas.getContext('webgl', {
      alpha, antialias, premultipliedAlpha, preserveDrawingBuffer,
      desynchronized, powerPreference
    }) || canvas.getContext('experimental-webgl');
  }
  if (!gl) throw new Error('Unable to obtain WebGL or WebGL2 context.');

  // Transparent clear so underlying layers remain visible.
  gl.clearColor(0, 0, 0, 0);

  // Handle HiDPI and resizing
  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }
  resize();
  new ResizeObserver(resize).observe(canvas);
  window.addEventListener('orientationchange', resize);

  // Context loss / restore
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    // stop anim loops / releases as needed
  });
  canvas.addEventListener('webglcontextrestored', () => {
    // re-create programs/buffers/textures, then:
    resize();
  });

  // Useful diagnostics
  // console.log(gl.getParameter(gl.VERSION), gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

  // WebGL2-only? Check once:
  const isWebGL2 = (typeof WebGL2RenderingContext !== 'undefined') && (gl instanceof WebGL2RenderingContext);

  // Enable common extensions when available (WebGL2: only EXT_color_buffer_float typically needed)
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float'); // renderable float targets
    gl.getExtension('EXT_texture_filter_anisotropic'); // better texture filtering
  } else {
    gl.getExtension('OES_texture_float');
    gl.getExtension('OES_texture_float_linear');
    gl.getExtension('OES_element_index_uint');
    gl.getExtension('EXT_shader_texture_lod');
    gl.getExtension('EXT_texture_filter_anisotropic');
  }

  return { gl, canvas, isWebGL2 };
}

function cloud5_can_persist_state() {
  return cloud5_is_local_context();
}

function cloud5_state_filename_for_piece() {
  const base = document.title || 'piece';
  return `${base}.state.json`;
}

function cloud5_is_local_context() {
  const protocol = window.location.protocol;
  const host = window.location.hostname;

  if (protocol === 'file:') {
    return true;
  }

  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
    return true;
  }

  // NW.js but loading remote content → not local
  if (typeof process !== 'undefined' && process.versions?.nw) {
    return false;
  }

  return false;
}

function cloud5_get_by_path(obj, path) {
  if (!obj || typeof path !== 'string' || path.length === 0) {
    return undefined;
  }

  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === null || (typeof current !== 'object' && typeof current !== 'function')) {
      return undefined;
    }
    if (!(part in current)) {
      return undefined;
    }
    current = current[part]; // supports prototype getters
  }

  return current;
}

function cloud5_set_by_path(obj, path, value) {
  if (!obj || typeof path !== 'string' || path.length === 0) {
    return;
  }

  const parts = path.split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];

    if (current === null || (typeof current !== 'object' && typeof current !== 'function')) {
      return;
    }

    // Use existing value if it looks like an object; otherwise create.
    if (!(part in current) || current[part] === null || typeof current[part] !== 'object') {
      current[part] = {};
    }

    current = current[part];
  }

  // Final assignment: will invoke a setter if present.
  current[parts[parts.length - 1]] = value;
}

function cloud5_snapshot_fields(obj, field_names) {
  const values = {};

  for (const path of field_names) {
    try {
      const raw_value = cloud5_get_by_path(obj, path);
      if (raw_value === undefined) {
        continue;
      }

      const detached = JSON.parse(JSON.stringify(raw_value));
      values[path] = detached;
    } catch {
      console.warn(`cloud5_snapshot_fields: field ${path} could not be serialized; skipping.`);
    }
  }

  return values;
}

function cloud5_restore_fields(obj, values) {
  if (!obj || !values || typeof values !== 'object') {
    return;
  }

  for (const path of Object.keys(values)) {
    try {
      cloud5_set_by_path(obj, path, values[path]);
    } catch {
      console.warn(`cloud5_restore_fields: field ${path} could not be restored; skipping.`);
    }
  }
}

async function cloud5_clipboard_and_download(json_text, filename) {
  // Clipboard
  try {
    await navigator.clipboard.writeText(json_text);
  } catch (e) {
    console.warn('Clipboard write failed:', e);
  }

  // Automatic download
  const blob = new Blob([json_text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

async function cloud5_save_state_if_needed(piece) {
  if (!cloud5_is_local_context()) {
    return;
  }

  if (!piece.fields_to_serialize || piece.fields_to_serialize.length === 0) {
    return;
  }

  const base = document.title || 'piece';
  const filename = `${base}.state.json`;

  const state_obj = cloud5_snapshot_fields(piece, piece.fields_to_serialize);
  const json_text = JSON.stringify(state_obj, null, 2);

  // Try filesystem first
  if (typeof fs !== 'undefined' && fs?.writeFileSync) {
    try {
      const tmp = filename + '.tmp';
      fs.writeFileSync(tmp, json_text, 'utf8');
      fs.renameSync(tmp, filename);
      return;
    } catch (e) {
      console.warn('fs write failed, falling back to clipboard:', e);
    }
  }

  // Fallback: clipboard + download
  await cloud5_clipboard_and_download(json_text, filename);
}

async function cloud5_load_state_if_present(piece) {
  if (!cloud5_is_local_context()) {
    return;
  }

  if (!piece?.fields_to_serialize || piece.fields_to_serialize.length === 0) {
    return;
  }

  const base = document.title || 'piece';
  const filename = `${base}.state.json`;

  // 1) Try filesystem (NW.js / node context)
  if (typeof fs !== 'undefined' && fs?.readFileSync && fs?.existsSync) {
    try {
      if (!fs.existsSync(filename)) {
        return;
      }
      const text = fs.readFileSync(filename, 'utf8');
      const obj = JSON.parse(text);
      cloud5_restore_fields(piece, obj);
      return;
    } catch (e) {
      console.warn('Failed to load state via fs; falling back to fetch:', e);
    }
  }

  // 2) Try fetch (localhost served file)
  try {
    const url = `${filename}?t=${Date.now()}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      return;
    }
    const text = await response.text();
    const obj = JSON.parse(text);
    cloud5_restore_fields(piece, obj);
    return;
  } catch (e) {
    // 3) Nothing
    console.warn('Failed to load state via fetch; no persisted state loaded:', e);
  }
}

/**
 * Base class for Cloud5 overlay-like elements.
 * Currently lightweight, but centralizes a few common conventions:
 * - Optional `data-cloud5-stay-visible` attribute parsed into `cloud5_stay_visible`.
 * - Optional `on_shown()` / `on_hidden()` lifecycle hooks.
 *
 * Subclasses should call `super.connectedCallback()` if they override it.
 */
class Cloud5Element extends HTMLElement {
  #fields_to_serialize = [];
  #cloud5_state_restored = false;

  constructor() {
    super();
    this.cloud5_stay_visible = false;
  }

  set fields_to_serialize(fields) {
    if (!Array.isArray(fields)) {
      this.#fields_to_serialize = [];
    } else {
      this.#fields_to_serialize = fields.slice();
    }
    // Do NOT restore here — overlays may not exist yet.
  }

  get fields_to_serialize() {
    // Lazy, one-shot restore
    if (!this.#cloud5_state_restored) {
      this.#cloud5_state_restored = true;

      if (cloud5_can_persist_state() && this.#fields_to_serialize.length > 0) {
        cloud5_load_state_if_present(this);
      }
    }
    return this.#fields_to_serialize;
  }

  connectedCallback() {
    const attr = this.getAttribute('data-cloud5-stay-visible');
    if (attr !== null) {
      const v = String(attr).toLowerCase();
      this.cloud5_stay_visible =
        (v === '' || v === 'true' || v === '1' || v === 'yes');
    }
  }
  /**
   * Optional lifecycle hook called by the piece when this element is shown.
   * Subclasses may override this method to change behavior when shown.
   */
  on_shown() { }
  /** 
   * Optional lifecycle hook called by the piece when this element is hidden.
   * Subclasses may override this method to change behavior when hidden.
   */
  on_hidden() { }
  /**
   * Optional lifecycle hook called by the piece when it stops its performance. 
   * Subclasses may override this method to change behavior when the piece stops.  
   */
  on_stop() { }
  /**
   * Optional lifecycle hook called by the piece when it is cleared. 
   * Subclasses may override this method to change behavior when the piece is 
   * cleared, such as clearing any performance-related internal state in 
   * preparation for a new performance.
   */
  on_clear() { }
  /**
   * Optional lifecycle hook called by the piece when it generates a new 
   * Score. Subclasses may override this method to add new Events to the 
   * Score, or to modify existing Events.
   */
  on_generate() { }
  /**
   * Optional lifecycle hook called by the piece when it starts its 
   * performance. Subclasses may override this method to change behavior when 
   * the piece starts, such as to schedule real-time events.
   */
  on_play() { }
}

/**
 * Sets up the piece, and defines menu buttons. The user may assign the DOM 
 * objects of other cloud-5 elements to the `_overlay` properties. 
 */
class Cloud5Piece extends Cloud5Element {
  constructor() {
    super();
    this.csound = null;
    this.csoundac = null;
    this.score = null
    this.is_rendering = false;
    // Default duration and fadeout for rendering to a soundfile.
    // These may be overridden by control parameters, and are somewhat less 
    // than the setTimeout maximum.
    this.duration = 2e6;
    this.fadeout = 6;
    this.safe_tail = 4;
    this.total_duration = this.duration + this.fadeout + this.safe_tail;
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
  * May be assigned an instance of a cloud5-shadertoy overlay. If so, 
  * the GLSL shader will run at all times, and will normally create the 
  * background for other overlays. The shader overlay may call 
  * addon functions either to visualize the audio of the performance, 
  * and/or to sample the video canvas to generate notes for performance by 
  * Csound.
  */
  set shader_overlay(shader) {
    this.#shader_overlay = shader;
    // Back reference for shader to access the piece.
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
    *   saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }
    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },

    */
  set control_parameters_addon(parameters) {
    this.#control_parameters_addon = parameters;
    this.create_dat_gui_menu(parameters);
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
    if (this.#piano_roll_overlay) {
      this.#piano_roll_overlay.cloud5_piece = this;
    }
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
  set log_overlay(overlay) {
    this.#log_overlay = overlay;
    if (this.#log_overlay) {
      this.#log_overlay.cloud5_piece = this;
    }
  }
  get log_overlay() {
    return this.#log_overlay;
  }

  /**
   * May be assigned the DOM object of a <cloud5-about> element overlay. If 
   * so, the About button will show or hide the overlay. The inner HTML of 
   * this element may contain license information, authorship, credits, 
   * program notes for the piece, or other information.
   */
  #about_overlay = null;
  set about_overlay(overlay) {
    this.#about_overlay = overlay;
  }
  get about_overlay() {
    return this.#about_overlay;
  }

  /**
   * May be assigned the DOM object of a <cloud5-strudel> element overlay. If 
   * so, the Strudel button will show or hide the Strudel REPL.
   */
  #strudel_overlay = null;
  set strudel_overlay(overlay) {
    this.#strudel_overlay = overlay;
    if (this.#strudel_overlay) {
      this.#strudel_overlay.cloud5_piece = this;
    }
  }
  get strudel_overlay() {
    return this.#strudel_overlay;
  }
  /**
   * Called on a timer as long as the piece exists.
   */
  update_display = async () => {
    // Refresh metering/time and drive any overlays that follow score position.
    try {
      await this.csound_message_callback();
    } catch (e) {
      // Csound may not be running; keep UI responsive regardless.
    }

    // Update piano-roll progress (red ball) if present.
    try {
      this?.piano_roll_overlay?.show_score_time?.();
    } catch (e) {
    }

    const t = this.latest_score_time;
    if (typeof t === 'number' && isFinite(t)) {
      // Prefer an accurate total duration from an actual score if available.
      let total = this.total_duration ?? this.duration;

      const is_good_total = (v) => (typeof v === 'number' && isFinite(v) && v > 0);

      if (!is_good_total(total)) {
        const sdur = this.score?.getDuration?.();
        if (is_good_total(sdur)) total = sdur;
      }
      if (!is_good_total(total)) {
        const pdur = this.piano_roll_overlay?.silencio_score?.getDuration?.();
        if (is_good_total(pdur)) total = pdur;
      }

      for (const overlay of this._get_all_overlays()) {
        try {
          overlay?.on_score_time?.(t, total || 0);
        } catch (e) {
        }
      }
    }
  }
  /**
     * Called by Csound during performance, and prints the message to the 
     * scrolling text area of a <csound5-log> element overlay. This function may 
     * also be called by user code.
     * 
     * @param {string} message 
     */
  csound_message_callback = async (message) => {
    if (message && this.log_overlay) {
      this.log_overlay.log(message);
    }
    let level_left = -100;
    let level_right = -100;
    if (globalThis.csound) {
      let score_time = await csound.getScoreTime();
      level_left = await csound.getControlChannel("gk_MasterOutput_output_level_left");
      level_right = await csound.getControlChannel("gk_MasterOutput_output_level_right");
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
      this?.piano_roll_overlay?.update_score_time(score_time);
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
    const filename = document.location.pathname.split("/").pop();

    this.innerHTML = `
    <div class="w3-bar cloud5-menu" id="main_menu">
      <ul class="menu" id="main_menu_list">
        <li id="menu_item_play"
            title="Play piece on audio output"
            class="w3-btn w3-hover-text-light-green">Play</li>

        <li id="menu_item_render"
            title="Render piece to soundfile then play on audio output"
            class="w3-btn w3-hover-text-light-green">Render</li>

        <li id="menu_item_stop"
            title="Stop performance"
            class="w3-btn w3-hover-text-light-green">Stop</li>

        <li id="menu_item_fullscreen"
            class="w3-btn w3-hover-text-light-green">Fullscreen</li>

        <!-- Built-in overlay items (if their overlays exist) will reuse these.
             Generic overlays will get new <li> items injected before About. -->
        <li id="menu_item_strudel"
            class="w3-btn w3-hover-text-light-green"
            style="display:none;">Strudel</li>

        <li id="menu_item_piano_roll"
            title="Show/hide piano roll score"
            class="w3-btn w3-hover-text-light-green"
            style="display:none;">Score</li>

        <li id="menu_item_log"
            title="Show/hide message log"
            class="w3-btn w3-hover-text-light-green">Log</li>

        <li id="menu_item_about"
            title="Show/hide information about this piece"
            class="w3-btn w3-hover-text-light-green">About ${filename}</li>

        <li id="mini_console"
            class="w3-btn w3-text-green w3-hover-text-light-green"></li>

        <li id="vu_meter_left"
            class="w3-btn w3-hover-text-light-green"></li>

        <li id="vu_meter_right"
            class="w3-btn w3-hover-text-light-green"></li>

        <li id="menu_item_dat_gui"
            title="Show/hide performance controls; 'Save' copies all control parameters to system clipboard"
            class="w3-btn w3-left-align w3-hover-text-light-green w3-right"></li>
      </ul>
    </div>`;

    // Cache status elements
    this.vu_meter_left = this.querySelector("#vu_meter_left");
    this.vu_meter_right = this.querySelector("#vu_meter_right");
    this.mini_console = this.querySelector("#mini_console");

    // Transport buttons
    const menu_item_play = this.querySelector('#menu_item_play');
    menu_item_play.onclick = (event) => {
      console.info("menu_item_play click...");
      this.cancel_scheduled_stop();
      // Show shader background if available
      if (this.shader_overlay) {
        this.show(this.shader_overlay);
      }
      // Hide overlays that should not be visible while playing
      this.hide(this.piano_roll_overlay);
      this.hide(this.log_overlay);
      this.hide(this.about_overlay);
      this.hide(this.strudel_overlay);
      // Start performance
      (() => this.render(1))();
    };

    const menu_item_render = this.querySelector('#menu_item_render');
    menu_item_render.onclick = (event) => {
      console.info("menu_item_render click...");
      this.cancel_scheduled_stop();
      this.show(this.piano_roll_overlay);
      this.hide(this.strudel_overlay);
      this.hide(this.log_overlay);
      this.hide(this.about_overlay);

      let duration;
      let fadeout;
      const safe_tail = 4;
      if (this.#control_parameters_addon) {
        duration = this.#control_parameters_addon.gi_cloud5_duration;
        if (this.#control_parameters_addon.gi_cloud5_fadeout) {
          fadeout = this.#control_parameters_addon.gi_cloud5_fadeout;
        }
      }
      if (duration) {
        this.duration = duration;
      }
      if (fadeout) {
        this.fadeout = fadeout;
      }
      this.total_duration = this.duration + this.fadeout + this.safe_tail;
      this?.csound_message_callback(
        `Duration: ${this.duration} fadeout: ${this.fadeout}\n`
      );
      this?.csound_message_callback(
        `Rendering will be stopped ${this.total_duration} seconds after starting...\n`
      );
      (() => this.render(4))();
    };

    const menu_item_stop = this.querySelector('#menu_item_stop');
    menu_item_stop.onclick = (event) => {
      console.info("menu_item_stop click...");
      this.csound?.setControlChannel("gk_cloud5_performance_mode", 0);
      this.stop();
      if (this.is_rendering) {
        const soundfile_url = url_for_soundfile(this.csound);
        this.is_rendering = false;
        this.cancel_scheduled_stop();
        // Optionally, do something with soundfile_url.
      }
    };

    const menu_item_fullscreen = this.querySelector('#menu_item_fullscreen');
    menu_item_fullscreen.onclick = async (event) => {
      console.info("menu_item_fullscreen click...");
      try {
        if (this.#shader_overlay?.canvas?.requestFullscreen) {
          let new_window = null;
          // Make the shader canvas fullscreen in the primary window.
          await this.#shader_overlay.canvas.requestFullscreen();
        }
      } catch (e) {
        console.warn("Fullscreen failed:", e);
      }
    };

    // After base menu is in place, interrogate the DOM and wire overlays,
    // but do it *after* the whole document has been parsed so that
    // overlays declared later (like <mandelbrot-julia>) exist.
    const wireOverlays = () => this.init_overlays_from_dom();

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', wireOverlays, { once: true });
    } else {
      wireOverlays();
    }
    // queueMicrotask(() => {
    //   cloud5_load_state_if_present(this);
    // });

  }

  /**
 * Scans the DOM for overlays belonging to this piece and ensures each has
 * a menu item that toggles its visibility. Built-in overlays reuse existing
 * menu items; generic overlays get new <li> entries inserted before About.
 */

  _get_all_overlays() {
    const s = new Set(this._registered_overlays || []);
    if (this.piano_roll_overlay) s.add(this.piano_roll_overlay);
    if (this.log_overlay) s.add(this.log_overlay);
    if (this.about_overlay) s.add(this.about_overlay);
    if (this.strudel_overlay) s.add(this.strudel_overlay);
    return [...s];
  }

  /**
   * Scans the DOM for overlays belonging to this piece and ensures each has
   * a menu item that toggles its visibility. Built-in overlays reuse existing
   * menu items; generic overlays get new <li> entries inserted before About.
   */
  init_overlays_from_dom() {
    const menu_list = document.querySelector('#main_menu_list');
    if (!menu_list) {
      console.warn("Cloud5Piece.init_overlays_from_dom: no #main_menu_list found.");
      return;
    }

    const menu_item_about = document.querySelector('#menu_item_about');
    const mini_console = document.querySelector('#mini_console');

    const overlays = [];

    // --- Built-in overlays --------------------------------------------------
    const piano_roll = document.querySelector('cloud5-piano-roll');
    if (piano_roll) {
      this.piano_roll_overlay = piano_roll;     // setter already sets cloud5_piece
      overlays.push({
        element: piano_roll,
        existingMenuId: 'menu_item_piano_roll',
        label: 'Score',
        stayVisible: this._read_stay_visible_flag(piano_roll)
      });
    }

    const log = document.querySelector('cloud5-log');
    if (log) {
      this.log_overlay = log;                   // setter already sets cloud5_piece
      overlays.push({
        element: log,
        existingMenuId: 'menu_item_log',
        label: 'Log',
        stayVisible: this._read_stay_visible_flag(log)
      });
    }

    const about = document.querySelector('cloud5-about');
    if (about) {
      this.about_overlay = about;
      const filename = document.location.pathname.split("/").pop();
      overlays.push({
        element: about,
        existingMenuId: 'menu_item_about',
        label: about.getAttribute('data-cloud5-label') || `About ${filename}`,
        stayVisible: this._read_stay_visible_flag(about)
      });
    }

    const strudel = document.querySelector('cloud5-strudel');
    if (strudel) {
      this.strudel_overlay = strudel;           // setter already sets cloud5_piece
      overlays.push({
        element: strudel,
        existingMenuId: 'menu_item_strudel',
        label: 'Strudel',
        stayVisible: this._read_stay_visible_flag(strudel)
      });
    }

    // --- Generic overlays ---------------------------------------------------
    const generic_candidates = Array.from(
      document.querySelectorAll('[data-cloud5-overlay], .cloud5-overlay')
    );

    const built_in_set = new Set(
      [piano_roll, log, about, strudel].filter(Boolean)
    );

    generic_candidates
      .filter(el => !built_in_set.has(el))
      .forEach(el => {
        const label =
          el.getAttribute('data-cloud5-label') ||
          el.getAttribute('data-overlay-label') ||
          el.getAttribute('title') ||
          el.id ||
          el.tagName.toLowerCase();

        const isDefault =
          el.hasAttribute('data-cloud5-default-visible') ||
          el.hasAttribute('data-cloud5-default-overlay');

        overlays.push({
          element: el,
          existingMenuId: null,
          label,
          isDefault
        });
      });

    // --- Create / wire menu items ------------------------------------------
    const registered = [];

    overlays.forEach(cfg => {
      const overlay = cfg.element;
      if (!overlay) return;

      // Back-reference for ALL overlays (built-in + generic).
      overlay.cloud5_piece = this;

      // Remember whether this overlay wants to stay visible when others toggle.
      overlay._cloud5_stay_visible = !!cfg.stayVisible;

      // Start hidden by default; menu click will toggle.
      this.hide(overlay);

      let li = null;
      if (cfg.existingMenuId) {
        li = document.querySelector(`#${cfg.existingMenuId}`);
      }

      if (!li) {
        li = document.createElement('li');
        li.className = 'w3-btn w3-hover-text-light-green';
        li.textContent = cfg.label;

        // Insert new button before About (if present), otherwise before mini_console,
        // otherwise appended at end.
        if (menu_item_about && menu_item_about.parentNode === menu_list) {
          menu_list.insertBefore(li, menu_item_about);
        } else if (mini_console && mini_console.parentNode === menu_list) {
          menu_list.insertBefore(li, mini_console);
        } else {
          menu_list.appendChild(li);
        }
      } else {
        // Reuse existing button but ensure it has a sensible label.
        if (!li.textContent.trim()) {
          li.textContent = cfg.label;
        }
      }

      li.style.display = 'inline';
      li.dataset.cloud5Overlay = 'true';

      li.addEventListener('click', () => {
        this._toggleOverlayExclusive(overlay);
      });

      registered.push(overlay);
    });

    this._registered_overlays = registered;
    // Now that overlay references exist, restore state once.
    cloud5_load_state_if_present(this);

    // Show whichever overlay is marked as default, if any.
    const defaultCfg = overlays.find(o => o.isDefault && o.element);
    if (defaultCfg) {
      this.show(defaultCfg.element);
    }
  }

  /**
   * Reads the "stay visible" flag from overlay attributes.
   * Recognized:
   *   data-cloud5-stay-visible="true" | "1"
   *   data-overlay-stay-visible="true" | "1"
   *   visibility="keep"
   */
  _read_stay_visible_flag(el) {
    if (!el || !el.getAttribute) return false;
    const raw =
      el.getAttribute('data-cloud5-stay-visible') ??
      el.getAttribute('data-overlay-stay-visible') ??
      el.getAttribute('visibility');

    if (!raw) return false;
    const v = String(raw).toLowerCase().trim();
    return (v === 'true' || v === '1' || v === 'keep');
  }


  /**
   * Toggles one overlay and hides all others that we know about.
   * Overlays marked with _cloud5_stay_visible (via attributes) are not hidden.
   * Does NOT touch the shader overlay (which can remain as background).
   */
  _toggleOverlayExclusive(target) {
    if (!target) return;

    const all = new Set(this._registered_overlays || []);
    if (this.piano_roll_overlay) all.add(this.piano_roll_overlay);
    if (this.log_overlay) all.add(this.log_overlay);
    if (this.about_overlay) all.add(this.about_overlay);
    if (this.strudel_overlay) all.add(this.strudel_overlay);

    all.forEach(overlay => {
      if (!overlay) return;

      const stayVisible = !!overlay._cloud5_stay_visible;

      if (overlay === target) {
        // Always toggle the requested overlay.
        this.toggle(overlay);
      } else if (!stayVisible) {
        // Only hide overlays that are not marked as "stay visible".
        this.hide(overlay);
      }
      // If stayVisible === true and overlay !== target, we leave it as-is.
    });
  }

  /**
    * Copies all _current_ dat.gui parameters to the system clipboard in 
    * JSON format.
    * 
    * @param {Object} parameters A dictionary containing the current state of all 
    * controls; keys are control parameter names, values are control parameter 
    * values. This can be pasted from the clipboard into source code, as a 
    * convenient method of updating a piece with parameters that have been tweaked 
    * during performance.
    */
  copy_parameters() {
    let copied_parameters = JSON.parse(JSON.stringify(this?.control_parameters_addon))
    delete copied_parameters?.load;
    const json_text = JSON.stringify(copied_parameters, null, 4);
    navigator.clipboard.writeText(json_text);
    if (this.csound) {
      this.csound.Message("Copied all control parameters to system clipboard.\n");
    }
  }

  stop_and_download = async () => {
    await this.stop();
    if (this.is_rendering) {
      const soundfile_name = await url_for_soundfile(this.csound);
      this.is_rendering = false;
      this.csound_message_callback(`Rendering has stopped; automatically downloaded ${soundfile_name}\n`);
    }
  };

  schedule_stop_after(seconds) {
    this.csound_message_callback(`Scheduling stop ${seconds} seconds from now...\n`);
    const milliseconds = seconds * 1000;
    const deadline = performance.now() + milliseconds;
    this._stop_timer = setTimeout(() => {
      const remaining = Math.ceil(deadline - performance.now());
      if (remaining > 0) {
        this.csound_message_callback(
          `Timed out early, rescheduling in ${(remaining / 1000).toFixed(3)} seconds...\n`
        );
        this._stop_timer = setTimeout(() => this.stop_and_download(), remaining);
        return; // <-- critical: do not fall through to the immediate stop
      }
      this.stop_and_download();
    }, milliseconds);
  }

  cancel_scheduled_stop() {
    if (this._stop_timer) {
      clearTimeout(this._stop_timer);
      this.csound_message_callback(`Canceled scheduled stop.\n`);
    }
    this._stop_timer = null;
  }

  /**
   * @function render
   * 
   * @memberof Cloud5Piece
   * 
   * @description Invokes Csound and/or Strudel to perform music, by default 
   * to the audio output interface, but optionally also to a local soundfile. 
   * Acts as an async member function because it is bound to this.
   * 
   * @param {Number}  gk_cloud5_performance_mode
   *
   * Possible values of gk_cloud5_performance_mode, which is sent as a control
   * channel value to Csound before performance:
   * 1. Start the Csound performance to audio out, and continue indefinitely
   *    until the user stops it manually (default).
   * 2. Start recording the audio output to the output soundfile.
   * 3. Pause recording, and automatically download the output soundfile.
   * 4. Start the Csound performance to the audio output for a fixed duration 
   *    with a fadeout, and also record the audio output to the output soundfile;
   *    when the performance has finished or is stopped, automatically download
   *    the output soundfile.
   */
  render = async function (gk_cloud5_performance_mode) {
    this.log(`render(${gk_cloud5_performance_mode})...\n`);
    this.csound = await get_csound(this.csound_message_callback);
    this.csoundac = await get_csound_ac();
    if (gk_cloud5_performance_mode == 2 || gk_cloud5_performance_mode == 4) {
      this.is_rendering = true;
    }
    if (non_csound(this.csound)) return;
    // Stop any current performance first.
    await this.stop();
    for (const overlay of this._get_all_overlays()) {
      overlay?.on_stop();
    }
    // Clear performance-related state from all components.
    await this?.log_overlay?.clear?.();
    for (const overlay of this._get_all_overlays()) {
      overlay?.on_clear();
    }
    for (const key in this.metadata) {
      const value = this.metadata[key];
      if (value !== null) {
        // CsoundAudioNode does not have the metadata facility,
        // csound.nwjs does have it.
        if (this.csound.setMetadata) {
          this.csound?.setMetadata(key, value);
        }
      }
    }
    let csd = this.csound_code_addon.slice();
    if (this.score_generator_function_addon) {
      this.score = await this.score_generator_function_addon();

    } else {
      this.score = new globalThis.csound_ac.Score();
    }
    if (this.score) {
      // Generate score from all components.
      for (const overlay of this._get_all_overlays()) {
        await overlay?.on_generate(this.score);
      }
      let csound_score = await this.score.getCsoundScore(12., false);
      csound_score = csound_score.concat("\n</CsScore>");
      csd = this.csound_code_addon.replace("</CsScore>", csound_score);
    }
    const output_soundfile_name = document.title + ".wav";
    const orc_globals = `
<CsInstruments>

; The following global variables were defined by cloud-5 and are available to 
; use in the rest of the orchestra for controlling the performance mode, 
; duration, and fadeout time of the piece.

gi_cloud5_performance_mode init ${gk_cloud5_performance_mode}
gi_cloud5_duration init ${this.duration}
gi_cloud5_fadeout init ${this.fadeout}
gS_cloud5_soundfile_name init "${output_soundfile_name}"

`
    csd = csd.replace("<CsInstruments>", orc_globals);
    // Save the .csd file so we can debug a failing orchestra,
    // instead of it just nullifying Csound.        
    const csd_filename = document.title + '-generated.csd';
    write_file(csd_filename, csd);
    try {
      let result = await this.csound.compileCsdText(csd);
      this.csound_message_callback("CompileCsdText returned: " + result + "\n");
    } catch (e) {
      alert(e);
    }
    await cloud5_save_state_if_needed(this);
    await this.csound.start();
    if (gk_cloud5_performance_mode == 4) {
      this.csound_message_callback("Csound has started rendering to " + output_soundfile_name + "...\n");
      this.schedule_stop_after(this.total_duration);
    } else {
      this.csound_message_callback("Csound is not rendering a soundfile.\n")
    }
    this.csound_message_callback("Csound has started...\n");
    // Send _current_ dat.gui parameter values to Csound 
    // before actually performing.
    this.send_parameters(this.control_parameters_addon);
    // Also save the generated .csd file again, this time with current control 
    // parameter values.
    const csd_filename_parameters = document.title + '-generated-parameters.csd';
    // Replace all values defined in global control channel init statements with the 
    // values defined in the control parameters addon.
    csd = this.update_parameters_in_csd(csd, this.control_parameters_addon);
    write_file(csd_filename_parameters, csd);
    // Start performance in all components.
    if (!(this?.csound.getNode)) {
      this.csound.perform();
      for (const overlay of this._get_all_overlays()) {
        overlay?.on_play();
      }
    }
    if (typeof strudel_view !== 'undefined') {
      if (strudel_view !== null) {
        console.info("strudel_view:", this.strudel_view);
        strudel_view?.setCsound(this.csound);
        strudel_view?.setCsoundAC(this.csoundac);
        strudel_view?.setParameters(this.control_parameters_addon);
        strudel_view?.startPlaying();
      }
    }
    this?.piano_roll_overlay?.draw_csoundac_score(this.score);
    this?.piano_roll_overlay?.show_score_time();
    this?.csound_message_callback("Csound is playing...\n");
  }
  /**
   * Stops both Csound and Strudel from performing.
   */
  stop = async function () {
    this.csound_message_callback("cloud-5 is stopping...\n");
    // Stop performance in all components.
    await this.csound.stop();
    await this.csound.cleanup();
    this.csound.reset();
    this.strudel_overlay?.stop();
    for (const overlay of this._get_all_overlays()) {
      overlay?.on_stop();
    }
    this.csound_message_callback("cloud-5 has stopped.\n");
  };

  /**
   * Helper function to show custom element overlays. Resizes overlay 
   * if required to fit layout.
   * 
   * @param {Object} overlay 
   */
  show(overlay) {
    if (!overlay) return;

    // Force visibility even if a stylesheet uses display:none !important.
    overlay.style.setProperty('display', 'block', 'important');

    const is_built_in_overlay =
      ['CLOUD5-LOG', 'CLOUD5-PIANO-ROLL', 'CLOUD5-ABOUT'].includes(overlay.tagName);

    const is_generic_overlay =
      overlay.classList && overlay.classList.contains('cloud5-overlay');

    if (is_built_in_overlay || is_generic_overlay) {
      // Use the menu bar (or its list) to determine bottom edge.
      let menu_bar = document.getElementById('main_menu');
      if (!menu_bar) {
        menu_bar = document.getElementById('main_menu_list');
      }

      let menu_bar_bottom = 0;
      if (menu_bar) {
        const rect = menu_bar.getBoundingClientRect();
        menu_bar_bottom = rect.bottom;
      }

      // Pin the overlay to fill the viewport below the menu.
      overlay.style.position = 'fixed';
      overlay.style.left = '0';
      overlay.style.right = '0';
      overlay.style.top = `${menu_bar_bottom}px`;
      overlay.style.height = `calc(100% - ${menu_bar_bottom}px)`;
      overlay.style.width = '100vw';

      // Ensure generic overlays sit above the shader but below the menu.
      if (is_generic_overlay) {
        // Only override if author CSS hasn't already set an explicit z-index.
        if (!overlay.style.zIndex) {
          overlay.style.zIndex = '1300'; // between log/score/strudel and menu
        }
      }
    }

    // If the overlay has its own hook, let it know it's now visible.
    if (typeof overlay.on_shown === 'function') {
      overlay.on_shown();
    }
  }

  /**
   * Helper function to hide custom element overlays.
   * 
   * @param {Object} overlay 
   */
  hide(overlay) {
    if (!overlay) return;
    // Force hidden even in the presence of CSS !important.
    overlay.style.setProperty('display', 'none', 'important');
    // Give overlays a chance to stop expensive work (e.g. GPU render loops)
    // while they are not visible.
    if (typeof overlay.on_hidden === 'function') {
      try { overlay.on_hidden(); } catch (e) { }
    }
  }

  /**
   * Helper function to show the overlay if it is 
   * hidden, or to hide the overlay if it is visible.
   * 
   * @param {Object} overlay 
   */
  toggle(overlay) {
    if (!overlay) return;

    const visible = overlay.checkVisibility
      ? overlay.checkVisibility()
      : getComputedStyle(overlay).display !== 'none';

    if (visible) {
      this.hide(overlay);
    } else {
      this.show(overlay);
    }
  }

  /**
   * Walks the dat.gui menu and returns a dictionary of all current
   * values of all controls in the menu.
   */
  snapshot_dat_gui_menu() {
    const snapshot = {};
    (function walk(pane, path = '') {
      pane.__controllers.forEach(ctrl => {
        const name = ctrl._name || ctrl.property;
        const key = path ? `${path}.${name}` : name;
        snapshot[key] = ctrl.object[ctrl.property];   // now committed
      });
      Object.values(pane.__folders || {}).forEach((folder, fname) => {
        walk(folder, path ? `${path}.${fname}` : fname);
      });
    })(this.gui);
    return snapshot;
  }

  create_dat_gui_menu(parameters) {
    // Preserve a single, stable parameters object instance for dat.gui bindings.
    if (!this.parameters) {
      this.parameters = this.get_default_preset();
    }

    // Merge incoming (e.g., JSON-deserialized) parameters into the existing instance.
    if (parameters) {
      apply_params_into_existing(this.parameters, parameters, {
        allow_new_keys: false,
        ignore_null: true
      });
    }

    // Create dat.gui once; do not recreate/replace DOM on subsequent updates.
    if (!this.gui) {
      let dat_gui_parameters = {
        autoPlace: false,
        closeOnTop: true,
        closed: true,
        width: 400,
        useLocalStorage: false
      };

      // Preserve your original behavior of incorporating defaults when parameters exist.
      // If you intended something else, remove/adjust this.
      if (parameters) {
        dat_gui_parameters = Object.assign(this.get_default_preset(), dat_gui_parameters);
      }

      this.gui = new dat.GUI(dat_gui_parameters);

      const dat_gui = document.getElementById('menu_item_dat_gui');
      if (dat_gui.children.length === 0) {
        dat_gui.appendChild(this.gui.domElement);
      } else if (dat_gui.children.item(0) !== this.gui.domElement) {
        // Only replace if something else is currently mounted there.
        dat_gui.replaceChild(this.gui.domElement, dat_gui.children.item(0));
      }

      // IMPORTANT: create controllers/folders ONCE here (or in a called helper),
      // and bind them to this.parameters (and its nested objects), e.g.:
      // this.gui.add(this.parameters, 'foo', 0, 1);
      // const f = this.gui.addFolder('bar');
      // f.add(this.parameters.bar, 'baz', 0, 10);
    }

    // Refresh controller displays to reflect merged values.
    update_gui_displays(this.gui);
  }

  get_default_preset() {
    if (this.#control_parameters_addon.hasOwnProperty('preset')) {
      const preset_name = this.#control_parameters_addon.preset;
      const preset = this.#control_parameters_addon.remembered[preset_name][0];
      return preset;
    } else {
      return this.#control_parameters_addon;
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
      this.csound_message_callback("Sending initial state of control perameters to Csound...\n")
      let snapshot = this.snapshot_dat_gui_menu();
      for (const [name, value] of Object.entries(parameters)) {
        this.csound_message_callback(name + ": " + value + "\n");
        this.csound?.setControlChannel(name, parseFloat(value));
      }
    }
  }
  /**
   * Replaces global variables initialized in global scope, that is, not 
   * within instr definitions, with values defined in the parameters addon
   * (from ChatGPT).
   */
  update_parameters_in_csd(csdText, parameters) {
    let inInstrBlock = false;
    let lines = csdText.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      // Detect entering/exiting an instr block
      if (/^instr\b/i.test(line)) {
        inInstrBlock = true;
      } else if (/^endin\b/i.test(line)) {
        inInstrBlock = false;
      }
      // Only modify lines outside instr blocks.
      if (!inInstrBlock) {
        // If the line contains " init " we may update it.
        let parts = line.split(' ');
        if (parts[1] === "init") {
          let parameter = parts[0]
          if (parameter in parameters) {
            let new_value = parameters[parameter];
            // If the first token is one of our parameters, we will give it a 
            // new value, and append the original line as a comment.
            let new_line = `${parameter} init ${new_value} ; Updated from: ${line}`
            lines[i] = new_line;
          }
        }
      }
    }
    return lines.join("\n");
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
    const on_parameter_change = (value) => this.gk_update(token, value);

    const ctrl = name_
      ? gui_folder.add(this.get_default_preset(), token, minimum, maximum, step).name(name_)
      : gui_folder.add(this.get_default_preset(), token, minimum, maximum, step);

    // live while dragging slider:
    ctrl.onChange(on_parameter_change);
    // commit when user finishes typing (Enter/blur):
    ctrl.onFinishChange(on_parameter_change);

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
      this.csound?.setControlChannel(name, numberValue);
    }
  };
  /**
   * Adds a user-defined onclick handler function to the Controls menu of the 
   * piece.
   * 
   * @param {Object} control_parameters_addon Dictionary containing all control parameters.
   * @param {Object} gui_folder The folder to which the command will be added.
   * @param {string} name The name of the command.
   * @param {Function} onclick User-defined function to execute the command.
   */f
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
class Cloud5PianoRoll extends Cloud5Element {
  constructor() {
    super();
    this.silencio_score = new Silencio.Score();
    this.csoundac_score = null;
    this.canvas = null;
  }

  _onWindowResize = () => {
    const visible = this.checkVisibility
      ? this.checkVisibility()
      : getComputedStyle(this).display !== 'none';
    if (!visible) return;
    requestAnimationFrame(() => this.on_shown());
  };

  connectedCallback() {
    super.connectedCallback?.();
    this.innerHTML = `
     <canvas id="display" class="cloud5-score-canvas">
    `;
    this.canvas = this.querySelector('#display');
    window.addEventListener('resize', this._onWindowResize, { passive: true });
    window.visualViewport?.addEventListener('resize', this._onWindowResize, { passive: true });
    if (this.csoundac_score !== null) {
      this.draw(this.csoundac_score);
    }
    let menu_button = document.getElementById("menu_item_piano_roll");
    menu_button.style.display = 'inline';
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this._onWindowResize);
    window.visualViewport?.removeEventListener('resize', this._onWindowResize);
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = 0;
    }
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

  update_score_time(score_time) {
    if (!this.silencio_score) return;
    this.silencio_score.progress3D(score_time);
  }

  /**
   * Called by a timer during performance to update the play 
   * position in the piano roll display.
   */

  _raf_guard = false;

  show_score_time = async () => {
    // Skip if piano-roll not visible
    const visible = this.checkVisibility
      ? this.checkVisibility()
      : getComputedStyle(this).display !== 'none';
    if (!visible) return;

    // Need a piece & Silencio score
    const piece = this.cloud5_piece;
    if (!piece || typeof piece.latest_score_time !== 'number') return;
    if (!this.silencio_score) return;

    // Throttle to one progress3D per animation frame
    if (this._raf_guard) return;
    this._raf_guard = true;
    const t = piece.latest_score_time;
    requestAnimationFrame(() => {
      this._raf_guard = false;
      this.silencio_score.progress3D(t);
    });
  };

  /**
   * Stops the timer that is updating the play position of the score.
   */
  recenter() {
    this.silencio_score.lookAtFullScore3D();
  }
  on_shown() {
    const dpr = window.devicePixelRatio || 1;
    const cssW = document.documentElement.clientWidth;
    const cssH = document.documentElement.clientHeight;
    // 2a) backing store
    this.canvas.width = Math.max(1, Math.floor(cssW * dpr));
    this.canvas.height = Math.max(1, Math.floor(cssH * dpr));
    // 2b–d) if Silencio exposes hooks; otherwise re-call draw3D
    if (this.silencio_score?.resize3D) {
      this.silencio_score.resize3D(this.canvas.width, this.canvas.height);
      if (this.silencio_score.lookAtFullScore3D) this.silencio_score.lookAtFullScore3D();
      if (this.silencio_score.redraw3D) this.silencio_score.redraw3D();
    } else {
      // Fallback: rebuild the renderer with the now-correct size
      this.silencio_score?.draw3D?.(this.canvas);
      this.silencio_score?.lookAtFullScore3D?.();
    }
  }
}
customElements.define("cloud5-piano-roll", Cloud5PianoRoll);

/**
 * Contains an instance of the Strudel REPL that can use Csound as an output,
 * and that starts and stops along wth Csound.
 */
class Cloud5Strudel extends Cloud5Element {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.innerHTML = `
    <strudel-repl-component id="strudel_view" class='cloud5-strudel-repl'>
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
  }  /**
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
 * This class is specifically designed to simplify the use of shaders 
 * developed in or adapted from the ShaderToy Web site. Other types of shader 
 * also can be used.
 */class Cloud5ShaderToy extends Cloud5Element {
  gl = null;
  shader_program = null;
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
    super.connectedCallback?.();
    this.innerHTML = `
     <canvas id="display" class="cloud5-shader-canvas">
    `;
    this.canvas = this.querySelector('#display');

    // Attach WebGL context-loss handlers to this canvas (Cloud5ShaderToy does not
    // use obtainWebGL2, so we must handle this here).
    if (!this._context_listeners_installed) {
      this._context_listeners_installed = true;
      this.canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        this._context_lost = true;
        if (this._raf) {
          cancelAnimationFrame(this._raf);
          this._raf = 0;
        }
      }, false);
      this.canvas.addEventListener('webglcontextrestored', () => {
        this._context_lost = false;
        this._rebuild_after_context_restore();
      }, false);
    }
    window.addEventListener('resize', this._onWindowResize, { passive: true });
    window.visualViewport?.addEventListener('resize', this._onWindowResize, { passive: true });
  }

  // ...rest of Cloud5ShaderToy unchanged...
  disconnectedCallback() {
    window.removeEventListener('resize', this._onWindowResize);
    window.visualViewport?.removeEventListener('resize', this._onWindowResize);
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
    requestAnimationFrame((milliseconds) => this.on_shown(milliseconds));
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
    this.gl = this.canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false });
    if (!this.gl) {
      throw new Error('WebGL2 is required for #version 300 es shaders.');
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
      let translated_shader = WEBGL_debug_shaders.getTranslatedShaderSource(shader_object);
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
    // Do not overwrite the page's global resize handler.
    this.resize();
    if (!this._raf) {
      this._raf = requestAnimationFrame((milliseconds) => this.render_frame(milliseconds));
    }
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
  async render_frame(milliseconds) {
    if (this._context_lost || !this.gl) {
      this._raf = 0;
      return;
    }
    // Here we create an AnalyserNode as soon as Csound is available.
    if (this.analyser) {
    } else {
      let csound = this?.cloud5_piece?.csound;
      if (csound) {
        var node;
        if (typeof csound.getNode == 'undefined') {
          /// node = csound;
        } else {
          node = await csound.getNode()
          this.analyser = new AnalyserNode(node.context);
          this.analyser.fftSize = 2048;
          console.info("Analyzer buffer size: " + this.analyser.frequencyBinCount);
          node.connect(this.analyser);
        }
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
    // Ï attributes may be accessed in this addon. Such attributes can be 
    // used e.g. to sample visuals and translate them to musical notes.
    if (this.post_draw_frame_function_addon) {
      this.post_draw_frame_function_addon();
    }
    this.rendering_frame++;
    this._raf = requestAnimationFrame((milliseconds) => this.render_frame(milliseconds));
  }

  on_shown() {
    if (!this.canvas) return;

    // 1) Compute visible CSS size; fall back to viewport when display:none had zeroed sizes
    const dpr = window.devicePixelRatio || 1;
    let cssW = this.clientWidth, cssH = this.clientHeight;
    if (!cssW || !cssH) { cssW = document.documentElement.clientWidth; cssH = document.documentElement.clientHeight; }

    // 2) Backing store = CSS size × DPR (>=1)
    const bw = Math.max(1, Math.floor(cssW * dpr));
    const bh = Math.max(1, Math.floor(cssH * dpr));
    if (this.canvas.width !== bw || this.canvas.height !== bh) {
      this.canvas.width = bw;
      this.canvas.height = bh;
      // keep the CSS size in sync so hit-testing/mouse coords match
      this.canvas.style.width = cssW + 'px';
      this.canvas.style.height = cssH + 'px';
      // (re)allocate any size-dependent scratch buffers if you use them
      this.image_sample_buffer = new Uint8ClampedArray(this.canvas.width * 4);
      this.prior_image_sample_buffer = new Uint8ClampedArray(this.canvas.width * 4);
    }

    // 3) Ensure GL is ready, then update viewport & size uniforms
    if (!this.gl) {
      // Your class already has these helpers:
      // - prepare_canvas() creates the context and sets up state
      // - compile_shader() builds the program
      // - get_uniforms() caches uniform locations
      // - set_attributes() binds VBOs/IBOs
      this.prepare_canvas?.();
      this.compile_shader?.();
      this.get_uniforms?.();
      this?.set_attributes?.();
    }
    if (!this.gl) return;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // ShaderToy-style uniforms if present
    if (this.shader_program) {
      this.gl.useProgram(this.shader_program);
      if (this.shader_program.iResolution) {
        // pass DPR in .z like ShaderToy (optional; many shaders ignore it)
        this.gl.uniform3f(this.shader_program.iResolution, this.canvas.width, this.canvas.height, dpr);
      }
    }

    // 4) Make sure the render loop is running
    if (!this._raf) {
      this._raf = requestAnimationFrame(ms => this.render_frame(ms));
    }
  }
  _raf = 0;
  _onWindowResize = () => {
    const visible = this.checkVisibility
      ? this.checkVisibility()
      : getComputedStyle(this).display !== 'none';
    if (!visible) return;
    requestAnimationFrame(() => this.on_shown?.());
  };

_raf = 0;
_context_lost = false;
_context_listeners_installed = false;

_rebuild_after_context_restore() {
  // GL resources are invalidated on context restore; rebuild program/buffers.
  try {
    this.prepare_canvas?.();
    this.compile_shader?.();
    this.get_uniforms?.();
    this.set_attributes?.();
    this.on_shown?.();
  } catch (e) {
    console.warn('Cloud5ShaderToy: rebuild after context restore failed:', e);
  }
}


}
customElements.define("cloud5-shadertoy", Cloud5ShaderToy);

/**
 * Displays a scrolling list of runtime messages from Csound and/or other sources.
 */
class Cloud5Log extends Cloud5Element {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.innerHTML = `<div id="console_view" class="cloud5-log-editor no-scroll"></div>`;
    this.console_editor = ace.edit("console_view");
    this.console_editor.setShowPrintMargin(false);
    this.console_editor.setDisplayIndentGuides(false);
    this.console_editor.renderer.setOption("showGutter", true);
  }

  // ...rest of Cloud5Log unchanged...
  _pin_to_bottom() {
    if (!this.console_editor) {
      return;
    }
    const editor = this.console_editor;
    const session = editor.getSession();
    const renderer = editor.renderer;
    // If the editor is hidden (display:none), scroller height can be 0.
    const scroller = renderer.scroller;
    const scrollerHeight =
      (renderer.$size && renderer.$size.scrollerHeight) ||
      (scroller && scroller.clientHeight) ||
      0;
    if (scrollerHeight <= 0) return;
    const lineHeight = renderer.lineHeight || 16;
    const totalRows = session.getLength();
    const maxY = Math.max(0, totalRows * lineHeight - scrollerHeight);
    renderer.scrollToY(maxY);
  }

  /**
   * Appends message text to the end of the editor, trimming old lines if needed.
   * @param {string} message
   */
  log(message) {
    if (!this.console_editor) return;
    const editor = this.console_editor;
    const session = editor.getSession();
    const doc = session.getDocument();
    // Trim if too large (prevent runaway memory).
    let lines = session.getLength();
    if (lines > 5000) {
      session.removeFullLines(0, 2500);
      lines = session.getLength();
    }
    // Append at end-of-document (regardless of visibility or cursor position).
    const lastRow = Math.max(0, doc.getLength() - 1);
    const lastCol = (session.getLine(lastRow) || "").length;
    session.insert({ row: lastRow, column: lastCol }, message);
    this._pin_to_bottom();
  }
}
customElements.define("cloud5-log", Cloud5Log);


/**
 * May contain license, authorship, credits, and program notes as inner HTML.
 */
class Cloud5About extends Cloud5Element {
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
 * The title of the document and of the piece is always the filename part, 
 * without extension, of the HTML file.
 */
document.title = get_filename(document.location.href)

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
      console.warn(err);
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
  // Reuse a single PBO per context rather than creating/deleting one per call.
  // Frequent buffer churn + sync readback is a common trigger for WebGL context loss.
  if (!gl.__cloud5_read_pbo) {
    gl.__cloud5_read_pbo = gl.createBuffer();
    gl.__cloud5_read_pbo_size = 0;
  }
  const buffer = gl.__cloud5_read_pbo;
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buffer);
  if ((gl.__cloud5_read_pbo_size | 0) < sample.byteLength) {
    gl.bufferData(gl.PIXEL_PACK_BUFFER, sample.byteLength, gl.DYNAMIC_READ);
    gl.__cloud5_read_pbo_size = sample.byteLength;
  }
  gl.readPixels(x, y, w, h, format, type, 0);
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
  await get_buffer_sub_data_async(gl, gl.PIXEL_PACK_BUFFER, buffer, 0, sample);
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
  * In the browser, creates a URL for a soundfile recorded by this piece.
  * All such files exist by default in the Emscripten MEMFS filesystem 
  * at '/', and are automatically downloaded to the user's Downloads 
  * directory. The filename is returned.
  * 
  * Does nothing in NW.js, where files are written directly to the 
  * local filesystem.
  * 
  * @param {Csound} csound The Csound instance.
  * @returns {string} The name of the soundfile, if successful.
  */
async function url_for_soundfile(csound) {
  try {
    if (non_csound(csound)) {
      return;
    }
    if (!csound.GetFileData) {
      console.warn("csound.GetFileData() is not available.");
      return;
    }
    let soundfile_name = document.title + ".wav";
    let mime_type = "audio/wav";
    let file_data = await csound.GetFileData(soundfile_name);
    console.info(`Offering download of "${soundfile_name}", with ${file_data.length} bytes...`);
    var a = document.createElement('a');
    a.download = soundfile_name;
    a.href = URL.createObjectURL(new Blob([file_data], { type: mime_type }));
    a.style.display = 'none';
    document.body.appendChild(a);
    requestAnimationFrame(() => a.click());
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 2000);
    return soundfile_name;
  } catch (x) {
    console.error("Download failed:", x);
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

function get_filename(pathOrUrl) {
  const parts = pathOrUrl.split('/');
  let filename = parts.pop() || parts.pop(); // handles trailing slash
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex > 0) {
    return filename.slice(0, dotIndex);
  } else {
    return filename; // No extension
  }
}

// --- Monkey-patch CsoundAC.Score with Web MIDI playback (mirrors MandelbrotJulia.playMIDIFromScore) ---
(function attachScoreMIDIPatch(root = (typeof window !== "undefined" ? window : globalThis)) {
  if (globalThis.cloud5_score_midi_patch_installed) {
    return;
  }
  globalThis.cloud5_score_midi_patch_installed = true;
  const C = globalThis?.CsoundAC;
  if (!C || !C.Score) {
    console.warn('CsoundAC.Score not found; MIDI patch skipped.');
    return;
  }

  const Score = C.Score;

  // Private-ish state keys (per-document, not exported)
  const __midi = {
    access: null,
    outIdKey: 'cloud5.midiOutId',
    playing: false,
    timers: new Set(),
    startMS: 0,
    totalBeats: 0,
  };

  function clearTimers() {
    for (const id of __midi.timers) clearTimeout(id);
    __midi.timers.clear();
  }

  function msFromBeats(beats, bpm) {
    return (beats * 60 / Math.max(20, bpm | 0)) * 1000;
  }

  async function getMIDIAccess() {
    if (__midi.access) return __midi.access;
    if (!navigator.requestMIDIAccess) throw new Error('Web MIDI not supported in this browser.');
    __midi.access = await navigator.requestMIDIAccess({ sysex: false });
    return __midi.access;
  }

  function currentMIDIOutput() {
    const acc = __midi.access;
    if (!acc) return null;
    const outs = acc.outputs;
    if (!outs || outs.size === 0) return null;

    const saved = localStorage.getItem(__midi.outIdKey);
    if (saved && outs.has(saved)) return outs.get(saved);

    // Prefer IAC / Loopback / Bus style outputs; else first available
    for (const o of outs.values()) {
      if (/iac|loop|bus/i.test(o.name)) {
        localStorage.setItem(__midi.outIdKey, o.id);
        return o;
      }
    }
    const first = outs.values().next().value;
    if (first) localStorage.setItem(__midi.outIdKey, first.id);
    return first || null;
  }

  function panicAllNotes() {
    const out = currentMIDIOutput();
    if (!out) return;
    for (let ch = 0; ch < 16; ch++) {
      out.send([0xB0 | ch, 120, 0]); // All Sound Off
      out.send([0xB0 | ch, 123, 0]); // All Notes Off
      out.send([0xB0 | ch, 121, 0]); // Reset All Controllers
      for (let k = 0; k < 128; k += 8) out.send([0x80 | ch, k, 0]);
    }
  }

  // ---------------------------
  // Class (static) helper APIs
  // ---------------------------

  /**
   * Choose an output by (partial, case-insensitive) name; falls back to first match.
   * Returns the chosen MIDIOutput or null.
   */
  Score.select_midi_output_by_name = async function (namePart) {
    await getMIDIAccess();
    const outs = __midi.access?.outputs;
    if (!outs?.size) return null;
    const lower = String(namePart || '').toLowerCase();
    for (const o of outs.values()) {
      if (o.name.toLowerCase().includes(lower)) {
        localStorage.setItem(__midi.outIdKey, o.id);
        return o;
      }
    }
    return currentMIDIOutput();
  };

  /** Get the current MIDI output (or null). */
  Score.get_current_midi_output = function () {
    return currentMIDIOutput();
  };

  /** Global stop: cancels timers and sends panic. */
  Score.stop_play_midi = function () {
    __midi.playing = false;
    __midi.totalBeats = 0;
    clearTimers();
    panicAllNotes();
  };

  /** Global panic only (does not clear timers). */
  Score.panic_midi = function () {
    panicAllNotes();
  };

  // ----------------------------------
  // Instance method: play this score
  // ----------------------------------

  /**
   * Play this CsoundAC.Score to Web MIDI.
   * @param {Object} opts
   * @param {number} [opts.bpm=120]            Beats per minute if times are in beats.
   * @param {boolean} [opts.time_is_beats=true]If false, interpret time/duration as seconds.
   */
  Score.prototype.play_midi = async function (opts = {}) {
    const { bpm = 120, time_is_beats = true } = opts;

    await getMIDIAccess();
    const out = currentMIDIOutput();
    if (!out) {
      console.warn('Score.play_midi: no MIDI outputs available.');
      return;
    }

    const n = (typeof this.size === 'function') ? this.size() : 0;
    if (!n) {
      console.warn('Score.play_midi: empty score.');
      return;
    }

    // Normalize to [ch, tBeats, dBeats, key, vel]
    const toBeat = (x) => time_is_beats ? x : (x * bpm / 60.0);
    const notes = [];

    for (let i = 0; i < n; ++i) {
      const ev = this.get(i);
      const ch = (ev.getChannel ? ev.getChannel() : ev.getInstrument?.()) | 0;
      const t = toBeat(ev.getTime ? ev.getTime() : 0);
      const d = toBeat(ev.getDuration ? ev.getDuration() : 0.25);
      const key = (ev.getKey ? ev.getKey() : 60) | 0;
      const vel = (ev.getVelocity ? ev.getVelocity() : 100) | 0;
      notes.push([(ch | 0) & 0x0F, t, d, (key | 0) & 0x7F, Math.max(1, Math.min(127, vel | 0))]);
    }

    __midi.playing = true;
    clearTimers();
    __midi.startMS = performance.now();
    __midi.totalBeats = Math.max(0, ...notes.map(n => n[1] + n[2]));
    const t0 = __midi.startMS;

    for (const [ch, tBeats, dBeats, key, vel] of notes) {
      const on = 0x90 | ch;
      const off = 0x80 | ch;
      const whenOn = t0 + msFromBeats(tBeats, bpm);
      const whenOff = t0 + msFromBeats(tBeats + dBeats, bpm);

      __midi.timers.add(setTimeout(() => {
        if (__midi.playing) out.send([on, key, vel]);
      }, Math.max(0, whenOn - performance.now())));

      __midi.timers.add(setTimeout(() => {
        if (__midi.playing) out.send([off, key, 0]);
      }, Math.max(0, whenOff - performance.now())));
    }

    // Auto-stop slightly after last note
    __midi.timers.add(setTimeout(() => Score.stop_play_midi(),
      Math.ceil(msFromBeats(__midi.totalBeats, bpm) + 50)));
  };

  // Optional: convenience alias (static) to play any score
  Score.play_midi = async function (score, opts) {
    if (!score || typeof score.play_midi !== 'function') {
      throw new Error('Score.play_midi(score, opts): invalid score object');
    }
    return score.play_midi(opts);
  };

  console.info('CsoundAC.Score MIDI monkey-patch installed.');
})();

function is_plain_object(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
  );
}

function deep_merge_into(target, patch, options = {}) {
  const {
    ignore_null = true,          // if true: JSON null does not overwrite
    overwrite_arrays = true,     // if true: arrays are replaced, not merged
    allow_new_keys = true        // if false: only update keys that already exist on target
  } = options;

  if (patch === null) {
    return target;
  }

  for (const key of Object.keys(patch)) {
    if (!allow_new_keys && !(key in target)) {
      continue;
    }

    const incoming = patch[key];
    if (incoming === null && ignore_null) {
      continue;
    }

    const current = target[key];

    if (Array.isArray(incoming)) {
      if (overwrite_arrays || !Array.isArray(current)) {
        target[key] = incoming.slice();
      } else {
        // simple “append” semantics; replace with your desired array policy
        target[key] = current.concat(incoming);
      }
      continue;
    }

    // Deep-merge plain objects into existing plain objects
    if (is_plain_object(incoming) && is_plain_object(current)) {
      deep_merge_into(current, incoming, options);
      continue;
    }

    // If the target property is a class instance and incoming is a plain object,
    // merge fields into that instance (preserves prototype/methods).
    if (is_plain_object(incoming) && current && typeof current === 'object' && !is_plain_object(current)) {
      deep_merge_into(current, incoming, options);
      continue;
    }

    // Primitive, function, Date (as string), or replacement object
    target[key] = incoming;
  }

  return target;
}

function merge_json_into_instance(instance, json_string, options) {
  const patch = JSON.parse(json_string);
  return deep_merge_into(instance, patch, options);
}

function is_object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function apply_params_into_existing(existing, incoming, options = {}) {
  const { allow_new_keys = false, ignore_null = true } = options;

  if (!is_object(incoming)) {
    return existing;
  }

  for (const key of Object.keys(incoming)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    if (!allow_new_keys && !(key in existing)) {
      continue;
    }

    const v = incoming[key];
    if (v === null && ignore_null) {
      continue;
    }

    if (is_object(v) && is_object(existing[key])) {
      apply_params_into_existing(existing[key], v, options);
    } else {
      existing[key] = v;
    }
  }

  return existing;
}

function update_gui_displays(gui) {
  if (gui.__controllers) {
    for (const c of gui.__controllers) {
      c.updateDisplay();
    }
  }
  if (gui.__folders) {
    for (const name of Object.keys(gui.__folders)) {
      update_gui_displays(gui.__folders[name]);
    }
  }
}

