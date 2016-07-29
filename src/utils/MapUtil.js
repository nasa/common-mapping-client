import Immutable from 'immutable';
import * as mapStrings from '../constants/mapStrings';
import * as urlFunctions from './UrlFunctions';
import * as tileLoadFunctions from './TileLoadFunctions';
import MiscUtil from './MiscUtil';
import MapWrapper_openlayers from './MapWrapper_openlayers';
import MapWrapper_cesium from './MapWrapper_cesium';

export default class MapUtil {
    
    // creates a new object that abstracts a mapping library
    static createMap(type, container, mapOptions) {
        switch (type) {
            case mapStrings.MAP_LIB_2D:
                return new MapWrapper_openlayers(container, mapOptions);
            case mapStrings.MAP_LIB_3D:
                return new MapWrapper_cesium(container, mapOptions);
            default:
                return false;
        }
    }

    // constrains coordinates to [+-180, +-90]
    static constrainCoordinates(coords) {
        let newCoords = [0, 0];
        // constrain x
        let scale = Math.floor(coords[0] / 180);
        if (coords[0] < 0) {
            if (scale % 2 !== 0) {
                newCoords[0] = coords[0] % 180;
            } else {
                newCoords[0] = 180 - Math.abs(coords[0] % 180);
            }
        } else {
            if (scale % 2 !== 0) {
                newCoords[0] = 0 - (180 - Math.abs(coords[0] % 180));
            } else {
                newCoords[0] = coords[0] % 180;
            }
        }

        // constrain y
        if (coords[1] > 0) {
            newCoords[1] = Math.min(90, coords[1]);
        } else {
            newCoords[1] = Math.max(-90, coords[1]);
        }
        return newCoords;
    }

    // parses a getCapabilities xml string
    // NOTE: uses openlayers to do the actual parsing
    static parseCapabilities(capabilitiesString) {
        return MapWrapper_openlayers.parseCapabilities(capabilitiesString);
    }

    // generates a set of wmts options for a layer
    // NOTE: uses openlayers to do the actual info gathering
    static getWmtsOptions(options) {
        MapWrapper_openlayers.prepProjection();
        return MapWrapper_openlayers.getWmtsOptions(options);
    }

    // generates a WMTS tile url from the provided options
    static buildTileUrl(options) {
        let layerId = options.layerId;
        let url = options.url;
        let tileMatrixSet = options.tileMatrixSet;
        let tileMatrixLabels = options.tileMatrixLabels;
        let col = options.col;
        let row = options.row;
        let level = options.level;
        let format = options.format;
        let context = options.context;

        // adjust tileRow
        if(context === mapStrings.MAP_LIB_2D) {
            row = -options.row - 1;
        }

        let tileMatrix = typeof tileMatrixLabels !== "undefined" ? tileMatrixLabels[level] : level.toString();

        if (url.indexOf('{') >= 0) {
            // resolve tile-URL template
            url = url
                .replace('{TileMatrixSet}', tileMatrixSet)
                .replace('{TileMatrix}', tileMatrix)
                .replace('{TileRow}', row.toString())
                .replace('{TileCol}', col.toString());
        } else {
            // build KVP request
            let queryOptions = Immutable.Map({
                service: 'WMTS',
                version: '1.0.0',
                request: 'GetTile',
                tilematrix: tileMatrix,
                layer: layerId,
                tilerow: row,
                tilecol: col,
                tilematrixset: tileMatrixSet,
                format: format
            });

            let queryStr = MiscUtil.objectToUrlParams(queryOptions);

            url = url.replace("?", "");
            url = url + "?" + queryStr;
        }

        return url;
    }

    // takes a function string and returns the tile url function associated with it or undefined
    static getUrlFunction(functionString = "") {
        switch (functionString) {
            case mapStrings.DEFAULT_URL_FUNC:
                return urlFunctions.defaultKVPUrlFunc;
            case mapStrings.ESRI_CUSTOM_512:
                return urlFunctions.esriCustom512;
            case mapStrings.KVP_TIME_PARAM:
                return urlFunctions.kvpTimeParam;
            case mapStrings.CATS_URL:
                return urlFunctions.catsIntercept;
            default:
                return undefined;
        }
    }

    // takes a function string and returns the tile load function associated with it or undefined
    static getTileFunction(functionString = "") {
        switch (functionString) {
            case mapStrings.CATS_TILE_OL:
                return tileLoadFunctions.catsIntercept_OL;
            case mapStrings.CATS_TILE_CS:
                return tileLoadFunctions.catsIntercept_CS;
            default:
                return undefined;
        }
    }
}
