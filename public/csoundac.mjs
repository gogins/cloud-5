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
 * generally driven by a `pure` pattern that acts as a clock.
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
let note_counter = 0;

import {diagnostic, diagnostic_level, ALWAYS, DEBUG, INFORMATION, WARNING, ERROR, NEVER, StatefulPatterns} from '../statefulpatterns.mjs';
export {diagnostic, diagnostic_level, ALWAYS, DEBUG, INFORMATION, WARNING, ERROR, NEVER, StatefulPatterns};

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
 */
export const csoundn_ = register('csoundn_', (instrument, pat) => {
  let p1 = instrument;
  if (typeof instrument === 'string') {
    p1 = ['${', instrument, '}'].join();
  }
  return pat.onTrigger((tidal_time, hap) => {
    if (!csound) {
      diagnostic('[csoundn]: Csound is not yet loaded.\n', WARNING);
      return;
    }
    // For stateful Patterns, in order to display notes in `pianoroll`,
    // it is necessary to send haps to `pianoroll` from this (the output).
    if (typeof globalThis.haps_from_outputs !== 'undefined') {
        globalThis.haps_from_outputs.push(hap);
    }
    note_counter = note_counter + 1;
    // Time in seconds counting from now.
    const p2 = tidal_time - audioContext.currentTime;
    // Either this, or early return.
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
    const p5 = 127 * (hap.context?.velocity ?? 0.9);
    // All Strudel controls as a string.
    const p6 = '\"' + Object.entries({ ...hap.value, frequency })
      .flat()
      .join('/') + '\"';
    const i_statement = ['i', p1, p2, p3, p4, p5, p6, '\n'].join(' ');
    hap = setPitch(hap, Math.round(p4));
    diagnostic('[csoundn] ' + i_statement, INFORMATION);
    csound.inputMessage(i_statement);
    // The trigger hijacks the default output, hence it is non-dominant with gain 0.
    if (diagnostic_level() >= INFORMATION) diagnostic('[csoundn] sync: ' + ' note_counter: ' + note_counter + ' note: ' + p4 + '\n');
  }, false).gain(0);
});

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
 * This implementation does not use a trigger. Each cycle schedules a block 
 * of Csound events.
 */
export const csoundn = register('csoundn', (instrument, pat) => {
    let p1 = instrument;
    if (typeof instrument === 'string') {
        p1 = ['${', instrument, '}'].join();
    }
    return pat.withHap((hap) => {
         if (!csound) {
          diagnostic('[csounds]: Csound is not yet loaded.\n', WARNING);
          return;
        }
        note_counter = note_counter + 1;
        // Time in seconds counting from the start of this cycle.
        // Either this, or early return.
        if (hap.part.begin.equals(hap.whole.begin) == false) {
            return hap;
        }
        let hap_begin = hap.whole.begin.valueOf();
        let cyclist_last_begin = globalThis.__cyclist__.lastBegin;
        let cyclist_latency = globalThis.__cyclist__.latency;
        let p2 = hap_begin - cyclist_last_begin + cyclist_latency;
        if (p2 < 0) {
            return hap;
        }
        const p3 = hap.duration.valueOf() + 0;
        const frequency = getFrequency(hap);
        // Translate frequency to MIDI key number _without_ rounding.
        const C4 = 261.62558;
        let octave = Math.log(frequency / C4) / Math.log(2.0) + 8.0;
        const p4 = octave * 12.0 - 36.0;
        // We prefer floating point precision, but over the MIDI range [0, 127].
        ///const p5 = 127 * (hap.context?.velocity ?? 0.9);
        let p5;
        if (typeof hap.value.gain === 'undefined') {
            p5 = 80;
        } else {
            p5 = 127 * hap.value.gain;
        }
        const p6 = 0; // Not used here.
        let p7 = .5; // Pan, will update from controls if in controls.
        // For stateful Patterns, in order to display notes in `pianoroll`,
        // it is necessary to send haps to `pianoroll` from this (the output).
        if (typeof globalThis.haps_from_outputs !== 'undefined') {
            hap.value.gain = p5 / 127;
            globalThis.haps_from_outputs.push(hap);
        }
        // All Strudel controls as a string.
        const controls = '\"' + Object.entries({ ...hap.value, frequency })
          .flat()
          .join('/') + '\"';
        ///const i_statement = ['i', p1, p2, p3, p4, p5, p6, '\n'].join(' ');
        const i_statement = ['i', p1, p2, p3, p4, p5, p6, p7, controls, '\n'].join(' ');
        console.log('[csoundn] ' + i_statement);
        csound.readScore(i_statement);
         if (diagnostic_level() >= INFORMATION) diagnostic('[csoundn] sync: ' + ' note_counter: ' + note_counter + ' note: ' + p4 + '\n');
        return hap;
        // Silence the default output. This is the hack!
    }).gain(0);
});

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
export function Pitv(voices, range) {
    if (diagnostic_level() >= DEBUG) diagnostic('[Pitv] Creating PITV group...\n');
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
        this.value = 0;
    }
    /**
     * Applies a Chord or chord name to this.
     */
    acC(is_onset, chord_id, hap) {
        if (is_onset === true) {
            if (typeof chord_id === 'string') {
                this.ac_chord = csoundac.chordForName(chord_id);
                if (diagnostic_level() >= DEBUG) diagnostic('[acC] onset: created new chord.\n');
            } else {
                this.ac_chord = chord_id;
                if (diagnostic_level() >= DEBUG) diagnostic('[acC] onset: using existing chord.\n');
            }
            if (diagnostic_level() >= DEBUG) {
                let message = ['[acC] onset: chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' ');
                diagnostic(message);
            }
        }
        return hap;
    }
    /**
     * Applies a transposition to the Chord of this.
     */
    acCT(is_onset, semitones, hap) {
        if (is_onset === true) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCT onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.T(semitones);
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCT onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
        }
        return hap;
    }
    /**
     * Applies an inversion to the Chord of this. The 
     * default center of reflection is 0.
     */
    acCI(is_onset, center, hap) {
        if (is_onset === true) {
            if (typeof center === 'undefined') {
                center = 0;
            }
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCI] onset: current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.I(center);
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCI] onset: transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
        }
        return hap;
    }
    /**
     * Applies the interchange by inversion operation of the Generalized 
     * Contextual Group of Fiore and Satyendra to the Chord of this.
     */
    acCK(is_onset, hap) {
        if (is_onset === true) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCK onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            this.ac_chord = this.ac_chord.K();
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCK onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
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
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCQ onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
        }
        return hap;
    }
    //~ /**
     //~ * Applies the nth octavewise revoicing of the Chord of this that is 
     //~ * generated by iterating octavewise revoicings within the indicated 
     //~ * 0-based range.
     //~ */
    //~ acCO(is_onset, revoicingNumber_, range, hap) {
        //~ if (is_onset === true) {
            //~ if (diagnostic_level() >= DEBUG) diagnostic(['[acCO onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
            //~ this.ac_chord = csoundac.octavewiseRevoicing(this.ac_chord, revoicingNumber_, range);
            //~ if (diagnostic_level() >= DEBUG) diagnostic(['[acCO onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
        //~ } 
        //~ return hap;
    //~ }
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
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCOP onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), hap.show(), '\n'].join(' '));
        }
        return hap;
    }
    /**
     * Applies the Chord of this to the _pitch-class_ of the Hap, i.e., moves 
     * the _pitch-class_ of the Hap to the nearest _pitch-class_ of the Chord.
     */
    acCV(is_onset, hap) {
        if (is_onset === true) {
            //if (diagnostic_level() >= DEBUG) diagnostic('[acCV onset].\n');
        } else {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acCV query]: not a note!\n');
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let epcs = this.ac_chord.epcs();
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCV query] current chord:  ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCV query] current hap:    ', hap.show(), '\n'].join(' '));
            let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            hap = setPitch(hap, note);
            if (diagnostic_level() >= DEBUG) diagnostic(['[acCV query] new hap:        ', hap.show(), '\n'].join(' '));
        }
        return hap;
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
    constructor(scale, voices = 3) {
        super();
        this.registerPatterns();
        this.voices = voices;
        if (typeof scale === 'string') {
            // Have to use underscores instead of spaces in the Strudel REPL.
            scale = scale.replace('_', ' ');
            this.ac_scale = csoundac.scaleForName(scale);
            if (diagnostic_level() >= DEBUG) diagnostic('[acS onset] created new scale.\n');
        } else {
            this.ac_scale = scale;
            if (diagnostic_level() >= DEBUG) diagnostic('[acS onset] using existing scale.\n');
        }
        this.ac_chord = this.ac_scale.chord(1, this.voices, 3);
    }
    /**
     * acS:        Insert a CsoundAC Scale into the Pattern's state. The Chord 
     *             of this is moved to the same scale degree in the new Scale
     *             that it had in the old Scale.
     */
    acS(is_onset, scale, hap) {
        if (is_onset === true) {
            // Doesn't seem to work.
            // let scale_degree = this.ac_scale.degree(this.ac_chord, 3);
            if (typeof scale === 'string') {
                // Have to use underscores instead of spaces in the Strudel REPL.
                scale = scale.replace('_', ' ');
                this.ac_scale = csoundac.scaleForName(scale);
                if (diagnostic_level() >= DEBUG) diagnostic('[acS onset] created new scale.\n');
            } else {
                this.ac_scale = scale;
                if (diagnostic_level() >= DEBUG) diagnostic('[acS onset] using existing scale.\n');
            }
            this.ac_chord = this.ac_scale.chord(1, this.voices, 3);
            if (diagnostic_level() >= DEBUG) {
                diagnostic(['[acS onset] new scale:', this.ac_scale.toString(), this.ac_scale.name(), '\n'].join(' '));
                diagnostic(['[acS onset] new chord:', this.ac_chord.toString(), this.ac_chord.name(), '\n'].join(' '));
            }
        }
        return hap;
    }
    /** 
     *acSS:        Insert the Chord at the specified scale step of the Scale in 
     *             the Pattern's state, into the state.
     */
    acSS(is_onset, scale_step, hap) {
        if (is_onset === true) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSS onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.ac_chord = this.ac_scale.chord(scale_step, this.voices, 3);
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSS onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        }  
        return hap;
    }
    /**
     * acST:       Transpose the Chord in the Pattern's state by the specified 
     *             number of scale steps in the Scale in the state.
     */
    acST(is_onset, scale_steps, hap) {
        if (is_onset === true) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acST onset] current chord:    ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            this.ac_chord = this.ac_scale.transpose_degrees(this.ac_chord, scale_steps, 3);    
            if (diagnostic_level() >= DEBUG) diagnostic(['[acST onset] transformed chord:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
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
            let pivot_chord_eop = this.ac_chord.eOP();
            let possible_modulations = this.ac_scale.modulations(pivot_chord_eop);
            let new_scale = this.ac_scale;
            let modulation_count = possible_modulations.size();
            let wrapped_index = -1;
            if (modulation_count > 0) {
                wrapped_index = index % modulation_count;
                new_scale = possible_modulations.get(wrapped_index);
                if (diagnostic_level() >= DEBUG) {
                    let message_ = [
    '[acSM onset] modulating in:', this.ac_scale.toString(), this.ac_scale.name(), '\n',
    '[acSM onset] from pivot:   ', pivot_chord_eop.toString(), pivot_chord_eop.name(), '\n',
    '[acSM onset] modulations:  ', modulation_count, '=>', wrapped_index, '\n',
    '[acSM onset] modulated to: ', new_scale.toString(), new_scale.name()
    ].join(' ');
                    diagnostic(message_);
                    diagnostic('[acSM]: hap: ' + hap.show() + '\n');
                }
                this.ac_scale = new_scale;
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
        } else {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acSV query] not a note!\n');
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let epcs = this.ac_scale.epcs();
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSV query] current scale:  ', this.ac_scale.toString(), this.ac_scale.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSV query] current hap:    ', hap.show(), '\n'].join(' '));
            let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            hap = setPitch(hap, note);
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSV query] new hap:        ', hap.show(), '\n'].join(' '));
        }
        return hap;
    }
    /**
     * acSCV:      Move notes in the Pattern to fit the Chord in the Pattern's 
     *             state.
     */
    acSCV(is_onset, hap) {
        if (is_onset === true) {
        } else {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acSCV query] not a note!\n');
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let epcs = this.ac_chord.epcs();
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV query] current scale:  ', this.ac_scale.toString(), this.ac_scale.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV query] current chord:  ', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV query] current hap:    ', hap.show(), '\n'].join(' '));
            let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            hap = setPitch(hap, note);
            if (diagnostic_level() >= DEBUG) diagnostic(['[acSCV query] new hap:        ', hap.show(), '\n'].join(' '));
        }
        return hap;
    }
}

/**
 * Creates a class to hpitvold state and defines Patterns for creating and using 
 * that state to work with CsoundAC PITV groups. An instance of this class 
 * must be created at module scope and passed to the relevant Patterns.
 */
export class PitvPatterns extends StatefulPatterns {
    constructor(pitv) {
        super();
        this.registerPatterns();
        this.pitv = pitv;
    }
    /**
     * acP:        Insert a CsoundAC PITV group into the Pattern's state.
     */
    acP(is_onset, pitv, hap) {
        if (is_onset == true) {
            if (diagnostic_level() >= DEBUG) diagnostic(['[acP onset] current PITV:  ', this.this.pitv.list(true, true, false), '\n'].join(' '));
            this.pitv = pitv;
        } 
        return hap;
    }
    /**
     * acPP:       Set the prime form index of the PITV element in the Pattern's 
     *             state.
     */
    acPP(is_onset, P, hap) {
        if (is_onset === true) {
            this.pitv.P = P;
        }
        return hap;
    }
    /**
     * acPI:       Set the inversion index of the PITV element in the Pattern's 
     *             state.
     */
    acPI(is_onset, I, hap) {
        if (is_onset === true) {
            this.pitv.I = I;
        }
        return hap;
    }
    /**
     * acPT:       Set the transposition index of the PITV element in the 
     *             Pattern's state.
     */
    acPT(is_onset, T, hap) {
        if (is_onset === true) {
            this.pitv.T = T;
        }
        return hap;
    }
    /**
     * acPO:       Set the octavewise voicing index of the PITV element in the 
     *             Pattern's state.
     */
    acPO(is_onset, V, hap) {
        if (is_onset == true) {
            this.pitv.V = V;
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
            if (diagnostic_level() >= DEBUG) diagnostic(['[acPC onset]:', this.ac_chord.toString(), this.ac_chord.eOP().name(), '\n'].join(' '));
        }
        return hap;
    }
    /**
     * acPV:       Move notes in the Pattern to fit the pitch-class set of the 
     *             element of the PITV group in the Pattern's state.
     */
    acPV(is_onset, hap) {
        if (is_onset === true) {
        } else {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acPV] not a note!\n', WARNING);
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let eop = this.pitv.toChord(this.pitv.P, this.pitv.I, this.pitv.T, this.pitv.V, true).get(1);
            let epcs = eop.epcs();
            let new_midi_key = csoundac.conformToPitchClassSet(current_midi_key, epcs);
            hap = setPitch(hap, new_midi_key);
            if (diagnostic_level() >= DEBUG) diagnostic(['[acPV query]:', eop.toString(), eop.name(), 'old note:', current_midi_key, 'new note:', hap.show(), '\n'].join(' '));
         }
        return hap;
    }
    /**
     * acPVV:      Move notes in the Pattern to fit the element of the PITV 
     *             group in the Pattern's state.
     */
    acPVV(is_onset, hap) {
        if (is_onset === true) {
        } else {
            let frequency;
            try {
                frequency = getFrequency(hap);
            } catch (error) {
                diagnostic('[acPVV query] not a note!\n', WARNING);
                return;
            }
            let current_midi_key = frequencyToMidiInteger(frequency);
            let voiced_chord = this.pitv.toChord(this.pitv.P, this.pitv.I, this.pitv.T, this.pitv.V, true).get(0);
            let new_midi_key = csoundac.closestPitch(current_midi_key, voiced_chord);
            hap = setPitch(hap, new_midi_key);
            if (diagnostic_level() >= DEBUG) diagnostic(['[acPVV query]:', 'old note:', current_midi_key, 'new note:', hap.show(), '\n'].join(' '));
        }
        return hap;
    }
}



