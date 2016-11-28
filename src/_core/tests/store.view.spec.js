import * as AppActions from '_core/actions/AppActions';
import * as LayerActions from '_core/actions/LayerActions';
import * as appConfig from 'constants/appConfig';
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
import MiscUtil from '_core/utils/MiscUtil';

const miscUtil = new MiscUtil();

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

export const StoreViewSpec = {
    name: "StoreViewSpec",
    tests: {
        default: {
            test1: () => {
                it('sets the app title, version, and subtitle from config', function() {
                    const store = createStore(rootReducer, initialState);
                    const actual = store.getState();

                    expect(actual.view.get("title")).to.equal(appConfig.APP_TITLE);
                    expect(actual.view.get("subtitle")).to.equal(appConfig.APP_SUBTITLE);
                    expect(actual.view.get("version")).to.equal(appConfig.APP_VERSION);
                });
            },

            test2: () => {
                it('can complete initial load', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        AppActions.completeInitialLoad()
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const state = store.getState();
                    const actual = {...state };

                    const expected = {...initialState };
                    expected.view = expected.view.set("initialLoadComplete", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test3: () => {
                it('can set full screen enabled', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        AppActions.setFullScreenMode(true)
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const state = store.getState();
                    const actual = {...state };

                    const expected = {...initialState };
                    expected.view = expected.view.set("isFullscreen", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test4: () => {
                it('can set full screen disabled', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        AppActions.setFullScreenMode(true),
                        AppActions.setFullScreenMode(false)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const state = store.getState();
                    const actual = {...state };

                    const expected = {...initialState };
                    expected.view = expected.view.set("isFullscreen", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test5: () => {
                it('can set layer menu open', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        LayerActions.setLayerMenuOpen(true)
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const state = store.getState();
                    const actual = {...state };

                    const expected = {...initialState };
                    expected.view = expected.view.set("layerMenuOpen", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test6: () => {
                it('can set layer menu closed', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        LayerActions.setLayerMenuOpen(false)
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const state = store.getState();
                    const actual = {...state };

                    const expected = {...initialState };
                    expected.view = expected.view.set("layerMenuOpen", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test7: () => {
                it('can set layer menu open and closed', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        LayerActions.setLayerMenuOpen(true),
                        LayerActions.setLayerMenuOpen(false)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const state = store.getState();
                    const actual = {...state };

                    const expected = {...initialState };
                    expected.view = expected.view.set("layerMenuOpen", false);

                    TestUtil.compareFullStates(actual, expected);
                });
            }
        }
    }
}
