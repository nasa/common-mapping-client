#!/bin/bash

# Copy Cesium
rm -rf public && mkdir public
cp -r ./node_modules/cesium/Build/Cesium/* ./src/lib/cesium/
cp -r ./src/lib/cesium/* ./public

# Copy Cesium-drawhelper
mkdir ./public/CesiumDrawHelper
cp ./src/_core/styles/resources/img/CesiumDrawHelper/*.png ./public/CesiumDrawHelper

# Copy flexbox
mkdir ./src/lib/flexboxgrid/
cp ./node_modules/flexboxgrid/dist/flexboxgrid.min.css ./src/lib/flexboxgrid/

# Copy normalize.css
mkdir ./src/lib/normalize/
cp ./node_modules/normalize.css/normalize.css ./src/lib/normalize/

# Copy mapskin into public
cp -r ./src/lib/mapskin ./public
