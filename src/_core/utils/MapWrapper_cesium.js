import moment from 'moment';
import MapWrapper from '_core/utils/MapWrapper';
import MiscUtil from '_core/utils/MiscUtil';
import CesiumTilingScheme_GIBS from '_core/utils/CesiumTilingScheme_GIBS';
import * as appStrings from '_core/constants/appStrings';
import * as appConfig from 'constants/appConfig';
import MapUtil from '_core/utils/MapUtil';
import TileHandler from '_core/utils/TileHandler';
import 'assets/cesium/Cesium.js';
import '_core/utils/CesiumDrawHelper.js';
import 'assets/cesium/Widgets/widgets.css';

export default class MapWrapper_cesium extends MapWrapper {

    constructor(container, options) {
        super(container, options);
        this.is3D = true;
        this.isActive = options.getIn(["view", "in3DMode"]);
        this.tileHandler = new TileHandler();
        this.mapUtil = new MapUtil();
        this.miscUtil = new MiscUtil();

        this.mapDate = appConfig.DEFAULT_DATE;

        // Create cesium scene 
        window.CESIUM_BASE_URL = 'assets/cesium';
        this.cesium = window.Cesium;
        this.drawHelper = window.DrawHelper;
        this.map = this.createMap(container, options);

        // Create cesium-draw-helper
        this.drawHandler = new this.drawHelper({
            viewer: this.map,
            fill: appConfig.GEOMETRY_FILL_COLOR,
            stroke: appConfig.GEOMETRY_STROKE_COLOR
        });

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
        try {
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
                vrButton: false,
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
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.createMap:", err);
            return false;
        }
    }

    getMapSize() {
        return false;
    }

    resize() {
        return true;
    }

    setTerrainExaggeration(terrainExaggeration) {
        // Set terrain exaggeration on scene
        this.map.scene._terrainExaggeration = terrainExaggeration;

        // Force re-render if terrain is currently enabled
        if (this.map.terrainProvider !== new this.cesium.EllipsoidTerrainProvider()) {
            this.map.terrainProvider = new this.cesium.EllipsoidTerrainProvider();
            this.map.terrainProvider = new this.cesium.CesiumTerrainProvider({
                url: appConfig.DEFAULT_TERRAIN_ENDPOINT
            });
        }
        return true;
    }


    enableTerrain(enable) {
        if (enable) {
            this.map.terrainProvider = new this.cesium.CesiumTerrainProvider({
                url: appConfig.DEFAULT_TERRAIN_ENDPOINT
            });
        } else {
            this.map.terrainProvider = new this.cesium.EllipsoidTerrainProvider();
        }
        return true;
    }

    getCenter() {
        try {
            return [this.cesium.Math.toDegrees(this.map.camera.positionCartographic.longitude),
                this.cesium.Math.toDegrees(this.map.camera.positionCartographic.latitude)
            ];
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.getCenter:", err);
            return false;
        }
    }

    setExtent(extent) {
        try {
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
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.setExtent:", err);
            return false;
        }
    }

    getExtent() {
        try {
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
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.getExtent:", err);
            return false;
        }
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
            console.warn("Error in MapWrapper_cesium.zoomIn:", err);
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
            console.warn("Error in MapWrapper_cesium.zoomOut:", err);
            return false;
        }
    }

    resetOrientation(duration) {
        try {
            this.map.camera.flyTo({
                destination: this.map.camera.positionWC,
                orientation: {},
                duration: typeof(duration) === "number" ? duration : 1
            });
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.resetOrientation:", err);
            return false;
        }
    }

    addDrawHandler(geometryType, onDrawEnd, interactionType) {
        try {
            if (geometryType === appStrings.GEOMETRY_CIRCLE) {
                this.drawHandler._customInteractions["_id" + interactionType + appStrings.GEOMETRY_CIRCLE] = () => {
                    this.drawHandler.startDrawingCircle({
                        callback: (center, radius) => {
                            // Add geometry to cesium map since it's not done automatically
                            let id = Math.random();
                            this.addGeometry({ proj: appStrings.PROJECTIONS.latlon.code, type: geometryType, center: center, radius: radius, coordinateType: appStrings.COORDINATE_TYPE_CARTESIAN, id: id }, interactionType);
                            if (typeof onDrawEnd === "function") {
                                // Recover geometry from event in cartographic
                                let cartographicCenter = this.cartesianToLatLon(center);
                                let geometry = {
                                    type: appStrings.GEOMETRY_CIRCLE,
                                    center: cartographicCenter,
                                    id: id,
                                    proj: appStrings.PROJECTIONS.latlon.code,
                                    radius: radius,
                                    coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC
                                };
                                onDrawEnd(geometry);
                            }
                        }
                    });
                };
                return true;
            } else if (geometryType === appStrings.GEOMETRY_LINE_STRING) {
                this.drawHandler._customInteractions["_id" + interactionType + appStrings.GEOMETRY_LINE_STRING] = () => {
                    this.drawHandler.startDrawingPolyline({
                        callback: (coordinates) => {
                            // Add geometry to cesium map since it's not done automatically
                            let id = Math.random();
                            this.addGeometry({ proj: appStrings.PROJECTIONS.latlon.code, type: geometryType, coordinates: coordinates, coordinateType: appStrings.COORDINATE_TYPE_CARTESIAN, id: id }, interactionType);
                            if (typeof onDrawEnd === "function") {
                                // Recover geometry from event in cartographic
                                let cartographicCoordinates = coordinates.map((pos) => {
                                    return this.cartesianToLatLon(pos);
                                });
                                let geometry = {
                                    type: appStrings.GEOMETRY_LINE_STRING,
                                    id: id,
                                    proj: appStrings.PROJECTIONS.latlon.code,
                                    coordinates: cartographicCoordinates,
                                    coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC
                                };
                                onDrawEnd(geometry);
                            }
                        }
                    });
                };
                return true;
            } else if (geometryType === appStrings.GEOMETRY_POLYGON) {
                this.drawHandler._customInteractions["_id" + interactionType + appStrings.GEOMETRY_POLYGON] = () => {
                    this.drawHandler.startDrawingPolygon({
                        callback: (coordinates) => {
                            // Add geometry to cesium map since it's not done automatically
                            let id = Math.random();
                            this.addGeometry({ proj: appStrings.PROJECTIONS.latlon.code, type: geometryType, coordinates: coordinates, coordinateType: appStrings.COORDINATE_TYPE_CARTESIAN, id: id }, interactionType);
                            if (typeof onDrawEnd === "function") {
                                // Recover geometry from event in cartographic
                                let cartographicCoordinates = coordinates.map((pos) => {
                                    return this.cartesianToLatLon(pos);
                                });
                                let geometry = {
                                    type: appStrings.GEOMETRY_POLYGON,
                                    coordinates: cartographicCoordinates,
                                    id: id,
                                    proj: appStrings.PROJECTIONS.latlon.code,
                                    coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC
                                };
                                onDrawEnd(geometry);
                            }
                        }
                    });
                };
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.addDrawHandler:", err);
            return false;
        }
    }

    enableDrawing(geometryType) {
        try {
            // Enable drawing for geometryType
            let interaction = this.drawHandler._customInteractions["_id" + appStrings.INTERACTION_DRAW + geometryType];
            if (interaction) {
                interaction();
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.enableDrawing:", err);
            return false;
        }
    }

    disableDrawing() {
        try {
            this.drawHandler.stopDrawing();
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.disableDrawing:", err);
            return false;
        }
    }

    enableMeasuring(geometryType, measurementType) {
        try {
            // Enable drawing for geometryType
            let interaction = this.drawHandler._customInteractions["_id" + appStrings.INTERACTION_MEASURE + geometryType];
            if (interaction) {
                interaction();
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.enableMeasuring:", err);
            return false;
        }
    }

    disableMeasuring() {
        try {
            this.drawHandler.stopDrawing();
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.disableMeasuring:", err);
            return false;
        }
    }

    enableActiveListeners(active) {
        if (this.drawHandler) {
            this.drawHandler._isActive = active;
            return true;
        }
        return false;
    }

    addGeometry(geometry, interactionType, geodesic = false) {
        try {
            if (geometry.type === appStrings.GEOMETRY_CIRCLE) {
                let cesiumCenter = null;
                let cesiumRadius = null;
                // Check coordinate type
                if (geometry.coordinateType === appStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                    // Calc radius by finding cartesian distance from 
                    // center to radius point
                    let point = { lat: geometry.center.lat, lon: geometry.center.lon };
                    point.lon += geometry.radius;

                    let cesiumPoint = this.latLonToCartesian(point.lat, point.lon);
                    cesiumCenter = this.latLonToCartesian(geometry.center.lat, geometry.center.lon);
                    // cesiumRadius = this.cesium.Cartesian3.distance(cesiumCenter, cesiumPoint);
                    cesiumRadius = this.mapUtil.calculatePolylineDistance([
                        [geometry.center.lon, geometry.center.lat],
                        [point.lon, point.lat]
                    ], geometry.proj);
                } else {
                    cesiumCenter = geometry.center;
                    cesiumRadius = geometry.radius;
                }
                let material = this.cesium.Material.fromType(this.cesium.Material.RimLightingType);
                material.uniforms.color = new this.cesium.Color.fromCssColorString(appConfig.GEOMETRY_FILL_COLOR);
                material.uniforms.rimColor = new this.cesium.Color(1.0, 1.0, 1.0, 1.0);
                let primitiveToAdd = new this.drawHelper.CirclePrimitive({
                    center: cesiumCenter,
                    radius: cesiumRadius,
                    material: material
                });
                this.map.scene.primitives.add(primitiveToAdd);
                primitiveToAdd._interactionType = interactionType;
                primitiveToAdd.setStrokeStyle(new this.cesium.Color.fromCssColorString(appConfig.GEOMETRY_STROKE_COLOR), appConfig.GEOMETRY_STROKE_WEIGHT);
                return true;
            } else if (geometry.type === appStrings.GEOMETRY_LINE_STRING) {
                let cartesianCoords = null;
                // Check coordinate type
                if (geometry.coordinateType === appStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                    // Transform coordinates from cartographic to cartesian
                    cartesianCoords = geometry.coordinates.map((x) => {
                        return this.latLonToCartesian(x.lat, x.lon);
                    });
                } else if (geometry.coordinateType === appStrings.COORDINATE_TYPE_CARTESIAN) {
                    cartesianCoords = geometry.coordinates;
                } else {
                    console.warn("Unhandled coordinate type when trying to draw cesium line string:", geometry.type);
                    return false;
                }
                let material = this.cesium.Material.fromType(this.cesium.Material.RimLightingType);
                material.uniforms.rimColor = new this.cesium.Color.fromCssColorString(appConfig.GEOMETRY_STROKE_COLOR);
                let primitiveToAdd = new this.drawHelper.PolylinePrimitive({
                    positions: cartesianCoords,
                    width: appConfig.GEOMETRY_STROKE_WEIGHT,
                    material: material,
                    geodesic: true
                });
                primitiveToAdd._interactionType = interactionType;
                this.map.scene.primitives.add(primitiveToAdd);
                return true;
            } else if (geometry.type === appStrings.GEOMETRY_POLYGON) {
                let cartesianCoords = null;
                // Check coordinate type
                if (geometry.coordinateType === appStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                    // Transform coordinates from cartographic to cartesian
                    cartesianCoords = geometry.coordinates.map((x) => {
                        return this.latLonToCartesian(x.lat, x.lon);
                    });
                } else if (geometry.coordinateType === appStrings.COORDINATE_TYPE_CARTESIAN) {
                    cartesianCoords = geometry.coordinates;
                } else {
                    console.warn("Unhandled coordinate type when trying to draw cesium polygon string:", geometry.type);
                    return false;
                }
                let material = this.cesium.Material.fromType(this.cesium.Material.RimLightingType);
                material.uniforms.color = new this.cesium.Color.fromCssColorString(appConfig.GEOMETRY_FILL_COLOR);
                material.uniforms.rimColor = new this.cesium.Color.fromCssColorString(appConfig.GEOMETRY_FILL_COLOR);
                let primitiveToAdd = new this.drawHelper.PolygonPrimitive({
                    positions: cartesianCoords,
                    material: material
                });
                this.map.scene.primitives.add(primitiveToAdd);
                primitiveToAdd._interactionType = interactionType;
                primitiveToAdd.setStrokeStyle(new this.cesium.Color.fromCssColorString(appConfig.GEOMETRY_STROKE_COLOR), appConfig.GEOMETRY_STROKE_WEIGHT);
                return true;
            }
            console.warn("add geometry not complete in cesium", geometry, " is unsupported");
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.addGeometry:", err);
            return false;
        }
    }

    addLabel(label, coords, opt_meta = {}) {
        try {
            coords = this.cesium.Cartesian3.fromDegrees(coords[0], coords[1]);
            let result = this.createOverlayImage(label);
            let overlay = result[0];
            let canvas = result[1];

            //Need to wait for image to load before proceeding to draw
            overlay.onload = () => {
                // label options
                let labelOptions = {
                    id: Math.random(),
                    position: coords,
                    billboard: {
                        image: canvas
                    }
                };

                // store meta options
                for (let key in opt_meta) {
                    if (opt_meta.hasOwnProperty(key)) {
                        labelOptions[key] = opt_meta[key];
                    }
                }

                // place the label
                canvas.getContext('2d').drawImage(overlay, 0, 0);
                this.map.entities.add(labelOptions);
            };
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.addLabel:", err);
            return false;
        }
    }

    createOverlayImage(text) {
        let canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 85;
        let tooltipStyles = "-webkit-font-smoothing: auto; padding-top:60px; top: -60px; text-align:center; position:relative; display:block; text-rendering: optimizeLegibility; font-family:'Roboto Mono, sans-serif'; font-size:14px; white-space: nowrap; color:black; letter-spacing:1px";
        let tooltipContentStyles = "-webkit-font-smoothing: auto; font-family:Roboto Mono, Helvetica Neue, Helvetica !important; font-weight:400; !important; top: 0px; position:relative; display: inline-block; background: white; border-radius: 2px;padding: 5px 9px;";
        let tooltipAfterStyles = "border-top: 8px solid #eeeeee;border-right: 8px solid transparent;border-left: 8px solid transparent;content: '';position: absolute;bottom: -8px;margin-left: -9px;left: 50%;";

        let svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="85">' +
            '<foreignObject width="100%" height="100%">' +
            '<div xmlns="http://www.w3.org/1999/xhtml">' +
            '<div style="transform:scale(1);' + tooltipStyles + '">' +
            '<span style="' + tooltipContentStyles + '">' + text + '</span>' +
            '<span style="' + tooltipAfterStyles + '"></span>' +
            '</div>' +
            '</div>' +
            '</foreignObject>' +
            '</svg>';

        let image = new Image();
        image.src = 'data:image/svg+xml;base64,' + window.btoa(svgString);
        return [image, canvas];
    }

    removeAllDrawings() {
        try {
            // Find primitives to remove
            let primitivesToRemove = this.map.scene.primitives._primitives.filter(x => x._interactionType === appStrings.INTERACTION_DRAW);
            for (let i = 0; i < primitivesToRemove.length; i++) {
                this.map.scene.primitives.remove(primitivesToRemove[i]);
            }
            return this.map.scene.primitives._primitives.filter(x => x._interactionType === appStrings.INTERACTION_DRAW).length === 0;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.removeAllDrawings:", err);
            return false;
        }
    }

    removeAllMeasurements() {
        try {
            // Find primitives to remove
            let primitivesToRemove = this.map.scene.primitives._primitives.filter(x => x._interactionType === appStrings.INTERACTION_MEASURE);
            for (let i = 0; i < primitivesToRemove.length; i++) {
                this.map.scene.primitives.remove(primitivesToRemove[i]);
            }
            // Remove all entities
            this.map.entities.removeAll();
            return this.map.scene.primitives._primitives.filter(x => x._interactionType === appStrings.INTERACTION_MEASURE).length === 0;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.removeAllMeasurements:", err);
            return false;
        }
    }

    addEventListener(eventStr, callback) {
        try {
            switch (eventStr) {
                case appStrings.EVENT_MOVE_END:
                    this.map.camera.moveEnd.addEventListener(callback);
                    return;
                case appStrings.EVENT_MOUSE_HOVER:
                    new this.cesium.ScreenSpaceEventHandler(this.map.scene.canvas)
                        .setInputAction((movement) => {
                            callback([movement.endPosition.x, movement.endPosition.y]);
                        }, this.cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    return;
                case appStrings.EVENT_MOUSE_CLICK:
                    new this.cesium.ScreenSpaceEventHandler(this.map.scene.canvas)
                        .setInputAction((movement) => {
                            callback({ pixel: [movement.position.x, movement.position.y] });
                        }, this.cesium.ScreenSpaceEventType.LEFT_CLICK);
                    return;
                default:
                    return;
            }
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.addEventListener:", err);
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
            } else if (
                mapLayer._layerHandleAs === appStrings.LAYER_VECTOR_GEOJSON ||
                mapLayer._layerHandleAs === appStrings.LAYER_VECTOR_TOPOJSON ||
                mapLayer._layerHandleAs === appStrings.LAYER_VECTOR_KML
            ) {
                mapLayer.entities._entities._array.map((entity) => {
                    if (entity.polygon) {
                        if (entity.polygon.outlineColor) {
                            let c = entity.polygon.outlineColor.getValue();
                            c.alpha = opacity * 1.0;
                            entity.polygon.outlineColor.setValue(c);
                        }
                        if (entity.polygon.fill) {
                            let c = entity.polygon.fill.getValue();
                            c.alpha = opacity * 0.5;
                            entity.polygon.fill.setValue(c);
                        }
                        if (entity.polygon.material) {
                            if (entity.polygon.material.color) {
                                let c = entity.polygon.material.color.getValue();
                                c.alpha = opacity * 0.5;
                                entity.polygon.material.color.setValue(c);
                            }
                        }
                    }
                    if (entity.polyline) {
                        let c = entity.polyline.material.color.getValue();
                        c.alpha = opacity * 1.0;
                        entity.polyline.material.color.setValue(c);
                    }
                    if (entity.billboard) {
                        entity.billboard.color = new this.cesium.Color(1.0, 1.0, 1.0, opacity * 1.0);
                    }
                });

            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.setLayerOpacity:", err);
            return false;
        }
    }

    setScaleUnits(units) {
        try {
            // Set measurement units
            let newOutputText = "";
            this.map.entities.values.forEach((entity) => {
                if (entity.measurementType === appStrings.MEASURE_AREA) {
                    newOutputText = this.mapUtil.formatArea(this.mapUtil.convertAreaUnits(entity.meters, units), units);
                } else if (entity.measurementType === appStrings.MEASURE_DISTANCE) {
                    newOutputText = this.mapUtil.formatDistance(this.mapUtil.convertDistanceUnits(entity.meters, units), units);
                } else {
                    console.warn("could not set cesium scale units.");
                    return false;
                }
                // Create new image
                let result = this.createOverlayImage(newOutputText);
                let overlay = result[0];
                let canvas = result[1];

                //Need to wait for image to load before proceeding to draw
                overlay.onload = () => {
                    canvas.getContext('2d').drawImage(overlay, 0, 0);
                    // Set image of overlay
                    entity.billboard.image = overlay;
                };
            });
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.setScaleUnits:", err);
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
            console.warn("Error in MapWrapper_cesium.addLayer:", err);
            return false;
        }
    }

    removeLayer(mapLayer) {
        try {
            let mapLayers = this.getMapLayers(mapLayer._layerHandleAs);
            mapLayers.remove(mapLayer);
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.removeLayer:", err);
            return false;
        }
    }

    activateLayer(layer) {
        try {
            let mapLayers = this.getMapLayers(layer.get("handleAs"));

            // check if layer already exists on map, just move to top
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);
            if (mapLayer) {
                this.moveLayerToTop(layer);
                return true;
            }

            // layer does not exist so we must create it
            mapLayer = this.createLayer(layer);

            // if the creation failed
            if (!mapLayer) {
                return false;
            }

            // layer creation succeeded, add the layer to map and make it visible
            this.addLayer(mapLayer);
            mapLayer.show = true;
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.activateLayer:", err);
            return false;
        }
    }

    deactivateLayer(layer) {
        try {
            // find the layer on the map
            let mapLayers = this.getMapLayers(layer.get("handleAs"));
            let mapLayer = this.findLayerInMapLayers(mapLayers, layer);

            // remove the layer
            if (mapLayer) {
                return this.removeLayer(mapLayer);
            }

            // Layer is already not active
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.deactivateLayer:", err);
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
            console.warn("Error in MapWrapper_cesium.updateLayer:", err);
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
                if (typeof currBasemap !== "undefined" && currBasemap._layerType === appStrings.LAYER_GROUP_TYPE_BASEMAP) {
                    mapLayers.remove(currBasemap);
                }
                mapLayers.add(newBasemap, 0);
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.setBasemap:", err);
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
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.hideBasemap:", err);
            return false;
        }
    }
    createLayer(layer) {
        switch (layer.get("handleAs")) {
            case appStrings.LAYER_GIBS_RASTER:
                return this.createWMTSLayer(layer);
            case appStrings.LAYER_WMTS_RASTER:
                return this.createWMTSLayer(layer);
            case appStrings.LAYER_XYZ_RASTER:
                return this.createWMTSLayer(layer);
            case appStrings.LAYER_VECTOR_GEOJSON:
                return this.createVectorLayer(layer);
            case appStrings.LAYER_VECTOR_TOPOJSON:
                return this.createVectorLayer(layer);
            case appStrings.LAYER_VECTOR_KML:
                return this.createVectorLayer(layer);
            case appStrings.LAYER_VECTOR_DRAWING:
                return this.createVectorLayer(layer);
            default:
                console.warn("Error in MapWrapper_cesium.createLayer: unknown layer type - " + layer.get("handleAs"));
                return false;
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
                mapLayer._layerTime = moment(this.mapDate).format(layer.get("timeFormat"));

                // override the tile loading for this layer
                let origTileLoadFunc = mapLayer.imageryProvider.requestImage;
                mapLayer.imageryProvider._my_origTileLoadFunc = origTileLoadFunc;
                mapLayer.imageryProvider.requestImage = function(x, y, level) {
                    return _context.handleTileLoad(layer, mapLayer, x, y, level, this);
                };

                return mapLayer;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.createWMTSLayer:", err);
            return false;
        }
    }

    createVectorLayer(layer) {
        try {
            let options = { url: layer.get("url") };
            let layerSource = this.createVectorSource(layer, options);
            if (layerSource) {
                // layer source is a promise that acts as a stand-in while the data loads
                layerSource.then((mapLayer) => {
                    mapLayer._layerId = layer.get("id");
                    mapLayer._layerType = layer.get("type");
                    mapLayer._layerHandleAs = layer.get("handleAs");
                    mapLayer._layerTime = moment(this.mapDate).format(layer.get("timeFormat"));
                    setTimeout(() => {
                        this.setLayerOpacity(layer, layer.get("opacity"));
                    }, 0);
                });

                // need to add custom metadata while data loads
                layerSource._layerId = layer.get("id");
                layerSource._layerType = layer.get("type");
                layerSource._layerHandleAs = layer.get("handleAs");
                layerSource._layerTime = moment(this.mapDate).format(layer.get("timeFormat"));

                return layerSource;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.createVectorLayer:", err);
        }
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
            console.warn("Error in MapWrapper_cesium.getLatLonFromPixelCoordinate:", err);
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
            console.warn("Error in MapWrapper_cesium.moveLayerToTop:", err);
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
            console.warn("Error in MapWrapper_cesium.moveLayerToBottom:", err);
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
            console.warn("Error in MapWrapper_cesium.moveLayerUp:", err);
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
            console.warn("Error in MapWrapper_cesium.moveLayerDown:", err);
            return false;
        }
    }

    getPixelFromClickEvent(clickEvt) {
        try {
            return clickEvt.pixel;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.getPixelFromClickEvent:", err);
            return false;
        }
    }

    setMapDate(date) {
        this.mapDate = date;
        return true;
    }


    /* methods for Cesium only */
    cartesianToLatLon(point) {
        let cartographicRadians = this.cesium.Ellipsoid.WGS84.cartesianToCartographic(point);
        return {
            lat: this.cesium.Math.toDegrees(cartographicRadians.latitude),
            lon: this.cesium.Math.toDegrees(cartographicRadians.longitude)
        };
    }

    latLonToCartesian(lat, lon) {
        return new this.cesium.Cartesian3.fromDegrees(lon, lat);
    }

    createImageryProvider(layer, options) {
        switch (layer.get("handleAs")) {
            case appStrings.LAYER_GIBS_RASTER:
                return this.createGIBSWMTSProvider(layer, options);
            case appStrings.LAYER_WMTS_RASTER:
                return this.createGenericWMTSProvider(layer, options);
            case appStrings.LAYER_XYZ_RASTER:
                return this.createGenericXYZProvider(layer, options);
            default:
                console.warn("Error in MapWrapper_cesium.createImageryProvider: unknown layer type - " + layer.get("handleAs"));
                return false;
        }
    }
    createTilingScheme(options, tileSchemeOptions) {
        if (options.projection === appStrings.PROJECTIONS.latlon.code) {
            if (options.handleAs === appStrings.LAYER_GIBS_RASTER) {
                return new CesiumTilingScheme_GIBS({ numberOfLevelZeroTilesX: 2, numberOfLevelZeroTilesY: 1 }, tileSchemeOptions);
            }
            return new this.cesium.GeographicTilingScheme();
        } else if (options.projection === appStrings.PROJECTIONS.webmercator.code) {
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
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.createGIBSWMTSProvider:", err);
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
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.createGenericWMTSProvider:", err);
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
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_cesium.createGenericXYZProvider:", err);
            return false;
        }
    }

    createVectorSource(layer, options) {
        switch (layer.get("handleAs")) {
            case appStrings.LAYER_VECTOR_GEOJSON:
                return this.createGeoJsonSource(layer, options);
            case appStrings.LAYER_VECTOR_TOPOJSON:
                return this.createGeoJsonSource(layer, options);
            case appStrings.LAYER_VECTOR_KML:
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
        let customUrlFunction = this.tileHandler.getUrlFunction(layer.getIn(["wmtsOptions", "urlFunctions", appStrings.MAP_LIB_3D]));
        let customTileFunction = this.tileHandler.getTileFunction(layer.getIn(["wmtsOptions", "tileFunctions", appStrings.MAP_LIB_3D]));

        // have to override url to override tile load
        if (typeof customTileFunction === "function" && typeof customUrlFunction !== "function") {
            customUrlFunction = this.tileHandler.getUrlFunction(appStrings.DEFAULT_URL_FUNC);
        }

        if (typeof customUrlFunction === "function") {
            let tileFunc = () => {
                return new Promise((resolve, reject) => {
                    // get the customized url
                    let tileUrl = customUrlFunction.call(this.tileHandler, {
                        layer: layer,
                        mapLayer: mapLayer,
                        origUrl: layer.getIn(["wmtsOptions", "url"]),
                        tileCoord: [level, x, y],
                        context: appStrings.MAP_LIB_3D
                    });

                    // run the customized tile creator
                    if (typeof customTileFunction === "function") {
                        customTileFunction.call(this.tileHandler, {
                            layer: layer,
                            mapLayer: mapLayer,
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

                        if (this.miscUtil.urlIsCrossorigin(tileUrl)) {
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

        if (mapLayer._layerType === appStrings.LAYER_GROUP_TYPE_REFERENCE) { // referece layers always on top
            return index;
        } else if (mapLayer._layerType === appStrings.LAYER_GROUP_TYPE_BASEMAP) { // basemaps always on bottom
            return 0;
        } else { // data layers in the middle
            for (let i = index - 1; i >= 0; --i) {
                let compareLayer = mapLayers.get(i);
                if (compareLayer._layerType === appStrings.LAYER_GROUP_TYPE_DATA ||
                    compareLayer._layerType === appStrings.LAYER_GROUP_TYPE_BASEMAP) {
                    return i + 1;
                }
            }
        }
        return index;
    }

    getMapLayers(type) {
        switch (type) {
            case appStrings.LAYER_GIBS_RASTER:
                return this.map.imageryLayers;
            case appStrings.LAYER_WMTS_RASTER:
                return this.map.imageryLayers;
            case appStrings.LAYER_XYZ_RASTER:
                return this.map.imageryLayers;
            case appStrings.LAYER_VECTOR_GEOJSON:
                return this.map.dataSources;
            case appStrings.LAYER_VECTOR_TOPOJSON:
                return this.map.dataSources;
            case appStrings.LAYER_VECTOR_KML:
                return this.map.dataSources;
            default:
                return this.map.imageryLayers;
        }
    }
}
