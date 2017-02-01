import Immutable from 'immutable';
import turfLineDistance from 'turf-line-distance';
import turfArea from 'turf-area';
import Qty from 'js-quantities';
import turfCentroid from 'turf-centroid';
import proj4js from 'proj4';
import moment from 'moment';
import { GreatCircle } from 'assets/arc/arc';
import * as appStrings from '_core/constants/appStrings';
import appConfig from 'constants/appConfig';
import MiscUtil from '_core/utils/MiscUtil';
import MapWrapper_openlayers from '_core/utils/MapWrapper_openlayers';

export default class MapUtil {
    constructor() {
        this.miscUtil = new MiscUtil();
    }

    // constrains coordinates to [+-180, +-90]
    constrainCoordinates(coords, limitY = true) {
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
        if (limitY) {
            // simple top/bottom limit
            if (coords[1] > 0) {
                newCoords[1] = Math.min(90, coords[1]);
            } else {
                newCoords[1] = Math.max(-90, coords[1]);
            }
        } else {
            // handle vertical wrapping
            if (Math.abs(coords[1]) > 90) {
                let scale = Math.floor(coords[1] / 90);
                if (coords[1] < 0) {
                    if (scale % 2 !== 0) {
                        newCoords[1] = coords[1] % 90;
                    } else {
                        newCoords[1] = 90 - Math.abs(coords[1] % 90);
                    }
                } else {
                    if (scale % 2 !== 0) {
                        newCoords[1] = 0 - (90 - Math.abs(coords[1] % 90));
                    } else {
                        newCoords[1] = coords[1] % 90;
                    }
                }
            } else {
                newCoords[1] = coords[1];
            }
        }
        return newCoords;
    }

    // deconstrain a set of polyline coordinates from [-180, 180]
    // this is meant for polylines that cross the dateline.
    deconstrainArcCoordinates(linesArr) {
        // if there is only one polyline, then we assume no splitting has occured
        if (linesArr.length < 2) {
            return linesArr;
        }

        // take first set of constrained coordinates as initial frame
        // shift subsequent coordinates relative to those
        let referenceLine = linesArr[0];
        let referenceLineEnd = referenceLine[referenceLine.length - 1];

        let deconstrainedLine = linesArr[0].slice(0, linesArr[0].length);
        for (let i = 1; i < linesArr.length; ++i) {
            let line = linesArr[i];
            let lineStart = line[0];

            if (referenceLineEnd[0] <= 0) {
                if (lineStart[0] >= 0) {
                    let shiftedLine = line.map((coords) => {
                        let shiftedCoords = coords.slice(0, coords.length);
                        shiftedCoords[0] -= 360;
                        return shiftedCoords;
                    });
                    // remove first point due to overlap
                    deconstrainedLine = deconstrainedLine.concat(shiftedLine.slice(1, shiftedLine.length));
                } else {
                    deconstrainedLine = deconstrainedLine.concat(line.slice(1, line.length));
                }
            } else {
                if (lineStart[0] <= 0) {
                    let shiftedLine = line.map((coords) => {
                        let shiftedCoords = coords.slice(0, coords.length);
                        shiftedCoords[0] += 360;
                        return shiftedCoords;
                    });
                    // remove first point due to overlap
                    deconstrainedLine = deconstrainedLine.concat(shiftedLine.slice(1, shiftedLine.length));
                } else {
                    deconstrainedLine = deconstrainedLine.concat(line.slice(1, line.length));
                }
            }
        }
        return deconstrainedLine;
    }

    // parses a getCapabilities xml string
    // NOTE: uses openlayers to do the actual parsing
    parseCapabilities(capabilitiesString) {
        return MapWrapper_openlayers.parseCapabilities(capabilitiesString);
    }

    // generates a set of wmts options for a layer
    // NOTE: uses openlayers to do the actual info gathering
    getWmtsOptions(options) {
        MapWrapper_openlayers.prepProjection();
        return MapWrapper_openlayers.getWmtsOptions(options);
    }

    // generates a WMTS tile url from the provided options
    buildTileUrl(options) {
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
        if (context === appStrings.MAP_LIB_2D) {
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
            let queryOptions = Immutable.OrderedMap({
                SERVICE: 'WMTS',
                REQUEST: 'GetTile',
                VERSION: '1.0.0',
                LAYER: layerId,
                STYLE: "",
                TILEMATRIXSET: tileMatrixSet,
                TILEMATRIX: tileMatrix,
                TILEROW: row,
                TILECOL: col,
                FORMAT: encodeURIComponent(format)
            });

            let queryStr = this.miscUtil.objectToUrlParams(queryOptions);

            url = url.replace("?", "");
            url = url + "?" + queryStr;
        }

        return url;
    }

    // Formats distance according to units
    // input assumed in correct base units (meters/feet vs kilometers/miles)
    formatDistance(distance, units) {
        // Type check on distance
        if (typeof distance !== 'number') {
            return null;
        }

        if (units === 'metric') {
            if (Math.abs(distance) >= 1000) {
                return (distance / 1000).toFixed(2) + ' km';
            } else {
                return distance.toFixed(2) + ' m';
            }
        } else if (units === 'imperial') {
            if (Math.abs(distance) >= 5280) {
                return (distance / 5280).toFixed(2) + ' mi';
            } else {
                return distance.toFixed(2) + ' ft';
            }
        } else if (units === 'nautical') {
            return distance.toFixed(2) + ' nmi';
        } else if (units === 'schoolbus') {
            return distance.toFixed(2) + ' school buses';
        } else {
            return null;
        }
    }

    // Formats area according to units
    // input assumed in correct base units (meters/feet vs kilometers/miles)
    formatArea(area, units) {
        // Type check on area
        if (typeof area !== 'number') {
            return null;
        }

        if (units === 'metric') {
            if (Math.abs(area) >= 1000000) {
                return (area / 1000000).toFixed(2) + ' km<sup>2</sup>';
            } else {
                return area.toFixed(2) + ' m<sup>2</sup>';
            }
        } else if (units === 'imperial') {
            if (Math.abs(area) >= 27878400) {
                return (area / 27878400).toFixed(2) + ' mi<sup>2</sup>';
            } else {
                return area.toFixed(2) + ' ft<sup>2</sup>';
            }
        } else if (units === 'nautical') {
            return area.toFixed(2) + ' nmi<sup>2</sup>';
        } else if (units === 'schoolbus') {
            return area.toFixed(2) + ' school buses<sup>2</sup>';
        } else {
            return null;
        }
    }

    // Converts area units
    // input asssumed in meters squared, will convert to base unit (meters, feet, etc vs kilometers, miles, etc)
    convertAreaUnits(value, units) {
        let unitEntry = this.miscUtil.findObjectInArray(appConfig.SCALE_OPTIONS, 'value', units);
        if (units === 'schoolbus') {
            return value / Math.pow(unitEntry.toMeters, 2);
        } else {
            return Qty(value, 'm^2').to(unitEntry.qtyType + '^2').scalar;
        }
    }

    // Converts distance units
    // input asssumed in meters, will convert to base unit (meters, feet, etc vs kilometers, miles, etc)
    convertDistanceUnits(value, units) {
        let unitEntry = this.miscUtil.findObjectInArray(appConfig.SCALE_OPTIONS, 'value', units);
        if (units === 'schoolbus') {
            return value / unitEntry.toMeters;
        } else {
            return Qty(value, 'm').to(unitEntry.qtyType).scalar;
        }
    }

    // remove trailing zeros from fixed width float string
    trimFloatString(value) {
        return parseFloat(value).toString();
    }

    // Calculates distance of a polyline using turf
    // Expects an array of coordinates in form
    // [ [lon,lat], ... ]
    // Reprojects into EPSG:4326 first
    calculatePolylineDistance(coords, proj) {
        // Reproject from source to EPSG:4326
        let newCoords = coords.map(coord => proj4js(proj, appStrings.PROJECTIONS.latlon.code, coord));
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
    calculatePolygonArea(coords, proj) {
        // Reproject from source to EPSG:4326
        let newCoords = coords.map(coord => proj4js(proj, appStrings.PROJECTIONS.latlon.code, coord));
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
    calculatePolygonCenter(coords, proj) {
        // Reproject from source to EPSG:4326
        let newCoords = coords.map(coord => proj4js(proj, appStrings.PROJECTIONS.latlon.code, coord));
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

    // takes line segments endpoints and generates a set
    // of segments representing a geodesic arc
    // [[[lat, lon], ...], ...]
    // assumes EPSG:4326
    generateGeodesicArcsForLineString(coords) {
        let lineCoords = [];
        for (let i = 0; i < coords.length - 1; ++i) {
            let start = coords[i];
            let end = coords[i + 1];

            // arc doesn't play well with two points in the same place
            if (start[0] === end[0] && start[1] === end[1]) {
                continue;
            }

            // generate the arcs
            let generator = new GreatCircle({ x: start[0], y: start[1] }, { x: end[0], y: end[1] });
            let arcLines = generator.Arc(100, { offset: 180 }).geometries;

            // shift all the arcs as part of a polyline
            if (i >= 1 && lineCoords[lineCoords.length - 1][0] !== arcLines[0].coords[0][0]) {
                let initialShift = 1;
                if (lineCoords[lineCoords.length - 1][0] < 0) {
                    initialShift = -1;
                }
                arcLines = arcLines.map((arc) => {
                    let refCoord = arc.coords[0];
                    let shift = initialShift;
                    if (refCoord[0] <= 0) {
                        if (initialShift <= 0) {
                            shift = 0;
                        } else {
                            shift = initialShift;
                        }
                    } else {
                        if (initialShift <= 0) {
                            shift = initialShift;
                        } else {
                            shift = 0;
                        }
                    }
                    return arc.coords.map((coord) => {
                        coord = coord.slice(0, coord.length);
                        coord[0] += (360 * shift);
                        return coord;
                    });
                });
            } else {
                arcLines = arcLines.map((arc) => {
                    return arc.coords;
                });
            }

            // wrap the arcs beyond [-180,180]
            let arcCoords = arcLines[0];
            if (arcLines.length >= 2) {
                arcCoords = this.deconstrainArcCoordinates(arcLines);
            }
            lineCoords = lineCoords.concat(arcCoords.slice(0, arcCoords.length));
        }
        return lineCoords;
    }

    // takes in a geometry and measurement type and
    // returns a string measurement of that geometry
    measureGeometry(geometry, measurementType) {
        if (geometry.type === appStrings.GEOMETRY_CIRCLE) {
            console.warn("Error in MapUtil.measureGeometry: Could not measure geometry, unsupported geometry type: ", geometry.type);
            return false;
        }
        let coords = geometry.coordinates.map(x => [x.lon, x.lat]);
        coords = this.generateGeodesicArcsForLineString(coords);
        if (measurementType === appStrings.MEASURE_DISTANCE) {
            if (geometry.type === appStrings.GEOMETRY_LINE_STRING) {
                return this.calculatePolylineDistance(coords, geometry.proj);
            } else {
                console.warn("Error in MapUtil.measureGeometry: Could not measure distance, unsupported geometry type: ", geometry.type);
                return false;
            }
        } else if (measurementType === appStrings.MEASURE_AREA) {
            if (geometry.type === appStrings.GEOMETRY_POLYGON) {
                return this.calculatePolygonArea(coords, geometry.proj);
            } else {
                console.warn("Error in MapUtil.measureGeometry: Could not measure area, unsupported geometry type: ", geometry.type);
                return false;
            }
        } else {
            console.warn("Error in MapUtil.measureGeometry: Could not measure geometry, unsupported measurement type: ", measurementType);
            return false;
        }
    }

    // formats a given measurement for distance/area
    formatMeasurement(measurement, measurementType, units) {
        if (measurementType === appStrings.MEASURE_DISTANCE) {
            return this.formatDistance(measurement, units);
        } else if (measurementType === appStrings.MEASURE_AREA) {
            return this.formatArea(measurement, units);
        } else {
            console.warn("Error in MapUtil.formatMeasurement: Could not format measurement, unsupported measurement type: ", measurementType);
            return false;
        }
    }

    // takes in a geometry and returns the coordinates for its label
    getLabelPosition(geometry) {
        if (geometry.type === appStrings.GEOMETRY_LINE_STRING) {
            let lastCoord = geometry.coordinates[geometry.coordinates.length - 1];
            if (lastCoord) {
                return this.constrainCoordinates([lastCoord.lon, lastCoord.lat]);
            } else {
                console.warn("Error in MapUtil.getLabelPosition: Could not find label placement, no coordinates in geometry.");
                return false;
            }
        } else if (geometry.type === appStrings.GEOMETRY_POLYGON) {
            let coords = geometry.coordinates.map((x) => [x.lon, x.lat]);
            coords = this.generateGeodesicArcsForLineString(coords);
            return this.constrainCoordinates(this.calculatePolygonCenter(coords, geometry.proj));
        } else {
            console.warn("Error in MapUtil.getLabelPosition: Could not find label placement, unsupported geometry type: ", geometry.type);
            return false;
        }
    }

    // Takes in an extent as an array of strings or floats and returns an array with float representations of the strings or floats. 
    // Returns false if Array is wrong type or does not contain exactly four floats.
    parseStringExtent(extentStrArr) {
        // Check extentStrArr type
        if (!extentStrArr || !Array.isArray(extentStrArr) || extentStrArr.length !== 4) {
            return false;
        }

        return extentStrArr.reduce((acc, numStr) => {
            if (typeof acc === "object") {
                let num = parseFloat(numStr);
                if (isNaN(num)) {
                    return false;
                } else {
                    acc.push(num);
                }
            }
            return acc;
        }, []);
    }
}
