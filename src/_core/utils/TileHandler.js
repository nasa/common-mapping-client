import * as appStrings from "_core/constants/appStrings";
import MapUtil from "_core/utils/MapUtil";
import MiscUtil from "_core/utils/MiscUtil";

const CAT_SIZES = [128, 256, 512, 1024, 200, 300, 400, 500, 700];
export default class TileHandler {
    static mapUtil = MapUtil;
    static miscUtil = MiscUtil;

    // takes a function string and returns the tile url function associated with it or undefined
    /** Tile Url Function Parameters
    OPENLAYERS
    options: object containing the following...
        layer: the ImmutbleJS layer object from the store
        mapLayer: the openlayers map layer object
        origUrl: the original url (template or base endpoint) for the layer
        tileCoord: the coordinates of the tile currently requested [z,x,y]
        tileMatrixIds: array of tile matrix ids mapped by zoom level
        pixelRatio: the current pixel ratio of the display
        projectionString: the string name of the current projection
        context: "openlayers"

    CESIUM
    options: object containing the following...
        layer: the ImmutbleJS layer object from the store
        mapLayer: the cesium map layer object
        origUrl: the original url (template or base endpoint) for the layer
        tileCoord: the coordinates of the tile currently requested [z,x,y]
        context: "cesium"
    **/
    static getUrlFunction(functionString = "") {
        switch (functionString) {
            case appStrings.DEFAULT_URL_FUNC:
                return options => {
                    return this._defaultKVPUrl(options);
                };
            case appStrings.ESRI_CUSTOM_512:
                return options => {
                    return this._esriCustom512Url(options);
                };
            case appStrings.KVP_TIME_PARAM:
                return options => {
                    return this._kvpTimeParamUrl(options);
                };
            case appStrings.CATS_URL:
                return options => {
                    return this._catsInterceptUrl(options);
                };
            default:
                return undefined;
        }
    }

    // takes a function string and returns the tile load function associated with it or undefined
    /** Tile Load Function Parameters
    OPENLAYERS
    options: object containing the following...
        layer: the ImmutbleJS layer object from the store
        maplayer: the openlayers map layer object
        url: the url for the retrieved tile
        tile: the openlayers3 tile object
        defaultFunc: function that will run the the openlayers3 default tile load function
    RETURN: an ol3 tile object

    CESIUM
    options: object containing the following...
        layer: the ImmutbleJS layer object from the store
        maplayer: the cesium map layer object
        url: the url for the retrieved tile
        tileCoord: the coordinates of the tile currently requested [z,x,y]
        success: the function to call once the tile has been successfully generated, passing the resulting tile as the only arg
        fail: the function to call once the tile has failed to be generated, passing the resulting error as the only arg
    RETURN: none
    **/
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

    static _defaultKVPUrl(options) {
        let layer = options.layer;
        let url = this.mapUtil.buildTileUrl({
            layerId: layer.get("id"),
            url: options.origUrl,
            tileMatrixSet: layer.getIn(["wmtsOptions", "matrixSet"]),
            format: layer.getIn(["wmtsOptions", "format"]),
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

    static _kvpTimeParamUrl(options) {
        let mapLayer = options.mapLayer;
        let url = this._defaultKVPUrl(options);

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

    static _catsInterceptUrl(options) {
        let tileSize = options.layer.getIn(["wmtsOptions", "tileGrid", "tileSize"]);
        return "http://placekitten.com/g/" + tileSize + "/" + tileSize;
    }

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
