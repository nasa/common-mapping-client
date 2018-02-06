#!/bin/bash

# Copyright 2017 California Institute of Technology.
#
# This source code is licensed under the APACHE 2.0 license found in the
# LICENSE.txt file in the root directory of this source tree.


# Copy default data
cp -r ./src/default-data ./dist

# Copy public assets
cp -r ./assets/* ./dist

# Copy over config
cp ./src/config.js ./dist
