/**
  * C S O U N D A C   M O D U L E   F O R   S T R U D E L
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
  * The operations herein act upon the pitch values in Patterns. The resulting 
  * Patterns must still go through the Strudel note Pattern in order to trigger 
  * an audio output.
  *
  * Please note, the CsoundAC objects such as Chords, Scales, and PITV 
  * groups must be created before any Patterns, and passed into the 
  * appropriate Patterns, where they may be modified by reference.
  */

let csound;
let csoundac;
let csac_debugging = true;

/**
 * Enables or disables print statement debugging in this module.
 */
export function csacDebugging(enabled) {
    csac_debugging = enabled;
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
  * Initializes the CsoundAC WebAssembly library. Normally, 
  * this is set in globalThis by a containing program. 
  * This function should be called from module scope in 
  * Tidal code before creating any Patterns.
  */
export function csacLoad() {
  if (csoundac) {
    return;
  }
  if (globalThis.__csoundac__) {
    csound = globalThis.__csound__;
    csound.message(`[csacLoad]: using global ${csound}`);
    csoundac = globalThis.__csoundac__;
    csound.message(`[csacLoad]: using global ${csoundac}`);
  }
}

/**
  * A utility for making a _value_ copy of a Chord (or a Scale, which 
  * is derived from Chord). Object b is resized to the size of a, and a's 
  * pitches are copied to b. Currently, only pitches are copied.
  */
export function csacCopy(a, b) {
  b.resize(a.voices())
  for (let voice = 0; voice < a.voices(); ++voice) {
    let a_pitch = a.getPitch(voice);
    let b_pitch = b.getPitch(voice);
    b.setPitch(voice, a_pitch);
    // if (csac_debugging) csound.message(`voice ${voice}: a: ${a_pitch} old b: ${b_pitch} new b: ${b.getPitch(voice)}`);
  }
}

/**
  * Creates and initializes a CsoundAC Chord object. This function should be 
  * called from module scope in Tidal code before creating any Patterns. The 
  * Chord class is based on Dmitri Tymoczko's model of chord space, and 
  * represents an equally tempered chord of the specified number of voices as 
  * a single point in chord space, where each dimension of the space 
  * corresponds to one voice of the Chord. Chords are equipped with numerous 
  * operations from pragmatic music theory, atonal music theory, and 
  * neo-Riemannian music theory.
  */
export function csacChord(name) {
  csacLoad();
  if (csac_debugging) csound.message('[csacChord] Creating Chord...');
  let chord_ = csoundac.chordForName(name);
  if (csac_debugging) csound.message(`[csacChord] ${chord_.toString()}`);
  return chord_;
}

/**
  * A Pattern that transposes the specified Chord by the specified number 
  * of semitones. This enables transposing Chords in a patternified way.
  */
export const chordT = register('chordT', (current_chord, semitones, pat) => {
  return pat.withHap((hap) => {
    let new_chord = current_chord.T(semitones);
    if (csac_debugging) {
        let message = `[chordT]: ${current_chord.toString()} ${current_chord.eOP().name()} T(${semitones}) =>\n[chordT]: ${new_chord.toString()} ${new_chord.name()}`
        csound.message(message);
    }
    csacCopy(new_chord, current_chord);
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that reflects the specified Chord in the specified center. 
  * This enables inverting Chords in a patternified way.
  */
export const chordI = register('chordI', (current_chord, center, pat) => {
  return pat.withHap((hap) => {
    let new_chord = current_chord.I(center);
    if (csac_debugging) {
        let message = `[chordI]: ${current_chord.toString()} ${current_chord.eOP().name()} I(${center}) =>\n[chordI]: ${new_chord.toString()} ${new_chord.eOP().name()}`
        csound.message(message);
    }
    ///current_chord = new_chord;
    csacCopy(new_chord, current_chord);
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that transforms the specified Chord using the interchange by 
  * inversion operation of the Generalized Contextual Group of Fiore and 
  * Satyendra. This enables exchanging a "major" sounding pitch-class set with 
  * the corresponding "minor" sounding pitch-class set, and vice versa, in a 
  * patternified way.
  */
export const chordK = register('chordK', (current_chord, pat) => {
  return pat.withHap((hap) => {
    let new_chord = current_chord.K();
    if (csac_debugging) {
        let message = `[chordK]: ${current_chord.toString()} ${current_chord.eOP().name()} K =>\n[ChordK]: ${new_chord.toString()} ${new_chord.eOP().name()}`
        csound.message(message);
    }
    csacCopy(new_chord, current_chord);
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that transforms the specified Chord using the contextual 
  * transposition operation of the Generalized Contextual Group of Fiore and 
  * Satyendra. This enables tranposing the specified Chord by the specified 
  * number of semitones _up_ if the Chord is a _transposed_ form of the 
  * modality Chord, and by the specified number of semitones _down_ if the 
  * Chord is an _inverted_ form of the modality Chord. This enables applying 
  * contextual transpositions to Chords in a patternified way.
  */
export const chordQ = register('chordQ', (current_chord, modality, semitones, pat) => {
  return pat.withHap((hap) => {
    let new_chord = current_chord.Q(semitones, modality, 1.);
    if (csac_debugging) {
        let message = `[chordQ]: ${current_chord.toString()} ${current_chord.eOP().name()} Q(${semitones}) =>\n[chordQ]: ${new_chord.toString()} ${new_chord.eOP().name()}`
        csound.message(message);
    }
    csacCopy(new_chord, current_chord);
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that conforms _notes_ to the closest _note_ of the 
  * specified (presumably voiced) Chord.
  */
export const chordNV = register('chordNV', (chord_, pat) => {
  return pat.withHap((hap) => {
    let frequency;
    try {
      frequency = getFrequency(hap);
    } catch(error) {
      csound.message('[chordNV] not a note!', 'warning');
      return;
    }
    let current_midi_key = frequencyToMidiInteger(frequency);
    let new_midi_key = csoundac.closestPitch(current_midi_key, chord_);
    let result = hap.withValue(() => new_midi_key);
    if (csac_debugging) csound.message(`[chordNV]: ${chord_.toString()} ${chord_.eOP().name()} old note: ${current_midi_key} new note: ${result.value}`);
    return result;
  });
});

/**
  * A Pattern that conforms _pitch-classes_ to the closest _pitch-class set_ 
  * of the specified Chord.
  */
export const chordN = register('chordN', (chord_, pat) => {
  return pat.withHap((hap) => {
    let frequency;
    try {
      frequency = getFrequency(hap);
    } catch(error) {
      csound.message('[chordN] not a note!', 'warning');
      return;
    }
    let current_midi_key = frequencyToMidiInteger(frequency);
    let new_midi_key = csoundac.conformToPitchClassSet(current_midi_key, chord_.epcs());
    let result = hap.withValue(() => new_midi_key);
    if (csac_debugging) csound.message(`[chordN]: ${chord_.toString()} ${chord_.eOP().name()} old note: ${current_midi_key} new note: ${result.value}`);
    return result;
  });
});

/**
  * Creates and initializes a CsoundAC Scale object. This function should be 
  * called from module scope in Tidal code before creating any Patterns. The 
  * Scale class is derived from the CsoundAC Chord class, but has been 
  * equipped with additional methods based on Dimitri Tymoczko's model of 
  * functional harmony. This enables algorithmically generating Chords from 
  * scale degrees, transposing Chords by scale degrees, generating all 
  * possible modulations given a pivot chord, and implementing secondary 
  * dominants and tonicizations based on scale degree.
  */
export function csacScale(name) {
  csacLoad();
  if (csac_debugging) csound.message('[csacScale] Creating Scale...');
  let scale_ = csoundac.scaleForName(name);
  if (csac_debugging) csound.message(`[csacScale] ${scale_.name()}`);
  return scale_;
}

/**
  * A Pattern that returns the Chord corresponding to the specified scale step 
  * of the Scale object. This enables generating tonal chord progressions in a 
  * patternified way. The Chord is returned in the argument and can then be 
  * used in Chord-based Patterns.
  */
export const scaleS = register('scaleS', (current_chord, scale, scale_step, pat) => {
  return pat.withHap((hap) => {
    let new_chord = scale.chord(scale_step, current_chord.voices(), 3);
    if (csac_debugging) csound.message(`[scaleS]: old chord: ${current_chord.toString()} scale step: ${scale_step} new chord: ${new_chord.toString()}`);
    csacCopy(new_chord, current_chord);
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that transposes the specified Chord by the specified number of 
  * scale degrees, in the specified Scale. This enables generating tonal chord  
  * progressions within the Scale in a patternified way. The transposed Chord 
  * is returned in the argument and can then be used in Chord-based Patterns.
  */
export const scaleT = register('scaleT', (scale_, current_chord, scale_steps, pat) => {
  return pat.withHap((hap) => {
    let new_chord = scale_.transpose_degrees(current_chord, scale_steps, 3);
    if (csac_debugging) csound.message(`[scaleT]: old chord: ${current_chord.toString()} scale steps: ${scale_steps} new chord: ${new_chord.toString()}`);
    csacCopy(new_chord, current_chord);
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that modulates from one Scale to another, assuming that the 
  * specified Chord is a pivot chord in the specified Scale. This enables 
  * generating correct tonal key changes in a patternified way. The new 
  * Scale is returned in the argument and can then be used in Scale-based 
  * Patterns. The specified index picks one of the possible modulations.
  */
export const scaleM = register('scaleM', (current_scale, pivot_chord, index, pat) => {
  return pat.withHap((hap) => {
    let pivot_chord_eop = pivot_chord.eOP();
    let possible_modulations = current_scale.modulations(pivot_chord_eop);
    let new_scale = current_scale;
    let modulation_count = possible_modulations.size();
    let wrapped_index = -1;
    if (modulation_count > 0) {
      wrapped_index = index % modulation_count;
      new_scale = possible_modulations.get(wrapped_index);
      if (csac_debugging) {
        let message_ = `
[scaleM]: modulating in: ${current_scale.toString()} ${current_scale.name()} 
[scaleM]: from pivot:    ${pivot_chord_eop.toString()} ${pivot_chord_eop.name()}
[scaleM]: modulations:   ${modulation_count} => ${wrapped_index}
[scaleM]: modulated to:  ${new_scale.toString()} ${new_scale.name()}
`;
        csound.message(message_);
      }
      csacCopy(new_scale, current_scale);
    }
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that conforms notes to the closest pitch-class of the 
  * specified Scale.
  */
export const scaleN = register('scaleN', (scale_, pat) => {
  return pat.withHap((hap) => {
    let frequency;
    try {
      frequency = getFrequency(hap);
    } catch(error) {
      csound.message('[scaleN] not a note!', 'warning');
      return;
    }
    let current_midi_key = frequencyToMidiInteger(frequency);
    let new_midi_key = csoundac.conformToPitchClassSet(current_midi_key, scale_);
    let result = hap.withValue(() => new_midi_key);
    if (csac_debugging) csound.message(`[scaleN]: old note: ${current_midi_key} new note: ${new_midi_key}`);
    return result;
  });
});

/**
  * Creates and initializes a CsoundAC PITV object. This function should be 
  * called from module scope in Tidal code before creating any Patterns. The 
  * PITV object is a 4 dimensional cyclic group whose dimensions are TI set 
  * class (P), chord inversion (I), pitch-class transposition (T), and index 
  * of octavewise revoicing within the specified range (V). The elements of 
  * the group are chords in 12 tone equal temperament with the specified 
  * number of voices. There is a one-to-one mapping between PITV indices and 
  * chords, such that each voiced chord corresponds to a PITV index, and each 
  * PITV index corresponds to a voiced chord. This enables algorithmically 
  * generating harmonies and voicings by independently varying P, I, T, and V.
  */
export function csacPitv(voices, range) {
  if (csac_debugging) csound.message('[csacPitv] Creating PITV group...');
  csacLoad();
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
  * A Pattern that sets the indicated set-type index in the PITV object. This 
  * enables mutating Chords in a patternified way.
  */
export const pitvP = register('pitvP', (pitv, P, pat) => {
  return pat.withHap((hap) => {
    pitv.P = P;
    if (csac_debugging) csound.message(`[pitvP]: ${pitv.P}`);
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that sets the indicated index of inversion in the PITV object. 
  * This enables inverting a PITV element in a patternified way.
  */
export const pitvI = register('pitvI', (pitv, I, pat) => {
  return pat.withHap((hap) => {
    pitv.I = I;
    csound.message(`[pitvI]: ${pitv.I}`);
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that sets the indicated index of pitch-class transposition in 
  * the PITV object. This enables transposing a PITV element in a patternified 
  * way.
  */
export const pitvT = register('pitvT', (pitv, T, pat) => {
  return pat.withHap((hap) => {
    pitv.T = T;
    if (csac_debugging) csound.message(`[pitvT]: ${pitv.T}`);
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that sets the indicated index of octavewise revoicing in the 
  * PITV object. This enables revoicing a PITV element in a patternified way.
  */
export const pitvV = register('pitvV', (pitv, V, pat) => {
  return pat.withHap((hap) => {
    pitv.V = V;
    if (csac_debugging) csound.message(`[pitvV]: ${pitv.V}`);
    return hap.withValue(() => hap.value);
  });
});

/**
  * A Pattern that that conforms the notes of a Pattern to the current 
  * element of the PITV object. The notes are moved to the closest _note_ 
  * of the chord _voicing_ of the PITV element.
  */
export const pitvNV = register('pitvNV', (pitv, pat) => {
  return pat.withHap((hap) => {
    let frequency;
    try {
      frequency = getFrequency(hap);
    } catch(error) {
      csound.message('[pitvNV] not a note!', 'warning');
      return;
    }
    let current_midi_key = frequencyToMidiInteger(frequency);
    let voiced_chord = pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, true).get(0);
    let new_midi_key = csoundac.closestPitch(current_midi_key, voiced_chord);
    let result = hap.withValue(() => new_midi_key);
    if (csac_debugging) csound.message(`[pitvNV]: old note: ${current_midi_key} new note: ${new_midi_key} result.value: ${result.value}`);
    return result;
  });
});

/**
  * A Pattern that that conforms the notes of a Pattern to the current 
  * element of the PITV object. The notes are moved to the closest _pitch- 
  * class_ of the _pitch-class set_ of the PITV element.
  */
export const pitvN = register('pitvN', (pitv, pat) => {
  return pat.withHap((hap) => {
    let frequency;
    try {
      frequency = getFrequency(hap);
    } catch(error) {
      csound.message('[pitvNV] not a note!', 'warning');
      return;
    }
    let current_midi_key = frequencyToMidiInteger(frequency);
    let chord_ = pitv.toChord(pitv.P, pitv.I, pitv.T, pitv.V, false).get(1);
    let pcs_ = chord_.epcs();
    let new_midi_key = csoundac.conformToPitchClassSet(current_midi_key, pcs_);
    let result = hap.withValue(() => new_midi_key);
    if (csac_debugging) csound.message(`[pitvN]: old note: ${current_midi_key} new note: ${new_midi_key} result.value: ${result.value}`);
    /// console.log(`[pitvN]: old note: ${current_midi_key} new note: ${new_midi_key} result.value: ${result.value}`);
    return result;
  });
});







