class MandelbrotJulia extends Cloud5Element {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
:host {
  display: block;
  height: 100%;
  font-family: system-ui, sans-serif;
  color: #ddd;
  background: #000;
}

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.bar {
  margin: 8px 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.85rem;
}

.bar input[type="number"] {
  width: 6rem;
}

.bar input[type="range"] {
  width: 6rem;
}

.bar label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bar button {
  background: #222;
  color: #eee;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
}

.bar button:hover {
  background: #333;
}

.bar span {
  font-size: 0.78rem;
  opacity: 0.8;
}

select {
  background: #111;
  color: #ddd;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 4px 6px;
}

.canvases {
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  position: relative;
  background: #000;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}

#sel {
  position: absolute;
  border: 1px dashed #9cf;
  pointer-events: none;
  display: none;
  background: rgba(100, 150, 255, 0.15);
  box-shadow: inset 0 0 0 1px rgba(156, 206, 255, 0.25);
}

#playHead {
  position: absolute;
  width: 2px;
  background: #ff6b4a;
  opacity: 0.9;
  pointer-events: none;
  display: none;
  box-shadow: 0 0 6px rgba(255, 107, 74, 0.6);
}

pre {
  margin: 8px 12px 10px;
  padding: 8px;
  background: #121212;
  border: 1px solid #222;
  border-radius: 8px;
  max-height: 25vh;
  overflow: auto;
  font-size: 0.78rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
        `;

        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper';
        wrapper.innerHTML = `
  <div class="bar">
    <label>Exponent:
      <input id="expP" type="number" step="0.01" value="2.0">
    </label>
    <label>Max iterations  M:
      <input id="iterM" type="number" value="500">
    </label>
    <label>Max iterations  J:
      <input id="iterJ" type="number" value="1000">
    </label>
    <label>Timesteps:
      <input id="binsN" type="number" value="4096"> 
    </label>
    <label>Range:
      <input id="binsM" type="number" value="60">
    </label>
    <label>Instruments:
      <input id="binsK" type="number" value="4">
    </label>
    <label>BPM:
      <input id="bpm" type="number" value="120" min="20" max="300" step="1" style="width:4.5rem">
    </label>
    <label>Density:
      <input id="density" type="range" min="0" max="100" value="5" />
      <span id="densityVal">100%</span>
    </label>
    <label>Max voices/slice:
      <input id="maxVoices" type="number" value="4" min="1" step="1" style="width:4.5rem">
    </label>
    <label>MIDI Out:
      <select id="midiOut">
        <option value="">(no MIDI outputs)</option>
      </select>
    </label>
    <button id="btnScore">Make &amp; Play (Alt+S)</button>
    <button id="btnStop" title="Stop / panic (All Notes Off)">Stop</button>
    <span>
      Click Mandelbrot = set Julia point • Option-Click = zoom in • Shift+Option-Click = zoom out • Drag on Julia = ROI
    </span>
  </div>
  <div class="canvases" id="gridRoot">
    <canvas id="canvasM"></canvas>
    <canvas id="canvasJ"></canvas>
    <div id="sel"></div>
    <div id="playHead"></div>
  </div>
  <pre id="log">score will print here…</pre>
        `;

        this.shadowRoot.append(style, wrapper);

        this.canvasM = this.shadowRoot.getElementById('canvasM');
        this.canvasJ = this.shadowRoot.getElementById('canvasJ');
        this.sel = this.shadowRoot.getElementById('sel');
        this.playHead = this.shadowRoot.getElementById('playHead');
        this._rootDiv = this.shadowRoot.getElementById('gridRoot');

        // Defaults
        this.nTime = 4096;  // N time default
        this.nPitch = 60;   // M pitch default
        this.nInst = 4;
        this.maxIterM = 500;
        this.maxIterJ = 1000;
        this.exponent = 2.0;

        this.bpm = 120;
        this.density = 1.0;     // 0..1
        this.maxVoicesPerSlice = 999; // top-K per time slice by velocity

        // playback bookkeeping
        this._timers = [];
        this._activeAudio = new Set();
        this._playing = false;
        this._playStartMS = 0;
        this._playTotalBeats = 0;

        this.viewM = { cx: -0.5, cy: 0.0, scale: 2.5 };
        this.viewJ = { cx: 0.0, cy: 0.0, scale: 1.5 };
        this.c = { x: -0.8, y: 0.156 };
        this.roiJ = null; // {minx,maxx,miny,maxy} in Julia complex space

        // MIDI state
        this._midi = null;
        this._midiOutId = localStorage.getItem('mj.midiOutId') || '';

        this._resizeObserver = new ResizeObserver(() => {
            this.resize();
            this._updateSelectionOverlay();
            this._updatePlayheadOverlay();
        });
    }

    _stepBeats() { return 1 / 8; } // each time bin = 32nd note (1/8 of a beat)
    _secondsForBeats(beats) { return beats * 60 / Math.max(20, this.bpm | 0); }
    _beatsForMillis(ms) { return (ms / 1000) * (Math.max(20, this.bpm | 0) / 60); }
    _clearTimers() { for (const id of this._timers) clearTimeout(id); this._timers.length = 0; }

    _panicMIDI() {
        const out = this._currentMIDIOutput();
        if (!out) return;
        for (let ch = 0; ch < 16; ch++) {
            out.send([0xB0 | ch, 120, 0]); // All Sound Off
            out.send([0xB0 | ch, 123, 0]); // All Notes Off
            out.send([0xB0 | ch, 121, 0]); // Reset All Controllers
            for (let k = 0; k < 128; k += 8) out.send([0x80 | ch, k, 0]);
        }
    }

    _stopWebAudio() {
        for (const node of this._activeAudio) {
            try { node.stop(0); } catch { }
            try { node.disconnect(); } catch { }
        }
        this._activeAudio.clear();
    }

    async connectedCallback() {
        if (!('gpu' in navigator)) {
            this.shadowRoot.innerHTML = `<div style="padding:1rem;color:#f88">WebGPU not available. Use Chrome/Edge with WebGPU enabled.</div>`;
            return;
        }
        this._resizeObserver.observe(this);
        await this.initGPU();
        this.initPipelines();
        this.initInteractions();
        this.resize();
        this.render();

        // Initialize Web MIDI and prefer IAC
        this.initMIDI();
    }
    disconnectedCallback() { this._resizeObserver.disconnect(); }

    // ---------- MIDI (IAC) ----------
    async initMIDI() {
        const sel = this.shadowRoot.getElementById('midiOut');

        const rebuildOptions = () => {
            const previous = this._midiOutId;
            sel.innerHTML = '';
            const outs = this._midi ? Array.from(this._midi.outputs.values()) : [];
            if (!outs.length) {
                sel.appendChild(new Option('(no MIDI outputs)', '', true, true));
                this._midiOutId = '';
                return;
            }
            outs.sort((a, b) => {
                const ia = /iac|loop|bus/i.test(a.name) ? 0 : 1;
                const ib = /iac|loop|bus/i.test(b.name) ? 0 : 1;
                return ia - ib || a.name.localeCompare(b.name);
            });
            let toSelect = previous;
            if (!toSelect) {
                const iac = outs.find(o => /iac|loop|bus/i.test(o.name));
                if (iac) toSelect = iac.id; else toSelect = outs[0].id;
            }
            for (const o of outs) {
                const opt = new Option(o.name, o.id, false, o.id === toSelect);
                sel.appendChild(opt);
            }
            this._midiOutId = toSelect;
            localStorage.setItem('mj.midiOutId', this._midiOutId);
        };

        try {
            if (!navigator.requestMIDIAccess) throw new Error('Web MIDI not supported in this browser.');
            if (!this._midi) {
                this._midi = await navigator.requestMIDIAccess({ sysex: false });
                this._midi.addEventListener('statechange', rebuildOptions);
            }
            rebuildOptions();
        } catch (err) {
            console.warn('MIDI init failed:', err);
            sel.innerHTML = '';
            sel.appendChild(new Option('(Web MIDI unsupported)', '', true, true));
            this._midiOutId = '';
        }

        sel.addEventListener('change', () => {
            this._midiOutId = sel.value || '';
            localStorage.setItem('mj.midiOutId', this._midiOutId);
        });
    }
    _currentMIDIOutput() {
        if (!this._midi) return null;
        const outs = this._midi.outputs;
        if (!outs) return null;
        if (this._midiOutId && outs.has(this._midiOutId)) return outs.get(this._midiOutId);
        for (const o of outs.values()) if (/iac|loop|bus/i.test(o.name)) return o;
        for (const o of outs.values()) return o;
        return null;
    }

    async initGPU() {
        this.adapter = await navigator.gpu.requestAdapter();
        this.device = await this.adapter.requestDevice();
        const format = navigator.gpu.getPreferredCanvasFormat();
        this.ctxM = this.canvasM.getContext('webgpu');
        this.ctxJ = this.canvasJ.getContext('webgpu');
        this.ctxM.configure({ device: this.device, format, alphaMode: 'premultiplied' });
        this.ctxJ.configure({ device: this.device, format, alphaMode: 'premultiplied' });
        this.format = format;

        // Two separate uniform buffers (one per pass)
        this.uniformSize = 256;
        this.uniformBufM = this.device.createBuffer({
            size: this.uniformSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        this.uniformBufJ = this.device.createBuffer({
            size: this.uniformSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        // Compute uniforms buffer
        this.csUniformSize = 256;
        this.csUniformBuf = this.device.createBuffer({
            size: this.csUniformSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        // BGLs
        this.drawBGL = this.device.createBindGroupLayout({
            entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }]
        });
        this.csBGL0 = this.device.createBindGroupLayout({
            entries: [{ binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } }]
        });
        this.csBGL1 = this.device.createBindGroupLayout({
            entries: [{ binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]
        });
    }

    initPipelines() {
        const vsWGSL = /*wgsl*/`
      @vertex
      fn main(@builtin(vertex_index) vid: u32) -> @builtin(position) vec4<f32> {
        var pos = array<vec2<f32>,3>(
          vec2<f32>(-1.0, -3.0),
          vec2<f32>( 3.0,  1.0),
          vec2<f32>(-1.0,  1.0)
        );
        let p = pos[vid];
        return vec4<f32>(p, 0.0, 1.0);
      }
    `;

        const fsWGSL = /*wgsl*/`
struct DrawUniforms {
  a: vec4<f32>,  // center.xy, scale, p
  b: vec4<f32>,  // cParam.xy, viewport.xy
  c: vec4<f32>,  // maxIter, mode, aspect, 0
};
@group(0) @binding(0) var<uniform> U : DrawUniforms;

// ----- complex helpers -----
fn clog(z: vec2<f32>) -> vec2<f32> {
  let r = length(z);
  let th = atan2(z.y, z.x);
  return vec2<f32>(log(max(r, 1e-30)), th);
}
fn cexp(w: vec2<f32>) -> vec2<f32> {
  let a = exp(w.x);
  return vec2<f32>(a * cos(w.y), a * sin(w.y));
}
fn cpow(z: vec2<f32>, p: f32) -> vec2<f32> {
  let zsafe = select(z, vec2<f32>(1e-30, 0.0), all(z == vec2<f32>(0.0,0.0)));
  let w = clog(zsafe) * vec2<f32>(p, p);
  return cexp(w);
}

// ----- palettes -----
fn hsv2rgb(h: f32, s: f32, v: f32) -> vec3<f32> {
  let h6 = h * 6.0;
  let i_u = u32(floor(h6));
  let f   = h6 - floor(h6);
  let p = v * (1.0 - s);
  let q = v * (1.0 - s * f);
  let t = v * (1.0 - s * (1.0 - f));
  var rgb: vec3<f32>;
  if (i_u == 0u)      { rgb = vec3<f32>(v, t, p); }
  else if (i_u == 1u) { rgb = vec3<f32>(q, v, p); }
  else if (i_u == 2u) { rgb = vec3<f32>(p, v, t); }
  else if (i_u == 3u) { rgb = vec3<f32>(p, q, v); }
  else if (i_u == 4u) { rgb = vec3<f32>(t, p, v); }
  else                { rgb = vec3<f32>(v, p, q); }
  return rgb;
}
fn palette(t: f32) -> vec3<f32> {
  let pi = 3.141592653589793;
  let a  = vec3<f32>(0.5, 0.5, 0.5);
  let b  = vec3<f32>(0.5, 0.5, 0.5);
  let c  = vec3<f32>(1.0, 1.0, 1.0);
  let d  = vec3<f32>(0.00, 0.33, 0.67);
  return a + b * cos(2.0 * pi * (c * t + d));
}

@fragment
fn main(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let center   = U.a.xy;
  let scale    = U.a.z;
  let p        = U.a.w;
  let cParam   = U.b.xy;
  let viewport = U.b.zw;
  let maxIter  = u32(U.c.x);
  let mode     = u32(U.c.y);
  let aspect   = U.c.z;

  let ndc = (pos.xy / viewport) * 2.0 - vec2<f32>(1.0,1.0);
  var z = vec2<f32>(
    center.x + ndc.x * scale,
    center.y - ndc.y * scale / aspect
  );

  var c = vec2<f32>(0.0, 0.0);
  if (mode == 0u) {
    c = z; z = vec2<f32>(0.0, 0.0);   // Mandelbrot
  } else {
    c = cParam;                        // Julia
  }

  var n: u32 = 0u;
  let R = 4.0;
  loop {
    if (n >= maxIter) { break; }
    z = cpow(z, p) + c;
    if (dot(z,z) > R*R) { break; }
    n = n + 1u;
  }

  if (n >= maxIter) {
    return vec4<f32>(0.0, 0.0, 0.0, 1.0); // set interiors black
  }

  let r = length(z);
  let smooth_ = (f32(n) + 1.0
                 - log(max(log(max(r, 1e-30)), 1e-30)) / log(max(p, 1.0001)))
                / f32(maxIter);
  let t = clamp(pow(smooth_, 0.85), 0.0, 1.0);

  if (mode == 1u) {
    let fadeIn = clamp((t - 0.01) / 0.05, 0.0, 1.0);
    let hue = t - floor(t);
    let rainbow = hsv2rgb(hue, 1.0, 1.0);
    let toWhite = clamp((t - 0.90) / 0.08, 0.0, 1.0);
    let withWhite = mix(rainbow, vec3<f32>(1.0,1.0,1.0), toWhite);
    let col = withWhite * fadeIn;
    return vec4<f32>(col, 1.0);
  }

  let col = palette(t) * (1.0 - 0.65 * t); // darken towards black
  return vec4<f32>(col, 1.0);
}
`;

        const csWGSL = /*wgsl*/`
struct CsUniforms {
  u0: vec4<f32>, // cParam.xy, roiMin.xy
  u1: vec4<f32>, // roiMax.xy, p, maxIter (as float)
  u2: vec4<f32>, // N, M, K, ton
  u3: vec4<f32>, // gamma, -, -, -
};
@group(0) @binding(0) var<uniform> U : CsUniforms;

struct Cell { v: u32, };
@group(1) @binding(1) var<storage, read_write> GRID : array<Cell>;

fn clog(z: vec2<f32>) -> vec2<f32> {
  let r = length(z);
  let th = atan2(z.y, z.x);
  return vec2<f32>(log(max(r, 1e-30)), th);
}
fn cexp(w: vec2<f32>) -> vec2<f32> {
  let a = exp(w.x);
  return vec2<f32>(a * cos(w.y), a * sin(w.y));
}
fn cpow(z: vec2<f32>, p: f32) -> vec2<f32> {
  let w = clog(z) * vec2<f32>(p, p);
  return cexp(w);
}

@compute @workgroup_size(8,8,1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let N = u32(U.u2.x);
  let M = u32(U.u2.y);
  let K = u32(U.u2.z);
  if (gid.x >= N || gid.y >= M) { return; }

  let cParam = U.u0.xy;
  let roiMin = U.u0.zw;
  let roiMax = U.u1.xy;
  let p      = U.u1.z;
  let maxIter= u32(U.u1.w);
  let ton    = U.u2.w;
  let gamma  = U.u3.x;

  let tx = (f32(gid.x) + 0.5) / f32(N);
  let ty = (f32(gid.y) + 0.5) / f32(M);
  let z0 = vec2<f32>(
    mix(roiMin.x, roiMax.x, tx),
    mix(roiMin.y, roiMax.y, ty)   // low pitch (j=0) -> bottom (miny)
  );
  var z = z0;
  var th_prev = atan2(z.y, z.x);
  var sumTh = 0.0;

  var n: u32 = 0u;
  let R = 4.0;
  loop {
    if (n >= maxIter) { break; }
    let zsafe = select(z, vec2<f32>(1e-30, 0.0), all(z == vec2<f32>(0.0,0.0)));
    let zp = cpow(zsafe, p) + cParam;
    let th = atan2(zp.y, zp.x);
    var dth = th - th_prev;
    if (dth >  3.14159265) { dth -= 6.2831853; }
    if (dth < -3.14159265) { dth += 6.2831853; }
    sumTh += dth;
    z = zp;
    n = n + 1u;
    if (dot(z,z) > R*R) { break; }
    th_prev = th;
  }

  var tvel = 1.0;
  if (n < maxIter) {
    let r = length(z);
    tvel = clamp(
      (f32(n) + 1.0 - log(max(log(max(r, 1e-30)), 1e-30)) / log(max(p, 1.0001)))
      / f32(maxIter), 0.0, 1.0);
  }
  let vel = u32(clamp(1.0 + 126.0 * pow(tvel, gamma), 1.0, 127.0));
  let on  = select(0u, 1u, tvel >= ton);

  let tRot = fract(sumTh / 6.2831853);
  let inst = u32(min(floor(tRot * f32(K)), f32(K - 1u)));

  let packed = (on & 0xffu) | ((vel & 0xffu) << 8u) | ((inst & 0xffu) << 16u);
  let idx = gid.x * M + gid.y;
  GRID[idx].v = packed;
}
    `;

        this.shaderVS = this.device.createShaderModule({ code: vsWGSL });
        this.shaderFS = this.device.createShaderModule({ code: fsWGSL });
        this.shaderCS = this.device.createShaderModule({ code: csWGSL });

        this.pipeline = this.device.createRenderPipeline({
            layout: this.device.createPipelineLayout({ bindGroupLayouts: [this.drawBGL] }),
            vertex: { module: this.shaderVS, entryPoint: 'main' },
            fragment: { module: this.shaderFS, entryPoint: 'main', targets: [{ format: this.format }] },
            primitive: { topology: 'triangle-list' }
        });

        // Two draw bind groups (one per canvas)
        this.drawBindGroupM = this.device.createBindGroup({
            layout: this.drawBGL,
            entries: [{ binding: 0, resource: { buffer: this.uniformBufM } }]
        });
        this.drawBindGroupJ = this.device.createBindGroup({
            layout: this.drawBGL,
            entries: [{ binding: 0, resource: { buffer: this.uniformBufJ } }]
        });

        this.csPipeline = this.device.createComputePipeline({
            layout: this.device.createPipelineLayout({ bindGroupLayouts: [this.csBGL0, this.csBGL1] }),
            compute: { module: this.shaderCS, entryPoint: 'main' }
        });
    }

    // ------- uniforms writers (vec4-only) -------
    writeDrawUniforms({ mode, canvas, center, scale, maxIter, cParam, targetBuffer }) {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const w = Math.floor(canvas.clientWidth * dpr);
        const h = Math.floor(canvas.clientHeight * dpr);
        const aspect = w / Math.max(1, h);

        const f = new Float32Array(12);
        f[0] = center.cx; f[1] = center.cy; f[2] = scale; f[3] = this.exponent;
        f[4] = cParam?.x ?? 0; f[5] = cParam?.y ?? 0; f[6] = w; f[7] = h;
        f[8] = maxIter; f[9] = mode; f[10] = aspect; f[11] = 0;

        this.device.queue.writeBuffer(targetBuffer, 0, f.buffer);
        return { w, h };
    }

    writeComputeUniforms(roi, N, M, K) {
        const ton = 0.2, gamma = 0.9;
        const f = new Float32Array(16);
        f[0] = this.c.x; f[1] = this.c.y; f[2] = roi.minx; f[3] = roi.miny;
        f[4] = roi.maxx; f[5] = roi.maxy; f[6] = this.exponent; f[7] = this.maxIterJ;
        f[8] = N; f[9] = M; f[10] = K; f[11] = ton;
        f[12] = gamma; f[13] = 0; f[14] = 0; f[15] = 0;
        this.device.queue.writeBuffer(this.csUniformBuf, 0, f.buffer);
    }

    resize() {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        for (const c of [this.canvasM, this.canvasJ]) {
            const w = Math.floor(c.clientWidth * dpr), h = Math.floor(c.clientHeight * dpr);
            if (w && h && (c.width !== w || c.height !== h)) { c.width = w; c.height = h; }
        }
    }

    render() {
        const enc = this.device.createCommandEncoder();

        // Mandelbrot (left)
        this.writeDrawUniforms({
            mode: 0, canvas: this.canvasM,
            center: this.viewM, scale: this.viewM.scale,
            maxIter: this.maxIterM, cParam: null, targetBuffer: this.uniformBufM
        });
        const passM = enc.beginRenderPass({
            colorAttachments: [{
                view: this.ctxM.getCurrentTexture().createView(),
                loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 }
            }]
        });
        passM.setPipeline(this.pipeline);
        passM.setBindGroup(0, this.drawBindGroupM);
        passM.draw(3, 1, 0, 0);
        passM.end();

        // Julia (right)
        this.writeDrawUniforms({
            mode: 1, canvas: this.canvasJ,
            center: this.viewJ, scale: this.viewJ.scale,
            maxIter: this.maxIterJ, cParam: this.c, targetBuffer: this.uniformBufJ
        });
        const passJ = enc.beginRenderPass({
            colorAttachments: [{
                view: this.ctxJ.getCurrentTexture().createView(),
                loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 }
            }]
        });
        passJ.setPipeline(this.pipeline);
        passJ.setBindGroup(0, this.drawBindGroupJ);
        passJ.draw(3, 1, 0, 0);
        passJ.end();

        this.device.queue.submit([enc.finish()]);

        // Keep overlays aligned every frame
        this._updateSelectionOverlay();
        this._updatePlayheadOverlay();

        requestAnimationFrame(() => this.render());
    }

    // ---- Overlay helpers ----
    _complexToCanvasCss(x, y) {
        const rJ = this.canvasJ.getBoundingClientRect();
        const rRoot = this._rootDiv.getBoundingClientRect();
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const w = Math.max(1, this.canvasJ.width), h = Math.max(1, this.canvasJ.height);
        const aspect = w / h;

        const ndcX = (x - this.viewJ.cx) / this.viewJ.scale;             // -1..1
        const ndcY = - (y - this.viewJ.cy) * (aspect / this.viewJ.scale);
        const pxX = (ndcX * 0.5 + 0.5) * w;                               // device px
        const pxY = (ndcY * 0.5 + 0.5) * h;

        const cssX = rJ.left - rRoot.left + pxX / dpr;
        const cssY = rJ.top - rRoot.top + pxY / dpr;
        return { x: cssX, y: cssY };
    }

    _updateSelectionOverlay() {
        if (!this.roiJ) { this.sel.style.display = 'none'; return; }
        const { minx, maxx, miny, maxy } = this.roiJ;
        const a = this._complexToCanvasCss(minx, maxy); // top-left
        const b = this._complexToCanvasCss(maxx, miny); // bottom-right
        const L = Math.min(a.x, b.x), T = Math.min(a.y, b.y);
        const W = Math.abs(b.x - a.x), H = Math.abs(b.y - a.y);
        Object.assign(this.sel.style, {
            display: 'block',
            left: `${L}px`,
            top: `${T}px`,
            width: `${W}px`,
            height: `${H}px`,
        });
    }

    _updatePlayheadOverlay() {
        if (!this._playing || this._playTotalBeats <= 0) {
            this.playHead.style.display = 'none';
            return;
        }
        // Compute elapsed beats since start
        const now = performance.now();
        const elapsedBeats = this._beatsForMillis(now - this._playStartMS);
        const frac = Math.max(0, Math.min(1, elapsedBeats / this._playTotalBeats));

        // Use ROI if present; otherwise use full Julia viewport bounds
        const roi = this.roiJ ?? {
            minx: this.viewJ.cx - this.viewJ.scale,
            maxx: this.viewJ.cx + this.viewJ.scale,
            miny: this.viewJ.cy - this.viewJ.scale,
            maxy: this.viewJ.cy + this.viewJ.scale
        };

        const topLeft = this._complexToCanvasCss(roi.minx, roi.maxy);
        const botRight = this._complexToCanvasCss(roi.maxx, roi.miny);
        const L = Math.min(topLeft.x, botRight.x);
        const T = Math.min(topLeft.y, botRight.y);
        const W = Math.abs(botRight.x - topLeft.x);
        const H = Math.abs(botRight.y - topLeft.y);

        const x = L + W * frac;
        Object.assign(this.playHead.style, {
            display: 'block',
            left: `${Math.round(x)}px`,
            top: `${T}px`,
            height: `${H}px`,
        });

        // Hide after the sweep completes
        if (frac >= 1) this.playHead.style.display = 'none';
    }

    initInteractions() {
        const pIn = this.shadowRoot.getElementById('expP');
        const mIn = this.shadowRoot.getElementById('iterM');
        const jIn = this.shadowRoot.getElementById('iterJ');
        const nIn = this.shadowRoot.getElementById('binsN');
        const MIn = this.shadowRoot.getElementById('binsM');
        const kIn = this.shadowRoot.getElementById('binsK');
        const btnS = this.shadowRoot.getElementById('btnScore');
        const bpmIn = this.shadowRoot.getElementById('bpm');
        const denIn = this.shadowRoot.getElementById('density');
        const denVal = this.shadowRoot.getElementById('densityVal');
        const maxVIn = this.shadowRoot.getElementById('maxVoices');
        const btnStop = this.shadowRoot.getElementById('btnStop');

        const sync = () => {
            this.exponent = Math.max(1.0001, parseFloat(pIn.value) || 2.0);
            this.maxIterM = parseInt(mIn.value);
            this.maxIterJ = parseInt(jIn.value);
            this.nTime = parseInt(nIn.value);
            this.nPitch = parseInt(MIn.value);
            this.nInst = parseInt(kIn.value);

            this.bpm = Math.max(20, Math.min(300, parseInt(bpmIn.value) || 120));
            this.density = Math.max(0, Math.min(1, (parseInt(denIn.value) || 100) / 100));
            denVal.textContent = `${Math.round(this.density * 100)}%`;
            this.maxVoicesPerSlice = Math.max(1, parseInt(maxVIn.value) || 999);
        };
        [pIn, mIn, jIn, nIn, MIn, kIn, bpmIn, denIn, maxVIn].forEach(e => e.addEventListener('input', sync));
        sync();

        btnStop.addEventListener('click', () => this.stopPlayback());

        // --- Mandelbrot click/zoom ---
        this.canvasM.addEventListener('click', (e) => {
            const { altKey, shiftKey } = e;
            const dpr = Math.max(1, window.devicePixelRatio || 1);
            const rect = this.canvasM.getBoundingClientRect();
            const x = (e.clientX - rect.left) * dpr;
            const y = (e.clientY - rect.top) * dpr;
            const w = this.canvasM.width, h = this.canvasM.height;
            const ndc = { x: x / w * 2 - 1, y: y / h * 2 - 1 };
            const aspect = w / Math.max(1, h);

            const zx = this.viewM.cx + ndc.x * this.viewM.scale;
            const zy = this.viewM.cy - ndc.y * this.viewM.scale / aspect;

            this.c = { x: zx, y: zy };

            if (altKey && shiftKey) {
                this.viewM.cx = zx; this.viewM.cy = zy;
                this.viewM.scale *= 1.5;
            } else if (altKey) {
                this.viewM.cx = zx; this.viewM.cy = zy;
                this.viewM.scale *= 0.6667;
            }

            // Keep Julia centered logically (we just set c); selection overlay will re-map itself each frame
            this._updateSelectionOverlay();
        });

        // --- Julia drag ROI (lasso persists) ---
        let dragging = false;
        let startPx = { x: 0, y: 0 };
        let curPx = { x: 0, y: 0 };

        const beginDrag = (e) => {
            if (e.button !== 0) return;
            dragging = true;
            const rJ = this.canvasJ.getBoundingClientRect();
            startPx.x = e.clientX;
            startPx.y = e.clientY;
            curPx.x = e.clientX;
            curPx.y = e.clientY;
            this.sel.style.display = 'block';
            this._placeSelRect(rJ, startPx, curPx);
            e.preventDefault();
        };
        const moveDrag = (e) => {
            if (!dragging) return;
            const rJ = this.canvasJ.getBoundingClientRect();
            curPx.x = Math.min(Math.max(e.clientX, rJ.left), rJ.right);
            curPx.y = Math.min(Math.max(e.clientY, rJ.top), rJ.bottom);
            this._placeSelRect(rJ, startPx, curPx);
        };
        const endDrag = (e) => {
            if (!dragging) return;
            dragging = false;
            const rJ = this.canvasJ.getBoundingClientRect();
            const dpr = Math.max(1, window.devicePixelRatio || 1);
            const x0 = (Math.min(startPx.x, curPx.x) - rJ.left) * dpr;
            const y0 = (Math.min(startPx.y, curPx.y) - rJ.top) * dpr;
            const x1 = (Math.max(startPx.x, curPx.x) - rJ.left) * dpr;
            const y1 = (Math.max(startPx.y, curPx.y) - rJ.top) * dpr;

            if (Math.abs(x1 - x0) < 3 || Math.abs(y1 - y0) < 3) return;

            const w = this.canvasJ.width, h = this.canvasJ.height;
            const aspect = w / Math.max(1, h);

            const toComplex = (px, py) => {
                const ndcX = px / w * 2 - 1;
                const ndcY = py / h * 2 - 1;
                return {
                    x: this.viewJ.cx + ndcX * this.viewJ.scale,
                    y: this.viewJ.cy - ndcY * this.viewJ.scale / aspect
                };
            };

            const zA = toComplex(x0, y0);
            const zB = toComplex(x1, y1);
            this.roiJ = {
                minx: Math.min(zA.x, zB.x),
                maxx: Math.max(zA.x, zB.x),
                miny: Math.min(zA.y, zB.y),
                maxy: Math.max(zA.y, zB.y),
            };

            // Do NOT hide the lasso; keep it visible
            this._updateSelectionOverlay();
        };

        this.canvasJ.addEventListener('mousedown', beginDrag);
        window.addEventListener('mousemove', moveDrag);
        window.addEventListener('mouseup', endDrag);

        // --- Hotkeys ---
        window.addEventListener('keydown', async (e) => {
            const key = (e.key || '').toLowerCase();

            if ((key === 's') && (e.altKey || e.metaKey)) {
                e.preventDefault(); e.stopPropagation();
                const score = this.makeScore(); // auto-download happens there
                this.playMIDIFromScore();
            }

            if ((key === 'r') && (e.altKey || e.metaKey)) {
                e.preventDefault(); e.stopPropagation();
                this.roiJ = null;
                this.sel.style.display = 'none';
            }

            if ((key === 'm') && (e.altKey && e.ctrlKey)) {
                e.preventDefault(); e.stopPropagation();
                this.playMIDIFromScore();
            }
        }, { capture: true });

        btnS.addEventListener('click', () => { this.makeScore(); this.playMIDIFromScore(); });
    }

    _placeSelRect(rJ, startPx, curPx) {
        const rRoot = this._rootDiv.getBoundingClientRect();
        const left = Math.min(startPx.x, curPx.x) - rRoot.left;
        const top = Math.min(startPx.y, curPx.y) - rRoot.top;
        const width = Math.abs(curPx.x - startPx.x);
        const height = Math.abs(curPx.y - startPx.y);

        const jl = rJ.left - rRoot.left, jt = rJ.top - rRoot.top;
        const jr = rJ.right - rRoot.left, jb = rJ.bottom - rRoot.top;
        const L = Math.max(left, jl);
        const T = Math.max(top, jt);
        const R = Math.min(left + width, jr);
        const B = Math.min(top + height, jb);

        Object.assign(this.sel.style, {
            left: `${L}px`,
            top: `${T}px`,
            width: `${Math.max(0, R - L)}px`,
            height: `${Math.max(0, B - T)}px`,
        });
    }

    async makeScore() {
        const N = this.nTime, M = this.nPitch, K = this.nInst;
        const roi = this.roiJ ?? {
            minx: this.viewJ.cx - this.viewJ.scale,
            maxx: this.viewJ.cx + this.viewJ.scale,
            miny: this.viewJ.cy - this.viewJ.scale,
            maxy: this.viewJ.cy + this.viewJ.scale
        };
        this.writeComputeUniforms(roi, N, M, K);

        const gridSize = N * M * 4;
        const grid = this.device.createBuffer({ size: gridSize, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC });
        const csBG0 = this.device.createBindGroup({ layout: this.csBGL0, entries: [{ binding: 0, resource: { buffer: this.csUniformBuf } }] });
        const csBG1 = this.device.createBindGroup({ layout: this.csBGL1, entries: [{ binding: 1, resource: { buffer: grid } }] });

        const enc = this.device.createCommandEncoder();
        const pass = enc.beginComputePass();
        pass.setPipeline(this.csPipeline);
        pass.setBindGroup(0, csBG0);
        pass.setBindGroup(1, csBG1);
        pass.dispatchWorkgroups(Math.ceil(N / 8), Math.ceil(M / 8), 1);
        pass.end();

        const readBuf = this.device.createBuffer({ size: gridSize, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
        enc.copyBufferToBuffer(grid, 0, readBuf, 0, gridSize);
        this.device.queue.submit([enc.finish()]);
        await readBuf.mapAsync(GPUMapMode.READ);
        const u32grid = new Uint32Array(readBuf.getMappedRange().slice(0));
        readBuf.unmap();

        const dtBeats = this._stepBeats(); // 1/8 beat per time bin
        const pmin = 36;
        const active = Array.from({ length: N }, _ => new Uint8Array(M));
        const vel = Array.from({ length: N }, _ => new Uint8Array(M));
        const inst = Array.from({ length: N }, _ => new Uint8Array(M));
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < M; j++) {
                const v = u32grid[i * M + j];
                active[i][j] = v & 0xFF;
                vel[i][j] = (v >>> 8) & 0xFF;
                inst[i][j] = (v >>> 16) & 0xFF;
            }
        }

        // --- Adaptive per-slice normalization of density ---
        const perSliceKeep = Math.max(1, Math.min(this.maxVoicesPerSlice, Math.round(this.density * M)));
        for (let i = 0; i < N; i++) {
            const pairs = new Array(M);
            for (let j = 0; j < M; j++) pairs[j] = [j, vel[i][j]];
            pairs.sort((a, b) => (b[1] | 0) - (a[1] | 0));
            const cutoff = pairs[Math.min(perSliceKeep - 1, pairs.length - 1)][1] | 0;
            for (let j = 0; j < M; j++) active[i][j] = (vel[i][j] | 0) >= cutoff ? 1 : 0;
        }

        const runOn = Array.from({ length: M }, _ => Array(K).fill(false));
        const runI0 = Array.from({ length: M }, _ => Array(K).fill(0));
        const runVmax = Array.from({ length: M }, _ => Array(K).fill(0));
        const score = [];

        for (let i = 0; i <= N; i++) {
            for (let j = 0; j < M; j++) {
                const on = (i < N) ? active[i][j] : 0;
                const vv = (i < N) ? vel[i][j] : 0;
                const kk = (i < N) ? inst[i][j] : 0;

                for (let k = 0; k < K; k++) {
                    if (runOn[j][k] && (i === N || k !== kk || !on)) {
                        const i0 = runI0[j][k], i1 = i - 1;
                        score.push([k, i0 * dtBeats, (i1 - i0 + 1) * dtBeats, pmin + j, runVmax[j][k]]);
                        runOn[j][k] = false;
                    }
                }
                if (i < N && on) {
                    if (!runOn[j][kk]) { runOn[j][kk] = true; runI0[j][kk] = i; runVmax[j][kk] = vv; }
                    else { runVmax[j][kk] = Math.max(runVmax[j][kk], vv); }
                }
            }
        }

        const log = this.shadowRoot.getElementById('log');
        log.textContent = `Score notes: ${score.length}\n` +
            score.slice(0, 32).map(n => JSON.stringify(n)).join('\n') +
            (score.length > 32 ? `\n… (${score.length - 32} more)` : '');
        console.log('SCORE [instrument, time, duration, key, velocity]:', score);
        const thinned = this._thinScore(score);
        this._lastScore = thinned;

        // Auto export & download: MIDI + JSON snapshot (paired by timestamp)
        try {
            const effectiveROI = roi;
            const state = this._collectState(effectiveROI);
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            this._exportMIDI(thinned, ts);
            this._exportStateJSON(state, ts);
        } catch (e) {
            console.warn('Export failed:', e);
        }

        return thinned;
    }

    _thinScore(score) {
        if (!score.length) return score;
        const keep = [];
        const q = new Map(); // integer slice index -> array of notes
        for (const n of score) {
            const [ch, t, d, key, vel] = n;
            const tKey = Math.round(t / this._stepBeats());
            if (!q.has(tKey)) q.set(tKey, []);
            q.get(tKey).push(n);
        }
        for (const [, arr] of q.entries()) {
            arr.sort((a, b) => (b[4] | 0) - (a[4] | 0));
            const top = arr.slice(0, this.maxVoicesPerSlice);
            keep.push(...top);
        }
        keep.sort((a, b) => a[1] - b[1] || a[0] - b[0] || a[3] - b[3]);
        return keep;
    }

    getScore() { return this._lastScore ?? []; }

    async playMIDIFromScore() {
        const score = await this.makeScore();
        if (!Array.isArray(score) || !score.length) { console.warn('No score to play'); return; }

        this._playing = true;
        this._clearTimers();

        const out = this._currentMIDIOutput();
        const step = (beats) => this._secondsForBeats(beats) * 1000; // ms

        this._playStartMS = performance.now();
        this._playTotalBeats = Math.max(0, ...score.map(n => n[1] + n[2]));

        if (out) {
            const t0 = this._playStartMS;
            for (const [ch, tBeats, dBeats, key, vel] of score) {
                const c = (ch | 0) & 0x0f;
                const on = 0x90 | c;
                const off = 0x80 | c;
                const whenOn = t0 + step(tBeats);
                const whenOff = t0 + step(tBeats + dBeats);

                this._timers.push(setTimeout(() => { if (this._playing) out.send([on, key & 0x7f, Math.max(1, Math.min(127, vel | 0))]); }, Math.max(0, whenOn - performance.now())));
                this._timers.push(setTimeout(() => { if (this._playing) out.send([off, key & 0x7f, 0]); }, Math.max(0, whenOff - performance.now())));
            }
            this._timers.push(setTimeout(() => this.stopPlayback(), Math.ceil(step(this._playTotalBeats) + 50)));
            return;
        }

        // ---- WebAudio fallback ----
        if (!this._audio) {
            this._audio = new (window.AudioContext || window.webkitAudioContext)();
            this._master = this._audio.createGain();
            this._master.gain.value = 0.2;
            this._master.connect(this._audio.destination);
        }
        const ac = this._audio;
        const start = ac.currentTime;
        const mtof = (n) => 440 * Math.pow(2, (n - 69) / 12);

        for (const [_ch, tBeats, dBeats, key, vel] of score) {
            const t0 = start + this._secondsForBeats(tBeats);
            const t1 = t0 + this._secondsForBeats(dBeats);
            const osc = ac.createOscillator();
            const amp = ac.createGain();
            const v = Math.max(0.02, Math.min(1, (vel | 0) / 127));
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(mtof(key | 0), t0);
            amp.gain.setValueAtTime(0.0001, t0);
            amp.gain.linearRampToValueAtTime(v, t0 + 0.01);
            amp.gain.exponentialRampToValueAtTime(0.001, t1);
            osc.connect(amp).connect(this._master);
            osc.start(t0);
            osc.stop(t1 + 0.05);
            this._activeAudio.add(osc);
            this._timers.push(setTimeout(() => this._activeAudio.delete(osc), Math.ceil((t1 - ac.currentTime + 0.1) * 1000)));
        }
        this._timers.push(setTimeout(() => this.stopPlayback(), Math.ceil(this._secondsForBeats(this._playTotalBeats) * 1000 + 50)));
    }

    stopPlayback() {
        this._playing = false;
        this._playTotalBeats = 0;
        this.playHead.style.display = 'none';
        this._clearTimers();
        this._panicMIDI();
        this._stopWebAudio();
    }

    _timestamp() {
        return new Date().toISOString().replace(/[:.]/g, '-');
    }

    _collectState(roi) {
        const s = this._currentState();
        if (roi) s.roiJ = { ...roi };
        s.timestamp = this._timestamp();
        return s;
    }

    _currentState() {
        const roi = this.roiJ ?? {
            minx: this.viewJ.cx - this.viewJ.scale,
            maxx: this.viewJ.cx + this.viewJ.scale,
            miny: this.viewJ.cy - this.viewJ.scale,
            maxy: this.viewJ.cy + this.viewJ.scale
        };
        const outName = this._currentMIDIOutput();
        return {
            timestamp: new Date().toISOString(),
            exponent: this.exponent,
            maxIterM: this.maxIterM,
            maxIterJ: this.maxIterJ,
            nTime: this.nTime,
            nPitch: this.nPitch,
            nInst: this.nInst,
            bpm: this.bpm,
            density: this.density,
            maxVoicesPerSlice: this.maxVoicesPerSlice,
            stepBeats: this._stepBeats(),
            viewM: { ...this.viewM },
            viewJ: { ...this.viewJ },
            c: { ...this.c },
            roiJ: this.roiJ ? { ...this.roiJ } : null,
            midiOutId: this._midiOutId || null,
            midiOutName: outName ? outName.name : null,
            version: 1
        };
    }

    _exportStateJSON(state, baseName) {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${baseName}.json`;
        this.shadowRoot.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000);
    }

    // --------- MIDI file export ---------
    _exportMIDI(score, baseName) {
        if (!score || !score.length) return;
        const PPQ = 480;
        const tempoMicro = Math.round(60000000 / Math.max(20, this.bpm | 0));

        const events = [];
        for (const [ch, tBeats, dBeats, key, vel] of score) {
            const start = Math.max(0, Math.round(tBeats * PPQ));
            const end = Math.max(start + 1, Math.round((tBeats + dBeats) * PPQ));
            const c = (ch | 0) & 0x0f;
            const v = Math.max(1, Math.min(127, vel | 0));
            events.push({ tick: start, type: 1, ch: c, key: key & 0x7f, vel: v });
            events.push({ tick: end, type: 0, ch: c, key: key & 0x7f, vel: 0 });
        }
        events.sort((a, b) => a.tick - b.tick || a.type - b.type);

        const VLQ = (n) => {
            let buffer = n & 0x7f;
            const bytes = [];
            while ((n >>= 7)) { buffer <<= 8; buffer |= ((n & 0x7f) | 0x80); }
            while (true) { bytes.push(buffer & 0xff); if (buffer & 0x80) buffer >>= 8; else break; }
            return bytes;
        };

        const track = [];
        const push = (...xs) => track.push(...xs);

        push(...VLQ(0), 0xFF, 0x51, 0x03,
            (tempoMicro >> 16) & 0xFF,
            (tempoMicro >> 8) & 0xFF,
            tempoMicro & 0xFF);

        let lastTick = 0;
        for (const ev of events) {
            const dt = ev.tick - lastTick; lastTick = ev.tick;
            push(...VLQ(dt));
            if (ev.type === 1) {
                push(0x90 | ev.ch, ev.key, ev.vel);
            } else {
                push(0x80 | ev.ch, ev.key, 0);
            }
        }
        push(...VLQ(0), 0xFF, 0x2F, 0x00);

        const header = new Uint8Array([
            0x4d, 0x54, 0x68, 0x64,
            0x00, 0x00, 0x00, 0x06,
            0x00, 0x00,
            0x00, 0x01,
            (PPQ >> 8) & 0xFF, PPQ & 0xFF,
        ]);
        const trkLen = track.length;
        const trkHeader = new Uint8Array([
            0x4d, 0x54, 0x72, 0x6b,
            (trkLen >>> 24) & 0xFF, (trkLen >>> 16) & 0xFF, (trkLen >>> 8) & 0xFF, trkLen & 0xFF,
        ]);
        const bytes = new Uint8Array(header.length + trkHeader.length + trkLen);
        bytes.set(header, 0);
        bytes.set(trkHeader, header.length);
        bytes.set(new Uint8Array(track), header.length + trkHeader.length);

        const blob = new Blob([bytes], { type: 'audio/midi' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = baseName || new Date().toISOString().replace(/[:.]/g, '-');
        a.href = url;
        a.download = `mandelbrot-julia-${ts}.mid`;
        this.shadowRoot.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000);
    }

    async on_generate()
    {
      const generated_score = await this.makeScore();
      // Layout of this score's notes is: [channel, startBeat, durationBeats, midiKey, velocity]
      // Signature of append_note is:
      // virtual void append_note(double time, double duration, double status, double instrument, double key, double velocity, double phase=0, double pan=0, double depth=0, double height=0, double pitches=4095);
      for (const note of generated_score) {
        this.cloud5_piece.score.append(note[1], note[2], 144, note[0], note[3], note[4], 0, 0, 0, 0, 4095);
      }
    }
}

customElements.define('mandelbrot-julia', MandelbrotJulia);
