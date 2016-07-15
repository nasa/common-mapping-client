import Immutable from 'immutable';
import ol from 'openlayers';
import * as mapStrings from '../constants/mapStrings';
import MapWrapper from './MapWrapper';
import MiscUtil from './MiscUtil';
import MapUtil from './MapUtil';
import Cache from './Cache';

export default class MapWrapper_openlayers extends MapWrapper {
    constructor(container, options) {
        super(container, options);
        this.is3D = false;
        this.isActive = !options.getIn(["view", "in3DMode"]);
        this.map = this.createMap(container, options);
        this.layerCache = new Cache(50); // TODO - move this number into a config?
    }

    createMap(container, options) {
        try {
            let viewOptions = options.get("view").toJS();
            return new ol.Map({
                target: container,
                renderer: 'canvas',
                layers: [],
                view: new ol.View({
                    zoom: viewOptions.zoom,
                    maxZoom: viewOptions.maxZoom,
                    minZoom: viewOptions.minZoom,
                    center: viewOptions.center,
                    projection: viewOptions.projection
                }),
                controls: [
                    new ol.control.ScaleLine({
                        className: "map-scale-container"
                    })
                ]
            });
        } catch (err) {
            console.warn("could not create openlayers map.", err);
            return false;
        }
    }

    createLayer(layer, fromCache = true) {
        let mapLayer = false;
        switch (layer.get("handleAs")) {
            case mapStrings.LAYER_GIBS:
                mapLayer = this.createWMTSLayer(layer, fromCache);
                break;
            case mapStrings.LAYER_WMTS:
                mapLayer = this.createWMTSLayer(layer, fromCache);
                break;
            case mapStrings.LAYER_XYZ:
                mapLayer = this.createWMTSLayer(layer, fromCache);
                break;
            case mapStrings.LAYER_VECTOR_GEOJSON:
                mapLayer = this.createVectorLayer(layer, fromCache);
                break;
            case mapStrings.LAYER_VECTOR_TOPOJSON:
                mapLayer = this.createVectorLayer(layer, fromCache);
                break;
            case mapStrings.LAYER_VECTOR_KML:
                mapLayer = this.createVectorLayer(layer, fromCache);
                break;
            default:
                mapLayer = this.createWMTSLayer(layer, fromCache);
                break;
        }

        if (mapLayer) {
            mapLayer._layerId = layer.get("id");
            mapLayer._layerCacheHash = layer.get("id") + layer.get("time");
            mapLayer._layerType = layer.get("type");
        }
        return mapLayer;
    }

    createWMTSLayer(layer, fromCache = true) {
        try {
            if (layer && layer.get("wmtsOptions")) {

                // pull from cache if possible
                let cacheHash = layer.get("id") + layer.get("time");
                if (fromCache && this.layerCache.get(cacheHash)) {
                    let cachedLayer = this.layerCache.get(cacheHash);
                    cachedLayer.setOpacity(layer.get("opacity"));
                    cachedLayer.setVisible(layer.get("isActive"));
                    return cachedLayer;
                }

                let options = layer.get("wmtsOptions").toJS();
                let layerSource = this.createLayerSource(layer, options);

                // override tile url and load functions
                let origTileUrlFunc = layerSource.getTileUrlFunction();
                let origTileLoadFunc = layerSource.getTileLoadFunction();
                layerSource._my_origTileUrlFunc = origTileUrlFunc;
                layerSource._my_origTileLoadFunc = origTileLoadFunc;
                layerSource.setTileUrlFunction((tileCoord, pixelRatio, projectionString) => {
                    return this.generateTileUrl(layer, tileCoord, pixelRatio, projectionString, origTileUrlFunc);
                });
                layerSource.setTileLoadFunction((tile, url) => {
                    return this.handleTileLoad(layer, tile, url, origTileLoadFunc);
                });

                return new ol.layer.Tile({
                    opacity: layer.get("opacity"),
                    visible: layer.get("isActive"),
                    crossOrigin: "anonymous",
                    extent: [-36000, -90, 36000, 90],
                    source: layerSource
                });
            }
            console.warn("could not create map layer");
            return false;
        } catch (err) {
            console.warn("could not create map layer", err);
            return false;
        }
    }

    createVectorLayer(layer, fromCache = true) {
        try {
            // pull from cache if possible
            let cacheHash = layer.get("id") + layer.get("time");
            if (fromCache && this.layerCache.get(cacheHash)) {
                let cachedLayer = this.layerCache.get(cacheHash);
                cachedLayer.setOpacity(layer.get("opacity"));
                cachedLayer.setVisible(layer.get("isActive"));
                return cachedLayer;
            }

            let layerSource = this.createLayerSource(layer, {
                url: layer.get("url")
            });
            if(layer.get("clusterVector")) {
                layerSource = new ol.source.Cluster({source: layerSource});
            }
            return new ol.layer.Vector({
                source: layerSource,
                opacity: layer.get("opacity"),
                visible: layer.get("isActive")
            });
        } catch (err) {
            console.warn("could not create map layer", err);
            return false;
        }
    }

    getCenter() {
        return [0, 0];
    }

    setExtent(extent) {
        if (!extent) {
            return false;
        }
        try {
            this.map.getView().fit(extent, this.map.getSize());
            return true;
        } catch (err) {
            console.warn("could not set openlayers extent.", err);
            return false;
        }
    }

    getExtent() {
        return this.map.getView().calculateExtent(this.map.getSize());
    }

    zoomIn(duration) {
        try {
            if (typeof this.map !== "undefined" &&
                typeof this.map.getView() !== "undefined") {
                this.map.beforeRender(ol.animation.zoom({
                    resolution: this.map.getView().getResolution(),
                    duration: duration || 175
                }));
                this.map.getView().setZoom(this.map.getView().getZoom() + 1);
                return true;
            }
        } catch (err) {
            console.warn("could not zoom openlayers map.", err);
            return false;
        }
    }
    zoomOut(duration) {
        try {
            if (typeof this.map !== "undefined" &&
                typeof this.map.getView() !== "undefined") {
                this.map.beforeRender(ol.animation.zoom({
                    resolution: this.map.getView().getResolution(),
                    duration: duration || 175
                }));
                this.map.getView().setZoom(this.map.getView().getZoom() - 1);
                return true;
            }
        } catch (err) {
            console.warn("could not zoom openlayers map.", err);
            return false;
        }
    }


    setScaleUnits(units) {
        try {
            let controls = this.map.getControls();
            controls.forEach((el, index, arr) => {
                if (typeof el.setUnits === "function") {
                    el.setUnits(units);
                }
            });
            return true;
        } catch (err) {
            console.warn("could not set openlayers scale units.", err);
            return false;
        }
    }

    addLayer(mapLayer) {
        try {
            let index = this.findTopInsertIndexForLayer(mapLayer);
            this.map.getLayers().insertAt(index, mapLayer);
            this.layerCache.set(mapLayer._layerCacheHash, mapLayer);
            return true;
        } catch (err) {
            console.warn("could not add openlayers layer.", err);
            return false;
        }
    }

    removeLayer(mapLayer) {
        try {
            this.map.removeLayer(mapLayer);
            return true;
        } catch (err) {
            console.warn("could not remove openlayers layer.", err);
            return false;
        }
    }

    replaceLayer(mapLayer, index) {
        try {
            this.map.getLayers().setAt(index, mapLayer);
            this.layerCache.set(mapLayer._layerCacheHash, mapLayer);
            return true;
        } catch (err) {
            console.warn("could not replace openlayers layer.", err);
            return false;
        }
    }

    activateLayer(layer) {
        try {
            let mapLayers = this.map.getLayers().getArray();
            let mapLayer = MiscUtil.findObjectInArray(mapLayers, "_layerId", layer.get("id"));
            if (!mapLayer) {
                mapLayer = this.createLayer(layer);
                this.addLayer(mapLayer);
            } else {
                this.moveLayerToTop(layer);
            }
            mapLayer.setVisible(true);
            return true;
        } catch (err) {
            console.warn("could not activate openlayers layer.", err);
            return false;
        }
    }

    deactivateLayer(layer) {
        try {
            let mapLayers = this.map.getLayers().getArray();
            let mapLayer = MiscUtil.findObjectInArray(mapLayers, "_layerId", layer.get("id"));
            if (mapLayer) {
                mapLayer.setVisible(false);
            }
            return true;
        } catch (err) {
            console.warn("could not deactivate openlayers layer.", err);
            return false;
        }
    }

    setLayerActive(layer, active) {
        if (active) {
            return this.activateLayer(layer);
        } else {
            return this.deactivateLayer(layer);
        }
    }

    setLayerOpacity(layer, opacity) {
        try {
            let mapLayers = this.map.getLayers().getArray();
            let mapLayer = MiscUtil.findObjectInArray(mapLayers, "_layerId", layer.get("id"));
            if (mapLayer) {
                mapLayer.setOpacity(opacity);
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not set openlayers layer opacity.", err);
            return false;
        }
    }

    setBasemap(layer) {
        try {
            // create the new basemap layer
            let newBasemap = this.createLayer(layer);
            if (newBasemap) {
                // replace or insert new basemap (insert should happen only once)
                let mapLayers = this.map.getLayers();
                if (mapLayers.getLength() > 0 && mapLayers.item(0)._layerType === "basemap") {
                    mapLayers.setAt(0, newBasemap);
                } else {
                    mapLayers.insertAt(0, newBasemap);
                }
                newBasemap.setVisible(true);
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not set openlayers basemap.", err);
            return false;
        }
    }

    hideBasemap() {
        try {
            let mapLayers = this.map.getLayers();
            if (typeof mapLayers.item(0) !== "undefined") {
                mapLayers.item(0).setVisible(false);
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not hide openlayers basemap.", err);
            return false;
        }
    }

    addEventListener(eventStr, callback) {
        try {
            switch (eventStr) {
                case "moveend":
                    return this.map.addEventListener("moveend", callback);
                case "mousemove":
                    return this.map.addEventListener("pointermove", (position) => {
                        callback(position.pixel);
                    });
                default:
                    return this.map.addEventListener(eventStr, callback);
            }
        } catch (err) {
            console.warn("could not implement listener.", err);
            return false;
        }
    }


    getZoom() {
        try {
            return this.map.getView().getZoom();
        } catch (err) {
            console.warn("could not get openlayers zoom.", err);
            return false;
        }
    }

    getProjection() {
        try {
            return this.map.getView().getProjection().getCode();
        } catch (err) {
            console.warn("could not get openlayers projection.", err);
            return false;
        }
    }

    updateLayer(layer) {
        try {
            let mapLayers = this.map.getLayers().getArray();
            let mapLayerWithIndex = MiscUtil.findObjectWithIndexInArray(mapLayers, "_layerId", layer.get("id"));
            if (mapLayerWithIndex) {
                let mapLayer = this.createLayer(layer);
                this.replaceLayer(mapLayer, mapLayerWithIndex.index);
            }
            return true;
        } catch (err) {
            console.warn("could not update openlayers layer.", err);
            return false;
        }
    }

    getLatLonFromPixelCoordinate(pixel) {
        try {
            let coordinate = this.map.getCoordinateFromPixel(pixel);
            coordinate = MapUtil.constrainCoordinates(coordinate);
            if (typeof coordinate[0] !== "undefined" &&
                typeof coordinate[1] !== "undefined" &&
                !isNaN(coordinate[0]) &&
                !isNaN(coordinate[0])) {
                return {
                    lat: coordinate[0],
                    lon: coordinate[1],
                    isValid: true
                };
            }
            return false;
        } catch (err) {
            console.warn("could not get coordinate from pixel", err);
            return false;
        }
    }

    moveLayerToTop(layer) {
        try {
            let mapLayers = this.map.getLayers();
            let mapLayerWithIndex = MiscUtil.findObjectWithIndexInArray(mapLayers.getArray(), "_layerId", layer.get("id"));
            if (mapLayerWithIndex) {
                let mapLayer = mapLayerWithIndex.value;
                let currIndex = mapLayerWithIndex.index;
                mapLayers.removeAt(currIndex);
                let newIndex = this.findTopInsertIndexForLayer(mapLayer);
                mapLayers.insertAt(newIndex, mapLayer);
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not move openlayers layer to top.", err);
            return false;
        }
    }

    moveLayerToBottom(layer) {
        try {
            let mapLayers = this.map.getLayers();
            let mapLayerWithIndex = MiscUtil.findObjectWithIndexInArray(mapLayers.getArray(), "_layerId", layer.get("id"));
            if (mapLayerWithIndex) {
                let mapLayer = mapLayerWithIndex.value;
                let currIndex = mapLayerWithIndex.index;
                mapLayers.removeAt(currIndex);
                mapLayers.insertAt(1, mapLayer); // index 1 because we always have a basemap. TODO - verify
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not move openlayers layer to bottom.", err);
            return false;
        }
    }

    moveLayerUp(layer) {
        try {
            let mapLayers = this.map.getLayers();
            let mapLayerWithIndex = MiscUtil.findObjectWithIndexInArray(mapLayers.getArray(), "_layerId", layer.get("id"));
            if (mapLayerWithIndex) {
                let mapLayer = mapLayerWithIndex.value;
                let currIndex = mapLayerWithIndex.index;
                mapLayers.removeAt(currIndex);
                let topIndex = this.findTopInsertIndexForLayer(mapLayer);
                let newIndex = currIndex < topIndex ? currIndex + 1 : currIndex;
                mapLayers.insertAt(newIndex, mapLayer);
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not move openlayers layer up.", err);
            return false;
        }
    }

    moveLayerDown(layer) {
        try {
            let mapLayers = this.map.getLayers();
            let mapLayerWithIndex = MiscUtil.findObjectWithIndexInArray(mapLayers.getArray(), "_layerId", layer.get("id"));
            if (mapLayerWithIndex) {
                let mapLayer = mapLayerWithIndex.value;
                let currIndex = mapLayerWithIndex.index;
                if (currIndex > 1) {
                    mapLayers.removeAt(currIndex);
                    mapLayers.insertAt(currIndex - 1, mapLayer);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not move openlayers layer down.", err);
            return false;
        }
    }

    getActiveLayerIds() {
        try {
            let retList = [];
            let mapLayers = this.map.getLayers();
            mapLayers.forEach((mapLayer) => {
                if (mapLayer._layerType === "data" && mapLayer.getVisible()) {
                    retList.push(mapLayer._layerId);
                }
            });
            return retList;
        } catch (err) {
            console.warn("could not generate openlayers active layer list.", err);
            return false;
        }
    }

    /* functions for openlayers only */
    generateTileUrl(layer, tileCoord, pixelRatio, projectionString, origFunc) {
        try {
            let origUrl = layer.getIn(["wmtsOptions", "url"]);
            let urlFunctionString = layer.getIn(["wmtsOptions", "urlFunction"]);
            let customFunction = MapUtil.getUrlFunction(urlFunctionString);
            let processedUrl = decodeURIComponent(origFunc(tileCoord, pixelRatio, projectionString));
            if (typeof customFunction === "function") {
                return customFunction({
                    layer,
                    origUrl,
                    processedUrl,
                    tileCoord,
                    pixelRatio,
                    projectionString
                });
            }
            return processedUrl;
        } catch (err) {
            console.warn("could not generate openlayers layer tile url.", err);
            return false;
        }
    }

    handleTileLoad(layer, tile, url, origFunc) {
        try {
            let tileFunctionString = layer.getIn(["wmtsOptions", "tileFunction"]);
            let customFunction = MapUtil.getTileFunction(tileFunctionString);
            let processedTile = origFunc(tile, url);

            if (typeof customFunction === "function") {
                return customFunction({
                    layer,
                    tile,
                    url,
                    processedTile
                });
            }
            return processedTile;
        } catch (err) {
            console.warn("could not handle openlayers layer tile load.", err);
            return false;
        }
    }
    createLayerSource(layer, options) {
        switch (layer.get("handleAs")) {
            case mapStrings.LAYER_GIBS:
                return this.createGIBSWMTSSource(options);
            case mapStrings.LAYER_WMTS:
                return this.createWMTSSource(options);
            case mapStrings.LAYER_XYZ:
                return this.createXYZSource(options);
            case mapStrings.LAYER_VECTOR_GEOJSON:
                return this.createVectorGeojsonSource(options);
            case mapStrings.LAYER_VECTOR_TOPOJSON:
                return this.createVectorTopojsonSource(options);
            case mapStrings.LAYER_VECTOR_KML:
                return this.createVectorKMLSource(options);
            default:
                return this.createXYZSource(options);
        }
    }
    WMTSOptionsComplete(options) {
        return typeof options.url !== "undefined" &&
            typeof options.layer !== "undefined" &&
            typeof options.format !== "undefined" &&
            typeof options.requestEncoding !== "undefined" &&
            typeof options.matrixSet !== "undefined" &&
            typeof options.projection !== "undefined" &&
            typeof options.extents !== "undefined" &&
            typeof options.tileGrid !== "undefined" &&
            typeof options.tileGrid.origin !== "undefined" &&
            typeof options.tileGrid.resolutions !== "undefined" &&
            typeof options.tileGrid.matrixIds !== "undefined" &&
            typeof options.tileGrid.tileSize !== "undefined";
    }

    createWMTSSource(options) {
        return new ol.source.WMTS({
            url: options.url,
            layer: options.layer,
            format: options.format,
            requestEncoding: options.requestEncoding,
            matrixSet: options.matrixSet,
            projection: options.projection,
            extents: options.extents,
            tileGrid: new ol.tilegrid.WMTS({
                origin: options.tileGrid.origin,
                resolutions: options.tileGrid.resolutions,
                matrixIds: options.tileGrid.matrixIds,
                tileSize: options.tileGrid.tileSize
            }),
            wrapX: true
        });
    }

    createGIBSWMTSSource(options) {
        return new ol.source.WMTS({
            url: options.url,
            layer: options.layer,
            format: options.format,
            requestEncoding: options.requestEncoding,
            matrixSet: options.matrixSet,
            projection: options.projection,
            extents: options.extents,
            tileGrid: new ol.tilegrid.WMTS({
                origin: options.tileGrid.origin,
                resolutions: options.tileGrid.resolutions.slice(2, options.tileGrid.resolutions.length),
                matrixIds: options.tileGrid.matrixIds.slice(2, options.tileGrid.matrixIds.length),
                tileSize: options.tileGrid.tileSize
            }),
            wrapX: true
        });
    }

    createXYZSource(options) {
        return new ol.source.XYZ({
            url: options.url,
            projection: options.projection,
            maxZoom: options.tileGrid.maxZoom,
            minZoom: options.tileGrid.minZoom,
            tileSize: options.tileGrid.tileSize,
            wrapX: true
        });
    }

    createVectorGeojsonSource(options) {
        return new ol.source.Vector({
            url: options.url,
            format: new ol.format.GeoJSON()
        });
    }

    createVectorTopojsonSource(options) {
        return new ol.source.Vector({
            url: options.url,
            format: new ol.format.TopoJSON()
        });
    }

    createVectorKMLSource(options) {
        return new ol.source.Vector({
            url: options.url,
            format: new ol.format.KML()
        });
    }

    findTopInsertIndexForLayer(mapLayer) {
        let mapLayers = this.map.getLayers();
        let index = mapLayers.getLength();

        if (mapLayer._layerType === "reference") { // referece layers always on top
            return index;
        } else if (mapLayer._layerType === "basemap") { // basemaps always on bottom
            return 0;
        } else { // data layers in the middle
            for (let i = index - 1; i >= 0; --i) {
                let compareLayer = mapLayers.item(i);
                if (compareLayer._layerType === "data" ||
                    compareLayer._layerType === "basemap") {
                    return i + 1;
                }
            }
        }
        return index;
    }

    static parseCapabilities(xmlString) {
        try {
            let parser = new ol.format.WMTSCapabilities();
            return parser.read(xmlString);
        } catch (err) {
            console.warn("could not parse openlayers capabilities.", err);
            return false;
        }
    }

    static resizeFix() {
        this.map.updateSize();
    }

    static getWmtsOptions(options) {
        try {
            let parseOptions = ol.source.WMTS.optionsFromCapabilities(options.capabilities, options.options);
            return {
                url: parseOptions.urls[0],
                layer: options.options.layer,
                format: parseOptions.format,
                requestEncoding: parseOptions.requestEncoding,
                matrixSet: parseOptions.matrixSet,
                projection: parseOptions.projection,
                extents: parseOptions.projection.getExtent(),
                tileGrid: {
                    origin: [parseOptions.projection.getExtent()[0], parseOptions.projection.getExtent()[3]],
                    resolutions: parseOptions.tileGrid.getResolutions(),
                    matrixIds: parseOptions.tileGrid.getMatrixIds(),
                    minZoom: parseOptions.tileGrid.getMinZoom(),
                    maxZoom: parseOptions.tileGrid.getMaxZoom(),
                    tileSize: parseOptions.tileGrid.getTileSize(0)
                }
            };
        } catch (err) {
            console.warn("could not generate openlayers wmts options.", err);
            return false;
        }
    }
}
