/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as types from "_core/constants/actionTypes";
import * as appStrings from "_core/constants/appStrings";
import appConfig from "constants/appConfig";
import { AlertAction, DateSliderAction, MapAction } from "actions";

export default class AppAction {
    static checkBrowserFunctionalities() {
        return { type: types.CHECK_BROWSER_FUNCTIONALITIES };
    }
    static completeInitialLoad() {
        return { type: types.COMPLETE_INITIAL_LOAD };
    }
    static resetApplicationState() {
        return { type: types.RESET_APPLICATION_STATE };
    }
    static openLayerInfo(param) {
        return { type: types.OPEN_LAYER_INFO, param };
    }
    static closeLayerInfo() {
        return { type: types.CLOSE_LAYER_INFO };
    }
    static setHelpOpen(isOpen) {
        return { type: types.SET_HELP_OPEN, isOpen };
    }
    static setShareOpen(isOpen) {
        return { type: types.SET_SHARE_OPEN, isOpen };
    }
    static toggleShareUpdateFlag() {
        return { type: types.TOGGLE_SHARE_UPDATE_FLAG };
    }
    static selectHelpPage(param) {
        return { type: types.SELECT_HELP_PAGE, param };
    }
    static dismissAlert(alert) {
        return { type: types.DISMISS_ALERT, alert };
    }
    static dismissAllAlerts(alerts) {
        return { type: types.DISMISS_ALL_ALERTS, alerts };
    }
    static setFullScreenMode(enabled) {
        return { type: types.SET_FULL_SCREEN, enabled };
    }
    static setDistractionFreeMode(enabled) {
        return { type: types.SET_DISTRACTION_FREE_MODE, enabled };
    }
    static hideMapControls(hidden) {
        return { type: types.HIDE_MAP_CONTROLS, hidden };
    }
    static setMapControlsToolsOpen(open) {
        return { type: types.SET_MAP_CONTROL_TOOLS_OPEN, open };
    }
    static setMapControlsBasemapPickerOpen(open) {
        return { type: types.SET_MAP_CONTROL_BASEMAP_PICKER_OPEN, open };
    }
    static setSettingsOpen(isOpen) {
        return { type: types.SET_SETTINGS_OPEN, isOpen };
    }
    static setAutoUpdateUrl(autoUpdateUrl) {
        return { type: types.SET_AUTO_UPDATE_URL, autoUpdateUrl };
    }
    static runUrlConfig(params) {
        // Takes an array of key value pairs and dispatches associated actions for each
        // one.

        return dispatch => {
            return Promise.all(
                params.map(param => {
                    return dispatch(this.translateUrlParamToActionDispatch(param));
                })
            ).catch(err => {
                console.warn("Error in appActions.runUrlConfig:", err);
                dispatch(
                    AlertAction.addAlert({
                        title: appStrings.ALERTS.URL_CONFIG_FAILED.title,
                        body: appStrings.ALERTS.URL_CONFIG_FAILED.formatString,
                        severity: appStrings.ALERTS.URL_CONFIG_FAILED.severity,
                        time: new Date()
                    })
                );
            });
        };
    }

    static translateUrlParamToActionDispatch(param) {
        console.log("CORE - AppAction.translateUrlParamToActionDispatch");
        switch (param.key) {
            case appConfig.URL_KEYS.ACTIVE_LAYERS:
                return this.setLayersActive(param.value.split(","), true);
            case appConfig.URL_KEYS.VIEW_MODE:
                return this.setViewMode(param.value);
            case appConfig.URL_KEYS.BASEMAP:
                return this.setBasemap(param.value);
            case appConfig.URL_KEYS.VIEW_EXTENT:
                return this.setExtent(param.value.split(","));
            case appConfig.URL_KEYS.ENABLE_PLACE_LABLES:
                return this.setLayersActive(
                    [appConfig.REFERENCE_LABELS_LAYER_ID],
                    param.value === "true"
                );
            case appConfig.URL_KEYS.ENABLE_POLITICAL_BOUNDARIES:
                return this.setLayersActive(
                    [appConfig.POLITICAL_BOUNDARIES_LAYER_ID],
                    param.value === "true"
                );
            case appConfig.URL_KEYS.ENABLE_3D_TERRAIN:
                return this.setTerrainEnabled(param.value.toString() === "true");
            case appConfig.URL_KEYS.DATE:
                return this.setDate(param.value);
            case appConfig.URL_KEYS.TIMELINE_RES:
                return this.setTimelineRes(param.value);
            default:
                return { type: types.NO_ACTION };
        }
    }

    static setLayersActive(idArr, active) {
        console.log("CORE - AppAction.setLayersActive");
        return dispatch => {
            return new Promise(() => {
                // array format is [id(opacity), id(opacity), ...]
                for (let i = 0; i < idArr.length; ++i) {
                    let splitId = idArr[i].split("(");
                    let id = splitId[0];
                    let opacity = splitId.length === 2 ? splitId[1].split(")")[0] : false;
                    if (opacity) {
                        dispatch(MapAction.setLayerOpacity(id, opacity));
                    }
                    dispatch(MapAction.setLayerActive(id, active));
                }
            });
        };
    }

    static setViewMode(viewMode) {
        return dispatch => {
            return new Promise(() => {
                dispatch(MapAction.setMapViewMode(viewMode));
            });
        };
    }

    static setBasemap(basemapId) {
        return dispatch => {
            return new Promise(() => {
                dispatch(MapAction.setBasemap(basemapId));
            });
        };
    }

    static setExtent(extentStrArr) {
        return dispatch => {
            return new Promise(() => {
                dispatch(MapAction.setMapView({ extent: extentStrArr }, true));
            });
        };
    }

    static setTerrainEnabled(enabled) {
        return dispatch => {
            return new Promise(() => {
                dispatch(MapAction.setTerrainEnabled(enabled));
            });
        };
    }

    static setDate(dateStr) {
        return dispatch => {
            return new Promise(() => {
                dispatch(MapAction.setDate(dateStr));
            });
        };
    }

    static setTimelineRes(resStr) {
        return dispatch => {
            return new Promise(() => {
                dispatch(DateSliderAction.setDateResolution(resStr));
            });
        };
    }
}
