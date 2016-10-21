import * as appActions from '../actions/AppActions';
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

describe('Store - Help', function() {
    it('opens help', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            appActions.openHelp()
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.help = expected.help.set("isOpen", true);

        TestUtil.compareFullStates(actual, expected);
    });

    it('closes help', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            appActions.closeHelp()
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.help = expected.help.set("isOpen", false);

        TestUtil.compareFullStates(actual, expected);
    });

    it('opens and closes help', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            appActions.openHelp(),
            appActions.closeHelp()
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.help = expected.help.set("isOpen", false);

        TestUtil.compareFullStates(actual, expected);
    });

    it('selects a help page', function() {
        const store = createStore(rootReducer, initialState);

        let helpPage = "screaming eagles";
        const actions = [
            appActions.selectHelpPage(helpPage)
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.help = expected.help.set("helpPage", helpPage);

        TestUtil.compareFullStates(actual, expected);
    });

    it('opens and selects a help page', function() {
        const store = createStore(rootReducer, initialState);

        let helpPage = "screaming eagles";
        const actions = [
            appActions.openHelp(),
            appActions.selectHelpPage(helpPage)
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.help = expected.help
            .set("isOpen", true)
            .set("helpPage", helpPage);

        TestUtil.compareFullStates(actual, expected);
    });

    it('closing help resets the selected page', function() {
        const store = createStore(rootReducer, initialState);

        let helpPage = "screaming eagles";
        const actions = [
            appActions.openHelp(),
            appActions.selectHelpPage(helpPage),
            appActions.closeHelp()
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.help = expected.help
            .set("isOpen", false)
            .set("helpPage", "");

        TestUtil.compareFullStates(actual, expected);
    });
});
