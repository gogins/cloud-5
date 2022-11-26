#!/bin/bash
echo "Updating csound-wasm and other JavaScript dependencies..."

cp ~/csound-wasm/dist-wasm/CsoundAC.js .
cp ~/csound-wasm/dist-wasm/CsoundAudioNode.js .
cp ~/csound-wasm/dist-wasm/CsoundAudioProcessor.js .
cp ~/csound-wasm/dist-wasm/csound_loader.js .

cp ~/csound-wasm/dist-wasm/silencio/js/TrackballControls.js .
cp ~/csound-wasm/dist-wasm/silencio/js/dat.gui.js .
cp ~/csound-wasm/dist-wasm/silencio/js/sprintf.js .
cp ~/csound-wasm/dist-wasm/silencio/js/three.js .
cp ~/csound-wasm/dist-wasm/silencio/js/tinycolor.js .

cp -rf ~/strudel/out/* .

ls -ll *.js
