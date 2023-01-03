# Setting Up and Building cloud-music

## Introduction

This repository is a bit of a hack but I have tried to make it as maintainable 
as possible.

The basic idea is to extend Strudel not only with Csound but also with 
CsoundAC, and then make Strudel into an embeddable component that I can use in 
my pieces.

To this end, Strudel is included in this repository as a Git submodule. But,  
before actually building Strudel, this repository adds some of my own code to 
Strudel. 

 1. csoundac.mjs is a module that creates a number of Patterns in Strudel that 
    use CsoundAC's Chord, Scale, and PITV classes.
    
 2. strudel_embed.js is a script that adds some event handling hooks to the 
    existing Strudel REPL page, and uses it as an iframe component in 
    cloud-music pieces.

### Maintenance Note!

Never edit existing Strudel files or add new packages, always add _new_ Strudel 
files in _existing_ Strudel packages.

## Setting Up

Run `npm run setup` to perform setup. Examine `package.json` for details. This 
command will initialize all dependencies. 

## Building

Run `npm run build-repl` and then run `npm run build` to produce a usable 
distribution for a static Web site. Examine `package.json` for details. This 
command will patch Strudel with my addons, build everything, and make a 
distributable copy of the cloud-music Web site with all resources statically 
available. 

If you see warnings or errors, don't panic unless executing `npm run static` 
doesn't produce a working Web site with playable pieces.

### Patches to Strudel

To date, changes worked upon Strudel head are minimal:

 1. Added `strudel-addons/csoundac/` to the Strudel tree. It will build 
    automatically using `npm run build-repl`.
 2. Patched `strudel/website/src/Repl.jsx` to import csoundac. There is a patched 
    copy in `strudel-addons/website/src`, and `npm run build-repl` will use this
    automatically. If this quits working, replace `Repl.jsx` from 
    Strudel head and change:
```
const modules = [
  import('@strudel.cycles/core'),
  import('@strudel.cycles/tonal'),
  import('@strudel.cycles/mini'),
  import('@strudel.cycles/midi'),
  import('@strudel.cycles/xen'),
  import('@strudel.cycles/webaudio'),
  import('@strudel.cycles/osc'),
  import('@strudel.cycles/serial'),
  import('@strudel.cycles/soundfonts'),
  import('@strudel.cycles/csound'),
];
```
    to:
```
const modules = [
  import('@strudel.cycles/core'),
  import('@strudel.cycles/tonal'),
  import('@strudel.cycles/mini'),
  import('@strudel.cycles/midi'),
  import('@strudel.cycles/xen'),
  import('@strudel.cycles/webaudio'),
  import('@strudel.cycles/osc'),
  import('@strudel.cycles/serial'),
  import('@strudel.cycles/soundfonts'),
  import('@strudel.cycles/csound'),
  import('@strudel.cycles/csoundac'),
];
```
