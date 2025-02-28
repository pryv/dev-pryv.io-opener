# add node bin script path for recipes
export PATH := "./node_modules/.bin:" + env_var('PATH')

# Default: display available recipes
_help:
    @just --list --unsorted

# –––––––––––––----------------------------------------------------------------
# Setup
# –––––––––––––----------------------------------------------------------------

# Set up or update the dev environment for building
setup: update-repos install prepare-dest

# Update source git repos (submodules)
update-repos:
    git submodule update --init --recursive
    git submodule foreach git pull origin master

# Install node modules
install *params:
    npm install {{params}}

# Prepare `dest/` folder for building
prepare-dest:
    #!/bin/sh
    set -e
    if [ -d dest ] && [ ! -d dest/.git ]
    then
        echo ""
        echo "· 'dest/' folder corrupted (not a git repo), deleting..."
        echo ""
        rm -rf dest/
    fi
    if [ ! -d dest ]
    then
        TARGET_REPO=pryv/open-pryv.io
        echo ""
        echo "· Setting up 'dest/' as clone of target repository (${TARGET_REPO})..."
        echo ""
        git clone git@github.com:${TARGET_REPO}.git dest
    fi
    echo ""
    echo "· Cleaning 'dest/' folder contents..."
    echo ""
    rm -rf dest/*
    echo ""
    echo "✓ 'dest/' folder is ready for building."
    echo ""

# –––––––––––––----------------------------------------------------------------
# Build
# –––––––––––––----------------------------------------------------------------

# Build to `dest/`, apply licensing info and rebuild package-lock
build *params:
    node build/index.js
    rm dest/package-lock.json
    just license-build
    cd dest/; npm install --package-lock-only

# Build to `dest/`, without removing package-lock (use with care)
build-dirty *params:
    node build/index.js
    just license-build

# –––––––––––––----------------------------------------------------------------
# Misc. utils
# –––––––––––––----------------------------------------------------------------

# Run code linting
lint *params:
    semistandard {{params}}

# Apply licensing info to `build/`
license-build:
   source-licenser --config-file dest/.licenser.yml ./dest

# Apply licensing to repo
license: 
   source-licenser --config-file .licenser.yml ./