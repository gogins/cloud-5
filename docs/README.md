# cloud-music

## Computer music in the cloud by Michael Gogins. 

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
<img alt="Creative Commons License" style="border-width:0" 
src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This 
work is licensed under a <a rel="license" 
href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons 
Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

This is real music. But it is not a streaming recording. It is not performed 
in a concert. These pieces are Web pages that are loaded from my Web server 
and run in your browser -- in _any_ standard Web browser, including mobile 
devices (at least, if they are powerful enough).

Each piece will play indefinitely. There may or may not be animated visuals 
along with the music. The listener may or may not be able to customize the 
piece -- perhaps quite a bit, amounting to a new piece, co-composed with me.

The underlying technology is my WebAssembly build of Csound with CsoundAC. 
Some pieces use third party libraries, especially [Strudel]
(https://github.com/tidalcycles/strudel), a JavaScript port 
of the live coding system [Tidal Cycles](https://tidalcycles.org/).

- [Cloud Music No. 1](cloud_music_no_1.html).

- [Cloud Music No. 2](cloud_music_no_2.html).

- [Cloud Music No. 3](cloud_music_no_3.html).

- [Cloud Music No. 4](cloud_music_no_4.html).

- [Cloud Music No. 5](cloud_music_no_5.html). Also embeds Strudel.

- [Cloud Music No. 6](cloud_music_no_6.html). Also embeds Strudel.

- [Cloud Music No. 7](cloud_music_no_7.html). Also embeds Strudel.

## cloud-music as a Studio and/or Development Environment

I have designed this repository not only to present some of my compositions, 
but also to serve as a development environment/computer music studio for 
working with Csound, algorithmic composition, and live coding in a 
_completely platform-independent way_.

All software used here is JavaScript, WebAssembly, or HTML. All third party 
dependencies are contained in this repository as static files.

To use cloud-music, fork cloud-music on GitHub and clone your fork on your 
own computer. You can also download the latest cloud-music release as a zip 
file and unzip it on your computer.

This is actually the easiest way to install a usable version of Csound on your 
computer.

### Writing New Compositions

There is no need to build or configure anything. In a terminal, simply change 
to your cloud-music directory and run `python3 -m http.server`. Then you can 
use your Web browser to go to http://localhost:8000. You can view and run any 
of these compositions in your browser.

To create a new composition, simply create a new HTML file. You can copy one 
of my existing pieces as a template and modify it, or you can create a new HTML 
file from scratch.

### Writing New Software

Because algorithmic compositions are generally also software, the line between 
compositions and other software can become blurred. However, it is often the 
case that a composer will write new software as libraries or other resources 
to support a number of their musical compositions.

To develop this kind of software in your fork of cloud-music, keep in mind 
that the cloud-music project uses [npm](https://www.npmjs.com/ )and [vite]
(https://vitejs.dev/), which of course must first be installed. 

You will generally want to write your new software as JavaScript or TypeScript 
in a subdirectory of the `/node_modules` directory, as a regular npm module. 
You should import your new module in the `cloud-music/main.js` file.

If you do that, then `npm run build` should roll your contributions up with 
the rest of the project into the `dist` directory.

Then `npm run dev` will run a debuggable session, and `npm run preview` will 
run a production-style session from the `dist` directory.



