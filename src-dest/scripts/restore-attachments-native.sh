#!/bin/sh

# working dir fix
SCRIPT_FOLDER=$(cd $(dirname "$0"); pwd)
cd $SCRIPT_FOLDER/..

BACKUP_DIR=$(echo $1 | sed 's:/*$::')
BACKUP_DIR="${BACKUP_DIR}/"

export VAR_PRYV_FOLDER=$SCRIPT_FOLDER/../var-pryv
rsync --recursive --times --human-readable --verbose --perms $BACKUP_DIR ${VAR_PRYV_FOLDER}/attachment-files/