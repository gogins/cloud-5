echo "Current working directory:" ; pwd
CMAKE_SOURCE_DIR=$1
echo "CMAKE_SOURCE_DIR: ${CMAKE_SOURCE_DIR}"
pwd

function rebuild () {
    node-gyp rebuild
    bash -c "cp ${CMAKE_SOURCE_DIR}/csound-node-prefix/src/csound-node/build/Release/csound.node ${CMAKE_SOURCE_DIR}/"
}

if [[ ! -f ${CMAKE_SOURCE_DIR}/csound-node-prefix/src/csound-node/build/Release/csound.node ]]
then
    echo "A target is missing, rebuilding csound-node..."
    rebuild
    exit 
elif [[ ! -z "$REBUILD" ]]
then
    echo "Manually rebuilding csound-node...";
    rebuild
    exit 
elif [[ -s ${CMAKE_SOURCE_DIR}/csound-node-prefix/csound-node-updated.txt ]]
then 
    echo "Sources were outdated, rebuilding csound-node...";
    rebuild
else 
    echo "csound-node sources are up to date.";
    exit 0; 
fi

