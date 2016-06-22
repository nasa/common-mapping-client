import * as actionTypes from '../constants/actionTypes';
import { createStore } from 'redux';
import { expect } from 'chai';
import rootReducer from '../reducers';
import { mapState, layerModel, paletteModel } from '../reducers/models/map';
import { asyncState } from '../reducers/models/async';
import { helpContainerState } from '../reducers/models/helpContainer';
import { settingsContainerState } from '../reducers/models/settingsContainer';
import { viewState } from '../reducers/models/view';


const initialState = {
    map: mapState,
    view: viewState,
    async: asyncState,
    helpContainer: helpContainerState,
    settingsContainer: settingsContainerState
};


describe('Store', function() {
    it('THIS IS A CRAZY TEST', function() {
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
});
