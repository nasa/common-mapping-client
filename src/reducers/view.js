import * as actionTypes from '../constants/actionTypes';
import { viewState } from './models/view';
import MiscUtil from '../utils/MiscUtil';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.


const completeInitialLoad = (state, action) => {
    return state.set("initialLoadComplete", true);
};

const toggleLayerMenu = (state, action) => {
    return state.set("layerMenuOpen", !state.get("layerMenuOpen"));
};

const dismissAlert = (state, action) => {
    let remAlert = action.alert;
    return state.set("alerts", state.get("alerts").filter((alert) => {
        return alert !== remAlert;
    }));
};

const toggleFullScreen = (state, action) => {
    let isInFullscreenMode = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    if(isInFullscreenMode) {
        MiscUtil.exitFullscreen();
    } else {
        MiscUtil.enterFullScreen();
    }
    return state.set("isFullscreen", !isInFullscreenMode);
};

export default function view(state = viewState, action) {
    switch (action.type) {
        case actionTypes.COMPLETE_INITIAL_LOAD:
            return completeInitialLoad(state, action);

        case actionTypes.TOGGLE_LAYER_MENU:
            return toggleLayerMenu(state, action);

        case actionTypes.DISMISS_ALERT:
            return dismissAlert(state, action);

        case actionTypes.TOGGLE_FULL_SCREEN:
            return toggleFullScreen(state, action);

        default:
            return state;
    }
}
