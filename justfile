# add node bin script path for recipes
export PATH := "./node_modules/.bin:" + env_var('PATH')

# Default: display available recipes
_help:
    @just --list --unsorted

# –––––––––––––----------------------------------------------------------------
# Setup
# –––––––––––––----------------------------------------------------------------

# Set up the dev environment to make it ready for building
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
    echo "✓ 'dest/' folder is ready for building!"
    echo ""

# –––––––––––––----------------------------------------------------------------
# Build
# –––––––––––––----------------------------------------------------------------

# Build to `dest/` and apply licensing info
build *params:
    node src/index.js
    source-licenser --config-file .licenser.yml ./dest

# Apply licensing info to `src-dest/`
license-src:
    source-licenser --config-file .licenser.yml ./src-dest

# –––––––––––––----------------------------------------------------------------
# Misc. utils
# –––––––––––––----------------------------------------------------------------

# Run code linting
lint *params:
    semistandard {{params}}
