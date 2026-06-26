# Parametric Lindenmayer System

A musical Lindenmayer system is a formal rewriting system whose symbols may 
include turtle commands for generating a musical score. Starting from an 
initial axiom, the system repeatedly replaces symbols with successor sequences 
according to production rules. After a specified number of iterations, the 
resulting sequence is interpreted from left to right as instructions for 
moving a musical turtle through a compositional space and writing notes into 
a score.

A _parametric_ musical Lindenmayer system extends this model by allowing 
symbols to carry parameters. A symbol may appear either as a bare identifier 
item, such as `A;`, or as a parameterized symbol, such as `A x, y;`.
Rules may refer to these parameters in their conditions and successor 
expressions. During rewriting, parameter expressions are evaluated and 
passed forward into newly generated symbols or terminal commands.

In this system, a word is a sequence of semicolon-terminated items. Each item 
is either a symbol or a terminal command. Some symbols are nonterminal and are 
rewritten by rules; terminal commands are copied through rewriting and later 
interpreted as turtle operations. Rewriting produces a final word, and 
interpretation of that word generates the score.

The formal grammar:
```
Identifier     ::= JavaScriptIdentifier ;
Expression     ::= JavaScriptExpression ;
Rule           ::= Predecessor [Condition] "->" Word ;
Predecessor    ::= Identifier [ParameterList] ;
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
Operator       ::= "=" | "+" | "-" | "*" | "/" ;
BuiltinCommand ::= "R"   [ArgumentList]
                 | "F"
                 | "Wn"
                 | "Wc"
                 | "Wcd"
                 | "Hc"
                 | "Hcv"
                 | "Hcs"
                 | "Hd"
                 | "K"
                 | "Q"   [ArgumentList]
                 | "M"   [ArgumentList]
                 | "["
                 | "]" ;
```

Every item in a word is terminated by `;`. Parentheses are not used for 
parameters or arguments; commas separate parameters or arguments within an item.

`PLSystem` is a class that implements this grammar: `{turtle, commands, axiom, 
rules, stack, chord_space_group, chord_score}`.

The `PLSystem.turtle` consists of: `{note, orientation, magnitude, chord, 
scale, degree}`. This odd structure represents my attempt to combine notes as 
points in a vector space, with implied harmonies; in fact, the `PLSystem` 
defines several ways of working with harmony:

- Matrix/vector arithmetic on `Turtle.note` and `Turtle.chord` using 
  `Turtle.orientation` and `Turtle.magnitude`.
- Neo-Riemannian transformations of `Turtle.chord`, including actions of the 
  Generalized Contextual Group.
- Actions of `Turtle.chord_space_group` on `Turtle.chord`.
- Functional harmony operations on `Turtle.chord` using `Turtle.scale` 
  and `Turtle.degree`, up to and including modulations and secondary 
  dominants.

`PLSystem.chord_score` is a `CsoundAC.Score` that also contains a timeline of 
`CsoundAC.Chord` that can be applied to harmonize the notes of the score. 
Flags may be added to the Chords in the timeline to indicate how notes are to 
be quantized: to the nearest pitch-class of the chord, to the nearest actual 
pitch of the chord which may have been octavewise revoiced, or as the 
smoothest voice-leading from the prior chord to the pitch-classes of 
`Turtle.chord`.

`PLSystem.chord_space_group` is a group in which all equally tempered Chords 
within a given range of pitches can be represented by the orthogonal 
subgroups:

 - `P`: cyclic index over the system's ordered prime forms.
 - `I`: inversion bit, cyclic of order 2.
 - `T`: transposition class, cyclic of order 12.
 - `V`: cyclic index over bounded octavewise voicings.

 Mathematically, the `chord_space_group` coordinates are denoted `P`, `I`, 
 `T`, and `V`. In the command language, the corresponding mutable turtle 
 objects are named `p`, `i`, `t`, and `v`.

Thus the `chord_space_group` is a 4-dimensional discrete orbifold. The `chord` 
element of the turtle can not only be factored into `P`, `I`, `T`, and `V` 
with respect to the chord space group of the system, but also derived from a 
new `P`, `I`, `T`, and `V`. Hence, operations upon `P`, `I`, `T`, or `V` 
involve factoring the chord into `P`, `I`, `T`, and `V`, performing the 
operation, and then re-composing the chord from the new `P`, `I`, `T`, and `V`. 

Voice-leading means producing a new chord of the specified pitch-class set as 
the smoothest voice-leading from the prior chord, omitting parallel fifths, 
thus ignoring the `V` element of `{P, I, T, V}`.

A `PLSystem.Rule` is created by giving a predecessor pattern, an optional 
conditional expression, and a successor word.

`PLSystem.add_rule("predecessor", [ "condition", ] "successor_word");`

Item names are JavaScript identifiers or reserved command names. A word is a 
sequence of semicolon-terminated items. Each item is either a symbol to be 
rewritten, or a command to be interpreted. A command is either an arithmetic 
operation on a turtle object, or a reserved built-in command. Arguments, if 
any, follow the object/operator or command name and are separated by commas. 
The number and meaning of the parameters are defined by the object and 
operation. 

Objects:

 - `n`: `Turtle.note`.
 - `o`: `Turtle.orientation`.
 - `m`: `Turtle.magnitude`.
 - `c`: `Turtle.chord`.
 - `s`: `Turtle.scale`.
 - `d`: `Turtle.degree`.
 - `p`: Index of set class or prime form, implied by `Turtle.chord` and `Turtle.chord_space_group`.
 - `i`: Inversion, implied by `Turtle.chord` and `Turtle.chord_space_group`.
 - `t`: Pitch-class transposition, implied by `Turtle.chord` and `Turtle.chord_space_group`.
 - `v`: Octavewise revoicing, implied by `Turtle.chord` and `Turtle.chord_space_group`.

Turtle commands are either arithmetic operators or upper-case:

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
 - Rotate:
   - `R from_dimension, to_dimension, radians;`
 - Move `Turtle.note` along `Turtle.orientation` by `Turtle.magnitude`:
   - `F;`
 - Write `Turtle.note`, notes of `Turtle.chord`, or notes of `Turtle.chord` 
   with duration into the generated _score_ at the turtle time:
   - `Wn;`
   - `Wc;`
   - `Wcd;`
 - Write the pitch-classes of `Turtle.chord`, `Turtle.chord` as actually 
   voiced, the pitch-classes of `Turtle.chord` at the smoothest voice-leading 
   from `Turtle.prior_chord`, or the pitch-classes at `Turtle.degree` of 
   `Turtle.scale`, into the _harmony_ at the turtle time:
   - `Hc;`
   - `Hcv;`
   - `Hcs;`   
   - `Hd;`
 - Modulate `Turtle.scale` using `Turtle.chord` as the pivot. The system finds 
   all scales in which `Turtle.chord` occurs at some degree, and selects the 
   `i`th scale from that computed list of possible modulations. The modulation 
   occurs only if such scales exist. The number of voices to consider for 
   matching the pivot chord may optionally be specified.
   - `M i;`
   - `M i, voices;`
 - Perform the `K` operation of the Generalized Contextual Group upon `Turtle.chord`.
   - `K;`
 - Perform the `Q(steps)` operation of the Generalized Contextual Group, i.e. contextual transposition, upon `Turtle.chord`, with an optional value of `steps` semitones.
   - `Q steps;`
 - Push the current turtle state onto the `PLSystem.stack`.
   -  `[;`
 - Pop the current turtle state from the `PLSystem.stack`.
   -  `];`

 
 