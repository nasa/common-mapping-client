import * as actionTypes from '_core/constants/actionTypes';
import { createStore } from 'redux';
import { expect } from 'chai';
import rootReducer from '_core/reducers';
import { mapState, layerModel, paletteModel } from '_core/reducers/models/map';
import { asyncState } from '_core/reducers/models/async';
import { helpState } from '_core/reducers/models/help';
import { shareState } from '_core/reducers/models/share';
import { settingsState } from '_core/reducers/models/settings';
import { dateSliderState } from '_core/reducers/models/dateSlider';
import { analyticsState } from '_core/reducers/models/analytics';
import { viewState } from '_core/reducers/models/view';
import { layerInfoState } from '_core/reducers/models/layerInfo';
import TestUtil from '_core/tests/TestUtil';

const initialState = {
    map: mapState,
    view: viewState,
    asynchronous: asyncState,
    help: helpState,
    settings: settingsState,
    share: shareState,
    dateSlider: dateSliderState,
    analytics: analyticsState,
    layerInfo: layerInfoState
};

export const StoreAsyncSpec = {
    name: "StoreAsyncSpec",
    tests: {
        default: {
            test1: () => {
                it('kicks off initial data loading', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        { type: actionTypes.INITIAL_DATA_LOADING }
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = {...initialState };
                    expected.asynchronous = expected.asynchronous.set("loadingInitialData", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test2: () => {
                it('completes initial data loading', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        { type: actionTypes.INITIAL_DATA_LOADED }
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = {...initialState };
                    expected.asynchronous = expected.asynchronous
                        .set("loadingInitialData", false)
                        .set("initialLoadingAttempted", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test3: () => {
                it('kicks off loading palettes', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        { type: actionTypes.PALETTE_DATA_LOADING }
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = {...initialState };
                    expected.asynchronous = expected.asynchronous.set("loadingLayerPalettes", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test4: () => {
                it('completes loading palettes', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        { type: actionTypes.PALETTE_DATA_LOADED }
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = {...initialState };
                    expected.asynchronous = expected.asynchronous
                        .set("loadingLayerPalettes", false)
                        .set("paletteLoadingAttempted", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test5: () => {
                it('kicks off loading layer configs', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        { type: actionTypes.LAYER_DATA_LOADING }
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = {...initialState };
                    expected.asynchronous = expected.asynchronous.set("loadingLayerSources", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test6: () => {
                it('completes loading layer configs', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        { type: actionTypes.LAYER_DATA_LOADED }
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = {...initialState };
                    expected.asynchronous = expected.asynchronous
                        .set("loadingLayerSources", false)
                        .set("layerLoadingAttempted", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            }
        }
    }
};
