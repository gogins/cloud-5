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
 * The resulting Patterns must still go through the Strudel note Pattern 
 * in order to trigger audio output.
 */
let csac_debugging = true;
let csound = globalThis.__csound__;
let csoundac = globalThis.__csoundac__;

/** 
 * The following Patterns are defined in this module:
 *
 * acChord:    Insert a CsoundAC Chord into the Pattern's context.
 * acCT:       Transpose the Chord in the Pattern's context.
 * acCI:       Invert the Chord in the Pattern's context.
 * acCK:       Apply the interchange by inversion operation to the Chord in 
 *             the Pattern's context.
 * acCQ:       Apply the contextual transposition operation to the Chord in 
 *             the Pattern's context.
 * acCN:       Move notes in the Pattern to fit the pitch-class set of the 
 *             Chord in the Pattern's context.
 * acScale:    Insert a CsoundAC Scale into the Pattern's context.
 * acSS:       Insert the Chord at the specified scale step of the Scale in 
 *             the Pattern's context, into the context.
 * acST:       Transpose the Chord in the Pattern's context by the specified 
 *             number of scale steps in the Scale in the context.
 * acSM:       Modulate from the Scale in the Pattern's context, using the 
 *             Chord in the context as a pivot, choosing one of the possible 
 *             modulations by index.
 * acSN:       Move notes in the Pattern to fit the Scale in the Pattern's 
 *             context.
 * acPitv:     Insert a CsoundAC PITV group into the Pattern's context.
 * acPP:       Set the prime form index of the PITV element in the Pattern's 
 *             context.
 * acPI:       Set the inversion index of the PITV element in the Pattern's 
 *             context.
 * acPT:       Set the transposition index of the PITV element in the 
 *             Pattern's context.
 * acPV:       Set the voicing index of the PITV element in the Pattern's 
 *             context.
 * acPC:       Insert the Chord corresponding to the PITV element into the 
 *             Pattern's context.
 * acPN:       Move notes in the Pattern to fit the pitch-class set of the 
 *             element of the PITV 
 *             group in the Pattern's context.
 * acPNV:      Move notes in the Pattern to fit the element of the PITV 
 *             group in the Pattern's context.
 *
 * This is the design pattern for usage:
 *
 * "-8 [2,4,6]"
 * .acScale('C major') // Creates a CsoundAC Scale. 
 * .acSS("<0 -1 -2 -3 -4 -5 -6 -4>") // Generates a pattern of Chords from scale steps of the Scale.
 * .acCN() // Moves the notes in the topmost Pattern to the K'd Chords.
 */

const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * CsoundAC operations are applied to whole Haps only, so that Haps within 
 * that whole will use the Score or Chord of the whole, and will not create 
 * spurious operations.
 */
const isHapWhole = function(hap) {
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
export function diagnostic(message) {
    const text = `[csac]${message}`;
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
        // if (csac_debugging) diagnostic(`voice ${voice}: a: ${a_pitch} old b: ${b_pitch} new b: ${b.getPitch(voice)}`);
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
    if (csac_debugging) diagnostic('[csacChord] Creating Chord...');
    let chord_ = csoundac.chordForName(name);
    if (csac_debugging) diagnostic(`[csacChord] ${chord_.toString()}`);
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
    if (csac_debugging) diagnostic('[Scale] Creating Scale...');
    let scale_ = csoundac.scaleForName(name);
    if (csac_debugging) diagnostic(`[Scale] ${scale_.name()}`);
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
    if (csac_debugging) diagnostic('[Pitv] Creating PITV group...');
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
 * A Pattern that inserts a CsoundAC Chord object into its context. The chord 
 * can be either the string name of a CsoundAC Chord, or a previously created 
 * Chord object.
 */
export const acChord = register('acChord', function(chord, pat) {
    return pat.withHap((hap) => {
        let ac_chord;
        if (typeof chord == 'string') {
            ac_chord = new csoundac.chordForName(chord);
            if (csac_debugging) diagnostic(`[acChord]: created ${ac_chord.toString()}\n`);
        } else {
            ac_chord = chord;
            if (csac_debugging) diagnostic(`[acChord]: using ${ac_chord.toString()}\n`);
        }
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_chord
        });
    });
});

/**
 * A Pattern that transposes the Chord in its context by the specified number 
 * of semitones. This enables transposing Chords in a patternified way.
 */
export const acCT = register('acCT', (semitones, pat) => {
    return pat.withHap((hap) => {
        let ac_chord;
        if (!hap.context.ac_chord) {
            throw new Error('Can only use acCT after .acChord\n');
        }
        ac_chord = hap.context.ac_chord;
        let new_chord = ac_chord.T(semitones);
        if (csac_debugging) {
            let message = `[acCT]: ${ac_chord.toString()} ${ac_chord.eOP().name()} T(${semitones}) =>\n[csac][acCT]: ${new_chord.toString()} ${new_chord.eOP().name()}\n`
            diagnostic(message);
        }
        ac_chord = new_chord;
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_chord
        });
    });
});

/**
 * A Pattern that reflects the Chord in its context in the specified pitch. 
 * This enables inverting Chords in a patternified way. The pitch is normally 0.
 */
export const acCI = register('acCI', (pitch, pat) => {
    return pat.withHap((hap) => {
        let ac_chord;
        if (!hap.context.ac_chord) {
            throw new Error('Can only use acCI after .acChord\n');
        }
        ac_chord = hap.context.ac_chord;
        let new_chord = ac_chord.I(pitch);
        if (csac_debugging) {
            let message = `[acCI]: ${ac_chord.toString()} ${ac_chord.eOP().name()} I(${pitch}) =>\n[acCI]: ${new_chord.toString()} ${new_chord.eOP().name()}`
            diagnostic(message);
        }
        ac_chord = new_chord;
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_chord
        });
    });
});

/**
 * A Pattern that transforms the Chord in its context using the interchange by 
 * inversion operation of the Generalized Contextual Group of Fiore and 
 * Satyendra. This enables exchanging a "major" sounding pitch-class set with 
 * the corresponding "minor" sounding pitch-class set, and vice versa, in a 
 * patternified way.
 */
export const acCK = register('acCK', (pat) => {
    return pat.withHap((hap) => {
        let ac_chord;
        if (!hap.context.ac_chord) {
            throw new Error('Can only use acCK after .acChord\n');
        }
        ac_chord = hap.context.ac_chord;
        let new_chord = ac_chord.K();
        if (csac_debugging) {
            let message = `[acCK]: ${ac_chord.toString()} ${ac_chord.eOP().name()} K =>\n[csac][acCK]: ${new_chord.toString()} ${new_chord.eOP().name()}\n`
            diagnostic(message);
        }
        ac_chord = new_chord;
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_chord
        });
    });
});

/**
 * A Pattern that transforms the Chord in its context using the contextual 
 * transposition operation of the Generalized Contextual Group of Fiore and 
 * Satyendra. This enables tranposing the specified Chord by the specified 
 * number of semitones _up_ if the Chord is a _transposed_ form of the 
 * modality Chord, and by the specified number of semitones _down_ if the 
 * Chord is an _inverted_ form of the modality Chord. This enables applying 
 * contextual transpositions to Chords in a patternified way. The modality 
 * must be a previously created Chord or Scale.
 */
export const acCQ = register('acCQ', (semitones, modality, pat) => {
    return pat.withHap((hap) => {
        let ac_chord;
        if (!hap.context.ac_chord) {
            throw new Error('Can only use acCQ after .acChord\n');
        }
        ac_chord = hap.context.ac_chord;
        let new_chord = ac_chord.Q(semitones, modality, 1.);
        if (csac_debugging) {
            let message = `[acCQ]: ${ac_chord.toString()} ${ac_chord.eOP().name()} Q(${semitones}) =>\n[acCQ]: ${new_chord.toString()} ${new_chord.eOP().name()}`
            diagnostic(message);
        }
        ac_chord = new_chord;
        return hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_chord
        });
    });
});

/**
 * A Pattern that conforms notes to the closest _pitch-class set_ of the 
 * CsoundAC Chord that is in its context.
 */
export const acCN = register('acCN', (pat) => {
    return pat.withHap((hap) => {
        let ac_chord;
        if (!hap.context.ac_chord) {
            throw new Error('Can only use acCN after .acChord.\n');
        }
        ac_chord = hap.context.ac_chord;
        let frequency;
        try {
            frequency = getFrequency(hap);
        } catch (error) {
            diagnostic('[acCN] not a note!\n');
            return;
        }
        let current_midi_key = frequencyToMidiInteger(frequency);
        let epcs = ac_chord.epcs();
        let note = csoundac.conformToPitchClassSet(current_midi_key, epcs);
        //let result = hap.withValue(() => new_midi_key);
        //let result = hap.withValue(() => (isObject ? { ...hap.value, note } : note)).setContext({ ...hap.context, ac_chord });
        let result = hap.withValue(() => note).setContext({
            ...hap.context,
            ac_chord
        });
        if (csac_debugging) {
            diagnostic(`[acCN]: ${ac_chord.toString()} ${ac_chord.eOP().name()} old note: ${current_midi_key} new note: ${result.value}\n`);
            diagnostic(`[acCN]: old hap: ${hap.show()}\n`);
            diagnostic(`[acCN]: new hap: ${result.show()}\n`);
        }
        return result;
    });
});

/**
 * A Pattern that inserts a CsoundAC Scale object into its context. The scale can 
 * be either the string name of a CsoundAC Scale, or a previously created Scale.
 */
export const acScale = register('acScale', function(scale, pat) {
    return pat.withHap((hap) => {
        let ac_scale;
        if (typeof scale == 'string') {
            ac_scale = new csoundac.Scale(scale);
            if (csac_debugging) diagnostic(`[acScale]: created ${ac_scale.toString()}\n`);
        } else {
            ac_scale = scale;
            if (csac_debugging) diagnostic(`[acScale]: using ${ac_scale.toString()}\n`);
        }
        if (csac_debugging) diagnostic(`[acScale]: hap: ${hap.show()}\n`);
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
        if (csac_debugging) diagnostic(`[acSS]: old chord: ${current_chord.toString()} scale step: ${scale_step} new chord: ${new_chord.toString()}`);
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
        if (csac_debugging) diagnostic(`[acST]: old chord: ${ac_chord.toString()} scale steps: ${scale_steps} new chord: ${new_chord.toString()}`);
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
                let message_ = `
[acSM]: modulating in: ${ac_scale.toString()} ${ac_scale.name()} 
[acSM]: from pivot:    ${pivot_chord_eop.toString()} ${pivot_chord_eop.name()}
[acSM]: modulations:   ${modulation_count} => ${wrapped_index}
[acSM]: modulated to:  ${new_scale.toString()} ${new_scale.name()}
`;
                diagnostic(message_);
                diagnostic(`[acSM]: hap: ${hap.show()}\n`);
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
        if (csac_debugging) diagnostic(`[acSN]: ${ac_scale.toString()} ${ac_scale.eOP().name()} old note: ${current_midi_key} new note: ${result.value}\n`);
        if (csac_debugging) diagnostic(`[acSN]: hap: ${hap.show()}\n`);
        return result;
    });
});

/**
 * A Pattern that inserts a CsoundAC PITV object intoto its context. The PITV 
 * object must have been previously created.
 */
export const acPitv = register('acPitv', function(pitv, pat) {
    return pat.withHap((hap) => {
        let ac_pitv = pitv;
        if (csac_debugging) {
            diagnostic(`[acPitv]: using ${ac_pitv.toString()}\n`);
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
        if (csac_debugging) diagnostic(`[acPP]: ${ac_pitv.P}`);
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
        if (csac_debugging) diagnostic(`[acPI]: ${ac_pitv.I}`);
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
        if (csac_debugging) diagnostic(`[acPT]: ${ac_pitv.T}`);
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
        if (csac_debugging) diagnostic(`[acPV]: ${ac_pitv.V}`);
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
            diagnostic('[acPC] not a note!', 'warning');
            return;
        }
        let ac_chord = ac_pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, true).get(0);
        let result = hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_chord
        });
        if (csac_debugging) diagnostic(`[acCN]: ${ac_chord.toString()} ${ac_chord.eOP().name()} old note: ${current_midi_key} new note: ${result.value}\n`);
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
            diagnostic('[acPC] not a note!', 'warning');
            return;
        }
        let current_midi_key = frequencyToMidiInteger(frequency);
        let ac_chord = pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, true).get(0);
        let epcs = ac_chord.epcs();
        let new_midi_key = csoundac.conformToPitchClassSet(current_midi_key, epcs);
        let result = hap.withValue(() => new_midi_key);
        if (csac_debugging) diagnostic(`[acPNV]: ${ac_chord.toString()} ${ac_chord.eOP().name()} old note: ${current_midi_key} new note: ${result.value}\n`);
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
            diagnostic('[acPC] not a note!', 'warning');
            return;
        }
        let current_midi_key = frequencyToMidiInteger(frequency);
        let ac_chord = pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, true).get(0);
        let new_midi_key = csoundac.closestPitch(current_midi_key, voiced_chord);
        let result = hap.withValue(() => hap.value).setContext({
            ...hap.context,
            ac_chord
        });
        if (csac_debugging) diagnostic(`[acPNV]: ${ac_chord.toString()} ${ac_chord.eOP().name()} old note: ${current_midi_key} new note: ${result.value}\n`);
        return result;
    });
});

/**
 * A Pattern that calls a closure that may be defined in a user level 
 * Strudel patch. To be used something like this:
 *
 * const c = .88;
 * let y = .5;
 * const logistic = function(pat, hap) {
 *   // In many cases, the closure should be computed only at the beginning 
 *   // of its cycle.
 *   if (hap.hasOnset() == true) {
 *     y = 4 * c * y * (1 - y);
 *   }
 *   let midi_key = Math.round(y * 36 + 36);
 *   return midi_key;
 * };
 * .acG(logistic)
 */
export const acG = register('acG', (closure, pat) => {
    return pat.withHap((hap) => {
        let result = closure(pat, hap);
        result = hap.withValue(() => result);
        if (csac_debugging) {
            diagnostic(`[acG]: ${ac_chord.toString()} ${ac_chord.eOP().name()} old note: ${current_midi_key} new note: ${result.value}\n`);
            diagnostic(`[acG]: ${hap.show()}\n`);
        }
        return result;
    });
});