/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as types from "_core/constants/actionTypes";
import * as appStrings from "_core/constants/appStrings";
import appConfig from "constants/appConfig";
import * as mapActions from "_core/actions/mapActions";
import * as dateSliderActions from "_core/actions/dateSliderActions";
import * as alertActions from "_core/actions/alertActions";

export function checkBrowserFunctionalities() {
    return { type: types.CHECK_BROWSER_FUNCTIONALITIES };
}
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
export function setHelpOpen(isOpen) {
    return { type: types.SET_HELP_OPEN, isOpen };
}
export function setShareOpen(isOpen) {
    return { type: types.SET_SHARE_OPEN, isOpen };
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
export function setDistractionFreeMode(enabled) {
    return { type: types.SET_DISTRACTION_FREE_MODE, enabled };
}
export function hideMapControls(hidden) {
    return { type: types.HIDE_MAP_CONTROLS, hidden };
}
export function setMapControlsToolsOpen(open) {
    return { type: types.SET_MAP_CONTROL_TOOLS_OPEN, open };
}
export function setMapControlsBasemapPickerOpen(open) {
    return { type: types.SET_MAP_CONTROL_BASEMAP_PICKER_OPEN, open };
}
export function setSettingsOpen(isOpen) {
    return { type: types.SET_SETTINGS_OPEN, isOpen };
}
export function setAutoUpdateUrl(autoUpdateUrl) {
    return { type: types.SET_AUTO_UPDATE_URL, autoUpdateUrl };
}
export function runUrlConfig(params) {
    // Takes an array of key value pairs and dispatches associated actions for each
    // one.

    return dispatch => {
        return Promise.all(
            params.map(param => {
                return dispatch(translateUrlParamToActionDispatch(param));
            })
        ).catch(err => {
            console.warn("Error in appActions.runUrlConfig:", err);
            dispatch(
                alertActions.addAlert({
                    title: appStrings.ALERTS.URL_CONFIG_FAILED.title,
                    body: appStrings.ALERTS.URL_CONFIG_FAILED.formatString,
                    severity: appStrings.ALERTS.URL_CONFIG_FAILED.severity,
                    time: new Date()
                })
            );
        });
    };
}

export function translateUrlParamToActionDispatch(param) {
    switch (param.key) {
        case appConfig.URL_KEYS.ACTIVE_LAYERS:
            return setLayersActive(param.value.split(","), true);
        case appConfig.URL_KEYS.VIEW_MODE:
            return setViewMode(param.value);
        case appConfig.URL_KEYS.BASEMAP:
            return setBasemap(param.value);
        case appConfig.URL_KEYS.VIEW_EXTENT:
            return setExtent(param.value.split(","));
        case appConfig.URL_KEYS.ENABLE_PLACE_LABLES:
            return setLayersActive([appConfig.REFERENCE_LABELS_LAYER_ID], param.value === "true");
        case appConfig.URL_KEYS.ENABLE_POLITICAL_BOUNDARIES:
            return setLayersActive(
                [appConfig.POLITICAL_BOUNDARIES_LAYER_ID],
                param.value === "true"
            );
        case appConfig.URL_KEYS.ENABLE_3D_TERRAIN:
            return setTerrainEnabled(param.value.toString() === "true");
        case appConfig.URL_KEYS.DATE:
            return setDate(param.value);
        case appConfig.URL_KEYS.TIMELINE_RES:
            return setTimelineRes(param.value);
        default:
            return { type: types.NO_ACTION };
    }
}

function setLayersActive(idArr, active) {
    return dispatch => {
        return new Promise(() => {
            // array format is [id(opacity), id(opacity), ...]
            for (let i = 0; i < idArr.length; ++i) {
                let splitId = idArr[i].split("(");
                let id = splitId[0];
                let opacity = splitId.length === 2 ? splitId[1].split(")")[0] : false;
                if (opacity) {
                    dispatch(mapActions.setLayerOpacity(id, opacity));
                }
                dispatch(mapActions.setLayerActive(id, active));
            }
        });
    };
}

function setViewMode(viewMode) {
    return dispatch => {
        return new Promise(() => {
            dispatch(mapActions.setMapViewMode(viewMode));
        });
    };
}

function setBasemap(basemapId) {
    return dispatch => {
        return new Promise(() => {
            dispatch(mapActions.setBasemap(basemapId));
        });
    };
}

function setExtent(extentStrArr) {
    return dispatch => {
        return new Promise(() => {
            dispatch(mapActions.setMapView({ extent: extentStrArr }, true));
        });
    };
}

function setTerrainEnabled(enabled) {
    return dispatch => {
        return new Promise(() => {
            dispatch(mapActions.setTerrainEnabled(enabled));
        });
    };
}

function setDate(dateStr) {
    return dispatch => {
        return new Promise(() => {
            dispatch(mapActions.setDate(dateStr));
        });
    };
}

function setTimelineRes(resStr) {
    return dispatch => {
        return new Promise(() => {
            dispatch(dateSliderActions.setDateResolution(resStr));
        });
    };
}
