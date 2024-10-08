pwd
if [[ ! -s csound-wasm-updated.txt && ! -n "$REBUILD" ]]; then 
    echo "csound-wasm sources are up to date.";
    exit 0; 
else 
    echo "csound-wasm sources were outdated, rebuilding...";
    bash build-prerequisites-wasm.sh;
    bash build-wasm.sh;
fi
