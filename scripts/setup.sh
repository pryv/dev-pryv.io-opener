#!/bin/sh

set -e

# working dir fix
scriptsFolder=$(cd $(dirname "$0"); pwd)
rootFolder=$scriptsFolder/..
cd $rootFolder

# Fetch git dependencies
git submodule update --init --recursive && git submodule foreach git pull origin master

# Install node dependencies
yarn

cd $rootFolder

if [ -d dest ] && [ ! -d dest/.git ]
then
  echo "
  Conflict with previous unpublished build, cleaning 'dest' folder."
  rm -rf dest/
fi

if [ ! -d dest ]
then
  echo "
Setting up 'dest' folder for publishing to release repository
"
  git clone git@github.com:pryv/open-pryv.io.git dest
fi

echo "
Setup is complete, you can proceed with building and publishing.
"