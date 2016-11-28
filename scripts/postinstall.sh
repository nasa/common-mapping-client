#!/bin/bash

# Remove and re-add assets folder
rm -rf ./assets && mkdir ./assets

# Copy Cesium into lib and assets
mkdir ./assets/cesium
cp -r ./node_modules/cesium/Build/Cesium/* ./src/lib/cesium/
cp -r ./src/lib/cesium/Assets ./assets/cesium
cp -r ./src/lib/cesium/ThirdParty ./assets/cesium
cp -r ./src/lib/cesium/Workers ./assets/cesium

# Copy Cesium-drawhelper
mkdir -p ./assets/CesiumDrawHelper/img
cp ./src/_core/styles/resources/img/CesiumDrawHelper/*.png ./assets/CesiumDrawHelper/img

# Copy flexbox
mkdir ./src/lib/flexboxgrid/
cp ./node_modules/flexboxgrid/dist/flexboxgrid.min.css ./src/lib/flexboxgrid/

# Copy normalize.css
mkdir ./src/lib/normalize/
cp ./node_modules/normalize.css/normalize.css ./src/lib/normalize/

# Copy mapskin into assets
cp -r ./src/lib/mapskin ./assets
