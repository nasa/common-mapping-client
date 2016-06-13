import * as actionTypes from '../constants/actionTypes';
import { viewState } from './models/view';
import MiscUtil from '../utils/MiscUtil';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.


const completeInitialLoad = (state, action) => {
    return state.set("initialLoadComplete", true);
};

const openMainMenu = (state, action) => {
    return state
        .set("mainMenuTab", action.param)
        .set("mainMenuOpen", true);
};

const closeMainMenu = (state, action) => {
    return state
        .set("mainMenuTab", "")
        .set("mainMenuOpen", false);

};

const toggleLayerMenu = (state, action) => {
    return state.set("layerMenuOpen", !state.get("layerMenuOpen"));
};

const openHelp = (state, action) => {
    return state.set("helpOpen", true);
};

const closeHelp = (state, action) => {
    return state.set("helpOpen", false);
};

const selectHelpPage = (state, action) => {
    return state.set("helpPage", action.param);
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

        case actionTypes.OPEN_MAIN_MENU:
            return openMainMenu(state, action);

        case actionTypes.CLOSE_MAIN_MENU:
            return closeMainMenu(state, action);

        case actionTypes.TOGGLE_LAYER_MENU:
            return toggleLayerMenu(state, action);

        case actionTypes.OPEN_HELP:
            return openHelp(state, action);

        case actionTypes.CLOSE_HELP:
            return closeHelp(state, action);

        case actionTypes.SELECT_HELP_PAGE:
            return selectHelpPage(state, action);

        case actionTypes.DISMISS_ALERT:
            return dismissAlert(state, action);

        case actionTypes.TOGGLE_FULL_SCREEN:
            return toggleFullScreen(state, action);

        default:
            return state;
    }
}
