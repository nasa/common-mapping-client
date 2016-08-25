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

        let layer = layerModel.merge({
            id: "TEST_LAYER_1"
        });
        const actions = [
            LayerActions.openLayerInfo(layer)
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps"),
            layerInfo: layerInfoState.set("isOpen", true).set("layer", layer),
            help: helpState,
            view: viewState,
            asyncronous: asyncState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState
        };

        // CHANGE
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());

        // NO CHANGE
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
    });
    
    it('closes layer info and maintains the layer object reference.', function() {
        const store = createStore(rootReducer, initialState);

        let layer = layerModel.merge({
            id: "TEST_LAYER_1"
        });

        const actions = [
            LayerActions.openLayerInfo(layer),
            LayerActions.closeLayerInfo()
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps"),
            layerInfo: layerInfoState.set("isOpen", false).set("layer", layer),
            help: helpState,
            view: viewState,
            asyncronous: asyncState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState
        };

        // CHANGE
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());

        // NO CHANGE
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
    });
});
