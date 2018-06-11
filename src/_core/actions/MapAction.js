/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import appConfig from "constants/appConfig";
import * as types from "_core/constants/actionTypes";
import * as appStrings from "_core/constants/appStrings";
import { AlertAction, AsyncAction } from "actions";
import MiscUtil from "_core/utils/MiscUtil";

export default class MapAction {
    static initializeMap(mapType, container) {
        return { type: types.INITIALIZE_MAP, mapType, container };
    }

    static setMapViewMode(mode) {
        return { type: types.SET_MAP_VIEW_MODE, mode };
    }

    static resetOrientation(duration) {
        return { type: types.RESET_ORIENTATION, duration };
    }

    static setMapView(viewInfo, targetActiveMap = true) {
        return { type: types.SET_MAP_VIEW, viewInfo, targetActiveMap };
    }

    static panMap(direction, extraFar) {
        return { type: types.PAN_MAP, direction, extraFar };
    }

    static setTerrainEnabled(enabled) {
        return { type: types.SET_TERRAIN_ENABLED, enabled };
    }

    static setTerrainExaggeration(terrainExaggeration) {
        return { type: types.SET_TERRAIN_EXAGGERATION, terrainExaggeration };
    }

    static setScaleUnits(units) {
        return { type: types.SET_SCALE_UNITS, units };
    }

    static zoomIn() {
        return { type: types.ZOOM_IN };
    }

    static zoomOut() {
        return { type: types.ZOOM_OUT };
    }

    static setBasemap(layer) {
        return { type: types.SET_BASEMAP, layer };
    }

    static hideBasemap() {
        return { type: types.HIDE_BASEMAP };
    }

    static setDate(date) {
        return { type: types.SET_MAP_DATE, date };
    }

    static pixelHover(pixel) {
        return { type: types.PIXEL_HOVER, pixel };
    }

    static invalidatePixelHover() {
        return { type: types.INVALIDATE_PIXEL_HOVER };
    }

    static pixelClick(clickEvt) {
        return { type: types.PIXEL_CLICK, clickEvt };
    }

    static enableMeasuring(geometryType, measurementType) {
        return { type: types.ENABLE_MEASURING, geometryType, measurementType };
    }

    static disableMeasuring() {
        return { type: types.DISABLE_MEASURING };
    }

    static enableDrawing(geometryType) {
        return { type: types.ENABLE_DRAWING, geometryType };
    }

    static disableDrawing() {
        return { type: types.DISABLE_DRAWING };
    }

    static addGeometryToMap(geometry, interactionType, geodesic = false) {
        return { type: types.ADD_GEOMETRY_TO_MAP, geometry, interactionType, geodesic };
    }

    static addMeasurementLabelToGeometry(geometry, measurementType, units) {
        return { type: types.ADD_MEASUREMENT_LABEL_TO_GEOMETRY, geometry, measurementType, units };
    }

    static removeAllDrawings() {
        return { type: types.REMOVE_ALL_DRAWINGS };
    }

    static removeAllMeasurements() {
        return { type: types.REMOVE_ALL_MEASUREMENTS };
    }

    static setLayerMenuOpen(open) {
        return { type: types.SET_LAYER_MENU_OPEN, open };
    }

    static setLayerActive(layer, active) {
        return { type: types.SET_LAYER_ACTIVE, layer, active };
    }

    static setLayerDisabled(layer, disabled) {
        return { type: types.SET_LAYER_DISABLED, layer, disabled };
    }

    static setLayerOpacity(layer, opacity) {
        return { type: types.SET_LAYER_OPACITY, layer, opacity };
    }

    static changeLayerPalette(layer, palette) {
        return { type: types.SET_LAYER_PALETTE, layer, palette };
    }

    static moveLayerToTop(layer) {
        return { type: types.MOVE_LAYER_TO_TOP, layer };
    }

    static moveLayerToBottom(layer) {
        return { type: types.MOVE_LAYER_TO_BOTTOM, layer };
    }

    static moveLayerUp(layer) {
        return { type: types.MOVE_LAYER_UP, layer };
    }

    static moveLayerDown(layer) {
        return { type: types.MOVE_LAYER_DOWN, layer };
    }

    static activateDefaultLayers() {
        return { type: types.ACTIVATE_DEFAULT_LAYERS };
    }

    static openLayerInfo(layer) {
        return { type: types.OPEN_LAYER_INFO, layer };
    }

    static closeLayerInfo() {
        return { type: types.CLOSE_LAYER_INFO };
    }

    static setCurrentMetadata(layer, data) {
        return { type: types.SET_CURRENT_METADATA, layer, data };
    }

    static loadLayerMetadata(layer) {
        return dispatch => {
            // signal loading
            dispatch(this.setLayerMetadataLoadingAsync(true, false));
            // open the display
            dispatch(this.openLayerInfo(layer));
            if (layer.getIn(["metadata", "url"]) && layer.getIn(["metadata", "handleAs"])) {
                // fetch the metadata
                return MiscUtil.asyncFetch({
                    url: layer.getIn(["metadata", "url"]),
                    handleAs: layer.getIn(["metadata", "handleAs"])
                }).then(
                    data => {
                        // store the data for display
                        dispatch(this.setCurrentMetadata(layer, data));
                        // signal loading complete
                        dispatch(this.setLayerMetadataLoadingAsync(false, false));
                    },
                    err => {
                        console.warn("Error in mapActions.openLayerInfo:", err);
                        // signal loading failed
                        dispatch(this.setLayerMetadataLoadingAsync(false, true));

                        // display alert
                        dispatch(
                            AlertAction.addAlert({
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
                dispatch(this.setLayerMetadataLoadingAsync(false, true));

                // display alert
                dispatch(
                    AlertAction.addAlert({
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

    static loadInitialData(callback = null) {
        return dispatch => {
            // Set flag that initial layer data has begun loading
            dispatch(this.setInitialDataLoadingAsync(true, false));
            // Fetch all initial layer data
            return Promise.all([
                dispatch(this.loadLayerData()),
                dispatch(this.loadPaletteData())
            ]).then(
                () => {
                    // Set flag that initial layer data has finished loading
                    dispatch(this.setInitialDataLoadingAsync(false, false));
                    if (typeof callback === "function") {
                        callback.call(this);
                    }
                },
                err => {
                    console.warn("Error in mapActions.loadInitialData:", err);
                    dispatch(
                        AlertAction.addAlert({
                            title: appStrings.ALERTS.INITIAL_DATA_LOAD_FAILED.title,
                            body: appStrings.ALERTS.INITIAL_DATA_LOAD_FAILED.formatString,
                            severity: appStrings.ALERTS.INITIAL_DATA_LOAD_FAILED.severity,
                            time: new Date()
                        })
                    );
                    dispatch(this.setInitialDataLoadingAsync(false, true));
                    if (typeof callback === "function") {
                        callback.call(this);
                    }
                }
            );
        };
    }

    static loadPaletteData() {
        return dispatch => {
            dispatch(this.setPaletteDataLoadingAsync(true, false));

            return MiscUtil.asyncFetch({
                url: appConfig.URLS.paletteConfig,
                handleAs: appStrings.FILE_TYPE_JSON,
                options: { credentials: "same-origin" }
            }).then(
                data => {
                    dispatch(this.ingestLayerPalettes(data));
                    dispatch(this.setPaletteDataLoadingAsync(false, false));
                },
                err => {
                    console.warn("Error in mapActions.loadPaletteData:", err);
                    throw err;
                }
            );
        };
    }

    static loadLayerData() {
        return dispatch => {
            dispatch(this.setLayerDataLoadingAsync(true, false));

            return Promise.all(
                appConfig.URLS.layerConfig.map(el => {
                    return dispatch(this.loadSingleLayerSource(el));
                })
            ).then(
                () => {
                    dispatch({ type: types.MERGE_LAYERS });
                    dispatch(this.setLayerDataLoadingAsync(false, false));
                },
                err => {
                    dispatch(MapAction.setLayerDataLoadingAsync(false, true));
                    console.warn("Error in mapActions.loadLayerData:", err);
                    throw err;
                }
            );
        };
    }

    static loadSingleLayerSource(options) {
        return dispatch => {
            return MiscUtil.asyncFetch({
                url: options.url,
                handleAs: options.type,
                options: { credentials: "same-origin" }
            }).then(
                data => {
                    dispatch(MapAction.ingestLayerConfig(data, options));
                },
                err => {
                    console.warn("Error in mapActions.loadSingleLayerSource: ", err);
                    throw err;
                }
            );
        };
    }

    // action helpers
    static setInitialDataLoadingAsync(loading, failed) {
        return AsyncAction.setAsyncLoadingState("initialDataAsync", {
            loading: loading,
            failed: failed
        });
    }

    static setPaletteDataLoadingAsync(loading, failed) {
        return AsyncAction.setAsyncLoadingState("layerPalettesAsync", {
            loading: loading,
            failed: failed
        });
    }

    static setLayerDataLoadingAsync(loading, failed) {
        return AsyncAction.setAsyncLoadingState("layerSourcesAsync", {
            loading: loading,
            failed: failed
        });
    }

    static setLayerMetadataLoadingAsync(loading, failed) {
        return AsyncAction.setAsyncLoadingState("layerMetadataAsync", {
            loading: loading,
            failed: failed
        });
    }

    static ingestLayerConfig(config, options) {
        return { type: types.INGEST_LAYER_CONFIG, config, options };
    }

    static ingestLayerPalettes(paletteConfig) {
        return { type: types.INGEST_LAYER_PALETTES, paletteConfig };
    }
}
