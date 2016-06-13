#!/bin/bash

# Copy Cesium
rm -rf public && mkdir public
cp -r ./src/lib/cesium/* ./public


rm -rf ./src/styles/lib && mkdir ./src/styles/lib
cp ./node_modules/flexboxgrid/dist/flexboxgrid.min.css ./src/styles/lib/
