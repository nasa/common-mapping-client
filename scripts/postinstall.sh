#!/bin/bash

# Copyright 2017 California Institute of Technology.
#
# This source code is licensed under the APACHE 2.0 license found in the
# LICENSE.txt file in the root directory of this source tree.


# Remove and re-add assets folder
rm -rf ./assets && mkdir -p ./assets/assets

# Copy Cesium into lib and assets
mkdir ./assets/assets/cesium
cp -r ./node_modules/cesium/Build/Cesium/* ./assets/assets/cesium/

# Copy Cesium-drawhelper
mkdir -p ./assets/assets/CesiumDrawHelper/img
cp ./src/_core/styles/resources/img/CesiumDrawHelper/*.png ./assets/assets/CesiumDrawHelper/img

# Copy normalize.css
mkdir ./assets/assets/normalize/
cp ./node_modules/normalize.css/normalize.css ./assets/assets/normalize/

# Copy mapskin into assets
cp -r ./lib/mapskin ./assets/assets

# Copy arc into assets
cp -r ./lib/arc ./assets/assets
