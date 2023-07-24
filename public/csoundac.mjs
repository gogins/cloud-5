/**
 * C S O U N D A C   M O D U L E   F O R   S T R U D E L
 *
 * Author: Michael Gogins
 * 
 * [csound-ac](https://github.com/gogins/csound-ac), or CsoundAC, is a C++ 
 * algorithmic composition library designed for use with Csound.
 *
 * [csound-wasm](https://github.com/gogins/csound-wasm) is a WebAssembly 
 * library containing both Csound and CsoundAC, with a JavaScript API, 
 * designed for use in Web browsers and npm applications.
 *
 * This module brings chords and scales, and operations upon them, 
 * from the CsoundAC library for algorithmic composition into the 
 * Strudel (Tidal Cycles-based) JavaScript pattern language. 
 *
 * Please note, however, that this module, although it defines a number of 
 * Patterns, is not built into Strudel and is designed to be dynamically 
 * imported in patches created by users in the Strudel REPL. Therefore, code 
 * in this module, as with all other modules directly imported in code 
 * run by the Strudel REPL, must not use template strings.
 *
 * The resulting Patterns must still go through the Strudel note Pattern 
 * in order to trigger audio output.
 *
 */
let csac_debugging = true;
let csound = globalThis.__csound__;
let csoundac = globalThis.__csoundac__;
let audioContext = new AudioContext();

/** 
 * The following Patterns are defined in this module:
 *
 */

const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * CsoundAC operations are applied to whole Haps only, so that Haps within 
 * that whole will use the Score or Chord of the whole, and will not create 
 * spurious operations.
 */
export const isHapWhole = function(hap) {
    let isWhole = (hap.whole.begin.equals(hap.part.begin) && hap.whole.end.equals(hap.part.end));
    return isWhole;
}

/**
 * Enables or disables print statement debugging in this module.
 */
export function debug(enabled) {
    csac_debugging = enabled;
}

/**
 * Prints a diagnostic message to both the Strudel logger and the Csound 
 * log.
 */
export const diagnostic = function(message) {
    const text = '[csac]' + message;
    logger(text, 'debug');
    if (csound) csound.message(text);
};

/**
 * Returns the frequency corresponding to any of various ways that pitch 
 * is represented in Strudel events.
 */
const getFrequency = (hap) => {
    let {
        value,
        context
    } = hap;
    // if value is number => interpret as midi number as long as its not marked as frequency
    if (typeof value === 'object') {
        if (value.freq) {
            return value.freq;
        }
        return getFreq(value.note || value.n || value.value);
    }
    if (typeof value === 'number' && context.type !== 'frequency') {
        value = midiToFreq(hap.value);
    } else if (typeof value === 'string' && isNote(value)) {
        value = midiToFreq(noteToMidi(hap.value));
    } else if (typeof value !== 'number') {
        throw new Error('not a note or frequency: ' + value);
    }
    return value;
};

/**
 * A utility that returns the MIDI key number for a frequency in Hz, 
 * as a real number allowing fractions for microtones.
 */
export function frequencyToMidiReal(frequency) {
    const middle_c = 261.62558;
    let octave_ = Math.log(frequency / middle_c) / Math.log(2.) + 8.;
    let midi_key = octave_ * 12. - 36.;
    return midi_key;
}

/**
 * A utility that returns the MIDI key number for a frequency in Hz, 
 * as the nearest integer.
 */
export function frequencyToMidiInteger(frequency) {
    let midi_key = frequencyToMidiReal(frequency);
    return Math.round(midi_key);
}

/**
 * A utility for making a _value_ copy of a Chord (or a Scale, which 
 * is derived from Chord). Object b is resized to the size of a, and a's 
 * pitches are copied to b. Currently, only pitches are copied.
 */
export function Clone(a, b) {
    b.resize(a.voices())
    for (let voice = 0; voice < a.voices(); ++voice) {
        let a_pitch = a.getPitch(voice);
        let b_pitch = b.getPitch(voice);
        b.setPitch(voice, a_pitch);
        if (csac_debugging) diagnostic(['[voice ', voice, 'a:', a_pitch, 'old b:', b_pitch, 'new b:', b.getPitch(voice), '\n'].join(' '));
    }
}

/**
 * Sends notes to Csound for rendering with MIDI semantics. The Hap value is
 * translated to these Csound pfields:
 *
 *  p1 -- Csound instrument either as a number (1-based, can be a fraction),
 *        or as a string name.
 *  p2 -- time in beats (usually seconds) from start of performance.
 *  p3 -- duration in beats (usually seconds).
 *  p4 -- MIDI key number (as a real number, not an integer but in [0, 127].
 *  p5 -- MIDI velocity (as a real number, not an integer but in [0, 127].
 *  p6 -- Strudel controls, as a string.
 * 
 * This variant of 'strudel.csoundm' is a workaround that uses a non-dominant 
 * trigger with a silent 'sound' to get the desired trigger semantics.
 */
export const csoundn = register('csoundn', (instrument, pat) => {
  let p1 = instrument;
  //~ if (typeof instrument === 'string') {
    //~ p1 = ['{', instrument, '}'].join();
  //~ }
  return pat.onTrigger((tidal_time, hap) => {
    if (!csound) {
      diagnostic('[csoundn]: Csound is not yet loaded.\n');
      return;
    }
    if (typeof hap.value !== 'object') {
      throw new Error('[csoundn] supports only objects as hap values.');
    }
    // Time in seconds counting from now.
    const p2 = 0; /// TODO: tidal_time - audioContext.currentTime;
    const p3 = hap.duration.valueOf() + 0;
    const frequency = getFrequency(hap);
    // Translate frequency to MIDI key number _without_ rounding.
    const C4 = 261.62558;
    let octave = Math.log(frequency / C4) / Math.log(2.0) + 8.0;
    const p4 = octave * 12.0 - 36.0;
    // We prefer floating point precision, but over the MIDI range [0, 127].
    const p5 = 127 * (hap.context?.velocity ?? 0.9);
    // The Strudel controls as a string.
    //~ const p6 = Object.entries({ ...hap.value, frequency })
      //~ .flat()
      //~ .join('/');
    const i_statement = ['i', p1, p2, p3, p4, p5, '\n'].join(' ');
    hap.value.note = Math.round(p4);
    diagnostic('[csoundn][onTrigger]: ' + JSON.stringify({tidal_time, i_statement, hap}, null, 4) + '\n');
    csound.inputMessage(i_statement);
  }, false).sound('sine').gain(0)
});

export class StatefulPatterns {
    constructor() {
    }
    
    Probably need to slice 'arguments' to match needs.
    
    /**
     * This class automatically registers (most of) its member functions as 
     * Strudel Patterns. Member functions have signature 'Pat(...args)', where 
     * the names of the member functions are the same as the names of the 
     * corresponding Patterns, the first element of 'args' is the first 
     * argument to the Pattern, and the last element of 'args' is the Hap for 
     * the Pattern. The corresponding Pattern functions uave signature 
     * 'Pat(..args)', where the name of the Pattern is the same as the name of 
     * the corresponding class member function, but the first element of 
     * 'args' is an instance of the class, and the last element of 'args' is 
     * the Hap for the Pattern. The member functions will be called by Strudel 
     * both on triggers, and to modify or set the values of the Hap for the 
     * Pattern, in the usual way for Patterns. Thus, all state for these 
     * Patterns is held in class instances, and the automatically registered 
     * Patterns invoke the corresponding member functions of such instances. 
     * 
     * Please note, thanks to the dual nature of the generated Patterns, 
     * Hap values must be retained by the Pattern unless they are explicitly 
     * modified or assigned by the member function; in other words, all values 
     * returned by the class member functions are returned in the Hap.value,
     * so any number of values may be returned as properties of Hap.value, 
     * often 'note' but anything else as well.
     */
    registerMethods() {
        for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            let method = this[name];
            if (!(method instanceof Function)) continue;
            if (method.name === 'constructor') continue;
            if (method.name === 'registerMethods') continue;
            console.log(method, name);
            let instance = this;
            let result = register(method.name, (instance, pat) => {
                let pat = args[args.length -1];
                return pat.withHap((hap) => {
                    instance.current_time = audioContext.currentTime;
                    diagnostic('[registerStateful][withHap]:' + JSON.stringify({hap, instance, method}, null, 4) + '\n');
                    let onTrigger = (t, hap, duration, cps) => {
                        // In the method call, the Hap value will normally be 
                        // updated, not replaced, e.g. 'hap.value = 
                        // {..hap.value, note: 47}.;
                        method.call(instance, hap);
                        diagnostic('[registerStateful][onTrigger]:' + JSON.stringify({t, hap, duration, cps, stateful}, null, 4) + '\n');
                    }
                    let note = instance.value;
                    let dominant = false;
                    ///return hap.withValue(() => (isObject ? { ...hap.value, note } : note)).setContext({
                    return hap.withValue(() => note).setContext({
                        ...hap.context,
                        onTrigger: onTrigger,
                        dominantTrigger: dominant,
                    });
                 });
            });
        }
    }
    /**
     * Signature for a Pattern implemented by a member function:
     */
    method_a(hap, ...args) {
    }
    method_b() {
    }
}

export class DerivedStatefulPatterns extends StatefulPatterns {
    constructor() {
        super();
        this.registerMethods();
    }
    method_c() {
    }
    method_d() {
    }
}


let statefulPatterns = new DerivedStatefulPatterns();

/**
 * A Pattern that calls a stateful object that may be defined in a user level 
 * Strudel patch. To be used something like this:
 *
 * class Logistic {
 *     constructor(c, y) {
 *         this.c = c;
 *         this.y = y;
 *         this.value = 36;
 *         this.prior_time = 0;
 *         this.current_time = 0;
 *         this.delta_time = 0;
 *     }
 *     evaluate(hap) {
 *         let y1 = 4 * this.c * this.y * (1 - this.y);
 *         this.value = Math.round(y1 * 36 + 36);
 *         console.log('[Logistic.evaluate]:', JSON.stringify({this}, null, 4));
 *         this.y = y1;
 *         this.delta_time = this.current_time - this.prior_time;
 *         this.prior_time = this.current_time;
 *     }
 * }
 *
 * const logistic = new Logistic(.998, .5);
 * 
 * const logisticPattern = csac.registerStateful('logisticPattern', logistic, logistic.evaluate);
 *
 * pure(1).logisticPattern(logistic)
 */
export const registerStateful = function(name, stateful, evaluator) {
    diagnostic('[registerStateful][withHap]:' + JSON.stringify({name, stateful, evaluator}, null, 4) + '\n');
    let result = register(name, (stateful, pat) => {
        return pat.withHap((hap) => {
            stateful.current_time = audioContext.currentTime;
            diagnostic('[registerStateful][withHap]:' + JSON.stringify({hap, stateful, evaluator}, null, 4) + '\n');
            let onTrigger = (t, hap, duration, cps) => {
                evaluator.call(stateful, hap);
                diagnostic('[registerStateful][onTrigger]:' + JSON.stringify({t, hap, duration, cps, stateful}, null, 4) + '\n');
            }
            let note = stateful.value;
            let dominant = false;
            ///return hap.withValue(() => (isObject ? { ...hap.value, note } : note)).setContext({
            return hap.withValue(() => note).setContext({
                ...hap.context,
                onTrigger: onTrigger,
                dominantTrigger: dominant,
            });
         });
    });
    return result;
};

/**
 * Form of registerStateful that passes one parameter to the stateful evaluator.
 */
export const registerStateful1 = function(name, stateful, evaluator, p1) {
    diagnostic('[registerStateful][withHap]:' + JSON.stringify({name, stateful, evaluator, p1}, null, 4) + '\n');
    let result = register(name, (stateful, p1, pat) => {
        return pat.withHap((hap) => {
            stateful.current_time = audioContext.currentTime;
            diagnostic('[registerStateful][withHap]:' + JSON.stringify({hap, stateful, evaluator, p1}, null, 4) + '\n');
            let onTrigger = (t, hap, duration, cps) => {
                evaluator.call(stateful, hap, p1);
                diagnostic('[registerStateful][onTrigger]:' + JSON.stringify({t, hap, duration, cps, stateful, p1}, null, 4) + '\n');
            }
            hap.value.note = stateful.value;;
            let dominant = false;
            return hap.withValue(() => hap.value).setContext({
                ...hap.context,
                onTrigger: onTrigger,
                dominantTrigger: dominant,
            });
         });
    });
    return result;
};

/**
 * Form of registerStateful that passes two parameters to the stateful evaluator.
 */
export const registerStateful2 = function(name, stateful, evaluator, p1, p2) {
    diagnostic('[registerStateful][withHap]:' + JSON.stringify({name, stateful, evaluator, p1, p2}, null, 4) + '\n');
    let result = register(name, (stateful, p1, pat) => {
        return pat.withHap((hap) => {
            stateful.current_time = audioContext.currentTime;
            diagnostic('[registerStateful][withHap]:' + JSON.stringify({hap, stateful, evaluator, p1}, null, 4) + '\n');
            let onTrigger = (t, hap, duration, cps) => {
                evaluator.call(stateful, hap, p1, p2);
                diagnostic('[registerStateful][onTrigger]:' + JSON.stringify({t, hap, duration, cps, stateful, p1, p2}, null, 4) + '\n');
            }
            let v = stateful.value;
            let dominant = false;
            return hap.withValue(() => v).setContext({
                ...hap.context,
                onTrigger: onTrigger,
                dominantTrigger: dominant,
            });
         });
    });
    return result;
};


/**
 * Creates and initializes a CsoundAC Chord object. This function should be 
 * called from module scope in Strudel code before creating any Patterns. The 
 * Chord class is based on Dmitri Tymoczko's model of chord space, and 
 * represents an equally tempered chord of the specified number of voices as 
 * a single point in chord space, where each dimension of the space 
 * corresponds to one voice of the Chord. Chords are equipped with numerous 
 * operations from pragmatic music theory, atonal music theory, and 
 * neo-Riemannian music theory.
 */
export function Chord(name) {
    if (csac_debugging) diagnostic('[csacChord] Creating Chord...\n');
    let chord_ = csoundac.chordForName(name);
    if (csac_debugging) diagnostic('[csacChord]:' + chord_.toString() + '\n');
    return chord_;
}

/**
 * Creates and initializes a CsoundAC Scale object. This function can be 
 * called from module scope in Strudel code before creating any Patterns. The 
 * Scale class is derived from the CsoundAC Chord class, but has been 
 * equipped with additional methods based on Dimitri Tymoczko's model of 
 * functional harmony. This enables algorithmically generating Chords from 
 * scale degrees, transposing Chords by scale degrees, generating all 
 * possible modulations given a pivot chord, and implementing secondary 
 * dominants and tonicizations based on scale degree.
 */
export function Scale(name) {
    if (csac_debugging) diagnostic('[Scale] Creating Scale...\n');
    let scale_ = csoundac.scaleForName(name);
    if (csac_debugging) diagnostic('[Scale] ' + scale_.name() + '\n');
    return scale_;
}

/**
 * Creates and initializes a CsoundAC PITV object. This function should be 
 * called from module scope in Strudel code before creating any Patterns. The 
 * PITV object is a 4 dimensional cyclic group whose dimensions are TI set 
 * class (P), chord inversion (I), pitch-class transposition (T), and index 
 * of octavewise revoicing within the specified range (V). The elements of 
 * the group are chords in 12 tone equal temperament with the specified 
 * number of voices. There is a one-to-one mapping between PITV indices and 
 * chords, such that each voiced chord corresponds to a PITV index, and each 
 * PITV index corresponds to a voiced chord. This enables algorithmically 
 * generating harmonies and voicings by independently varying P, I, T, and V.
 */
export function Pitv(voices, range) {
    if (csac_debugging) diagnostic('[Pitv] Creating PITV group...\n');
    let pitv = new csoundac.PITV();
    pitv.initialize(voices, range, 1., false);
    pitv.P = 0;
    pitv.I = 0;
    pitv.T = 0;
    pitv.V = 0;
    pitv.list(true, false, false);
    return pitv;
}

export class ChordOperations {
    constructor(chord_id, modality_id) {
        if (typeof chord_id == 'string') {
            this.ac_chord = new csoundac.chordForName(chord_id);
            if (csac_debugging) diagnostic('[ChordOperations]: created new chord.\n');
        } else {
            this.ac_chord = chord_id;
            if (csac_debugging) diagnostic('[ChordOperations]: using existing chord.\n');
        }
        if (csac_debugging) {
            let message = ['[ChordOperations] chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' ');
            diagnostic(message);
        }
        if (typeof modality_id == 'undefined') {
            this.ac_modality = this.ac_chord;
        } else {
            if (typeof modality_id == 'string') {
                this.ac_modality = new csoundac.chordForName(modality_id);
                if (csac_debugging) diagnostic('[ChordOperations]: created new chord.\n');
            } else {
                this.ac_modality = modality_id;
                if (csac_debugging) diagnostic('[ChordOperations]: using existing chord.\n');
            }
            if (csac_debugging) {
                let message = ['[ChordOperations] modality:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' ');
                diagnostic(message);
            }
        }
    }
    /**
     * Applies a Chord or chord name to this.
     */
    C(hap, chord_id) {
        if (typeof chord_id == 'string') {
            this.ac_chord = new csoundac.chordForName(chord_id);
            if (csac_debugging) diagnostic('[ChordOperations]: created new chord.\n');
        } else {
            this.ac_chord = chord_id;
            if (csac_debugging) diagnostic('[ChordOperations]: using existing chord.\n');
        }
        if (csac_debugging) {
            let message = ['[ChordOperations] chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' ');
            diagnostic(message);
        }
    }
    /**
     * Applies a transposition to this.
     */
    T(hap, semitones) {
        if (csac_debugging) diagnostic(['[ChordOperations][T] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        this.ac_chord = this.ac_chord.T(semitones);
        if (csac_debugging) diagnostic(['[ChordOperations][T] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
    }
    /**
     * Applies an inversion to this. The 
     * default center of reflection is 0.
     */
    I(hap, center) {
        if (typeof center === 'undefined') {
            center = 0;
        }
        if (csac_debugging) diagnostic(['[ChordOperations][I] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        this.ac_chord = this.ac_chord.I(center);
        if (csac_debugging) diagnostic(['[ChordOperations][I] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
     }
    /**
     * Applies the interchange by inversion operation of the Generalized 
     * Contextual Group of Fiore and Satyendra to this.
     */
    K(hap) {
        if (csac_debugging) diagnostic(['[ChordOperations][K] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        this.ac_chord = this.ac_chord.K();
        if (csac_debugging) diagnostic(['[ChordOperations][K] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
    }
    /**
     * Applies the contexual transposition operation of the Generalized 
     * Contextual Group of Fiore and Satyendra to this. The modality 
     * is set in the constructor of this class.
     */
    Q(hap, semitones) {
        if (csac_debugging) diagnostic(['[ChordOperations][Q] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        this.ac_chord = this.ac_chord.Q(semitones, this.modality);
        if (csac_debugging) diagnostic(['[ChordOperations][Q] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
    }
    /**
     * Applies the Chord of this to the note of the Hap, i.e., 
     * moves the note of the hap to the nearest pitch-class of the Chord.
     */
    N(hap) {
        let frequency;
        try {
            frequency = getFrequency(hap);
        } catch (error) {
            diagnostic('[apply] not a note!\n');
            return;
        }
        let current_midi_key = frequencyToMidiInteger(frequency);
        let epcs = ac_chord.epcs();
        if (csac_debugging) diagnostic(['[ChordOperations][N] current note:    ', current_midi_key, '\n'].join(' '));
        let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
        if (csac_debugging) diagnostic(['[ChordOperations][N] transformed note:', tnote, '\n\n'].join(' '));
        hap.value = note;
    }
}
 
export const chordOperations = new ChordOperations('CM9');
 
export const acC  = registerStateful1('acC',  chordOperations, chordOperations.C, 'CM9');
export const acCT = registerStateful1('acCT', chordOperations, chordOperations.T, 5);
export const acCI = registerStateful1('acCI', chordOperations, chordOperations.I, 0);
export const acCK = registerStateful( 'acCK', chordOperations, chordOperations.K);
export const acCQ = registerStateful1('acCQ', chordOperations, chordOperations.Q, 3);
export const acCN = registerStateful ('acCN', chordOperations, chordOperations.N);

class ScaleOperations {
}

class PitvOperations {
}


/**
 * A Pattern that inserts a CsoundAC Scale object into its context. The scale can 
 * be either the string name of a CsoundAC Scale, or a previously created Scale.
 */
export const acScale = register('acScale', function(scale, pat) {
    return pat.withHap((hap) => {
        let ac_scale;
        if (typeof scale == 'string') {
            ac_scale = new csoundac.Scale(scale);
            if (csac_debugging) diagnostic('[acScale]: created ' + ac_scale.toString() + '\n');
        } else {
            ac_scale = scale;
            if (csac_debugging) diagnostic('[acScale]: using ' + ac_scale.toString() + '\n');
        }
        if (csac_debugging) diagnostic('[acScale]: hap: ' + hap.show() + '\n');
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_scale
        });
    });
});

/**
 * A Pattern that inserts the Chord corresponding to the specified scale step 
 * of the Scale in the context, into the context. This enables generating tonal 
 * chord progressions in a patternified way. 
 */
export const acSS = register('acSS', (scale_step, voices, pat) => {
    return pat.withHap((hap) => {
        let ac_scale;
        if (!hap.context.ac_scale) {
            throw new Error('Can only use acSS after .acChord.\n');
        }
        let ac_chord = ac_scale.chord(scale_step, voices, 3);
        if (csac_debugging) diagnostic(['[acSS]: old chord:', current_chord.toString(), 'scale step:', scale_step, 'new chord:', new_chord.toString(), '\n'].join(' '));
        let result = hap.withValue(() => (isObject ? {
            ...hap.value,
            ac_chord
        } : ac_chord)).setContext({
            ...hap.context,
            ac_chord
        });
        return result;
    });
});

/**
 * A Pattern that transposes the Chord in its context by the specified number 
 * of scale steps in the Scale in the context. This enables generating tonal 
 * chord progressions within the Scale in a patternified way.
 */
export const acST = register('acST', (scale_steps, pat) => {
    return pat.withHap((hap) => {
        let ac_scale;
        if (!hap.context.ac_scale) {
            throw new Error('Can only use acST after .acScale\n');
        }
        ac_scale = hap.context.ac_scale;
        let ac_chord;
        if (!hap.context.ac_chord) {
            throw new Error('Can only use acST after .acChord\n');
        }
        ac_chord = hap.context.ac_chord;
        let new_chord = ac_scale.transpose_degrees(ac_chord, scale_steps, 3);
        if (csac_debugging) diagnostic(['[acST]: old chord:', ac_chord.toString(), 'scale steps:', scale_steps, 'new chord:', new_chord.toString(), '\n'].join(' '));
        ac_chord = new_chord;
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_chord
        });
    });
});

/**
 * A Pattern that modulates from one Scale to another, assuming that the 
 * Chord in the context is a pivot chord of the Scale in the context. This 
 * enables generating correct tonal key changes in a patternified way. The  
 * new Scale replaces the old one in the context and can then be used in 
 * Scale-based Patterns. The specified index picks one of the possible modulations.
 */
export const acSM = register('acSM', (index, pat) => {
    return pat.withHap((hap) => {
        let ac_scale;
        if (!hap.context.ac_scale) {
            throw new Error('Can only use acSM after .acScale\n');
        }
        ac_scale = hap.context.ac_scale;
        let ac_chord;
        if (!hap.context.ac_chord) {
            throw new Error('Can only use acSM after .acChord\n');
        }
        ac_chord = hap.context.ac_chord;
        let pivot_chord_eop = ac_chord.eOP();
        let possible_modulations = ac_scale.modulations(pivot_chord_eop);
        let new_scale = ac_scale;
        let modulation_count = possible_modulations.size();
        let wrapped_index = -1;
        if (modulation_count > 0) {
            wrapped_index = index % modulation_count;
            new_scale = possible_modulations.get(wrapped_index);
            if (csac_debugging) {
                let message_ = [
'[acSM]: modulating in:', ac_scale.toString(), ac_scale.name(), '\n',
'[acSM]: from pivot:   ', pivot_chord_eop.toString(), pivot_chord_eop.name(), '\n',
'[acSM]: modulations:  ', modulation_count, '=>', wrapped_index, '\n',
'[acSM]: modulated to: ', new_scale.toString(), new_scale.name()
].join(' ');
                diagnostic(message_);
                diagnostic('[acSM]: hap: ' + hap.show() + '\n');
            }
            ac_scale = new_scale;
        }
        let result = hap.withValue(() => (isObject ? {
            ...hap.value,
            ac_scale
        } : new_midi_key)).setContext({
            ...hap.context,
            ac_scale
        });
        return result;
    });
});

/**
 * A Pattern that conforms notes to the closest _pitch-class_ of the CsoundAC Scale 
 * that is in its context.
 */
export const acSN = register('acSN', (pat) => {
    return pat.withHap((hap) => {
        let ac_scale;
        if (!hap.context.ac_scale) {
            throw new Error('Can only use acSN after .acScale.\n');
        }
        ac_scale = hap.context.ac_scale;
        let frequency;
        try {
            frequency = getFrequency(hap);
        } catch (error) {
            diagnostic('[acSN] not a note!\n');
            return;
        }
        let current_midi_key = frequencyToMidiInteger(frequency);
        let epcs = ac_scale.epcs();
        let new_midi_key = csoundac.conformToPitchClassSet(current_midi_key, epcs);
        let result = hap.withValue(() => new_midi_key);
        if (csac_debugging) diagnostic(['[acSN]:', ac_scale.toString(), ac_scale.eOP().name(), 'old note:', current_midi_key, 'new note:', result.value, '\n'].join(' '));
        if (csac_debugging) diagnostic('[acSN]: hap: ' + hap.show() +'\n');
        return result;
    });
});

/**
 * A Pattern that inserts a CsoundAC PITV object into its context. The PITV 
 * object must have been previously created.
 */
export const acPitv = register('acPitv', function(pitv, pat) {
    return pat.withHap((hap) => {
        let ac_pitv = pitv;
        if (csac_debugging) {
            diagnostic('[acPitv]: using ' + ac_pitv.toString() + '\n');
            pitv.list(true, false, false);
        }
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_pitv
        });
    });
});

/**
 * A Pattern that sets the indicated set-type index of the PITV element. This 
 * enables mutating Chords in a patternified way.
 */
export const acPP = register('acPP', (P, pat) => {
    return pat.withHap((hap) => {
        let ac_pitv;
        if (!hap.context.ac_pitv) {
            throw new Error('Can only use acPP after .acPitv.\n');
        }
        ac_pitv = hap.context.ac_pitv;
        ac_pitv.P = P;
        if (csac_debugging) diagnostic('[acPP]: ' + ac_pitv.P + '\n');
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_pitv
        });
    });
});

/**
 * A Pattern that sets the indicated index of inversion of the PITV element. 
 * This enables inverting a PITV element in a patternified way.
 */
export const acPI = register('acPI', (I, pat) => {
    return pat.withHap((hap) => {
        let ac_pitv;
        if (!hap.context.ac_pitv) {
            throw new Error('Can only use acPI after .acPitv.\n');
        }
        ac_pitv = hap.context.ac_pitv;
        ac_pitv.I = I;
        if (csac_debugging) diagnostic('[acPI]: ' + ac_pitv.I + '\n');
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_pitv
        });
    });
});

/**
 * A Pattern that sets the indicated index of pitch-class transposition of 
 * the PITV element. This enables transposing a PITV element in a patternified 
 * way.
 */
export const acPT = register('acPT', (T, pat) => {
    return pat.withHap((hap) => {
        let ac_pitv;
        if (!hap.context.ac_pitv) {
            throw new Error('Can only use acPI after .acPitv.\n');
        }
        ac_pitv = hap.context.ac_pitv;
        ac_pitv.T = T;
        if (csac_debugging) diagnostic('[acPT]: ' + ac_pitv.T + '\n');
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_pitv
        });
    });
});

/**
 * A Pattern that sets the indicated index of octavewise revoicing of the 
 * PITV element. This enables revoicing a PITV element in a patternified way.
 */
export const acPV = register('acPV', (V, pat) => {
    return pat.withHap((hap) => {
        let ac_pitv;
        if (!hap.context.ac_pitv) {
            throw new Error('Can only use acPV after .acPitv.\n');
        }
        ac_pitv = hap.context.ac_pitv;
        ac_pitv.V = V;
        if (csac_debugging) diagnostic('[acPV]: ' + ac_pitv.V + '\n');
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_pitv
        });
    });
});

/**
 * A Pattern that inserts the Chord corresponding to the element of the 
 * PITV group in the context, into the context.
 */
export const acPC = register('acPC', (pat) => {
    return pat.withHap((hap) => {
        let ac_pitv;
        if (!hap.context.ac_pitv) {
            throw new Error('Can only use acPV after .acPitv.\n');
        }
        ac_pitv = hap.context.ac_pitv;
        let frequency;
        try {
            frequency = getFrequency(hap);
        } catch (error) {
            diagnostic('[acPC] not a note!\n');
            return;
        }
        let ac_chord = ac_pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, true).get(0);
        let result = hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_chord
        });
        if (csac_debugging) diagnostic(['[acCN]:', ac_chord.toString(), ac_chord.eOP().name(), 'old note:', current_midi_key, 'new note:', result.value, '\n'].join(' '));
        return result;
    });
});

/**
 * A Pattern that that conforms the notes of a Pattern to the current 
 * element of the PITV object. The notes are moved to the closest _pitch- 
 * class_ of the _pitch-class set_ of the PITV element.
 */
export const acPN = register('acPN', (pat) => {
    return pat.withHap((hap) => {
        let ac_pitv;
        if (!hap.context.ac_pitv) {
            throw new Error('Can only use acPV after .acPitv.\n');
        }
        ac_pitv = hap.context.ac_pitv;
        let frequency;
        try {
            frequency = getFrequency(hap);
        } catch (error) {
            diagnostic('[acPC] not a note!\n', 'warning');
            return;
        }
        let current_midi_key = frequencyToMidiInteger(frequency);
        let ac_chord = pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, true).get(0);
        let epcs = ac_chord.epcs();
        let new_midi_key = csoundac.conformToPitchClassSet(current_midi_key, epcs);
        let result = hap.withValue(() => new_midi_key);
        if (csac_debugging) diagnostic(['[acPNV]:', ac_chord.toString(), ac_chord.eOP().name(), 'old note:', current_midi_key, 'new note:', result.value, '\n'].join(' '));
        return result;
    });
});

/**
 * A Pattern that that conforms the notes of a Pattern to the current 
 * element of the PITV object. The notes are moved to the closest _note_ 
 * of the chord _voicing_ of the PITV element.
 */
export const acPNV = register('acPNV', (pat) => {
    return pat.withHap((hap) => {
        let ac_pitv;
        if (!hap.context.ac_pitv) {
            throw new Error('Can only use acPV after .acPitv.\n');
        }
        ac_pitv = hap.context.ac_pitv;
        let frequency;
        try {
            frequency = getFrequency(hap);
        } catch (error) {
            diagnostic('[acPC] not a note!\n');
            return;
        }
        let current_midi_key = frequencyToMidiInteger(frequency);
        let ac_chord = pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, true).get(0);
        let new_midi_key = csoundac.closestPitch(current_midi_key, voiced_chord);
        let result = hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_chord
        });
        if (csac_debugging) diagnostic(['[acPNV]:', ac_chord.toString(), ac_chord.eOP().name(), 'old note:', current_midi_key, 'new note:', result.value, '\n'].join(' '));
        return result;
    });
});

