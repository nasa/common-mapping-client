#!/bin/bash

# Remove and re-add public folder
rm -rf public && mkdir public

# Copy Cesium into lib and public
mkdir public/cesium
cp -r ./node_modules/cesium/Build/Cesium/* ./src/lib/cesium/
cp -r ./src/lib/cesium/Assets ./public/cesium
cp -r ./src/lib/cesium/ThirdParty ./public/cesium
cp -r ./src/lib/cesium/Workers ./public/cesium

# Copy Cesium-drawhelper
mkdir -p public/CesiumDrawHelper/img
cp ./src/lib/cesium-drawhelper-master/img/*.png ./public/CesiumDrawHelper/img

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
