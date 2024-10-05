cmake_minimum_required(VERSION 3.30)
project(cloud-5)
include(ExternalProject)

# Builds CsoundAudioNode and CsoundAC, and copies the targets to the cloud-5 
# root directory.
ExternalProject_Add(csound-wasm
    GIT_REPOSITORY https://github.com/gogins/csound-wasm.git
    GIT_TAG main 
    BUILD_IN_SOURCE TRUE
    BUILD_ALWAYS FALSE
    CONFIGURE_COMMAND ""
    BUILD_COMMAND bash -c "cd ${CMAKE_SOURCE_DIR}/csound-wasm-prefix/src/csound-wasm && bash build-prerequisites-wasm.sh && bash build-wasm.sh"
    INSTALL_COMMAND "bash -c "cp ${CMAKE_SOURCE_DIR}/csound-wasm-prefix/src/csound-wasm/dist-wasm/Csound*.js ${CMAKE_SOURCE_DIR}/"
)

# Builds the Release version of csound.node in the cloud-5 root directory.
ExternalProject_Add(csound-node
    GIT_REPOSITORY https://github.com/gogins/csound-extended-node.git
    GIT_TAG main 
    BUILD_IN_SOURCE TRUE
    BUILD_ALWAYS FALSE
    CONFIGURE_COMMAND ""
    BUILD_COMMAND bash -c "cd ${CMAKE_SOURCE_DIR}/csound-node-prefix/src/csound-node && node-gyp rebuild"
    INSTALL_COMMAND bash -c "cp ${CMAKE_SOURCE_DIR}/csound-node-prefix/src/csound-node/build/Release/csound.node ${CMAKE_SOURCE_DIR}/"
)

# TODO: The Strudel build step.


