/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as appActions from "_core/actions/appActions";
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

export const StoreHelpSpec = {
    name: "StoreHelpSpec",
    tests: {
        default: {
            test1: () => {
                it("opens help", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [appActions.setHelpOpen(true)];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.help = expected.help.set("isOpen", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test2: () => {
                it("closes help", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [appActions.setHelpOpen(false)];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.help = expected.help.set("isOpen", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test3: () => {
                it("opens and closes help", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [appActions.setHelpOpen(true), appActions.setHelpOpen(false)];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.help = expected.help.set("isOpen", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test4: () => {
                it("selects a help page", function() {
                    const store = createStore(rootReducer, initialState);

                    let helpPage = "screaming eagles";
                    const actions = [appActions.selectHelpPage(helpPage)];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.help = expected.help.set("helpPage", helpPage);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test5: () => {
                it("opens and selects a help page", function() {
                    const store = createStore(rootReducer, initialState);

                    let helpPage = "screaming eagles";
                    const actions = [
                        appActions.setHelpOpen(true),
                        appActions.selectHelpPage(helpPage)
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.help = expected.help.set("isOpen", true).set("helpPage", helpPage);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test6: () => {
                it("closing help does not reset the selected page", function() {
                    const store = createStore(rootReducer, initialState);

                    let helpPage = "screaming eagles";
                    const actions = [
                        appActions.setHelpOpen(true),
                        appActions.selectHelpPage(helpPage),
                        appActions.setHelpOpen(false)
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.help = expected.help.set("isOpen", false).set("helpPage", helpPage);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test7: () => {
                it("opening help resets the selected page", function() {
                    const store = createStore(rootReducer, initialState);

                    let helpPage = "screaming eagles";
                    const actions = [
                        appActions.setHelpOpen(true),
                        appActions.selectHelpPage(helpPage),
                        appActions.setHelpOpen(false),
                        appActions.setHelpOpen(true)
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.help = expected.help.set("isOpen", true).set("helpPage", "");

                    TestUtil.compareFullStates(actual, expected);
                });
            }
        }
    }
};
