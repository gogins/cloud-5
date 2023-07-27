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

export const isTriggerHap = (pat, hap) => {
    if (hap.hasOnset() === false) {
        return false;
    }
    if (hap.whole.equals(hap.part) === false) {
        return false;
    }
    return true;
};

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

var triggerSequence = 0;

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
    triggerSequence = triggerSequence + 1;
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
    hap.value.from = "csoundn";
    diagnostic('[csoundn][onTrigger]: ' + JSON.stringify({triggerSequence, tidal_time, i_statement, hap}, null, 4) + '\n');
    csound.inputMessage(i_statement);
  }, false).gain(0);
});

/**
 * This is a base class that can be used to define Patterns that hold state 
 * between queries. Derived classes automatically register (most of) of their 
 * methods as Strudel Patterns, each of which takes an instance of the class 
 * that has been defined in module scope as a first parameter. By default, 
 * class methods are called by Strudel on every cycle onset, thus aligning 
 * changes of state with cycle boundaries, and the value of state is assigned  
 * to the Hap value. However, those class methods with names ending in 'V' are 
 * called by Strudel on every query of their Pattern, thus enabling the 
 * instance state to be used for setting or modifying Hap values. 
 */
export class StatefulPatterns {
    constructor() {
    }
    registerMethods() {
        for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            let method = this[name];
            if ((method instanceof Function) &&
                (method.name !== this.constructor.name) && 
                (method.name !== 'registerMethods')) {
                diagnostic('[StatefulPatterns][registerMethods]:' + JSON.stringify({method}, null, 4) + '\n');
                let instance = this;
                // Problem: the Pattern function must explicitly declare its 
                // parameters. We can't push that information from the class 
                // method Function object into the Pattern function 
                // declaration, but we do know the arity of the class method, 
                // which is always at least 1 because of the need to pass the 
                // Hap.
                let arity = method.length;
                // For now, we will set up separate registrations for the 
                // first few arities. The actual arity of the Pattern function 
                // is always at least 2 because of the need to pass the class 
                // instance in addition to the Hap.
                arity = arity + 1;
                if (method.name.endsWith('V')) {
                    if (arity === 2) {
                        let result = register(method.name, (instance, pat) => {
                            return pat.withHap((hap) => {
                                instance.current_time = audioContext.currentTime;
                                diagnostic('[StatefulPatterns.registerMethods][withHap]:' + JSON.stringify({hap, instance, method}, null, 4) + '\n');
                                method.call(instance, hap);
                                return hap.withValue(() => hap.value);
                             });
                        });
                    } else if (arity === 3) {
                        let result = register(method.name, (instance, p2, pat) => {
                            return pat.withHap((hap) => {
                                instance.current_time = audioContext.currentTime;
                                diagnostic('[StatefulPatterns.registerMethods][withHap]:' + JSON.stringify({hap, instance, method}, null, 4) + '\n');
                                method.call(instance, hap);
                                return hap.withValue(() => hap.value);
                             });
                        });
                    } else if (arity === 4) {
                        let result = register(method.name, (instance, p2, p3, pat) => {
                            return pat.withHap((hap) => {
                                instance.current_time = audioContext.currentTime;
                                diagnostic('[StatefulPatterns.registerMethods][withHap]:' + JSON.stringify({hap, instance, method}, null, 4) + '\n');
                                method.call(instance, hap);
                                return hap.withValue(() => hap.value);
                            });
                        });
                    }
                } else {
                    if (arity === 2) {
                        let result = register(method.name, (instance, pat) => {
                            return pat.withHap((hap) => {
                                instance.current_time = audioContext.currentTime;
                                diagnostic('[StatefulPatterns.registerMethods][withHap]:' + JSON.stringify({hap, instance, method}, null, 4) + '\n');
                                let onTrigger = (t, hap, duration, cps) => {
                                    diagnostic('[StatefulPatterns.registerMethods][onTrigger]:' + JSON.stringify({t, hap, duration, cps, instance}, null, 4) + '\n');
                                    method.call(instance, hap);
                                }
                                return hap.withValue(() => hap.value).setContext({
                                    ...hap.context,
                                    onTrigger: onTrigger,
                                    dominantTrigger: false,
                                });
                             });
                        });
                    } else if (arity === 3) {
                        let result = register(method.name, (instance, p2, pat) => {
                            return pat.withHap((hap) => {
                                instance.current_time = audioContext.currentTime;
                                diagnostic('[StatefulPatterns.registerMethods][withHap]:' + JSON.stringify({hap, instance, method}, null, 4) + '\n');
                                let onTrigger = (t, hap, duration, cps) => {
                                    triggerSequence = triggerSequence + 1;
                                    diagnostic('[StatefulPatterns.registerMethods][onTrigger]:' + JSON.stringify({triggerSequence, t, hap, duration, cps, instance}, null, 4) + '\n');
                                    method.call(instance, p2, hap);
                                }
                                return hap.withValue(() => instance.value).setContext({
                                    ...hap.context,
                                    onTrigger: onTrigger,
                                    dominantTrigger: false,
                                });
                             });
                        });
                    } else if (arity === 4) {
                        let result = register(method.name, (instance, p2, p3, pat) => {
                            return pat.withHap((hap) => {
                                instance.current_time = audioContext.currentTime;
                                diagnostic('[StatefulPatterns.registerMethods][withHap]:' + JSON.stringify({hap, instance, method}, null, 4) + '\n');
                                let onTrigger = (t, hap, duration, cps) => {
                                    diagnostic('[StatefulPatterns.registerMethods][onTrigger]:' + JSON.stringify({t, hap, duration, cps, instance}, null, 4) + '\n');
                                    method.call(instance, p2, p3, hap);
                                }
                                return hap.withValue(() => instance.value).setContext({
                                    ...hap.context,
                                    onTrigger: onTrigger,
                                    dominantTrigger: false,
                                });
                            });
                        });
                    }
                }
            }
        }
    }
}

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
            ///return hap.withValue(() => (isObject ? { ...hap.value, note } : note)).setContext({
            return hap.withValue(() => note).setContext({
                ...hap.context,
                onTrigger: onTrigger,
                dominantTrigger: false,
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

export class ChordPatterns extends StatefulPatterns {
    constructor(chord, modality) {
        super();
        this.ac_chord = chord;
        if (csac_debugging) diagnostic('[ChordPatterns]: using existing chord.\n');
        if (typeof modality == 'undefined') {
            this.ac_modality = this.ac_chord;
        } else {
            this.ac_modality = this.ac_chord;
        }
        this.registerMethods();
    }
    /**
     * Applies a Chord or chord name to this.
     */
    acC(chord_id, hap) {
        if (typeof chord_id === 'string') {
            this.ac_chord = csoundac.chordForName(chord_id);
            if (csac_debugging) diagnostic('[ChordPatterns.acC]: created new chord.\n');
        } else {
            this.ac_chord = chord_id;
            if (csac_debugging) diagnostic('[ChordPatterns.acC]: using existing chord.\n');
        }
        if (csac_debugging) {
            let message = ['[ChordPatterns.acC] chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' ');
            diagnostic(message);
        }
    }
    /**
     * Applies a transposition to the Chord of this.
     */
    acCT(semitones, hap) {
        if (csac_debugging) diagnostic(['[ChordPatterns.acCT] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        this.ac_chord = this.ac_chord.T(semitones);
        if (csac_debugging) diagnostic(['[ChordPatterns.acCT] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
    }
    /**
     * Applies an inversion to the Chord of this. The 
     * default center of reflection is 0.
     */
    acCI(center, hap) {
        if (typeof center === 'undefined') {
            center = 0;
        }
        if (csac_debugging) diagnostic(['[ChordPatterns.acCI] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        this.ac_chord = this.ac_chord.I(center);
        if (csac_debugging) diagnostic(['[ChordPatterns.acCI] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
     }
    /**
     * Applies the interchange by inversion operation of the Generalized 
     * Contextual Group of Fiore and Satyendra to the Chord of this.
     */
    acCK(hap) {
        if (csac_debugging) diagnostic(['[ChordPatterns.acCK] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        this.ac_chord = this.ac_chord.K();
        if (csac_debugging) diagnostic(['[ChordPatterns.acCK] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
    }
    /**
     * Applies the contexual transposition operation of the Generalized 
     * Contextual Group of Fiore and Satyendra to the Chord of this. The 
     * modality is set in the constructor of this class.
     */
    acCQ(semitones, hap) {
        if (csac_debugging) diagnostic(['[ChordPatterns.acCQ] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        this.ac_chord = this.ac_chord.Q(semitones, this.modality);
        if (csac_debugging) diagnostic(['[ChordPatterns.acCQ] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
    }
    /**
     * Applies the Chord of this to the note of the Hap, i.e., 
     * moves the note of the hap to the nearest pitch-class of the Chord.
     */
    acCV(hap) {
        let frequency;
        try {
            frequency = getFrequency(hap);
        } catch (error) {
            diagnostic('[acCV] not a note!\n');
            return;
        }
        let current_midi_key = frequencyToMidiInteger(frequency);
        let epcs = this.ac_chord.epcs();
        if (csac_debugging) diagnostic(['[ChordPatterns.acCV] current note:    ', current_midi_key, '\n'].join(' '));
        let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
        if (csac_debugging) diagnostic(['[ChordPatterns.acCV] transformed note:', note, '\n\n'].join(' '));
        hap.value = note;
    }
}



