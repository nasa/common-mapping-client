/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as appActions from "_core/actions/appActions";
import * as mapActions from "_core/actions/mapActions";
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
import MiscUtil from "_core/utils/MiscUtil";

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

export const StoreViewSpec = {
    name: "StoreViewSpec",
    tests: {
        default: {
            test1: () => {
                it("sets the app title, version, and subtitle from config", function() {
                    const store = createStore(rootReducer, initialState);
                    const actual = store.getState();

                    expect(actual.view.get("title")).to.equal(appConfig.APP_TITLE);
                    expect(actual.view.get("subtitle")).to.equal(appConfig.APP_SUBTITLE);
                    expect(actual.view.get("version")).to.equal(appConfig.APP_VERSION);
                });
            },

            test2: () => {
                it("can complete initial load", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [appActions.completeInitialLoad()];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.view = expected.view.set("initialLoadComplete", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test3: () => {
                it("can set full screen enabled", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [appActions.setFullScreenMode(true)];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.view = expected.view.set("isFullscreen", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test4: () => {
                it("can set full screen disabled", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        appActions.setFullScreenMode(true),
                        appActions.setFullScreenMode(false)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.view = expected.view.set("isFullscreen", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test5: () => {
                it("can set layer menu open", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [mapActions.setLayerMenuOpen(true)];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.view = expected.view.set("layerMenuOpen", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test6: () => {
                it("can set layer menu closed", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [mapActions.setLayerMenuOpen(false)];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.view = expected.view.set("layerMenuOpen", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test7: () => {
                it("can set layer menu open and closed", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        mapActions.setLayerMenuOpen(true),
                        mapActions.setLayerMenuOpen(false)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.view = expected.view.set("layerMenuOpen", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            }
        }
    }
};
