# Parametric Lindenmayer System

A musical Lindenmayer system consists of symbols that may be commands in a context-free grammar for moving a turtle around in space to draw a musical score. The system is created by replacing each symbol in an axiom with a sequence of other symbols defined by rules for a specific number of iterations. A _parametric_ Lindenmayer system keeps a context of parameters that become arguments to the commands, and these parameters can be arithmetical expressions.

A `PLSystem` is a class `{turtle, commands, axiom, rules, stack, chord_space_group, chord_score}`.

The `PLSystem.turtle` consists of a tuple: `{note, direction, magnitude, chord, scale, degree}`. This odd structure represents my attempt to combine notes as points in a vector space, with implied harmonies; in fact, the `PLSystem` defines several ways of working with harmony:

- Matrix/vector arithmetic on `Turtle.note` and `Turtle.chord` using direction and magnitude.
- Neo-Riemannian transformations of `Turtle.chord`, including actions of the Generalized Contextual Group.
- Actions of the chord_space_group on the `Turtle.chord`.
- Functional harmony operations on the `Turtle.chord` using the `Turtle.scale` and `Turtle.degree`, up to and including modulations and secondary dominants.

`PLSystem.chord_score` is a `CsoundAC.Score` that also contains a timeline of `CsoundAC.Chord` that can be applied to harmonize the notes of the score. Flags may be added to the Chords in the timeline to indicate how notes are to be quantized: to the nearest pitch-class of the chord, to the nearest actual pitch of the chord which may have been octavewise revoiced, or as the smoothest voice-leading from the prior chord.

`PLSystem.chord_space_group` is a group in which all equally tempered Chords within a given range of pitches can be represented by the orthogonal subgroups `P` for set type, `I`  in [0, 1] for inversion in the sense of reflection in the chord space's inversion flat, `T` for transposition within the octave in [0..12], and `V` for the nth octavewise revoicing of that chord within that range.  Each of these subgroups is a finite clock group, and thus the `chord_space_group` is a 4-dimensional discrete orbifold.

The `chord` element of the turtle can not only be factored into `P`, `I`, `T`, and `V` with respect to the chord space group of the system, but also derived from a new `P`, `I`, `T`, and `V`. Hence, operations upon `P`, `I`, `T`, or `V` involve factoring the chord into `P`, `I`, `T`, and `V`, performing the operation, and then re-composing the chord from the new `P`, `I`, `T`, and `V`. 

Voice-leading means producing a new chord of the specified pitch-class set as the smoothest voice-leading from the prior chord, omitting parallel fifths, thus ignoring the `V` element of `{P, I, T, V}`.

A `PLSystem.Rule` is defined as:

`PLSystem.add_rule("symbol", "conditional expression", "word {; word}");`

Words are arbitrary JavaScript identifiers, but can identify PLSystem commands; each command is: "object operation [{parameters}] ;". The number and meaning of the parameters are defined by the object and operation. 

Objects:

 - `n`: `Turtle.note`.
 - `o`: `Turtle.direction`.
 - `m`: `Turtle.magnitude`.
 - `c`: `Turtle.chord`.
 - `s`: `Turtle.scale`.
 - `d`: `Turtle.degree`.
 - `p`: Set class or prime form, implied by `Turtle.chord` and `Turtle.chord_space_group`.
 - `i`: Inversion, implied by `Turtle.chord` and `Turtle.chord_space_group`.
 - `t`: Pitch-class transposition, implied by `Turtle.chord` and `Turtle.chord_space_group`.
 - `v`: Octavewise revoicing, implied by `Turtle.chord` and `Turtle.chord_space_group`.

Operations are _partially_ polymorphic:

 - Assign: 
    - `n = dimension, value;`
    - `n = t, d, s, c, k, v, x;`
    - `c = {pitch};`
    - `s = {pitch};`
    - `d = degree;`
    - `p = x;`
    - `i = x;`
    - `t = x;`
    - `v = x;`
  - Add (actually `+=`): 
    - `n + dimension, x;`
    - `d + steps;`
    - `p + x;`
    - `i + x;`
    - `t + x;`
    - `v + x;`
  - Subtract (actually `-=`): 
    - `n - dimension, x;`
    - `d - steps;`
    - `p - x;`
    - `i - x;`
    - `t - x;`
    - `v - x;`
  - Multiply (actually `*=`): 
    - `n * dimension, x;`
    - `d * steps;` 
    - `p * x;`
    - `i * x;`
    - `t * x;`
    - `v * x;`
  - Divide (actually `/=`): 
    - `n / dimension, x;`
    - `d / steps;` 
    - `p / x;`
    - `i / x;`
    - `t / x;`
    - `v / x;`
 - Rotate:
   - `o from_dimension, to_dimension, radians;`
 - Move `Turtle.note` along `Turtle.direction` by `Turtle.magnitude`:
   - `f;`
 - Write the note or notes of `Turtle.chord` (with optional duration) into the generated score at the turtle time:
   - `n;`
   - `c [ d ];`
 - Write `Turtle.chord` (optionally as actually voiced, or as smoothly voice-led from `Turtle.prior_chord`), or the chord at the `Turtle.degree` of `Turtle.scale`, into the harmony at the turtle time:
   - `c [ v | s ];`
   - `d [ v ];`
 - Modulate the `Turtle.scale` using `Turtle.chord``as a pivot, selecting the `i`th of `n` possible modulations; only happens if `Turtle.chord` exists at some degree of `Turtle.scale`, and a modulation exists. The number of voices to be considered for the pivot chord may optionally be specified.
   - `m i [ n ];`
 - Perform the `K` operation of the Generalized Contextual Group upon `Turtle.chord`.
   - `k;`
 - Perform the `Q(steps)` operation of the Generalized Contextual Group, i.e. contextual transposition, upon `Turtle.chord`, with an optional value of `steps` semitones.
   - `q [ x ];`
 - Push the current turtle state onto `PLSystem.stack`.
   -  `[;`
 - Pop the current turtle state from `PLSystem.stack`.
   -  `];`

 
 