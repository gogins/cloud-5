# Parametric Lindenmayer System

A musical Lindenmayer system is a formal rewriting system whose symbols may 
include turtle commands for generating a musical score. Starting from an 
initial axiom, the system repeatedly replaces symbols with successor sequences 
of symbols according to production rules. After a specified number of 
iterations, the final sequence of symbols is interpreted from left to right as 
instructions for moving a musical turtle through a compositional space and 
writing notes into a score.

A _parametric_ musical Lindenmayer system extends this model by allowing 
symbols to carry parameters. A symbol may appear either as a bare identifier 
item, such as `A;`, or as a parameterized symbol, such as `A x, y;`.

In this system, a word is a sequence of semicolon-terminated items. Each item 
is either a symbol or a command. Any item may be rewritten by a rule whose 
predecessor matches its shape and argument count. During rewriting, parameter 
expressions are evaluated and passed forward into successor items. Items with 
no matching rule are copied to the next iteration. After the final iteration, 
each remaining item is interpreted as a turtle command and evaluating them 
from left to right generates the score.

The formal grammar:
```
Identifier     ::= JavaScriptIdentifier ;
Expression     ::= JavaScriptExpression ;
Rule           ::= Predecessor [Condition] "->" Word ;
Predecessor    ::= Item ;
Condition      ::= ":" Expression ;
Word           ::= {Item ";"} ;
Item           ::= Symbol | Command ;
Symbol         ::= Identifier [ArgumentList] ;
ParameterList  ::= Parameter {"," Parameter} ;
Parameter      ::= Identifier ;
ArgumentList   ::= Expression {"," Expression} ;
Command        ::= ArithmeticCommand
                 | BuiltinCommand ;
ArithmeticCommand
               ::= Object Operator ArgumentList ;
Object         ::= "n" | "o" | "m" | "c" | "s" | "d"
                 | "p" | "i" | "t" | "v" ;
Operator       ::= "=" | "+" | "-" | "*" | "/" | "^";
BuiltinCommand ::= "R"   [ArgumentList]
                 | "F"
                 | "T"   [ArgumentList]
                 | "I"
                 | "Wn"
                 | "Wc"
                 | "Wcd"
                 | "Hc"
                 | "Hcv"
                 | "Hcs"
                 | "Hd"
                 | "Hds"
                 | "Q"   [ArgumentList]
                 | "K"
                 | "M"   [ArgumentList]
                 | "S"   [ArgumentList]
                 | "["
                 | "]" ;
```

Every item in a word is terminated by `;`. Parentheses are not used for 
parameters or arguments; commas separate parameters or arguments within an 
item.

The `PLSystem` class implements this grammar: `{turtle, commands, axiom, 
rules, stack, chord_space_group, chord_score}`.

The `PLSystem.turtle` consists of: `{note, orientation, magnitude, chord, 
scale, degree}`. This odd structure represents my attempt to combine notes as 
points in a vector space, with implied harmonies; in fact, `PLSystem` defines 
several ways of working with harmony:

- Matrix/vector arithmetic on `Turtle.note` and `Turtle.chord` using 
  `Turtle.orientation` and `Turtle.magnitude`.
- Neo-Riemannian transformations of `Turtle.chord`, including actions of the 
  Generalized Contextual Group.
- Actions of `Turtle.chord_space_group` on `Turtle.chord`.
- Functional harmony operations on `Turtle.chord` using `Turtle.scale` 
  and `Turtle.degree`, up to and including modulations and secondary 
  functions.

`PLSystem.chord_score` is a `CsoundAC.Score` also containing a timeline of 
`CsoundAC.Chord` instances, i.e. a "harmony", that can be applied to harmonize 
the notes of the score. Flags added to the Chords in the timeline indicate how 
notes are to be conformed to those chords.

**KEY during generation and post-process:** `n + 4` / `Nk` and other turtle motion
may move KEY freely (no modulus wrap). After `generate()` has finished all
iterations, call `applyChordLindenmayerPostProcess()`: it **linearly rescales KEY**
into `[keyMinimum, keyMinimum + keyRange]` (defaults: `0` and `pitv.range`),
then runs `conformToChords`, then **ties overlapping notes** (only at the end).
Register arcs from the grammar are preserved by the rescale; harmony is applied
only after keys are brought into range. Do not wrap or tie keys during generation.

`PLSystem.chord_space_group` is a group in which all equally tempered Chords 
within a given range of pitches can be represented by the orthogonal 
subgroups:

 - `P`: cyclic index over the system's ordered prime forms.
 - `I`: cyclic index of inversion in [0, 1].
 - `T`: cyclic index of pitch-class transposition by `g` in 
        [0..((12 / g) - g)], where 'g' is the generator of transposition.
 - `V`: cyclic index over bounded octavewise voicings.

 Mathematically, the `chord_space_group` coordinates are denoted `P`, `I`, 
 `T`, and `V`. In the command language, the corresponding mutable turtle 
 objects are named `p`, `i`, `t`, and `v`.

Thus the `chord_space_group` is a 4-dimensional discrete orbifold. The `chord` 
element of the turtle can not only be factored into `P`, `I`, `T`, and `V` 
with respect to the chord space group of the system, but also derived from a 
new `P`, `I`, `T`, and `V`. Hence, operations upon `P`, `I`, `T`, or `V` 
involve factoring the chord into `P`, `I`, `T`, and `V`, performing the 
operation, and then re-composing the chord from the new `P`, `I`, `T`, and 
`V`.

Voice-leading means producing a new chord of the specified pitch-class set as 
the smoothest voice-leading from the currently sounding notes in the score, 
omitting parallel fifths, thus ignoring the `V` element of `{P, I, T, V}`.

A `PLSystem.Rule` is created by giving a predecessor pattern, an optional 
conditional expression, and a successor word.

`PLSystem.add_rule("predecessor;", [ "condition", ] "successor;");`

Each item, rule predecessor, axiom, and successor production must end with `;`.
The parser strips that terminator before reading arguments, so formal parameters
such as `x` in `n = t, d, s, c, k, v, x;` are recognized correctly.

Item names are JavaScript identifiers or reserved command names. A word is a 
sequence of semicolon-terminated items. Each item is either rewritten by a 
matching rule or interpreted as a turtle command after the final iteration. 
A command is either an arithmetic operation on a turtle object, or a reserved 
built-in command. Arguments, if any, follow the object/operator or command 
name and are separated by commas. The number and meaning of the parameters 
are defined by the object and operation.

Rule predecessors may be any item: any built-in command such as `Wn` or 
`Q steps`, any arithmetic command such as `n * 1, 2`, or any other identifier 
such as `A`. The predecessor's argument count and shape must match the 
item being rewritten; identifier arguments in the rule predecessor are formal 
parameters available in conditions and successor expressions.

## Objects

  - `n`: `Turtle.note`.
  - `o`: `Turtle.orientation`.
  - `m`: `Turtle.magnitude`.
  - `c`: `Turtle.chord`.
  - `s`: `Turtle.scale`.
  - `d`: `Turtle.degree`.
  - `p`: Index of set class or prime form, implied by `Turtle.chord` and 
    `Turtle.chord_space_group`.
  - `i`: Inversion, implied by `Turtle.chord` and 
    `Turtle.chord_space_group`.
  - `t`: Pitch-class transposition, implied by `Turtle.chord` and 
    `Turtle.chord_space_group`.
  - `v`: Octavewise revoicing, implied by `Turtle.chord` 
    and `Turtle.chord_space_group`.

## Commands 

Turtle commands are either arithmetic operators or begin with an upper-case 
letter. If the object is discrete, the result of the command is rounded to the 
nearest integer.

  - Assign: 
    - `n = dimension, value;`
    - `n = t, d, s, c, k, v, x;` assigns note fields on `Turtle.note` (use `Wn;` to write the note to the score).
    - `c = {pitch};`
    - `s = {pitch};`
    - `d = degree;`
    - `p = x;`
    - `i = x;`
    - `t = x;`
    - `v = x;`
  - Add (means `+=`): 
    - `n + dimension, x;`
    - `d + steps;`
    - `p + x;`
    - `i + x;`
    - `t + x;`
    - `v + x;`
  - Subtract (means `-=`): 
    - `n - dimension, x;`
    - `d - steps;`
    - `p - x;`
    - `i - x;`
    - `t - x;`
    - `v - x;`
  - Multiply (means `*=`): 
    - `n * dimension, x;`
    - `m * dimension, x;` sets `Turtle.magnitude[dimension]` to `x` (equivalent to 
      legacy `Scale(dimension, x)`).
    - `d * steps;` 
    - `p * x;`
    - `i * x;`
    - `t * x;`
    - `v * x;`
  - Divide (means `/=`): 
    - `n / dimension, x;`
    - `d / steps;` 
    - `p / x;`
    - `i / x;`
    - `t / x;`
    - `v / x;`
  - Exponentiate (means `^=`): 
    - `n ^ dimension, exponent;`
    - `d ^ exponent;` 
    - `p ^ exponent;`
    - `i ^ exponent;`
    - `t ^ exponent;`
    - `v ^ exponent;`
  - Rotate:
    - `R from_dimension, to_dimension, radians;`
  - Move `Turtle.note` along `Turtle.orientation` by `Turtle.magnitude`:
    - `F;`
  - Write `Turtle.note`, notes of `Turtle.chord` (or `Turtle.voiced_chord` if
    set by a revoicing step), or notes of `Turtle.chord` with duration into the
    generated _score_ at the turtle time:
    - `Wn;`
    - `Wc;`
    - `Wcd;`
  - Write the pitch-classes of `Turtle.chord`; `Turtle.chord` as actually 
    voiced; the pitch-classes of `Turtle.chord` at the smoothest voice-leading 
    from currently sounding notes in the score; the pitch-classes of the 
    chord at `Turtle.degree` of `Turtle.scale`; or the pitch-classes of the 
    chord at `Turtle.degree` of `Turtle.scale` at the smoothest voice-leading 
    from currently sounding notes in the score, into the _harmony_ at the 
    turtle time:
    - `Hc;`
    - `Hc voices;`
    - `Hcv;`
    - `Hcs;`
    - `Hcs voices;` gathers notes still playing at the harmony time, then fills
      to \c voices with the most recently ended notes from the prior segment
      (scanning backward through the score), voice-leads to the target chord,
      and conforms pitch-classes while preserving each note's octave register.
    - `Hd;`
    - `Hds;`
  - Modulate fron `Turtle.scale` to a new `Turtle.scale` using `Turtle.chord` 
    as the pivot. The system finds all scales in which `Turtle.chord` occurs 
    at some degree, and selects the `i`th scale from that list of possible 
    modulations. The number of voices to consider for matching the pivot chord 
    may optionally be given. If the specified modulation cannot be found, the 
    command has no effect.
    - `M index;`
    - `M index, voices;`
  - Mutate `Turtle.chord` to have a secondary function relative to a target 
    degree of `Turtle.scale`, without changing `Turtle.scale`. The argument 
    `function` gives the scale-degree function in the tonicized scale, and 
    `target_degree` gives the degree of the current scale to be tonicized. 
    For example, `S 5, 4, 4;` mutates the chord, if possible, to a four-voice 
    dominant-seventh chord of the scale whose tonic is degree 4 of
    `Turtle.scale`, i.e. V7/IV. It is then up to the user to progress to an
    appropriate degree of the original `Turtle.scale`. If no such mutation 
    preserves the required local root/degree relation, the command has no 
    effect.
    - `S function, target_degree;`
    - `S function, target_degree, voices;`
  - Transpose `Turtle.chord` by `interval` semitones.
    - `T interval;`
  - Invert `Turtle.chord` by reflecting it in the inversion flat of the 
    cyclic region of `OP` to which `Turtle.chord` belongs.
    - `I`
  - Perform the `Q` operation of the Generalized Contextual Group, i.e. 
    contextual transposition by `interval` steps, upon `Turtle.chord`.
    - `Q interval;`
  - Perform the `K` operation of the Generalized Contextual Group, i.e. 
    contextual inversion, upon `Turtle.chord`.
    - `K;`
  - Push the current turtle state onto `PLSystem.stack`.
    - `[;`
  - Pop the current turtle state from `PLSystem.stack`.
    - `];`


 