import * as AppActions from '../actions/AppActions';
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

describe('Store - Settings', function() {
    it('opens settings.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.openSettings()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.settings = expected.settings.set("isOpen", true);

        TestUtil.compareFullStates(actual, expected);
    });
    it('closes settings.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.closeSettings()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.settings = expected.settings.set("isOpen", false);

        TestUtil.compareFullStates(actual, expected);
    });

    it('opens and closes settings.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.openSettings(),
            AppActions.closeSettings()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.settings = expected.settings.set("isOpen", false);

        TestUtil.compareFullStates(actual, expected);
    });
});
