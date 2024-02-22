# cloud-music

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" 
style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
</a><br />This work is licensed under a 
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

## Computer music in the cloud by Michael Gogins 

This is real music. Each piece will play indefinitely in any standard Web 
browser. There may or may not be animated visuals along with the music. The 
listener may or may not be able to customize the piece -- perhaps quite a bit, 
amounting to a new piece, co-composed with me.

All source code for these pieces is available in the GitHub repository.

The underlying technology is my 
<a href="https://github.com/gogins/csound-wasm">own WebAssembly builds of Csound and CsoundAC</a>.
Some pieces may use third party libraries. The home page of Csound itself 
is <a href="[xx](https://csound.com/)">here</a>.

## Installation

This repository is a bit of a hack, but I have tried to make it as 
maintainable as possible.

The basic idea is to extend Strudel not only with Csound, but also with 
CsoundAC, and then to make Strudel into an embeddable component that I can use 
in my pieces. This is possible because the Strudel Web site serves a REPL page 
that will run Strudel code from users via an HTTP request, which I can hijack 
for my own purposes.

To this end, Strudel is included in this repository as a Git submodule. But, 
before actually building Strudel, this repository makes the following patches 
to Strudel head:

 1. Make some minor patches to the Strudel source code. There is a Python 
    script that npm will use to make these patches. If this quits working, 
    change the `patch-strudel.py` script as required.
 2. Patch the generated `strudel/website/dist/index.html` file to use relative 
    rather than absolute pathnames for imported assets. This is needed in 
    order to run the Strudel REPL from GitHub pages, which are not necessarily 
    at the root of their Web server. There is a Python script that npm will 
    use to make this patch. If this quits working, change the `patch-dist.py` 
    script as required.
    
I have done my best to keep these patches as few and simple as possible.

## Building

Install [pnpm](https://www.npmjs.com/package/pnpm), which cloud-music and 
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
distributable copy of the cloud-music Web site in the `dist` directory, with 
all resources statically available; and run a local Web site, which is source 
level debuggable, in that directory. Examine `package.json` for details. 

This may fail due to failure to build `canvas.node` (not actually used here). 
If that happens, execute `ccd loud-music/strudel/packages/canvas` and 
`node-gyp rebuild`, and try again from `pnpm run build`.

Before updating strudel from GitHub, make a branch to contain the updates if 
they break cloud-music.

If you see warnings or errors, don't panic unless browsing localhost does not 
open a working Web site with playable pieces! 

It may be necessary to clear the browser cache and application site data to 
see updated pieces.

## Debugging Hints

The JavaScript `debugging;` command will break in the debugger at that line.

Be sure to enable JavaScript source maps in the debugger settings. That won't 
necessarily work for Strudel sources; load their source maps manually e.g. by
opening a deployed (usually minified) source file in the debugger, then right-
clicking on the code, and selecting "Add source map..." from the context menu.
Oops, that should work, but I don't actually _find_ the source maps....

## Deployment

Build this project, then copy the entire contents of the `dist` directory 
to your own Web site's public HTML directory.

_**NOTE WELL**_: The `gogins.github.io` repository is maintained using 
`pnpm run deploy` in the `cloud-5` repository. _DO NOT_ delete any files from  
`gogins.github.io`, although pieces may be added there. In other words, 
`gogins.github.io` can be a superset of `cloud-5`.

## Maintenance Notes!

_If at all possible_, never edit _existing_ Strudel files, always add _new_ 
Strudel files. This is to keep conflicts between Strudel and cloud-music 
to an absolute minimum.

Track the version of [Csound for WebAssembly]
(https://github.com/gogins/csound-wasm) and update the files if a new version 
becomes available.

## Extending Strudel

For cloud-music pieces that use Strudel's REPL, it is possible to add new 
user-defined Patterns and perhaps other functions to Strudel _without 
rebuilding Strudel_.

1. Write a static `MyModule.mjs` module in the Web root (the `docs` 
   directory).
2. Do _not_ import anything that will already have been imported by the 
   Strudel REPL itself -- which is essentially all of Strudel.
3. Call Strudel's `register` function to integrate any new Patterns into 
   Strudel.
4. Don't forget, any Strudel piece that uses MyModule has to 
  `import('/MyModule.mjs');` first thing!
   
The `csoundac.mjs` module is an example of such a plugin.







