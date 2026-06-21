# Parametric Lindenmayer System

A `PLSystem` is a class `{turtle, commands, axiom, rules, stack, chord_space_group, chord_score}`.

The `PLSystem.turtle` consists of a tuple: `{note, direction, magnitude, chord, scale, scale_degree}`. This odd structure represents my attempt to combine notes as points in a vector space, with implied harmonies; it is a bit of a kluge, but it works. In fact, the `PLSystem` defines several ways of working with harmony:

- Matrix/vector arithmetic on `Turtle.note` and `Turtle.chord` using direction and magnitude.
- Neo-Riemannian transformations of `Turtle.chord`, including actions of the Generalized Contextual Group.
- Actions of the chord_space_group on the `Turtle.chord`.
- Functional harmony operations on the `Turtle.chord` using the `Turtle.scale` and `Turtle.scale_degree`, up to and including modulations and secondary dominants.

`PLSystem.chord_score` is a Score that also contains a timeline of Chords that can be applied to harmonize the notes of the score. Flags may be added to the Chords in the timeline to indicate how notes are to be quantized: to the nearest pitch-class of the chord, to the nearest actual pitch of the chord which may have been octavewise revoiced, or as the smoothest voice-leading from the prior chord.

`PLSystem.chord_space_group` is a group in which all equally tempered chords within a given range of pitches can be represented by the more or less orthogonal subgroups `P` for set type, `I`  in [0, 1] for inversion in the sense of reflection in the chord space's inversion flat, `T` for transposition within the octave in [0..12], and `V` for the nth octavewise revoicing of that chord within that range.  Each of these subgroups is a finite clock group, and thus the `chord_space_group` is a 4-dimensional discrete orbifold.

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
 - `d`: `Turtle.scale_degree`.
 - `p`: Set class or prime form, implied by chord and chord_space.
 - `i`: Inversion, implied by chord and chord_space.
 - `t`: Pitch-class transposition, implied by chord and chord_space.
 - `v`: Octavewise revoicing, implied by chord and chord_space.

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
 - Move the turtle note along the turtle direction, by the turtle magnitude:
   - `f;`
 - Write the note or notes of the chord (with optional duration) into the generated score at the turtle time:
   - `n;`
   - `c [ d ];`
 - Write the chord (optionally as actually voiced, or as smoothly voice-led from prior chord), or the chord at the scale degree, into the harmony at the turtle time:
   - `c [ v | s ];`
   - `d [ v ];`
 - Modulate the turtle _scale_ using the turtle chord as a pivot, selecting the ith of n possible modulations; only happens if the turtle chord exists at a degree of that scale, and a modulation exists. The number of voices to be considered for the pivot chord may optionally be specified.
   - `m i [ n ];`
 - Perform the `K` operation of the Generalized Contextual Group upon the turtle chord.
   - `k;`
 - Perform the `Q(steps)` operation of the Generalized Contextual Group, i.e. contextual transposition, upon the turtle chord, with an optional value of semitones.
   - `q [ x ];`
 - Push the current turtle state onto the PLSystem stack.
   -  `[;`
 - Pop the current turtle state from the PLSystem stack.
   -  `];`

 
 