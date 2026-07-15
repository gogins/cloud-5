/*jshint nomen: true */
/**
 @description PARAMETRIC LINDENMAYER SYSTEM

Copyright (C) 2014, 2024 by Michael Gogins

This software is licensed under the terms of the
GNU Lesser General Public License

Part of cloud-5, a browser-based algorithmic music composition system for 
Csound and Strudel.

For more complete documentation, see PLSYSTEM.md.
*/

(async function () {

    var PLSystem = {};

    /**

    This one is redone, for the sake of ever-loving consistency, to use:

    Event.TIME = 0;
    Event.DURATION = 1;
    Event.STATUS = 2;
    Event.CHANNEL = 3;
    Event.KEY = 4;
    Event.VELOCITY = 5;
    Event.X = 6;
    Event.Y = 7;
    Event.Z = 8;
    Event.PHASE = 9;
    Event.HOMOGENEITY = 10;
    Event.COUNT = 11;

    Or:

    t, d, s, c, k, v, x

    */

    // There has to be a better way to do this. For now we just hope that CsoundAC is 
    // in scope and not undefined when it is needed.
    try {
        window.CsoundAC = await createCsoundAC();
        window.pitv = new CsoundAC.PITV();
    } catch (ex) {
        console.error(ex);
    }
    console.info("CsoundAC: " + CsoundAC);
    console.info("pitv: " + pitv);

    const GRAMMAR_DISCRETE_OBJECTS = new Set(['d', 'p', 'i', 't', 'v']);
    const GRAMMAR_BUILTIN_NAMES = [
        'Wcd', 'Wc', 'Wn', 'Hcv', 'Hcs', 'Hds', 'Hd', 'Hs', 'Hc', 'Cd', 'C+',
        'R', 'Q', 'M', 'S', 'seed', 'K', 'I', 'F', 'T', '[', ']'
    ];

    /**
     * mt19937_64 PRNG matching ChordLindenmayer's std::mt19937_64 twister.
     */
    PLSystem.Mt19937_64 = class {
        constructor(seed) {
            this.mt = new BigUint64Array(312);
            this.mti = 312;
            if (typeof seed !== 'undefined') {
                this.seed(seed);
            }
        }
        seed(seed) {
            this.mt[0] = BigInt(Math.trunc(seed)) & 0xFFFFFFFFFFFFFFFFn;
            for (let i = 1; i < 312; i++) {
                let x = this.mt[i - 1] ^ (this.mt[i - 1] >> 62n);
                this.mt[i] = (0x6364136223846793005n * x + BigInt(i - 1)) & 0xFFFFFFFFFFFFFFFFn;
            }
            this.mti = 312;
        }
        twist() {
            const MATRIX_A = 0xB5026F5AA96619E9n;
            const UM = 0xFFFFFFFF80000000n;
            const LM = 0x7FFFFFFFn;
            for (let i = 0; i < 312; i++) {
                let x = (this.mt[i] & UM) | (this.mt[(i + 1) % 312] & LM);
                let xA = x >> 1n;
                if (x & 1n) {
                    xA ^= MATRIX_A;
                }
                this.mt[i] = this.mt[(i + 156) % 312] ^ xA;
            }
            this.mti = 0;
        }
        next_uint64() {
            if (this.mti >= 312) {
                this.twist();
            }
            let y = this.mt[this.mti++];
            y ^= (y >> 29n) & 0x5555555555555555n;
            y ^= (y << 17n) & 0x71D67FFFEDA60000n;
            y ^= (y << 37n) & 0xFFF7EEE000000000n;
            y ^= (y >> 43n);
            return y;
        }
        /** uniform_real_distribution [lo, hi) using 53 bits (C++ double canonical). */
        uniform(lo, hi) {
            const u = Number(this.next_uint64() >> 11n) / 9007199254740992.0;
            return u * (Number(hi) - Number(lo)) + Number(lo);
        }
    };

    PLSystem._rng = null;

    /** ChordLindenmayer (seed P value): reseed the score generator PRNG. */
    PLSystem.seed_random = function (seed) {
        PLSystem._rng = new PLSystem.Mt19937_64(seed);
    };

    /** [lo, hi) uniform; uses seeded PRNG when seed_random was called. */
    PLSystem.random_uniform = function (lo, hi) {
        if (PLSystem._rng === null) {
            return Number(lo) + Math.random() * (Number(hi) - Number(lo));
        }
        return PLSystem._rng.uniform(lo, hi);
    };

    PLSystem.random = function () {
        return PLSystem.random_uniform(0, 1);
    };

    /** CsoundAC Event indices below HOMOGENEITY (ChordL F N moves this many dims). */
    PLSystem.NOTE_MOTION_DIMENSIONS = 10;

    /** Unique pitch classes from a chord's epcs (VoiceleadingNode::apply). */
    PLSystem.unique_pitch_classes = function (chord) {
        const epcs = chord.epcs();
        const pcs = [];
        for (let voice = 0, voices = epcs.voices(); voice < voices; ++voice) {
            const pc = epcs.getPitch(voice);
            let found = false;
            for (let i = 0; i < pcs.length; ++i) {
                if (Math.abs(pcs[i] - pc) < 1e-9) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                pcs.push(pc);
            }
        }
        return pcs;
    };

    /** ChordLindenmayer::fixStatus — note-on status 0 becomes 144. */
    PLSystem.fix_status = function (score) {
        for (let i = 0, n = score.size(); i < n; ++i) {
            const event = score.get(i);
            if (event.getStatus() === 0) {
                event.setStatus(144);
            }
        }
    };

    /** Embind std::vector<double> wrapper for Score.setPitchClassSet and similar. */
    PLSystem.to_double_vector = function (values) {
        const vec = new CsoundAC.DoubleVector();
        for (let i = 0; i < values.length; i++) {
            vec.push_back(Number(values[i]));
        }
        return vec;
    };

    /** True mathematical modulus (always in [0, modulus)). */
    PLSystem.modulus = function (value, modulus) {
        return ((value % modulus) + modulus) % modulus;
    };

    /**
     * ChordLindenmayer "R" range equivalence (modulus). Not applied during turtle
     * motion; keys are rescaled linearly in applyChordLindenmayerPostProcess before
     * conformToChords.
     */
    PLSystem.wrap_in_range = function (value, range) {
        if (typeof range === 'number' && Number.isFinite(range) && range > 0) {
            return PLSystem.modulus(value, range);
        }
        return value;
    };

    /** Linear rescale of one score dimension (CsoundAC Score.setScale). */
    PLSystem.rescale_score_dimension = function (
        score, dimension, rescaleMinimum, rescaleRange, minimum, range) {
        score.setScale(
            score, dimension, rescaleMinimum, rescaleRange, 0, score.size(), minimum, range);
    };

    /** Route messages to the Csound log overlay and the developer console. */
    PLSystem.log_to_csound = function (message) {
        const text = typeof message === 'string' ? message : String(message);
        const line = text.endsWith('\n') ? text : text + '\n';
        console.info(line.trimEnd());
        const piece = globalThis.cloud5_piece;
        if (piece && typeof piece.log === 'function') {
            piece.log(line);
        }
    };

    PLSystem.harmony_mode = function (name) {
        const modes = CsoundAC.HarmonyConformMode;
        if (modes && typeof modes[name] !== 'undefined') {
            return modes[name];
        }
        const fallback = {
            Default: 0,
            Hc: 1,
            Hcv: 2,
            Hcs: 3,
            Hd: 4,
            Hds: 5
        };
        return fallback[name];
    };

    PLSystem.is_identifier_expression = function (text) {
        return /^[A-Za-z_$][\w$]*$/.test(text.trim());
    };

    /**
     * Removes leading/trailing whitespace and a single trailing item terminator (;).
     * Every item in the grammar is written with a terminating semicolon; parsing
     * strips it so argument lists are not polluted (e.g. "x;" -> "x").
     */
    PLSystem.normalize_item_text = function (text) {
        return String(text).trim().replace(/;\s*$/, '');
    };

    PLSystem.require_item_terminator = function (text, role) {
        const trimmed = String(text).trim();
        if (!trimmed.endsWith(';')) {
            throw new Error("PLSystem: " + role + " must end with ';': " + trimmed);
        }
    };

    PLSystem.require_production_terminator = function (text, role) {
        PLSystem.require_item_terminator(text, role);
    };

    PLSystem.split_production = function (text) {
        const words = [];
        for (const part of String(text).split(';')) {
            const word = part.trim();
            if (word.length > 0) {
                words.push(word);
            }
        }
        return words;
    };

    PLSystem.formal_parameters_from_item = function (word) {
        return word.actual_parameter_expressions.filter(expr => PLSystem.is_identifier_expression(expr));
    };

    PLSystem.is_legacy_word_text = function (text) {
        return /^[A-Za-z_$][\w$]*\s*\(/.test(text.trim());
    };

    PLSystem.formal_parameter_index = function (word, formal_name) {
        let index = word.actual_parameter_expressions.indexOf(formal_name);
        if (index < 0) {
            let parent_formals = PLSystem.formal_parameters_from_item(word);
            index = parent_formals.indexOf(formal_name);
        }
        return index;
    };

    PLSystem.split_expressions = function (text) {
        let expressions = [];
        let current = '';
        let depth_paren = 0;
        let depth_brace = 0;
        let depth_bracket = 0;
        for (let i = 0; i < text.length; i++) {
            let c = text[i];
            if (c === '(') {
                depth_paren++;
                current += c;
            } else if (c === ')') {
                depth_paren--;
                current += c;
            } else if (c === '{') {
                depth_brace++;
                current += c;
            } else if (c === '}') {
                depth_brace--;
                current += c;
            } else if (c === '[') {
                depth_bracket++;
                current += c;
            } else if (c === ']') {
                depth_bracket--;
                current += c;
            } else if (c === ',' && depth_paren === 0 && depth_brace === 0 && depth_bracket === 0) {
                expressions.push(current.trim());
                current = '';
            } else {
                current += c;
            }
        }
        if (current.length > 0) {
            expressions.push(current.trim());
        }
        return expressions;
    };

    PLSystem.parse_vector_literal = function (text) {
        if (text === null || typeof text === 'undefined') {
            return null;
        }
        text = String(text).trim();
        if (text.charAt(0) !== '{') {
            return null;
        }
        let values = [];
        let token = '';
        for (let i = 1; i < text.length; i++) {
            let c = text[i];
            if (c === '}') {
                if (token.length > 0) {
                    values.push(parseFloat(token));
                }
                break;
            } else if (c === ',') {
                if (token.length > 0) {
                    values.push(parseFloat(token));
                    token = '';
                }
            } else if (!/\s/.test(c)) {
                token += c;
            }
        }
        return values;
    };

    PLSystem.round_if_discrete = function (object_name, value) {
        if (GRAMMAR_DISCRETE_OBJECTS.has(object_name)) {
            return Math.round(value);
        }
        return value;
    };

    PLSystem.chord_from_pitches = function (pitches) {
        let chord = new CsoundAC.Chord();
        chord.resize(pitches.length);
        for (let i = 0; i < pitches.length; i++) {
            chord.setPitch(i, pitches[i]);
        }
        return chord;
    };

    PLSystem.scale_from_pitches = function (pitches) {
        let scale = new CsoundAC.Scale();
        scale.resize(pitches.length);
        for (let i = 0; i < pitches.length; i++) {
            scale.setPitch(i, pitches[i]);
        }
        return scale;
    };

    /** C-major pitch classes without named-scale lookup (wasm name DB can crash). */
    PLSystem.C_MAJOR_PITCHES = [0, 2, 4, 5, 7, 9, 11];

    PLSystem.HARMONIC_MINOR_PITCHES = [0, 2, 3, 5, 7, 8, 11];

    PLSystem.c_major_scale = function () {
        return PLSystem.scale_from_pitches(PLSystem.C_MAJOR_PITCHES);
    };

    PLSystem.scale_from_template = function (template, tonic) {
        return PLSystem.scale_from_pitches(template.map(function (p) { return p + tonic; }));
    };

    PLSystem.scales_equal = function (a, b) {
        if (a == null || b == null || a.voices() !== b.voices()) {
            return false;
        }
        for (let i = 0; i < a.voices(); i++) {
            if (a.getPitch(i) !== b.getPitch(i)) {
                return false;
            }
        }
        return true;
    };

    /**
     * Modulations for a chord (csound::Scale::modulations_for_voices) without the
     * wasm chord-name database. Enumerates major and harmonic-minor tonics.
     */
    PLSystem.modulations_for_voices = function (currentScale, chord, voices, interval = 3) {
        const currentDegree = PLSystem.scale_degree_for_chord(currentScale, chord, interval);
        if (currentDegree <= 0) {
            return [];
        }
        const degreeChord = PLSystem.chord_at_scale_degree(
            currentScale, currentDegree, voices, interval);
        const results = [];
        const templates = [
            PLSystem.C_MAJOR_PITCHES,
            PLSystem.HARMONIC_MINOR_PITCHES,
        ];
        for (let tonic = 0; tonic < 12; tonic++) {
            for (let t = 0; t < templates.length; t++) {
                const candidate = PLSystem.scale_from_template(templates[t], tonic);
                if (PLSystem.scale_degree_for_chord(candidate, degreeChord, interval) > 0) {
                    let duplicate = false;
                    for (let r = 0; r < results.length; r++) {
                        if (PLSystem.scales_equal(results[r], candidate)) {
                            duplicate = true;
                            break;
                        }
                    }
                    if (!duplicate) {
                        results.push(candidate);
                    }
                }
            }
        }
        return results;
    };

    /**
     * ChordLindenmayer (M Sc voices choice): modulate from the chord at the
     * current scale degree, not turtle.chord directly.
     * @returns {{succeeded: boolean, details: string, scaleText: string|null, newScale: object|null}}
     */
    PLSystem.modulate_scale = function (turtle, voices, choice) {
        const fromScaleText = PLSystem.describe_scale(turtle.scale);
        let scaleDegree = PLSystem.scale_degree_for_chord(turtle.scale, turtle.chord);
        if (scaleDegree <= 0) {
            scaleDegree = PLSystem.ensure_turtle_degree(turtle);
        }
        let succeeded = false;
        let details = '';
        let scaleText = null;
        let newScale = null;

        if (scaleDegree <= 0) {
            details = `chord not in scale, stored=${turtle.degree}, degree=${scaleDegree}, voices=${voices}, choice=${choice}`;
        } else {
            const degreeChord = PLSystem.chord_at_scale_degree(turtle.scale, scaleDegree, voices);
            const modulations = PLSystem.modulations_for_voices(
                turtle.scale, degreeChord, voices);
            const modCount = PLSystem.vector_size(modulations);
            if (modCount === 0) {
                details = `no modulations, degree=${scaleDegree}, degreeChord=${PLSystem.describe_chord(degreeChord)}, voices=${voices}, choice=${choice}`;
            } else {
                let index = choice;
                while (index < 0) index += modCount;
                while (index >= modCount) index -= modCount;
                newScale = PLSystem.vector_get(modulations, index);
                if (newScale == null) {
                    details = `missing modulation at index ${index}, degree=${scaleDegree}, voices=${voices}, choice=${choice}`;
                } else {
                    scaleText = `${fromScaleText} -> ${PLSystem.describe_scale(newScale)}`;
                    succeeded = true;
                    details = `degree=${scaleDegree}, choice=${choice}->${index}, voices=${voices}`;
                }
            }
        }
        return { succeeded, details, scaleText, newScale };
    };

    /**
     * Chord at a scale degree (csound::chord). Prefer the free function over
     * scale.chord() — embind can mis-bind the inherited Scale::chord method.
     */
    PLSystem.chord_at_scale_degree = function (scale, scaleDegree, voices, interval = 3) {
        if (typeof CsoundAC.chord === 'function') {
            return CsoundAC.chord(scale, scaleDegree, voices, interval);
        }
        let scaleIndex = scaleDegree - 1;
        const scaleInterval = interval - 1;
        const OCTAVE = 12;
        const result = new CsoundAC.Chord();
        result.resize(voices);
        let octave = 0;
        for (let chordVoice = 0; chordVoice < voices; chordVoice++) {
            while (scaleIndex >= scale.voices()) {
                scaleIndex -= scale.voices();
                octave += OCTAVE;
            }
            result.setPitch(chordVoice, scale.getPitch(scaleIndex) + octave);
            scaleIndex += scaleInterval;
        }
        return result;
    };

    /**
     * Scale degree of a chord (csound::Scale::degree). Always pass interval
     * explicitly — embind does not apply the C++ default interval = 3.
     */
    PLSystem.scale_degree_for_chord = function (scale, chord, interval = 3) {
        if (scale == null || chord == null) {
            return -1;
        }
        return scale.degree(chord, interval);
    };

    /** Wrap a scale degree into 1..scale.voices() (ChordLindenmayer equivalentDegree). */
    PLSystem.equivalent_degree = function (scale, degree) {
        const voices = scale.voices();
        let wrapped = Math.round(degree);
        while (wrapped < 1) {
            wrapped += voices;
        }
        while (wrapped > voices) {
            wrapped -= voices;
        }
        return wrapped;
    };

    /** Ensure turtle.degree is a finite wrapped scale degree (default 1). */
    PLSystem.ensure_turtle_degree = function (turtle) {
        if (typeof turtle.degree !== 'number' || !Number.isFinite(turtle.degree)) {
            turtle.degree = 1;
        }
        turtle.degree = PLSystem.equivalent_degree(turtle.scale, turtle.degree);
        return turtle.degree;
    };

    /** Element from an embind std::vector wrapper or a plain JS array. */
    PLSystem.vector_get = function (vector, index) {
        if (vector == null) {
            return undefined;
        }
        if (typeof vector.get === 'function') {
            return vector.get(index);
        }
        return vector[index];
    };

    PLSystem.vector_size = function (vector) {
        if (vector == null) {
            return 0;
        }
        if (typeof vector.size === 'function') {
            return vector.size();
        }
        return vector.length;
    };

    PLSystem.describe_pitches = function (chord) {
        const voices = chord.voices();
        const pitches = [];
        for (let i = 0; i < voices; i++) {
            pitches.push(chord.getPitch(i));
        }
        return `{${pitches.join(',')}}`;
    };

    PLSystem.describe_chord = function (chord) {
        if (chord == null) {
            return '(no chord)';
        }
        try {
            return PLSystem.describe_pitches(chord);
        } catch (err) {
            return '(chord)';
        }
    };

    PLSystem.describe_scale = function (scale) {
        if (scale == null) {
            return '(no scale)';
        }
        try {
            let label = '';
            try {
                if (typeof scale.getTypeName === 'function') {
                    label = scale.getTypeName();
                } else if (typeof scale.name === 'function') {
                    label = scale.name();
                }
            } catch (err) {
                /* ignore */
            }
            const pitches = PLSystem.describe_pitches(scale);
            return label ? `${label} ${pitches}` : pitches;
        } catch (err) {
            return '(scale)';
        }
    };

  /**
   * Log a modulation attempt to the Csound message overlay.
   * @param {string} command Command name, e.g. 'M'.
   * @param {boolean} succeeded Whether modulation changed the scale.
   * @param {object} turtle Current turtle (time, scale, chord).
   * @param {string} [details] Extra context (degree, choice, voices, reason).
   * @param {string} [scaleText] Preformatted scale text (e.g. from->to on success).
   */
    PLSystem.log_modulation = function (command, succeeded, turtle, details, scaleText) {
        try {
            const time = turtle.note.getTime();
            const chord = PLSystem.describe_chord(turtle.chord);
            const scale = scaleText || PLSystem.describe_scale(turtle.scale);
            const outcome = succeeded ? 'success' : 'failed';
            const detailSuffix = details ? `, ${details}` : '';
            PLSystem.log_to_csound(
                `${command}: ${outcome} at t=${time}, scale=${scale}, chord=${chord}${detailSuffix}`
            );
        } catch (err) {
            PLSystem.log_to_csound(
                `${command}: log error (${err.message || err})`
            );
        }
    };

    PLSystem.parse_legacy_word = function (word, text) {
        word.grammar = 'legacy';
        word.kind = 'symbol';
        word.name = /s*([^(]*)/.exec(text)[1].trim();
        word.actual_parameter_expressions = [];
        let opening_parenthesis = text.indexOf('(');
        let ending_parenthesis = text.lastIndexOf(')');
        if (opening_parenthesis != -1 && ending_parenthesis != -1) {
            word.actual_parameter_expressions = text.substring(opening_parenthesis + 1, ending_parenthesis).split(/, /);
        }
        word.key = word.name + '(' + word.actual_parameter_expressions.length + ')';
    };

    PLSystem.parse_grammar_word = function (word, text) {
        word.grammar = 'plsystem';
        let arithmetic_match = text.match(/^([nomcsdpitv])\s*([=+\-*/^])\s*(.+)$/);
        if (arithmetic_match) {
            word.kind = 'command';
            word.command_type = 'arithmetic';
            word.object = arithmetic_match[1];
            word.operator = arithmetic_match[2];
            word.name = word.object + word.operator;
            word.actual_parameter_expressions = PLSystem.split_expressions(arithmetic_match[3]);
            word.key = word.name + '(' + word.actual_parameter_expressions.length + ')';
            return;
        }
        for (let i = 0; i < GRAMMAR_BUILTIN_NAMES.length; i++) {
            let builtin_name = GRAMMAR_BUILTIN_NAMES[i];
            if (text === builtin_name) {
                word.kind = 'command';
                word.command_type = 'builtin';
                word.builtin_name = builtin_name;
                word.name = builtin_name;
                word.actual_parameter_expressions = [];
                word.key = builtin_name + '()';
                return;
            }
            if (text.indexOf(builtin_name + ' ') === 0) {
                word.kind = 'command';
                word.command_type = 'builtin';
                word.builtin_name = builtin_name;
                word.name = builtin_name;
                word.actual_parameter_expressions = PLSystem.split_expressions(text.substring(builtin_name.length).trim());
                word.key = builtin_name + '(' + word.actual_parameter_expressions.length + ')';
                return;
            }
        }
        let symbol_match = text.match(/^([A-Za-z_$][\w$]*)\s*(.*)$/);
        if (symbol_match) {
            word.kind = 'symbol';
            word.name = symbol_match[1];
            let remainder = symbol_match[2].trim();
            word.actual_parameter_expressions = remainder.length > 0 ? PLSystem.split_expressions(remainder) : [];
            word.key = word.name + '(' + word.actual_parameter_expressions.length + ')';
            return;
        }
        word.kind = 'symbol';
        word.name = text;
        word.actual_parameter_expressions = [];
        word.key = word.name + '(0)';
    };

    /**
     * @class
     * @classdesc
     * 
     * Represents the position of a "pen" that is moving about 
     * and writing upon a Score. The state of the Turtle includes a note, 
     * a chord, and another chord defining the scale of the Score.
     * 
     * @param {Event} note_ The current position of the Turtle in the chord 
     * space.
     * 
     * @param {Chord} chord_ The current Chord to which the Turtle will bre 
     * conformed.
     * 
     * @param {Chord} scale_ The scale of the chord space, which 
     * controls the effect of certain chord transormations.
     */
    PLSystem.Turtle = class {
        constructor(note_, chord_, scale_) {
            // Match ChordLindenmayer Turtle: orientation[TIME]=1 only.
            this.orientation = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.magnitude = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            if (typeof note_ === "undefined") {
                this.note = new CsoundAC.Event();
            } else {
                this.note = note_;
            }
            if (typeof chord_ === "undefined") {
                this.chord = new CsoundAC.Chord();
            } else {
                this.chord = chord_.clone();
            }
            this.prior_chord = this.chord.clone();
            if (typeof scale_ === "undefined") {
                this.scale = new CsoundAC.Scale();
            } else {
                this.scale = scale_.clone();
            }
            this.degree = 1;
        }
        /**
         * Creates a clone of this Turtle.
         * 
         * @returns {Turtle} A value copy of this Turtle.
         */
        clone() {
            let clone_ = new PLSystem.Turtle();
            clone_.orientation = this.orientation.slice();
            clone_.magnitude = this.magnitude.slice();
            clone_.note = this.note.clone();
            clone_.chord = this.chord.clone();
            clone_.scale = this.scale.clone();
            clone_.degree = this.degree;
            clone_.prior_chord = this.prior_chord.clone();
            clone_.pitv = this.pitv;
            if (this.chordl_pitv) {
                clone_.chordl_pitv = Object.assign({}, this.chordl_pitv);
            }
            if (this.voiced_chord) {
                clone_.voiced_chord = this.voiced_chord.clone();
            }
            if (this.stagger != null) {
                clone_.stagger = this.stagger;
            }
            if (this.revoicing_range != null) {
                clone_.revoicing_range = this.revoicing_range;
            }
            if (this.rangeSize != null) {
                clone_.rangeSize = this.rangeSize;
            }
            return clone_;
        }
        pitv_from_chord() {
            if (typeof this.pitv === "undefined") {
                throw new Error('Turtle.pitv is not set; assign lsystem.pitv to the turtle.');
            }
            return this.pitv.fromChord(this.chord);
        }
        apply_pitv(pitv) {
            this.chord = this.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, this.chord).revoicing;
            this.voiced_chord = null;
        }
        get o() {
            return this.orientation;
        }
        set o(value) {
            this.orientation = value;
        }
        get m() {
            return this.magnitude;
        }
        set m(value) {
            this.magnitude = value;
        }
        get n() {
            return this.note;
        }   
        set n(value) {
            this.note = value;
        }
        get c() {
            return this.chord;
        }
        set c(value) {
            this.chord = value;
        }
        get s() {
            return this.scale;
        }
        set s(value) {
            this.scale = value;
        }
        get d() {
            return this.degree;
        }
        set d(value) {
            this.degree = value;
        }
        get p() {
            let pitv = this.pitv_from_chord();
            return pitv.P;
        }
        set p(value) {
            let pitv = this.pitv_from_chord();
            pitv.P = value;
            this.apply_pitv(pitv);
        }
        get i() {
            let pitv = this.pitv_from_chord();
            return pitv.I;
        }
        set i(value) {
            let pitv = this.pitv_from_chord();
            pitv.I = value;
            this.apply_pitv(pitv);
        }
        get t() {
            let pitv = this.pitv_from_chord();
            return pitv.T;
        }
        set t(value) {
            let pitv = this.pitv_from_chord();
            pitv.T = value;
            this.apply_pitv(pitv);
        }
        get v() {
            let pitv = this.pitv_from_chord();
            return pitv.V;
        }
        set v(value) {
            let pitv = this.pitv_from_chord();
            pitv.V = value;
            this.apply_pitv(pitv);
        }
    };

    /**
     * @class 
     * @classdesc 
     * 
     * Creates a Word with a name, a list of actual parameter expressions,
     * an empty list of actual parameter values, and a Production-matching key
     * from the text of the Word. 
     * 
     * @param {string} text Parsed to produce the parts of this Word. Both 
     * formal parameters and actual parameters must be seperated by a comma 
     * and a space (`", "`). _Actual_ parameters may contain or be expressions; 
     * if so, no comma within such an expression may be followed by a space 
     * (this prevents incorrect parsing into malformed parameters). Example: 
     * `"J(2, myfunction(4,t/2,6) + p)"`.
     */
    PLSystem.Word = class {
        constructor(text) {
            this.text = PLSystem.normalize_item_text(text);
            this.actual_parameter_values = [];
            if (PLSystem.is_legacy_word_text(this.text)) {
                PLSystem.parse_legacy_word(this, this.text);
            } else {
                PLSystem.parse_grammar_word(this, this.text);
            }
            for (let i = 0; i < this.actual_parameter_expressions.length; i++) {
                this.actual_parameter_values.push(null);
            }
        }
        /**
         * Creates a clone of this Word.
         * 
         * @returns {Word} A deep value copy of this Word.
         */
        clone() {
            let clone_ = new PLSystem.Word('');
            clone_.text = this.text;
            clone_.key = this.key;
            clone_.name = this.name;
            clone_.grammar = this.grammar;
            clone_.kind = this.kind;
            clone_.command_type = this.command_type;
            clone_.object = this.object;
            clone_.operator = this.operator;
            clone_.builtin_name = this.builtin_name;
            clone_.actual_parameter_expressions = this.actual_parameter_expressions.slice();
            clone_.actual_parameter_values = this.actual_parameter_values.slice();
            return clone_;
        }
        /**
         * Rewrites this Word by replacing it with a new Word or series of Words based 
         * on the replacement rules and the values of the actual parameters.
         * 
         * @param {PLSyste} lsystem A ParametricLindenmayerSystem instance.
         * @param {Array<Word>} current_production The current production of the ParametricLindenmayerSystem.
         */
        rewrite(lsystem, current_production) {
            let rule = lsystem.rule_for_word(this);
            if (typeof rule === "undefined") {
                let rule_less = this.clone();
                lsystem.evaluate_actual_parameter_expressions(null, rule_less);
                current_production.push(rule_less);
            } else {
                let productions_for_conditions = rule.productions_for_conditions;
                for (let condition in productions_for_conditions) {
                    if (productions_for_conditions.hasOwnProperty(condition)) {
                        let production = productions_for_conditions[condition];
                        if (lsystem.evaluate_condition_expression(this, condition) === true) {
                            for (let i = 0; i < production.length; i++) {
                                let child = production[i].clone();
                                lsystem.evaluate_actual_parameter_expressions(this, child);
                                current_production.push(child);
                            }
                        }
                    } else {
                        console.log('Condition "false", skipping rewriting of ' + this.text + '.');
                    }
                }
            }
        }
    };

    PLSystem.Rule = class {
        constructor(word_, condition_, production_) {
            if (typeof word_ === typeof '') {
                this.word = new PLSystem.Word(word_);
            } else {
                this.word = word_.clone();
            }
            this.productions_for_conditions = {};
            this.add_condition(condition_, production_);
        }
        add_condition(condition_, production_) {
            PLSystem.require_production_terminator(production_, 'rule successor');
            let production = [];
            let words = PLSystem.split_production(production_);
            for (let i = 0; i < words.length; i++) {
                production.push(new PLSystem.Word(words[i]));
            }
            this.productions_for_conditions[condition_] = production;
        }
    };

    /**
     * Evaluates code but logs any exceptions thus caused.
     * 
     * @param {string} code Text of Javascript expression.
     */

    PLSystem.evaluate_with_minimal_scope = function (code) {
        try {
            let result = eval?.(code);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /** 
     * @class 
     * @classdesc
     *
     * This parametric Lindenmayer system for generating musical scores is 
     * defined as follows. See 
     * http://hardlikesoftware.com/projects/lsystem/lsystem.html.
     * For the original definition of this type of system, see Przemyslaw
     * Prusinkiewicz and Aristid Lindenmayer, _The Algorithmic Beauty of 
     * Plants_ (New York: Springer Verlag, 1996 [1990]), pp. 40-50.
     *
     * _Name_: JavaScript identifier.
     * 
     * _Word_: Text for a JavaScript expression consisting of a name, or a 
     * JavaScript function call with either formal or actual parameters, 
     * terminated with a semicolon, associated with a Command.
     * 
     * _Production_: A sequence of Words.
     * 
     * _Command_: A function that modifies the state of a Turtle; may be 
     * built-in or user-defined. A Word that is not assigned a Command is 
     * associated with a default builtin identity Command.
     *
     * _Turtle_: An abstract pen that writes a musical score by performing the 
     * Commands in a Production.
     * 
     * _Axiom_: The initial Production of a Lindenmayer system, in which any 
     * parameters are actual.
     * 
     * _Rule_: A triple [Word, Condition, Production] in which any parameters 
     * may be actual or formal, or indeed any JavaScript expression.
     * 
     * _Lindenmayer system_: A set of Words, a set of associated Commands, an 
     * Axiom, one or more Rules, and a finite number N of Iterations. For each 
     * Word in the Axiom, the Axiom Word is replaced from the Rules; if the 
     * Axiom Word Name matches the Rule Word Name, and the Axiom Word 
     * parameters number the same as the Rule Word parameters, then if the 
     * Condition evaluates as true, the Rule Production replaces the Axiom 
     * Word after evaluating each Production Word's actual parameter 
     * expressions after substituting the Axiom Word's actual parameter values 
     * for any formal parameter names in the Production Word's actual 
     * parameter expressions; if as false, there is no Production; otherwise, 
     * the Axiom Word replaces itself. The resulting Production is taken as 
     * the Axiom for the next iteration. This is repeated N times. Then the 
     * final Production, consisting of a possibly long string of Words with 
     * only actual parameters, is evaluated.
     * 
     * _Evaluation_: The Command of each Word in the final Production is 
     * evaluated using the Turtle state and the Command with actual 
     * parameters, possibly causing the Turtle to write a musical score.
     *
     * _Note_: The formal parameter names of the Word must be the same as the 
     * formal parameter names (after 'lsystem' and 'turtle') of the Word's 
     * Command (which is not a class member of the Word). The actual 
     * parameters of the Word may be values or unevaluated expressions; when 
     * the Command is called, the actual parameter expressions are evaluated 
     * using the actual parameter values of the parent Word as the values of 
     * the unevaluated parameters in the actual parameter expressions.
     *
     * _Example_: Note(i,t,d,k,v,p) is replaced by 
     * Note(i*2,t^1.1,d-1,k+3,v*.9,p=Math.random()).
     *    
     * Reworked to use CsoundAC.PITV.
     */
    PLSystem.PLSystem = class {
        constructor() {
            this.score = new CsoundAC.ChordScore();
            this.chord_score = this.score;
            this.commands_for_words = {};
            this.formal_parameters_for_commands = {};
            this.formal_parameters_for_words = {};
            this.axiom = [];
            this.rules_for_words = {};
            this.pitv = new CsoundAC.PITV();
            this.chord_space_group = this.pitv;
            this.turtle = new PLSystem.Turtle();
            this.turtle.pitv = this.pitv;
            this.identity_command = function (lsystem, turtle_) {
                return turtle_;
            };
            this.add_command('Assign(dimension, value)', function (lsystem, turtle, dimension, value) {
                // Embind Event has no JS [i] / .data; use get*/set* (see chordl_set_note_dim).
                chordl_set_note_dim(turtle.note, dimension, value);
                return turtle;
            });
            this.add_command('Scale(dimension, value)', function (lsystem, turtle, dimension, value) {
                turtle.magnitude[dimension] = value;
                return turtle;
            });
            this.add_command('Move(dimension, value)', function (lsystem, turtle, dimension, value) {
                chordl_set_note_dim(
                    turtle.note, dimension,
                    chordl_note_dim(turtle.note, dimension) + value);
                return turtle;
            });
            this.add_command('Steps(s)', function (lsystem, turtle, s) {
                for (let i = 0; i < PLSystem.NOTE_MOTION_DIMENSIONS; i++) {
                    const delta = s * turtle.magnitude[i] * turtle.orientation[i];
                    if (delta !== 0) {
                        chordl_set_note_dim(
                            turtle.note, i, chordl_note_dim(turtle.note, i) + delta);
                    }
                }
                return turtle;
            });
            this.add_command('Step()', function (lsystem, turtle) {
                for (let i = 0; i < PLSystem.NOTE_MOTION_DIMENSIONS; i++) {
                    const delta = turtle.magnitude[i] * turtle.orientation[i];
                    if (delta !== 0) {
                        chordl_set_note_dim(
                            turtle.note, i, chordl_note_dim(turtle.note, i) + delta);
                    }
                }
                return turtle;
            });
            // http://wscg.zcu.cz/wscg2004/Papers_2004_Short/N29.pdf: main rotations.
            this.add_command('Turn(from_axis, to_axis, angle)', function (lsystem, turtle, from_axis, to_axis, angle) {
                let rotation = numeric.identity(turtle.orientation.length);
                rotation[from_axis][from_axis] = Math.cos(angle);
                rotation[from_axis][to_axis] = -Math.sin(angle);
                rotation[to_axis][from_axis] = Math.sin(angle);
                rotation[to_axis][to_axis] = Math.cos(angle);
                // The orientation is a row vector, not a column vector.
                turtle.orientation = numeric.dotVM(turtle.orientation, rotation);
                return turtle;
            });
            this.add_command('Assign(t, d, s, c, k, v, x)', function (lsystem, turtle, t, d, s, c, k, v, x) {
                turtle.note.setTime(t * turtle.magnitude[0]);
                turtle.note.setDuration(d * turtle.magnitude[1]);
                turtle.note.setStatus(s * turtle.magnitude[2]);
                turtle.note.setInstrument(c * turtle.magnitude[3]);
                turtle.note.setKey(k * turtle.magnitude[4]);
                turtle.note.setVelocity(v * turtle.magnitude[5]);
                turtle.note.setPan(x * turtle.magnitude[6]);
                return turtle;
            });
            this.add_command('Move(t, d, s, c, k, v, x)', function (lsystem, turtle, t, d, s, c, k, v, x) {
                turtle.note.setTime(turtle.note.getTime() + (t * turtle.magnitude[0]));
                turtle.note.setDuration(turtle.note.getDuration() + (d * turtle.magnitude[1]));
                turtle.note.setStatus(turtle.note.getStatus() + (s * turtle.magnitude[2]));
                turtle.note.setInstrument(turtle.note.getInstrument() + (c * turtle.magnitude[3]));
                turtle.note.setKey(turtle.note.getKey() + (k * turtle.magnitude[4]));
                turtle.note.setVelocity(turtle.note.getVelocity() + (v * turtle.magnitude[5]));
                turtle.note.setPan(turtle.note.getPan() + (x * turtle.magnitude[6]));
                return turtle;
            });
            this.add_command('Note(t, d, s, c, k, v, x)', function (lsystem, turtle, t, d, s, c, k, v, x) {
                turtle.note.setTime(t * turtle.magnitude[0]);
                turtle.note.setDuration(d * turtle.magnitude[1]);
                turtle.note.setStatus(s * turtle.magnitude[2]);
                turtle.note.setInstrument(c * turtle.magnitude[3]);
                turtle.note.setKey(k * turtle.magnitude[4]);
                turtle.note.setVelocity(v * turtle.magnitude[5]);
                turtle.note.setPan(x * turtle.magnitude[6]);
                let note = turtle.note.clone();
                if (turtle.chord !== null) {
                    note.chord = turtle.chord.clone();
                }
                lsystem.score.append_event(note);
                return turtle;
            });
            this.add_command('Note()', function (lsystem, turtle) {
                let note = turtle.note.clone();
                lsystem.score.append_event(note);
                return turtle;
            });
            this.add_command('Push()', function (lsystem, turtle) {
                lsystem.turtle_stack.push(turtle.clone());
                return turtle;
            });
            this.add_command('Pop()', function (lsystem, turtle) {
                turtle = lsystem.turtle_stack.pop();
                return turtle;
            });
            this.add_command('T(n)', function (lsystem, turtle, n) {
                turtle.chord = turtle.chord.T(n);
                lsystem.score.insertChord(turtle.note.getTime(), turtle.chord);
                return turtle;
            });
            this.add_command('I(c)', function (lsystem, turtle, c) {
                turtle.chord = turtle.chord.I(c);
                lsystem.score.insertChord(turtle.note.getTime(), turtle.chord);
                return turtle;
            });
            this.add_command('K()', function (lsystem, turtle) {
                turtle.chord = turtle.chord.K();
                lsystem.score.insertChord(turtle.note.getTime(), turtle.chord);
                return turtle;
            });
            this.add_command('Q(n)', function (lsystem, turtle, n) {
                turtle.chord = turtle.chord.Q(n, turtle.scale);
                return turtle;
            });
            this.add_command('J(n, m)', function (lsystem, turtle, n, m) {
                let inversions = turtle.chord.J(n);
                if (inversions.length > m) {
                    turtle.chord = inversions[m];
                }
                return turtle;
            });
            /**
             * Assign the parameters P, I, T, and V to the current turtle state.
             */
            this.add_command('PitvAssign(P, I, T, V)', function (lsystem, turtle, P, I, T, V) {
                turtle.chord = lsystem.pitv.toChord(P, I, T, V, turtle.chord).revoicing;
                return turtle;
            });
            /**
             * Add the parameters P, I, T, and V to the current turtle state.
             */
            this.add_command('PitvMove(P, I, T, V', function (lsystem, turtle, P, I, T, V) {
                let pitv = lsystem.pitv.fromChord(turtle.chord);
                pitv.P += P;
                pitv.I += I;
                pitv.T += T;
                pitv.V += V;
                turtle.chord = lsystem.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, turtle.chord).revoicing;
                return turtle;
            });
            /**
             * Assign the parameter P to the current turtle state.
             */
            this.add_command('PAssign(P)', function (lsystem, turtle, P) {
                let pitv = lsystem.pitv.fromChord(turtle.chord);
                pitv.P = P;
                turtle.chord = lsystem.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, turtle.chord).revoicing;
                return turtle;
            });
            /**
             * Add the parameter P to the current turtle state.
             */
            this.add_command('PMove(P)', function (lsystem, turtle, P) {
                let pitv = lsystem.pitv.fromChord(turtle.chord);
                pitv.P += P;
                turtle.chord = lsystem.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, turtle.chord).revoicing;
                return turtle;
            });
            /**
             * Assign the parameter I to the current turtle state.
             */
            this.add_command('IAssign(I)', function (lsystem, turtle, I) {
                let pitv = lsystem.pitv.fromChord(turtle.chord);
                pitv.I = I;
                turtle.chord = lsystem.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, turtle.chord).revoicing;
                return turtle;
            });
            /**
             * Add the parameter I to the current turtle state.
             */
            this.add_command('IMove(I)', function (lsystem, turtle, I) {
                let pitv = lsystem.pitv.fromChord(turtle.chord);
                pitv.I += I;
                turtle.chord = lsystem.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, turtle.chord).revoicing;
                return turtle;
            });
            /**
             * Assign the parameter T to the current turtle state.
             */
            this.add_command('TAssign(T)', function (lsystem, turtle, T) {
                let pitv = lsystem.pitv.fromChord(turtle.chord);
                pitv.T = T;
                turtle.chord = lsystem.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, turtle.chord).revoicing;
                return turtle;
            });
            /**
             * Add the parameter T to the current turtle state.
             */
            this.add_command('TMove(T)', function (lsystem, turtle, T) {
                let pitv = lsystem.pitv.fromChord(turtle.chord);
                pitv.T += T;
                turtle.chord = lsystem.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, turtle.chord).revoicing;
                return turtle;
            });
            /**
             * Assign the parameter V to the current turtle state.
             */
            this.add_command('VAssign(V)', function (lsystem, turtle, V) {
                let pitv = lsystem.pitv.fromChord(turtle.chord);
                pitv.V = V;
                turtle.chord = lsystem.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, turtle.chord).revoicing;
                return turtle;
            });
            /**
             * Add the parameter V to the current turtle state.
             */
            this.add_command('VMove(V)', function (lsystem, turtle, V) {
                let pitv = lsystem.pitv.fromChord(turtle.chord);
                pitv.V += V;
                turtle.chord = lsystem.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, turtle.chord).revoicing;
                return turtle;
            });
            /**
             * Append the turtle chord as note events in the score. Does not
             * update the harmony timeline (use Chord() for conformToChords).
             */
            this.add_command('ChordNotesDuration(D)', function (lsystem, turtle, D) {
                turtle.chord.setDuration(D);
                CsoundAC.insert(lsystem.score, turtle.chord, turtle.note.getTime());
                turtle.prior_chord = turtle.chord.clone();
                return turtle;
            });
            /** Append the turtle chord as note events (see ChordNotesDuration). */
            this.add_command('ChordNotes()', function (lsystem, turtle) {
                CsoundAC.insert(lsystem.score, turtle.chord, turtle.note.getTime());
                turtle.prior_chord = turtle.chord.clone();
                return turtle;
            });
            /**
             * Create a chord at the current time and duration from
             * the current turtle state's P, I, T at the closest voiceleading from
             * the previous chord. The voiceleading is done between the prior and
             * current state of the turtle.chord, so may not perform as expected
             * unless operations are successive in time. Please note, the
             * PITV of the LSystem must first have been initialized.
             */
            this.add_command('ChordNotesVoiceleading()', function (lsystem, turtle) {
                turtle.chord = CsoundAC.voiceleadingClosestRange(turtle.prior_chord, turtle.chord, lsystem.pitv.range, true);
                CsoundAC.insert(lsystem.score, turtle.chord, turtle.note.getTime());
                turtle.prior_chord = turtle.chord.clone();
                return turtle;
            });
            /**
             * Insert the current turtle chord on the harmony timeline at the
             * turtle time (same as T/K/I do after transforming). Use when the
             * chord changes without those commands; see conformToChords.
             */
            this.add_command('Chord()', function (lsystem, turtle) {
                lsystem.score.insertChord(turtle.note.getTime(), turtle.chord);
                turtle.prior_chord = turtle.chord.clone();
                return turtle;
            });
            this.reset();
        }
        formal_parameters_for(word_key) {
            let formal_parameters = this.formal_parameters_for_commands[word_key];
            if (typeof formal_parameters === "undefined") {
                formal_parameters = this.formal_parameters_for_words[word_key];
            }
            return formal_parameters;
        }
        bind_parent_formals_to_prologue(parent_word, prologue) {
            let formal_parameters = this.formal_parameters_for(parent_word.key);
            if (typeof formal_parameters !== "undefined") {
                for (let i = 0; i < formal_parameters.length; i++) {
                    let formal_parameter_name = formal_parameters[i];
                    let parent_actual_parameter_value = parent_word.actual_parameter_values[i];
                    if (parent_actual_parameter_value === null) {
                        parent_actual_parameter_value = PLSystem.evaluate_with_minimal_scope(
                            parent_word.actual_parameter_expressions[i]);
                    }
                    prologue += 'let ' + formal_parameter_name + ' = ' + parent_actual_parameter_value + ';';
                }
            }
            return prologue;
        }
        register_formal_parameters_for_item(word) {
            let formals = PLSystem.formal_parameters_from_item(word);
            if (formals.length > 0) {
                let existing = this.formal_parameters_for_words[word.key];
                // Rule LHS patterns (all-identifier formals) must not be replaced by
                // production RHS lines where only some slots are bare identifiers (e.g. `s`).
                if (typeof existing === "undefined" || formals.length > existing.length) {
                    this.formal_parameters_for_words[word.key] = formals;
                }
            }
        }
        apply_arithmetic_scalar(target, operation, value, object_name) {
            if (operation === '=') {
                return PLSystem.round_if_discrete(object_name, value);
            } else if (operation === '+') {
                return PLSystem.round_if_discrete(object_name, target + value);
            } else if (operation === '-') {
                return PLSystem.round_if_discrete(object_name, target - value);
            } else if (operation === '*') {
                return PLSystem.round_if_discrete(object_name, target * value);
            } else if (operation === '/') {
                return PLSystem.round_if_discrete(object_name, target / value);
            } else if (operation === '^') {
                return PLSystem.round_if_discrete(object_name, Math.pow(target, value));
            }
            return target;
        }
        apply_arithmetic_array(target, operation, value, index, object_name) {
            let result = target.slice();
            if (typeof index === "number" && index >= 0 && index < result.length) {
                result[index] = this.apply_arithmetic_scalar(result[index], operation, value, object_name);
            } else {
                for (let i = 0; i < result.length; i++) {
                    result[i] = this.apply_arithmetic_scalar(result[i], operation, value, object_name);
                }
            }
            return result;
        }
        apply_pitv_component(lsystem, turtle, component, operation, value) {
            let pitv = lsystem.pitv.fromChord(turtle.chord);
            pitv[component] = this.apply_arithmetic_scalar(pitv[component], operation, value, component.toLowerCase());
            turtle.chord = lsystem.pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, turtle.chord).revoicing;
            turtle.voiced_chord = null;
            return turtle;
        }
        assign_note_fields(turtle, values, operation) {
            let fields = [
                ['setTime', 0],
                ['setDuration', 1],
                ['setStatus', 2],
                ['setInstrument', 3],
                ['setKey', 4],
                ['setVelocity', 5],
                ['setPan', 6]
            ];
            for (let i = 0; i < fields.length && i < values.length; i++) {
                let setter = fields[i][0];
                let magnitude_index = fields[i][1];
                let scaled = values[i] * turtle.magnitude[magnitude_index];
                if (operation === '=') {
                    turtle.note[setter](scaled);
                } else if (operation === '+') {
                    let getter = setter.replace('set', 'get');
                    turtle.note[setter](turtle.note[getter]() + scaled);
                } else if (operation === '-') {
                    let getter = setter.replace('set', 'get');
                    turtle.note[setter](turtle.note[getter]() - scaled);
                } else if (operation === '*') {
                    let getter = setter.replace('set', 'get');
                    turtle.note[setter](turtle.note[getter]() * scaled);
                } else if (operation === '/') {
                    let getter = setter.replace('set', 'get');
                    turtle.note[setter](turtle.note[getter]() / scaled);
                } else if (operation === '^') {
                    let getter = setter.replace('set', 'get');
                    turtle.note[setter](Math.pow(turtle.note[getter](), scaled));
                }
            }
            return turtle;
        }
        interpret_grammar_arithmetic(word, turtle) {
            let args = word.actual_parameter_values;
            let object_name = word.object;
            let operation = word.operator;
            if (object_name === 'n') {
                if (operation === '=' && args.length === 7) {
                    return this.assign_note_fields(turtle, args, '=');
                }
                if (args.length >= 2) {
                    let dimension = args[0];
                    let value = args[1];
                    let current = chordl_note_dim(turtle.note, dimension);
                    if (operation === '=') {
                        chordl_set_note_dim(turtle.note, dimension, value);
                    } else if (operation === '+') {
                        chordl_set_note_dim(turtle.note, dimension, current + value);
                    } else if (operation === '-') {
                        chordl_set_note_dim(turtle.note, dimension, current - value);
                    } else if (operation === '*') {
                        chordl_set_note_dim(turtle.note, dimension, current * value);
                    } else if (operation === '/') {
                        chordl_set_note_dim(turtle.note, dimension, current / value);
                    } else if (operation === '^') {
                        chordl_set_note_dim(turtle.note, dimension, Math.pow(current, value));
                    }
                }
                return turtle;
            }
            if (object_name === 'o') {
                if (operation === '=' && args.length === 1) {
                    let vector = PLSystem.parse_vector_literal(word.actual_parameter_expressions[0]);
                    if (vector !== null) {
                        turtle.orientation = vector;
                    }
                } else if (args.length >= 2) {
                    turtle.orientation = this.apply_arithmetic_array(turtle.orientation, operation, args[1], args[0], object_name);
                }
                return turtle;
            }
            if (object_name === 'm') {
                if (operation === '=' && args.length === 1) {
                    let vector = PLSystem.parse_vector_literal(word.actual_parameter_expressions[0]);
                    if (vector !== null) {
                        turtle.magnitude = vector;
                    }
                } else if (args.length >= 2) {
                    let dimension = args[0];
                    let value = args[1];
                    // All operators (including *) apply in place via
                    // apply_arithmetic_array, so `m * dim, v` is magnitude[dim] *= v,
                    // consistent with `m / dim, v` (magnitude[dim] /= v).
                    turtle.magnitude = this.apply_arithmetic_array(turtle.magnitude, operation, value, dimension, object_name);
                }
                return turtle;
            }
            if (object_name === 'c') {
                if (operation === '=' && args.length === 1) {
                    let vector = PLSystem.parse_vector_literal(word.actual_parameter_expressions[0]);
                    if (vector !== null) {
                        turtle.chord = PLSystem.chord_from_pitches(vector);
                    }
                } else if (args.length >= 2) {
                    let index = args[0];
                    let value = args[1];
                    if (operation === '=') {
                        turtle.chord.setPitch(index, value);
                    } else {
                        let current = turtle.chord.getPitch(index);
                        turtle.chord.setPitch(index, this.apply_arithmetic_scalar(current, operation, value, object_name));
                    }
                }
                return turtle;
            }
            if (object_name === 's') {
                if (operation === '=' && args.length === 1) {
                    let vector = PLSystem.parse_vector_literal(word.actual_parameter_expressions[0]);
                    if (vector !== null) {
                        turtle.scale = PLSystem.scale_from_pitches(vector);
                    }
                }
                return turtle;
            }
            if (object_name === 'd') {
                if (args.length >= 1) {
                    let value = args[0];
                    if (operation === '=') {
                        turtle.degree = PLSystem.equivalent_degree(
                            turtle.scale,
                            PLSystem.round_if_discrete('d', value));
                    } else {
                        const current = (typeof turtle.degree === 'number' && Number.isFinite(turtle.degree))
                            ? turtle.degree
                            : 1;
                        turtle.degree = PLSystem.equivalent_degree(
                            turtle.scale,
                            this.apply_arithmetic_scalar(current, operation, value, 'd'));
                    }
                }
                return turtle;
            }
            if (object_name === 'p') {
                return this.apply_pitv_component(this, turtle, 'P', operation, args[0]);
            }
            if (object_name === 'i') {
                return this.apply_pitv_component(this, turtle, 'I', operation, args[0]);
            }
            if (object_name === 't') {
                return this.apply_pitv_component(this, turtle, 'T', operation, args[0]);
            }
            if (object_name === 'v') {
                return this.apply_pitv_component(this, turtle, 'V', operation, args[0]);
            }
            return turtle;
        }
        insert_harmony(turtle, chord, mode_name, voices) {
            const mode = (typeof mode_name === 'number')
                ? mode_name
                : PLSystem.harmony_mode(mode_name);
            const time = turtle.note.getTime();
            const voices_arg = (typeof voices === 'number' && voices > 0) ? voices : -1;
            const range = this.pitv.range;
            const functional_mode = mode === PLSystem.harmony_mode('Hd')
                || mode === PLSystem.harmony_mode('Hds');
            if (functional_mode) {
                this.score.insertFunctionalHarmony(
                    time, turtle.scale, turtle.degree, voices_arg, mode, range);
                const voice_count = voices_arg > 0 ? voices_arg : turtle.chord.voices();
                turtle.prior_chord = PLSystem.chord_at_scale_degree(
                    turtle.scale, turtle.degree, voice_count).clone();
            } else if (typeof this.score.insertChordWithMode === 'function') {
                const reference = chord || turtle.chord;
                this.score.insertChordWithMode(time, reference, mode, voices_arg, range);
                turtle.prior_chord = reference.clone();
            } else {
                const reference = chord || turtle.chord;
                this.score.insertChord(time, reference);
                turtle.prior_chord = reference.clone();
            }
            return turtle;
        }
        interpret_grammar_builtin(word, turtle) {
            let args = word.actual_parameter_values;
            switch (word.builtin_name) {
                case 'F': {
                    for (let i = 0; i < PLSystem.NOTE_MOTION_DIMENSIONS; i++) {
                        const delta = turtle.magnitude[i] * turtle.orientation[i];
                        if (delta !== 0) {
                            chordl_set_note_dim(
                                turtle.note, i, chordl_note_dim(turtle.note, i) + delta);
                        }
                    }
                    return turtle;
                }
                case 'R': {
                    if (args.length >= 3) {
                        let from_axis = args[0];
                        let to_axis = args[1];
                        let angle = args[2];
                        let rotation = numeric.identity(turtle.orientation.length);
                        rotation[from_axis][from_axis] = Math.cos(angle);
                        rotation[from_axis][to_axis] = -Math.sin(angle);
                        rotation[to_axis][from_axis] = Math.sin(angle);
                        rotation[to_axis][to_axis] = Math.cos(angle);
                        turtle.orientation = numeric.dotVM(turtle.orientation, rotation);
                    }
                    return turtle;
                }
                case 'Wn': {
                    let note = turtle.note.clone();
                    this.score.append_event(note);
                    return turtle;
                }
                case 'Wc': {
                    // Prefer octavewise-voiced chord when present (set by Revoicing*).
                    const chord = turtle.voiced_chord || turtle.chord;
                    for (let i = 0; i < chord.voices(); i++) {
                        const event = turtle.note.clone();
                        event.setKey(chord.getPitch(i));
                        this.score.append_event(event);
                    }
                    turtle.prior_chord = chord.clone();
                    return turtle;
                }
                case 'Wcd': {
                    if (args.length > 0) {
                        turtle.chord.setDuration(args[0]);
                    }
                    CsoundAC.insert(this.score, turtle.chord, turtle.note.getTime());
                    turtle.prior_chord = turtle.chord.clone();
                    return turtle;
                }
                case 'Hc': {
                    let voices = args.length > 0 ? args[0] : turtle.chord.voices();
                    return this.insert_harmony(turtle, turtle.chord, 'Hc', voices);
                }
                case 'Hcv': {
                    let voices = args.length > 0 ? args[0] : turtle.chord.voices();
                    return this.insert_harmony(turtle, turtle.chord, 'Hcv', voices);
                }
                case 'Hcs': {
                    let voices = args.length > 0 ? args[0] : turtle.chord.voices();
                    return this.insert_harmony(turtle, turtle.chord, 'Hcs', voices);
                }
                case 'Hd': {
                    let voices = args.length > 0 ? args[0] : turtle.chord.voices();
                    return this.insert_harmony(turtle, null, 'Hd', voices);
                }
                case 'Hs': {
                    // ChordLindenmayer (Sc P): harmony timeline for conform / voiceleading.
                    this.score.insertChord(turtle.note.getTime(), turtle.scale);
                    turtle.prior_chord = turtle.scale.clone();
                    return turtle;
                }
                case 'Cd': {
                    // Set turtle.chord from scale at turtle.degree with N voices.
                    let voices = args.length > 0 ? args[0] : turtle.chord.voices();
                    const degree = PLSystem.ensure_turtle_degree(turtle);
                    turtle.chord = PLSystem.chord_at_scale_degree(turtle.scale, degree, voices);
                    return turtle;
                }
                case 'C+': {
                    // Add one voice to turtle.chord (bass doubled / eOP).
                    turtle.chord = chordl_add_voice(turtle.chord);
                    return turtle;
                }
                case 'seed': {
                    // ChordLindenmayer (seed P value).
                    if (args.length > 0) {
                        PLSystem.seed_random(args[0]);
                    }
                    return turtle;
                }
                case 'Hds': {
                    let voices = args.length > 0 ? args[0] : turtle.chord.voices();
                    return this.insert_harmony(turtle, null, 'Hds', voices);
                }
                case 'M': {
                    // ChordLindenmayer (M Sc voices choice).
                    if (args.length > 0) {
                        let voices = args.length > 1 ? args[0] : turtle.chord.voices();
                        let choice = args.length > 1 ? args[1] : args[0];
                        const result = PLSystem.modulate_scale(turtle, voices, choice);
                        if (result.newScale != null) {
                            turtle.scale = result.newScale;
                        }
                        try {
                            PLSystem.log_modulation('M', result.succeeded, turtle, result.details, result.scaleText);
                        } catch (logErr) {
                            PLSystem.log_to_csound(`M: log error (${logErr.message || logErr})`);
                        }
                    }
                    return turtle;
                }
                case 'S': {
                    if (args.length >= 2) {
                        let voices = args.length > 2 ? args[2] : -1;
                        let temporary_chord = turtle.scale.secondary_to_degree(turtle.chord, args[0], args[1], voices);
                        if (temporary_chord == turtle.chord) {
                            console.warn('No secondary function to degree mutation is possible for the current scale and chord.');
                        } else {
                            turtle.chord = temporary_chord;
                        }
                    }
                    return turtle;
                }
                case 'I': {
                    turtle.chord = turtle.chord.eI();
                    return turtle;
                }
                case 'K': {
                    turtle.chord = turtle.chord.K();
                    return turtle;
                }
                case 'T': {
                    if (args.length > 0) {
                        turtle.chord = turtle.chord.T(args[0]);
                    }
                    return turtle;
                }
                case 'Q': {
                    let steps = args.length > 0 ? args[0] : 1;
                    turtle.chord = turtle.chord.Q(steps, turtle.scale);
                    return turtle;
                }
                case '[': {
                    this.turtle_stack.push(turtle.clone());
                    return turtle;
                }
                case ']': {
                    if (this.turtle_stack.length > 0) {
                        turtle = this.turtle_stack.pop();
                        turtle.pitv = this.pitv;
                    }
                    return turtle;
                }
                default:
                    return turtle;
            }
        }
        interpret_grammar_command(word, turtle) {
            turtle.pitv = this.pitv;
            if (word.command_type === 'arithmetic') {
                return this.interpret_grammar_arithmetic(word, turtle);
            }
            if (word.command_type === 'builtin') {
                return this.interpret_grammar_builtin(word, turtle);
            }
            return turtle;
        }
        reset(text) {
            this.iteration = 0;
            this.turtle_stack = [];
            this.stack = this.turtle_stack;
            this.score = new window.CsoundAC.ChordScore();
            this.chord_score = this.score;
            this.turtle.pitv = this.pitv;
        }
        /**
         * ChordLindenmayer::generateLocally post-process after writeScore:
         * rescale KEY into range, conform, tie (only at end), fixStatus.
         *
         * During generation, KEY is never wrapped; register arcs are preserved until
         * this rescale step. Do not tie before rescale — overlapping ties would lock
         * pitches. Harmony (conformToChords) runs only after rescale; tying is last.
         *
         * @param {boolean} [octave_equivalence=true]
         * @param {object} [options]
         * @param {boolean} [options.rescaleKey=true] rescale KEY before conform
         * @param {number} [options.keyMinimum=0] target minimum MIDI key
         * @param {number} [options.keyRange] target span (default pitv.range)
         * @param {boolean} [options.keyRescaleMinimum=true]
         * @param {boolean} [options.keyRescaleRange=true]
         */
        applyChordLindenmayerPostProcess(octave_equivalence = true, options = {}) {
            const opts = options || {};
            const rescaleKey = opts.rescaleKey !== false;
            const pitvRange = (this.pitv && Number.isFinite(this.pitv.range) && this.pitv.range > 0)
                ? this.pitv.range
                : 84;
            const keyMinimum = (opts.keyMinimum != null) ? opts.keyMinimum : 0;
            const keyRange = (opts.keyRange != null) ? opts.keyRange : pitvRange;
            const keyRescaleMinimum = opts.keyRescaleMinimum !== false;
            const keyRescaleRange = opts.keyRescaleRange !== false;

            this.score.sort();
            if (rescaleKey && keyRange > 0) {
                PLSystem.rescale_score_dimension(
                    this.score, 4, keyRescaleMinimum, keyRescaleRange, keyMinimum, keyRange);
            }
            this.score.conformToChords(false, octave_equivalence);
            this.score.tieOverlappingNotes();
            PLSystem.fix_status(this.score);
        }
        evaluate_actual_parameter_expressions(parent_word, child_word) {
            try {
                let prologue = 'let iteration = ' + this.iteration + ';';
                if (parent_word !== null) {
                    prologue = this.bind_parent_formals_to_prologue(parent_word, prologue);
                }
                for (let parameterIndex = 0; parameterIndex < child_word.actual_parameter_expressions.length; parameterIndex++) {
                    let child_word_actual_parameter_expression = child_word.actual_parameter_expressions[parameterIndex];
                    child_word.actual_parameter_values[parameterIndex] = PLSystem.evaluate_with_minimal_scope(prologue + child_word_actual_parameter_expression);
                }
            } catch (err) {
                console.log(err.stack);
                throw err;
            }
        }
        evaluate_condition_expression(parent_word, condition) {
            try {
                let prologue = 'let iteration = ' + this.iteration + ';';
                prologue = this.bind_parent_formals_to_prologue(parent_word, prologue);
                return PLSystem.evaluate_with_minimal_scope(prologue + condition);
            } catch (err) {
                console.log(err.stack);
                throw err;
            }
        }
        set_axiom(text) {
            PLSystem.require_production_terminator(text, 'axiom');
            this.axiom.length = 0;
            let words = PLSystem.split_production(text);
            for (let i = 0; i < words.length; i++) {
                this.axiom.push(new PLSystem.Word(words[i]));
            }
        }
        set_turtle(turtle_) {
            this.turtle = turtle_;
            this.turtle.pitv = this.pitv;
        }
        add_command(word_text, command) {
            let word = new PLSystem.Word(word_text);
            this.commands_for_words[word.key] = command;
            let formal_parameters = this.parameters_from_function_declaration(word_text);
            this.formal_parameters_for_commands[word.key] = formal_parameters;
        }
        add_rule(word_, condition, production) {
            PLSystem.require_item_terminator(word_, 'rule predecessor');
            let word = new PLSystem.Word(word_);
            this.register_formal_parameters_for_item(word);
            let rule = this.rule_for_word(word);
            if (typeof rule === "undefined") {
                rule = new PLSystem.Rule(word, condition, production);
                this.rules_for_words[rule.word.key] = rule;
            } else {
                rule.add_condition(condition, production);
            }
        };
        command_for_word(word) {
            let command = this.commands_for_words[word.key];
            if (typeof command === "undefined") {
                command = this.identity_command;
            }
            return command;
        }
        invoke_command(word, turtle) {
            turtle.pitv = this.pitv;
            if (word.grammar === 'plsystem' && word.kind === 'command') {
                return this.interpret_grammar_command(word, turtle);
            }
            let actual_parameter_values = word.actual_parameter_values.slice();
            let command = this.command_for_word(word);
            actual_parameter_values.splice(0, 0, this, turtle);
            return command.apply(word, actual_parameter_values);
        }
        generate(iterations) {
            if (typeof iterations !== "undefined") {
                this.iterations = iterations;
            }
            try {
                let initial_production = this.axiom;
                let current_production = [];
                let wordIndex;
                for (this.iteration = 0; this.iteration < this.iterations; this.iteration++) {
                    current_production.length = 0;
                    for (wordIndex = 0; wordIndex < initial_production.length; wordIndex++) {
                        let parent = initial_production[wordIndex].clone();
                        parent.rewrite(this, current_production);
                    }
                    initial_production = current_production.slice();
                }
                let working_turtle = this.turtle.clone();
                working_turtle.pitv = this.pitv;
                for (wordIndex = 0; wordIndex < current_production.length; wordIndex++) {
                    let word = current_production[wordIndex];
                    this.evaluate_actual_parameter_expressions(null, word);
                    working_turtle = this.invoke_command(word, working_turtle);
                }
                this.turtle = working_turtle;
            } catch (ex) {
                console.log(ex);
                throw ex;
            }
        }
        rule_for_word(word) {
            return this.rules_for_words[word.key];
        }
        parameters_from_function_declaration(str) {
            let args = /\(\s*([^)]+?)\s*\)/.exec(str);
            if (args === null) {
                return [];
            }
            if (args[1]) {
                args = args[1].split(/\s*,\s*/);
            }
            return args;
        }
        function_name_from_word(word) {
            let function_name = /function ([^(]*)/.exec(word)[1];
            return function_name;
        }
        words_from_production(production) {
            let words = production.split(';');
            return words;
        }
        /**
         * Conforms the pitch of each event in this,
         * to the closest pitch-class in its chord.
         */
        conformToChords(tie_overlaps = true, octave_equivalence = true) {
            this.score.sort();
            this.score.conformToChords(tie_overlaps, octave_equivalence);
            
            //     if (event.status == 144 && event.chord !== null) {
            //         ChordSpace.conformToChord(event, event.chord, false);
            //     }
            // });
        }
        /**
         * Register ChordLindenmayer custom commands (Cd, Fwd, UniV, Revoicing, …).
         * @param {object} [options] durationFactor, durationMinimum for Fwd note lengths.
         */
        register_chordlindenmayer_commands(options) {
            PLSystem.register_chordlindenmayer_commands(this, options);
        }
    };

    //////////////////////////////////////////////////////////////////////////////
    // ChordLindenmayer port (generator-2 → PLSystem grammar)
    //////////////////////////////////////////////////////////////////////////////

    PLSystem.CHORDL_DURATION_FACTOR = 2.5;
    PLSystem.CHORDL_DURATION_MINIMUM = 1.5;

    function chordl_note_dim(note, dim) {
        switch (dim) {
            case 0: return note.getTime();
            case 1: return note.getDuration();
            case 2: return note.getStatus();
            case 3: return note.getInstrument();
            case 4: return note.getKey();
            case 5: return note.getVelocity();
            case 6: return note.getPan();
            default: return 0;
        }
    }

    function chordl_set_note_dim(note, dim, value) {
        switch (dim) {
            case 0: note.setTime(value); break;
            case 1: note.setDuration(value); break;
            case 2: note.setStatus(value); break;
            case 3: note.setInstrument(value); break;
            case 4: note.setKey(value); break;
            case 5: note.setVelocity(value); break;
            case 6: note.setPan(value); break;
        }
    }

    /** Voicing index for ChordL (matches C++ turtle.voicing; not full PITV decomposition). */
    function chordl_default_pitv(V) {
        return { P: 0, I: 0, T: 0, V: Number.isFinite(V) ? V : 1 };
    }

    /**
     * ChordL revoicing: octavewiseRevoicing only (see ChordLindenmayer::chordOperation W).
     * Do not call PITV fromChord/toChord here — wasm aborts on non-OP working chords.
     *
     * When UniV recorded its sampling interval (V_lo/V_hi), the sampled V is mapped
     * proportionally onto the chord's actual voicing count. Otherwise the raw index
     * (mod count, as in C++) only reaches the first few — lowest, most compact —
     * voicings, which piles all chords into a narrow low band of the register.
     */
    function chordl_revoicing(lsys, chord, pitv_obj) {
        const pitv_config = lsys && lsys.pitv;
        const range = pitv_config ? Math.floor(pitv_config.range) : 84;
        if (typeof CsoundAC === 'undefined'
            || typeof CsoundAC.octavewiseRevoicing !== 'function') {
            return chord;
        }
        let V = Math.floor(pitv_obj.V);
        if (typeof CsoundAC.octavewiseRevoicings === 'function'
            && Number.isFinite(pitv_obj.V_lo) && Number.isFinite(pitv_obj.V_hi)
            && pitv_obj.V_hi > pitv_obj.V_lo) {
            const count = CsoundAC.octavewiseRevoicings(chord, range);
            if (count > 0) {
                const fraction = (pitv_obj.V - pitv_obj.V_lo) / (pitv_obj.V_hi - pitv_obj.V_lo);
                V = Math.min(count - 1, Math.max(0, Math.floor(fraction * count)));
            }
        }
        return CsoundAC.octavewiseRevoicing(chord, V, range);
    }

    /** Ensure turtle.chordl_pitv exists (plain JS object; pitv.V is the voicing index). */
    function chordl_pitv_from_turtle(turtle) {
        if (!turtle.chordl_pitv) {
            turtle.chordl_pitv = chordl_default_pitv(1);
        }
        if (typeof turtle.chordl_pitv.V !== 'number' || !Number.isFinite(turtle.chordl_pitv.V)) {
            turtle.chordl_pitv.V = 1;
        }
        return turtle.chordl_pitv;
    }

    function chordl_add_voice(chord) {
        let c = chord.eOP();
        c.resize(c.voices() + 1);
        c.setPitch(c.voices() - 1, c.getPitch(0));
        return c.eOP();
    }

    PLSystem.prepare_chordl_turtle = function (turtle) {
        chordl_pitv_from_turtle(turtle);
        PLSystem.ensure_turtle_degree(turtle);
        return turtle;
    };

    /**
     * ChordLindenmayer custom commands used by cloud5-example-score-generator-5.
     * Builtin grammar handles n/o/m/c/s/d/p/i/t and inserts; these cover the rest.
     */
    PLSystem.register_chordlindenmayer_commands = function (lsys, options) {
        options = options || {};
        const durationFactor = (options.durationFactor != null)
            ? options.durationFactor
            : PLSystem.CHORDL_DURATION_FACTOR;
        const durationMinimum = (options.durationMinimum != null)
            ? options.durationMinimum
            : PLSystem.CHORDL_DURATION_MINIMUM;

        lsys.add_command('Cd(int voices)', function (lsys_, turtle, voices) {
            const degree = PLSystem.ensure_turtle_degree(turtle);
            turtle.chord = PLSystem.chord_at_scale_degree(turtle.scale, degree, voices);
            return turtle;
        });

        lsys.add_command('Fwd(num x)', function (lsys_, turtle, x) {
            chordl_pitv_from_turtle(turtle);
            let timeDelta = 0;
            for (let i = 0; i < PLSystem.NOTE_MOTION_DIMENSIONS; i++) {
                const delta = x * turtle.magnitude[i] * turtle.orientation[i];
                if (i === 0) {
                    timeDelta = delta;
                }
                chordl_set_note_dim(turtle.n, i, chordl_note_dim(turtle.n, i) + delta);
            }
            if (timeDelta !== 0) {
                const scaled = Math.abs(timeDelta) * durationFactor;
                turtle.n.setDuration(Math.max(scaled, durationMinimum));
            }
            return turtle;
        });

        lsys.add_command('UniV(num lo, num hi)', function (lsys_, turtle, lo, hi) {
            chordl_pitv_from_turtle(turtle);
            turtle.chordl_pitv.V = PLSystem.random_uniform(lo, hi);
            turtle.chordl_pitv.V_lo = lo;
            turtle.chordl_pitv.V_hi = hi;
            return turtle;
        });

        lsys.add_command('Revoicing()', function (lsys_, turtle) {
            const pitv = chordl_pitv_from_turtle(turtle);
            turtle.voiced_chord = chordl_revoicing(lsys_, turtle.chord, pitv);
            return turtle;
        });
    };

    //////////////////////////////////////////////////////////////////////////////
    // EXPORTS
    //////////////////////////////////////////////////////////////////////////////

    // Node: Export function
    if (typeof module !== "undefined" && module.exports) {
        module.exports = PLSystem;
    }
    // AMD/requirejs: Define the module
    else if (typeof define === 'function' && define.amd) {
        define(function () {
            return PLSystem;
        });
    }
    // Browser: Expose to window
    else {
        window.PLSystem = PLSystem;
    }

})();
