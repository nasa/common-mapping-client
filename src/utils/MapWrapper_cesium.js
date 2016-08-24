import MapWrapper from './MapWrapper';
import MiscUtil from './MiscUtil';
import CesiumTilingScheme_GIBS from './CesiumTilingScheme_GIBS';
import * as mapStrings from '../constants/mapStrings';
import * as mapConfig from '../constants/mapConfig';
import MapUtil from './MapUtil';
import '../lib/cesium/Cesium.js';
import '../lib/cesium-drawhelper-master/DrawHelper.js';
// import '../lib/cesium/CesiumUnminified.js';
import '../lib/cesium/Widgets/widgets.css';

export default class MapWrapper_cesium extends MapWrapper {

    constructor(container, options) {
        super(container, options);
        this.is3D = true;
        this.isActive = options.getIn(["view", "in3DMode"]);

        // Create cesium scene 
        window.CESIUM_BASE_URL = './';
        this.cesium = window.Cesium;
        this.drawHelper = window.DrawHelper;
        this.map = this.createMap(container, options);

        // Create cesium-draw-helper
        // console.log(this.drawHelper, window.DrawHelper)
        this.drawHandler = new this.drawHelper(this.map);

        // Initialize custom draw-helper interactions array
        this.drawHandler._customInteractions = {};
        
        // Set drawhandler inactive
        this.drawHandler._isActive = false;

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
            terrainExaggeration: 1,
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

    getMapSize() {
        return false;
    }

    resize() {
        return true;
    }

    enableTerrain(enable) {
        if (enable) {
            this.map.terrainProvider = new this.cesium.CesiumTerrainProvider({
                url: mapConfig.DEFAULT_TERRAIN_ENDPOINT
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

    addDrawHandler(geometryType, onDrawEnd) {
        if (geometryType === mapStrings.GEOMETRY_CIRCLE) {
            this.drawHandler._customInteractions["_id" + mapStrings.GEOMETRY_CIRCLE] = () => {
                this.drawHandler.startDrawingCircle({
                    callback: (center, radius) => {
                        // Add geometry to cesium map since it's not done automatically
                        this.addGeometry({ type: geometryType, center: center, radius: radius, coordinateType: mapStrings.COORDINATE_TYPE_CARTESIAN });
                        onDrawEnd(center, radius);
                    }
                });
            };
            return true;
        } else if (geometryType === mapStrings.GEOMETRY_LINE_STRING) {
            this.drawHandler._customInteractions["_id" + mapStrings.GEOMETRY_LINE_STRING] = () => {
                this.drawHandler.startDrawingPolyline({
                    callback: (coordinates) => {
                        // Add geometry to cesium map since it's not done automatically
                        this.addGeometry({ type: geometryType, coordinates: coordinates, coordinateType: mapStrings.COORDINATE_TYPE_CARTESIAN });
                        onDrawEnd(coordinates);
                    }
                });
            };
            return true;
        } else if (geometryType === mapStrings.GEOMETRY_POLYGON) {
            this.drawHandler._customInteractions["_id" + mapStrings.GEOMETRY_POLYGON] = () => {
                this.drawHandler.startDrawingPolygon({
                    callback: (coordinates) => {
                        // Add geometry to cesium map since it's not done automatically
                        this.addGeometry({ type: geometryType, coordinates: coordinates, coordinateType: mapStrings.COORDINATE_TYPE_CARTESIAN });
                        onDrawEnd(coordinates);
                    }
                });
            };
            return true;
        } else {
            console.warn("could not add draw handler for cesium of type", geometryType);
        }
    }

    enableDrawing(geometryType) {
        // Enable drawing for geometryType
        let interaction = this.drawHandler._customInteractions["_id" + geometryType];
        if (interaction) {
            interaction();
            return true;
        }
        console.warn("could not enable cesium drawing for:", geometryType);
        return false;
    }

    disableDrawing() {
        // Stop drawing
        this.drawHandler.stopDrawing();
        return true;
    }

    enableActiveListeners(active) {
        this.drawHandler._isActive = active;
        return true;
    }

    addGeometry(geometry) {
        if (geometry.type === mapStrings.GEOMETRY_CIRCLE) {
            let cesiumCenter = null;
            let cesiumRadius = null;
            // Check coordinate type
            if (geometry.coordinateType === mapStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                // Calc radius by finding cartesian distance from 
                //  center to radius point
                let point = { lat: geometry.center.lat, lon: geometry.center.lon };
                point.lon += geometry.radius;

                let cesiumPoint = this.latLonToCartesian(point.lat, point.lon);
                cesiumCenter = this.latLonToCartesian(geometry.center.lat, geometry.center.lon);
                cesiumRadius = this.cesium.Cartesian3.distance(cesiumCenter, cesiumPoint);
            } else {
                cesiumCenter = geometry.center;
                cesiumRadius = geometry.radius;
            }
            let material = this.cesium.Material.fromType(this.cesium.Material.RimLightingType);
            material.uniforms.color = new this.cesium.Color.fromCssColorString(mapConfig.GEOMETRY_FILL_COLOR);
            material.uniforms.rimColor = new this.cesium.Color(1.0, 1.0, 1.0, 1.0);
            let primitiveToAdd = new this.drawHelper.CirclePrimitive({
                center: cesiumCenter,
                radius: cesiumRadius,
                material: material
            });
            this.map.scene.primitives.add(primitiveToAdd);
            primitiveToAdd.setStrokeStyle(new this.cesium.Color.fromCssColorString(mapConfig.GEOMETRY_STROKE_COLOR), mapConfig.GEOMETRY_STROKE_WEIGHT);
            return true;
        } else if (geometry.type === mapStrings.GEOMETRY_LINE_STRING) {
            let cartesianCoords = null;
            // // Check coordinate type
            if (geometry.coordinateType === mapStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                // Transform coordinates from cartographic to cartesian
                cartesianCoords = geometry.coordinates.map((x) => {
                    return this.latLonToCartesian(x[1], x[0]);
                });
            } else if (geometry.coordinateType === mapStrings.COORDINATE_TYPE_CARTESIAN) {
                cartesianCoords = geometry.coordinates;
            } else {
                console.warn("Unhandled coordinate type when trying to draw cesium line string:", geometry.type);
                return false;
            }
            let material = this.cesium.Material.fromType(this.cesium.Material.RimLightingType);
            material.uniforms.rimColor = new this.cesium.Color.fromCssColorString(mapConfig.GEOMETRY_STROKE_COLOR);
            let primitiveToAdd = new this.drawHelper.PolylinePrimitive({
                positions: cartesianCoords,
                width: mapConfig.GEOMETRY_STROKE_WEIGHT,
                material: material,
                geodesic: true
            });
            this.map.scene.primitives.add(primitiveToAdd);
            return true;
        } else if (geometry.type === mapStrings.GEOMETRY_POLYGON) {
            let cartesianCoords = null;
            // // Check coordinate type
            if (geometry.coordinateType === mapStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                // Transform coordinates from cartographic to cartesian
                cartesianCoords = geometry.coordinates.map((x) => {
                    return this.latLonToCartesian(x[1], x[0]);
                });
            } else if (geometry.coordinateType === mapStrings.COORDINATE_TYPE_CARTESIAN) {
                cartesianCoords = geometry.coordinates;
            } else {
                console.warn("Unhandled coordinate type when trying to draw cesium polygon string:", geometry.type);
                return false;
            }
            let material = this.cesium.Material.fromType(this.cesium.Material.RimLightingType);
            material.uniforms.color = new this.cesium.Color.fromCssColorString(mapConfig.GEOMETRY_FILL_COLOR);
            material.uniforms.rimColor = new this.cesium.Color.fromCssColorString(mapConfig.GEOMETRY_FILL_COLOR);
            let primitiveToAdd = new this.drawHelper.PolygonPrimitive({
                positions: cartesianCoords,
                material: material
            });
            this.map.scene.primitives.add(primitiveToAdd);
            primitiveToAdd.setStrokeStyle(new this.cesium.Color.fromCssColorString(mapConfig.GEOMETRY_STROKE_COLOR), mapConfig.GEOMETRY_STROKE_WEIGHT);
            return true;
        }
        console.warn("add geometry not complete in cesium", geometry, " is unsupported");
        return false;
    }

    removeAllGeometries() {
        this.drawHandler._scene.primitives.removeAll();
        return this.drawHandler._scene.primitives.length === 0;
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
                case "click":
                    new this.cesium.ScreenSpaceEventHandler(this.map.scene.canvas)
                        .setInputAction((movement) => {
                            callback({ pixel: [movement.position.x, movement.position.y] });
                        }, this.cesium.ScreenSpaceEventType.LEFT_CLICK);
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
            case mapStrings.LAYER_VECTOR_DRAWING:
                return this.createVectorLayer(layer);
            default:
                return this.createWMTSLayer(layer);
        }
    }

    createWMTSLayer(layer) {
        try {
            let _context = this;
            let options = layer.get("wmtsOptions").toJS();
            let imageryProvider = this.createImageryProvider(layer, options);
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
                mapLayer.imageryProvider.requestImage = function(x, y, level) {
                    return _context.handleTileLoad(layer, mapLayer, x, y, level, this);
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
        let options = { url: layer.get("url") };
        let layerSource = this.createVectorSource(layer, options);
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
                    lat: this.cesium.Math.toDegrees(cartographic.latitude),
                    lon: this.cesium.Math.toDegrees(cartographic.longitude),
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

    getPixelFromClickEvent(clickEvt) {
        try {
            return clickEvt.pixel;
        } catch (err) {
            console.warn("could not retrieve pixel from cesium click event.", err);
            return false;
        }
    }


    /* methods for Cesium only */
    cartesianToCartographic(point) {
        console.warn("Cesium cartesianToCartographic should be moved into MapUtils");
        let cartographicRadians = this.cesium.Ellipsoid.WGS84.cartesianToCartographic(point);
        return {
            lat: this.cesium.Math.toDegrees(cartographicRadians.latitude),
            lon: this.cesium.Math.toDegrees(cartographicRadians.longitude)
        };
    }
    
    latLonToCartesian(lat, lon) {
        console.warn("TODO: Move MapWrapper_cesium.latLonToCartesian into MapUtil?");
        return new this.cesium.Cartesian3.fromDegrees(lon, lat);
    }

    createImageryProvider(layer, options) {
        switch (layer.get("handleAs")) {
            case mapStrings.LAYER_GIBS:
                return this.createGIBSWMTSProvider(layer, options);
            case mapStrings.LAYER_WMTS:
                return this.createGenericWMTSProvider(layer, options);
            case mapStrings.LAYER_XYZ:
                return this.createGenericXYZProvider(layer, options);
            default:
                return this.createGenericWMTSProvider(layer, options);
        }
    }
    createTilingScheme(options, tileSchemeOptions) {
        if (options.projection === mapStrings.PROJECTIONS.latlon.code) {
            if (options.handleAs === mapStrings.LAYER_GIBS) {
                return new CesiumTilingScheme_GIBS({ numberOfLevelZeroTilesX: 2, numberOfLevelZeroTilesY: 1 }, tileSchemeOptions);
            }
            return new this.cesium.GeographicTilingScheme();
        } else if (options.projection === mapStrings.PROJECTIONS.webmercator.code) {
            return new this.cesium.WebMercatorTilingScheme();
        }
        return false;
    }
    createGIBSWMTSProvider(layer, options) {
        try {
            if (typeof options !== "undefined") {
                let west = this.cesium.Math.toRadians(-180);
                let south = this.cesium.Math.toRadians(-90);
                let east = this.cesium.Math.toRadians(180);
                let north = this.cesium.Math.toRadians(90);
                return new this.cesium.WebMapTileServiceImageryProvider({
                    url: options.url,
                    layer: options.layer,
                    format: options.format,
                    style: '',
                    tileMatrixSetID: options.matrixSet,
                    tileWidth: options.tileGrid.tileSize,
                    tileHeight: options.tileGrid.tileSize,
                    minimumLevel: options.tileGrid.minZoom,
                    maximumLevel: options.tileGrid.maxZoom,
                    tilingScheme: this.createTilingScheme({
                        handleAs: layer.get("handleAs"),
                        projection: options.projection
                    }, options)
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
    createGenericWMTSProvider(layer, options) {
        try {
            if (typeof options !== "undefined") {
                let west = this.cesium.Math.toRadians(-180);
                let south = this.cesium.Math.toRadians(-90);
                let east = this.cesium.Math.toRadians(180);
                let north = this.cesium.Math.toRadians(90);
                return new this.cesium.WebMapTileServiceImageryProvider({
                    url: options.url,
                    layer: options.layer,
                    format: options.format,
                    style: '',
                    tileMatrixSetID: options.matrixSet,
                    minimumLevel: options.tileGrid.minZoom,
                    maximumLevel: options.tileGrid.maxZoom,
                    tilingScheme: this.createTilingScheme({
                        handleAs: layer.get("handleAs"),
                        projection: options.projection
                    }, options)
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
    createGenericXYZProvider(layer, options) {
        try {
            if (typeof options !== "undefined") {
                let west = this.cesium.Math.toRadians(-180);
                let south = this.cesium.Math.toRadians(-90);
                let east = this.cesium.Math.toRadians(180);
                let north = this.cesium.Math.toRadians(90);
                return new this.cesium.UrlTemplateImageryProvider({
                    url: options.url,
                    minimumLevel: options.tileGrid.minZoom,
                    maximumLevel: options.tileGrid.maxZoom,
                    tileWidth: options.tileGrid.tileSize,
                    tileHeight: options.tileGrid.tileSize,
                    tilingScheme: this.createTilingScheme({
                        handleAs: layer.get("handleAs"),
                        projection: options.projection
                    }, options)
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

    createVectorSource(layer, options) {
        // customize the layer url if needed
        // if (typeof options.url !== "undefined" && typeof layer.getIn(["urlFunctions", mapStrings.MAP_LIB_3D]) !== "undefined") {
        //     let urlFunction = MapUtil.getUrlFunction(layer.getIn(["urlFunctions", mapStrings.MAP_LIB_3D]));
        //     options.url = urlFunction({
        //         layer: layer,
        //         url: options.url
        //     });
        // }

        switch (layer.get("handleAs")) {
            case mapStrings.LAYER_VECTOR_GEOJSON:
                return this.createGeoJsonSource(layer, options);
            case mapStrings.LAYER_VECTOR_TOPOJSON:
                return this.createGeoJsonSource(layer, options);
            case mapStrings.LAYER_VECTOR_KML:
                return this.createKmlSource(layer, options);
            default:
                return false;
        }
    }
    createGeoJsonSource(layer, options) {
        return this.cesium.GeoJsonDataSource.load(options.url, {
            stroke: this.cesium.Color.fromCssColorString("#1E90FF"),
            fill: this.cesium.Color.fromCssColorString("#FEFEFE").withAlpha(0.5),
            strokeWidth: 3,
            show: layer.get("isActive")
        });
    }
    createKmlSource(layer, options) {
        return this.cesium.KmlDataSource.load(options.url, {
            camera: this.map.scene.camera,
            canvas: this.map.scene.canvas,
            show: layer.get("isActive")
        });
    }
    handleTileLoad(layer, mapLayer, x, y, level, context) {
        let url = layer.getIn(["wmtsOptions", "url"]);
        let customUrlFunction = MapUtil.getUrlFunction(layer.getIn(["wmtsOptions", "urlFunctions", mapStrings.MAP_LIB_3D]));
        let customTileFunction = MapUtil.getTileFunction(layer.getIn(["wmtsOptions", "tileFunctions", mapStrings.MAP_LIB_3D]));

        // have to override url to override tile load
        if (typeof customTileFunction === "function" && typeof customUrlFunction !== "function") {
            customUrlFunction = MapUtil.getUrlFunction(mapStrings.DEFAULT_URL_FUNC);
        }

        if (typeof customUrlFunction === "function") {
            let tileFunc = () => {
                return new Promise((resolve, reject) => {
                    // get the customized url
                    let tileUrl = customUrlFunction({
                        layer,
                        origUrl: layer.getIn(["wmtsOptions", "url"]),
                        tileCoord: [level, x, y],
                        context: mapStrings.MAP_LIB_3D
                    });

                    // run the customized tile creator
                    if (typeof customTileFunction === "function") {
                        customTileFunction({
                            layer: layer,
                            url: tileUrl,
                            success: resolve,
                            fail: reject
                        });
                    } else {
                        // create a standard image and return it
                        let imgTile = new Image();
                        imgTile.onload = () => {
                            resolve(imgTile);
                        };
                        imgTile.onerror = (err) => {
                            reject(err);
                        };

                        if (MiscUtil.urlIsCrossorigin(tileUrl)) {
                            imgTile.crossOrigin = '';
                        }
                        imgTile.src = tileUrl;
                    }
                });
            };
            // use Cesium's throttling to play nice with the rest of the system
            return this.cesium.throttleRequestByServer(url, tileFunc);
        } else {
            return mapLayer.imageryProvider._my_origTileLoadFunc(x, y, level);
        }
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
