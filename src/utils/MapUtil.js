import Immutable from 'immutable';
import turfLineDistance from 'turf-line-distance';
import turfArea from 'turf-area';
import Qty from 'js-quantities';
import turfCentroid from 'turf-centroid';
import proj4js from 'proj4';
import * as mapStrings from '../constants/mapStrings';
import * as urlFunctions from './UrlFunctions';
import * as tileLoadFunctions from './TileLoadFunctions';
import MiscUtil from './MiscUtil';
import MapWrapper_openlayers from './MapWrapper_openlayers';
import MapWrapper_cesium from './MapWrapper_cesium';
import * as mapConfig from '../constants/mapConfig';

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
        // check for array of numbers
        if ((typeof coords !== "object") ||
            (coords.length !== 2) ||
            (typeof coords[0] !== "number") ||
            (typeof coords[1] !== "number")) {
            return false;
        }


        let newCoords = [0, 0];

        // constrain x
        if (Math.abs(coords[0]) > 180) {
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
        } else {
            newCoords[0] = coords[0];
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
        if (context === mapStrings.MAP_LIB_2D) {
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

    // Formats distance according to units
    static formatDistance(distance, units) {
        if (units === 'metric') {
            let output = "";
            if (distance > 100) {
                output = (Math.round(distance / 1000 * 100) / 100) + ' ' + 'km';
            } else {
                output = (Math.round(distance * 100) / 100) + ' ' + 'm';
            }
            return output;
        } else if (units === 'imperial') {
            let output = "";
            if (distance > 5280) {
                output = (Math.round(distance / 5280 * 100) / 100) + ' ' + 'miles';
            } else {
                output = (Math.round(distance * 100) / 100) + ' ' + 'ft';
            }
            return output;
        } else if (units === 'nautical') {
            distance = distance / 1852;
            return (Math.round(distance * 100) / 100) + " nautical miles";
        } else if (units === 'schoolbus') {
            distance = distance / 13.716;
            return (Math.round(distance * 100) / 100) + ' ' + 'schoolbusses';
        } else {
            return "Invalid Units";
        }
    }

    // Formats area according to units
    static formatArea(area, units) {
        if (units === 'metric') {
            let output = "";
            if (area > 10000) {
                output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km' + '<sup>2</sup>';
            } else {
                output = (Math.round(area * 100) / 100) + ' ' + 'm' + '<sup>2</sup>';
            }
            return output;
        } else if (units === 'imperial') {
            let output = "";
            if (area > 27878400) {
                output = (Math.round(area / 27878400 * 100) / 100) + ' ' + 'miles' + '<sup>2</sup>';
            } else {
                output = (Math.round(area * 100) / 100) + ' ' + 'ft' + '<sup>2</sup>';
            }
            return output;
        } else if (units === 'nautical') {
            console.log(area, "1")
            area = area / (1852 * 1852);
            console.log(area, "2")
            return (Math.round(area * 100) / 100) + " nautical miles<sup>2</sup>";
        } else if (units === 'schoolbus') {
            area = area / (13.716 * 13.716);
            return (Math.round(area * 100) / 100) + ' ' + 'schoolbusses' + '<sup>2</sup>';
        } else {
            return "Invalid Units";
        }
    }

    // Converts area units
    static convertAreaUnits(value, units) {
        return Qty(value, 'm^2').to(MiscUtil.findObjectInArray(mapConfig.SCALE_OPTIONS, 'value', units).qtyType + '^2').scalar;
    }

    // Converts distance units
    static convertDistanceUnits(value, units) {
        console.log(value, units, Qty(value, 'm').to(MiscUtil.findObjectInArray(mapConfig.SCALE_OPTIONS, 'value', units).qtyType).scalar);
        return Qty(value, 'm').to(MiscUtil.findObjectInArray(mapConfig.SCALE_OPTIONS, 'value', units).qtyType).scalar;
    }

    // Converts from unitFrom to unitTo
    // static convertAreaUnitValue(value, unitFrom, unitTo) {
    //     // if (unitFrom === 'metric') {

    //     // }
    // }


    // Calculates distance of a polyline using turf
    // Expects an array of coordinates in form
    // [ [lon,lat], ... ]
    // Reprojects into EPSG:4326 first
    static calculatePolylineDistance(coords, proj) {
        // Reproject from source to EPSG:4326
        let newCoords = coords.map(coord => proj4js(proj, mapStrings.PROJECTIONS.latlon.code, coord));
        // Calculate line distance
        return turfLineDistance({
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: newCoords
            }
        }, "meters");
    }

    // Calculates area of a polygon using turf
    // Expects an array of coordinates in form
    // [ [lon,lat], ... ]
    // Reprojects into EPSG:4326 first
    static calculatePolygonArea(coords, proj) {
        // Reproject from source to EPSG:4326
        let newCoords = coords.map(coord => proj4js(proj, mapStrings.PROJECTIONS.latlon.code, coord));
        // Calculate line distance
        return turfArea({
            type: "Feature",
            properties: {},
            geometry: {
                type: "Polygon",
                coordinates: [newCoords]
            }
        }, "meters");
    }

    // Calculates center point of a polygon using turf
    // Expects an array of coordinates in form
    // [ [lon,lat], ... ]
    // Reprojects into EPSG:4326 first
    static calculatePolygonCenter(coords, proj) {
        // Reproject from source to EPSG:4326
        let newCoords = coords.map(coord => proj4js(proj, mapStrings.PROJECTIONS.latlon.code, coord));
        // Calculate center
        return turfCentroid({
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Polygon",
                    coordinates: [newCoords]
                }
            }]
        }, "meters").geometry.coordinates;
    }
}
