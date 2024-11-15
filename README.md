<p>
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" 
style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
</a>
<p>All music and examples herein are licensed under the  
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

## Computer music in the cloud by [Michael Gogins](https://michaelgogins.tumblr.com)

This is computer music that is hosted online, but actually rendered in Web 
browsers. The pieces are not soundfiles and they are not streamed. Each piece 
is a Web page that contains embedded software that runs in the browser to 
synthesize the music.  Most pieces will play indefinitely. There may or may 
not be animated visuals along with the music. The listener may or may not be 
able to control and/or customize the piece -- perhaps quite a bit, amounting 
to a new piece, co-composed with me.

For more information on most of these pieces, open the piece and view its 
<i><b>About</b></i> tab, or use the browser's inspector to view the underlying 
code.

 - [Scrims](scrims.html), a JavaScript piece that samples an animated WebGL 
   hopalong fractal to obtain notes that are then harmonized using CsoundAC's 
   chord space operations.
 - [Cloud Music No. 1](cloud_music_no_1.html).
 - [Cloud Music No. 2](http://localhost:8000/cloud_music_no_2.html).
 - [Cloud Music No. 3](http://localhost:8000/cloud_music_no_3.html).
 - [Cloud Music No. 4](http://localhost:8000/cloud_music_no_4.html).
 - [Cloud Music No. 6](http://localhost:8000/cloud_music_no_6.html).
 - [Cloud Music No. 8](http://localhost:8000/cloud_music_no_8.html).
 - [Cloud Music No. 9](cloud_music_no_9.html).
 - [Cloud Music No. 14](cloud_music_no_14.html). This one has a button so the 
   user can record a performance and download the resulting soundfile.
 - [2024-ICSC](2024-ICSC.html), prepared for the 2024 International Csound 
   Conference in Vienna. This is the same as Cloud Music No. 14, except that 
   the "Full screen" menu item moves compositional controls onto a 
   second monitor for unobscured visuals.
 - [Cancycle](cancycle.html). Set up to enable live coding.
 - [Polymetric](polymetric.html). 

# [cloud-5](https://github.com/gogins/cloud-5)

The cloud-music pieces are implemented using my cloud-5 system for creating 
computer music that runs in Web browsers. This in turn is based on
<a href="https://github.com/gogins/csound-wasm">my own WebAssembly builds of Csound and CsoundAC</a>.
Some pieces may use third party libraries. The home page of Csound itself 
is <a href="[xx](https://csound.com/)">here</a>.

Code written as part of cloud-5 is licensed under the terms of the same 
license as Csound, the 
[GNU Lesser Public License, version 2.1](https://github.com/csound/csound/blob/master/COPYING). 
Components and libraries used by cloud-5 come under a variety of open source 
licenses; see the links to individual packages for more information.

## Introduction

The cloud-5 system is designed for making sophisticated computer music purely 
in the HTML5 environment. The system is especially suited for pieces that play 
online, for pieces that play indefinitely, for visual music, for algorithmic 
composition, and for live coding.

cloud-5 runs on every system with an audio output that can run a Web server 
and a standards compliant Web browser. That includes _all_ computers 
running macOS, Linux, or Windows, as well as most Android devices. 

For recent changes, see the _[Release Notes](#release-notes)_ at the end of 
this document.

## Getting Started

### Pre-requisites

 - A Web server that will run from a configurable directory in which you can 
   read, edit, and write files. On most systems, the simplest way to get a Web 
   server is to install [Python 3](https://www.python.org/).
   
 - A standards-compliant Web browser (currently, that includes nearly all Web 
   browsers). Should already exist on your system. On Android, install a Web 
   server app such as 
   [Phlox](https://play.google.com/store/apps/details?id=com.phlox.simpleserver).
   
 - A text or code editor for writing your compositions. A simple text editor 
   should already exist on your system. I use 
   [Visual Studio Code](https://code.visualstudio.com/) myself, as it is very 
   powerful and yet easy to customize. On Android, install a text editor such as
   [QuickEdit Pro](https://play.google.com/store/apps/details?id=com.rhmsoft.edit.pro). 

### Installation

There is no installation! Simply download the release, and unzip it into a 
cloud-5 directory.

cloud-5 can be stored on a USB thumb drive, and will run with all functionality 
_from_ the thumb drive. This makes it possible to carry all of your work in 
progress from computer to device to computer.

Or, simply copy the entire cloud-5 directory with all contents to your computer 
or device. Make sure you can execute, read, edit, and write files in your 
cloud-5 directory.

### Configuration

There is no configuration!

Well, actually there might be one thing. You might need to configure your 
local Web server to serve files from your cloud-5 directory.

### Running

 1. Start a local Web server to serve the cloud-5 directory. The easiest way 
    to do this on most systems is to open a terminal, change to your cloud-5 
    directory, and execute `python3 -m http.server`. 

 2. Start your Web browser, and navigate to your cloud-5 Web site (usually 
    just something like `https://localhost:8000`). Some users have problems 
    with Firefox, e.g. with WebMIDI permissions. If you experience this, try 
    the Chrome browser.

 3. You should see this README as a Web page. Click on 
    [cloud_music_no_1.html](cloud_music_no_1.html) and verify that you see 
    animated graphics, and can play and hear the piece.

 4. Some cloud-5 pieces use the dat.gui library to create a popup menu of 
    controls for Csound instruments or other purposes. You can create new 
    presets, and you can get the Web browser to remember the current preset 
    parameters in local storage. If you need to revert to the hard-coded 
    parameters in a piece, clear local storage in the browser settings, or 
    in the browser's debugger.

## Making Music

In cloud-5, musical compositions are written as Web pages, i.e. as .html 
files. 

It's a good idea for each composition to be written as just one .html file. 
It must be in your cloud-5 directory. Any Csound orchestra code, JavaScript 
code, and GLSL shader programs should simply be embedded in the HTML file in, 
e.g., template strings (string literals) in JavaScript code, or included as 
`<script>` or `<textview>` elements.

There are many ways to write compositions, because the capabilities of Csound, 
Strudel, and HTML5 are so vast. Start out by a making a copy of one of the 
examples below, and edit it to suit your own purposes. 

### Tutorial Examples

These are pieces designed to show how to use the new architecture for cloud-5 
based on `cloud-5.js`, a library of resuable Web components that greatly 
simplifies writing cloud music pieces.

- [`cloud5-example-simple.html`](cloud5-example-simple.html): a very simple 
  composition that illustrates my paper on cloud-music. 
  
- [`cloud5-example-score-generator.html`](cloud5-example-score-generator.html): 
  a fixed-length piece with a score generated by CsoundAC, with an animated 
  piano roll display and audio visualization.

- [`cloud5-example-parametric-lindenmayer.html`](cloud5-example-parametric-lindenmayer.html): 
  a fixed-length piece with a score generated by a parametric Lindenmayer 
  system, with an animated piano roll display and audio visualization.

- [`cloud5-example-strudel.html`](cloud5-example-strudel.html): always-on 
  music produced by a Strudel patch, with audio visualization. This piece is 
  live-codeable.

- [`cloud5-example-visual-music.html`](cloud5-example-visual-music.html): 
  always-on visual music produced by a GLSL shader that is sampled and 
  shaped using CsoundAC.

### Other Examples

 - A [minimal example](minimal.html) that just plays an embedded Csound piece.
 
 - A [Csound Player](player.html) that will play, and let you edit, any 
   Csound piece that you paste into the text area.
   
 - [Message from Another Planet](message.html), a Csound piece with a basic 
   HTML user interface.
 
 - [Strudel REPL](strudel_repl.html), exactly the same as the main Strudel Web 
   site.
 
 - [Trichord Space](trichord_space.cloud5.html), an interactive piece that displays 
   Dmitri Tymoczko's chord space for trichords, with the ability to perform, 
   hear, and visualize various operations on the chords in the space.
 
### Components

 - [Csound](https://csound.com/) version 6.18, one of the oldest and most 
   powerful sound programming languages, compiled for WebAssembly to run in 
   Web browers in [csound-wasm](https://github.com/gogins/csound-wasm).
   
 - [CsoundAC](https://github.com/gogins/csound-ac), my C++ library for 
   algorithmic composition with Csound, compiled for WebAssembly to run in 
   Web browsers in [csound-wasm](https://github.com/gogins/csound-wasm), and 
   incorporating my implementation of mathematical theories of chord space and 
   neo-Reimannian operations, and scales and functional harmony, by 
   [Dmitri Tymoczko](http://dmitri.mycpanel.princeton.edu/).
   
 - A collection of predefined Csound instrument definitions by me from 
   [CsoundAC](https://github.com/gogins/csound-ac/tree/master/patches).
 
 - [Strudel](https://strudel.tidalcycles.org/), a JavaScript port of the 
   widely used live coding system [Tidal Cycles](http://tidalcycles.org/), by 
   Alex McLean, Felix Roos, and others. _Note_: cloud-5 makes several 
   necessary patches to the Strudel source code and distribution.
   
 - Of course, a standards-compliant Web browser, which has an awesome set of 
   capabilities, including the most widely used programming language, 
   JavaScript, which can call Csound, CsoundAC, and Strudel.
   
### Capabilities

 - High-resolution, sample-accurate sound synthesis using one of the largest and 
   most capable libraries that exists for synthesis and signal processing, the 
   [Csound opcodes](https://csound.com/docs/manual/index.html).
   
 - Interactive live music coding using the domain-specific, real-time music 
   programming language Strudel; this includes a neat animated piano roll 
   display of currently playing notes in the music.
   
 - Control of Csound from Strudel. This includes both real-time notes 
   generated by Strudel patches for the `csound` and `csoundm` outputs, and 
   real-time control channel values created by Strudel Patterns, including the 
   new `slider` widget.
   
 - MIDI input and output from Csound and Strudel.
 
 - Open Sound Control input and output from Csound and Strudel.
   
 - Several systems for time-frequency analysis/synthesis, from Csound, including 
   Victor Lazzarini's 
   [phase vocoder streaming](https://csound.com/docs/manual/SpectralRealTime.html) 
   (PVS) opcodes.
 
 - Several high-fidelity sample players, from Csound 
   ([Fluidsynth opcodes](https://csound.com/docs/manual/SiggenSample.html#SiggenSampleSF)) 
   and Strudel ([superdough](https://github.com/tidalcycles/strudel/tree/main/packages/superdough)).
 
 - High-resolution, three-dimensional, animated computer graphics using 
   WebGL and/or OpenGL Shader Language (GLSL), from the Web browser.
   
 - All of the staggering panoply of capabilities that are built into every 
   standards-compliant Web browser, see [HTML5 Test](https://html5test.com/).

## Running in the Browser

### Limitations

The major limitation of running in the browser is that csound-5 pieces are 
sandboxed, and can write files only to a temporary filesystem inside the 
sandbox. It is not possible to write directly to the filesystem on the user's 
computer.

However, it _is_ possible to use an audio loopback driver such as 
[BlackHole](https://github.com/ExistentialAudio/BlackHole) to route 
audio produced by cloud-5 to a digital audio workstation that _can_ write 
soundfiles. The maximum resolution of such soundfiles is floating-point 
samples at 48 KHz, significantly higher resolution than the CD format.

To set this up on the Mac, open the Audio MIDI Setup app, click on the `+` at
the bottom, and click on Create Multi-Ouput Device, including both your 
standard audio output and BlackHole. Then, in the Sound settings, select that 
Multi-Output Device as the default output. Finally, in your DAW or recording 
software, select BlackHole as the audio input device.

## Documentation

 - [My paper on the cloud-5 system](cloud-5.pdf).

 - [cloud-5 API reference](jsdocs/index.html).

 - [Strudel documentation](https://strudel.tidalcycles.org/workshop/getting-started).

 - [Csound reference](https://csound.com/docs/manual/index.html).
   
## Extending cloud-5

You can extend the capabilities of cloud-5 in several ways, including:

 - Write user-defined opcodes (UDOs) in Csound that you can `#include` in any 
   Csound orchestra.
   
 - Write a custom JavaScript module that you can use in any .html file.
 
 - Write code in another high-level language and compile it for WebAssembly, 
   so that it will run in any standards-compliant Web browser.

 - Subclass any of cloud-5's custom HTML elements, or create your own.
   
 - Adapt for your musical purposes any other software that can run in a Web 
   browser and be controlled by JavaScript. That covers rather a lot of 
   ground....
   
## Contributing to cloud-5

 - Enter an issue in the cloud-5 GitHub repository: either a bug, or a 
   feature request. It should briefly describe what you are going to 
   contribute.

 - Make your own fork of the cloud-5 repository.
 
 - Make any contributions or changes in your fork.
 
 - Create a pull request in your fork. Reference the issue you have 
   created.
 
 - I will review the pull request, and I will probably merge it if it does not 
   break existing functionality, is in keeping with the general objectives of 
   cloud-5, and builds and runs for me.
 
Avoid introducing new external dependencies as much as possible. Avoid 
introducing new programming languages as much as possible. Do not load 
dependencies from content distribution networks (CDNs); all dependendencies 
used by cloud-5 must be static resources in the cloud-5 directory 
(obviously, Strudel is a big exception, but I want to keep that the only one; 
besides, the build process bundles Strudel into .js files that _are_ 
statically served from the cloud-5 directory).

## Building

Building cloud-5 is not normally necessary, as pieces will run directly from 
the root directory of the system, which is a static Web site. However, if you 
plan to make substantial contributions to, or alterations of, cloud-5, these 
are the instructions for building.

Install [pnpm](https://www.npmjs.com/package/pnpm), which cloud-5 and 
Strudel use rather than npm. On macOS (I don't know about other platforms), 
you may need to specifically install node@18.

To initialize the local repository, obtain dependencies, build a static Web 
site, and run it locally, execute the following commands in the root directory:

```
cmake .
make
```
These commands will patch Strudel with my addons; build everything; and make a 
distributable copy of the cloud-5 Web site in the repository's root directory, 
with all resources statically served. Examine `CMakeLists.txt` and 
`package.json` for details. 

To test your build, run a local Web server and browse a piece such as 
[cloud_music_no_9](http://localhost:8000/cloud_music_no_9.html), which uses 
many facilities of the system.

The build may fail due to failure to build `canvas.node` (not actually used 
here). If that happens, execute `cd cloud-5/strudel/packages/canvas` and 
`node-gyp rebuild`, and try again from `pnpm run build`.

Before updating Strudel from GitHub, make a branch to contain the updates if 
they break cloud-5.

If you see warnings or errors, don't panic unless browsing localhost does not 
open a working Web site with playable pieces! 

It may be necessary to clear the browser cache and application site data to 
see updated pieces.

The `csound-wasm` and `csound-node` targets will rebuild if the upstream Git 
sources are newer than the local sources, or if the targets of the build are 
missing. If you still have problems with one of these targets, completely 
delete the problematic external project source directory, e.g. 
`rm -rf csound-wasm-prefix/src`, delete `CMakeCache.txt`, and rebuild.

_**NOTE WELL**_: The `gogins.github.io` repository is maintained using 
`pnpm run deploy` in _this_ `cloud-5` repository. _DO NOT_ delete any files 
from `gogins.github.io`, although pieces may be added there. In other words, 
`gogins.github.io` can be the same as, or a superset of, `cloud-5`.

## Running in NW.js

It also is possible to run cloud-5 pieces locally in [NW.js](https://nwjs.io/) 
using [csound.node](https://github.com/gogins/csound-extended-node). In this 
case, csound.node provides a native code build of Csound, and such pieces can 
load native code plugins and read and write to the local filesystem.

This involves installing a number of pre-requisites, but the advantages 
include somewhat higher performance from native code Csound, the ability to 
use native plugins (both Csound plugin opcodes and VST3 plugins), and the 
ability to read and write in the local filesystem.

### Installation

 1. Install regular [Csound for desktop computers](https://csound.com/download.html).
 2. Install [pnpm](https://pnpm.io/installation).
 2. Install [csound.node](https://github.com/gogins/csound-extended-node). Note that 
    the API for csound.node is virtually the same as the API for my WebAssembly build 
    of Csound.
 2. Install [NW.js](https://nwjs.io/).

### Configuration and Running

Read about [csound.node](https://github.com/gogins/csound-extended-node) 
and make sure that the application directory for your `csound.node` pieces is the 
`cloud-5` directory, which includes necessary resources.

## Release Notes

### [v1](https://github.com/gogins/cloud-5/releases/tag/v1-beta)

 - Updated Csound, CsoundAC, and Strudel.

 - Edited README.md for clearer build instructions.

 - Added non-chord tones to `csound::Scale` when conforming notes to a  
   Chord of the Scale.
 
- Added [Polymetric](polymetric.html) piece.

### [v1.0beta](https://github.com/gogins/cloud-5/releases/tag/v1-beta)

 - Added cloud-5.js, cloud-5.css, example pieces, and my paper on using 
   cloud-5. These greatly simplify writing cloud music pieces.

 - Various bug fixes ported from CsoundAC's Silencio score, used for the piano 
   roll display.

 - Updated Csound, CsoundAC, and Strudel.

### [v0.2](https://github.com/gogins/cloud-5/commits/v0.2)

 - Added _Record_ and _Pause_ button to _Cloud Music No. 14_, for the user to
 download a soundfile that records the performance using Csound's `fout` 
 opcode.

 - Updated Csound, [csound-wasm](https://github.com/gogins/csound-wasm), 
   and Strudel to current versions.

### [v0.1](https://github.com/gogins/cloud-5/commits/v0.1)

 - Improved user interface and code organization in some pieces, making them 
   more usable as templates for newer pieces.

 - Improved documentation.

 - Updated Csound, [csound-wasm](https://github.com/gogins/csound-wasm), 
   and Strudel to current versions.

 - Pieces in cloud-5, including pieces using Strudel, can now also run locally 
   in [NW.js](https://nwjs.io/) using 
   [csound.node](https://github.com/gogins/csound-extended-node).

### [v0.1beta7](https://github.com/gogins/cloud-5/commits/v0.1beta7)

 - Updated Csound to version 6.19.0.

 - Improved [csound-wasm](https://github.com/gogins/csound-wasm) 
   and the [Cloud Music No. 9](cloud_music_no_9.html) example to support 
   running either in NW.js with native Csound, or in Web browsers with 
   Csound for WebAssembly. This makes it possible to compose pieces 
   using Strudel that use native Csound, VST plugins, access to the local 
   filesystem, and so on.

### [v0.1beta6](https://github.com/gogins/cloud-5/commits/v0.1beta6)

 - Introduced the CsoundAC `track` function, a variant of Strudel's `arrange` 
   that does not crash when the number of cycles for a section is set to zero 
   to silence it.
   
 - Improved the CsoundAC `csoundn` output to send all control parameters 
   with names beginning `gi` or `gk` to Csound as control channel values; 
   these channels must first be set up in the Csound orchestra with the same 
   names.
   
 - Added `cancyle.html`, a piece designed for live performance by doing a 
   modest amount of live coding during play.
   

### [v0.1beta5](https://github.com/gogins/cloud-5/commits/v0.1beta5)

 - Updated Strudel to get the extremely useful `slider`, which can be either 
   discrete or continuous. The `slider` is embedded directly into the Strudel 
   patch.
 
 - Added some code to `csoundn` that sends the value of any Strudel control 
   registered with `createParam` and whose name begins with `gi` or `gk` to 
   Csound as a control channel value. This also means that the new `slider` 
   widget in Strudel can send its value to the Csound control channel.
 
### [v0.1beta4](https://github.com/gogins/cloud-5/commits/v0.1beta4)

 - Attempts have been made to correct the scheduling of the `csoundn` output 
   based on a trigger, and to get `csoundn` to output correct piano roll 
   events.
 
 - Put in diagnostic messages marked `sync` for testing.
 
 - Colorize notes in the piano roll that come from `csoundn`.
 
 - In `package.json` always make a releasable zip file in each build.

### [v0.1beta3](https://github.com/gogins/cloud-5/commits/v0.1beta3)

 - Put in needed patch for `cyclist.mjs`.
 
 - Restored concatenated Strudel controls string in `csoundac.mjs`.

### [v0.1beta2](https://github.com/gogins/cloud-5/commits/v0.1beta2)

 - Improved README.md/index.html.

 - Corrected broken links and incorrect credits in example pieces.

 - Replaced the favicon from Strudel with cloud-5's own favicon.
 
### [v0.1beta](https://github.com/gogins/cloud-5/commits/v0.1beta)

 - This was the initial release.
