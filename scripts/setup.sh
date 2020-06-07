#!/bin/sh

set -e

# working dir fix
scriptsFolder=$(cd $(dirname "$0"); pwd)
rootFolder=$scriptsFolder/..
cd $rootFolder

# Fetch git dependencies
git submodule init && git submodule update

# Install node dependencies
yarn

# Install node dependencies for licenser
cd $rootFolder/licenser
yarn

cd $rootFolder

if [ -d dest ] && [ ! -d dest/.git ]
then
  echo "
  Conflict with previous unpublished build, cleaning 'dist' folder."
  # when we are sure of what we do, we can uncomment the line below
  #rm -rf dest/
fi

if [ ! -d dest ]
then
  echo "
Setting up 'dest' folder for publishing to release repository
"
  git clone git@github.com:pryv/pryv.io-open-source.git dest
fi

echo "
Setup is complete, you can proceed with building and publishing.
"