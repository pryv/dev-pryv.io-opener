#!/bin/sh

# working dir
PARENT_DIR=$(pwd)

# build backup directory
BACKUP_DIR=$(echo $1 | sed 's:/*$::')
BACKUP_DIR="$BACKUP_DIR/"

SCRIPT_FOLDER=$(cd $(dirname "$0"); pwd)
cd $SCRIPT_FOLDER/..

export VAR_PRYV_FOLDER=$PARENT_DIR/var-pryv

rsync --recursive --times --human-readable --verbose --perms $BACKUP_DIR ${VAR_PRYV_FOLDER}/attachment-files/

