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

describe('Store - Share', function() {
    it('enables auto update url', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.setAutoUpdateUrl(true)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.share = expected.share.set("autoUpdateUrl", true);

        TestUtil.compareFullStates(actual, expected);
    });

    it('disables auto update url', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.setAutoUpdateUrl(true),
            AppActions.setAutoUpdateUrl(false)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.share = expected.share.set("autoUpdateUrl", false);

        TestUtil.compareFullStates(actual, expected);
    });
    it('can open the share container.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.openShare()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.share = expected.share.set("isOpen", true);

        TestUtil.compareFullStates(actual, expected);
    });
    it('can close the share container.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.closeShare()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.share = expected.share.set("isOpen", false);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can open and close the share container.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.openShare(),
            AppActions.closeShare()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.share = expected.share.set("isOpen", false);

        TestUtil.compareFullStates(actual, expected);
    });
});
