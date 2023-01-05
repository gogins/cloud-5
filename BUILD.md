# Setting Up and Building cloud-music

## Introduction

This repository is a bit of a hack, but I have tried to make it as maintainable 
as possible.

The basic idea is to extend Strudel not only with Csound but also with 
CsoundAC, and then make Strudel into an embeddable component that I can use in 
my pieces. This is possible because the Strudel Web site serves a REPL page 
that will run Strudel code from users via an HTTP request, which I can hijack 
for my own purposes.

To this end, Strudel is included in this repository as a Git submodule. But, 
before actually building Strudel, this repository makes the following patches 
to Strudel head:

 1. Add `strudel-addons/csoundac/` to the Strudel tree. This is done 
    automatically by `npm run build-repl`.
 2. Patch `strudel/website/src/Repl.jsx` to import csoundac. There is a Python 
    script that npm will use to make this patch. If this quits working, 
    change the `patch-strudel.py` script as required.
 3. Patch the generated `strudel/website/dist/index.html` file to use relative 
    rather than absolute pathnames for imported assets. This is needed in 
    order to run the Strudel repl from GitHub pages, which are not necessarily 
    at the root of their Web server. There is a Python script that npm will use 
    to make this patch. If this quits working, change the `patch-dist.py` 
    script as required.
    
I have done my best to keep these patches as few and simple as possible.

## Setting Up

Run `npm run setup` to perform setup. Examine `package.json` for details. This 
command will initialize all dependencies. 

## Building

Run `npm run build-repl` and then run `npm run build` to produce a usable 
distribution for a static Web site. Examine `package.json` for details. These  
commands will patch Strudel with my addons, build everything, and make a 
distributable copy of the cloud-music Web site in the `dist` directory, 
with all resources statically available. 

If you see warnings or errors, don't panic unless executing `npm run static` 
doesn't produce a working Web site with playable pieces.

## Maintenance Note!

_If at all possible_, never edit existing Strudel files or add new packages, 
always add _new_ Strudel files in _existing_ Strudel packages. This is to 
keep discrepancies between Strudel and cloud-music to an absolute minimum.


