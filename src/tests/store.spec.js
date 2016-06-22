import * as actionTypes from '../constants/actionTypes';
import * as mapStrings from '../constants/mapStrings';
import { createStore } from 'redux';
import { expect } from 'chai';
import rootReducer from '../reducers';
import { mapState, layerModel, paletteModel } from '../reducers/models/map';
import { asyncState } from '../reducers/models/async';
import { helpContainerState } from '../reducers/models/helpContainer';
import { settingsContainerState } from '../reducers/models/settingsContainer';
import { viewState } from '../reducers/models/view';
import MapUtil from '../utils/MapUtil.js';


const initialState = {
    map: mapState,
    view: viewState,
    async: asyncState,
    helpContainer: helpContainerState,
    settingsContainer: settingsContainerState
};


describe('Store', function() {
    it('open -> close -> open help.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.OPEN_HELP },
            { type: actionTypes.CLOSE_HELP },
            { type: actionTypes.OPEN_HELP }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            async: asyncState,
            helpContainer: helpContainerState.set("isOpen", true),
            settingsContainer: settingsContainerState
        };

        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.async.toJS()).to.deep.equal(expected.async.toJS());
        expect(actual.helpContainer.toJS()).to.deep.equal(expected.helpContainer.toJS());
        expect(actual.settingsContainer.toJS()).to.deep.equal(expected.settingsContainer.toJS());
    });
    it('initializes maps', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.INITIALIZE_MAP, mapType: mapStrings.MAP_LIB_2D }
        ];
        actions.forEach(action => store.dispatch(action));


        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps"),
            view: viewState,
            async: asyncState,
            helpContainer: helpContainerState,
            settingsContainer: settingsContainerState
        };

        expect(actual.map.get("maps").size).to.equal(1);
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.async.toJS()).to.deep.equal(expected.async.toJS());
        expect(actual.helpContainer.toJS()).to.deep.equal(expected.helpContainer.toJS());
        expect(actual.settingsContainer.toJS()).to.deep.equal(expected.settingsContainer.toJS());
    });
    it('can zoom maps and stuff', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.INITIALIZE_MAP, mapType: mapStrings.MAP_LIB_2D },
            { type: actionTypes.ZOOM_IN },
            { type: actionTypes.ZOOM_IN },
            { type: actionTypes.ZOOM_OUT },
            { type: actionTypes.ZOOM_IN },
            { type: actionTypes.ZOOM_OUT }
        ];
        actions.forEach(action => store.dispatch(action));


        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps").setIn(["view", "zoom"], mapState.getIn(["view", "zoom"]) + 1),
            view: viewState,
            async: asyncState,
            helpContainer: helpContainerState,
            settingsContainer: settingsContainerState
        };

        expect(actual.map.get("maps").size).to.equal(1);
        expect(actual.map.remove("maps").get("view").toJS()).to.deep.equal(expected.map.remove("maps").get("view").toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.async.toJS()).to.deep.equal(expected.async.toJS());
        expect(actual.helpContainer.toJS()).to.deep.equal(expected.helpContainer.toJS());
        expect(actual.settingsContainer.toJS()).to.deep.equal(expected.settingsContainer.toJS());
    });
});
