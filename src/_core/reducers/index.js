import { combineReducers } from 'redux';
import Immutable from 'immutable';
import view from './view';
import map from './map';
import settings from './settings';
import help from './help';
import layerInfo from './layerInfo';
import share from './share';
import dateSlider from './dateSlider';
import asyncronous from './async';
import analytics from './analytics';
import alerts from './alerts';

const coreReducer = combineReducers({
    view,
    map,
    settings,
    help,
    layerInfo,
    share,
    dateSlider,
    asyncronous,
    analytics,
    alerts
});

export default coreReducer;
