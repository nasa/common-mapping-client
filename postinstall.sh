#!/bin/bash

# Copy Cesium
rm -rf public && mkdir public
cp -r ./node_modules/cesium/Build/Cesium/* ./src/lib/cesium/
cp -r ./src/lib/cesium/* ./public

# Copy Cesium-drawhelper
cp -r ./src/lib/cesium-drawhelper-master ./public

# Remove styles lib
rm -rf ./src/styles/lib && mkdir ./src/styles/lib

# Copy flexbox
mkdir ./src/styles/lib/flexboxgrid/
cp ./node_modules/flexboxgrid/dist/flexboxgrid.min.css ./src/styles/lib/flexboxgrid/

# Copy normalize.css
mkdir ./src/styles/lib/normalize/
cp ./node_modules/normalize.css/normalize.css ./src/styles/lib/normalize/

# Copy mapskin
mkdir ./src/styles/lib/mapskin/
cp -r ./src/lib/mapskin ./src/styles/lib/

# Copy mapskin into public
cp -r ./src/lib/mapskin ./public
