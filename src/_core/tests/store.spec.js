/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as appActions from "_core/actions/appActions";
import * as mapActions from "_core/actions/mapActions";
import * as dateSliderActions from "_core/actions/dateSliderActions";
import * as actionTypes from "_core/constants/actionTypes";
import * as appStrings from "_core/constants/appStrings";
import appConfig from "constants/appConfig";
import { createStore } from "redux";
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

export const StoreSpec = {
    name: "StoreSpec",
    tests: {
        default: {
            test1: () => {
                it("resets application state correctly", function() {
                    const store = createStore(rootReducer, initialState);

                    const initActions = [
                        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
                        mapActions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true)
                    ];
                    initActions.forEach(action => store.dispatch(action));
                    setTimeout(() => {
                        const actions = [
                            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D),
                            mapActions.zoomIn(),
                            mapActions.addGeometryToMap({
                                type: appStrings.GEOMETRY_CIRCLE,
                                center: { lon: 0, lat: 0 },
                                radius: 500,
                                coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC
                            }),
                            mapActions.removeAllDrawings(),
                            mapActions.removeAllMeasurements(),
                            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D),
                            mapActions.addGeometryToMap({
                                type: appStrings.GEOMETRY_CIRCLE,
                                center: { lon: 10, lat: -20 },
                                radius: 52200,
                                coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC
                            }),
                            mapActions.zoomIn(),
                            mapActions.setTerrainEnabled(false),
                            mapActions.setTerrainExaggeration(
                                appConfig.TERRAIN_EXAGGERATION_OPTIONS[1].value
                            ),
                            mapActions.setScaleUnits(appConfig.SCALE_OPTIONS[1].value),
                            mapActions.zoomOut(),
                            mapActions.resetOrientation(0),
                            dateSliderActions.setDateResolution(
                                appConfig.DATE_SLIDER_RESOLUTIONS[0]
                            ),
                            appActions.resetApplicationState()
                        ];

                        actions.forEach(action => store.dispatch(action));

                        const actual = store.getState();
                        actual.map = actual.map.remove("maps");

                        const expected = { ...initialState };
                        expected.map = expected.map.remove("maps");
                        expected.view = expected.view.set("appResetCounter", 1);

                        TestUtil.compareFullStates(actual, expected);
                    }, 1000);
                });
            },

            test2: () => {
                it("does nothing on a NO_ACTION", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [{ type: actionTypes.NO_ACTION }];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };

                    TestUtil.compareFullStates(actual, expected);
                });
            }
        }
    }
};
