import * as AppActions from '../actions/AppActions';
import * as LayerActions from '../actions/LayerActions';
import * as appStrings from '../constants/appStrings';
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

describe('Store - View', function() {
    it('sets the app title, version, and subtitle from config', function() {
        const store = createStore(rootReducer, initialState);
        const actual = store.getState();

        expect(actual.view.get("title")).to.equal(appStrings.APP_TITLE);
        expect(actual.view.get("subtitle")).to.equal(appStrings.APP_SUBTITLE);
        expect(actual.view.get("version")).to.equal(appStrings.APP_VERSION);
    });

    it('can complete initial load', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.completeInitialLoad()
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();

        const expected = {
            map: mapState,
            view: viewState.set("initialLoadComplete", true),
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });

    it('can set full screen enabled', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.setFullScreenMode(true)
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();

        const expected = {
            map: mapState,
            view: viewState.set("isFullscreen", true),
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });

    it('can set full screen disabled', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.setFullScreenMode(true),
            AppActions.setFullScreenMode(false)
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();

        const expected = {
            map: mapState,
            view: viewState.set("isFullscreen", false),
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });

    it('can set layer menu open', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            LayerActions.setLayerMenuOpen(true)
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();

        const expected = {
            map: mapState,
            view: viewState.set("layerMenuOpen", true),
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });

    it('can set layer menu closed', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            LayerActions.setLayerMenuOpen(false)
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();

        const expected = {
            map: mapState,
            view: viewState.set("layerMenuOpen", false),
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });

    it('can set layer menu open and closed', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            LayerActions.setLayerMenuOpen(true),
            LayerActions.setLayerMenuOpen(false)
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();

        const expected = {
            map: mapState,
            view: viewState.set("layerMenuOpen", false),
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });
});
