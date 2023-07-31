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
 * The following Patterns are defined in this module:
 *
 * acC:        Insert a CsoundAC Chord into the Pattern's state.
 * acCT:       Transpose the Chord in the Pattern's state.
 * acCI:       Invert the Chord in the Pattern's state.
 * acCK:       Apply the interchange by inversion operation to the Chord in 
 *             the Pattern's state.
 * acCQ:       Apply the contextual transposition operation to the Chord in 
 *             the Pattern's state.
 * acCV:       Move notes in the Pattern to fit the pitch-class set of the 
 *             Chord in the Pattern's state.
 * acS:        Insert a CsoundAC Scale into the Pattern's state.
 * acSS:       Insert the Chord at the specified scale step of the Scale in 
 *             the Pattern's state, into the state.
 * acST:       Transpose the Chord in the Pattern's state by the specified 
 *             number of scale steps in the Scale in the state.
 * acSM:       Modulate from the Scale in the Pattern's state, using the 
 *             Chord in the state as a pivot, choosing one of the possible 
 *             modulations by index.
 * acSV:       Move notes in the Pattern to fit the Scale in the Pattern's 
 *             state.
 * acP:        Insert a CsoundAC PITV group into the Pattern's state.
 * acPP:       Set the prime form index of the PITV element in the Pattern's 
 *             state.
 * acPI:       Set the inversion index of the PITV element in the Pattern's 
 *             state.
 * acPT:       Set the transposition index of the PITV element in the 
 *             Pattern's state.
 * acPO:       Set the voicing index of the PITV element in the Pattern's 
 *             state.
 * acPC:       Insert the Chord corresponding to the PITV element into the 
 *             Pattern's state.
 * acPV:       Move notes in the Pattern to fit the pitch-class set of the 
 *             element of the PITV 
 *             group in the Pattern's state.
 * acPVV:      Move notes in the Pattern to fit the element of the PITV 
 *             group in the Pattern's state.
 */
let csac_debugging = true;
let csound = globalThis.__csound__;
let csoundac = globalThis.__csoundac__;
let audioContext = new AudioContext();

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
  if (typeof instrument === 'string') {
    p1 = ['{', instrument, '}'].join();
  }
  return pat.onTrigger((tidal_time, hap) => {
    if (!csound) {
      diagnostic('[csoundn]: Csound is not yet loaded.\n');
      return;
    }
    if (typeof hap.value !== 'object') {
      throw new Error('[csoundn] supports only objects as hap values.');
    }
    // Time in seconds counting from now.
    const p2 = tidal_time - audioContext.currentTime;
    const p3 = hap.duration.valueOf() + 0;
    const frequency = getFrequency(hap);
    // Translate frequency to MIDI key number _without_ rounding.
    const C4 = 261.62558;
    let octave = Math.log(frequency / C4) / Math.log(2.0) + 8.0;
    const p4 = octave * 12.0 - 36.0;
    // We prefer floating point precision, but over the MIDI range [0, 127].
    const p5 = 127 * (hap.context?.velocity ?? 0.9);
    // The Strudel controls as a string.
    const p6 = '\"' + Object.entries({ ...hap.value, frequency })
      .flat()
      .join('/') + '\"';
    const i_statement = ['i', p1, p2, p3, p4, p5, p6, '\n'].join(' ');
    hap.value.note = Math.round(p4);
    if (csac_debugging) diagnostic('[csoundn]: ' + tidal_time + ' ' + i_statement);
    csound.inputMessage(i_statement);
    // Blanks out default output.
  }, false).gain(0);
});

/**
 * This is a base class that can be used to define Patterns that hold state 
 * between queries. Derived classes, which must be defined at module scope,
 * automatically register (most of) of their methods as Strudel Patterns, each 
 * of which takes an instance of the class as a first parameter. 
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
                // instance along with other arguments.
                arity = arity + 1;
                if (arity === 2) {
                    let result = register(name, (stateful, pat) => {
                        return pat.withHap((hap) => {
                            stateful.current_time = getAudioContext().currentTime;
                            //diagnostic('[registerStateful][' + method.name + '] query value:' + JSON.stringify({x, stateful}, null, 4));
                            let value = method.call(stateful, hap.value);
                            return hap.withValue(() => value);
                        })
                        .onTrigger((t, hap) => {
                            method.call(stateful, null);
                            //diagnostic('[registerStateful][' + method.name + '] onset:' + JSON.stringify({x, stateful}, null, 4));
                        }, false);

                    });
                } else if (arity === 3) {
                    let result = register(name, (stateful, p2, pat) => {
                        return pat.withHap((hap) => {
                            stateful.current_time = getAudioContext().currentTime;
                            //diagnostic('[registerStateful][' + method.name + '] query value:' + JSON.stringify({x, stateful}, null, 4));
                            let value = method.call(stateful, p2, hap.value);
                            return hap.withValue(() => value);
                        }).onTrigger((t, hap) => {
                            method.call(stateful, p2, null);
                            //diagnostic('[registerStateful][' + method.name + '] onset:' + JSON.stringify({x, stateful}, null, 4));
                        }, false);

                    });
                } else if (arity === 4) {
                     let result = register(name, (stateful, p2, p3, pat) => {
                        return pat.withHap((hap) => {
                            stateful.current_time = getAudioContext().currentTime;
                            //diagnostic('[registerStateful][' + method.name + '] query value:' + JSON.stringify({x, stateful}, null, 4));
                            let value = method.call(stateful, p2, p3, hap.value);
                            return hap.withValue(() => value);
                        }).onTrigger((t, hap) => {
                            method.call(stateful, p2, p3, null);
                            //diagnostic('[registerStateful][' + method.name + '] onset:' + JSON.stringify({x, stateful}, null, 4));
                        }, false);
                    });
                }
            }
        }
    }
}

/**
 * A Pattern that calls a stateful object that may be defined in a user level 
 * Strudel patch. To be used something like this:
 */
 export class LogisticPattern extends StatefulPatterns {
    constructor(c = .998, y = .5) {
        super();
        this.registerMethods();
        // Initial values.
        this.c = c;
        this.y = y;
        this.value = 36;
        this.prior_time = 0;
        this.current_time = 0;
        this.delta_time = 0;
    }
    /**
     * Patternify the 'c' coefficient of the logistic equation.
     */
    Logistic(c, value) {
        if (value === null) {
            // This has been invoked from a trigger and should update state.
            this.c = c;
            let y1 = 4 * this.c * this.y * (1 - this.y);
            this.value = Math.round(y1 * 36 + 36);
            diagnostic('[LogisticPattern.Logistic]:', JSON.stringify(this, null, 4));
            this.y = y1;
            this.delta_time = this.current_time - this.prior_time;
            this.prior_time = this.current_time;
         } else {
            // This has been invoked by a query and should return a value.
            let value = this.value;
            return value;
        }
     }
}

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

/**
 * Creates a class to hold state, and defines Patterns for creating and using 
 * that state to work with CsoundAC Chords. An instance of this class must be 
 * created at module scope and passed to the relevant Patterns.
 */
export class ChordPatterns extends StatefulPatterns {
    constructor(chord, modality) {
        super();
        this.registerMethods();
        this.ac_chord = chord;
        if (csac_debugging) diagnostic('[ChordPatterns]: using existing chord.\n');
        if (typeof modality == 'undefined') {
            this.ac_modality = this.ac_chord;
        } else {
            this.ac_modality = modality;
        }
        this.value = 0;
    }
    /**
     * Applies a Chord or chord name to this.
     */
    acC(chord_id, value) {
        if (value === null) {
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
        } else {
            return value;
        }
    }
    /**
     * Applies a transposition to the Chord of this.
     */
    acCT(semitones, value) {
        if (value === null) {
            if (csac_debugging) diagnostic(['[ChordPatterns.acCT] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.T(semitones);
            if (csac_debugging) diagnostic(['[ChordPatterns.acCT] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
        } else {
            return value;
        } 
    }
    /**
     * Applies an inversion to the Chord of this. The 
     * default center of reflection is 0.
     */
    acCI(center, value) {
        if (value === null) {
            if (typeof center === 'undefined') {
                center = 0;
            }
            if (csac_debugging) diagnostic(['[ChordPatterns.acCI] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.I(center);
            if (csac_debugging) diagnostic(['[ChordPatterns.acCI] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
        } else {
            return value;
        }
    }
    /**
     * Applies the interchange by inversion operation of the Generalized 
     * Contextual Group of Fiore and Satyendra to the Chord of this.
     */
    acCK(value) {
        if (value === null) {
            if (csac_debugging) diagnostic(['[ChordPatterns.acCK] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.K();
            if (csac_debugging) diagnostic(['[ChordPatterns.acCK] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
        } else {
            return value;
        }
    }
    /**
     * Applies the contexual transposition operation of the Generalized 
     * Contextual Group of Fiore and Satyendra to the Chord of this. The 
     * modality is set in the constructor of this class.
     */
    acCQ(semitones, value) {
        if (value === null) {
            if (csac_debugging) diagnostic(['[ChordPatterns.acCQ] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.Q(semitones, this.modality);
            if (csac_debugging) diagnostic(['[ChordPatterns.acCQ] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
        } else {
            return value;
        }
    }
    /**
     * Applies the nth octavewise revoicing of the Chord of this that is 
     * generated by iterating octavewise revoicings within the indicated 
     * 0-based range.
     */
    acCO(revoicingNumber_, range, value) {
        if (value === null) {
            if (csac_debugging) diagnostic(['[ChordPatterns.acCO] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.ac_chord = csoundac.octavewiseRevoicing(this.ac_chord, revoicingNumber_, range);
            if (csac_debugging) diagnostic(['[ChordPatterns.acCO] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
        } else {
            return value;
        }
    }
    /**
     * Transforms the Chord of this to its 'OP' form; 'chord' is an extremely 
     * flexible and therefore ambiguous term, but the 'OP' form is what most 
     * musicians usually mean by 'chord': A chord where the octaves of the 
     * pitches do not matter and the order of the voices does not matter. This 
     * transformation can be useful for returning chords that have been 
     * transformed such that their voices are out of range back to a more 
     * normal form.
     */
    acCOP(value) {
        if (value === null) {
            if (csac_debugging) diagnostic(['[ChordPatterns.acCOP] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.eOP();
            if (csac_debugging) diagnostic(['[ChordPatterns.acCOP] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
        } else {
            return value;
        }
    }
    /**
     * Applies the Chord of this to the _pitch-class_ of the Hap, i.e., 
     * moves the note of the Hap to the nearest _pitch-class_ of the Chord.
     */
    acCV(value) {
        if (value === null) {
        } else {
            //~ let frequency;
            //~ try {
                //~ frequency = getFrequency(value);
            //~ } catch (error) {
                //~ diagnostic('[acCV] not a note!\n');
                //~ return;
            //~ }
            let current_midi_key = value; //frequencyToMidiInteger(frequency);
            let epcs = this.ac_chord.epcs();
            if (csac_debugging) diagnostic(['[ChordPatterns.acCV] current chord:   ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            if (csac_debugging) diagnostic(['[ChordPatterns.acCV] current note:    ', current_midi_key, '\n'].join(' '));
            let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            if (csac_debugging) diagnostic(['[ChordPatterns.acCV] transformed note:', note, '\n\n'].join(' '));
            return value;
        }
    }
}

/**
 * Creates a class to hold state, and defines Patterns for creating and using 
 * that state to work with CsoundAC Scales. An instance of this class must be 
 * created at module scope and passed to the relevant Patterns. The 
 * constructor sets the number of voices in Chords associated with the Scale,
 * by default 4.
 */
export class ScalePatterns extends StatefulPatterns {
    constructor(scale, voices = 4) {
        super();
        this.registerPatterns();
        this.ac_scale = scale;
        this.voices = voices;
        this.ac_chord = this.ac_scale.chord(0, this.voices, 3);
    }
    /**
     * acS:        Insert a CsoundAC Scale into the Pattern's state. The Chord 
     *             of this is moved to the same scale degree in the new Scale
     *             that it had in the old Scale.
     */
    aCS(scale, value) {
        if (value === null) {
            let scale_degree = this.ac_scale.scale_degree(this.ac_chord);
            this.ac_scale = scale;
            this.ac_chord = this.ac_scale.chord(scale_degree, this.voices, 3);
            if (csac_debugging) {
                diagnostic(['[ScalePatterns.acS] new scale:', this.ac_scale.toString(), this.ac_scale.name(), '\n'].join(' '));
                diagnostic(['[ScalePatterns.acS] new chord:', this.ac_chord.toString(), this.ac_chord.name(), '\n\n'].join(' '));
            }
        } else {
            return value;
        }
    }
    /** 
     *acSS:        Insert the Chord at the specified scale step of the Scale in 
     *             the Pattern's state, into the state.
     */
    acSS(scale_step, value) {
        if (value === null) {
            if (csac_debugging) diagnostic(['[ChordPatterns.acSS] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.ac_chord = this.ac_scale.chord(scale_step, this.voices, 3);
            if (csac_debugging) diagnostic(['[ChordPatterns.acSS] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
        } else {
            return value;
        }
    }
    /**
     * acST:       Transpose the Chord in the Pattern's state by the specified 
     *             number of scale steps in the Scale in the state.
     */
    acST(scale_steps, value) {
        if (value === null) {
            if (csac_debugging) diagnostic(['[ChordPatterns.acST] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.ac_chord = this.ac_scale.transpose_degrees(this.ac_chord, scale_steps, 3);    
            if (csac_debugging) diagnostic(['[ChordPatterns.acST] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n\n'].join(' '));
        } else {
            return value;
        }
    }
    /**
     * acSM:       Modulate from the Scale in the Pattern's state, using the 
     *             Chord in the state as a pivot, choosing one of the possible 
     *             modulations by index.
     */
    acSM(index, value) {
        if (value === null) {
            let pivot_chord_eop = this.ac_chord.eOP();
            let possible_modulations = this.ac_scale.modulations(pivot_chord_eop);
            let new_scale = this.ac_scale;
            let modulation_count = possible_modulations.size();
            let wrapped_index = -1;
            if (modulation_count > 0) {
                wrapped_index = index % modulation_count;
                new_scale = possible_modulations.get(wrapped_index);
                if (csac_debugging) {
                    let message_ = [
    '[acSM]: modulating in:', ac_scale.toString(), this.ac_scale.name(), '\n',
    '[acSM]: from pivot:   ', pivot_chord_eop.toString(), pivot_chord_eop.name(), '\n',
    '[acSM]: modulations:  ', modulation_count, '=>', wrapped_index, '\n',
    '[acSM]: modulated to: ', new_scale.toString(), new_scale.name()
    ].join(' ');
                    diagnostic(message_);
                    diagnostic('[acSM]: hap: ' + hap.show() + '\n');
                }
                this.ac_scale = new_scale;
            }
        } else {
            return value;
        }
    }
    /**
     * acSV:       Move notes in the Pattern to fit the Scale in the Pattern's 
     *             state.
     */
    acSV(value) {
        if (value === null) {
        } else {
            //~ let frequency;
            //~ try {
                //~ frequency = getFrequency(hap);
            //~ } catch (error) {
                //~ diagnostic('[acSV] not a note!\n');
                //~ return;
            //~ }
            //~ let current_midi_key = frequencyToMidiInteger(frequency);
            let current_midi_key = value;
            let epcs = this.ac_scale.epcs();
            let new_midi_key = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            //~ hap.value = new_midi_key;
            if (csac_debugging) diagnostic(['[acSV]:', this.ac_scale.toString(), this.ac_scale.eOP().name(), 'old note:', current_midi_key, 'new note:', result.value, '\n'].join(' '));
            return new_midi_key;
        }
    }
}

/**
 * Creates a class to hold state and defines Patterns for creating and using 
 * that state to work with CsoundAC PITV groups. An instance of this class 
 * must be created at module scope and passed to the relevant Patterns.
 */
export class PitvPatterns extends StatefulPatterns {
    constructor(pitv) {
        super();
        this.ac_pitv = pitv;
    }
    /**
     * acP:        Insert a CsoundAC PITV group into the Pattern's state.
     */
    acP(pitv, value) {
        if (value === null) {
            this.ac_pitv = pitv;
        } else {
            return value;
        }
    }
    /**
     * acPP:       Set the prime form index of the PITV element in the Pattern's 
     *             state.
     */
    acPP(P, value) {
        if (value === null) {
            this.ac_pitv.P = P;
        } else {
            return value;
        }
    }
    /**
     * acPI:       Set the inversion index of the PITV element in the Pattern's 
     *             state.
     */
    acPI(I, value) {
        if (value === null) {
            this.ac_pitv.I = I;
        } else {
            return value;
        }
    }
    /**
     * acPT:       Set the transposition index of the PITV element in the 
     *             Pattern's state.
     */
    acPT(T, value) {
        if (value === null) {
            this.ac_pitv.T = T;
        } else {
            return value;
        }
    }
    /**
     * acPO:       Set the octavewise voicing index of the PITV element in the 
     *             Pattern's state.
     */
    acPO(V, value) {
        if (value === null) {
            this.ac_pitv.V = V;
        } else {
            return value;
        }
    }
    /**
     * acPC:       Insert the Chord corresponding to the PITV element into the 
     *             Pattern's state.
     */
    acPC(value) {
        if (value === null) {
            this.ac_chord = this.ac_pitv.toChord(this.pitv.P, this.pitv.I, this.pitv.T, this.pitv.V, true).get(0);
            if (csac_debugging) diagnostic(['[acPC]:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        } else {
            return value;
        }
    }
    /**
     * acPV:       Move notes in the Pattern to fit the pitch-class set of the 
     *             element of the PITV group in the Pattern's state.
     */
    acPV(value) {
        if (value === null) {
        } else {
            //~ let frequency;
            //~ try {
                //~ frequency = getFrequency(hap);
            //~ } catch (error) {
                //~ diagnostic('[acPV] not a note!\n', 'warning');
                //~ return;
            //~ }
            let current_midi_key = value; //frequencyToMidiInteger(frequency);
            let eop = this.pitv.toChord(this.pitv.P, this.pitv.I, this.pitv.T, this.pitv.V, true).get(1);
            let epcs = eop.epcs();
            let new_midi_key = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            if (csac_debugging) diagnostic(['[acPV]:', eop.toString(), eop.name(), 'old note:', current_midi_key, 'new note:', result.value, '\n'].join(' '));
            return new_midi_key;
        }
    }
    /**
     * acPVV:      Move notes in the Pattern to fit the element of the PITV 
     *             group in the Pattern's state.
     */
    acPVV(value) {
        if (value === null) {
        } else {
            //~ let frequency;
            //~ try {
                //~ frequency = getFrequency(hap);
            //~ } catch (error) {
                //~ diagnostic('[acPC] not a note!\n');
                //~ return;
            //~ }
            let current_midi_key = value; //frequencyToMidiInteger(frequency);
            let voiced_chord = this.pitv.toChord(this.pitv.P, this.pitv.I, this.pitv.T, this.pitv.V, true).get(0);
            let new_midi_key = csoundac.closestPitch(current_midi_key, voiced_chord);
            if (csac_debugging) diagnostic(['[acPVV]:', voiced_chord.toString(), voiced_chord.eOP().name(), 'old note:', current_midi_key, 'new note:', result.value, '\n'].join(' '));
            return new_midi_key;
        }
    }
}




