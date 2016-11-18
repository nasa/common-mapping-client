import * as types from '_core/constants/actionTypes';
import * as appStrings from '_core/constants/appStrings';
import * as appConfig from 'constants/appConfig';
import * as LayerActions from '_core/actions/LayerActions';
import * as MapActions from '_core/actions/MapActions';
import * as DateSliderActions from '_core/actions/DateSliderActions';
import * as AlertActions from '_core/actions/AlertActions';
import moment from 'moment';

export function completeInitialLoad() {
    return { type: types.COMPLETE_INITIAL_LOAD };
}
export function resetApplicationState() {
    return { type: types.RESET_APPLICATION_STATE };
}
export function openLayerInfo(param) {
    return { type: types.OPEN_LAYER_INFO, param };
}
export function closeLayerInfo() {
    return { type: types.CLOSE_LAYER_INFO };
}
export function openHelp() {
    return { type: types.OPEN_HELP };
}
export function closeHelp() {
    return { type: types.CLOSE_HELP };
}
export function openShare() {
    return { type: types.OPEN_SHARE };
}
export function closeShare() {
    return { type: types.CLOSE_SHARE };
}
export function toggleShareUpdateFlag() {
    return { type: types.TOGGLE_SHARE_UPDATE_FLAG };
}
export function selectHelpPage(param) {
    return { type: types.SELECT_HELP_PAGE, param };
}
export function dismissAlert(alert) {
    return { type: types.DISMISS_ALERT, alert };
}
export function dismissAllAlerts(alerts) {
    return { type: types.DISMISS_ALL_ALERTS, alerts };
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
export function setAutoUpdateUrl(autoUpdateUrl) {
    return { type: types.SET_AUTO_UPDATE_URL, autoUpdateUrl };
}
export function runUrlConfig(params) {
    // Takes an array of key value pairs and dispatches associated actions for each
    // one.

    // Extract layer opacities here since we can't rely on synchronous layer activation
    // for all maps and therefore need to activate layers with desired opacities
    let layerOpacities = params.find(x => x.key === appConfig.URL_KEYS.OPACITIES);
    let layerOpacitiesList = layerOpacities ? layerOpacities.value.split(",") : [];
    let layerOpacitiesMap = {};
    for (var i = 0; i < layerOpacitiesList.length; i += 2) {
        layerOpacitiesMap[layerOpacitiesList[i]] = layerOpacitiesList[i + 1];
    }
    return (dispatch) => {
        return Promise.all(params.map((param) => {
            return dispatch(translateUrlParamToActionDispatch(param, layerOpacitiesMap));
        })).catch((err) => {
            console.warn("Error in AppActions.runUrlConfig:", err);
            dispatch(AlertActions.addAlert({
                title: appStrings.ALERTS.URL_CONFIG_FAILED.title,
                body: appStrings.ALERTS.URL_CONFIG_FAILED.formatString,
                severity: appStrings.ALERTS.URL_CONFIG_FAILED.severity,
                time: new Date()
            }));
        });
    };
}

function translateUrlParamToActionDispatch(param, opacities) {
    switch (param.key) {
        case appConfig.URL_KEYS.ACTIVE_LAYERS:
            return setLayersActive(param.value.split(","), true, opacities);
        case appConfig.URL_KEYS.VIEW_MODE:
            return setViewMode(param.value);
        case appConfig.URL_KEYS.BASEMAP:
            return setBasemap(param.value);
        case appConfig.URL_KEYS.VIEW_EXTENT:
            return setExtent(param.value.split(","));
        case appConfig.URL_KEYS.ENABLE_PLACE_LABLES:
            return setLayersActive([appConfig.REFERENCE_LABELS_LAYER_ID], param.value === "true", opacities);
        case appConfig.URL_KEYS.ENABLE_POLITICAL_BOUNDARIES:
            return setLayersActive([appConfig.POLITICAL_BOUNDARIES_LAYER_ID], param.value === "true", opacities);
        case appConfig.URL_KEYS.ENABLE_3D_TERRAIN:
            return setTerrainEnabled(param.value === "true");
        case appConfig.URL_KEYS.DATE:
            return setDate(moment(param.value, 'YYYY-MM-DD').toDate());
        default:
            return { type: types.NO_ACTION };
    }
}

function setLayersActive(idArr, active, opacities) {
    return (dispatch) => {
        return new Promise(() => {
            for (let i = 0; i < idArr.length; ++i) {
                dispatch(LayerActions.setLayerActive(idArr[i], active, opacities[idArr[i]]));
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
                extent: extent.map((numStr) => {
                    return parseFloat(numStr);
                })
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

function setDate(date) {
    return (dispatch) => {
        return new Promise(() => {
            dispatch(MapActions.setDate(date));
        });
    };
}
