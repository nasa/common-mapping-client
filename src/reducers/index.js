import { combineReducers } from 'redux';
import Immutable from 'immutable';
import view from './view';
import map from './map';
import settingsContainer from './settingsContainer';
import helpContainer from './helpContainer';
import async from './async';

const rootReducer = combineReducers({
    view,
    map,
    settingsContainer,
    helpContainer,
    async
});

export default rootReducer;
