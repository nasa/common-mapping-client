import * as types from '../constants/actionTypes';
import * as appStrings from '../constants/appStrings';
import * as LayerActions from './LayerActions';
import * as MapActions from './MapActions';

export function completeInitialLoad() {
    return { type: types.COMPLETE_INITIAL_LOAD };
}
export function openHelp(param) {
    return { type: types.OPEN_HELP, param };
}
export function closeHelp() {
    return { type: types.CLOSE_HELP };
}
export function selectHelpPage(param) {
    return { type: types.SELECT_HELP_PAGE, param };
}
export function dismissAlert(alert) {
    return { type: types.DISMISS_ALERT, alert };
}
export function toggleFullScreen() {
    return { type: types.TOGGLE_FULL_SCREEN };
}
export function openSettings() {
    return { type: types.OPEN_SETTINGS };
}
export function closeSettings() {
    return { type: types.CLOSE_SETTINGS };
}
export function runUrlConfig(params) {
    return (dispatch) => {
        return Promise.all(params.map((param) => {
            return dispatch(translateUrlParamToActionDispatch(param));
        })).catch((err) => {
            console.warn("ERROR", err);
        });
    };
}

function translateUrlParamToActionDispatch(param) {
    switch (param.key) {
        case appStrings.URL_KEYS.ACTIVE_LAYERS:
            return activateLayers(param.value.split(","));
        case appStrings.URL_KEYS.OPACITIES:
            return setLayerOpacities(param.value.split(","));
        case appStrings.URL_KEYS.VIEW_MODE:
            return null;
        case appStrings.URL_KEYS.BASEMAP:
            return null;
        case appStrings.URL_KEYS.VIEW_EXTENT:
            return null;
        case appStrings.URL_KEYS.VIEW_CENTER:
            return null;
        case appStrings.URL_KEYS.ENABLE_PLACE_LABLES:
            return null;
        case appStrings.URL_KEYS.ENABLE_POLITICAL_BOUNDARIES:
            return null;
        case appStrings.URL_KEYS.ENABLE_3D_TERRAIN:
            return null;
        default:
            return null;
    }
}

function activateLayers(idArr) {
    return (dispatch) => {
        return new Promise(() => {
            for (let i = 0; i < idArr.length; ++i) {
                dispatch(LayerActions.activateLayer(idArr[i]));
            }
        });
    };
}

function setLayerOpacities(opacitiesArr) {
    return (dispatch) => {
        return new Promise(() => {
            for (let i = 0; i < opacitiesArr.length; ++i) {
                dispatch(LayerActions.toggleLayer(opacitiesArr[i]));
            }
        });
    };
}
