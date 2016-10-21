import * as LayerActions from '../actions/LayerActions';
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

describe('Store - Layer Info', function() {
    it('opens layer info and sets the correct layer object.', function() {
        const store = createStore(rootReducer, initialState);

        const layer = layerModel.merge({
            id: "TEST_LAYER_1"
        });

        const actions = [
            LayerActions.openLayerInfo(layer)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.layerInfo = expected.layerInfo
            .set("isOpen", true)
            .set("layer", layer);

        TestUtil.compareFullStates(actual, expected);
    });

    it('closes layer info and maintains the layer object reference.', function() {
        const store = createStore(rootReducer, initialState);

        const layer = layerModel.merge({
            id: "TEST_LAYER_1"
        });

        const actions = [
            LayerActions.openLayerInfo(layer),
            LayerActions.closeLayerInfo()
        ];

        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.layerInfo = expected.layerInfo
            .set("isOpen", false)
            .set("layer", layer);

        TestUtil.compareFullStates(actual, expected);
    });
});
