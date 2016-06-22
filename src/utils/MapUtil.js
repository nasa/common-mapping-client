import * as mapStrings from '../constants/mapStrings';
import * as tileUrlFunctions from './TileUrlFunctions';
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
        return MapWrapper_openlayers.getWmtsOptions(options);
    }

    // takes a function string and a url and returns the defined tile url function for it
    static getUrlFunction(functionString = "", url = false) {
        switch (functionString) {
            case mapStrings.ESRI_CUSTOM_512:
                return tileUrlFunctions.esriCustom512(url);
            default:
                return undefined;
        }
    }
}
