/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actionTypes from "_core/constants/actionTypes";
import { mapState } from "_core/reducers/models/map";
import MapReducer from "_core/reducers/reducerFunctions/MapReducer";

export default function map(state = mapState, action, opt_reducer = MapReducer) {
    switch (action.type) {
        case actionTypes.INITIALIZE_MAP:
            return opt_reducer.initializeMap(state, action);

        case actionTypes.SET_MAP_VIEW_MODE:
            return opt_reducer.setMapViewMode(state, action);

        case actionTypes.SET_TERRAIN_ENABLED:
            return opt_reducer.setTerrainEnabled(state, action);

        case actionTypes.SET_TERRAIN_EXAGGERATION:
            return opt_reducer.setTerrainExaggeration(state, action);

        case actionTypes.SET_SCALE_UNITS:
            return opt_reducer.setScaleUnits(state, action);

        case actionTypes.SET_MAP_VIEW:
            return opt_reducer.setMapView(state, action);

        case actionTypes.PAN_MAP:
            return opt_reducer.panMap(state, action);

        case actionTypes.ZOOM_IN:
            return opt_reducer.zoomIn(state, action);

        case actionTypes.ZOOM_OUT:
            return opt_reducer.zoomOut(state, action);

        case actionTypes.RESET_ORIENTATION:
            return opt_reducer.resetOrientation(state, action);

        case actionTypes.SET_LAYER_ACTIVE:
            return opt_reducer.setLayerActive(state, action);

        case actionTypes.SET_LAYER_DISABLED:
            return opt_reducer.setLayerDisabled(state, action);

        case actionTypes.SET_LAYER_OPACITY:
            return opt_reducer.setLayerOpacity(state, action);

        case actionTypes.SET_LAYER_PALETTE:
            return opt_reducer.setLayerPalette(state, action);

        case actionTypes.SET_BASEMAP:
            return opt_reducer.setBasemap(state, action);

        case actionTypes.HIDE_BASEMAP:
            return opt_reducer.hideBasemap(state, action);

        case actionTypes.INGEST_LAYER_CONFIG:
            return opt_reducer.ingestLayerConfig(state, action);

        case actionTypes.MERGE_LAYERS:
            return opt_reducer.mergeLayers(state, action);

        case actionTypes.ACTIVATE_DEFAULT_LAYERS:
            return opt_reducer.activateDefaultLayers(state, action);

        case actionTypes.SET_MAP_DATE:
            return opt_reducer.setMapDate(state, action);

        case actionTypes.PIXEL_HOVER:
            return opt_reducer.pixelHover(state, action);

        case actionTypes.INVALIDATE_PIXEL_HOVER:
            return opt_reducer.invalidatePixelHover(state, action);

        case actionTypes.PIXEL_CLICK:
            return opt_reducer.pixelClick(state, action);

        case actionTypes.DISMISS_ALERT:
            return opt_reducer.dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return opt_reducer.dismissAllAlerts(state, action);

        case actionTypes.MOVE_LAYER_TO_TOP:
            return opt_reducer.moveLayerToTop(state, action);

        case actionTypes.MOVE_LAYER_TO_BOTTOM:
            return opt_reducer.moveLayerToBottom(state, action);

        case actionTypes.MOVE_LAYER_UP:
            return opt_reducer.moveLayerUp(state, action);

        case actionTypes.MOVE_LAYER_DOWN:
            return opt_reducer.moveLayerDown(state, action);

        case actionTypes.INGEST_LAYER_PALETTES:
            return opt_reducer.ingestLayerPalettes(state, action);

        case actionTypes.ENABLE_DRAWING:
            return opt_reducer.enableDrawing(state, action);

        case actionTypes.DISABLE_DRAWING:
            return opt_reducer.disableDrawing(state, action);

        case actionTypes.ENABLE_MEASURING:
            return opt_reducer.enableMeasuring(state, action);

        case actionTypes.DISABLE_MEASURING:
            return opt_reducer.disableMeasuring(state, action);

        case actionTypes.ADD_GEOMETRY_TO_MAP:
            return opt_reducer.addGeometryToMap(state, action);

        case actionTypes.ADD_MEASUREMENT_LABEL_TO_GEOMETRY:
            return opt_reducer.addMeasurementLabelToGeometry(state, action);

        case actionTypes.REMOVE_ALL_DRAWINGS:
            return opt_reducer.removeAllDrawings(state, action);

        case actionTypes.REMOVE_ALL_MEASUREMENTS:
            return opt_reducer.removeAllMeasurements(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return opt_reducer.resetApplicationState(state, action);

        default:
            return state;
    }
}
