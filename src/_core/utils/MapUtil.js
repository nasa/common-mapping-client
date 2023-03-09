/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import turfLineDistance from "turf-line-distance";
import turfArea from "turf-area";
import Qty from "js-quantities";
import turfCentroid from "turf-centroid";
import proj4js from "proj4";
import { GreatCircle } from "assets/arc/arc";
import Ol_Format_WMTSCapabilities from "ol/format/WMTSCapabilities";
import Ol_Format_WMSCapabilities from "ol/format/WMSCapabilities";
import { optionsFromCapabilities } from "ol/source/WMTS";
import * as Ol_Proj from "ol/proj";
import { register as Ol_Proj4_register } from "ol/proj/proj4";
import * as appStrings from "_core/constants/appStrings";
import appConfig from "constants/appConfig";
import MiscUtil from "_core/utils/MiscUtil";

export default class MapUtil {
    /**
     * Reference to a MiscUtil class
     *
     * @static
     * @memberof MapUtil
     */
    static miscUtil = MiscUtil;

    /**
     * constrains coordinates to [+-180, +-90]
     *
     * @static
     * @param {array} coords Array of [lon,lat] values
     * @param {boolean} [constrainY=true] true if the coordinates should be limited in the Y direction. Defaults to true
     * @returns {array} array of coordinates contrained to [+-180, +-90]
     * @memberof MapUtil
     */
    static constrainCoordinates(coords, constrainY = true) {
        // check for array of numbers
        if (
            typeof coords !== "object" ||
            coords.length !== 2 ||
            typeof coords[0] !== "number" ||
            typeof coords[1] !== "number"
        ) {
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
        if (constrainY) {
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

    /**
     * Deconstrain a set of constrained coordinates. This is meant for polylines
     * that cross the dateline.
     *
     * @static
     * @param {array} linesArr array of line segement start & end coordinate arrays [[[lon,lat], [lon,lat], ...], ...]
     * @returns {array} array of line segment start & end coordinate arrays with the coordinates deconstrained from [+-180, +-90]
     * @memberof MapUtil
     */
    static deconstrainArcCoordinates(linesArr) {
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
                    deconstrainedLine = deconstrainedLine.concat(
                        shiftedLine.slice(1, shiftedLine.length)
                    );
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
                    deconstrainedLine = deconstrainedLine.concat(
                        shiftedLine.slice(1, shiftedLine.length)
                    );
                } else {
                    deconstrainedLine = deconstrainedLine.concat(line.slice(1, line.length));
                }
            }
        }
        return deconstrainedLine;
    }

    /**
     * parses a WMTS getCapabilities xml string
     * note that it uses openlayers to do the actual parsing
     *
     * @static
     * @param {string} xmlString string of capabilities XML
     * @returns {object} an opject of wmts cappabilities
     * @memberof MapUtil
     */
    static parseWMTSCapabilities(xmlString) {
        try {
            let parser = new Ol_Format_WMTSCapabilities();
            return parser.read(xmlString);
        } catch (err) {
            console.warn("Error in MapUtil.parseWMTSCapabilities:", err);
            return false;
        }
    }

    /**
     * parses a WMS getCapabilities xml string
     * note that it uses openlayers to do the actual parsing
     *
     * @static
     * @param {string} xmlString string of capabilities XML
     * @param {bool} isWmts true if the capabilities is a WMTS config, false if WMS
     * @returns {object} an opject of wms cappabilities
     * @memberof MapUtil
     */
    static parseWMSCapabilities(xmlString) {
        try {
            let parser = new Ol_Format_WMSCapabilities();
            return parser.read(xmlString);
        } catch (err) {
            console.warn("Error in MapUtil.parseWMSCapabilities:", err);
            return false;
        }
    }

    /**
     * generates a set of wmts options for a layer
     * note that it uses openlayers to do the actual info gathering
     *
     * @static
     * @param {object} options options for matching up the capabilities for the layer
     * - capabilities - {object} outfrom from parseWMTSCapabilities
     * - options - {object} see config from http://openlayers.org/en/latest/apidoc/ol.source.WMTS.html#.optionsFromCapabilities
     * @returns {object} an object containing WMTS capabilities options for the layer or false if the matchup failed
     * @memberof MapUtil
     */
    static getWmtsOptions(options) {
        try {
            let parseOptions = optionsFromCapabilities(options.capabilities, options.options);

            // build out non-ol specific tile grid sizes
            const tileGridSizes = [];
            const maxZ = parseOptions.tileGrid.getMaxZoom();
            for (let i = 0; i <= maxZ; ++i) {
                const tg = parseOptions.tileGrid.getFullTileRange(i);
                tileGridSizes.push({ width: tg.maxX - tg.minX + 1, height: tg.maxY - tg.minY + 1 });
            }

            return {
                url: parseOptions.urls[0],
                layer: options.options.layer,
                format: parseOptions.format,
                requestEncoding: parseOptions.requestEncoding,
                matrixSet: parseOptions.matrixSet,
                projection: parseOptions.projection.getCode(),
                extents: parseOptions.projection.getExtent(),
                tileGrid: {
                    origin: [
                        parseOptions.projection.getExtent()[0],
                        parseOptions.projection.getExtent()[3],
                    ],
                    resolutions: parseOptions.tileGrid.getResolutions(),
                    matrixIds: parseOptions.tileGrid.getMatrixIds(),
                    minZoom: parseOptions.tileGrid.getMinZoom(),
                    maxZoom: parseOptions.tileGrid.getMaxZoom(),
                    tileSize: parseOptions.tileGrid.getTileSize(0),
                    tileGridSizes,
                },
                parsedTileGrid: parseOptions.tileGrid,
            };
        } catch (err) {
            console.warn("Error in MapUtil.getWmtsOptions:", err);
            return false;
        }
    }

    /**
     * generates a set of wms options for a layer
     * note that it uses openlayers to do the actual info gathering
     *
     * @static
     * @param {object} options options for matching up the capabilities for the layer
     * - capabilities - {object} outfrom from parseWMSCapabilities
     * - options - {object} see config from http://openlayers.org/en/latest/apidoc/ol.source.WMTS.html#.optionsFromCapabilities
     * @returns {object} an object containing WMTS capabilities options for the layer or false if the matchup failed
     * @memberof MapUtil
     */
    static getWmsOptions(options) {
        // console.log(options);
        const capabilities = options.capabilities;
        const layerOptions = options.options;
        const requestOptions = options.requestOptions;

        const url = requestOptions.url.split("?")[0].split("#")[0];
        const layerId = layerOptions.layer;

        const layers = capabilities.Capability.Layer.Layer.reduce((acc, el) => {
            // max three deep: Layer.Layer[].Layer[]
            if (el.Layer) {
                return acc.concat(el.Layer);
            }
            return acc.concat([el]);
        }, []);
        const layerData = layers.find((layer) => layerId === layer.Name);
        if (layerData) {
            const bb = layerData.BoundingBox.find((b) => Ol_Proj.get(b.crs));
            if (bb) {
                const extents = bb.extent;
                const proj = Ol_Proj.get(bb.crs).getCode();

                // throw new Error("fack");
                return {
                    url: url,
                    layer: layerId,
                    projection: proj,
                    extents: extents,
                };
            } else {
                console.warn("Error in MapUtil.getWmsOptions: Failed to projection layer", options);
                return false;
            }
        } else {
            console.warn("Error in MapUtil.getWmsOptions: Failed to match layer", options);
            return false;
        }
    }

    /**
     * Sets the proj4 instance used by openlayers and initializes the default
     * projection data within that instance
     *
     * @static
     * @param {object|array} [projectionList=appConfig.DEFAULT_AVAILABLE_PROJECTIONS] the projection configuration
     * or list of configurations to be prepped. If ommitted, this function will prep all default projections
     * - code - {string} the identifier for this projection
     * - proj4Def - {string} the proj4js definition
     * - extent - {array} valid extents for this projection [minx, miny, maxx, maxy]
     * - aliases - {array} list of string aliases for this projection code
     * @returns {object} the openlayers projection object for the default projection
     * @memberof MapUtil
     */
    static prepProjection(projectionList = appConfig.DEFAULT_AVAILABLE_PROJECTIONS) {
        // initially assign the proj4js instance to openlayers
        Ol_Proj4_register(proj4js);

        // make sure we're using a list
        if (!(projectionList instanceof Array)) {
            projectionList = [projectionList];
        }

        // prep all specified projections
        for (let i = 0; i < projectionList.length; ++i) {
            let projection = projectionList[i];

            // add configured projection
            let proj4Def = proj4js.defs(projection.code);
            if (typeof proj4Def === "undefined") {
                proj4js.defs(projection.code, projection.proj4Def);
                Ol_Proj4_register(proj4js); // catch registry updates
                Ol_Proj.get(projection.code).setExtent(projection.extent);
            }

            // load aliases
            if (typeof projection.aliases !== "undefined") {
                for (let i = 0; i < projection.aliases.length; ++i) {
                    proj4js.defs(projection.aliases[i], proj4js.defs(projection.code));
                    Ol_Proj4_register(proj4js); // catch registry updates
                }
            }
        }

        return Ol_Proj.get(appConfig.DEFAULT_PROJECTION.code);
    }

    /**
     * Generates a WMTS tile url from the provided options
     *
     * @static
     * @param {object} options options for constructing the url
     * - layerId - {string} layer identifier
     * - url - {string} base url template
     * - tileMatrixSet - {string} tile matrix
     * - tileMatrixLabels - {object} mapping of zoom level to string representing that level in the url (optional)
     * - col - {string|number} column number of this tile
     * - row - {string|number} row number of this tile
     * - format - {string} data format of this tile (image/png, image/jpg, etc)
     * - context - {string} context this tile was requested from (if openlayers, then the row is inverted and shifted)
     *
     * @returns {string} a url string for the WMTS tile
     * @memberof MapUtil
     */
    static buildWmtsTileUrl(options) {
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

        let tileMatrix =
            typeof tileMatrixLabels !== "undefined" ? tileMatrixLabels[level] : level.toString();

        if (url.indexOf("{") >= 0) {
            // resolve tile-URL template
            url = url
                .replace("{TileMatrixSet}", tileMatrixSet)
                .replace("{TileMatrix}", tileMatrix)
                .replace("{TileRow}", row.toString())
                .replace("{TileCol}", col.toString());
        } else {
            // build KVP request
            let queryOptions = Immutable.OrderedMap({
                SERVICE: "WMTS",
                REQUEST: "GetTile",
                VERSION: "1.0.0",
                LAYER: layerId,
                STYLE: "",
                TILEMATRIXSET: tileMatrixSet,
                TILEMATRIX: tileMatrix,
                TILEROW: row,
                TILECOL: col,
                FORMAT: encodeURIComponent(format),
            });

            let queryStr = this.miscUtil.objectToUrlParams(queryOptions);

            url = url.replace("?", "");
            url = url + "?" + queryStr;
        }

        return url;
    }

    /**
     * Format distance according to the provided units
     * input assumed in correct base units (meters/feet vs kilometers/miles)
     *
     * @static
     * @param {number} distance the number to format
     * @param {string} units the units to format this number into (metric, imperial, nautical, schoolbus)
     * @returns {string} representing a formatted version of the value passed in
     * @memberof MapUtil
     */
    static formatDistance(distance, units) {
        // Type check on distance
        if (typeof distance !== "number") {
            return null;
        }

        let number, unitsStr;
        if (units === "metric") {
            if (Math.abs(distance) >= 1000) {
                number = distance / 1000;
                unitsStr = "km";
            } else {
                number = distance;
                unitsStr = "m";
            }
        } else if (units === "imperial") {
            if (Math.abs(distance) >= 5280) {
                number = distance / 5280;
                unitsStr = "mi";
            } else {
                number = distance;
                unitsStr = "ft";
            }
        } else if (units === "nautical") {
            number = distance;
            unitsStr = "nmi";
        } else if (units === "schoolbus") {
            number = distance;
            unitsStr = "school buses";
        } else {
            return null;
        }

        return this.formatNumber(number, { trim: false }) + " " + unitsStr;
    }

    /**
     * Format area according to the provided units
     * input assumed in correct base units (meters/feet vs kilometers/miles)
     *
     * @static
     * @param {number} area the number to format
     * @param {string} units the units to format this number into (metric, imperial, nautical, schoolbus)
     * @returns {string} representing a formatted version of the value passed in
     * @memberof MapUtil
     */
    static formatArea(area, units) {
        // Type check on area
        if (typeof area !== "number") {
            return null;
        }

        let number, unitsStr;
        if (units === "metric") {
            if (Math.abs(area) >= 1000000) {
                number = area / 1000000;
                unitsStr = "km<sup>2</sup>";
            } else {
                number = area;
                unitsStr = "m<sup>2</sup>";
            }
        } else if (units === "imperial") {
            if (Math.abs(area) >= 27878400) {
                number = area / 27878400;
                unitsStr = "mi<sup>2</sup>";
            } else {
                number = area;
                unitsStr = "ft<sup>2</sup>";
            }
        } else if (units === "nautical") {
            number = area;
            unitsStr = "nmi<sup>2</sup>";
        } else if (units === "schoolbus") {
            number = area;
            unitsStr = "school buses<sup>2</sup>";
        } else {
            return null;
        }

        return this.formatNumber(number, { trim: false }) + " " + unitsStr;
    }

    /**
     * Format a number as a string with commas and fixed decimal places
     *
     * @static
     * @param {number} number the number to format
     * @param {object} options options for the formatting
     * - fixedLen - {number} number of decimal places to format (default 2)
     * - trim - {boolean} true if the formatted number should remove trailing 0s after the decimal ("1.20" --> "1.2")
     * @returns {string} string of the formatted number
     * @memberof MapUtil
     */
    static formatNumber(number, options = {}) {
        let fixedLen = typeof options.fixedLen !== "undefined" ? options.fixedLen : 2;
        let numberStr = options.trim
            ? this.trimFloatString(number.toFixed(fixedLen))
            : number.toFixed(fixedLen);
        let parts = numberStr.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    /**
     * Converts area in meters to another unit
     *
     * @static
     * @param {number} value the value, in meters squared, to convert
     * @param {string} units string representing the desired units
     * @returns {number} input value converted to specified units
     * @memberof MapUtil
     */
    static convertAreaUnits(value, units) {
        let unitEntry = this.miscUtil.findObjectInArray(appConfig.SCALE_OPTIONS, "value", units);
        if (units === "schoolbus") {
            return value / Math.pow(unitEntry.toMeters, 2);
        } else {
            return Qty(value, "m^2").to(unitEntry.qtyType + "^2").scalar;
        }
    }

    /**
     * Converts distance in meters to another unit
     *
     * @static
     * @param {number} value the value, in meters, to convert
     * @param {string} units string representing the desired units
     * @returns {number} input value converted to specified units
     * @memberof MapUtil
     */
    static convertDistanceUnits(value, units) {
        let unitEntry = this.miscUtil.findObjectInArray(appConfig.SCALE_OPTIONS, "value", units);
        if (units === "schoolbus") {
            return value / unitEntry.toMeters;
        } else {
            return Qty(value, "m").to(unitEntry.qtyType).scalar;
        }
    }

    /**
     * remove trailing zeros from fixed width float string
     *
     * @static
     * @param {string} value string representing float number to trim
     * @returns {string} string float with trailing 0s removed
     * @memberof MapUtil
     */
    static trimFloatString(value) {
        return parseFloat(value).toString();
    }

    /**
     * Calculates the distance of a polyline using turf
     * Reprojects into EPSG-4326 first
     * Expects an array of coordinates in form
     *
     * @static
     * @param {array} coords array of polyline coordintes [ [lon,lat], ... ]
     * @param {string} proj projection of the coordinates
     * @returns {number} distance of the polyline in meters or 0 if it fails
     * @memberof MapUtil
     */
    static calculatePolylineDistance(coords, proj) {
        try {
            // Reproject from source to EPSG:4326
            let newCoords = coords.map((coord) =>
                proj4js(proj, appStrings.PROJECTIONS.latlon.code, coord)
            );
            // Calculate line distance
            return turfLineDistance(
                {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: newCoords,
                    },
                },
                "meters"
            );
        } catch (err) {
            console.warn("Error in MapUtil.calculatePolylineDistance: ", err);
            return 0;
        }
    }

    /**
     * Calculates the area of a polyline using turf
     * Reprojects into EPSG-4326 first
     *
     * @static
     * @param {array} coords array of polygon coordintes [ [lon,lat], ... ]
     * @param {string} proj projection of the coordinates
     * @returns {number} area of the polygon in meters or 0 if it fails
     * @memberof MapUtil
     */
    static calculatePolygonArea(coords, proj) {
        // Reproject from source to EPSG:4326
        let newCoords = coords.map((coord) =>
            proj4js(proj, appStrings.PROJECTIONS.latlon.code, coord)
        );
        // Calculate line distance
        return turfArea(
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Polygon",
                    coordinates: [newCoords],
                },
            },
            "meters"
        );
    }

    /**
     * Calculates center point of a polygon using turf
     * Reprojects into EPSG-4326 first
     *
     * @static
     * @param {array} coords array of polygon coordinates [ [lon,lat], ... ]
     * @param {string} proj projection of the coordinates
     * @returns {array} center coordinate of the polygon
     * @memberof MapUtil
     */
    static calculatePolygonCenter(coords, proj) {
        // Reproject from source to EPSG:4326
        let newCoords = coords.map((coord) =>
            proj4js(proj, appStrings.PROJECTIONS.latlon.code, coord)
        );
        // Calculate center
        return turfCentroid(
            {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "Polygon",
                            coordinates: [newCoords],
                        },
                    },
                ],
            },
            "meters"
        ).geometry.coordinates;
    }

    /**
     * Generate set of geodesic arc line segments for a polyline
     * assumes EPSG-4326
     *
     * @static
     * @param {array} coords line segment coordinates [[lat, lon], ...]
     * @returns {array} set of line segments [[[lat, lon], ...], ...]
     * @memberof MapUtil
     */
    static generateGeodesicArcsForLineString(coords) {
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
                        coord[0] += 360 * shift;
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

    /**
     * takes in a geometry and measurement type and
     * returns a string measurement of that geometry
     *
     * @static
     * @param {object} geometry the geometry to be measured
     * - type - {string} describe the type of geometry (Circle|LineString|Polygon)
     * - coordinates - {array} array of coordinate objects
     *   - [{lon: {number}, lat: {number}}, ...]
     * - proj - {string} projection of the of the coordinates
     *
     * @param {string} measurementType type of measurement (Distance|Area)
     * @returns {string} measurement
     * @memberof MapUtil
     */
    static measureGeometry(geometry, measurementType) {
        if (geometry.type === appStrings.GEOMETRY_CIRCLE) {
            console.warn(
                "Error in MapUtil.measureGeometry: Could not measure geometry, unsupported geometry type: ",
                geometry.type
            );
            return false;
        }
        let coords = geometry.coordinates.map((x) =>
            proj4js(geometry.proj, appStrings.PROJECTIONS.latlon.code, [x.lon, x.lat])
        );
        coords = this.generateGeodesicArcsForLineString(coords);
        if (measurementType === appStrings.MEASURE_DISTANCE) {
            if (geometry.type === appStrings.GEOMETRY_LINE_STRING) {
                return this.calculatePolylineDistance(coords, appStrings.PROJECTIONS.latlon.code);
            } else {
                console.warn(
                    "Error in MapUtil.measureGeometry: Could not measure distance, unsupported geometry type: ",
                    geometry.type
                );
                return false;
            }
        } else if (measurementType === appStrings.MEASURE_AREA) {
            if (geometry.type === appStrings.GEOMETRY_POLYGON) {
                return this.calculatePolygonArea(coords, appStrings.PROJECTIONS.latlon.code);
            } else {
                console.warn(
                    "Error in MapUtil.measureGeometry: Could not measure area, unsupported geometry type: ",
                    geometry.type
                );
                return false;
            }
        } else {
            console.warn(
                "Error in MapUtil.measureGeometry: Could not measure geometry, unsupported measurement type: ",
                measurementType
            );
            return false;
        }
    }

    /**
     * format a measurement for distance or area
     *
     * @static
     * @param {number} measurement the value of the measurement
     * @param {string} measurementType (Distance|Area)
     * @param {string} units (metric|imperial|nautical|schoolbus)
     * @returns {string} formatted measurement
     * @memberof MapUtil
     */
    static formatMeasurement(measurement, measurementType, units) {
        if (measurementType === appStrings.MEASURE_DISTANCE) {
            return this.formatDistance(measurement, units);
        } else if (measurementType === appStrings.MEASURE_AREA) {
            return this.formatArea(measurement, units);
        } else {
            console.warn(
                "Error in MapUtil.formatMeasurement: Could not format measurement, unsupported measurement type: ",
                measurementType
            );
            return false;
        }
    }

    // takes in a geometry and returns the coordinates for its label
    /**
     * calculate the position of a label for a given geometry.
     * End point of a polyline, center of a polygon.
     *
     * @static
     * @param {object} geometry to get a label for
     * - type - {string} describe the type of geometry (Circle|LineString|Polygon)
     * - coordinates - {array} array of coordinate objects
     *   - [{lon: {number}, lat: {number}}, ...]
     * - proj - {string} projection of the of the coordinates
     * @returns {array} constrained coordinates of the label position
     * @memberof MapUtil
     */
    static getLabelPosition(geometry) {
        if (geometry.type === appStrings.GEOMETRY_LINE_STRING) {
            let lastCoord = geometry.coordinates[geometry.coordinates.length - 1];
            if (lastCoord) {
                // Convert from geometry proj to latlon so we can constrain coords
                let latLonLastCoord = proj4js(geometry.proj, appStrings.PROJECTIONS.latlon.code, [
                    lastCoord.lon,
                    lastCoord.lat,
                ]);
                let constrainedLastCoord = this.constrainCoordinates([
                    latLonLastCoord[0],
                    latLonLastCoord[1],
                ]);
                // Convert from latlon back to geometry proj
                return proj4js(
                    appStrings.PROJECTIONS.latlon.code,
                    geometry.proj,
                    constrainedLastCoord
                );
            } else {
                console.warn(
                    "Error in MapUtil.getLabelPosition: Could not find label placement, no coordinates in geometry."
                );
                return false;
            }
        } else if (geometry.type === appStrings.GEOMETRY_POLYGON) {
            // Convert from geometry proj to latlon
            let coords = geometry.coordinates.map((x) =>
                proj4js(geometry.proj, appStrings.PROJECTIONS.latlon.code, [x.lon, x.lat])
            );

            let arcCoords = this.generateGeodesicArcsForLineString(coords);
            let centerCoord = this.calculatePolygonCenter(
                arcCoords,
                appStrings.PROJECTIONS.latlon.code
            );
            let constrainedCoord = this.constrainCoordinates(centerCoord);
            // Convert from latlon back to geometry proj
            return proj4js(appStrings.PROJECTIONS.latlon.code, geometry.proj, constrainedCoord);
        } else {
            console.warn(
                "Error in MapUtil.getLabelPosition: Could not find label placement, unsupported geometry type: ",
                geometry.type
            );
            return false;
        }
    }

    /**
     * parse an array of strings representing a bounding box into an array of floats
     *
     * @static
     * @param {array} extentStrArr set of floats or float strings
     * @returns {array|boolean} list of floats or false if unable to generate a valid extent from the input
     * @memberof MapUtil
     */
    static parseStringExtent(extentStrArr) {
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

    /**
     * format lat lon pair for display in cardinal directions
     *
     * @static
     * @param {number} lat
     * @param {number} lon
     * @param {boolean} isValid
     * @returns {string}
     * @memberof MapUtil
     */
    static formatLatLon(lat, lon, isValid) {
        let latUnit = lat >= 0 ? "°E" : "°W";
        let lonUnit = lon >= 0 ? "°N" : "°S";

        let currCoord =
            MiscUtil.padNumber(Math.abs(lon).toFixed(3), 5, "&nbsp;") +
            lonUnit +
            "," +
            MiscUtil.padNumber(Math.abs(lat).toFixed(3), 6, "&nbsp;") +
            latUnit;

        return isValid ? currCoord : " ------" + lonUnit + ", ------" + latUnit;
    }
}
