/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import appConfig from "constants/appConfig";

export default class MapWrapper {
    constructor(container, options) {
        this.map = null;
        this.initializationSuccess = false;
        this.is3D = false;
        this.isActive = false;
        this.mapDate = appConfig.DEFAULT_DATE;
    }

    init(container, options) {
        console.warn("Error in MapWrapper.init: Method not implemented in subclass");
        return false;
    }
    initBools(container, options) {
        console.warn("Error in MapWrapper.initBools: Method not implemented in subclass");
        return false;
    }
    initStaticClasses(container, options) {
        console.warn("Error in MapWrapper.initStaticClasses: Method not implemented in subclass");
        return false;
    }
    initObjects(container, options) {
        console.warn("Error in MapWrapper.initObjects: Method not implemented in subclass");
        return false;
    }

    createMap(container, options) {
        console.warn("Error in MapWrapper.createMap: Method not implemented in subclass");
        return false;
    }

    enableTerrain(enable) {
        console.warn("Error in MapWrapper.enableTerrain: Method not implemented in subclass");
        return false;
    }

    addDrawHandler(geometryType, onDrawEnd) {
        console.warn("Error in MapWrapper.addDrawHandler: Method not implemented in subclass");
        return false;
    }
    enableDrawing(geometryType) {
        console.warn("Error in MapWrapper.enableDrawing: Method not implemented in subclass");
        return false;
    }
    enableActiveListeners(active) {
        console.warn(
            "Error in MapWrapper.enableActiveListeners: Method not implemented in subclass"
        );
        return false;
    }
    disableDrawing(delayDblClickEnable) {
        console.warn("Error in MapWrapper.disableDrawing: Method not implemented in subclass");
        return false;
    }
    enableMeasuring(geometryType, measurementType) {
        console.warn("Error in MapWrapper.enableMeasuring: Method not implemented in subclass");
        return false;
    }
    disableMeasuring(delayDblClickEnable) {
        console.warn("Error in MapWrapper.disableMeasuring: Method not implemented in subclass");
        return false;
    }
    addGeometry(geometry, interactionType, geodesic) {
        console.warn("Error in MapWrapper.addGeometry: Method not implemented in subclass");
        return false;
    }
    addLabel(label, coords, options) {
        console.warn("Error in MapWrapper.addLabelToGeometry: Method not implemented in subclass");
        return false;
    }
    removeAllDrawings() {
        console.warn("Error in MapWrapper.removeAllDrawings: Method not implemented in subclass");
        return false;
    }
    removeAllMeasurements() {
        console.warn(
            "Error in MapWrapper.removeAllMeasurements: Method not implemented in subclass"
        );
        return false;
    }
    getCenter() {
        console.warn("Error in MapWrapper.getCenter: Method not implemented in subclass");
        return false;
    }

    getExtent() {
        console.warn("Error in MapWrapper.getExtent: Method not implemented in subclass");
        return false;
    }

    getMapSize() {
        console.warn("Error in MapWrapper.getMapSize: Method not implemented in subclass");
        return false;
    }

    setExtent() {
        console.warn("Error in MapWrapper.setExtent: Method not implemented in subclass");
        return false;
    }

    panMap() {
        console.warn("Error in MapWrapper.panMap: Method not implemented in subclass");
        return false;
    }

    getZoom() {
        console.warn("Error in MapWrapper.getZoom: Method not implemented in subclass");
        return false;
    }

    getProjection() {
        console.warn("Error in MapWrapper.getProjection: Method not implemented in subclass");
        return false;
    }

    zoomIn() {
        console.warn("Error in MapWrapper.zoomIn: Method not implemented in subclass");
        return false;
    }
    zoomOut() {
        console.warn("Error in MapWrapper.zoomOut: Method not implemented in subclass");
        return false;
    }

    resetOrientation() {
        console.warn("Error in MapWrapper.resetOrientation: Method not implemented in subclass");
        return false;
    }

    setScaleUnits(units) {
        console.warn("Error in MapWrapper.setScaleUnits: Method not implemented in subclass");
        return false;
    }

    createLayer(layer) {
        console.warn("Error in MapWrapper.createLayer: Method not implemented in subclass");
        return false;
    }

    addLayer(layer) {
        console.warn("Error in MapWrapper.addLayer: Method not implemented in subclass");
        return false;
    }

    removeLayer(layer) {
        console.warn("Error in MapWrapper.removeLayer: Method not implemented in subclass");
        return false;
    }

    setLayerActive(layer, active) {
        console.warn("Error in MapWrapper.setLayerActive: Method not implemented in subclass");
        return false;
    }

    setLayerOpacity(layer, opacity) {
        console.warn("Error in MapWrapper.setLayerOpacity: Method not implemented in subclass");
        return false;
    }

    setBasemap(layer) {
        console.warn("Error in MapWrapper.setBasemap: Method not implemented in subclass");
        return false;
    }

    hideBasemap() {
        console.warn("Error in MapWrapper.hideBasemap: Method not implemented in subclass");
        return false;
    }

    addEventListener(eventStr, callback) {
        console.warn("Error in MapWrapper.addEventListener: Method not implemented in subclass");
        return false;
    }

    updateLayer(layer) {
        console.warn("Error in MapWrapper.updateLayer: Method not implemented in subclass");
        return false;
    }

    getLatLonFromPixelCoordinate(pixel) {
        console.warn(
            "Error in MapWrapper.getLatLonFromPixelCoordinate: Method not implemented in subclass"
        );
        return false;
    }

    moveLayerToTop(layer) {
        console.warn("Error in MapWrapper.moveLayerToTop: Method not implemented in subclass");
        return false;
    }

    moveLayerToBottom(layer) {
        console.warn("Error in MapWrapper.moveLayerToBottom: Method not implemented in subclass");
        return false;
    }
    moveLayerUp(layer) {
        console.warn("Error in MapWrapper.moveLayerUp: Method not implemented in subclass");
        return false;
    }
    moveLayerDown(layer) {
        console.warn("Error in MapWrapper.moveLayerDown: Method not implemented in subclass");
        return false;
    }
    getActiveLayerIds(layerType) {
        console.warn("Error in MapWrapper.getActiveLayerIds: Method not implemented in subclass");
        return false;
    }
    resize() {
        console.warn("Error in MapWrapper.resize: Method not implemented in subclass");
        return false;
    }
    getPixelFromClickEvent(clickEvt) {
        console.warn(
            "Error in MapWrapper.getPixelFromClickEvent: Method not implemented in subclass"
        );
        return false;
    }
    clearCache() {
        console.warn("Error in MapWrapper.clearCache: Method not implemented in subclass");
        return false;
    }
    setMapDate(date) {
        this.mapDate = date;
        return true;
    }
}
