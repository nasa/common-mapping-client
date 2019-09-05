/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from "chai";
import Immutable from "immutable";
import MapUtil from "_core/utils/MapUtil";
import * as appStrings from "_core/constants/appStrings";
import TileHandler from "_core/utils/TileHandler";
import * as expectedArcs from "_core/tests/data/expectedOutputs/generatedGeodesicArcs";

// const mapUtil = new MapUtil();
// const tileHandler = new TileHandler();
const roundFn = arr => arr.map(x => x.map(z => z.toFixed(6)));

export const MapUtilSpec = {
    name: "MapUtilSpec",
    tests: {
        constrainCoordinates: {
            test1: () => {
                it(
                    "takes in a set of LatLon coordinates [lon,lat] that may be outside " +
                        "the [-180, -90, 180, 90] bounds and contrains them the the [-180, -90, 180, 90] bounds.",
                    () => {
                        let varIn = [190, -100];
                        let varOut = [-170, -90];

                        //assert
                        expect(MapUtil.constrainCoordinates(varIn)).to.deep.equal(varOut);
                    }
                );
            },
            test2: () => {
                it("Wraps longitude values outside [-180, 180] around the [-180, 180] line", () => {
                    let varIn1 = [270, 50];
                    let varOut1 = [-90, 50];

                    let varIn2 = [-270, 50];
                    let varOut2 = [90, 50];

                    let varIn3 = [321, 50];
                    let varOut3 = [-39, 50];

                    let varIn4 = [-400, 50];
                    let varOut4 = [-40, 50];

                    let varIn5 = [400, 50];
                    let varOut5 = [40, 50];

                    //assert
                    expect(MapUtil.constrainCoordinates(varIn1)).to.deep.equal(varOut1);
                    expect(MapUtil.constrainCoordinates(varIn2)).to.deep.equal(varOut2);
                    expect(MapUtil.constrainCoordinates(varIn3)).to.deep.equal(varOut3);
                    expect(MapUtil.constrainCoordinates(varIn4)).to.deep.equal(varOut4);
                    expect(MapUtil.constrainCoordinates(varIn5)).to.deep.equal(varOut5);
                });
            },
            test3: () => {
                it("Limits latitude values outside [-90, 90] to the [-90, 90] line", () => {
                    let varIn1 = [50, 270];
                    let varOut1 = [50, 90];

                    let varIn2 = [50, -270];
                    let varOut2 = [50, -90];

                    let varIn3 = [50, 321];
                    let varOut3 = [50, 90];

                    //assert
                    expect(MapUtil.constrainCoordinates(varIn1)).to.deep.equal(varOut1);
                    expect(MapUtil.constrainCoordinates(varIn2)).to.deep.equal(varOut2);
                    expect(MapUtil.constrainCoordinates(varIn3)).to.deep.equal(varOut3);
                });
            },
            test4: () => {
                it("Leaves coordinates within the [-180, -90, 180, 90] unchanged", () => {
                    let varIn1 = [50, 50];
                    let varOut1 = [50, 50];

                    let varIn2 = [180, 90];
                    let varOut2 = [180, 90];

                    let varIn3 = [-180, -90];
                    let varOut3 = [-180, -90];

                    let varIn4 = [0, 0];
                    let varOut4 = [0, 0];

                    //assert
                    expect(MapUtil.constrainCoordinates(varIn1)).to.deep.equal(varOut1);
                    expect(MapUtil.constrainCoordinates(varIn2)).to.deep.equal(varOut2);
                    expect(MapUtil.constrainCoordinates(varIn3)).to.deep.equal(varOut3);
                    expect(MapUtil.constrainCoordinates(varIn4)).to.deep.equal(varOut4);
                });
            },
            test5: () => {
                it("can optionally wrap the y coordinate instead of simply capping it to +-90", () => {
                    let varIn = [190, -100];
                    let varOut = [-170, 80];

                    //assert
                    expect(MapUtil.constrainCoordinates(varIn, false)).to.deep.equal(varOut);
                });
            },
            test6: () => {
                it("optionally wraps latitude values outside [-90, 90] around the [-90, 90] line", () => {
                    let varIn1 = [50, 180];
                    let varOut1 = [50, 0];

                    let varIn2 = [50, -269];
                    let varOut2 = [50, -89];

                    let varIn3 = [50, 321];
                    let varOut3 = [50, -39];

                    let varIn4 = [50, 50];
                    let varOut4 = [50, 50];

                    //assert

                    expect(MapUtil.constrainCoordinates(varIn1, false)).to.deep.equal(varOut1);
                    expect(MapUtil.constrainCoordinates(varIn2, false)).to.deep.equal(varOut2);
                    expect(MapUtil.constrainCoordinates(varIn3, false)).to.deep.equal(varOut3);
                    expect(MapUtil.constrainCoordinates(varIn4, false)).to.deep.equal(varOut4);
                });
            },
            test7: () => {
                it("Returns false with bad input", () => {
                    let varIn1 = "cats";
                    let varOut1 = false;

                    let varIn2 = ["cats", "dogs"];
                    let varOut2 = false;

                    //assert
                    expect(MapUtil.constrainCoordinates(varIn1)).to.deep.equal(varOut1);
                    expect(MapUtil.constrainCoordinates(varIn2)).to.deep.equal(varOut2);
                });
            }
        },
        deconstrainArcCoordinates: {
            test1: () => {
                it("returns the original polyline when given a single polyline", () => {
                    let linesArr = [[[0, 0], [1, 1], [40, 40]]];
                    expect(MapUtil.deconstrainArcCoordinates(linesArr)).to.deep.equal(linesArr);
                });
            },

            test2: () => {
                it("deconstrains where first line end has -lon and second line start has +lon", () => {
                    let linesArrIn = [
                        [[0, 0], [-5, -5], [-90, 0]],
                        [[90, 0], [-100, 0], [-105, 40]]
                    ];
                    let linesArrOut = [[0, 0], [-5, -5], [-90, 0], [-460, 0], [-465, 40]];
                    expect(MapUtil.deconstrainArcCoordinates(linesArrIn)).to.deep.equal(
                        linesArrOut
                    );
                });
            },
            test3: () => {
                it("deconstrains where first line end has -lon and second line start has -lon", () => {
                    let linesArrIn = [
                        [[0, 0], [-5, -5], [-90, 0]],
                        [[-90, 0], [-100, 0], [-105, 40]]
                    ];
                    let linesArrOut = [[0, 0], [-5, -5], [-90, 0], [-100, 0], [-105, 40]];
                    expect(MapUtil.deconstrainArcCoordinates(linesArrIn)).to.deep.equal(
                        linesArrOut
                    );
                });
            },
            test4: () => {
                it("deconstrains where first line end has +lon and second line start has +lon", () => {
                    let linesArrIn = [[[0, 0], [-5, -5], [90, 0]], [[90, 0], [-100, 0], [105, 40]]];
                    let linesArrOut = [[0, 0], [-5, -5], [90, 0], [-100, 0], [105, 40]];
                    expect(MapUtil.deconstrainArcCoordinates(linesArrIn)).to.deep.equal(
                        linesArrOut
                    );
                });
            },
            test5: () => {
                it("deconstrains where first line end has +lon and second line start has +lon", () => {
                    let linesArrIn = [
                        [[0, 0], [-5, -5], [90, 0]],
                        [[-90, 0], [-100, 0], [105, 40]]
                    ];
                    let linesArrOut = [[0, 0], [-5, -5], [90, 0], [260, 0], [465, 40]];
                    expect(MapUtil.deconstrainArcCoordinates(linesArrIn)).to.deep.equal(
                        linesArrOut
                    );
                });
            }
        },
        buildWmtsTileUrl: {
            test1: () => {
                it("takes in a set WMTS url params and returns a valid WMTS tile url.", () => {
                    let varIn1 = {
                        url: "http://fakeTile.com/getTile",
                        layerId: "layerId",
                        tileMatrixSet: "tileMatrixSet",
                        col: 0,
                        row: 0,
                        level: 0,
                        format: "format",
                        context: appStrings.MAP_LIB_2D
                    };
                    let varOut1 =
                        "http://fakeTile.com/getTile?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=layerId&STYLE=&TILEMATRIXSET=tileMatrixSet&TILEMATRIX=0&TILEROW=-1&TILECOL=0&FORMAT=format";

                    let varIn2 = {
                        url: "http://fakeTile.com/getTile",
                        layerId: "layerId",
                        tileMatrixSet: "tileMatrixSet",
                        tileMatrixLabels: ["0", "1", "2"],
                        col: 0,
                        row: 0,
                        level: 0,
                        format: "format"
                    };
                    let varOut2 =
                        "http://fakeTile.com/getTile?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=layerId&STYLE=&TILEMATRIXSET=tileMatrixSet&TILEMATRIX=0&TILEROW=0&TILECOL=0&FORMAT=format";

                    //assert
                    expect(MapUtil.buildWmtsTileUrl(varIn1)).to.equal(varOut1);
                    expect(MapUtil.buildWmtsTileUrl(varIn2)).to.equal(varOut2);
                });
            },
            test2: () => {
                it("Accepts a restful url and populates the provided fields.", () => {
                    let varIn = {
                        url:
                            "http://fakeTile.com/getTile/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}",
                        layerId: "layerId",
                        tileMatrixSet: "tileMatrixSetStr",
                        col: 0,
                        row: 0,
                        level: 0,
                        format: "format"
                    };
                    let varOut = "http://fakeTile.com/getTile/tileMatrixSetStr/0/0/0";

                    //assert
                    expect(MapUtil.buildWmtsTileUrl(varIn)).to.equal(varOut);
                });
            }
        },
        getUrlFunction: {
            test1: () => {
                it("takes a function string and returns a function associated with it", () => {
                    //assert
                    expect(
                        typeof TileHandler.getUrlFunction(appStrings.DEFAULT_URL_FUNC_WMTS)
                    ).to.equal("function");
                    expect(typeof TileHandler.getUrlFunction(appStrings.ESRI_CUSTOM_512)).to.equal(
                        "function"
                    );
                    expect(
                        typeof TileHandler.getUrlFunction(appStrings.KVP_TIME_PARAM_WMTS)
                    ).to.equal("function");
                    expect(typeof TileHandler.getUrlFunction(appStrings.CATS_URL)).to.equal(
                        "function"
                    );
                });
            },
            test2: () => {
                it("returns undefined on unmatched function string", () => {
                    expect(TileHandler.getUrlFunction()).to.equal(undefined);
                    expect(TileHandler.getUrlFunction("bleh")).to.equal(undefined);
                });
            }
        },
        getTileFunction: {
            test1: () => {
                it("takes a function string and returns the tile load function associated with it", () => {
                    //assert
                    expect(typeof TileHandler.getTileFunction(appStrings.CATS_TILE_OL)).to.equal(
                        "function"
                    );
                    expect(typeof TileHandler.getTileFunction(appStrings.CATS_TILE_CS)).to.equal(
                        "function"
                    );
                });
            },
            test2: () => {
                it("returns undefined on unmatched function string", () => {
                    expect(TileHandler.getTileFunction()).to.equal(undefined);
                    expect(TileHandler.getTileFunction("bleh")).to.equal(undefined);
                });
            }
        },
        formatDistance: {
            test1: () => {
                it("fails on bad input", () => {
                    expect(MapUtil.formatDistance(null, null)).to.equal(null);
                    expect(MapUtil.formatDistance(null, "cats")).to.equal(null);
                    expect(MapUtil.formatDistance(null, "metric")).to.equal(null);
                    expect(MapUtil.formatDistance("cats", "metric")).to.equal(null);
                    expect(MapUtil.formatDistance([0, 1, 2], "metric")).to.equal(null);
                    expect(MapUtil.formatDistance(0, "fleebles")).to.equal(null);
                });
            },
            test2: () => {
                it("formats distance in meters", () => {
                    expect(MapUtil.formatDistance(0, "metric")).to.equal("0.00 m");
                    expect(MapUtil.formatDistance(0.001, "metric")).to.equal("0.00 m");
                    expect(MapUtil.formatDistance(0.01, "metric")).to.equal("0.01 m");
                    expect(MapUtil.formatDistance(100, "metric")).to.equal("100.00 m");
                    expect(MapUtil.formatDistance(999.99, "metric")).to.equal("999.99 m");
                });
            },
            test3: () => {
                it("formats distance in kilometers", () => {
                    expect(MapUtil.formatDistance(1000, "metric")).to.equal("1.00 km");
                    expect(MapUtil.formatDistance(12345.567, "metric")).to.equal("12.35 km");
                    expect(MapUtil.formatDistance(-10000000, "metric")).to.equal("-10,000.00 km");
                });
            },
            test4: () => {
                it("formats distance in feet", () => {
                    expect(MapUtil.formatDistance(0, "imperial")).to.equal("0.00 ft");
                    expect(MapUtil.formatDistance(0.01, "imperial")).to.equal("0.01 ft");
                    expect(MapUtil.formatDistance(1, "imperial")).to.equal("1.00 ft");
                    expect(MapUtil.formatDistance(5279.99, "imperial")).to.equal("5,279.99 ft");
                });
            },
            test5: () => {
                it("formats distance in miles", () => {
                    expect(MapUtil.formatDistance(5280, "imperial")).to.equal("1.00 mi");
                    expect(MapUtil.formatDistance(-16896, "imperial")).to.equal("-3.20 mi");
                });
            },
            test6: () => {
                it("formats distance in nautical miles", () => {
                    expect(MapUtil.formatDistance(0, "nautical")).to.equal("0.00 nmi");
                    expect(MapUtil.formatDistance(1000, "nautical")).to.equal("1,000.00 nmi");
                    expect(MapUtil.formatDistance(-123.543, "nautical")).to.equal("-123.54 nmi");
                });
            },
            test7: () => {
                it("formats distance in school buses", () => {
                    expect(MapUtil.formatDistance(0, "schoolbus")).to.equal("0.00 school buses");
                    expect(MapUtil.formatDistance(1000, "schoolbus")).to.equal(
                        "1,000.00 school buses"
                    );
                    expect(MapUtil.formatDistance(123.543, "schoolbus")).to.equal(
                        "123.54 school buses"
                    );
                });
            }
        },
        formatArea: {
            test1: () => {
                it("fails on bad input", () => {
                    expect(MapUtil.formatArea(null, null)).to.equal(null);
                    expect(MapUtil.formatArea(null, "cats")).to.equal(null);
                    expect(MapUtil.formatArea(null, "metric")).to.equal(null);
                    expect(MapUtil.formatArea("cats", "metric")).to.equal(null);
                    expect(MapUtil.formatArea([0, 1, 2], "metric")).to.equal(null);
                    expect(MapUtil.formatArea(0, "fleebles")).to.equal(null);
                });
            },
            test2: () => {
                it("formats area in meters", () => {
                    expect(MapUtil.formatArea(0, "metric")).to.equal("0.00 m<sup>2</sup>");
                    expect(MapUtil.formatArea(0.01, "metric")).to.equal("0.01 m<sup>2</sup>");
                    expect(MapUtil.formatArea(100, "metric")).to.equal("100.00 m<sup>2</sup>");
                    expect(MapUtil.formatArea(1000, "metric")).to.equal("1,000.00 m<sup>2</sup>");
                    expect(MapUtil.formatArea(10000, "metric")).to.equal("10,000.00 m<sup>2</sup>");
                });
            },
            test3: () => {
                it("formats area in kilometers", () => {
                    expect(MapUtil.formatArea(1000000, "metric")).to.equal("1.00 km<sup>2</sup>");
                    expect(MapUtil.formatArea(-12345453.3222, "metric")).to.equal(
                        "-12.35 km<sup>2</sup>"
                    );
                });
            },
            test4: () => {
                it("formats area in feet", () => {
                    expect(MapUtil.formatArea(0, "imperial")).to.equal("0.00 ft<sup>2</sup>");
                    expect(MapUtil.formatArea(100, "imperial")).to.equal("100.00 ft<sup>2</sup>");
                    expect(MapUtil.formatArea(929.0304, "imperial")).to.equal(
                        "929.03 ft<sup>2</sup>"
                    );
                });
            },
            test5: () => {
                it("formats area in miles", () => {
                    expect(MapUtil.formatArea(27878400, "imperial")).to.equal(
                        "1.00 mi<sup>2</sup>"
                    );
                    expect(MapUtil.formatArea(-153300000, "imperial")).to.equal(
                        "-5.50 mi<sup>2</sup>"
                    );
                });
            },
            test6: () => {
                it("formats area in nautical miles", () => {
                    expect(MapUtil.formatArea(0, "nautical")).to.equal("0.00 nmi<sup>2</sup>");
                    expect(MapUtil.formatArea(1235, "nautical")).to.equal(
                        "1,235.00 nmi<sup>2</sup>"
                    );
                    expect(MapUtil.formatArea(0.1245, "nautical")).to.equal("0.12 nmi<sup>2</sup>");
                });
            },
            test7: () => {
                it("formats area in school buses", () => {
                    expect(MapUtil.formatArea(0, "schoolbus")).to.equal(
                        "0.00 school buses<sup>2</sup>"
                    );
                    expect(MapUtil.formatArea(1235, "schoolbus")).to.equal(
                        "1,235.00 school buses<sup>2</sup>"
                    );
                    expect(MapUtil.formatArea(0.1245, "schoolbus")).to.equal(
                        "0.12 school buses<sup>2</sup>"
                    );
                });
            }
        },
        convertDistanceUnits: {
            test1: () => {
                it("converts to metric", () => {
                    expect(MapUtil.convertDistanceUnits(1, "metric").toFixed(2)).to.equal("1.00");
                    expect(MapUtil.convertDistanceUnits(5000, "metric").toFixed(2)).to.equal(
                        "5000.00"
                    );
                    expect(MapUtil.convertDistanceUnits(-47384543, "metric").toFixed(2)).to.equal(
                        "-47384543.00"
                    );
                });
            },
            test2: () => {
                it("converts to imperial", () => {
                    expect(MapUtil.convertDistanceUnits(1, "imperial").toFixed(2)).to.equal("3.28");
                    expect(MapUtil.convertDistanceUnits(3.048, "imperial").toFixed(2)).to.equal(
                        "10.00"
                    );
                    expect(MapUtil.convertDistanceUnits(-914.4, "imperial").toFixed(2)).to.equal(
                        "-3000.00"
                    );
                });
            },
            test3: () => {
                it("converts to nautical", () => {
                    expect(MapUtil.convertDistanceUnits(1852, "nautical").toFixed(2)).to.equal(
                        "1.00"
                    );
                    expect(MapUtil.convertDistanceUnits(1018.6, "nautical").toFixed(2)).to.equal(
                        "0.55"
                    );
                    expect(MapUtil.convertDistanceUnits(-23150, "nautical").toFixed(2)).to.equal(
                        "-12.50"
                    );
                });
            },
            test4: () => {
                it("converts to school buses", () => {
                    expect(MapUtil.convertDistanceUnits(13.72, "schoolbus").toFixed(2)).to.equal(
                        "1.00"
                    );
                    expect(MapUtil.convertDistanceUnits(75.46, "schoolbus").toFixed(2)).to.equal(
                        "5.50"
                    );
                    expect(MapUtil.convertDistanceUnits(-3.1556, "schoolbus").toFixed(2)).to.equal(
                        "-0.23"
                    );
                });
            }
        },
        convertAreaUnits: {
            test1: () => {
                it("converts to metric", () => {
                    expect(MapUtil.convertAreaUnits(1, "metric").toFixed(2)).to.equal("1.00");
                    expect(MapUtil.convertAreaUnits(5000, "metric").toFixed(2)).to.equal("5000.00");
                    expect(MapUtil.convertAreaUnits(-47384543, "metric").toFixed(2)).to.equal(
                        "-47384543.00"
                    );
                });
            },
            test2: () => {
                it("converts to imperial", () => {
                    expect(MapUtil.convertAreaUnits(1, "imperial").toFixed(2)).to.equal("10.76");
                    expect(MapUtil.convertAreaUnits(3.048, "imperial").toFixed(2)).to.equal(
                        "32.81"
                    );
                    expect(MapUtil.convertAreaUnits(-914.4, "imperial").toFixed(2)).to.equal(
                        "-9842.52"
                    );
                });
            },
            test3: () => {
                it("converts to nautical", () => {
                    expect(MapUtil.convertAreaUnits(3430000, "nautical").toFixed(2)).to.equal(
                        "1.00"
                    );
                    expect(MapUtil.convertAreaUnits(18860000, "nautical").toFixed(2)).to.equal(
                        "5.50"
                    );
                    expect(MapUtil.convertAreaUnits(-231500, "nautical").toFixed(2)).to.equal(
                        "-0.07"
                    );
                });
            },
            test4: () => {
                it("converts to school buses", () => {
                    expect(MapUtil.convertAreaUnits(1000, "schoolbus").toFixed(2)).to.equal("5.31");
                    expect(MapUtil.convertAreaUnits(-1223.5496, "schoolbus").toFixed(2)).to.equal(
                        "-6.50"
                    );
                });
            }
        },
        trimFloatString: {
            test1: () => {
                it("removes trailing zeros from fixed width float string", () => {
                    expect(MapUtil.trimFloatString("0.00")).to.equal("0");
                    expect(MapUtil.trimFloatString("0.001")).to.equal("0.001");
                    expect(MapUtil.trimFloatString("1.001")).to.equal("1.001");
                    expect(MapUtil.trimFloatString("1.00100")).to.equal("1.001");
                    expect(MapUtil.trimFloatString("0")).to.equal("0");
                });
            }
        },
        calculatePolylineDistance: {
            test1: () => {
                it("returns 0 for null coordinate input", () => {
                    let proj = "EPSG:4326";
                    let bad1 = [null, null];
                    let bad2 = [null, null];
                    let varIn = [bad1, bad2];
                    let varOut = 0;
                    let actualOut = MapUtil.calculatePolylineDistance(varIn, proj);

                    expect(Math.floor(actualOut)).to.equal(varOut);
                });
            },
            test2: () => {
                it("calculates distances with two identical points", () => {
                    let proj = "EPSG:4326";
                    let sfCoords = [-122.431, 37.732];
                    let sfCoords2 = [-122.431, 37.732];
                    let varIn = [sfCoords, sfCoords2];
                    let varOut = 0;
                    let actualOut = MapUtil.calculatePolylineDistance(varIn, proj);

                    expect(Math.floor(actualOut)).to.equal(varOut);
                });
            },
            test3: () => {
                it("calculates distances with two points", () => {
                    let proj = "EPSG:4326";
                    let sfCoords = [-122.431, 37.732];
                    let manhattanCoords = [-73.948, 40.682];
                    let varIn = [sfCoords, manhattanCoords];
                    let varOut = 4138463;
                    let actualOut = MapUtil.calculatePolylineDistance(varIn, proj);

                    expect(Math.floor(actualOut)).to.equal(varOut);
                });
            }
        },
        calculatePolygonArea: {
            test1: () => {
                it("calculates area with 4 points", () => {
                    let proj = "EPSG:4326";
                    let wyomingCoords = [
                        [-111.054, 45.001],
                        [-111.047, 41.0],
                        [-104.053, 41.0],
                        [-104.058, 44.999]
                    ];
                    let area = 253529970459;
                    expect(Math.floor(MapUtil.calculatePolygonArea(wyomingCoords, proj))).to.equal(
                        area
                    );
                });
            }
        },
        calculatePolygonCenter: {
            test1: () => {
                it("calculates center with 4 points", () => {
                    let proj = "EPSG:4326";
                    let wyomingCoords = [
                        [-111.054, 45.0],
                        [-111.047, 41.0],
                        [-104.053, 41.0],
                        [-104.058, 45.0]
                    ];
                    let center = [-108.718, 42.333333333333336];
                    expect(MapUtil.calculatePolygonCenter(wyomingCoords, proj)).to.deep.equal(
                        center
                    );
                });
            }
        },
        generateGeodesicArcsForLineString: {
            test1: () => {
                it("returns empty array given empty array", () => {
                    let coords = [];
                    expect(MapUtil.generateGeodesicArcsForLineString(coords)).to.deep.equal([]);
                });
            },
            test2: () => {
                it("returns empty array given a point", () => {
                    let coords = [[0, 0], [0, 0]];
                    expect(MapUtil.generateGeodesicArcsForLineString(coords)).to.deep.equal([]);
                });
            },
            test3: () => {
                it("generates geodesic arc for linestring that does not cross dateline", () => {
                    let coordsIn = [[0, 0], [1, 1]];
                    let coordsOut = roundFn(expectedArcs.ARCS.test1);
                    let generatedLineString = roundFn(
                        MapUtil.generateGeodesicArcsForLineString(coordsIn)
                    );
                    expect(generatedLineString).to.deep.equal(coordsOut);
                });
            },
            test4: () => {
                it("generates geodesic arc for linestring that crosses dateline in negative direction", () => {
                    let coordsIn = [[0, 0], [-50, -20], [-250, -20]];
                    let coordsOut = roundFn(expectedArcs.ARCS.test2);
                    let generatedLineString = roundFn(
                        MapUtil.generateGeodesicArcsForLineString(coordsIn)
                    );
                    expect(generatedLineString).to.deep.equal(coordsOut);
                });
            },
            test5: () => {
                it("generates geodesic arc for linestring that crosses dateline in negative direction and crosses back", () => {
                    let coordsIn = [
                        [-92.98828125, 79.1015625],
                        [130.25390625, 1.0546875],
                        [-89.82421875, -18.28125]
                    ];
                    let coordsOut = roundFn(expectedArcs.ARCS.test3);
                    let generatedLineString = roundFn(
                        MapUtil.generateGeodesicArcsForLineString(coordsIn)
                    );
                    expect(generatedLineString).to.deep.equal(coordsOut);
                });
            },
            test6: () => {
                it("generates geodesic arc for linestring that crosses dateline in positive direction", () => {
                    let coordsIn = [[0, 0], [50, -20], [250, -20]];
                    let coordsOut = roundFn(expectedArcs.ARCS.test4);
                    let generatedLineString = roundFn(
                        MapUtil.generateGeodesicArcsForLineString(coordsIn)
                    );
                    expect(generatedLineString).to.deep.equal(coordsOut);
                });
            },
            test7: () => {
                it("generates geodesic arc for linestring that crosses dateline in positive direction and crosses back", () => {
                    let coordsIn = [
                        [141.15234375, 6.328125],
                        [-132.01171875, 4.21875],
                        [142.20703125, -24.2578125]
                    ];
                    let coordsOut = roundFn(expectedArcs.ARCS.test5);
                    let generatedLineString = roundFn(
                        MapUtil.generateGeodesicArcsForLineString(coordsIn)
                    );
                    expect(generatedLineString).to.deep.equal(coordsOut);
                });
            }
        },
        createsMap: {
            // describe('Creates a Map', () => {
            //     beforeEach(function() {
            //         let fixture = '<div id="fixture"><div id="map2D"></div><div id="map3D"></div></div>';
            //         document.body.insertAdjacentHTML('afterbegin', fixture);
            //     });
            //     // remove the html fixture from the DOM
            //     afterEach(function() {
            //         document.body.removeChild(document.getElementById('fixture'));
            //     });
            //     test: () => {
            // it('creates a 2D map when given appStrings.MAP_LIB_2D', () => {
            //         let map = MapUtil.createMap(appStrings.MAP_LIB_2D, 'map2D', Immutable.fromJS({
            //             view: { in3DMode: false }
            //         }));
            //         expect(map.constructor.name).to.equal("MapWrapperOpenlayers");
            //         expect(map.map).to.not.equal(undefined);
            //     })
            //     it('creates a 3D map when given appStrings.MAP_LIB_3D', () => {
            //         let map = MapUtil.createMap(appStrings.MAP_LIB_3D, 'map3D', Immutable.fromJS({
            //             view: { in3DMode: true }
            //         }));
            //         expect(map.constructor.name).to.equal("MapWrapperCesium");
            //         expect(map.map).to.not.equal(undefined);
            //     })
            //     it('returns false when given a non-matching map type', () => {
            //         let map = MapUtil.createMap('4D_MAP', 'map3D', Immutable.fromJS({
            //             view: { in3DMode: true }
            //         }));
            //         expect(map).to.be.false;
            //     })
            // })
        },
        measureGeometry: {
            test1: () => {
                it("returns false when geometry.type is not appStrings.GEOMETRY_LINE_STRING or appStrings.GEOMETRY_POLYGON", () => {
                    let geometryCircle = {
                        type: appStrings.GEOMETRY_CIRCLE,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: "EPSG:4326",
                        center: {
                            lon: 0,
                            lat: 0
                        },
                        radius: 100,
                        id: Math.random()
                    };
                    expect(MapUtil.measureGeometry(geometryCircle, "beepbloop")).to.be.false;
                });
            },
            test2: () => {
                it("returns false when measurementType is not appStrings.MEASURE_DISTANCE or appStrings.MEASURE_AREA", () => {
                    let geometryPolygon = {
                        type: appStrings.GEOMETRY_POLYGON,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: "EPSG:4326",
                        coordinates: [
                            {
                                lon: 0,
                                lat: 0
                            },
                            {
                                lon: 10,
                                lat: 10
                            },
                            {
                                lon: 20,
                                lat: -20
                            }
                        ],
                        id: Math.random()
                    };
                    expect(MapUtil.measureGeometry(geometryPolygon, "beepbloop")).to.be.false;
                });
            },
            test3: () => {
                it("returns false when measurementType is appStrings.MEASURE_DISTANCE and geometry.type is not appStrings.GEOMETRY_LINE_STRING", () => {
                    let geometryPolygon = {
                        type: appStrings.GEOMETRY_POLYGON,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: "EPSG:4326",
                        coordinates: [
                            {
                                lon: 0,
                                lat: 0
                            },
                            {
                                lon: 10,
                                lat: 10
                            },
                            {
                                lon: 20,
                                lat: -20
                            }
                        ],
                        id: Math.random()
                    };
                    expect(MapUtil.measureGeometry(geometryPolygon, appStrings.MEASURE_DISTANCE)).to
                        .be.false;
                });
            },
            test4: () => {
                it("returns false when measurementType is appStrings.MEASURE_AREA and geometry.type is not appStrings.GEOMETRY_POLYGON", () => {
                    let geometryLineString = {
                        type: appStrings.GEOMETRY_LINE_STRING,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: "EPSG:4326",
                        coordinates: [
                            {
                                lon: 0,
                                lat: 0
                            },
                            {
                                lon: 10,
                                lat: 10
                            },
                            {
                                lon: 20,
                                lat: -20
                            }
                        ],
                        id: Math.random()
                    };
                    expect(MapUtil.measureGeometry(geometryLineString, appStrings.MEASURE_AREA)).to
                        .be.false;
                });
            },
            test5: () => {
                it("returns correct measurement when measurementType is appStrings.MEASURE_AREA and geometry.type is appStrings.GEOMETRY_POLYGON", () => {
                    let geometryLineString = {
                        type: appStrings.GEOMETRY_POLYGON,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: "EPSG:4326",
                        coordinates: [
                            {
                                lon: 0,
                                lat: 0
                            },
                            {
                                lon: 10,
                                lat: 10
                            },
                            {
                                lon: 20,
                                lat: -20
                            },
                            {
                                lon: 0,
                                lat: 0
                            }
                        ],
                        id: Math.random()
                    };
                    expect(
                        MapUtil.measureGeometry(
                            geometryLineString,
                            appStrings.MEASURE_AREA
                        ).toFixed(1)
                    ).to.equal((2509284697628.792).toFixed(1));
                });
            },
            test6: () => {
                it("returns correct measurement when measurementType is appStrings.MEASURE_DISTANCE and geometry.type is appStrings.GEOMETRY_LINE_STRING", () => {
                    let geometryLineString = {
                        type: appStrings.GEOMETRY_LINE_STRING,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: "EPSG:4326",
                        coordinates: [
                            {
                                lon: 0,
                                lat: 0
                            },
                            {
                                lon: 10,
                                lat: 10
                            },
                            {
                                lon: 20,
                                lat: -20
                            },
                            {
                                lon: 0,
                                lat: 0
                            }
                        ],
                        id: Math.random()
                    };
                    expect(
                        MapUtil.measureGeometry(
                            geometryLineString,
                            appStrings.MEASURE_DISTANCE
                        ).toFixed(6)
                    ).to.equal((8194386.058827784).toFixed(6));
                });
            }
        },
        formatMeasurement: {
            test1: () => {
                it("returns false when measurementType is not appStrings.MEASURE_DISTANCE or appStrings.MEASURE_AREA", () => {
                    expect(MapUtil.formatMeasurement({}, "beepbloop", "unitz")).to.be.false;
                });
            },
            test2: () => {
                it("returns formatted distance when measurementType is appStrings.MEASURE_DISTANCE", () => {
                    expect(
                        MapUtil.formatMeasurement(0, appStrings.MEASURE_DISTANCE, "imperial")
                    ).to.equal("0.00 ft");
                });
            },
            test3: () => {
                it("returns formatted area when measurementType is appStrings.MEASURE_AREA", () => {
                    expect(
                        MapUtil.formatMeasurement(0, appStrings.MEASURE_AREA, "imperial")
                    ).to.equal("0.00 ft<sup>2</sup>");
                });
            }
        },
        getLabelPosition: {
            test1: () => {
                it("returns false when geometry.type is not appStrings.GEOMETRY_LINE_STRING or appStrings.GEOMETRY_POLYGON", () => {
                    expect(MapUtil.getLabelPosition({ type: "polar bear" })).to.be.false;
                });
            },
            test2: () => {
                it("returns false when geometry.type is appStrings.GEOMETRY_LINE_STRING and geometry.coordinates is empty", () => {
                    expect(
                        MapUtil.getLabelPosition({
                            type: appStrings.GEOMETRY_LINE_STRING,
                            coordinates: []
                        })
                    ).to.be.false;
                });
            }
        },
        parseStringExtent: {
            test1: () => {
                it("returns false when extent is not of type Array", () => {
                    expect(MapUtil.parseStringExtent()).to.be.false;
                    expect(MapUtil.parseStringExtent("dog")).to.be.false;
                    expect(MapUtil.parseStringExtent(1)).to.be.false;
                    expect(MapUtil.parseStringExtent({ a: 1 })).to.be.false;
                });
                it("returns false when extent is not of length 4", () => {
                    expect(MapUtil.parseStringExtent([])).to.be.false;
                    expect(MapUtil.parseStringExtent([1, 2, 3])).to.be.false;
                    expect(MapUtil.parseStringExtent([1, 2, 3, 5, 5])).to.be.false;
                });
                it("returns array of floats equivalent to extent.map(x => parseFloat(x)) when passed array of 4 of string floats", () => {
                    expect(MapUtil.parseStringExtent(["1", "1", "1", "1"])).to.deep.equal([
                        1,
                        1,
                        1,
                        1
                    ]);
                    expect(
                        MapUtil.parseStringExtent([
                            "1.1234",
                            "0.3123",
                            "-0.2340192",
                            "13234234.2911"
                        ])
                    ).to.deep.equal([1.1234, 0.3123, -0.2340192, 13234234.2911]);
                });
                it("returns array of floats equivalent to extent.map(x => parseFloat(x)) when passed array of 4 of float floats", () => {
                    expect(MapUtil.parseStringExtent([1, 1, 1, 1])).to.deep.equal([1, 1, 1, 1]);
                    expect(
                        MapUtil.parseStringExtent([1.1234, 0.3123, -0.2340192, 13234234.2911])
                    ).to.deep.equal([1.1234, 0.3123, -0.2340192, 13234234.2911]);
                });
            }
        },
        formatLatLon: {
            test1: () => {
                it("returns the default string when isValid is false", () => {
                    expect(MapUtil.formatLatLon(0, 0, false)).to.equal(" ------°N, ------°E");
                });
                it("returns lat lon in correctly formatted cardinal directions", () => {
                    expect(MapUtil.formatLatLon(25, 45, true)).to.equal("45.000°N,&nbsp;25.000°E");
                    expect(MapUtil.formatLatLon(-25, 45, true)).to.equal("45.000°N,&nbsp;25.000°W");
                    expect(MapUtil.formatLatLon(25, -45, true)).to.equal("45.000°S,&nbsp;25.000°E");
                    expect(MapUtil.formatLatLon(-25, -45, true)).to.equal(
                        "45.000°S,&nbsp;25.000°W"
                    );
                });
            }
        }
    }
};
