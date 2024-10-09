echo "Current working directory:" ; pwd
CMAKE_SOURCE_DIR=$1
echo "CMAKE_SOURCE_DIR: ${CMAKE_SOURCE_DIR}"

function rebuild () {
    bash build-prerequisites-wasm.sh;
    bash build-wasm.sh;
    bash cp ${CMAKE_SOURCE_DIR}/csound-wasm-prefix/src/csound-wasm/dist-wasm/Csound*.js ${CMAKE_SOURCE_DIR}/
}

if [[ ! -f dist-wasm/CsoundAudioProcessor.js ]]
then
    echo "A target is missing, rebuilding csound-wasm..."
    rebuild
    exit 
elif [[ ! -z "$REBUILD" ]]
then
    echo "Manually rebuilding csound-wasm...";
    rebuild
    exit 
elif [[ -s ${CMAKE_SOURCE_DIR}/csound-wasm-prefix/csound-wasm-updated.txt ]]
then 
    echo "Sources were outdated, rebuilding csound-wasm...";
    rebuild
else 
    echo "csound-wasm sources are up to date.";
    exit 0; 
fi
