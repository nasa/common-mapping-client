import { combineReducers } from 'redux';
import Immutable from 'immutable';
import view from './view';
import map from './map';
import tools from './tools';
import settings from './settings';
import help from './help';
import layerInfo from './layerInfo';
import share from './share';
import dateSlider from './dateSlider';
import asyncronous from './async';
import analytics from './analytics';

const rootReducer = combineReducers({
    view,
    map,
    tools,
    settings,
    help,
    layerInfo,
    share,
    dateSlider,
    asyncronous,
    analytics
});

export default rootReducer;
