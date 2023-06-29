# cloud-music

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" 
style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
</a><br />This work is licensed under a 
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

Music in the cloud by Michael Gogins. 

This is real music. Each piece will play indefinitely in any standard Web 
browser. There may or may not be animated visuals along with the music. The 
listener may or may not be able to customize the piece -- perhaps quite a bit, 
amounting to a new piece, co-composed with me.

All source code for these pieces is available in the GitHub repository.

The underlying technology is my WebAssembly builds of Csound and CsoundAC. 
Some pieces may use third party libraries.

# Installation

This repository is a bit of a hack, but I have tried to make it as maintainable 
as possible.

The basic idea is to extend Strudel not only with Csound, but also with 
CsoundAC, and then to make Strudel into an embeddable component that I can use 
in my pieces. This is possible because the Strudel Web site serves a REPL page 
that will run Strudel code from users via an HTTP request, which I can hijack 
for my own purposes.

To this end, Strudel is included in this repository as a Git submodule. But, 
before actually building Strudel, this repository makes the following patches 
to Strudel head:

 1. Add `strudel-addons/csoundac/` to the Strudel tree. This is done 
    automatically by `pnpm run build-repl`.
 2. Patch `strudel/website/package.json` and `strudel/website/src/Repl.jsx` to 
    import csoundac. There is a Python script that npm will use to make this 
    patch. If this quits working, change the `patch-strudel.py` script as 
    required.
 3. Patch the generated `strudel/website/dist/index.html` file to use relative 
    rather than absolute pathnames for imported assets. This is needed in 
    order to run the Strudel repl from GitHub pages, which are not necessarily 
    at the root of their Web server. There is a Python script that npm will use 
    to make this patch. If this quits working, change the `patch-dist.py` 
    script as required.
    
I have done my best to keep these patches as few and simple as possible.

## Building

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

If you see warnings or errors, don't panic unless browsing localhost does not 
open a working Web site with playable pieces! 

It may be necessary to clear the browser cache to see the site.

## Maintenance Notes!

_If at all possible_, never edit _existing_ Strudel files, always add _new_ 
Strudel files. This is to keep discrepancies between Strudel and cloud-music 
to an absolute minimum.

Track the version of Csound for WebAssembly and update the files if a new 
version becomes available.

## Extending Strudel

For pieces that use Strudel's REPL, it is possible to add new user-defined 
Patterns and perhaps other functions to Strudel without rebuilding Strudel.

1. Write a static `MyModule.mjs` file in the Web root (the `docs` directory).
2. Do not import anything that will already have been imported by the Strudel 
   REPL itself.
3. Call Strudel's `register` function to integrate any new Patterns into 
   Strudel.
4. Don't forget, your Strudel patch has to `import'(MyModule.mjs');`






