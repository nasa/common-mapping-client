#!/bin/bash

# Copy default data
cp -r ./src/default-data ./dist

# Copy public assets
cp -r ./assets/* ./dist

# Copy over config
cp ./src/config.js ./dist