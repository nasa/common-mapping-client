import * as appActions from '_core/actions/AppActions';
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
