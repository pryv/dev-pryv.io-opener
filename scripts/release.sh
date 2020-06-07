#!/bin/sh

set -e

# working dir fix
scriptsFolder=$(cd $(dirname "$0"); pwd)
rootFolder=$scriptsFolder/..
cd $rootFolder

rsync --delete -av dest/ release/ --exclude test --exclude .git