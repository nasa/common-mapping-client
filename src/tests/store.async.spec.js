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
            {type: actionTypes.LOAD_INITIAL_DATA}
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState.set("loadingInitialData", true),
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        // CHANGE
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());

        // NO CHANGE
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
    });

    it('completes initial data loading', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            {type: actionTypes.INITIAL_DATA_LOADED}
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState
                .set("loadingInitialData", false)
                .set("initialLoadingAttempted", true),
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        // CHANGE
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());

        // NO CHANGE
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
    });

    it('kicks off loading palettes', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            {type: actionTypes.LOAD_LAYER_PALETTES}
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState.set("loadingLayerPalettes", true),
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        // CHANGE
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());

        // NO CHANGE
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
    });

    it('completes loading palettes', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            {type: actionTypes.LAYER_PALETTES_LOADED}
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState
                .set("loadingLayerPalettes", false)
                .set("paletteLoadingAttempted", true),
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        // CHANGE
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());

        // NO CHANGE
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
    });

    it('kicks off loading layer configs', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            {type: actionTypes.LOAD_LAYERS}
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState.set("loadingLayerSources", true),
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        // CHANGE
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());

        // NO CHANGE
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
    });

    it('completes loading layer configs', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            {type: actionTypes.LAYERS_LOADED}
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState
                .set("loadingLayerSources", false)
                .set("layerLoadingAttempted", true),
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        // CHANGE
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());

        // NO CHANGE
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
    });
});
