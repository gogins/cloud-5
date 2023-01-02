# Setting Up and Building cloud-music

## Introduction

This repository is a bit of a hack but I have tried to make it as maintainable 
as possible.

The basic idea is to extend Strudel not only with Csound but also with 
CsoundAC, and then make Strudel into an embeddable component that I can use in 
my pieces.

To this end, Strudel is included in this repository as a Git submodule. Before 
building Strudel, this repository adds some code to Strudel. 

 1. csoundac.mjs is a module that creates a number of Patterns in Strudel that 
    use CsoundAC's Chord, Scale, and PITV classes.
    
 2. strudel_embed.js is a script that adds some event handling hooks to the 
    existing Strudel index page, and uses it as an iframe.

### Maintenance note:

Never patch existing Strudel files, add new Strudel files in existing places.

## Setting Up

Run `npm run setup` to perform setup. Examine `package.json` for details. This 
command will initialize all dependencies. If you see warnings or errors, don't 
panic unless you can't cd to `strudel/website/dist`, run `npx serve .`, and get 
a running Strudel REPL.

## Building

Run `npm run build` to produce a usable distribution for a static Web site. 
Examine `package.json` for details. This command will patch Strudel with my 
addons, build everything, and make a distributable copy of the cloud-music 
Web site with all resources statically available.
