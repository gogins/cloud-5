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
 * Strudel (Tidal Cycles-based) JavaScript pattern language. This is 
 * done by deriving from the StatefulPatterns class new classes whose 
 * member functions become Patterns.
 *
 * Another use of StatefulPatterns is to define algorithmic note generators, 
 * often driven by a `pure` pattern that acts as a clock.
 *
 * Please note, however, that this module, although it defines a number of 
 * Patterns, is not built into Strudel and is designed to be dynamically 
 * imported in patches created by users in the Strudel REPL. Therefore, code 
 * in this module, as with all other modules directly imported in code 
 * run by the Strudel REPL, must not use template strings.
 */
let csound = globalThis.__csound__;
let csoundac = globalThis.__csoundac__;
let audioContext = new AudioContext();

import {diagnostic, diagnostic_level, ALWAYS, DEBUG, INFORMATION, WARNING, ERROR, NEVER, StatefulPatterns} from '../statefulpatterns.mjs';
export {diagnostic, diagnostic_level, ALWAYS, DEBUG, INFORMATION, WARNING, ERROR, NEVER, StatefulPatterns};

/**
 * Similar to `arrange,` but permits a section to be silenced by setting its 
 * number of cycles to 0; `sections` is an array of arrays, in the format 
 * `[[cycles, Pattern],...]`. Useful for assembling Patterns into longer-form 
 * compositions.
 */
export function track(...sections) {
    sections = sections.filter(function(element) {
        return element[0] >= 1;
    });
    const total = sections.reduce((sum, [cycles]) => sum + cycles, 0);
    sections = sections.map(([cycles, section]) => [cycles, section.fast(cycles)]);
    return timeCat(...sections).slow(total);
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
 * A utility that assigns a pitch represented as a MIDI key number to the Hap, 
 * using the existing pitch property if it exists.
 */
export function setPitch(hap, midi_key) {
    if (typeof hap.value === 'undefined') {
        hap.value = midi_key;
    } else if (typeof hap.value === 'object') {
        if (typeof hap.value.freq !== 'undefined') {
            hap.value.freq = midiToFreq(midi_key);
        } else if (typeof hap.value.note !== 'undefined') {
            hap.value.note = midi_key;
        } else if (typeof hap.value.n !== 'undefined') {
            hap.value.n = midi_key;
        }
    } else {
        // Number or string all get the MIDI key.
        hap.value = midi_key;
    } 
    return hap;
}

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
        if (diagnostic_level() >= DEBUG) registerPatterns(['[voice ', voice, 'a:', a_pitch, 'old b:', b_pitch, 'new b:', b.getPitch(voice), '\n'].join(' '));
    }
}

export function print_counter(pattern, counter, value) {
    if (value.constructor.name === 'Hap') {
        diagnostic('[' + pattern + '] sync: counter: ' + counter + ' value: ' + value.show() + '\n', ALWAYS);
    } else if (value.constructor.name === 'Chord') {
        diagnostic('[' + pattern + '] sync: counter: ' + counter + ' value: ' + value.toString() + '\n', ALWAYS);
    } else {
        diagnostic('[' + pattern + '] sync: counter: ' + counter + ' value: ' + value + '\n', ALWAYS);
    }
}

let instrument_count = 10;

export function set_instrument_count(new_count) {
    let old_count = instrument_count;
    instrument_count = new_count;
    return old_count;
}

export function hsvToRgb(h,s,v) {
  var rgb, i, data = [];
  if (s === 0) {
    rgb = [v,v,v];
  } else {
    h = h / 60;
    i = Math.floor(h);
    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
    switch(i) {
      case 0:
        rgb = [v, data[2], data[0]];
        break;
      case 1:
        rgb = [data[1], v, data[0]];
        break;
      case 2:
        rgb = [data[0], v, data[2]];
        break;
      case 3:
        rgb = [data[0], data[1], v];
        break;
      case 4:
        rgb = [data[2], data[0], v];
        break;
      default:
        rgb = [v, data[0], data[1]];
        break;
    }
  }
  return '#' + rgb.map(function(x){ 
    return ('0a' + Math.round(x*255).toString(16)).slice(-2);
  }).join('');
};

let csoundn_counter = 0;

/**
 * Sends notes to Csound for rendering with MIDI semantics. The Hap value is
 * translated to Csound pfields as follows:
 *
 *  p1 -- Csound instrument either as a number (1-based, can be a fraction),
 *        or as a string name.
 *  p2 -- time in beats (usually seconds) from start of performance.
 *  p3 -- duration in beats (usually seconds).
 *  p4 -- MIDI key number from Strudel's Hap value (as a real number, not an 
 *        integer, in [0, 127].
 *  p5 -- MIDI velocity from Strudel's `gain` control (as a real number, not 
 *        an integer, in [0, 127].
 *  p6 -- Spatial depth dimension, from a `depth` control, defaulting to 0.
 *  p7 -- Spatial pan dimension, from Strudel's `pan` control, in [0, 1],
 *        defaulting to 0.5.
 *  p8 -- Spatial height dimension, from a `height` control, defaulting to 0.
 */
export const csoundn = register('csoundn', (instrument, pat) => {
    let p1;
    if (typeof instrument === 'string') {
        p1 = '\"' + instrument + '\"';
    } else {
        p1 = instrument;
    }
    return pat.onTrigger((tidal_time, hap) => {
        try {
            if (!csound) {
              diagnostic('[csoundn]: Csound is not yet loaded.\n', WARNING);
              return;
            }
            // Time in seconds counting from now.
            let p2 = tidal_time - getAudioContext().currentTime;
            if (p2 < 0) {
                p2 = 0;
            }
            const p3 = hap.duration.valueOf() + 0;
            const frequency = getFrequency(hap);
            // Translate frequency to MIDI key number _without_ rounding.
            const C4 = 261.62558;
            let octave = Math.log(frequency / C4) / Math.log(2.0) + 8.0;
            const p4 = octave * 12.0 - 36.0;
            // We prefer floating point precision, but over the MIDI range [0, 127].
            ///const p5 = 127 * (hap.context?.velocity ?? 0.9);
            let gain;
            if (typeof hap.value.gain === 'undefined') {
                gain = .9;
            } else {
                gain = hap.value.gain;
            }
            let p5 = 127 * gain;
            let p6;
            if (typeof hap.value.depth === 'undefined') {
                p6 = 0;
            } else {
                p6 = hap.value.depth;
            }
            let p7;
            if (typeof hap.value.pan === 'undefined') {
                p7 = 0;
            } else {
                p7 = hap.value.pan;
            }
            let p8;
            if (typeof hap.value.height === 'undefined') {
                p8 = 0;
            } else {
                p8 = hap.value.depth;
            }
            const i_statement = ['i', p1, p2, p3, p4, p5, p6, p7, p8, '\n'].join(' ');
            console.log('[csoundn] ' + i_statement);
            csound.readScore(i_statement);
            // Any controls in the Hap that start with 'gi' or 'gk' will be 
            // treated as Csound control channels, and their values will be 
            // sent to Csound. Normally, these channels have been defined in 
            // the Csound orchestra code.
            for (let control in hap.value) {
                if (control.startsWith('gi') || control.startsWith('gk')) {
                    csound.SetControlChannel(control, parseFloat(hap.value[control]));
                }
            }
            csoundn_counter = csoundn_counter + 1;
            if ((diagnostic_level() >= INFORMATION) === true) {
                print_counter('csoundn', csoundn_counter, hap);
            }
            // Color the event by both insno and gain.
            // insno is hue, and gain is value, in HSV.
            if (globalThis.haps_from_outputs) {
                if (typeof hap.value !== 'object') {
                    hap.value = {note: p4, gain: gain};
                } else {
                    hap.value.note = p4;
                    hap.value.gain = gain;
                }
                hap.value.color = hsvToRgb((p1 / instrument_count) * 360, 1, gain);
                globalThis.haps_from_outputs.push(hap);
            }
        } catch (except) {
            diagnostic('[csoundn] error: ' + except + '\n', ERROR);
        }
    });
});

let chordn_counter = 0;

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
    if (diagnostic_level() >= DEBUG) diagnostic('[csacChord] Creating Chord...\n');
    let chord_ = csoundac.chordForName(name);
    if (diagnostic_level() >= DEBUG) diagnostic('[csacChord]:' + chord_.toString() + '\n');
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
    name = name.replace('_', ' ');
    if (diagnostic_level() >= DEBUG) diagnostic('[Scale] Creating Scale...\n');
    let scale_ = csoundac.scaleForName(name);
    if (diagnostic_level() >= DEBUG) diagnostic('[Scale] ' + scale_.name() + '\n');
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
export function Pitv(voices, bass, range) {
    if (diagnostic_level() >= DEBUG) diagnostic('[Pitv] Creating PITV group...\n');
    let pitv = new csoundac.PITV();
    pitv.bass = bass;
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
 *
 * Some hacks are used to co-ordinate state with triggers:
 *  - Assume that chord changes happen only once at any given time.
 *  - In the trigger, apply the input to the Pattern if and only if the input 
 *    is different from the old input.
 */
export class ChordPatterns extends StatefulPatterns {
    constructor(chord, modality) {
        super();
        this.registerPatterns();
        if (typeof chord === 'string') {
            this.ac_chord = csoundac.chordForName(chord);
            if (diagnostic_level() >= DEBUG) diagnostic('[ChordPatterns] created new chord.\n');
        } else {
            this.ac_chord = chord;            if (diagnostic_level() >= DEBUG) diagnostic('[ChordPatterns] using existing chord.\n');
        }
        if (typeof modality == 'undefined') {
            this.ac_modality = this.ac_chord;
        } else {
            this.ac_modality = modality;
        }
        this.prior_chord = this.ac_chord;
        this.value = 0;
        this.acC_counter = 0;
        this.acC_chord_string = null;
        this.acCT_counter = 0;
        this.acCT_semitones = null
        this.acCI_counter = 0;
        this.acCI_center = null;
        this.acCK_counter = 0;
        this.acCK_state = null;
        this.acCQ_counter = 0;
        this.acCQ_semitones = null;
        this.acCOP_counter = 0;
        this.acCRP_counter = 0;
        this.acCO_counter = 0;
        this.acCV_counter = 0;
        this.acCVV_counter = 0;
        this.acCVVL_counter = 0;
    }
    /**
     * Applies a Chord or chord name to this.
     */
    acC(is_onset, chord_id, hap) {
        if (is_onset === true) {
            if (typeof chord_id === 'string') {
                this.ac_chord = csoundac.chordForName(chord_id);
                if (diagnostic_level() >= DEBUG) diagnostic('[acC onset] created new Chord.\n');
            } else {
                this.ac_scale = scale;
                if (diagnostic_level() >= DEBUG) diagnostic('[acC onset] using existing Chord.\n');
            }
            if (this.acS_chord_string != this.ac_chord.toString()) {
                this.acS_chord_string = this.ac_chord.toString();
                this.ac_chord = this.ac_scale.chord(1, this.voices, 3);
                if (diagnostic_level() >= WARNING) {
                    diagnostic(['[acS onset] new Chord:', this.ac_chord.toString(), this.ac_chord.name(), '\n'].join(' '));
                 }
                this.acC_counter = this.acC_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acC', this.acC_counter, hap);
                }
            }
        }
        return hap;
    }
    /**
     * Applies a transposition to the Chord of this.
     */
    acCT(is_onset, semitones, hap) {
        if (is_onset === true) {
            if (this.acCT_semitones != semitones) {
                this.acCT_semitones = semitones;
                if (diagnostic_level() >= DEBUG) diagnostic(['[acCT onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
                this.ac_chord = this.ac_chord.T(semitones);
                if (diagnostic_level() >= WARNING) diagnostic(['[acCT onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
                this.acCT_counter = this.acCT_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acCT', this.acCT_counter, hap);
                }
            }
        }
        return hap;
    }
    /**
     * Applies an inversion to the Chord of this. The transformation can be 
     * patternified with a Pattern of flips (changes in the value of the flip 
     * input).
     */
    acCI(is_onset, center, flip, hap) {
        if (is_onset === true) {
            if (this.acCI_flip != flip) {
                this.acCI_flip = flip;
                if (diagnostic_level() >= DEBUG) diagnostic(['[acCI] onset: current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
                this.ac_chord = this.ac_chord.I(center);
                if (diagnostic_level() >= WARNING) diagnostic(['[acCI] onset: transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
                this.acCI_counter = this.acCI_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acCI', this.acCI_counter, hap);
                }
            }
        }
        return hap;
    }
    /**
     * Applies the interchange by inversion operation of the Generalized 
     * Contextual Group of Fiore and Satyendra to the Chord of this. The 
     * transformation can be patternified with a Pattern of flips (changes in 
     * the value of the flip input).
     */
    acCK(is_onset, flip, hap) {
        if (is_onset === true) {
            if (this.flip != flip) {
                this.flip = flip;
                if (diagnostic_level() >= DEBUG) diagnostic(['[acCK onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
                this.ac_chord = this.ac_chord.K();
                if (diagnostic_level() >= WARNING) diagnostic(['[acCK onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
                this.acCK_counter = this.acCK_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acCK', this.acCK_counter, hap);
                }
            }
        }
        return hap;
    }
    /**
     * Applies the contexual transposition operation of the Generalized 
     * Contextual Group of Fiore and Satyendra to the Chord of this. The 
     * modality is set in the constructor of this class.
     */
     acCQ(is_onset, semitones, hap) {
        if (is_onset === true) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCQ onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.Q(semitones, this.ac_modality, 1);
            if (diagnostic_level() >= WARNING) diagnostic(['[acCQ onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.acCQ_counter = this.acCQ_counter + 1;
            if (diagnostic_level() >= INFORMATION) {
                print_counter('acCQ', this.acCQ_counter, hap);
            }
        }
        return hap;
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
    acCOP(is_onset, hap) {
        if (is_onset === true) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCOP onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.eOP();
            if (diagnostic_level() >= WARNING) diagnostic(['[acCOP onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.acCOP_counter = this.acCOP_counter + 1;
            if (diagnostic_level() >= INFORMATION) {
                print_counter('acCOP', this.acCOP_counter, hap);
            }
        }
        return hap;
    }
    /**
     * Transforms the Chord of this to its 'RP' form; 'chord' is an extremely 
     * flexible and therefore ambiguous term, but the 'RP' form is a chord 
     * where the octaves are folded within the indicated range, and like 'OP'
     * the order of the voices does not matter. This 
     * transformation can be useful for returning chords that have been 
     * transformed such that their voices are out of range back to a user-
     * defined range.
     */
    acCRP(is_onset, range, hap) {
        if (is_onset === true) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCRP onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.eRP(range);
            if (diagnostic_level() >= WARNING) diagnostic(['[acCRP onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.acCRP_counter = this.acCRP_counter + 1;
            if (diagnostic_level() >= INFORMATION) {
                print_counter('acCRP', this.acCRP_counter, hap);
            }
        }
        return hap;
    }    
    /**
     * Applies the Chord of this to the _pitch-class_ of the Hap, i.e., moves 
     * the _pitch-class_ of the Hap to the nearest _pitch-class_ of the Chord.
     */
    acCV(is_onset, hap) {
        if (is_onset === true) {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acCV value]: not a note!\n');
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let epcs = this.ac_chord.epcs();
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCV value] current chord:  ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCV value] current hap:    ', hap.show(), '\n'].join(' '));
            let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            hap = setPitch(hap, note);
            ChordPatterns.acCV_counter = ChordPatterns.acCV_counter + 1;
            if (diagnostic_level() >= WARNING) diagnostic(['[acCV value] new hap:        ', hap.show(), '\n'].join(' '));   
            if (diagnostic_level() >= INFORMATION) {
                print_counter('acCV onset', ChordPatterns.acCV_counter, hap);
            }
        } else {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acCV value]: not a note!\n');
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let epcs = this.ac_chord.epcs();
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCV value] current chord:  ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCV value] current hap:    ', hap.show(), '\n'].join(' '));
            let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            hap = setPitch(hap, note);
            //~ if (diagnostic_level() >= DEBUG) diagnostic(['[acCV value] new hap:        ', hap.show(), '\n'].join(' '));
            //~ if (diagnostic_level() >= INFORMATION) {
                //~ print_counter('acCV value', ChordPatterns.acCV_counter, hap);
            //~ }
        }
        return hap;
    }

    /**  
     * acCO:      Transforms the Chord of this by the indicated number of 
     *            octavewise revoicings: negative means subtract an octave 
     *            from the highest voice, positive means add an octave to the 
     *            lowest voice. This corresponds to the musician's notion of 
     *            "inversion."
     */
    acCO(is_onset, revoicings, hap) {
        if (is_onset) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCO] onset: current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.v(revoicings);
            if (diagnostic_level() >= WARNING) diagnostic(['[acCO] onset: transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.acCO_counter = this.acCO_counter + 1;
            if (diagnostic_level() >= INFORMATION) {
                print_counter('acCO', this.acCO_counter, hap);
            }
            this.prior_chord = this.ac_chord;  
        }
        return hap;       
    }
    
    /**
     * acCVV:      Generate a note that represents a particular voice of the 
     *             Chord.
     */
    acCVV(is_onset, bass, voice, hap) {
        let new_midi_key = bass + this.ac_chord.getPitch(voice);
        hap = setPitch(hap, new_midi_key);
        if (diagnostic_level() >= DEBUG) diagnostic(['[acCVV value]:', 'new_midi_key:', new_midi_key, 'new note:', hap.show(), '\n'].join(' '));
        this.prior_chord = this.ac_chord;  
        return hap;
    }
    /**
     * acCVVL:     Generate a note that represents a particular voice of the 
     *             Chord, as the closest voice-leading from the prior Chord.
     */
    acCVVL(is_onset, bass, range, voice, hap) {
        if (this.prior_chord != this.ac_chord) {
            let new_chord = csoundac.voiceleadingClosestRange(this.prior_chord, this.ac_chord, range, true);
            const message = ['[acCVVL]:', '\n  prior_chord: ', this.prior_chord.toString(), '\n  ac_chord:    ', this.ac_chord.toString(), '\n  new ac_chord:',new_chord.toString() + '\n'].join(' ');
            if (diagnostic_level() >= DEBUG) diagnostic(message);
            console.log(message);
            this.ac_chord = new_chord;
        }
        let new_midi_key = bass + this.ac_chord.getPitch(voice);
        hap = setPitch(hap, new_midi_key);
        if (diagnostic_level() >= DEBUG) diagnostic(['[acCVVL value]:', 'new_midi_key:', new_midi_key, 'new note:', hap.show(), '\n'].join(' '));
        this.prior_chord = this.ac_chord;  
        return hap;
    }
}

/**
 * Creates a class to hold state, and defines Patterns for creating and using 
 * that state to work with CsoundAC Scales. An instance of this class must be 
 * created at module scope and passed to the relevant Patterns. The 
 * constructor sets the number of voices in Chords associated with the Scale,
 * by default 4.
 *
 * State is co-ordinated with the triggers of the Patterns by only updating 
 * the state when the input of the Pattern changes.
*/
export class ScalePatterns extends StatefulPatterns {
    constructor(scale, voices = 3) {
        super();
        this.registerPatterns();
        this.voices = voices;
        if (typeof scale === 'string') {
            // Have to use underscores instead of spaces in the Strudel REPL.
            scale = scale.replace('_', ' ');
            this.ac_scale = csoundac.scaleForName(scale);
            if (diagnostic_level() >= WARNING) diagnostic('[acS onset] created new scale.\n');
        } else {
            this.ac_scale = scale;
            if (diagnostic_level() >= DEBUG) diagnostic('[acS onset] using existing scale.\n');
        }
        this.ac_chord = this.ac_scale.chord(1, this.voices, 3);
        this.prior_chord = this.ac_chord;
        this.acS_counter = 0;
        this.acS_scale_string = null;
        this.acSS_counter = 0;
        this.acSS_scale_step = null;
        this.acST_counter = 0;
        this.acST_scale_steps = null;
        this.acSM_counter = 0;
        this.acSM_index = null;
        this.acSO_counter = 0;
        this.acSV_counter = 0;
        this.acSCV_counter = 0;
 
    }
    /**
     * acS:        Insert a CsoundAC Scale into the Pattern's state.
     */
    acS(is_onset, scale, hap) {
        if (is_onset === true) {
            if (typeof scale === 'string') {
                // Have to use underscores instead of spaces in the Strudel REPL.
                scale = scale.replace('_', ' ');
                this.ac_scale = csoundac.scaleForName(scale);
                if (diagnostic_level() >= DEBUG) diagnostic('[acS onset] created new scale.\n');
            } else {
                this.ac_scale = scale;
                if (diagnostic_level() >= DEBUG) diagnostic('[acS onset] using existing scale.\n');
            }
            if (this.acS_scale_string != this.ac_scale.toString()) {
                this.acS_scale_string = this.ac_scale.toString();
                this.ac_chord = this.ac_scale.chord(1, this.voices, 3);
                if (diagnostic_level() >= WARNING) {
                    diagnostic(['[acS onset] new scale:', this.ac_scale.toString(), this.ac_scale.name(), '\n'].join(' '));
                    diagnostic(['[acS onset] new chord:', this.ac_chord.toString(), this.ac_chord.name(), '\n'].join(' '));
                }
                this.acS_counter = this.acS_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acS', this.acS_counter, hap);
                }
            }
        }
        return hap;
    }
    /** 
     * acSS:       Insert the Chord at the specified scale step of the Scale in 
     *             the Pattern's state, into the state.
     */
    acSS(is_onset, scale_step, hap) {
        if (is_onset === true) {
            if (this.acSS_scale_step != scale_step) {
                this.acSS_scale_step = scale_step;
                if (diagnostic_level() >= DEBUG) diagnostic(['[acSS onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
                this.ac_chord = this.ac_scale.chord(scale_step, this.voices, 3);
                if (diagnostic_level() >= WARNING) diagnostic(['[acSS onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
                this.acSS_counter = this.acSS_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acSS', this.acSS_counter, hap);
                }
            }
        }  
        return hap;
    }
    /**
     * acST:       Transpose the Chord in the Pattern's state by the specified 
     *             number of scale steps in the Scale in the state.
     */
    acST(is_onset, scale_steps, hap) {
        if (is_onset === true) {
            if (this.acST_scale_steps != scale_steps) {
                this.acST_scale_steps = scale_steps;
                if (diagnostic_level() >= WARNING) diagnostic(['[acST onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
                this.ac_chord = this.ac_scale.transpose_degrees(this.ac_chord, scale_steps, 3);    
                if (diagnostic_level() >= WARNING) diagnostic(['[acST onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
                this.acST_counter = this.acST_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acST', this.acST_counter, hap);
                }
            }
        }
        return hap;
    }
    /**
     * acSM:       Modulate from the Scale in the Pattern's state, using the 
     *             Chord in the state as a pivot, choosing one of the possible 
     *             modulations by index.
     */
    acSM(is_onset, index, hap) {
        if (is_onset === true) {
             if (this.acSM_index != index) {
                this.acSM_index = index;
                let pivot_chord_eop = this.ac_chord.eOP();
                let possible_modulations = this.ac_scale.modulations(pivot_chord_eop);
                let new_scale = this.ac_scale;
                let modulation_count = possible_modulations.size();
                let wrapped_index = -1;
                if (modulation_count > 0) {
                    wrapped_index = index % modulation_count;
                    new_scale = possible_modulations.get(wrapped_index);
                    if (diagnostic_level() >= WARNING) {
                        diagnostic('[acSM onset] modulating in: ' + this.ac_scale.toString() + ' ' + this.ac_scale.name() + '\n');
                        diagnostic('[acSM onset] from pivot:    ' + pivot_chord_eop.toString(), + ' ' + pivot_chord_eop.name() + '\n');
                        diagnostic('[acSM onset] modulations:   ' + modulation_count + ' => ' + wrapped_index + '\n');
                        diagnostic('[acSM onset] modulated to:  ' + new_scale.toString() + ' ' + new_scale.name() + '\n');
                        diagnostic('[acSM onset] hap:           ' + hap.show() + '\n');
                    }
                    this.ac_scale = new_scale;
                }
                this.acSM_counter = this.acSM_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acSM', this.acSM_counter, hap);
                }
            }
        }
        return hap;
    }
    /**
     * acSV:       Move notes in the Pattern to fit the Scale in the Pattern's 
     *             state.
     */
    acSV(is_onset, hap) {
        if (is_onset === true) {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acSV value] not a note!\n');
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let epcs = this.ac_scale.epcs();
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSV value] current scale:  ', this.ac_scale.toString(), this.ac_scale.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSV value] current hap:    ', hap.show(), '\n'].join(' '));
            let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            hap = setPitch(hap, note);
            if (diagnostic_level() >= WARNING) diagnostic(['[acSV value] new hap:        ', hap.show(), '\n'].join(' '));
            this.acSV_counter = this.acSV_counter + 1;
            if (diagnostic_level() >= INFORMATION) {
                print_counter('acSV', this.acSV_counter, hap);
            }
        } else {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acSV value] not a note!\n');
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let epcs = this.ac_scale.epcs();
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSV value] current scale:  ', this.ac_scale.toString(), this.ac_scale.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSV value] current hap:    ', hap.show(), '\n'].join(' '));
            let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            hap = setPitch(hap, note);
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSV value] new hap:        ', hap.show(), '\n'].join(' '));
        }
        return hap;
    }
    /**
     * acSCV:      Move notes in the Pattern to fit the Chord in the Pattern's 
     *             state.
     */
    acSCV(is_onset, hap) {
        if (is_onset === true) {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acSCV value] not a note!\n');
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let epcs = this.ac_chord.epcs();
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV onset] current scale:  ', this.ac_scale.toString(), this.ac_scale.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV onset] current chord:  ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV onset] current hap:    ', hap.show(), '\n'].join(' '));
            let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            hap = setPitch(hap, note);
            if (diagnostic_level() >= WARNING) diagnostic(['[acSCV onset] new hap:        ', hap.show(), '\n'].join(' '));
            this.acSCV_counter = this.acSCV_counter + 1;
            if (diagnostic_level() >= INFORMATION) {
                print_counter('acSCV', this.acSCV_counter, hap);
            }
        } else {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acSCV value] not a note!\n');
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let epcs = this.ac_chord.epcs();
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV value] current scale:  ', this.ac_scale.toString(), this.ac_scale.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV value] current chord:  ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV value] current hap:    ', hap.show(), '\n'].join(' '));
            let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            hap = setPitch(hap, note);
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV value] new hap:        ', hap.show(), '\n'].join(' '));
            this.acSCV_counter = this.acSCV_counter + 1;
         }
        return hap;
    }
    /**  
     * acSO:      Transforms the Chord of this by the indicated number of 
     *            octavewise revoicings: negative means subtract an octave 
     *            from the highest voice, positive means add an octave to the 
     *            lowest voice. This corresponds to the musician's notion of 
     *            "inversion."
     */
    acSO(is_onset, revoicings, hap) {
        if (is_onset) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSO] onset: current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.v(revoicings);
            if (diagnostic_level() >= WARNING) diagnostic(['[acSO] onset: transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.acSO_counter = this.acSO_counter + 1;
            if (diagnostic_level() >= INFORMATION) {
                print_counter('acSO', this.acSO_counter, hap);
            }
            this.prior_chord = this.ac_chord;  
        }
        return hap;       
    }
    
        /**
     * acSVV:      Generate a note that represents a particular voice of the 
     *             Chord of this.
     */
    acCVV(is_onset, bass, voice, hap) {
        let new_midi_key = bass + this.ac_chord.getPitch(voice);
        hap = setPitch(hap, new_midi_key);
        if (diagnostic_level() >= DEBUG) diagnostic(['[acCVV value]:', 'new_midi_key:', new_midi_key, 'new note:', hap.show(), '\n'].join(' '));
        this.prior_chord = this.ac_chord;  
        return hap;
    }
    /**
     * acSVVL:     Generate a note that represents a particular voice of the 
     *             current Chord, as the closest voice-leading from the prior 
     *             Chord.
     */
    acSVVL(is_onset, bass, range, voice, hap) {
        if (this.prior_chord != this.ac_chord) {
            this.ac_chord = csoundac.voiceleadingClosestRange(this.prior_chord, this.ac_chord, range, true);
        }
        let new_midi_key = bass + this.ac_chord.getPitch(voice);
        hap = setPitch(hap, new_midi_key);
        if (diagnostic_level() >= DEBUG) diagnostic(['[acSVVL value]:', 'new_midi_key:', new_midi_key, 'new note:', hap.show(), '\n'].join(' '));
        this.prior_chord = this.ac_chord;  
        return hap;
    }}

/**
 * Creates a class to hold state and defines Patterns for creating and using 
 * that state to work with CsoundAC PITV groups. An instance of this class 
 * must be created at module scope and passed to the relevant Patterns.
 */
export class PitvPatterns extends StatefulPatterns {
    constructor(pitv) {
        super();
        this.registerPatterns();
        this.prior_chord = null;
        this.pitv = pitv;
        this.acPP_counter = 0;
        this.acPP_P = null;
        this.acPI_counter = 0;
        this.acPI_I = null;
        this.acPT_counter = 0;
        this.acPT_T = null;
        this.acPV_counter = 0;
        this.acPV_V = null;
        this.acPO_counter = 0;
        this.acPO_value = null;
        this.acPC_counter = 0;
        this.acPVS_counter = 0;
        this.acPVV_counter = 0;
    }
    /**
     * acP:        Insert a CsoundAC PITV group into the Pattern's state.
     */
    acP(is_onset, pitv, hap) {
        if (is_onset == true) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acP onset] current PITV:  ', this.this.pitv.list(true, true, false), '\n'].join(' '));
            this.pitv = pitv;
            this.acP_counter = this.acP_counter + 1;
            if (diagnostic_level() >= INFORMATION) {
                print_counter('acP', this.acP_counter, hap);
            }
        } 
        return hap;
    }
    /**
     * acPP:       Set the prime form index of the PITV element in the Pattern's 
     *             state.
     */
    acPP(is_onset, P, hap) {
        if (is_onset === true) {
            if (this.acPP_P != P) {
                this.acPP_P = P;
                this.pitv.P = P;
                this.acPP_counter = this.acPP_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acPP', this.acPP_counter, hap);
                }
            }
        }
        return hap;
    }

    static acPI_counter = 1;

    /**
     * acPI:       Set the inversion index of the PITV element in the Pattern's 
     *             state.
     */
    acPI(is_onset, I, hap) {
        if (is_onset === true) {
            if (this.acPI_I != I) {
                this.acPI_I = I;
                this.pitv.I = I;
                this.acPI_counter = this.acPI_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acPI', this.acPI_counter, hap);
                }
            }
        }
        return hap;
    }
    /**
     * acPT:       Set the transposition index of the PITV element in the 
     *             Pattern's state.
     */
    acPT(is_onset, T, hap) {
        if (is_onset === true) {
            if (this.acPT_T != T) {
                this.acPT_T = T;
                this.pitv.T = T;
                this.acPT_counter = this.acPT_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acPT', this.acPT_counter, hap);
                }
            }
        }
        return hap;
    }
    /**
     * acPO:       Set the octavewise voicing index of the PITV element in the 
     *             Pattern's state.
     */
    acPO(is_onset, V, hap) {
        if (is_onset == true) {
            if (this.acPO_O != V) {
                this.acPO_O = V;
                this.pitv.V = V;
                this.acPO_counter = this.acPO_counter + 1;
                if (diagnostic_level() >= INFORMATION) {
                    print_counter('acPO', this.acPO_counter, hap);
                }
            }
        }
        return hap;
    }
    /**
     * acPC:       Insert the Chord corresponding to the PITV element into the 
     *             Pattern's state.
     */
    acPC(is_onset, hap) {
        if (is_onset === true) {
            this.ac_chord = this.pitv.toChord(this.pitv.P, this.pitv.I, this.pitv.T, this.pitv.V, true).get(0);
            if (diagnostic_level() >= WARNING) diagnostic(['[acPC onset]:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.acPC_counter = this.acPC_counter + 1;
            if (diagnostic_level() >= INFORMATION) {
                print_counter('acPC', this.acPC_counter, hap);
            }
        }
        return hap;
    }
    /**
     * acPV:       Move notes in the Pattern to fit the pitch-class set of the 
     *             element of the PITV group in the Pattern's state.
     */
    acPV(is_onset, hap) {
        let frequency;
        try {
            frequency = getFrequency(hap);
        } catch (error) {
            diagnostic('[acPV] not a note!\n', WARNING);
            return;
        }
        let current_midi_key = frequencyToMidiInteger(frequency);
        let result = this.pitv.toChord(this.pitv.P, this.pitv.I, this.pitv.T, this.pitv.V, true);
        let eop = result.get(1);
        let epcs = eop.epcs();
        let new_midi_key = csoundac.conformToPitchClassSet(current_midi_key, epcs);
        hap = setPitch(hap, new_midi_key);
        if (diagnostic_level() >= DEBUG) diagnostic(['[acPV value]:', eop.toString(), eop.name(), 'old note:', current_midi_key, 'new note:', hap.show(), '\n'].join(' '));
        this.prior_chord = result.get(0);
        return hap;
    }
    /**
     * acPVV:      Generate a note that represents a particular voice of the 
     *             Chord.
     */
    acPVV(is_onset, voice, hap) {
        let voiced_chord = this.pitv.toChord(this.pitv.P, this.pitv.I, this.pitv.T, this.pitv.V, true).get(0);
        let new_midi_key = voiced_chord.getPitch(voice) + this.pitv.bass;
        hap = setPitch(hap, new_midi_key);
        if (diagnostic_level() >= DEBUG) diagnostic(['[acPVV value]:', 'new_midi_key:', new_midi_key, 'new note:', hap.show(), '\n'].join(' '));
        this.prior_chord = voiced_chord;
        return hap;
    }    
    /**
     * acPVVL:     Generate a note that represents a particular voice of the 
     *             Chord, as the closest voice-leading from the prior element of this.
     */
   acPVVL(is_onset, voice, hap) {
       this.ac_chord = this.pitv.toChord(this.pitv.P, this.pitv.I, this.pitv.T, this.pitv.V, true).get(0);
       if (this.prior_chord != this.ac_chord) {
            this.ac_chord = csoundac.voiceleadingClosestRange(this.prior_chord, this.ac_chord, range, true);
       }
       let new_midi_key = this.ac_chord.getPitch(voice) + this.pitv.bass;
       hap = setPitch(hap, new_midi_key);
       if (diagnostic_level() >= DEBUG) diagnostic(['[acPVVL value]:', 'new_midi_key:', new_midi_key, 'new note:', hap.show(), '\n'].join(' '));
       this.prior_chord = this.ac_chord;
       return hap;
   }
}



