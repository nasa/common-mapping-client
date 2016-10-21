import * as actionTypes from '../constants/actionTypes';
import { asyncState } from './models/async';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const initialDataLoading = (state, action) => {
    return state.set("loadingInitialData", true);
};
const initialDataLoaded = (state, action) => {
    return state
        .set("loadingInitialData", false)
        .set("initialLoadingAttempted", true);
};

const layerDataLoading = (state, action) => {
    return state.set("loadingLayerSources", true);
};

const layerDataLoaded = (state, action) => {
    return state
        .set("loadingLayerSources", false)
        .set("layerLoadingAttempted", true);
};

const paletteDataLoading = (state, action) => {
    return state.set("loadingLayerPalettes", true);
};

const paletteDataLoaded = (state, action) => {
    return state
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
        case actionTypes.INITIAL_DATA_LOADING:
            return initialDataLoading(state, action);

        case actionTypes.INITIAL_DATA_LOADED:
            return initialDataLoaded(state, action);

        case actionTypes.LAYER_DATA_LOADING:
            return layerDataLoading(state, action);

        case actionTypes.LAYER_DATA_LOADED:
            return layerDataLoaded(state, action);

        case actionTypes.PALETTE_DATA_LOADING:
            return paletteDataLoading(state, action);

        case actionTypes.PALETTE_DATA_LOADED:
            return paletteDataLoaded(state, action);

        case actionTypes.DISMISS_ALERT:
            return dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return dismissAllAlerts(state, action);

        default:
            return state;
    }
}