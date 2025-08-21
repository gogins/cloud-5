This document introduces you to Strudel in a technical sense. 

It is rather out of date, but there might still be useful info below.

If you just want to *use* Strudel, have a look at the [Tutorial](https://strudel.tidalcycles.org/tutorial/).

## Strudel Packages

There are different packages for different purposes. They..

- split up the code into smaller chunks
- can be selectively used to implement some sort of time based system

Please refer to the individual README files in the [packages folder](https://codeberg.org/uzu/strudel/src/branch/main/packages)

## REPL

The [REPL](https://strudel.tidalcycles.org/) is the place where all packages come together to form a live coding system. It can also be seen as a reference implementation for users of the library.

More info in the [REPL README](https://codeberg.org/uzu/strudel/src/branch/main/packages/repl/README.md)

# High Level Overview

<img src="strudelflow.png" width="600" />

## 1. End User Code

The End User Code is written in JavaScript with added syntax sugar. The [eval package](https://github.com/tidalcycles/strudel/tree/main/packages/eval#strudelcycleseval) evaluates the user code
after a transpilation step, which resolves the syntax sugar. If you don't want the syntax sugar, you can omit the eval package and call the native javascript `eval` instead.

### 🍭 Syntax Sugar

JavaScript Transpilation = converting valid JavaScript to valid JavaScript:

```js
"c3 [e3 g3]".fast(2)
```

becomes

```js
mini('c3 [e3 g3]')
  .withMiniLocation([1, 0, 0], [1, 11, 11]) // source location
  .fast(2);
```

- double quoted strings and backtick strings are turned into `mini` calls (single quoted strings are left as is)
- The source location is added by chaining `withMiniLocation`, which enables the real time highlighting later
- (psuedo) variable names that look like notes (like `c4`, `bb2` or `fs3`) are turned into strings
- support for top level await
- operator overloading could be implemented in the future

This is how it works:

<img src="https://github.com/tidalcycles/strudel/blob/talk/talk/public/shiftflow.png?raw=true" width="800" />

- The user code is parsed with a [shift parser](https://github.com/shapesecurity/shift-parser-js), generating an AST
- The AST is transformed to resolve the syntax sugar
- The AST is used to generate code again (shift-codegen)

Shift will most likely be replaced with acorn in the future, see https://github.com/tidalcycles/strudel/issues/174

### Mini Notation

Another important part of the user code is the mini notation, which allows to express rhythms in a short manner.

- the mini notation is [implemented as a PEG grammar](https://github.com/tidalcycles/strudel/blob/main/packages/mini/krill.pegjs), living in the [mini package](https://github.com/tidalcycles/strudel/tree/main/packages/mini)
- it is based on [krill](https://github.com/Mdashdotdashn/krill) by Mdashdotdashn
- the peg grammar is used to generate a parser with [peggyjs](https://peggyjs.org/)
- the generated parser takes a mini notation string and outputs an AST
- the AST can then be used to construct a pattern using the regular Strudel API

Here's an example AST:

```json
{
  "type_": "pattern",
  "arguments_": { "alignment": "h" },
  "source_": [
    {
      "type_": "element", "source_": "c3",
      "location_": { "start": { "offset": 1, "line": 1, "column": 2 }, "end": { "offset": 4, "line": 1, "column": 5 } }
    },
    {
      "type_": "element",
      "location_": { "start": { "offset": 4, "line": 1, "column": 5 }, "end": { "offset": 11, "line": 1, "column": 12 } }
      "source_": {
        "type_": "pattern", "arguments_": { "alignment": "h" },
        "source_": [
          {
            "type_": "element", "source_": "e3",
            "location_": { "start": { "offset": 5, "line": 1, "column": 6 }, "end": { "offset": 8, "line": 1, "column": 9 } }
          },
          {
            "type_": "element", "source_": "g3",
            "location_": { "start": { "offset": 8, "line": 1, "column": 9 }, "end": { "offset": 10, "line": 1, "column": 11 } }
          }
        ]
      },
    }
  ]
}
```

which translates to `seq(c3, seq(e3, g3))`

## 2. Querying & Scheduling

When the user code has been evaluated, we hopefully get a Pattern instance, which we can use to query events from. 
These events can then be used to trigger side effects in the real world. On that note, Events are mostly called Hap(s) in the codebase, because JS already has a built in `Event` class.

### Querying

> Querying = Asking a Pattern for Events within a certain time span

```js
seq('c3', ['e3', 'g3']) // <--- Pattern
  .queryArc(0, 2) // query events within 0 and 2 cycles
  .map((hap) => hap.showWhole()); // make readable
```

yields 

```js
[
  '0/1 -> 1/2: c3', // cycle 0
  '1/2 -> 3/4: e3',
  '3/4 -> 1/1: g3',
  '1/1 -> 3/2: c3', // cycle 1
  '3/2 -> 7/4: e3',
  '7/4 -> 2/1: g3',
];
```

### 🗓️ Scheduling

The scheduler will query events repeatedly, creating a possibly endless loop of time slices.
Here is a simplified example of how it works 

```js
let step = 0.5; // query interval in seconds
let tick = 0; // how many intervals have passed
let pattern = seq('c3', ['e3', 'g3']); // pattern from user
setInterval(() => {
  const events = pattern.queryArc(tick * step, ++tick * step);
  events.forEach((event) => {
    console.log(event.showWhole());
    const o = getAudioContext().createOscillator();
    o.frequency.value = getFreq(event.value);
    o.start(event.whole.begin);
    o.stop(event.whole.begin + event.duration);
    o.connect(getAudioContext().destination);
  });
}, step * 1000); // query each "step" seconds
```

## 3. Sound Output

The third and last step is to use the scheduled events to make sound. 
Patterns are wrapped with param functions to compose different properties of the sound.

```js
note("[c2(3,8) [<eb2 g1> bb1]]") // sets frequency
  .s("<sawtooth square>") // sound source
  .gain(.5) // turn down volume
  .cutoff(sine.range(200,1000).slow(4)) // modulated cutoff
  .slow(2)
  .out().logValues()`,
  ]}
/>
```

Here is an example Hap value with different properties:

```js
{ note: 'a4', s: 'sawtooth', gain: 0.5, cutoff: 267 }
```
<img src="waa-nodes.png" width="600" />

<div className="text-left">

- Patterns represent just values in time!
- Suitable for any time based output (music, visuals, movement, .. ?)

### Supported Outputs

At the time of writing this doc, the following outputs are supported:

- Web Audio API `.out()` see [/webaudio](https://github.com/tidalcycles/strudel/tree/main/packages/webaudio)
- MIDI `.midi()` see [/midi](https://github.com/tidalcycles/strudel/tree/main/packages/midi)
- OSC `.osc()` see [/osc](https://github.com/tidalcycles/strudel/tree/main/packages/osc)
- Serial `.serial()` see [/serial](https://github.com/tidalcycles/strudel/tree/main/packages/serial)
- Tone.js `.tone()` (deprecated?) [/tone](https://github.com/tidalcycles/strudel/tree/main/packages/tone)
- WebDirt `.webdirt()` (deprecated?) [/webdirt](https://github.com/tidalcycles/strudel/tree/main/packages/webdirt)
- Speech `.speak()` (experimental) part of [/core](https://github.com/tidalcycles/strudel/tree/main/packages/core)

These could change, so make sure to check the [packages folder](https://github.com/tidalcycles/strudel/tree/main/packages).
