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

describe('Store - Share', function() {
    it('enables auto update url', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.SET_AUTO_UPDATE_URL, autoUpdateUrl: true }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            share: shareState.set("autoUpdateUrl", true)
        };
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
    });
    it('disables auto update url', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.SET_AUTO_UPDATE_URL, autoUpdateUrl: false }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            share: shareState.set("autoUpdateUrl", false)
        };
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
    });
    it('can open the share container.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.OPEN_SHARE }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            share: shareState.set("isOpen", true),
            settings: settingsState,
            layerInfo: layerInfoState
        };

        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
    });
    it('can close the share container.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.OPEN_SHARE },
            { type: actionTypes.CLOSE_SHARE }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            share: shareState.set("isOpen", false),
            settings: settingsState,
            layerInfo: layerInfoState
        };

        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
    });
});