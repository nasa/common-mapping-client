export default class MapWrapper {
    constructor(container, options) {
        this.map = null;
        this.is3D = false;
        this.isActive = false;
    }

    createMap(container, options) {
        console.warn("createMap not implemented in subclass");
        return false;
    }

    enableTerrain(enable) {
        console.warn("enableTerrain not implemented in subclass");
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

    toggleLayer(layer) {
        console.warn("toggleLayer not implemented in subclass");
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
}
