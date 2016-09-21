import * as actionTypes from '../constants/actionTypes';
import { createStore } from 'redux';
import { expect } from 'chai';
import rootReducer from '../reducers';
import { mapState, layerModel, paletteModel } from '../reducers/models/map';
import { asyncState } from '../reducers/models/async';
import { helpState } from '../reducers/models/help';
import { shareState } from '../reducers/models/share';
import { settingsState } from '../reducers/models/settings';
import { dateSliderState } from '../reducers/models/dateSlider';
import { analyticsState } from '../reducers/models/analytics';
import { viewState } from '../reducers/models/view';
import { layerInfoState } from '../reducers/models/layerInfo';
import TestUtil from './TestUtil';

const initialState = {
    map: mapState,
    view: viewState,
    asyncronous: asyncState,
    help: helpState,
    settings: settingsState,
    share: shareState,
    dateSlider: dateSliderState,
    analytics: analyticsState,
    layerInfo: layerInfoState
};

describe('Store - Async', function() {
    it('kicks off initial data loading', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.INITIAL_DATA_LOADING }
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.asyncronous = expected.asyncronous.set("loadingInitialData", true);

        TestUtil.compareFullStates(actual, expected);
    });

    it('completes initial data loading', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.INITIAL_DATA_LOADED }
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.asyncronous = expected.asyncronous
            .set("loadingInitialData", false)
            .set("initialLoadingAttempted", true);

        TestUtil.compareFullStates(actual, expected);
    });

    it('kicks off loading palettes', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.PALETTE_DATA_LOADING }
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.asyncronous = expected.asyncronous.set("loadingLayerPalettes", true);

        TestUtil.compareFullStates(actual, expected);
    });

    it('completes loading palettes', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.PALETTE_DATA_LOADED }
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.asyncronous = expected.asyncronous
            .set("loadingLayerPalettes", false)
            .set("paletteLoadingAttempted", true);

        TestUtil.compareFullStates(actual, expected);
    });

    it('kicks off loading layer configs', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.LAYER_DATA_LOADING }
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.asyncronous = expected.asyncronous.set("loadingLayerSources", true);

        TestUtil.compareFullStates(actual, expected);
    });

    it('completes loading layer configs', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.LAYER_DATA_LOADED }
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.asyncronous = expected.asyncronous
            .set("loadingLayerSources", false)
            .set("layerLoadingAttempted", true);

        TestUtil.compareFullStates(actual, expected);
    });
});
