import * as actionTypes from "_core/constants/actionTypes";
import * as analyticsActions from "_core/actions/AnalyticsActions";
import { createStore } from "redux";
import { expect } from "chai";
import rootReducer from "_core/reducers";
import { mapState, layerModel, paletteModel } from "_core/reducers/models/map";
import { asyncState } from "_core/reducers/models/async";
import { helpState } from "_core/reducers/models/help";
import { shareState } from "_core/reducers/models/share";
import { settingsState } from "_core/reducers/models/settings";
import { dateSliderState } from "_core/reducers/models/dateSlider";
import { analyticsState } from "_core/reducers/models/analytics";
import { viewState } from "_core/reducers/models/view";
import { layerInfoState } from "_core/reducers/models/layerInfo";
import TestUtil from "_core/tests/TestUtil";

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

export const StoreAnalyticsSpec = {
    name: "StoreAnalyticsSpec",
    tests: {
        default: {
            test1: () => {
                it("enables user analytics", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [analyticsActions.setAnalyticsEnabled(true)];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    actual.analytics = actual.analytics.remove("currentBatch");

                    const expected = { ...initialState };
                    expected.analytics = expected.analytics
                        .set("isEnabled", true)
                        .remove("currentBatch");

                    TestUtil.compareFullStates(actual, expected, true);
                });
            },
            test2: () => {
                it("disables user analytics", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        analyticsActions.setAnalyticsEnabled(true),
                        analyticsActions.setAnalyticsEnabled(false)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    actual.analytics = actual.analytics.remove("currentBatch");

                    const expected = { ...initialState };
                    expected.analytics = expected.analytics
                        .set("isEnabled", false)
                        .remove("currentBatch");

                    TestUtil.compareFullStates(actual, expected, true);
                });
            }
        }
    }
};
