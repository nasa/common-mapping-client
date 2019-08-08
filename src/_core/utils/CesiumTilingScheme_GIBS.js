/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import "assets/cesium/Cesium.js";

/**
 * Tiling scheme class for GIBS layers to render in cesium
 * copied from https://github.com/nasa-gibs/gibs-web-examples/blob/master/lib/gibs/gibs.js
 *
 * @export
 * @class CesiumTilingScheme_GIBS
 * @extends {window.Cesium.GeographicTilingScheme}
 */
export default class CesiumTilingScheme_GIBS extends window.Cesium.GeographicTilingScheme {
    constructor(options, mappingOptions = {}) {
        super(options);

        let tilePixels = 512;
        let cesium = window.Cesium;
        let rectangle = window.Cesium.Rectangle.MAX_VALUE;
        let math = window.Cesium.Math;

        // Resolution: radians per pixel
        let levels = [
            { width: 2, height: 1, resolution: 0.009817477042468103 },
            { width: 3, height: 2, resolution: 0.004908738521234052 },
            { width: 5, height: 3, resolution: 0.002454369260617026 },
            { width: 10, height: 5, resolution: 0.001227184630308513 },
            { width: 20, height: 10, resolution: 0.0006135923151542565 },
            { width: 40, height: 20, resolution: 0.00030679615757712823 },
            { width: 80, height: 40, resolution: 0.00015339807878856412 },
            { width: 160, height: 80, resolution: 0.00007669903939428206 },
            { width: 320, height: 160, resolution: 0.00003834951969714103 },
            { width: 640, height: 320, resolution: 0.000019174759848570515 },
            { width: 1280, height: 640, resolution: 0.000009587379924285257 },
            { width: 2560, height: 1280, resolution: 0.000004793689962142629 }
        ];

        // package the variables needed in the overrides below that will be used
        this._override_vars = { tilePixels, cesium, rectangle, math, levels };
    }

    getNumberOfXTilesAtLevel(level) {
        return this._override_vars.levels[level].width;
    }

    getNumberOfYTilesAtLevel(level) {
        return this._override_vars.levels[level].height;
    }

    tileXYToRectangle(x, y, level, result) {
        let xTiles = this._override_vars.levels[level].width;
        let yTiles = this._override_vars.levels[level].height;
        let resolution = this._override_vars.levels[level].resolution;

        let xTileWidth = resolution * this._override_vars.tilePixels;
        let west = x * xTileWidth + this._override_vars.rectangle.west;
        let east = (x + 1) * xTileWidth + this._override_vars.rectangle.west;

        let yTileHeight = resolution * this._override_vars.tilePixels;
        let north = this._override_vars.rectangle.north - y * yTileHeight;
        let south = this._override_vars.rectangle.north - (y + 1) * yTileHeight;

        if (!result) {
            result = new this._override_vars.cesium.Rectangle(0, 0, 0, 0);
        }
        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    }

    positionToTileXY(position, level, result) {
        if (
            !this._override_vars.cesium.Rectangle.contains(this._override_vars.rectangle, position)
        ) {
            return undefined;
        }

        let xTiles = this._override_vars.levels[level].width;
        let yTiles = this._override_vars.levels[level].height;
        let resolution = this._override_vars.levels[level].resolution;

        let xTileWidth = resolution * this._override_vars.tilePixels;
        let yTileHeight = resolution * this._override_vars.tilePixels;

        let longitude = position.longitude;
        if (this._override_vars.rectangle.east < this._override_vars.rectangle.west) {
            longitude += this._override_vars.math.TWO_PI;
        }

        let xTileCoordinate = ((longitude - this._override_vars.rectangle.west) / xTileWidth) | 0;
        if (xTileCoordinate >= xTiles) {
            xTileCoordinate = xTiles - 1;
        }

        let latitude = position.latitude;
        let yTileCoordinate = ((this._override_vars.rectangle.north - latitude) / yTileHeight) | 0;
        if (yTileCoordinate > yTiles) {
            yTileCoordinate = yTiles - 1;
        }

        if (!result) {
            result = new this._override_vars.cesium.Cartesian2(0, 0);
        }
        result.x = xTileCoordinate;
        result.y = yTileCoordinate;
        return result;
    }
}
