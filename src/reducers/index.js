import { combineReducers } from 'redux';
import Immutable from 'immutable';
import view from './view';
import map from './map';
import datasetsContainer from './datasetsContainer';
import toolsContainer from './toolsContainer';
import exportsContainer from './exportsContainer';
import settingsContainer from './settingsContainer';
import helpContainer from './helpContainer';
import async from './async';

const rootReducer = combineReducers({
    view,
    map,
    datasetsContainer,
    toolsContainer,
    exportsContainer,
    settingsContainer,
    helpContainer,
    async
});

export default rootReducer;
