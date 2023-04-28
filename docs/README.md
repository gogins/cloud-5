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
I have now extended CsoundAC with the JavaScript `cycler.js` class, which 
adds indefinite, "always-on" performance to CsoundAC, with facilities for 
sequencing, stacking, and nesting loops, documented <a href="out/index.html">
here</a>.

- [Cloud Music No. 1](cloud_music_no_1.html).

- [Cloud Music No. 2](cloud_music_no_2.html).

- [Cloud Music No. 3](cloud_music_no_3.html).

- [Cloud Music No. 4](cloud_music_no_4.html).

## cloud-music as a Studio and/or Development Environment

I have designed this repository not only to present some of my compositions, 
but also to serve as a development environment/computer music studio for 
working with Csound, algorithmic composition, and live coding in a 
_completely platform-independent way_.

All software used here is JavaScript, WebAssembly, or HTML. All third party 
dependencies are contained in this repository as static files.

To use cloud-music, fork cloud-music on GitHub and clone your fork on your 
own computer. You can also just download the latest cloud-music release as a 
zip file and unzip it on your computer.

_This is actually the easiest way to install a usable version of Csound on your 
computer._

To run cloud-music pieces, there is no need to build or configure anything. In 
a terminal, simply change to your `cloud-music directory/docs` and run 
`python3 -m http.server`. Then you can use your Web browser to go to 
`http://localhost:8000`, where you can view and run any of these compositions 
in your browser.

### Writing New Compositions

To create a new composition, simply create a new HTML file. You can copy one 
of my existing pieces as a template and modify it, or you can create a new HTML 
file from scratch.

Although cloud-music renders audio only in real time, it is easy to use an 
audio loopback driver to route audio from the system output to an audio 
recorder and save the recording as a soundfile. On my MacBook Pro, I have been 
able to use [BlackHole](https://github.com/ExistentialAudio/BlackHole) to 
route audio from cloud-music pices to [Audacity](https://www.audacityteam.org/).

### Writing New Software

The line between writing new compositions and writing new software can be hard 
to define.

To write new software in a fork of cloud-music, the best approach is probably 
to avoid npm and simply write all software as new JavaScript files that will be 
statically served in the `docs` directory.



