#!/bin/bash
echo "Updating dependencies..."
pwd
cp ~/csound-wasm/dist-wasm/*.js pieces/
cp -rf ~/csound-ac/patches/*.inc pieces/patches/
cp -rf ~/csound-ac/silencio/js/*.js pieces/silencio/js/
cp -rf ~/csound-ac/silencio/css/*.css pieces/silencio/css/
find pieces -ls
