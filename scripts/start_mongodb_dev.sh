#!/bin/bash
mkdir -p ./.db/dev
mkdir -p logs/dev
touch logs/dev/mongod.log

if pgrep mongod; then
    echo "Mongodb already running"
else
    echo "Starting mongodb:"
    mongod --fork --logpath ./logs/dev/mongod.log --dbpath ./.db/dev
fi
