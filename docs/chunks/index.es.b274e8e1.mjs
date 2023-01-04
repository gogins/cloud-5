import i, { useState, useEffect, forwardRef, useRef, useImperativeHandle, useCallback, useMemo, useLayoutEffect } from 'react';
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { EditorView, keymap, placeholder, Decoration } from '@codemirror/view';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { oneDark } from '@codemirror/theme-one-dark';
import { jsx } from 'react/jsx-runtime';
import { javascript } from '@codemirror/lang-javascript';
import { tags } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';
import { y as repl, z as transpiler, A as webaudioOutput, s as getAudioContext, B as pianoroll } from '../entry.mjs';
import { useInView } from 'react-hook-inview';
import 'react-dom/server';
import 'preact';
import 'preact-render-to-string';
import 'html-escaper';
/* empty css                          *//* empty css                         */import 'fraction.js';
import 'bjork';
import 'canvas';
import 'escodegen';
import 'acorn';
import 'estree-walker';
import '@tonaljs/tonal';
import 'chord-voicings';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var _extends$1 = {exports: {}};

(function (module) {
	function _extends() {
	  module.exports = _extends = Object.assign ? Object.assign.bind() : function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];
	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }
	    return target;
	  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
	  return _extends.apply(this, arguments);
	}
	module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;
} (_extends$1));

const _extends = /*@__PURE__*/getDefaultExportFromCjs(_extends$1.exports);

var objectWithoutPropertiesLoose = {exports: {}};

(function (module) {
	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;
	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }
	  return target;
	}
	module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
} (objectWithoutPropertiesLoose));

const _objectWithoutPropertiesLoose = /*@__PURE__*/getDefaultExportFromCjs(objectWithoutPropertiesLoose.exports);

var getStatistics = view => {
  return {
    line: view.state.doc.lineAt(view.state.selection.main.from),
    lineCount: view.state.doc.lines,
    lineBreak: view.state.lineBreak,
    length: view.state.doc.length,
    readOnly: view.state.readOnly,
    tabSize: view.state.tabSize,
    selection: view.state.selection,
    selectionAsSingle: view.state.selection.asSingle().main,
    ranges: view.state.selection.ranges,
    selectionCode: view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to),
    selections: view.state.selection.ranges.map(r => view.state.sliceDoc(r.from, r.to)),
    selectedText: view.state.selection.ranges.some(r => !r.empty)
  };
};

function useCodeMirror(props) {
  var {
    value,
    selection,
    onChange,
    onStatistics,
    onCreateEditor,
    onUpdate,
    extensions = [],
    autoFocus,
    theme = 'light',
    height = '',
    minHeight = '',
    maxHeight = '',
    placeholder: placeholderStr = '',
    width = '',
    minWidth = '',
    maxWidth = '',
    editable = true,
    readOnly = false,
    indentWithTab: defaultIndentWithTab = true,
    basicSetup: defaultBasicSetup = true,
    root,
    initialState
  } = props;
  var [container, setContainer] = useState();
  var [view, setView] = useState();
  var [state, setState] = useState();
  var defaultLightThemeOption = EditorView.theme({
    '&': {
      backgroundColor: '#fff'
    }
  }, {
    dark: false
  });
  var defaultThemeOption = EditorView.theme({
    '&': {
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth
    }
  });
  var updateListener = EditorView.updateListener.of(vu => {
    if (vu.docChanged && typeof onChange === 'function') {
      var doc = vu.state.doc;

      var _value = doc.toString();

      onChange(_value, vu);
    }

    onStatistics && onStatistics(getStatistics(vu));
  });
  var getExtensions = [updateListener, defaultThemeOption];

  if (defaultIndentWithTab) {
    getExtensions.unshift(keymap.of([indentWithTab]));
  }

  if (defaultBasicSetup) {
    if (typeof defaultBasicSetup === 'boolean') {
      getExtensions.unshift(basicSetup());
    } else {
      getExtensions.unshift(basicSetup(defaultBasicSetup));
    }
  }

  if (placeholderStr) {
    getExtensions.unshift(placeholder(placeholderStr));
  }

  switch (theme) {
    case 'light':
      getExtensions.push(defaultLightThemeOption);
      break;

    case 'dark':
      getExtensions.push(oneDark);
      break;

    default:
      getExtensions.push(theme);
      break;
  }

  if (editable === false) {
    getExtensions.push(EditorView.editable.of(false));
  }

  if (readOnly) {
    getExtensions.push(EditorState.readOnly.of(true));
  }

  if (onUpdate && typeof onUpdate === 'function') {
    getExtensions.push(EditorView.updateListener.of(onUpdate));
  }

  getExtensions = getExtensions.concat(extensions);
  useEffect(() => {
    if (container && !state) {
      var config = {
        doc: value,
        selection,
        extensions: getExtensions
      };
      var stateCurrent = initialState ? EditorState.fromJSON(initialState.json, config, initialState.fields) : EditorState.create(config);
      setState(stateCurrent);

      if (!view) {
        var viewCurrent = new EditorView({
          state: stateCurrent,
          parent: container,
          root
        });
        setView(viewCurrent);
        onCreateEditor && onCreateEditor(viewCurrent, stateCurrent);
      }
    }

    return () => {
      if (view) {
        setState(undefined);
        setView(undefined);
      }
    };
  }, [container, state]);
  useEffect(() => setContainer(props.container), [props.container]);
  useEffect(() => () => {
    if (view) {
      view.destroy();
      setView(undefined);
    }
  }, [view]);
  useEffect(() => {
    if (autoFocus && view) {
      view.focus();
    }
  }, [autoFocus, view]);
  useEffect(() => {
    if (view) {
      view.dispatch({
        effects: StateEffect.reconfigure.of(getExtensions)
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [theme, extensions, height, minHeight, maxHeight, width, minWidth, maxWidth, placeholderStr, editable, readOnly, defaultIndentWithTab, defaultBasicSetup, onChange, onUpdate]);
  useEffect(() => {
    var currentValue = view ? view.state.doc.toString() : '';

    if (view && value !== currentValue) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value || ''
        }
      });
    }
  }, [value, view]);
  return {
    state,
    setState,
    view,
    setView,
    container,
    setContainer
  };
}

var _excluded = ["className", "value", "selection", "extensions", "onChange", "onStatistics", "onCreateEditor", "onUpdate", "autoFocus", "theme", "height", "minHeight", "maxHeight", "width", "minWidth", "maxWidth", "basicSetup", "placeholder", "indentWithTab", "editable", "readOnly", "root", "initialState"];
var ReactCodeMirror = /*#__PURE__*/forwardRef((props, ref) => {
  var {
    className,
    value = '',
    selection,
    extensions = [],
    onChange,
    onStatistics,
    onCreateEditor,
    onUpdate,
    autoFocus,
    theme = 'light',
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    basicSetup,
    placeholder,
    indentWithTab,
    editable,
    readOnly,
    root,
    initialState
  } = props,
      other = _objectWithoutPropertiesLoose(props, _excluded);

  var editor = useRef(null);
  var {
    state,
    view,
    container,
    setContainer
  } = useCodeMirror({
    container: editor.current,
    root,
    value,
    autoFocus,
    theme,
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    basicSetup,
    placeholder,
    indentWithTab,
    editable,
    readOnly,
    selection,
    onChange,
    onStatistics,
    onCreateEditor,
    onUpdate,
    extensions,
    initialState
  });
  useImperativeHandle(ref, () => ({
    editor: editor.current,
    state: state,
    view: view
  }), [editor, container, state, view]); // check type of value

  if (typeof value !== 'string') {
    throw new Error("value must be typeof string but got " + typeof value);
  }

  var defaultClassNames = typeof theme === 'string' ? "cm-theme-" + theme : 'cm-theme';
  return /*#__PURE__*/jsx("div", _extends({
    ref: editor,
    className: "" + defaultClassNames + (className ? " " + className : '')
  }, other));
});
ReactCodeMirror.displayName = 'CodeMirror';

const ce = createTheme({
  theme: "dark",
  settings: {
    background: "#222",
    foreground: "#75baff",
    caret: "#ffcc00",
    selection: "rgba(128, 203, 196, 0.5)",
    selectionMatch: "#036dd626",
    lineHighlight: "#00000050",
    gutterBackground: "transparent",
    gutterForeground: "#8a919966"
  },
  styles: [
    { tag: tags.keyword, color: "#c792ea" },
    { tag: tags.operator, color: "#89ddff" },
    { tag: tags.special(tags.variableName), color: "#eeffff" },
    { tag: tags.typeName, color: "#c3e88d" },
    { tag: tags.atom, color: "#f78c6c" },
    { tag: tags.number, color: "#c3e88d" },
    { tag: tags.definition(tags.variableName), color: "#82aaff" },
    { tag: tags.string, color: "#c3e88d" },
    { tag: tags.special(tags.string), color: "#c3e88d" },
    { tag: tags.comment, color: "#7d8799" },
    { tag: tags.variableName, color: "#c792ea" },
    { tag: tags.tagName, color: "#c3e88d" },
    { tag: tags.bracket, color: "#525154" },
    { tag: tags.meta, color: "#ffcb6b" },
    { tag: tags.attributeName, color: "#c792ea" },
    { tag: tags.propertyName, color: "#c792ea" },
    { tag: tags.className, color: "#decb6b" },
    { tag: tags.invalid, color: "#ffffff" }
  ]
});
const B = StateEffect.define(), ie = StateField.define({
  create() {
    return Decoration.none;
  },
  update(e, r) {
    try {
      for (let t of r.effects)
        if (t.is(B))
          if (t.value) {
            const a = Decoration.mark({ attributes: { style: "background-color: #FFCA2880" } });
            e = Decoration.set([a.range(0, r.newDoc.length)]);
          } else
            e = Decoration.set([]);
      return e;
    } catch (t) {
      return console.warn("flash error", t), e;
    }
  },
  provide: (e) => EditorView.decorations.from(e)
}), le = (e) => {
  e.dispatch({ effects: B.of(!0) }), setTimeout(() => {
    e.dispatch({ effects: B.of(!1) });
  }, 200);
}, H = StateEffect.define(), ue = StateField.define({
  create() {
    return Decoration.none;
  },
  update(e, r) {
    try {
      for (let t of r.effects)
        if (t.is(H)) {
          const a = t.value.map(
            (n) => (n.context.locations || []).map(({ start: c, end: l }) => {
              const d = n.context.color || "#FFCA28";
              let o = r.newDoc.line(c.line).from + c.column, u = r.newDoc.line(l.line).from + l.column;
              const f = r.newDoc.length;
              return o > f || u > f ? void 0 : Decoration.mark({ attributes: { style: `outline: 1.5px solid ${d};` } }).range(o, u);
            })
          ).flat().filter(Boolean) || [];
          e = Decoration.set(a, !0);
        }
      return e;
    } catch {
      return Decoration.set([]);
    }
  },
  provide: (e) => EditorView.decorations.from(e)
}), de = [javascript(), ce, ue, ie];
function fe({ value: e, onChange: r, onViewChanged: t, onSelectionChange: a, options: n, editorDidMount: c }) {
  const l = useCallback(
    (u) => {
      r?.(u);
    },
    [r]
  ), d = useCallback(
    (u) => {
      t?.(u);
    },
    [t]
  ), o = useCallback(
    (u) => {
      u.selectionSet && a && a?.(u.state.selection);
    },
    [a]
  );
  return /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement(ReactCodeMirror, {
    value: e,
    onChange: l,
    onCreateEditor: d,
    onUpdate: o,
    extensions: de
  }));
}
function j(...e) {
  return e.filter(Boolean).join(" ");
}
function me({ view: e, pattern: r, active: t, getTime: a }) {
  const n = useRef([]), c = useRef();
  useEffect(() => {
    if (e)
      if (r && t) {
        let l = requestAnimationFrame(function d() {
          try {
            const o = a(), f = [Math.max(c.current || o, o - 1 / 10, 0), o + 1 / 60];
            c.current = f[1], n.current = n.current.filter((v) => v.whole.end > o);
            const m = r.queryArc(...f).filter((v) => v.hasOnset());
            n.current = n.current.concat(m), e.dispatch({ effects: H.of(n.current) });
          } catch {
            e.dispatch({ effects: H.of([]) });
          }
          l = requestAnimationFrame(d);
        });
        return () => {
          cancelAnimationFrame(l);
        };
      } else
        n.current = [], e.dispatch({ effects: H.of([]) });
  }, [r, t, e]);
}
function ge(e, r = !1) {
  const t = useRef(), a = useRef(), n = (d) => {
    if (a.current !== void 0) {
      const o = d - a.current;
      e(d, o);
    }
    a.current = d, t.current = requestAnimationFrame(n);
  }, c = () => {
    t.current = requestAnimationFrame(n);
  }, l = () => {
    t.current && cancelAnimationFrame(t.current), delete t.current;
  };
  return useEffect(() => {
    t.current && (l(), c());
  }, [e]), useEffect(() => (r && c(), l), []), {
    start: c,
    stop: l
  };
}
function pe({ pattern: e, started: r, getTime: t, onDraw: a }) {
  let n = useRef([]), c = useRef(null);
  const { start: l, stop: d } = ge(
    useCallback(() => {
      const o = t();
      if (c.current === null) {
        c.current = o;
        return;
      }
      const u = e.queryArc(Math.max(c.current, o - 1 / 10), o), f = 4;
      c.current = o, n.current = (n.current || []).filter((m) => m.whole.end > o - f).concat(u.filter((m) => m.hasOnset())), a(o, n.current);
    }, [e])
  );
  useEffect(() => {
    r ? l() : (n.current = [], d());
  }, [r]);
}
function he(e) {
  return useEffect(() => (window.addEventListener("message", e), () => window.removeEventListener("message", e)), [e]), useCallback((r) => window.postMessage(r, "*"), []);
}
function ve({
  defaultOutput: e,
  interval: r,
  getTime: t,
  evalOnMount: a = !1,
  initialCode: n = "",
  autolink: c = !1,
  beforeEval: l,
  afterEval: d,
  onEvalError: o,
  onToggle: u,
  canvasId: f
}) {
  const m = useMemo(() => be(), []);
  f = f || `canvas-${m}`;
  const [v, k] = useState(), [M, T] = useState(), [b, A] = useState(n), [C, S] = useState(), [z, D] = useState(), [x, L] = useState(!1), h = b !== C, { scheduler: g, evaluate: R, start: J, stop: O, pause: Q } = useMemo(
    () => repl({
      interval: r,
      defaultOutput: e,
      onSchedulerError: k,
      onEvalError: (p) => {
        T(p), o?.(p);
      },
      getTime: t,
      transpiler: transpiler,
      beforeEval: ({ code: p }) => {
        A(p), l?.();
      },
      afterEval: ({ pattern: p, code: q }) => {
        S(q), D(p), T(), k(), c && (window.location.hash = "#" + encodeURIComponent(btoa(q))), d?.();
      },
      onToggle: (p) => {
        L(p), u?.(p);
      }
    }),
    [e, r, t]
  ), X = he(({ data: { from: p, type: q } }) => {
    q === "start" && p !== m && O();
  }), P = useCallback(
    async (p = !0) => {
      await R(b, p), X({ type: "start", from: m });
    },
    [R, b]
  ), K = useRef();
  return useEffect(() => {
    !K.current && a && b && (K.current = !0, P());
  }, [P, a, b]), useEffect(() => () => {
    g.stop();
  }, [g]), {
    id: m,
    canvasId: f,
    code: b,
    setCode: A,
    error: v || M,
    schedulerError: v,
    scheduler: g,
    evalError: M,
    evaluate: R,
    activateCode: P,
    activeCode: C,
    isDirty: h,
    pattern: z,
    started: x,
    start: J,
    stop: O,
    pause: Q,
    togglePlay: async () => {
      x ? g.pause() : await P();
    }
  };
}
function be() {
  return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
}
function I({ type: e }) {
  return /* @__PURE__ */ i.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className: "sc-h-5 sc-w-5",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, {
    refresh: /* @__PURE__ */ i.createElement("path", {
      fillRule: "evenodd",
      d: "M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z",
      clipRule: "evenodd"
    }),
    play: /* @__PURE__ */ i.createElement("path", {
      fillRule: "evenodd",
      d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z",
      clipRule: "evenodd"
    }),
    pause: /* @__PURE__ */ i.createElement("path", {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z",
      clipRule: "evenodd"
    })
  }[e]);
}
const we = "_container_3i85k_1", ye = "_header_3i85k_5", Ee = "_buttons_3i85k_9", ke = "_button_3i85k_9", _e = "_buttonDisabled_3i85k_17", Fe = "_error_3i85k_21", Ce = "_body_3i85k_25", w = {
  container: we,
  header: ye,
  buttons: Ee,
  button: ke,
  buttonDisabled: _e,
  error: Fe,
  body: Ce
}, Ne = () => getAudioContext().currentTime;
function Be({ tune: e, hideOutsideView: r = !1, enableKeyboard: t, withCanvas: a = !1, canvasHeight: n = 200 }) {
  const {
    code: c,
    setCode: l,
    evaluate: d,
    activateCode: o,
    error: u,
    isDirty: f,
    activeCode: m,
    pattern: v,
    started: k,
    scheduler: M,
    togglePlay: T,
    stop: b,
    canvasId: A
  } = ve({
    initialCode: e,
    defaultOutput: webaudioOutput,
    getTime: Ne
  });
  pe({
    pattern: v,
    started: a && k,
    getTime: () => M.now(),
    onDraw: (h, g) => {
      const R = document.querySelector("#" + A).getContext("2d");
      pianoroll({ ctx: R, time: h, haps: g, autorange: 1, fold: 1, playhead: 1 });
    }
  });
  const [C, S] = useState(), [z, D] = useInView({
    threshold: 0.01
  }), x = useRef(), L = useMemo(() => ((D || !r) && (x.current = !0), D || x.current), [D, r]);
  return me({
    view: C,
    pattern: v,
    active: k && !m?.includes("strudel disable-highlighting"),
    getTime: () => M.getPhase()
  }), useLayoutEffect(() => {
    if (t) {
      const h = async (g) => {
        (g.ctrlKey || g.altKey) && (g.code === "Enter" ? (g.preventDefault(), le(C), await o()) : g.code === "Period" && (b(), g.preventDefault()));
      };
      return window.addEventListener("keydown", h, !0), () => window.removeEventListener("keydown", h, !0);
    }
  }, [t, v, c, d, b, C]), /* @__PURE__ */ i.createElement("div", {
    className: w.container,
    ref: z
  }, /* @__PURE__ */ i.createElement("div", {
    className: w.header
  }, /* @__PURE__ */ i.createElement("div", {
    className: w.buttons
  }, /* @__PURE__ */ i.createElement("button", {
    className: j(w.button, k ? "sc-animate-pulse" : ""),
    onClick: () => T()
  }, /* @__PURE__ */ i.createElement(I, {
    type: k ? "pause" : "play"
  })), /* @__PURE__ */ i.createElement("button", {
    className: j(f ? w.button : w.buttonDisabled),
    onClick: () => o()
  }, /* @__PURE__ */ i.createElement(I, {
    type: "refresh"
  }))), u && /* @__PURE__ */ i.createElement("div", {
    className: w.error
  }, u.message)), /* @__PURE__ */ i.createElement("div", {
    className: w.body
  }, L && /* @__PURE__ */ i.createElement(fe, {
    value: c,
    onChange: l,
    onViewChanged: S
  })), a && /* @__PURE__ */ i.createElement("canvas", {
    id: A,
    className: "w-full pointer-events-none",
    height: n,
    ref: (h) => {
      h && h.width !== h.clientWidth && (h.width = h.clientWidth);
    }
  }));
}
const Oe = (e) => useLayoutEffect(() => (window.addEventListener("keydown", e, !0), () => window.removeEventListener("keydown", e, !0)), [e]);

export { fe as CodeMirror, Be as MiniRepl, j as cx, le as flash, me as useHighlighting, Oe as useKeydown, he as usePostMessage, ve as useStrudel };
