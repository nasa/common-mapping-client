import * as actionTypes from '../constants/actionTypes';
import { viewState } from './models/view';
import MiscUtil from '../utils/MiscUtil';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.


const completeInitialLoad = (state, action) => {
    return state.set("initialLoadComplete", true);
};

const setLayerMenuOpen = (state, action) => {
    return state.set("layerMenuOpen", action.open);
};

const dismissAlert = (state, action) => {
    let remAlert = action.alert;
    return state.set("alerts", state.get("alerts").filter((alert) => {
        return alert !== remAlert;
    }));
};

const setFullScreen = (state, action) => {
    if(action.enabled) {
        MiscUtil.enterFullScreen();
    } else {
        MiscUtil.exitFullscreen();
    }
    return state.set("isFullscreen", action.enabled);
};

export default function view(state = viewState, action) {
    switch (action.type) {
        case actionTypes.COMPLETE_INITIAL_LOAD:
            return completeInitialLoad(state, action);

        case actionTypes.SET_LAYER_MENU_OPEN:
            return setLayerMenuOpen(state, action);

        case actionTypes.DISMISS_ALERT:
            return dismissAlert(state, action);

        case actionTypes.SET_FULL_SCREEN:
            return setFullScreen(state, action);

        default:
            return state;
    }
}
