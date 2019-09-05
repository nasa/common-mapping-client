/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as appStrings from "_core/constants/appStrings";
import MapUtil from "_core/utils/MapUtil";
import MiscUtil from "_core/utils/MiscUtil";

const CAT_SIZES = [128, 256, 512, 1024, 200, 300, 400, 500, 700];
export default class TileHandler {
    /**
     * reference to a MapUtil class
     *
     * @static
     * @memberof TileHandler
     */
    static mapUtil = MapUtil;

    /**
     * Reference to a MiscUtil class
     *
     * @static
     * @memberof TileHandler
     */
    static miscUtil = MiscUtil;

    /**
     * Takes a function string and returns the tile url function associated with it or undefined
     *
     *  Tile Url Function Parameters
     * OPENLAYERS
     * - options: object containing the following...
     *   - layer: the ImmutbleJS layer object from the store
     *   - mapLayer: the openlayers map layer object
     *   - origUrl: the original url (template or base endpoint) for the layer
     *   - tileCoord: the coordinates of the tile currently requested [z,x,y]
     *   - tileMatrixIds: array of tile matrix ids mapped by zoom level
     *   - pixelRatio: the current pixel ratio of the display
     *   - projectionString: the string name of the current projection
     *   - context: "openlayers"
     * return: {string} tile url
     *
     * CESIUM
     * - options: object containing the following...
     *   - layer: the ImmutbleJS layer object from the store
     *   - mapLayer: the cesium map layer object
     *   - origUrl: the original url (template or base endpoint) for the layer
     *   - tileCoord: the coordinates of the tile currently requested [z,x,y]
     *   - context: "cesium"
     * return: {string} tile url
     *
     * @static
     * @param {string} [functionString=""] key string for function map
     * @returns {function} function associated with the given string
     * @memberof TileHandler
     */
    static getUrlFunction(functionString = "") {
        switch (functionString) {
            case appStrings.DEFAULT_URL_FUNC_WMTS:
                return options => {
                    return this._defaultKVPUrlWmts(options);
                };
            case appStrings.DEFAULT_URL_FUNC_WMS:
                return options => {
                    return this._defaultKVPUrlWms(options);
                };
            case appStrings.ESRI_CUSTOM_512:
                return options => {
                    return this._esriCustom512Url(options);
                };
            case appStrings.KVP_TIME_PARAM_WMTS:
                return options => {
                    return this._kvpTimeParamUrlWmts(options);
                };
            case appStrings.KVP_TIME_PARAM_WMS:
                return options => {
                    return this._kvpTimeParamUrlWms(options);
                };
            case appStrings.CATS_URL:
                return options => {
                    return this._catsInterceptUrl(options);
                };
            default:
                return undefined;
        }
    }

    /**
     * takes a function string and returns the tile load function associated with it or undefined
     *
     * Tile Load Function Parameters
     * OPENLAYERS
     * - options: object containing the following...
     *   - layer: the ImmutbleJS layer object from the store
     *   - maplayer: the openlayers map layer object
     *   - url: the url for the retrieved tile
     *   - tile: the openlayers tile object
     *   - defaultFunc: function that will run the the openlayers default tile load function
     * return: {object} an openlayers tile object
     *
     * CESIUM
     * - options: object containing the following...
     *   - layer: the ImmutbleJS layer object from the store
     *   - maplayer: the cesium map layer object
     *   - url: the url for the retrieved tile
     *   - tileCoord: the coordinates of the tile currently requested [z,x,y]
     *   - success: the function to call once the tile has been successfully generated, passing the resulting tile as the only arg
     *   - fail: the function to call once the tile has failed to be generated, passing the resulting error as the only arg
     * return: none
     *
     * @static
     * @param {string} [functionString=""] key string for function map
     * @returns {function} function associated with the given string
     * @memberof TileHandler
     */
    static getTileFunction(functionString = "") {
        switch (functionString) {
            case appStrings.CATS_TILE_OL:
                return options => {
                    return this._catsInterceptTile_OL(options);
                };
            case appStrings.CATS_TILE_CS:
                return options => {
                    return this._catsInterceptTile_CS(options);
                };
            default:
                return undefined;
        }
    }

    /**
     * constuct a wmts kvp format url
     *
     * @static
     * @param {object} options tile url function options
     * @returns {string} tile url
     * @memberof TileHandler
     */
    static _defaultKVPUrlWmts(options) {
        let layer = options.layer;
        let url = this.mapUtil.buildWmtsTileUrl({
            layerId: layer.getIn(["mappingOptions", "layer"]),
            url: options.origUrl,
            tileMatrixSet: layer.getIn(["mappingOptions", "matrixSet"]),
            format: layer.getIn(["mappingOptions", "format"]),
            col: options.tileCoord[1],
            row: options.tileCoord[2],
            level:
                typeof options.tileMatrixIds !== "undefined" &&
                typeof options.tileMatrixIds[options.tileCoord[0]] !== "undefined"
                    ? options.tileMatrixIds[options.tileCoord[0]]
                    : options.tileCoord[0],
            context: options.context
        });

        return url;
    }

    /**
     * constuct a wmts kvp format url
     *
     * @static
     * @param {object} options tile url function options
     * @returns {string} tile url
     * @memberof TileHandler
     */
    _defaultKVPUrlWms(options) {
        return options.defaultUrl;
    }

    /**
     * construct esri xyz tile format url
     *
     * @static
     * @param {object} options tile url function options
     * @returns {string} tile url
     * @memberof TileHandler
     */
    static _esriCustom512Url(options) {
        let urlTemplate = options.origUrl;
        let tileCoord = options.tileCoord;
        if (urlTemplate) {
            return urlTemplate
                .replace("{z}", (tileCoord[0] - 1).toString())
                .replace("{x}", tileCoord[1].toString())
                .replace("{y}", (-tileCoord[2] - 1).toString());
        }
        return undefined;
    }

    /**
     * constuct a wmts kvp format url with an additional time parameter
     *
     * @static
     * @param {object} options tile url function options
     * @returns {string} tile url
     * @memberof TileHandler
     */
    static _kvpTimeParamUrlWmts(options) {
        let mapLayer = options.mapLayer;
        let url = this._defaultKVPUrlWmts(options);

        let timeStr =
            typeof mapLayer.get === "function" ? mapLayer.get("_layerTime") : mapLayer._layerTime;
        if (typeof timeStr !== "undefined") {
            if (url.indexOf("{") >= 0) {
                url = url.replace("{Time}", timeStr);
            } else {
                url = url + "&TIME=" + timeStr;
            }
        }

        return url;
    }

    /**
     * constuct a wms kvp format url with an additional time parameter
     *
     * @static
     * @param {object} options image url function options
     * @returns {string} image url
     * @memberof ImageHandler
     */
    static _kvpTimeParamUrlWms(options) {
        const { mapLayer, defaultUrl } = options;
        let url = defaultUrl;

        // add query string section
        const first = defaultUrl.indexOf("?") === -1;

        let timeStr =
            typeof mapLayer.get === "function" ? mapLayer.get("_layerTime") : mapLayer._layerTime;
        if (typeof timeStr !== "undefined") {
            if (defaultUrl.indexOf("{") >= 0) {
                url = defaultUrl.replace("{Time}", timeStr);
            } else {
                url = defaultUrl + (first ? "?" : "&") + "TIME=" + timeStr;
            }
        }

        return url;
    }

    /**
     * construct a url for a random cat image
     *
     * @static
     * @param {object} options tile url function options
     * @returns {string} random cat image url
     * @memberof TileHandler
     */
    static _catsInterceptUrl(options) {
        let tileSize = CAT_SIZES[Math.floor(Math.random() * (CAT_SIZES.length - 1)) + 1];
        // let tileSize = options.layer.getIn(["mappingOptions", "tileGrid", "tileSize"]);
        return "http://placekitten.com/g/" + tileSize + "/" + tileSize;
    }

    /**
     * load a random cat image instead of the specified tile
     * for an openlayers tile
     *
     * @static
     * @param {object} options tile load function options
     * @returns {object} openlayers tile
     * @memberof TileHandler
     */
    static _catsInterceptTile_OL(options) {
        let tile = options.tile;

        // override getImage()
        if (typeof tile._origGetImageFunc === "undefined") {
            tile._origGetImageFunc = tile.getImage;

            let tileSize = CAT_SIZES[Math.floor(Math.random() * (CAT_SIZES.length - 1)) + 1];
            let url = "http://placekitten.com/g/" + tileSize + "/" + tileSize;
            tile.getImage = function(optContext) {
                let node = tile._origGetImageFunc(optContext);
                node.src = url;
                return node;
            };
        }

        return options.defaultFunc();
    }

    /**
     * load a random cat image instead of the specified tile
     * for an cesium tile
     *
     * @static
     * @param {object} options tile load function options
     * @returns none
     * @memberof TileHandler
     */
    static _catsInterceptTile_CS(options) {
        let imgTile = new Image();
        let tileSize = CAT_SIZES[Math.floor(Math.random() * (CAT_SIZES.length - 1)) + 1];
        let url = "http://placekitten.com/g/" + tileSize + "/" + tileSize;

        imgTile.onload = () => {
            options.success(imgTile);
        };
        imgTile.onerror = err => {
            options.fail(err);
        };
        if (this.miscUtil.urlIsCrossorigin(url)) {
            imgTile.crossOrigin = "";
        }

        imgTile.src = url;
    }
}
