import * as actionTypes from '_core/constants/actionTypes';
import { mapState } from '_core/reducers/models/map';
import MapReducer from '_core/reducers/reducerFunctions/MapReducer';

export default function map(state = mapState, action) {
    switch (action.type) {
        case actionTypes.INITIALIZE_MAP:
            return MapReducer.initializeMap(state, action);

        case actionTypes.SET_MAP_VIEW_MODE:
            return MapReducer.setMapViewMode(state, action);

        case actionTypes.SET_TERRAIN_ENABLED:
            return MapReducer.setTerrainEnabled(state, action);

        case actionTypes.SET_TERRAIN_EXAGGERATION:
            return MapReducer.setTerrainExaggeration(state, action);

        case actionTypes.SET_SCALE_UNITS:
            return MapReducer.setScaleUnits(state, action);

        case actionTypes.SET_MAP_VIEW:
            return MapReducer.setMapView(state, action);

        case actionTypes.PAN_MAP:
            return MapReducer.panMap(state, action);

        case actionTypes.ZOOM_IN:
            return MapReducer.zoomIn(state, action);

        case actionTypes.ZOOM_OUT:
            return MapReducer.zoomOut(state, action);

        case actionTypes.RESET_ORIENTATION:
            return MapReducer.resetOrientation(state, action);

        case actionTypes.SET_LAYER_ACTIVE:
            return MapReducer.setLayerActive(state, action);

        case actionTypes.SET_LAYER_DISABLED:
            return MapReducer.setLayerDisabled(state, action);

        case actionTypes.SET_LAYER_OPACITY:
            return MapReducer.setLayerOpacity(state, action);
            
        case actionTypes.SET_LAYER_PALETTE:
            return MapReducer.setLayerPalette(state, action);

        case actionTypes.SET_BASEMAP:
            return MapReducer.setBasemap(state, action);

        case actionTypes.HIDE_BASEMAP:
            return MapReducer.hideBasemap(state, action);

        case actionTypes.INGEST_LAYER_CONFIG:
            return MapReducer.ingestLayerConfig(state, action);

        case actionTypes.MERGE_LAYERS:
            return MapReducer.mergeLayers(state, action);

        case actionTypes.ACTIVATE_DEFAULT_LAYERS:
            return MapReducer.activateDefaultLayers(state, action);

        case actionTypes.SET_MAP_DATE:
            return MapReducer.setMapDate(state, action);

        case actionTypes.PIXEL_HOVER:
            return MapReducer.pixelHover(state, action);

        case actionTypes.INVALIDATE_PIXEL_HOVER:
            return MapReducer.invalidatePixelHover(state, action);

        case actionTypes.PIXEL_CLICK:
            return MapReducer.pixelClick(state, action);

        case actionTypes.DISMISS_ALERT:
            return MapReducer.dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return MapReducer.dismissAllAlerts(state, action);

        case actionTypes.MOVE_LAYER_TO_TOP:
            return MapReducer.moveLayerToTop(state, action);

        case actionTypes.MOVE_LAYER_TO_BOTTOM:
            return MapReducer.moveLayerToBottom(state, action);

        case actionTypes.MOVE_LAYER_UP:
            return MapReducer.moveLayerUp(state, action);

        case actionTypes.MOVE_LAYER_DOWN:
            return MapReducer.moveLayerDown(state, action);

        case actionTypes.INGEST_LAYER_PALETTES:
            return MapReducer.ingestLayerPalettes(state, action);

        case actionTypes.ENABLE_DRAWING:
            return MapReducer.enableDrawing(state, action);

        case actionTypes.DISABLE_DRAWING:
            return MapReducer.disableDrawing(state, action);

        case actionTypes.ENABLE_MEASURING:
            return MapReducer.enableMeasuring(state, action);

        case actionTypes.DISABLE_MEASURING:
            return MapReducer.disableMeasuring(state, action);

        case actionTypes.ADD_GEOMETRY_TO_MAP:
            return MapReducer.addGeometryToMap(state, action);

        case actionTypes.ADD_MEASUREMENT_LABEL_TO_GEOMETRY:
            return MapReducer.addMeasurementLabelToGeometry(state, action);

        case actionTypes.REMOVE_ALL_DRAWINGS:
            return MapReducer.removeAllDrawings(state, action);

        case actionTypes.REMOVE_ALL_MEASUREMENTS:
            return MapReducer.removeAllMeasurements(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return MapReducer.resetApplicationState(state, action);

        default:
            return state;
    }
}