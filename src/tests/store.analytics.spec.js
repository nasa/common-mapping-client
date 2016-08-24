import * as actionTypes from '../constants/actionTypes';
import * as mapStrings from '../constants/mapStrings';
import * as appStrings from '../constants/appStrings';
import * as mapConfig from '../constants/mapConfig';
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
import MapUtil from '../utils/MapUtil.js';

const initialState = {
    map: mapState,
    view: viewState,
    asyncronous: asyncState,
    help: helpState,
    settings: settingsState,
    share: shareState,
    dateSlider: dateSliderState,
    analytics: analyticsState
};

describe('Store', function() {
    it('enables user analytics', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.SET_ANALYTICS_ENABLED, isEnabled: true }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            analytics: analyticsState.set("isEnabled", true).remove("currentBatch")
        };
        expect(actual.analytics.remove("currentBatch").toJS()).to.deep.equal(expected.analytics.toJS());
    });
    it('disables user analytics', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.SET_ANALYTICS_ENABLED, isEnabled: false }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            analytics: analyticsState.set("isEnabled", false).remove("currentBatch")
        };
        expect(actual.analytics.remove("currentBatch").toJS()).to.deep.equal(expected.analytics.toJS());
    });
});
