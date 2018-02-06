/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import appConfig from "constants/appConfig";
import * as types from "_core/constants/actionTypes";
import * as appStrings from "_core/constants/appStrings";
import * as alertActions from "_core/actions/alertActions";
import * as asyncActions from "_core/actions/asyncActions";
import MiscUtil from "_core/utils/MiscUtil";

export function initializeMap(mapType, container) {
    return { type: types.INITIALIZE_MAP, mapType, container };
}

export function setMapViewMode(mode) {
    return { type: types.SET_MAP_VIEW_MODE, mode };
}

export function resetOrientation(duration) {
    return { type: types.RESET_ORIENTATION, duration };
}

export function setMapView(viewInfo, targetActiveMap = true) {
    return { type: types.SET_MAP_VIEW, viewInfo, targetActiveMap };
}

export function panMap(direction, extraFar) {
    return { type: types.PAN_MAP, direction, extraFar };
}

export function setTerrainEnabled(enabled) {
    return { type: types.SET_TERRAIN_ENABLED, enabled };
}

export function setTerrainExaggeration(terrainExaggeration) {
    return { type: types.SET_TERRAIN_EXAGGERATION, terrainExaggeration };
}

export function setScaleUnits(units) {
    return { type: types.SET_SCALE_UNITS, units };
}

export function zoomIn() {
    return { type: types.ZOOM_IN };
}

export function zoomOut() {
    return { type: types.ZOOM_OUT };
}

export function setBasemap(layer) {
    return { type: types.SET_BASEMAP, layer };
}

export function hideBasemap() {
    return { type: types.HIDE_BASEMAP };
}

export function setDate(date) {
    return { type: types.SET_MAP_DATE, date };
}

export function pixelHover(pixel) {
    return { type: types.PIXEL_HOVER, pixel };
}

export function invalidatePixelHover() {
    return { type: types.INVALIDATE_PIXEL_HOVER };
}

export function pixelClick(clickEvt) {
    return { type: types.PIXEL_CLICK, clickEvt };
}

export function enableMeasuring(geometryType, measurementType) {
    return { type: types.ENABLE_MEASURING, geometryType, measurementType };
}

export function disableMeasuring() {
    return { type: types.DISABLE_MEASURING };
}

export function enableDrawing(geometryType) {
    return { type: types.ENABLE_DRAWING, geometryType };
}

export function disableDrawing() {
    return { type: types.DISABLE_DRAWING };
}

export function addGeometryToMap(geometry, interactionType, geodesic = false) {
    return { type: types.ADD_GEOMETRY_TO_MAP, geometry, interactionType, geodesic };
}

export function addMeasurementLabelToGeometry(geometry, measurementType, units) {
    return { type: types.ADD_MEASUREMENT_LABEL_TO_GEOMETRY, geometry, measurementType, units };
}

export function removeAllDrawings() {
    return { type: types.REMOVE_ALL_DRAWINGS };
}

export function removeAllMeasurements() {
    return { type: types.REMOVE_ALL_MEASUREMENTS };
}

export function setLayerMenuOpen(open) {
    return { type: types.SET_LAYER_MENU_OPEN, open };
}

export function setLayerActive(layer, active) {
    return { type: types.SET_LAYER_ACTIVE, layer, active };
}

export function setLayerDisabled(layer, disabled) {
    return { type: types.SET_LAYER_DISABLED, layer, disabled };
}

export function setLayerOpacity(layer, opacity) {
    return { type: types.SET_LAYER_OPACITY, layer, opacity };
}

export function changeLayerPalette(layer, palette) {
    return { type: types.SET_LAYER_PALETTE, layer, palette };
}

export function moveLayerToTop(layer) {
    return { type: types.MOVE_LAYER_TO_TOP, layer };
}

export function moveLayerToBottom(layer) {
    return { type: types.MOVE_LAYER_TO_BOTTOM, layer };
}

export function moveLayerUp(layer) {
    return { type: types.MOVE_LAYER_UP, layer };
}

export function moveLayerDown(layer) {
    return { type: types.MOVE_LAYER_DOWN, layer };
}

export function activateDefaultLayers() {
    return { type: types.ACTIVATE_DEFAULT_LAYERS };
}

export function openLayerInfo(layer) {
    return { type: types.OPEN_LAYER_INFO, layer };
}

export function closeLayerInfo() {
    return { type: types.CLOSE_LAYER_INFO };
}

export function setCurrentMetadata(layer, data) {
    return { type: types.SET_CURRENT_METADATA, layer, data };
}

export function loadLayerMetadata(layer) {
    return dispatch => {
        // signal loading
        dispatch(setLayerMetadataLoadingAsync(true, false));
        // open the display
        dispatch(openLayerInfo(layer));
        if (layer.getIn(["metadata", "url"]) && layer.getIn(["metadata", "handleAs"])) {
            // fetch the metadata
            return MiscUtil.asyncFetch({
                url: layer.getIn(["metadata", "url"]),
                handleAs: layer.getIn(["metadata", "handleAs"])
            }).then(
                data => {
                    // store the data for display
                    dispatch(setCurrentMetadata(layer, data));
                    // signal loading complete
                    dispatch(setLayerMetadataLoadingAsync(false, false));
                },
                err => {
                    console.warn("Error in mapActions.openLayerInfo:", err);
                    // signal loading failed
                    dispatch(setLayerMetadataLoadingAsync(false, true));

                    // display alert
                    dispatch(
                        alertActions.addAlert({
                            title: appStrings.ALERTS.FETCH_METADATA_FAILED.title,
                            body: appStrings.ALERTS.FETCH_METADATA_FAILED.formatString
                                .split("{LAYER}")
                                .join(layer.get("title")),
                            severity: appStrings.ALERTS.FETCH_METADATA_FAILED.severity,
                            time: new Date()
                        })
                    );
                }
            );
        } else {
            // signal loading failed
            dispatch(setLayerMetadataLoadingAsync(false, true));

            // display alert
            dispatch(
                alertActions.addAlert({
                    title: appStrings.ALERTS.FETCH_METADATA_FAILED.title,
                    body: appStrings.ALERTS.FETCH_METADATA_FAILED.formatString
                        .split("{LAYER}")
                        .join(layer.get("title")),
                    severity: appStrings.ALERTS.FETCH_METADATA_FAILED.severity,
                    time: new Date()
                })
            );
        }
    };
}

export function loadInitialData(callback = null) {
    return dispatch => {
        // Set flag that initial layer data has begun loading
        dispatch(setInitialDataLoadingAsync(true, false));
        // Fetch all initial layer data
        return Promise.all([dispatch(loadLayerData()), dispatch(loadPaletteData())]).then(
            () => {
                // Set flag that initial layer data has finished loading
                dispatch(setInitialDataLoadingAsync(false, false));
                if (typeof callback === "function") {
                    callback.call(this);
                }
            },
            err => {
                console.warn("Error in mapActions.loadInitialData:", err);
                dispatch(
                    alertActions.addAlert({
                        title: appStrings.ALERTS.INITIAL_DATA_LOAD_FAILED.title,
                        body: appStrings.ALERTS.INITIAL_DATA_LOAD_FAILED.formatString,
                        severity: appStrings.ALERTS.INITIAL_DATA_LOAD_FAILED.severity,
                        time: new Date()
                    })
                );
                dispatch(setInitialDataLoadingAsync(false, true));
                if (typeof callback === "function") {
                    callback.call(this);
                }
            }
        );
    };
}

export function loadPaletteData() {
    return dispatch => {
        dispatch(setPaletteDataLoadingAsync(true, false));

        return MiscUtil.asyncFetch({
            url: appConfig.URLS.paletteConfig,
            handleAs: appStrings.FILE_TYPE_JSON,
            options: { credentials: "same-origin" }
        }).then(
            data => {
                dispatch(ingestLayerPalettes(data));
                dispatch(setPaletteDataLoadingAsync(false, false));
            },
            err => {
                console.warn("Error in mapActions.loadPaletteData:", err);
                throw err;
            }
        );
    };
}

export function loadLayerData() {
    return dispatch => {
        dispatch(setLayerDataLoadingAsync(true, false));

        return Promise.all(
            appConfig.URLS.layerConfig.map(el => {
                return dispatch(loadSingleLayerSource(el));
            })
        ).then(
            () => {
                dispatch({ type: types.MERGE_LAYERS });
                dispatch(setLayerDataLoadingAsync(false, false));
            },
            err => {
                dispatch(setLayerDataLoadingAsync(false, true));
                console.warn("Error in mapActions.loadLayerData:", err);
                throw err;
            }
        );
    };
}

export function loadSingleLayerSource(options) {
    return dispatch => {
        return MiscUtil.asyncFetch({
            url: options.url,
            handleAs: options.type,
            options: { credentials: "same-origin" }
        }).then(
            data => {
                dispatch(ingestLayerConfig(data, options));
            },
            err => {
                console.warn("Error in mapActions.loadSingleLayerSource: ", err);
                throw err;
            }
        );
    };
}

// action helpers
function setInitialDataLoadingAsync(loading, failed) {
    return asyncActions.setAsyncLoadingState("initialDataAsync", {
        loading: loading,
        failed: failed
    });
}

function setPaletteDataLoadingAsync(loading, failed) {
    return asyncActions.setAsyncLoadingState("layerPalettesAsync", {
        loading: loading,
        failed: failed
    });
}

function setLayerDataLoadingAsync(loading, failed) {
    return asyncActions.setAsyncLoadingState("layerSourcesAsync", {
        loading: loading,
        failed: failed
    });
}

function setLayerMetadataLoadingAsync(loading, failed) {
    return asyncActions.setAsyncLoadingState("layerMetadataAsync", {
        loading: loading,
        failed: failed
    });
}

function ingestLayerConfig(config, options) {
    return { type: types.INGEST_LAYER_CONFIG, config, options };
}

function mergeLayers() {
    return { type: types.MERGE_LAYERS };
}

function ingestLayerPalettes(paletteConfig) {
    return { type: types.INGEST_LAYER_PALETTES, paletteConfig };
}
