#!/bin/bash
mkdir -p ./.db/test
mkdir -p logs/test
touch logs/test/mongod.log

if pgrep mongod; then
    echo "Mongodb already running"
else
    echo "Starting mongodb:"
    mongod --fork --logpath ./logs/test/mongod.log --dbpath ./.db/test
fi
