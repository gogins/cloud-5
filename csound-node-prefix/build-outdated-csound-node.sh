pwd
if [ ! -s csound-node-updated.txt ]; then 
    echo "csound-node sources are up to date.";
    exit 0; 
else 
    echo "csound-node sources were outdated, rebuilding...";
    node-gyp rebuild; 
fi
