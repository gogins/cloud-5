# cloud-5
#### An HTML5-based computer music system with Csound, CsoundAC, and Strudel by [Michael Gogins](https://michaelgogins.tumblr.com). 

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" 
style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
</a><br />Musical examples herein are licensed under a <a rel="license" 
href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>. 

Code written as part of cloud-5 is licensed under the terms of the same 
license as Csound, the 
[GNU Lesser Public License, version 2.1](https://github.com/csound/csound/blob/master/COPYING). 
Components and libraries used by cloud-5 come under a variety of open source 
licenses; see the links to individual packages for more information.

## Introduction

Welcome to cloud-5, a system for making sophisticated computer music purely in 
the HTML5 environment! The system is especially suited for pieces that run 
online, for pieces that play indefinitely, for visual music, for algorithmic 
composition, and for live coding.

cloud-5 runs on every system with an audio output that can run a Web server, 
and a standards compliant Web browser. That includes _all_ computers 
running macOS, Linux, or Windows, as well as most Android devices. It is also 
possible to run cloud-5 on single-board computers (SBCs) such as [Bela](https://bela.io/), 
[Norns](https://monome.org/docs/norns/), [BeagleBoards](https://www.beagleboard.org/), 
[Raspberry Pi](https://www.raspberrypi.com/), and others. However, running 
cloud-5 on a SBC requires installing at least a Web server (and probably also 
a Web browser) on the device. Most users without special need for a SBC (such 
as an installation or kiosk) will be better off just using a personal 
computer.

cloud-5 is used by my own Web site of "always-on" computer music pieces, 
[cloud-music](https://gogins.github.io/).

For recent changes, see the _[Release Notes](#release-notes)_ at the end of 
this document.

### Components

 - [Csound](https://csound.com/) version 6.18, one of the oldest and most 
   powerful sound programming languages, compiled for WebAssembly to run in 
   Web browers in [csound-wasm](https://github.com/gogins/csound-wasm).
   
 - [CsoundAC](https://github.com/gogins/csound-ac), my C++ library for 
   algorithmic composition with Csound, 
   compiled for WebAssembly to run in Web browsers in 
   [csound-wasm](https://github.com/gogins/csound-wasm), and incorporating 
   my implementation of mathematical theories of chord space and 
   neo-Reimannian operations, and scales and functional harmony, by 
   [Dmitri Tymoczko](http://dmitri.mycpanel.princeton.edu/).
   
 - A collection of predefined Csound instrument definitions by me from 
   [CsoundAC](https://github.com/gogins/csound-ac/tree/master/patches).
 
 - [Strudel](https://strudel.tidalcycles.org/), a JavaScript port of the 
   widely used live coding system [Tidal Cycles](http://tidalcycles.org/), by 
   Alex McLean, Felix Roos, and others.
   
 - Of course, a standards-compliant Web browser, which has an awesome set of 
   capabilities, including the most widely used programming language, 
   JavaScript, which can call Csound, CsoundAC, and Strudel.
   
### Capabilities

 - High-resolution, sample-accurate sound synthesis using one of the largest and 
   most capable libraries that exists for synthesis and signal processing, the 
   [Csound opcodes](https://csound.com/docs/manual/index.html).
   
 - Interactive live music coding using the domain-specific, real-time music 
   programming language Strudel; this includes a neat animated piano roll display 
   of the notes from the music that is playing.
   
 - Control of Csound from Strudel.
   
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
 
### Limitations

The major limitation of cloud-5 is that, because it runs only in Web browsers, 
it is sandboxed and cannot write to the file system. In other words, cloud-5 
cannot write soundfiles, or any other kind of files. That means all audio is 
streaming audio. 

However, it _is_ possible to use an audio loopback driver such as 
[BlackHole](https://github.com/ExistentialAudio/BlackHole) to route 
audio produced by cloud-5 to a digital audio workstation that _can_ write 
soundfiles. The maximum resolution of such soundfiles is floating-point 
samples at 48 KHz, significantly higher resolution than the CD format.

## Getting Started

### Pre-requisites

 - A Web server that will run from a configurable directory in which you can 
   read, edit, and write files. On most systems, the simplest way to get a Web 
   server is to install [Python](https://www.python.org/).
   
 - A standards-compliant Web browser (currently, that includes nearly all Web 
   browsers). Should already exist on your system. On Android, install a Web 
   server app such as 
   [Phlox](https://play.google.com/store/apps/details?id=com.phlox.simpleserver).
   
 - A text or code editor for writing your compositions. A simple text editor 
   should already exist on your system. I use 
   [SciTE](https://scintilla.org/SciTE.html) myself as it is very 
   lightweight and yet very easy to customize. On Android, install 
   a text editor such as
   [QuickEdit Pro](https://play.google.com/store/apps/details?id=com.rhmsoft.edit.pro). 
   
 - Of course, an audio driver that will play audio from Web browsers! Should 
   already be part of your operating system.

### Installation

There is no installation!

cloud-5 can be stored on a USB thumb drive and will run with all functionality 
from the thumb drive. This makes it possible to carry all of your work in 
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

## Making Music

In cloud-5, musical compositions are written as Web pages, i.e. as .html 
files. 

It's a good idea for each composition to be written as just one .html file. 
It must be in your cloud-5 directory. Any Csound orchestra code, JavaScript 
code, and GLSL shader programs should simply be embedded in the HTML file in, 
e.g., template strings (string literals) in JavaScript code, or included as 
`<script>` elements.

There are many ways to write compositions, because the capabilities of 
Csound, Strudel, and HTML5 are so vast. Start out by a making a copy of one of 
the examples below, and edit it to suit your own purposes. The examples start 
out simple, and get more and more complicated and capable.

 - A [minimal example](minimal.html) that just plays an embedded Csound piece.
 
 - A [Csound Player](player.html) that will play, and let you edit, any 
   Csound piece that you paste into the text area.
   
 - [Message from Another Planet](message.html), a Csound piece with a basic 
   HTML user interface.
 
 - [Strudel REPL](strudel_repl.html), exactly the same as the main Strudel Web 
   site.
 
 - [Trichord Space](trichord_space.html), an interactive piece that displays 
   Dmitri Tymoczko's chord space for trichords, with the ability to perform, 
   hear, and visualize various operations on the chords in the space.
 
 - [Scrims](scrims.html), a JavaScript piece that samples an animated WebGL 
   hopalong fractal to obtain notes that are then harmonized using CsoundAC's 
   chord space operations.
   
 - [Cloud Music No. 1](cloud_music_no_1.html), a piece that generates an 
   abstract flowing visual using a GLSL shader. Data from the moving image 
   is sampled to obtain musical notes, which are then harmonized using 
   chords, scales, and modulations generated by CsoundAC, and rendered as 
   audio using Csound.
   
 - [Cloud Music No. 9](cloud_music_no_9.html), a Strudel piece in an 
   alternative tuning system that uses Csound for synthesis, with a music 
   visualization written in GLSL. There is an embedded Strudel REPL that 
   allows the user to live code the piece, while showing an animated piano 
   roll display of the generated notes.
   
## Extending cloud-5

You can extend the capabilities of cloud-5 in several ways, including:

 - Write user-defined opcodes (UDOs) in Csound that you can `#include` in any 
   Csound orchestra.
   
 - Write a custom JavaScript module that you can use in any .html file.
 
 - Write code in another high-level language and compile it for WebAssembly, 
   so that it will run in any standards-compliant Web browser.
   
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

Install [pnpm](https://www.npmjs.com/package/pnpm), which cloud-5 and 
Strudel use rather than npm. On macOS (I don't know about other platforms), 
you may need to specifically install node@18.

To initialize the local repository, obtain dependencies, build a static Web 
site, and run it locally, execute the following commands:

```
pnpm install
pnpm run setup
pnpm run build
pnpm run debug
```
These commands will patch Strudel with my addons; build everything; make a 
distributable copy of the cloud-5 Web site in the `cloud-5` directory, with 
all resources statically available; and run a local Web site, which is source 
level debuggable, in that directory. Examine `package.json` for details. 

This may fail due to failure to build `canvas.node` (not actually used here). 
If that happens, execute `cd cloud-5/strudel/packages/canvas` and 
`node-gyp rebuild`, and try again from `pnpm run build`.

Before updating Strudel from GitHub, make a branch to contain the updates if 
they break cloud-5.

If you see warnings or errors, don't panic unless browsing localhost does not 
open a working Web site with playable pieces! 

It may be necessary to clear the browser cache and application site data to 
see updated pieces.

## Release Notes

### [v0.1beta2](https://github.com/gogins/cloud-5/commits/v0.1beta2)

 - Improved README.md/index.html.

 - Corrected broken links and incorrect credits in example pieces.

 - Replaced the favicon from Strudel with cloud-5's own favicon.
 
### [v0.1beta](https://github.com/gogins/cloud-5/commits/v0.1beta)

 - This was the initial release.
 
 
   
















