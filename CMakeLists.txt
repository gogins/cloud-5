cmake_minimum_required(VERSION 3.30)
project(cloud-5)
include(ExternalProject)

find_program(PNPM_EXECUTABLE pnpm)
if(NOT PNPM_EXECUTABLE)
    message(FATAL_ERROR "pnpm not found. Please install pnpm.")
endif()

# Finds if the repository needs to be updated _before_ running the external 
# project.
add_custom_target(csound-wasm-updated 
    VERBATIM
    COMMENT "Finding if csound-wasm sources are outdated..."
    COMMAND git fetch --dry-run 2> csound-wasm-updated.txt
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/csound-wasm-prefix/src/csound-wasm
    )

# Builds CsoundAudioNode and CsoundAC, and copies the targets to the cloud-5 
# root directory.
ExternalProject_Add(csound-wasm
    GIT_REPOSITORY https://github.com/gogins/csound-wasm.git
    GIT_TAG main 
    GIT_SHALLOW 1
    UPDATE_DISCONNECTED 0
    BUILD_IN_SOURCE TRUE
    BUILD_ALWAYS 0 
    CONFIGURE_COMMAND ""
    BUILD_COMMAND bash -c "cd ${CMAKE_SOURCE_DIR}/csound-wasm-prefix/src/csound-wasm && bash ../../build-outdated-csound-wasm.sh ${CMAKE_SOURCE_DIR}"
    INSTALL_COMMAND ""
    )

add_dependencies(csound-wasm csound-wasm-updated)

# Finds if the repository needs to be updated _before_ running the external 
# project.
add_custom_target(csound-node-updated 
    VERBATIM
    COMMENT "Finding if csound-node sources are outdated..."
    COMMAND git fetch --dry-run 2> csound-node-updated.txt
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/csound-node-prefix/src/csound-node
    )

# Builds the Release version of csound.node in the cloud-5 root directory.
ExternalProject_Add(csound-node
    GIT_REPOSITORY https://github.com/gogins/csound-extended-node.git
    GIT_TAG main 
    GIT_SHALLOW 1
    UPDATE_DISCONNECTED 0
    BUILD_IN_SOURCE TRUE
    BUILD_ALWAYS 0
    CONFIGURE_COMMAND ""
    # It seems simpler to check for need to rebuild in the build script iself.
    BUILD_COMMAND bash -c "cd ${CMAKE_SOURCE_DIR}/csound-node-prefix/src/csound-node && bash ../../build-outdated-csound-node.sh ${CMAKE_SOURCE_DIR}"
    INSTALL_COMMAND ""
    )

add_dependencies(csound-node csound-node-updated)

# Patches and builds Strudel in the cloud-5 root directory.
# Note: pnpm manages updating from upstream, patching, 
# and building Strudel.
add_custom_target(strudel
    ALL
    COMMENT "Building Strudel project with pnpm"
    COMMAND bash -c "git submodule update --init --recursive"
    COMMAND ${PNPM_EXECUTABLE} install
    COMMAND ${PNPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    )

add_dependencies(strudel csound-wasm)

# Builds the Visual Studio Code version of the computer music playpen 
# extension and installs it in the cloud-5 root directory.
add_custom_target(vscode-playpen
    COMMENT "Building vscode-playpen"
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/csound-wasm-prefix/src/csound-wasm/dependencies/csound-ac/vscode-playpen
    COMMAND ${PNPM_EXECUTABLE} install -g @vscode/vsce
    COMMAND vsce package
    COMMAND cp playpen*.vsix ${CMAKE_SOURCE_DIR}
    )

