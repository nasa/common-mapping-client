import * as types from '../constants/actionTypes';
import * as appStrings from '../constants/appStrings';
import {REFERENCE_LABELS_LAYER_ID, POLITICAL_BOUNDARIES_LAYER_ID} from '../constants/mapConfig';
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
export function setFullScreenMode(enabled) {
    return { type: types.SET_FULL_SCREEN, enabled };
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
            return setLayersActive(param.value.split(","), true);
        case appStrings.URL_KEYS.OPACITIES:
            return setLayerOpacities(param.value.split(","));
        case appStrings.URL_KEYS.VIEW_MODE:
            return setViewMode(param.value);
        case appStrings.URL_KEYS.BASEMAP:
            return setBasemap(param.value);
        case appStrings.URL_KEYS.VIEW_EXTENT:
            return setExtent(param.value.split(","));
        case appStrings.URL_KEYS.ENABLE_PLACE_LABLES:
            return setLayersActive([REFERENCE_LABELS_LAYER_ID], param.value === "true");
        case appStrings.URL_KEYS.ENABLE_POLITICAL_BOUNDARIES:
            return setLayersActive([POLITICAL_BOUNDARIES_LAYER_ID], param.value === "true");
        case appStrings.URL_KEYS.ENABLE_3D_TERRAIN:
            return setTerrainEnabled(param.value === "true");
        default:
            return { type: types.NO_ACTION };
    }
}

function setLayersActive(idArr, active) {
    return (dispatch) => {
        return new Promise(() => {
            for (let i = 0; i < idArr.length; ++i) {
                dispatch(LayerActions.setLayerActive(idArr[i], active));
            }
        });
    };
}

function setLayerOpacities(opacitiesArr) {
    return (dispatch) => {
        return new Promise(() => {
            // array format is [id, opacity, id, opacity, ...]
            for (let i = 0; i < opacitiesArr.length; i += 2) {
                dispatch(LayerActions.setLayerOpacity(opacitiesArr[i], opacitiesArr[i + 1]));
            }
        });
    };
}

function setViewMode(viewMode) {
    return (dispatch) => {
        return new Promise(() => {
            dispatch(MapActions.setMapViewMode(viewMode));
        });
    };
}

function setBasemap(basemapId) {
    return (dispatch) => {
        return new Promise(() => {
            dispatch(MapActions.setBasemap(basemapId));
        });
    };
}

function setExtent(extent) {
    return (dispatch) => {
        return new Promise(() => {
            dispatch(MapActions.setMapView({
                extent: extent.map((numStr) => {return parseFloat(numStr);})
            }));
        });
    };
}

function setTerrainEnabled(enabled) {
    return (dispatch) => {
        return new Promise(() => {
            dispatch(MapActions.setTerrainEnabled(enabled));
        });
    };
}