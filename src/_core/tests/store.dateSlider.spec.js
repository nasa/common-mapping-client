import * as DateSliderActions from '../actions/DateSliderActions';
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
import moment from 'moment';

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

describe('Store - Date Slider', function() {
    it('begins dragging', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            DateSliderActions.beginDragging(true)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.dateSlider = expected.dateSlider.set("isDragging", true);

        TestUtil.compareFullStates(actual, expected);
    });

    it('ends dragging', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            DateSliderActions.beginDragging(true),
            DateSliderActions.endDragging(false)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.dateSlider = expected.dateSlider
            .set("isDragging", false)
            .setIn(["hoverDate", "isValid"], false);

        TestUtil.compareFullStates(actual, expected);
    });
});
