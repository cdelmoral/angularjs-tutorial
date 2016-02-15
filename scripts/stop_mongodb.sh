#!/bin/bash
kill $(ps -e | grep mongod | awk '{print $1}')