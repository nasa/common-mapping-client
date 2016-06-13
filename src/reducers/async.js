import * as actionTypes from '../constants/actionTypes';
import {asyncState} from './models/async';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.


const loadLayers = (state, action) => {
    return state
        .set("loadingLayerSources", true);
};
const layersLoaded = (state, action) => {
    return state
        .set("loadingLayerSources", false)
        .set("layerLoadingAttempted", true);
};

const dismissAlert = (state, action) => {
    let remAlert = action.alert;
    return state.set("alerts", state.get("alerts").filter((alert) => {
        return alert !== remAlert;
    }));
};

export default function async(state = asyncState, action) {
    switch (action.type) {
        case actionTypes.LOAD_LAYERS:
            return loadLayers(state, action);

        case actionTypes.LAYERS_LOADED:
            return layersLoaded(state, action);

        case actionTypes.DISMISS_ALERT:
            return dismissAlert(state, action);

        default:
            return state;
    }
}
