import MapWrapper from './MapWrapper';
import MiscUtil from './MiscUtil';
import CesiumTilingScheme_GIBS from './CesiumTilingScheme_GIBS';
import * as mapStrings from '../constants/mapStrings';
import '../lib/cesium/Cesium.js';
// import '../lib/cesium/CesiumUnminified.js';
import '../lib/cesium/Widgets/widgets.css';

export default class MapWrapper_cesium extends MapWrapper {

    constructor(container, options) {
        super(container, options);
        this.is3D = true;
        this.isActive = options.getIn(["view", "in3DMode"]);

        window.CESIUM_BASE_URL = './';
        this.cesium = window.Cesium;
        this.map = this.createMap(container, options);

        // store limits for zoom
        this.zoomLimits = {
            maxZoom: options.getIn(["view", "maxZoomDistance3D"]),
            minZoom: options.getIn(["view", "minZoomDistance3D"])
        };
    }

    createMap(container, options) {
        let map = new this.cesium.Viewer(container, {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            vrButton: true,
            contextOptions: {
                alpha: true
            },
            navigationInstructionsInitiallyVisible: false,
            scene3DOnly: true,
            clock: this.createClock(),
            //initialize an empty layer so Cesium doesn't load bing maps
            imageryProvider: new this.cesium.WebMapServiceImageryProvider({ url: " ", layers: 0 })
        });
        // Depth testing
        // Seems to be causing issues with vector rendering. Removing.
        // map.scene.globe.depthTestAgainstTerrain = true;

        // Terrain
        let terrainProvider = new this.cesium.CesiumTerrainProvider({
            url: '//assets.agi.com/stk-terrain/world'
        });
        let defaultTerrainProvider = new this.cesium.EllipsoidTerrainProvider();
        map.terrainProvider = terrainProvider;

        // remove sun and moon
        map.scene.sun = undefined;
        map.scene.moon = undefined;

        //change the maximum distance we can move from the globe
        map.scene.screenSpaceCameraController.maximumZoomDistance = options.getIn(["view", "maxZoomDistance3D"]);
        map.scene.screenSpaceCameraController.minimumZoomDistance = options.getIn(["view", "minZoomDistance3D"]);

        map.scene.globe.baseColor = this.cesium.Color.BLACK;

        //remove all preloaded earth layers
        map.scene.globe.imageryLayers.removeAll();

        return map;
    }

    enableTerrain(enable) {
        if (enable) {
            this.map.terrainProvider = new this.cesium.CesiumTerrainProvider({
                url: '//assets.agi.com/stk-terrain/world'
            });
        } else {
            this.map.terrainProvider = new this.cesium.EllipsoidTerrainProvider();
        }
        return true;
    }

    getCenter() {
        return [this.cesium.Math.toDegrees(this.map.camera.positionCartographic.longitude),
            this.cesium.Math.toDegrees(this.map.camera.positionCartographic.latitude)
        ];
    }

    setExtent(extent) {
        if (!extent) {
            return false;
        }
        let extentClone = extent.slice(0);
        // Ensure that extent lat is -90 to 90
        if (extentClone[1] < -90) {
            extentClone[1] = -90;
        }
        if (extentClone[3] > 90) {
            extentClone[3] = 90;
        }
        this.map.camera.flyTo({
            destination: this.cesium.Rectangle.fromDegrees(...extentClone),
            duration: 0
        });
        return true;
    }

    getExtent() {
        let fallbackExtent = [-180, -90, 180, 90];
        let viewRect = this.map.camera.computeViewRectangle();
        // If viewRect does not exist
        if (!viewRect) {
            return fallbackExtent;
        }
        // Convert viewRect to Degrees
        let viewRectDeg = [this.cesium.Math.toDegrees(viewRect.west),
            this.cesium.Math.toDegrees(viewRect.south),
            this.cesium.Math.toDegrees(viewRect.east),
            this.cesium.Math.toDegrees(viewRect.north)
        ];

        // If viewRect is too far out and we actually get [-180, -90, 180, 90], 
        // attempt to approximate view by creating extent around center point
        if (viewRectDeg[0] === -180 && viewRectDeg[1] === -90 && viewRectDeg[2] === 180 && viewRectDeg[3] === 90) {
            let center = this.getCenter();
            if (!center) {
                return fallbackExtent;
            }
            return [center[0] - 90, center[1] - 45, center[0] + 90, center[1] + 45];
        }
        return viewRectDeg;
    }


    zoomIn() {
        try {
            let currPosition = this.map.scene.camera.positionCartographic;
            let newH = currPosition.height - (currPosition.height / 2);
            let newPosition = currPosition.clone();
            newPosition.height = newH;
            newPosition = this.map.scene.globe.ellipsoid.cartographicToCartesian(newPosition);
            this.map.scene.camera.flyTo({
                destination: newPosition,
                duration: 0.175
            });
            return true;
        } catch (err) {
            console.warn("could not zoom cesium map", err);
            return false;
        }
    }

    zoomOut() {
        try {
            let currPosition = this.map.scene.camera.positionCartographic;
            let newH = currPosition.height + (currPosition.height);
            let newPosition = currPosition.clone();
            newPosition.height = newH;
            newPosition = this.map.scene.globe.ellipsoid.cartographicToCartesian(newPosition);
            this.map.scene.camera.flyTo({
                destination: newPosition,
                duration: 0.175
            });
            return true;
        } catch (err) {
            console.warn("could not zoom cesium map", err);
            return false;
        }
    }

    resetOrientation() {
        try {
            this.map.camera.flyTo({
                destination: this.map.camera.positionWC,
                orientation: {}
            });
            return true;
        } catch (err) {
            console.warn("could not set north orientation in cesium map", err);
            return false;
        }
    }

    addEventListener(eventStr, callback) {
        try {
            switch (eventStr) {
                case "moveend":
                    this.map.camera.moveEnd.addEventListener(callback);
                    return;
                case "mousemove":
                    new this.cesium.ScreenSpaceEventHandler(this.map.scene.canvas)
                        .setInputAction((movement) => {
                            callback([movement.endPosition.x, movement.endPosition.y]);
                        }, this.cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    return;
                default:
                    return;
            }
        } catch (err) {
            console.warn("could not implement listener.", err);
            return false;
        }
    }

    setLayerOpacity(layer, opacity) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer && typeof mapLayer.alpha !== "undefined") {
                mapLayer.alpha = opacity;
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not set cesium layer opacity.", err);
            return false;
        }
    }

    addLayer(mapLayer) {
        try {
            let mapLayers = this.getMapLayers(mapLayer._layerHandleAs);
            let index = this.findTopInsertIndexForLayer(mapLayers, mapLayer);
            mapLayers.add(mapLayer, index);
            return true;
        } catch (err) {
            console.warn("could not add cesium layer.", err);
            return false;
        }
    }

    removeLayer(mapLayer) {
        try {
            let mapLayers = this.getMapLayers(mapLayer, mapLayer._layerHandleAs);
            mapLayers.remove(mapLayer);
            return true;
        } catch (err) {
            console.warn("could not remove cesium layer.", err);
            return false;
        }
    }

    activateLayer(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (!mapLayer) {
                mapLayer = this.createLayer(layer);
                this.addLayer(mapLayer);
            } else {
                this.moveLayerToTop(layer);
            }
            mapLayer.show = true;
            return true;
        } catch (err) {
            console.warn("could not activate cesium layer.", err);
            return false;
        }
    }

    deactivateLayer(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                mapLayer.show = false;
            }
            return true;
        } catch (err) {
            console.warn("could not deactivate cesium layer.", err);
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

    updateLayer(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                let updatedMapLayer = this.createLayer(layer);
                let index = mapLayers.indexOf(mapLayer);
                mapLayers.remove(mapLayer);
                mapLayers.add(updatedMapLayer, index);
            }
            return true;
        } catch (err) {
            console.warn("could not update cesium layer.", err);
            return false;
        }
    }

    setBasemap(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let newBasemap = this.createLayer(layer);
            newBasemap.show = true;
            if (newBasemap) {
                // remove the current basemap
                let currBasemap = mapLayers.get(0);
                if (typeof currBasemap !== "undefined" && currBasemap._layerType === mapStrings.LAYER_GROUP_TYPE_BASEMAP) {
                    mapLayers.remove(currBasemap);
                }
                mapLayers.add(newBasemap, 0);
                return true;
            } else {
                console.warn("could not set cesium basemap");
                return false;
            }
        } catch (err) {
            console.warn("could not set cesium basemap", err);
            return false;
        }
    }
    hideBasemap() {
        try {
            let mapLayers = this.getMapLayers();
            let currBasemap = mapLayers.get(0);
            if (typeof currBasemap !== "undefined") {
                currBasemap.show = false;
                return true;
            } else {
                console.warn("could not hide cesium basemap.");
                return false;
            }
        } catch (err) {
            console.warn("could not hide cesium basemap.", err);
            return false;
        }
    }
    createLayer(layer) {
        switch (layer.get("handleAs")) {
            case mapStrings.LAYER_GIBS:
                return this.createWMTSLayer(layer);
            case mapStrings.LAYER_WMTS:
                return this.createWMTSLayer(layer);
            case mapStrings.LAYER_XYZ:
                return this.createWMTSLayer(layer);
            case mapStrings.LAYER_VECTOR_GEOJSON:
                return this.createVectorLayer(layer);
            case mapStrings.LAYER_VECTOR_TOPOJSON:
                return this.createVectorLayer(layer);
            case mapStrings.LAYER_VECTOR_KML:
                return this.createVectorLayer(layer);
            default:
                return this.createWMTSLayer(layer);
        }
    }

    createWMTSLayer(layer) {
        try {
            let imageryProvider = this.createImageryProvider(layer);
            if (imageryProvider) {
                let mapLayer = new this.cesium.ImageryLayer(imageryProvider, {
                    alpha: layer.get("opacity"),
                    show: layer.get("isActive")
                });
                mapLayer._layerId = layer.get("id");
                mapLayer._layerType = layer.get("type");
                mapLayer._layerHandleAs = layer.get("handleAs");

                // override the tile loading for this layer
                let origTileLoadFunc = mapLayer.imageryProvider.requestImage;
                mapLayer.imageryProvider._my_origTileLoadFunc = origTileLoadFunc;
                mapLayer.imageryProvider.requestImage = (x, y, level) => {
                    return this.handleTileLoad(layer, mapLayer, x, y, level);
                };

                return mapLayer;
            } else {
                console.warn("could not create cesium layer");
                return false;
            }
        } catch (err) {
            console.warn("could not create cesium layer", err);
            return false;
        }
    }

    createVectorLayer(layer) {
        let layerSource = this.createVectorSource(layer);
        if (layerSource) {
            // layer source is a promise that acts as a stand-in while the data loads
            layerSource.then((mapLayer) => {
                mapLayer._layerId = layer.get("id");
                mapLayer._layerType = layer.get("type");
                mapLayer._layerHandleAs = layer.get("handleAs");
            });

            // need to add custom metadata while data loads
            layerSource._layerId = layer.get("id");
            layerSource._layerType = layer.get("type");
            layerSource._layerHandleAs = layer.get("handleAs");

            return layerSource;
        }
        return false;
    }

    getLatLonFromPixelCoordinate(pixel) {
        try {
            let cartesian = this.map.scene.camera.pickEllipsoid({ x: pixel[0], y: pixel[1] }, this.map.scene.globe.ellipsoid);
            if (cartesian) {
                let cartographic = this.map.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                return {
                    lat: this.cesium.Math.toDegrees(cartographic.longitude),
                    lon: this.cesium.Math.toDegrees(cartographic.latitude),
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
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                let currIndex = mapLayers.indexOf(mapLayer);
                let index = this.findTopInsertIndexForLayer(mapLayers, mapLayer);
                while (++currIndex < index) {
                    // use raise so that we aren't re-requesting tiles every time
                    mapLayers.raise(mapLayer);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not move cesium layer to top.", err);
            return false;
        }
    }

    moveLayerToBottom(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                mapLayers.lowerToBottom(mapLayer);
                mapLayers.raise(mapLayer); // move to index 1 because we always have a basemap. TODO - verify
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not move cesium layer to bottom.", err);
            return false;
        }
    }

    moveLayerUp(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                let currIndex = mapLayers.indexOf(mapLayer);
                let index = this.findTopInsertIndexForLayer(mapLayers, mapLayer);
                if (++currIndex < index) {
                    mapLayers.raise(mapLayer);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not move cesium layer up.", err);
            return false;
        }
    }

    moveLayerDown(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                let index = mapLayers.indexOf(mapLayer);
                if (index > 1) {
                    mapLayers.lower(mapLayer);
                }
                return true;
            }
            return false;
        } catch (err) {
            console.warn("could not move cesium layer down.", err);
            return false;
        }
    }


    /* methods for Cesium only */
    createImageryProvider(layer) {
        switch (layer.get("handleAs")) {
            case mapStrings.LAYER_GIBS:
                return this.createGIBSWMTSProvider(layer);
            case mapStrings.LAYER_WMTS:
                return this.createGenericWMTSProvider(layer);
            case mapStrings.LAYER_XYZ:
                return this.createGenericXYZProvider(layer);
            default:
                return this.createGenericWMTSProvider(layer);
        }
    }
    createGIBSWMTSProvider(layer) {
        try {
            let options = layer.get("wmtsOptions");
            if (typeof options !== "undefined") {
                options = options.toJS();
                let west = this.cesium.Math.toRadians(-180);
                let south = this.cesium.Math.toRadians(-90);
                let east = this.cesium.Math.toRadians(180);
                let north = this.cesium.Math.toRadians(90);
                return new this.cesium.WebMapTileServiceImageryProvider({
                    url: options.url + "?TIME=" + layer.get("time"),
                    layer: options.layer,
                    format: options.format,
                    style: '',
                    tileMatrixSetID: options.matrixSet,
                    tileWidth: 512,
                    tileHeight: 512,
                    minimumLevel: options.tileGrid.minZoom,
                    maximumLevel: options.tileGrid.maxZoom,
                    rectangle: new this.cesium.Rectangle(west, south, east, north),
                    tilingScheme: new CesiumTilingScheme_GIBS({ numberOfLevelZeroTilesX: 2, numberOfLevelZeroTilesY: 1 }, options)
                });
            } else {
                console.warn("Could not create GIBS layer");
                return false;
            }
        } catch (err) {
            console.warn("Could not create GIBS layer", err);
            return false;
        }
    }
    createGenericWMTSProvider(layer) {
        try {
            let options = layer.get("wmtsOptions");
            if (typeof options !== "undefined") {
                options = options.toJS();
                let west = this.cesium.Math.toRadians(-180);
                let south = this.cesium.Math.toRadians(-90);
                let east = this.cesium.Math.toRadians(180);
                let north = this.cesium.Math.toRadians(90);
                return new this.cesium.WebMapTileServiceImageryProvider({
                    url: options.url + (layer.get("time") ? "?TIME=" + layer.get("time") : ""),
                    layer: options.layer,
                    format: options.format,
                    style: '',
                    tileMatrixSetID: options.matrixSet,
                    minimumLevel: options.tileGrid.minZoom,
                    maximumLevel: options.tileGrid.maxZoom,
                    rectangle: new this.cesium.Rectangle(west, south, east, north),
                    tilingScheme: new this.cesium.GeographicTilingScheme()
                });
            } else {
                console.warn("Could not create layer");
                return false;
            }
        } catch (err) {
            console.warn("Could not create layer", err);
            return false;
        }
    }
    createGenericXYZProvider(layer) {
        try {
            let options = layer.get("wmtsOptions");
            if (typeof options !== "undefined") {
                options = options.toJS();
                let west = this.cesium.Math.toRadians(-180);
                let south = this.cesium.Math.toRadians(-90);
                let east = this.cesium.Math.toRadians(180);
                let north = this.cesium.Math.toRadians(90);
                return new this.cesium.UrlTemplateImageryProvider({
                    url: options.url + (layer.get("time") ? "?TIME=" + layer.get("time") : ""),
                    minimumLevel: options.tileGrid.minZoom,
                    maximumLevel: options.tileGrid.maxZoom,
                    tileWidth: options.tileGrid.tileSize,
                    tileHeight: options.tileGrid.tileSize,
                    rectangle: new this.cesium.Rectangle(west, south, east, north),
                    tilingScheme: new this.cesium.GeographicTilingScheme()
                });
            } else {
                console.warn("Could not create layer");
                return false;
            }
        } catch (err) {
            console.warn("Could not create layer", err);
            return false;
        }
    }

    createVectorSource(layer) {
        switch (layer.get("handleAs")) {
            case mapStrings.LAYER_VECTOR_GEOJSON:
                return this.createGeoJsonSource(layer);
            case mapStrings.LAYER_VECTOR_TOPOJSON:
                return this.createGeoJsonSource(layer);
            case mapStrings.LAYER_VECTOR_KML:
                return this.createKmlSource(layer);
            default:
                return false;
        }
    }
    createGeoJsonSource(layer) {
        return this.cesium.GeoJsonDataSource.load(layer.get("url"), {
            stroke: this.cesium.Color.fromCssColorString("#1E90FF"),
            fill: this.cesium.Color.fromCssColorString("#FEFEFE").withAlpha(0.5),
            strokeWidth: 3,
            show: layer.get("isActive")
        });
    }
    createKmlSource(layer) {
        return this.cesium.KmlDataSource.load(layer.get("url"), {
            camera: this.map.scene.camera,
            canvas: this.map.scene.canvas,
            show: layer.get("isActive")
        });
    }
    handleTileLoad(layer, mapLayer, x, y, level) {
        let ret = mapLayer.imageryProvider._my_origTileLoadFunc(x, y, level);
        if (typeof ret !== "undefined") {
            return new Promise((resolve, reject) => {
                try {
                    mapLayer.imageryProvider._my_origTileLoadFunc(x, y, level).then((tileNode) => {
                        resolve(tileNode);
                    }, (err) => {
                        reject(err);
                    });
                } catch (err) {
                    reject(err);
                }
            });
        }
        return ret;
    }
    findLayerInMapLayers(mapLayers, layer) {
        let layerId = layer.get("id");
        for (let i = 0; i < mapLayers.length; ++i) {
            let mapLayer = mapLayers.get(i);
            if (mapLayer._layerId === layerId) {
                return mapLayer;
            }
        }
        return false;
    }
    createClock() {
        return new this.cesium.Clock({
            startTime: this.cesium.JulianDate.fromIso8601("2014-09-24T04:38Z"),
            currentTime: this.cesium.JulianDate.fromIso8601("2014-09-24T04:38Z"),
            stopTime: this.cesium.JulianDate.fromIso8601("2014-09-25T08:38Z"),
            clockRange: this.cesium.ClockRange.LOOP_STOP,
            clockStep: 1
        });
    }

    findTopInsertIndexForLayer(mapLayers, mapLayer) {
        let index = mapLayers.length;

        if (mapLayer._layerType === mapStrings.LAYER_GROUP_TYPE_REFERENCE) { // referece layers always on top
            return index;
        } else if (mapLayer._layerType === mapStrings.LAYER_GROUP_TYPE_BASEMAP) { // basemaps always on bottom
            return 0;
        } else { // data layers in the middle
            for (let i = index - 1; i >= 0; --i) {
                let compareLayer = mapLayers.get(i);
                if (compareLayer._layerType === mapStrings.LAYER_GROUP_TYPE_DATA ||
                    compareLayer._layerType === mapStrings.LAYER_GROUP_TYPE_BASEMAP) {
                    return i + 1;
                }
            }
        }
        return index;
    }

    getMapLayers(type) {
        switch (type) {
            case mapStrings.LAYER_GIBS:
                return this.map.imageryLayers;
            case mapStrings.LAYER_WMTS:
                return this.map.imageryLayers;
            case mapStrings.LAYER_XYZ:
                return this.map.imageryLayers;
            case mapStrings.LAYER_VECTOR_GEOJSON:
                return this.map.dataSources;
            case mapStrings.LAYER_VECTOR_TOPOJSON:
                return this.map.dataSources;
            case mapStrings.LAYER_VECTOR_KML:
                return this.map.dataSources;
            default:
                return this.map.imageryLayers;
        }
    }
}
