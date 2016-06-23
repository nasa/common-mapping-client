import { combineReducers } from 'redux';
import Immutable from 'immutable';
import view from './view';
import map from './map';
import settings from './settings';
import help from './help';
import share from './share';
import dateSlider from './dateSlider';
import async from './async';

const rootReducer = combineReducers({
    view,
    map,
    settings,
    help,
    share,
    dateSlider,
    async
});

export default rootReducer;
