import * as DateSliderActions from "_core/actions/DateSliderActions";
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
import { webWorkerState } from "_core/reducers/models/webWorker";
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
    layerInfo: layerInfoState,
    webWorker: webWorkerState
};

export const StoreDateSliderSpec = {
    name: "StoreDateSliderSpec",
    tests: {
        default: {
            test1: () => {
                it("begins dragging", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [DateSliderActions.beginDragging(true)];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.dateSlider = expected.dateSlider.set("isDragging", true);

                    TestUtil.compareFullStates(actual, expected);
                });
            },
            test2: () => {
                it("ends dragging", function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        DateSliderActions.beginDragging(true),
                        DateSliderActions.endDragging(false)
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = { ...initialState };
                    expected.dateSlider = expected.dateSlider
                        .set("isDragging", false)
                        .setIn(["hoverDate", "isValid"], false);

                    TestUtil.compareFullStates(actual, expected);
                });
            }
        }
    }
};
