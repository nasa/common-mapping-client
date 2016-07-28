import * as actionTypes from '../constants/actionTypes';
import { asyncState } from './models/async';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const loadInitialData = (state, action) => {
    return state.set("loadingInitialData", true);
};
const initialDataLoaded = (state, action) => {
    return state
        .set("loadingInitialData", false)
        .set("initialLoadingAttempted", true);
};

const loadLayers = (state, action) => {
    return state.set("loadingLayerSources", true);
};

const layersLoaded = (state, action) => {
    return state
        .set("loadingLayerSources", false)
        .set("layerLoadingAttempted", true);
};

const loadPalettes = (state, action) => {
    return state.set("loadingLayerPalettes", true);
};

const palettesLoaded = (state, action) => {
    return this.state
        .set("loadingLayerPalettes", false)
        .set("paletteLoadingAttempted", true);
};

const dismissAlert = (state, action) => {
    let remAlert = action.alert;
    return state.set("alerts", state.get("alerts").filter((alert) => {
        return alert !== remAlert;
    }));
};

const dismissAllAlerts = (state, action) => {
    return state.set("alerts", state.get("alerts").clear());
};

export default function asyncronous(state = asyncState, action) {
    switch (action.type) {
        case actionTypes.LOAD_INITIAL_DATA:
            return loadInitialData(state, action);

        case actionTypes.INITIAL_DATA_LOADED:
            return initialDataLoaded(state, action);

        case actionTypes.LOAD_LAYERS:
            return loadLayers(state, action);

        case actionTypes.LAYERS_LOADED:
            return layersLoaded(state, action);

        case actionTypes.LOAD_LAYER_PALETTES:
            return loadPalettes(state, action);

        case actionTypes.LAYER_PALETTES_LOADED:
            return palettesLoaded(state, action);

        case actionTypes.DISMISS_ALERT:
            return dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return dismissAllAlerts(state, action);

        default:
            return state;
    }
}