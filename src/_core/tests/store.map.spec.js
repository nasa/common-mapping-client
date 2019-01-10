/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actionTypes from "_core/constants/actionTypes";
import * as appStrings from "_core/constants/appStrings";
import appConfig from "constants/appConfig";
import * as mapActions from "_core/actions/mapActions";
import * as initialIngest from "_core/tests/data/expectedOutputs/initialIngest";
import * as activateInactivateLayers from "_core/tests/data/expectedOutputs/activateInactivateLayers";
import { createStore, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { expect } from "chai";
import rootReducer from "_core/reducers";
import { mapState, layerModel, paletteModel } from "_core/reducers/models/map";
import { asyncState } from "_core/reducers/models/async";
import { helpState } from "_core/reducers/models/help";
import { shareState } from "_core/reducers/models/share";
import { settingsState } from "_core/reducers/models/settings";
import { dateSliderState } from "_core/reducers/models/dateSlider";
import { analyticsState } from "_core/reducers/models/analytics";
import { viewState } from "_core/reducers/models/view";
import { layerInfoState } from "_core/reducers/models/layerInfo";
import { webWorkerState } from "_core/reducers/models/webWorker";
import TestUtil from "_core/tests/TestUtil";
import MiscUtil from "_core/utils/MiscUtil";
import moment from "moment";
import Immutable from "immutable";

const initialState = {
    map: mapState,
    view: viewState,
    asynchronous: asyncState,
    help: helpState,
    settings: settingsState,
    share: shareState,
    dateSlider: dateSliderState,
    analytics: analyticsState,
    layerInfo: layerInfoState,
    webWorker: webWorkerState
};

export const StoreMapSpec = {
    name: "StoreMapSpec",
    beforeEach: () => {
        beforeEach(function() {
            // add the html fixture from the DOM to give maps a place to render during tests
            let fixture = '<div id="fixture"><div id="map2D"></div><div id="map3D"></div></div>';
            document.body.insertAdjacentHTML("afterbegin", fixture);
        });
    },
    afterEach: () => {
        afterEach(function() {
            // remove the html fixture from the DOM
            document.body.removeChild(document.getElementById("fixture"));
        });
    },
    tests: {
        default: {
            test0: () => {
                it("fails on initialization of map with non-matching map type", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [mapActions.initializeMap("foo bar party", "map2D")];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];
                    const actualAlerts = actual.map
                        .get("alerts")
                        .toJS()
                        .map(x => {
                            delete x.time;
                            return x;
                        });
                    actual.map = actual.map.remove("maps").remove("alerts");

                    expect(actualAlerts.length).to.equal(1);

                    const expected = { ...initialState };
                    expected.map = expected.map.remove("maps").remove("alerts");

                    const expectedAlert = {
                        title: appStrings.ALERTS.CREATE_MAP_FAILED.title,
                        body: appStrings.ALERTS.CREATE_MAP_FAILED.formatString.replace(
                            "{MAP}",
                            "2D"
                        ),
                        severity: appStrings.ALERTS.CREATE_MAP_FAILED.severity
                    };

                    expect(actualNumMaps).to.equal(0);
                    expect(actualMap2D).to.equal(undefined);
                    expect(actualMap3D).to.equal(undefined);
                    expect(actualAlerts[0]).to.deep.equal(expectedAlert);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test1: () => {
                it("initializes 2D map", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D")];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map.remove("maps");

                    expect(actualNumMaps).to.equal(1);
                    expect(actualMap2D).to.not.equal(undefined);
                    expect(actualMap3D).to.equal(undefined);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test2: () => {
                it("initializes 3D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test2", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D")];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map.remove("maps");

                    expect(actualNumMaps).to.equal(1);
                    expect(actualMap2D).to.equal(undefined);
                    expect(actualMap3D).to.not.equal(undefined);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test3: () => {
                it("initializes 2D and 3D maps", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test3", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D")
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map.remove("maps");

                    expect(actualNumMaps).to.equal(2);
                    expect(actualMap2D).to.not.equal(undefined);
                    expect(actualMap3D).to.not.equal(undefined);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test4: () => {
                it("initializes 3D and 2D maps", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test4", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D")
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map.remove("maps");

                    expect(actualNumMaps).to.equal(2);
                    expect(actualMap2D).to.not.equal(undefined);
                    expect(actualMap3D).to.not.equal(undefined);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test5: () => {
                it("can enable 3D terrain", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test5", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setTerrainEnabled(true)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["displaySettings", "enableTerrain"], true);

                    // TODO - cesium terrain endpoints are no longer valid
                    // expect(actualMap3D.map.terrainProvider._url).to.equal(
                    //     appConfig.DEFAULT_TERRAIN_ENDPOINT
                    // );
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test6: () => {
                it("can set 3D terrain exaggeration", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test6", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setTerrainExaggeration(
                            appConfig.TERRAIN_EXAGGERATION_OPTIONS[1].value
                        )
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map
                        .remove("maps")
                        .setIn(
                            ["displaySettings", "selectedTerrainExaggeration"],
                            appConfig.TERRAIN_EXAGGERATION_OPTIONS[1].value
                        );

                    expect(actualMap3D.map.scene.terrainExaggeration).to.equal(
                        appConfig.TERRAIN_EXAGGERATION_OPTIONS[1].value
                    );
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test7: () => {
                it("can disable 3D terrain", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test7", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setTerrainEnabled(true),
                        mapActions.setTerrainEnabled(false)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["displaySettings", "enableTerrain"], false);

                    expect(actualMap3D.map.terrainProvider._url).to.equal(undefined);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test8: () => {
                it("can set map view mode to 3D without 2D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test8", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map.remove("maps").setIn(["view", "in3DMode"], true);

                    expect(actualNumMaps).to.equal(1);
                    expect(actualMap3D.isActive).to.equal(true);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test9: () => {
                it("can set map view mode to 3D with 2D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test9", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map.remove("maps").setIn(["view", "in3DMode"], true);

                    expect(actualNumMaps).to.equal(2);
                    expect(actualMap3D.isActive).to.equal(true);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test10: () => {
                it("can set map view mode to 2D without 3D map", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map.remove("maps").setIn(["view", "in3DMode"], false);

                    expect(actualNumMaps).to.equal(1);
                    expect(actualMap2D.isActive).to.equal(true);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test11: () => {
                it("can set map view mode to 2D with 3D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test11", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map.remove("maps").setIn(["view", "in3DMode"], false);

                    expect(actualNumMaps).to.equal(2);
                    expect(actualMap2D.isActive).to.equal(true);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test12: () => {
                it("can reset 3D map orientation", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test12", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D),
                        mapActions.resetOrientation(0)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map.remove("maps").setIn(["view", "in3DMode"], true);

                    expect(actualNumMaps).to.equal(1);
                    expect(actualMap3D.map.camera.heading).to.equal(6.283185307179586);
                    expect(actualMap3D.map.camera.roll).to.equal(0);
                    expect(actualMap3D.map.camera.pitch).to.equal(-1.5707963267948966);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test13: () => {
                it("can set 2D map view info", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test13", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D),
                        mapActions.setMapView(
                            {
                                extent: [
                                    -123.94365615697467,
                                    45.71109896680252,
                                    -116.91240615697467,
                                    49.03995638867752
                                ],
                                projection: appConfig.DEFAULT_PROJECTION
                            },
                            true
                        )
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], true)
                        .setIn(
                            ["view", "extent"],
                            [
                                -123.94365615697467,
                                45.71109896680252,
                                -116.91240615697467,
                                49.03995638867752
                            ]
                        )
                        .setIn(["view", "projection"], appConfig.DEFAULT_PROJECTION);

                    expect(actualNumMaps).to.equal(2);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test14: () => {
                it("can set 3D map view info", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test14", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D),
                        mapActions.setMapView(
                            {
                                extent: [
                                    -123.94365615697467,
                                    45.71109896680252,
                                    -116.91240615697467,
                                    49.03995638867752
                                ]
                            },
                            true
                        )
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    const actualNumMaps = actual.map.get("maps").size;
                    const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], false)
                        .setIn(
                            ["view", "extent"],
                            [
                                -123.94365615697467,
                                45.71109896680252,
                                -116.91240615697467,
                                49.03995638867752
                            ]
                        );

                    expect(actualNumMaps).to.equal(2);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test15: () => {
                it("sets the map date", function() {
                    const store = createStore(rootReducer, initialState);

                    const dateFormat = "YYYY-MM-DD";
                    const newDate = moment("2003-01-01", dateFormat, true).toDate();

                    const actions = [mapActions.setDate(newDate)];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.map = expected.map.set("date", newDate);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test16: () => {
                it("can zoom out", function(done) {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test16", this, done)) {
                        return;
                    }

                    this.timeout(30000);

                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true)
                    ];
                    actions.forEach(action => store.dispatch(action));
                    setTimeout(() => {
                        let initialZoom = store
                            .getState()
                            .map.get("maps")
                            .toJS()
                            [appStrings.MAP_LIB_2D].getZoom();
                        store.dispatch(mapActions.zoomOut());
                        setTimeout(() => {
                            const actual = store.getState();

                            const actualMap2D = actual.map.get("maps").toJS()[
                                appStrings.MAP_LIB_2D
                            ];
                            actual.map = actual.map.remove("maps");

                            const expected = { ...initialState };
                            expected.map = expected.map.remove("maps");

                            expect(actualMap2D.getZoom().toFixed(7)).to.equal(
                                (initialZoom - 1.0).toFixed(7)
                            );
                            TestUtil.compareFullStates(actual, expected);
                            done();
                        }, 1000);
                    }, 1000);
                });
            },

            test16B: () => {
                it("can zoom out with no 3D map", function(done) {
                    this.timeout(30000);

                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true)
                    ];
                    actions.forEach(action => store.dispatch(action));
                    setTimeout(() => {
                        let initialZoom = store
                            .getState()
                            .map.get("maps")
                            .toJS()
                            [appStrings.MAP_LIB_2D].getZoom();
                        store.dispatch(mapActions.zoomIn());
                        setTimeout(() => {
                            store.dispatch(mapActions.zoomOut());
                            setTimeout(() => {
                                const actual = store.getState();

                                const actualMap2D = actual.map.get("maps").toJS()[
                                    appStrings.MAP_LIB_2D
                                ];
                                actual.map = actual.map.remove("maps");

                                const expected = { ...initialState };
                                expected.map = expected.map.remove("maps");

                                expect(actualMap2D.getZoom().toFixed(7)).to.equal(
                                    initialZoom.toFixed(7)
                                );
                                TestUtil.compareFullStates(actual, expected);
                                done();
                            }, 1000);
                        }, 1000);
                    }, 1000);
                });
            },

            test17: () => {
                it("can zoom in", function(done) {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test17", this, done)) {
                        return;
                    }
                    this.timeout(30000);

                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    setTimeout(() => {
                        let initialZoom = store
                            .getState()
                            .map.get("maps")
                            .toJS()
                            [appStrings.MAP_LIB_2D].getZoom();
                        store.dispatch(mapActions.zoomIn());
                        setTimeout(() => {
                            const actual = store.getState();

                            const actualMap2D = actual.map.get("maps").toJS()[
                                appStrings.MAP_LIB_2D
                            ];
                            actual.map = actual.map.remove("maps");

                            const expected = { ...initialState };
                            expected.map = expected.map.remove("maps");

                            expect(actualMap2D.getZoom().toFixed(7)).to.equal(
                                (initialZoom + 1.0).toFixed(7)
                            );
                            TestUtil.compareFullStates(actual, expected);
                            done();
                        }, 1000);
                    }, 1000);
                });
            },

            test17B: () => {
                it("can zoom in with no 3D map", function(done) {
                    this.timeout(30000);

                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    setTimeout(() => {
                        let initialZoom = store
                            .getState()
                            .map.get("maps")
                            .toJS()
                            [appStrings.MAP_LIB_2D].getZoom();
                        store.dispatch(mapActions.zoomIn());
                        setTimeout(() => {
                            const actual = store.getState();

                            const actualMap2D = actual.map.get("maps").toJS()[
                                appStrings.MAP_LIB_2D
                            ];
                            actual.map = actual.map.remove("maps");

                            const expected = { ...initialState };
                            expected.map = expected.map.remove("maps");

                            expect(actualMap2D.getZoom().toFixed(7)).to.equal(
                                (initialZoom + 1.0).toFixed(7)
                            );
                            TestUtil.compareFullStates(actual, expected);
                            done();
                        }, 1000);
                    }, 1000);
                });
            },

            test18: () => {
                it("can zoom in and out", function(done) {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test17", this, done)) {
                        return;
                    }
                    this.timeout(30000);

                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    setTimeout(() => {
                        let initialZoom = store
                            .getState()
                            .map.get("maps")
                            .toJS()
                            [appStrings.MAP_LIB_2D].getZoom();
                        store.dispatch(mapActions.zoomIn());
                        setTimeout(() => {
                            store.dispatch(mapActions.zoomIn());
                            setTimeout(() => {
                                store.dispatch(mapActions.zoomOut());
                                setTimeout(() => {
                                    const actual = store.getState();

                                    const actualMap2D = actual.map.get("maps").toJS()[
                                        appStrings.MAP_LIB_2D
                                    ];
                                    actual.map = actual.map.remove("maps");

                                    const expected = { ...initialState };
                                    expected.map = expected.map.remove("maps");

                                    expect(actualMap2D.getZoom().toFixed(7)).to.equal(
                                        (initialZoom + 1.0).toFixed(7)
                                    );
                                    TestUtil.compareFullStates(actual, expected);
                                    done();
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }, 1000);
                });
            },

            test18B: () => {
                it("can zoom in and out with no 3D map", function(done) {
                    this.timeout(30000);

                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    setTimeout(() => {
                        let initialZoom = store
                            .getState()
                            .map.get("maps")
                            .toJS()
                            [appStrings.MAP_LIB_2D].getZoom();
                        store.dispatch(mapActions.zoomIn());
                        setTimeout(() => {
                            store.dispatch(mapActions.zoomIn());
                            setTimeout(() => {
                                store.dispatch(mapActions.zoomOut());
                                setTimeout(() => {
                                    const actual = store.getState();

                                    const actualMap2D = actual.map.get("maps").toJS()[
                                        appStrings.MAP_LIB_2D
                                    ];
                                    actual.map = actual.map.remove("maps");

                                    const expected = { ...initialState };
                                    expected.map = expected.map.remove("maps");

                                    expect(actualMap2D.getZoom().toFixed(7)).to.equal(
                                        (initialZoom + 1.0).toFixed(7)
                                    );
                                    TestUtil.compareFullStates(actual, expected);
                                    done();
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }, 1000);
                });
            },

            test19: () => {
                it("can set scale units with 2D map", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setScaleUnits(appConfig.SCALE_OPTIONS[1].value)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map
                        .remove("maps")
                        .setIn(
                            ["displaySettings", "selectedScaleUnits"],
                            appConfig.SCALE_OPTIONS[1].value
                        );

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test20: () => {
                it("can enable drawing a circle on a 2D map", function() {
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // add drawing on the map
                    actualMap2D.addDrawHandler(
                        appStrings.GEOMETRY_CIRCLE,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [mapActions.enableDrawing(appStrings.GEOMETRY_CIRCLE)];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], false)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_CIRCLE)
                        .setIn(["measuring", "isMeasuringEnabled"], false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test21: () => {
                it("can enable drawing a line string on a 2D map", function() {
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // add drawing on the map
                    actualMap2D.addDrawHandler(
                        appStrings.GEOMETRY_LINE_STRING,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [
                        mapActions.enableDrawing(appStrings.GEOMETRY_LINE_STRING)
                    ];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], false)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_LINE_STRING)
                        .setIn(["measuring", "isMeasuringEnabled"], false);
                });
            },

            test22: () => {
                it("can enable drawing a polygon on a 2D map", function() {
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // add drawing on the map
                    actualMap2D.addDrawHandler(
                        appStrings.GEOMETRY_POLYGON,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [mapActions.enableDrawing(appStrings.GEOMETRY_POLYGON)];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], false)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_POLYGON)
                        .setIn(["measuring", "isMeasuringEnabled"], false);
                });
            },

            test22B: () => {
                it("can enable drawing a point on a 2D map", function() {
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // add drawing on the map
                    actualMap2D.addDrawHandler(
                        appStrings.GEOMETRY_POINT,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [mapActions.enableDrawing(appStrings.GEOMETRY_POINT)];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], false)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_POINT)
                        .setIn(["measuring", "isMeasuringEnabled"], false);
                });
            },

            test22C: () => {
                it("can enable drawing a box on a 2D map", function() {
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // add drawing on the map
                    actualMap2D.addDrawHandler(
                        appStrings.GEOMETRY_BOX,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [mapActions.enableDrawing(appStrings.GEOMETRY_BOX)];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], false)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_BOX)
                        .setIn(["measuring", "isMeasuringEnabled"], false);
                });
            },

            test22D: () => {
                it("can enable drawing a (single) line on a 2D map", function() {
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // add drawing on the map
                    actualMap2D.addDrawHandler(
                        appStrings.GEOMETRY_LINE,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [mapActions.enableDrawing(appStrings.GEOMETRY_LINE)];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], false)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_LINE)
                        .setIn(["measuring", "isMeasuringEnabled"], false);
                });
            },

            test23: () => {
                it("can enable drawing a circle on a 3D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test23", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // add drawing on the map
                    actualMap3D.addDrawHandler(
                        appStrings.GEOMETRY_CIRCLE,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [mapActions.enableDrawing(appStrings.GEOMETRY_CIRCLE)];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], true)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_CIRCLE)
                        .setIn(["measuring", "isMeasuringEnabled"], false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test24: () => {
                it("can enable drawing a line string on a 3D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test24", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // add drawing on the map
                    actualMap3D.addDrawHandler(
                        appStrings.GEOMETRY_LINE_STRING,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [
                        mapActions.enableDrawing(appStrings.GEOMETRY_LINE_STRING)
                    ];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], true)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_LINE_STRING)
                        .setIn(["measuring", "isMeasuringEnabled"], false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test25: () => {
                it("can enable drawing a polygon on a 3D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test25", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // add drawing on the map
                    actualMap3D.addDrawHandler(
                        appStrings.GEOMETRY_POLYGON,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [mapActions.enableDrawing(appStrings.GEOMETRY_POLYGON)];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], true)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_POLYGON)
                        .setIn(["measuring", "isMeasuringEnabled"], false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test25B: () => {
                it("can enable drawing a point on a 3D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test25B", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // add drawing on the map
                    actualMap3D.addDrawHandler(
                        appStrings.GEOMETRY_POINT,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [mapActions.enableDrawing(appStrings.GEOMETRY_POINT)];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], true)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_POINT)
                        .setIn(["measuring", "isMeasuringEnabled"], false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test25C: () => {
                it("can enable drawing a box on a 3D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test25C", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // add drawing on the map
                    actualMap3D.addDrawHandler(
                        appStrings.GEOMETRY_BOX,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [mapActions.enableDrawing(appStrings.GEOMETRY_BOX)];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], true)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_BOX)
                        .setIn(["measuring", "isMeasuringEnabled"], false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test25D: () => {
                it("can enable drawing a (single) line on a 3D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test25D", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // add drawing on the map
                    actualMap3D.addDrawHandler(
                        appStrings.GEOMETRY_LINE,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [mapActions.enableDrawing(appStrings.GEOMETRY_LINE)];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], true)
                        .setIn(["drawing", "isDrawingEnabled"], true)
                        .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_LINE)
                        .setIn(["measuring", "isMeasuringEnabled"], false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test26: () => {
                it("can disable drawing on a 2D map and clear previous drawing type", function() {
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // add drawing on the map
                    actualMap2D.addDrawHandler(
                        appStrings.GEOMETRY_POLYGON,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [
                        mapActions.enableDrawing(appStrings.GEOMETRY_POLYGON),
                        mapActions.disableDrawing()
                    ];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], false)
                        .setIn(["drawing", "isDrawingEnabled"], false)
                        .setIn(["drawing", "geometryType"], "")
                        .setIn(["measuring", "isMeasuringEnabled"], false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test27: () => {
                it("can disable drawing on a 3D map and clear previous drawing type", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test27", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // add drawing on the map
                    actualMap3D.addDrawHandler(
                        appStrings.GEOMETRY_POLYGON,
                        () => {},
                        appStrings.INTERACTION_DRAW
                    );

                    // enable drawing
                    const finalActions = [
                        mapActions.enableDrawing(appStrings.GEOMETRY_POLYGON),
                        mapActions.disableDrawing()
                    ];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], true)
                        .setIn(["drawing", "isDrawingEnabled"], false)
                        .setIn(["drawing", "geometryType"], "")
                        .setIn(["measuring", "isMeasuringEnabled"], false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test28: () => {
                it("can add geometry to 2D map", function() {
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // Create dummy geometry
                    let geometryCircle = {
                        type: appStrings.GEOMETRY_CIRCLE,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
                        center: {
                            lon: 0,
                            lat: 0
                        },
                        radius: 100,
                        id: Math.random()
                    };

                    let geometryLineString = {
                        type: appStrings.GEOMETRY_LINE_STRING,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
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

                    let geometryPolygon = {
                        type: appStrings.GEOMETRY_POLYGON,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
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

                    let geometryPoint = {
                        type: appStrings.GEOMETRY_POINT,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
                        coordinates: { lat: 35, lon: 29 },
                        id: Math.random()
                    };

                    let geometryBox = {
                        type: appStrings.GEOMETRY_BOX,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
                        coordinates: [
                            { lon: 20, lat: 30 },
                            { lon: 30, lat: 30 },
                            { lon: 30, lat: 10 },
                            { lon: 20, lat: 10 }
                        ],
                        id: Math.random()
                    };

                    let geometryLine = {
                        type: appStrings.GEOMETRY_POLYGON,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
                        coordinates: [
                            {
                                lon: -12,
                                lat: -67
                            },
                            {
                                lon: 8,
                                lat: -45
                            }
                        ],
                        id: Math.random()
                    };

                    // add geometries
                    const finalActions = [
                        mapActions.addGeometryToMap(geometryCircle, appStrings.INTERACTION_DRAW),
                        mapActions.addGeometryToMap(
                            geometryLineString,
                            appStrings.INTERACTION_DRAW
                        ),
                        mapActions.addGeometryToMap(geometryPolygon, appStrings.INTERACTION_DRAW),
                        mapActions.addGeometryToMap(geometryPoint, appStrings.INTERACTION_DRAW),
                        mapActions.addGeometryToMap(geometryBox, appStrings.INTERACTION_DRAW),
                        mapActions.addGeometryToMap(geometryLine, appStrings.INTERACTION_DRAW)
                    ];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], true)
                        .setIn(["drawing", "geometryType"], "");

                    let mapLayers = actualMap2D.map.getLayers().getArray();
                    let mapLayer = MiscUtil.findObjectInArray(
                        mapLayers,
                        "_layerId",
                        "_vector_drawings"
                    );
                    let mapLayerFeatures = mapLayer.getSource().getFeatures();
                    let drawFeatures = mapLayerFeatures.filter(
                        x => x.get("interactionType") === appStrings.INTERACTION_DRAW
                    );
                    expect(drawFeatures.length).to.equal(6);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test29: () => {
                it("can add geometry to 3D map", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test29", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // Create dummy geometry
                    let geometryCircle = {
                        type: appStrings.GEOMETRY_CIRCLE,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: appStrings.PROJECTIONS.latlon.code,
                        center: {
                            lon: 0,
                            lat: 0
                        },
                        radius: 100,
                        id: Math.random()
                    };

                    let geometryLineString = {
                        type: appStrings.GEOMETRY_LINE_STRING,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: appStrings.PROJECTIONS.latlon.code,
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

                    let geometryPolygon = {
                        type: appStrings.GEOMETRY_POLYGON,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: appStrings.PROJECTIONS.latlon.code,
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

                    // add geometries
                    const finalActions = [
                        mapActions.addGeometryToMap(geometryCircle, appStrings.INTERACTION_DRAW),
                        mapActions.addGeometryToMap(
                            geometryLineString,
                            appStrings.INTERACTION_DRAW
                        ),
                        mapActions.addGeometryToMap(geometryPolygon, appStrings.INTERACTION_DRAW)
                    ];
                    finalActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], false)
                        .setIn(["drawing", "geometryType"], "");

                    let drawFeatures = actualMap3D.map.scene.primitives._primitives.filter(
                        x => x._interactionType === appStrings.INTERACTION_DRAW
                    );
                    expect(drawFeatures.length).to.equal(3);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test30: () => {
                it("can remove all drawings from 2D and 3D maps", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test30", this)) {
                        return;
                    }
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // Create dummy geometry
                    let geometryCircle = {
                        type: appStrings.GEOMETRY_CIRCLE,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
                        center: {
                            lon: 0,
                            lat: 0
                        },
                        radius: 100,
                        id: Math.random()
                    };

                    // add geometries to 2D and 3D maps
                    const nextActions = [
                        mapActions.addGeometryToMap(geometryCircle, appStrings.INTERACTION_DRAW),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D),
                        mapActions.addGeometryToMap(geometryCircle, appStrings.INTERACTION_DRAW),
                        mapActions.removeAllDrawings()
                    ];
                    nextActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["view", "in3DMode"], false)
                        .setIn(["drawing", "geometryType"], "");

                    // Get 2D drawings
                    let mapLayers = actualMap2D.map.getLayers().getArray();
                    let mapLayer = MiscUtil.findObjectInArray(
                        mapLayers,
                        "_layerId",
                        "_vector_drawings"
                    );
                    let mapLayerFeatures = mapLayer.getSource().getFeatures();
                    let drawFeatures2D = mapLayerFeatures.filter(
                        x => x.get("interactionType") === appStrings.INTERACTION_DRAW
                    );

                    // Get 3D drawings
                    let drawFeatures3D = actualMap3D.map.scene.primitives._primitives.filter(
                        x => x._interactionType === appStrings.INTERACTION_DRAW
                    );
                    expect(drawFeatures2D.length).to.equal(0);
                    expect(drawFeatures3D.length).to.equal(0);
                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test30B: () => {
                it("can remove all drawings from 2D map", function() {
                    const store = createStore(rootReducer, initialState);

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // Create dummy geometry
                    let geometryCircle = {
                        type: appStrings.GEOMETRY_CIRCLE,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
                        center: {
                            lon: 0,
                            lat: 0
                        },
                        radius: 100,
                        id: Math.random()
                    };

                    // add geometries to 2D and 3D maps
                    const nextActions = [
                        mapActions.addGeometryToMap(geometryCircle, appStrings.INTERACTION_DRAW),
                        mapActions.removeAllDrawings()
                    ];
                    nextActions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    expected.map = expected.map
                        .remove("maps")
                        .setIn(["drawing", "geometryType"], "");

                    // Get 2D drawings
                    let mapLayers = actualMap2D.map.getLayers().getArray();
                    let mapLayer = MiscUtil.findObjectInArray(
                        mapLayers,
                        "_layerId",
                        "_vector_drawings"
                    );
                    let mapLayerFeatures = mapLayer.getSource().getFeatures();
                    let drawFeatures2D = mapLayerFeatures.filter(
                        x => x.get("interactionType") === appStrings.INTERACTION_DRAW
                    );

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test31: () => {
                it("can add measurement label to geometry on 2D and 3D maps", function(done) {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test31", this, done)) {
                        return;
                    }

                    // adjust default timeout
                    this.timeout(30000);

                    const store = createStore(
                        rootReducer,
                        initialState,
                        compose(applyMiddleware(thunkMiddleware))
                    );

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // Create dummy geometry
                    let geometryLineString = {
                        type: appStrings.GEOMETRY_LINE_STRING,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
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

                    // Create dummy geometry
                    let geometryPolygon = {
                        type: appStrings.GEOMETRY_POLYGON,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
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

                    // add geometries to 2D and 3D maps and then add label
                    const finalActions = [
                        mapActions.addGeometryToMap(
                            geometryLineString,
                            appStrings.INTERACTION_DRAW
                        ),
                        mapActions.addGeometryToMap(geometryPolygon, appStrings.INTERACTION_DRAW),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D),
                        mapActions.addGeometryToMap(
                            geometryLineString,
                            appStrings.INTERACTION_DRAW
                        ),
                        mapActions.addGeometryToMap(geometryPolygon, appStrings.INTERACTION_DRAW),
                        mapActions.addMeasurementLabelToGeometry(
                            geometryLineString,
                            appStrings.MEASURE_DISTANCE,
                            "metric"
                        ),
                        mapActions.addMeasurementLabelToGeometry(
                            geometryPolygon,
                            appStrings.MEASURE_AREA,
                            "metric"
                        )
                    ];
                    finalActions.forEach(action => store.dispatch(action));

                    setTimeout(() => {
                        const actual = store.getState();

                        actual.map = actual.map.remove("maps");

                        expected.map = expected.map
                            .remove("maps")
                            .setIn(["view", "in3DMode"], false)
                            .setIn(["drawing", "geometryType"], "");

                        // Get 2D overlays
                        let overlays2D = actualMap2D.map.getOverlays().getArray();

                        // Get 3D overlays
                        let overlays3D = actualMap3D.map.entities.values;

                        expect(overlays2D.length).to.equal(2);
                        expect(overlays3D.length).to.equal(2);
                        TestUtil.compareFullStates(actual, expected);
                        done();
                    }, 2000);
                });
            },

            test31B: () => {
                it("can add measurement label to geometry on 2D map", function(done) {
                    // adjust default timeout
                    this.timeout(30000);

                    const store = createStore(
                        rootReducer,
                        initialState,
                        compose(applyMiddleware(thunkMiddleware))
                    );

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // Create dummy geometry
                    let geometryLineString = {
                        type: appStrings.GEOMETRY_LINE_STRING,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
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

                    // Create dummy geometry
                    let geometryPolygon = {
                        type: appStrings.GEOMETRY_POLYGON,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
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

                    // add geometries to 2D and 3D maps and then add label
                    const finalActions = [
                        mapActions.addGeometryToMap(
                            geometryLineString,
                            appStrings.INTERACTION_DRAW
                        ),
                        mapActions.addGeometryToMap(geometryPolygon, appStrings.INTERACTION_DRAW),
                        mapActions.addMeasurementLabelToGeometry(
                            geometryLineString,
                            appStrings.MEASURE_DISTANCE,
                            "metric"
                        ),
                        mapActions.addMeasurementLabelToGeometry(
                            geometryPolygon,
                            appStrings.MEASURE_AREA,
                            "metric"
                        )
                    ];
                    finalActions.forEach(action => store.dispatch(action));

                    setTimeout(() => {
                        const actual = store.getState();

                        actual.map = actual.map.remove("maps");

                        expected.map = expected.map
                            .remove("maps")
                            .setIn(["view", "in3DMode"], false)
                            .setIn(["drawing", "geometryType"], "");

                        // Get 2D overlays
                        let overlays2D = actualMap2D.map.getOverlays().getArray();

                        expect(overlays2D.length).to.equal(2);
                        TestUtil.compareFullStates(actual, expected);
                        done();
                    }, 2000);
                });
            },

            test32: () => {
                it("can remove all measurements in 2D and 3D maps", function(done) {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test32", this, done)) {
                        return;
                    }
                    // adjust default timeout
                    this.timeout(30000);

                    const store = createStore(
                        rootReducer,
                        initialState,
                        compose(applyMiddleware(thunkMiddleware))
                    );

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                    const actualMap3D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

                    // Create dummy geometry
                    let geometryLineString = {
                        type: appStrings.GEOMETRY_LINE_STRING,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
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

                    // add geometries to 2D and 3D maps and then add label
                    const intermediateActions = [
                        mapActions.addGeometryToMap(
                            geometryLineString,
                            appStrings.INTERACTION_DRAW
                        ),
                        mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D),
                        mapActions.addGeometryToMap(
                            geometryLineString,
                            appStrings.INTERACTION_DRAW
                        ),
                        mapActions.addMeasurementLabelToGeometry(
                            geometryLineString,
                            appStrings.MEASURE_DISTANCE,
                            "metric"
                        )
                    ];

                    intermediateActions.forEach(action => store.dispatch(action));

                    setTimeout(() => {
                        store.dispatch(mapActions.removeAllMeasurements());
                        setTimeout(() => {
                            const actual = store.getState();

                            actual.map = actual.map.remove("maps");

                            expected.map = expected.map
                                .remove("maps")
                                .setIn(["view", "in3DMode"], false)
                                .setIn(["drawing", "geometryType"], "");

                            // Get 2D overlays
                            let overlays2D = actualMap2D.map.getOverlays().getArray();

                            // Get 3D overlays
                            let overlays3D = actualMap3D.map.entities.values;

                            expect(overlays2D.length).to.equal(0);
                            expect(overlays3D.length).to.equal(0);
                            TestUtil.compareFullStates(actual, expected);
                            done();
                        }, 2000);
                    }, 2000);
                });
            },

            test32B: () => {
                it("can remove all measurements in 2D map", function(done) {
                    // adjust default timeout
                    this.timeout(30000);

                    const store = createStore(
                        rootReducer,
                        initialState,
                        compose(applyMiddleware(thunkMiddleware))
                    );

                    // initial map
                    const initalActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true)
                    ];
                    initalActions.forEach(action => store.dispatch(action));

                    // retrieve map object
                    const expected = store.getState();
                    const actualMap2D = expected.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

                    // Create dummy geometry
                    let geometryLineString = {
                        type: appStrings.GEOMETRY_LINE_STRING,
                        coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
                        proj: actualMap2D.map
                            .getView()
                            .getProjection()
                            .getCode(),
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

                    // add geometries to 2D and 3D maps and then add label
                    const intermediateActions = [
                        mapActions.addGeometryToMap(
                            geometryLineString,
                            appStrings.INTERACTION_DRAW
                        ),
                        mapActions.addMeasurementLabelToGeometry(
                            geometryLineString,
                            appStrings.MEASURE_DISTANCE,
                            "metric"
                        )
                    ];

                    intermediateActions.forEach(action => store.dispatch(action));

                    setTimeout(() => {
                        store.dispatch(mapActions.removeAllMeasurements());
                        setTimeout(() => {
                            const actual = store.getState();

                            actual.map = actual.map.remove("maps");

                            expected.map = expected.map
                                .remove("maps")
                                .setIn(["drawing", "geometryType"], "");

                            // Get 2D overlays
                            let overlays2D = actualMap2D.map.getOverlays().getArray();

                            expect(overlays2D.length).to.equal(0);
                            TestUtil.compareFullStates(actual, expected);
                            done();
                        }, 2000);
                    }, 2000);
                });
            },

            test33: () => {
                it("can injest wmts and json layer configurations as well as palette configurations. Big test.", function(done) {
                    // adjust default timeout
                    this.timeout(30000);
                    let _context = this;

                    // create store with async action support
                    const store = createStore(
                        rootReducer,
                        initialState,
                        compose(applyMiddleware(thunkMiddleware))
                    );

                    store.dispatch(
                        mapActions.loadInitialData(function() {
                            const actual = store.getState();
                            actual.map = actual.map.remove("maps");

                            const expected = { ...initialState };

                            expected.map = expected.map
                                .remove("maps")
                                .set(
                                    "palettes",
                                    mapState.get("palettes").merge(initialIngest.PALETTES)
                                )
                                .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
                                .removeIn(["layers", "partial"]);

                            expected.asynchronous = expected.asynchronous
                                .set(
                                    "initialDataAsync",
                                    Immutable.fromJS({
                                        loading: false,
                                        failed: false
                                    })
                                )
                                .set(
                                    "layerSourcesAsync",
                                    Immutable.fromJS({
                                        loading: false,
                                        failed: false
                                    })
                                )
                                .set(
                                    "layerPalettesAsync",
                                    Immutable.fromJS({
                                        loading: false,
                                        failed: false
                                    })
                                )
                                .set(
                                    "layerMetadataAsync",
                                    Immutable.fromJS({
                                        loading: false,
                                        failed: false
                                    })
                                );

                            TestUtil.compareFullStates(actual, expected);
                            done();
                        })
                    );
                });
            },

            test34: () => {
                it("can activate layers", function() {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test34", this)) {
                        return;
                    }
                    // create modified state to account for layer ingest
                    const modifiedState = { ...initialState };
                    modifiedState.map = modifiedState.map
                        .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
                        .removeIn(["layers", "partial"]);

                    const store = createStore(rootReducer, modifiedState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true),
                        mapActions.setLayerActive("facilities_kml", true),
                        mapActions.setLayerActive("GHRSST_L4_G1SST_Sea_Surface_Temperature", true),
                        mapActions.setLayerActive("facilities_kml", true)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map
                        .remove("maps")
                        .set(
                            "layers",
                            mapState.get("layers").merge(activateInactivateLayers.ACTIVE_LAYERS)
                        )
                        .removeIn(["layers", "partial"]);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test34B: () => {
                it("can activate layers with no 3D map", function() {
                    // create modified state to account for layer ingest
                    const modifiedState = { ...initialState };
                    modifiedState.map = modifiedState.map
                        .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
                        .removeIn(["layers", "partial"]);

                    const store = createStore(rootReducer, modifiedState);

                    const actions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setLayerActive("facilities_kml", true),
                        mapActions.setLayerActive("GHRSST_L4_G1SST_Sea_Surface_Temperature", true),
                        mapActions.setLayerActive("facilities_kml", true)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    actual.map = actual.map.remove("maps");

                    const expected = { ...initialState };
                    expected.map = expected.map
                        .remove("maps")
                        .set(
                            "layers",
                            mapState.get("layers").merge(activateInactivateLayers.ACTIVE_LAYERS)
                        )
                        .removeIn(["layers", "partial"]);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test35: () => {
                it("can deactivate layers", function(done) {
                    if (TestUtil.skipIfNoWebGL("StoreMapSpec.default.test35", this, done)) {
                        return;
                    }
                    // adjust default timeout
                    this.timeout(30000);

                    // create modified state to account for layer ingest
                    const modifiedState = { ...initialState };
                    modifiedState.map = modifiedState.map
                        .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
                        .removeIn(["layers", "partial"]);

                    const store = createStore(
                        rootReducer,
                        modifiedState,
                        compose(applyMiddleware(thunkMiddleware))
                    );

                    const initialActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
                        mapActions.setLayerActive("facilities_kml", true),
                        mapActions.setLayerActive("GHRSST_L4_G1SST_Sea_Surface_Temperature", true)
                    ];
                    initialActions.forEach(action => store.dispatch(action));

                    // use a timeout to give facilities layer time to load
                    setTimeout(() => {
                        store.dispatch(
                            mapActions.setLayerActive(
                                "GHRSST_L4_G1SST_Sea_Surface_Temperature",
                                false
                            )
                        );
                        setTimeout(() => {
                            const actual = store.getState();

                            actual.map = actual.map.remove("maps");

                            const expected = { ...initialState };
                            expected.map = expected.map
                                .remove("maps")
                                .set(
                                    "layers",
                                    mapState
                                        .get("layers")
                                        .merge(activateInactivateLayers.INACTIVE_LAYERS)
                                )
                                .removeIn(["layers", "partial"]);

                            TestUtil.compareFullStates(actual, expected);
                            done();
                        }, 2000);
                    }, 2000);
                });
            },

            test35B: () => {
                it("can deactivate layers", function(done) {
                    // adjust default timeout
                    this.timeout(30000);

                    // create modified state to account for layer ingest
                    const modifiedState = { ...initialState };
                    modifiedState.map = modifiedState.map
                        .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
                        .removeIn(["layers", "partial"]);

                    const store = createStore(
                        rootReducer,
                        modifiedState,
                        compose(applyMiddleware(thunkMiddleware))
                    );

                    const initialActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setLayerActive("facilities_kml", true),
                        mapActions.setLayerActive("GHRSST_L4_G1SST_Sea_Surface_Temperature", true)
                    ];
                    initialActions.forEach(action => store.dispatch(action));

                    // use a timeout to give facilities layer time to load
                    setTimeout(() => {
                        store.dispatch(
                            mapActions.setLayerActive(
                                "GHRSST_L4_G1SST_Sea_Surface_Temperature",
                                false
                            )
                        );
                        setTimeout(() => {
                            const actual = store.getState();

                            actual.map = actual.map.remove("maps");

                            const expected = { ...initialState };
                            expected.map = expected.map
                                .remove("maps")
                                .set(
                                    "layers",
                                    mapState
                                        .get("layers")
                                        .merge(activateInactivateLayers.INACTIVE_LAYERS)
                                )
                                .removeIn(["layers", "partial"]);

                            TestUtil.compareFullStates(actual, expected);
                            done();
                        }, 2000);
                    }, 2000);
                });
            }
        }
    }
};
