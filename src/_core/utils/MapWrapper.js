import * as appConfig from 'constants/appConfig';

export default class MapWrapper {
    constructor(container, options) {
        this.map = null;
        this.is3D = false;
        this.isActive = false;
        this.mapDate = appConfig.DEFAULT_DATE;
    }

    createMap(container, options) {
        console.warn("createMap not implemented in subclass");
        return false;
    }

    enableTerrain(enable) {
        console.warn("enableTerrain not implemented in subclass");
        return false;
    }

    addDrawHandler(geometryType, onDrawEnd) {
        console.warn("addDrawHandler not implemented in subclass");
        return false;
    }
    enableDrawing(geometryType) {
        console.warn("enableDrawing not implemented in subclass");
        return false;
    }
    enableActiveListeners(active) {
        console.warn("enableActiveListeners not implemented in subclass");
        return false;
    }
    disableDrawing(delayDblClickEnable) {
        console.warn("disableDrawing not implemented in subclass");
        return false;
    }
    enableMeasuring(geometryType, measurementType) {
        console.warn("enableMeasuring not implemented in subclass");
        return false;
    }
    disableMeasuring(delayDblClickEnable) {
        console.warn("disableMeasuring not implemented in subclass");
        return false;
    }
    addGeometry(geometry, interactionType, geodesic) {
        console.warn("addGeometry not implemented in subclass");
        return false;
    }
    addLabel(label, coords, options) {
        console.warn("addLabelToGeometry not implemented in subclass");
        return false;
    }
    removeAllDrawings() {
        console.warn("removeAllDrawings not implemented in subclass");
        return false;
    }
    removeAllMeasurements() {
        console.warn("removeAllMeasurements not implemented in subclass");
        return false;
    }
    getCenter() {
        console.warn("getCenter not implemented in subclass");
        return false;
    }

    getExtent() {
        console.warn("getExtent not implemented in subclass");
        return false;
    }

    getMapSize() {
        console.warn("getMapSize not implemented in subclass");
        return false;
    }

    setExtent() {
        console.warn("setExtent not implemented in subclass");
        return false;
    }

    getZoom() {
        console.warn("getZoom not implemented in subclass");
        return false;
    }

    getProjection() {
        console.warn("getProjection not implemented in subclass");
        return false;
    }

    zoomIn() {
        console.warn("zoomIn not implemented in subclass");
        return false;
    }
    zoomOut() {
        console.warn("zoomOut not implemented in subclass");
        return false;
    }

    resetOrientation() {
        console.warn("resetOrientation not implemented in subclass");
        return false;
    }

    setScaleUnits(units) {
        console.warn("setScaleUnits not implemented in subclass");
        return false;
    }

    createLayer(layer) {
        console.warn("createLayer not implemented in subclass");
        return false;
    }

    addLayer(layer) {
        console.warn("addLayer not implemented in subclass");
        return false;
    }

    removeLayer(layer) {
        console.warn("removeLayer not implemented in subclass");
        return false;
    }

    setLayerActive(layer, active) {
        console.warn("setLayerActive not implemented in subclass");
        return false;
    }

    setLayerOpacity(layer, opacity) {
        console.warn("setLayerOpacity not implemented in subclass");
        return false;
    }

    setBasemap(layer) {
        console.warn("setBasemap not implemented in subclass");
        return false;
    }

    hideBasemap() {
        console.warn("hideBasemap not implemented in subclass");
        return false;
    }

    addEventListener(eventStr, callback) {
        console.warn("addEventListener not implemented in subclass");
        return false;
    }

    updateLayer(layer) {
        console.warn("updateLayer not implemented in subclass");
        return false;
    }

    getLatLonFromPixelCoordinate(pixel) {
        console.warn("getLatLonFromPixelCoordinate not implemented in subclass");
        return false;
    }

    moveLayerToTop(layer) {
        console.warn("moveLayerToTop not implemented in subclass");
        return false;
    }

    moveLayerToBottom(layer) {
        console.warn("moveLayerToBottom not implemented in subclass");
        return false;
    }
    moveLayerUp(layer) {
        console.warn("moveLayerUp not implemented in subclass");
        return false;
    }
    moveLayerDown(layer) {
        console.warn("moveLayerDown not implemented in subclass");
        return false;
    }
    getActiveLayerIds() {
        console.warn("getActiveLayerIds not implemented in subclass");
        return false;
    }
    resize() {
        console.warn("resize not implemented in subclass");
        return false;
    }
    getPixelFromClickEvent(clickEvt) {
        console.warn("getPixelFromClickEvent not implemented in subclass");
        return false;
    }
    clearCache() {
        console.warn("clearCache not implemented in subclass");
        return false;
    }
    setMapDate(date) {
        this.mapDate = date;
        return true;
    }
}
