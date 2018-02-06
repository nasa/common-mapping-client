/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actionTypes from "_core/constants/actionTypes";
import * as asyncActions from "_core/actions/asyncActions";
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

export const StoreAsyncSpec = {
    name: "StoreAsyncSpec",
    tests: {
        default: {
            test1: () => {
                it("Sets async state given key and new async state", function() {
                    const store = createStore(rootReducer, initialState);

                    store.dispatch(
                        asyncActions.setAsyncLoadingState("initialDataAsync", {
                            loading: true,
                            failed: false
                        })
                    );

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.asynchronous = expected.asynchronous.set(
                        "initialDataAsync",
                        Immutable.fromJS({
                            loading: true,
                            failed: false
                        })
                    );

                    TestUtil.compareFullStates(actual, expected);
                });
            },
            test2: () => {
                it("Sets async state given key and new async state with extra keys not in core model", function() {
                    const store = createStore(rootReducer, initialState);

                    store.dispatch(
                        asyncActions.setAsyncLoadingState("initialDataAsync", {
                            loading: true,
                            failed: false,
                            dog: 1
                        })
                    );

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.asynchronous = expected.asynchronous.set(
                        "initialDataAsync",
                        Immutable.fromJS({
                            loading: true,
                            failed: false,
                            dog: 1
                        })
                    );

                    TestUtil.compareFullStates(actual, expected);
                });
            },
            test3: () => {
                it("Changes no state if async key is not found", function() {
                    const store = createStore(rootReducer, initialState);

                    store.dispatch(
                        asyncActions.setAsyncLoadingState("thisisntthekeyyourelookingfor", {
                            loading: true,
                            failed: false
                        })
                    );

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expect(actual.asynchronous.get("alerts").size).to.equal(1);
                    actual.asynchronous = actual.asynchronous.set("alerts", Immutable.List());

                    TestUtil.compareFullStates(actual, expected);
                });
            }
        }
    }
};
