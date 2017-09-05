import Immutable from 'immutable';
import moment from 'moment';
import Ol_Map from 'ol/map';
import Ol_View from 'ol/view';
import Ol_Layer_Vector from 'ol/layer/vector';
import Ol_Layer_Tile from 'ol/layer/tile';
import Ol_Source_WMTS from 'ol/source/wmts';
import Ol_Source_Cluster from 'ol/source/cluster';
import Ol_Source_Vector from 'ol/source/vector';
import Ol_Source_XYZ from 'ol/source/xyz';
import Ol_Tilegrid_WMTS from 'ol/tilegrid/wmts';
import Ol_Style_Fill from 'ol/style/fill';
import Ol_Style from 'ol/style/style';
import Ol_Style_Circle from 'ol/style/circle';
import Ol_Style_Stroke from 'ol/style/stroke';
import Ol_Proj from 'ol/proj';
import Ol_Proj_Projection from 'ol/proj/projection';
import Ol_Interaction from 'ol/interaction';
import Ol_Interaction_Draw from 'ol/interaction/draw';
import Ol_Interaction_DoubleClickZoom from 'ol/interaction/doubleclickzoom';
import Ol_Overlay from 'ol/overlay';
import Ol_Feature from 'ol/feature';
import Ol_Geom_Circle from 'ol/geom/circle';
import Ol_Geom_Linestring from 'ol/geom/linestring';
import Ol_Geom_Polygon from 'ol/geom/polygon';
import Ol_Format_GeoJSON from 'ol/format/geojson';
import Ol_Format_TopoJSON from 'ol/format/topojson';
import Ol_Format_KML from 'ol/format/kml';
import Ol_Format_WMTSCapabilities from 'ol/format/wmtscapabilities';
import Ol_Easing from 'ol/easing';
import proj4js from 'proj4';
import * as appStrings from '_core/constants/appStrings';
import appConfig from 'constants/appConfig';
import MapWrapper from '_core/utils/MapWrapper';
import MiscUtil from '_core/utils/MiscUtil';
import MapUtil from '_core/utils/MapUtil';
import TileHandler from '_core/utils/TileHandler';
import Cache from '_core/utils/Cache';

export default class MapWrapper_openlayers extends MapWrapper {
    constructor(container, options) {
        super(container, options);
        this.is3D = false;
        this.isActive = !options.getIn(["view", "in3DMode"]);
        this.layerCache = new Cache(appConfig.MAX_LAYER_CACHE);
        this.tileHandler = new TileHandler();
        this.mapUtil = new MapUtil();
        this.miscUtil = new MiscUtil();
        this.cachedGeometry = null;
        this.defaultGeometryStyle = new Ol_Style({
            fill: new Ol_Style_Fill({
                color: appConfig.GEOMETRY_FILL_COLOR
            }),
            stroke: new Ol_Style_Stroke({
                color: appConfig.GEOMETRY_STROKE_COLOR,
                width: appConfig.GEOMETRY_STROKE_WEIGHT
            }),
            image: new Ol_Style_Circle({
                radius: 7,
                fill: new Ol_Style_Fill({
                    color: '#ffcc33'
                })
            })
        });
        this.defaultMeasureStyle = new Ol_Style({
            fill: new Ol_Style_Fill({
                color: appConfig.MEASURE_FILL_COLOR
            }),
            stroke: new Ol_Style_Stroke({
                color: appConfig.MEASURE_STROKE_COLOR,
                lineDash: [10, 10],
                width: 2
            }),
            image: new Ol_Style_Circle({
                radius: 7,
                stroke: new Ol_Style_Stroke({
                    color: 'rgba(255, 255, 255, 0.75)'
                }),
                fill: new Ol_Style_Fill({
                    color: 'rgba(255, 255, 255, 0.5)'
                })
            })
        });
        this.map = this.createMap(container, options);

        this.initializationSuccess = this.map ? true : false;
    }

    createMap(container, options) {
        try {
            // create default draw layer
            let vectorSource = new Ol_Source_Vector({ wrapX: true });

            let vectorLayer = new Ol_Layer_Vector({
                source: vectorSource,
                style: this.defaultGeometryStyle,
                extent: appConfig.DEFAULT_MAP_EXTENT
            });
            vectorLayer.set("_layerId", "_vector_drawings");
            vectorLayer.set("_layerType", appStrings.LAYER_GROUP_TYPE_REFERENCE);

            // get the view options for the map
            let viewOptions = options.get("view").toJS();
            let mapProjection = Ol_Proj.get(appConfig.DEFAULT_PROJECTION.code);
            let center = viewOptions.center;

            return new Ol_Map({
                target: container,
                renderer: ['canvas', 'dom'],
                layers: [vectorLayer],
                view: new Ol_View({
                    maxZoom: viewOptions.maxZoom,
                    minZoom: viewOptions.minZoom,
                    projection: mapProjection,
                    maxResolution: viewOptions.maxResolution
                }),
                controls: [],
                interactions: Ol_Interaction.defaults({
                    altShiftDragRotate: false,
                    pinchRotate: false,
                    shiftDragZoom: false,
                    keyboard: false
                })
            });
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.createMap:", err);
            return false;
        }
    }

    getMapSize() {
        try {
            let size = this.map.getSize();
            if (!size) {
                return { width: 0, height: 0 };
            } else {
                return { width: size[0], height: size[1] };
            }
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.getMapSize:", err);
            return false;
        }
    }

    resize() {
        try {
            this.map.updateSize();
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.resize:", err);
            return false;
        }
    }

    createLayer(layer, fromCache = true) {
        let mapLayer = false;

        // pull from cache if possible
        let cacheHash = this.getCacheHash(layer);
        if (fromCache && this.layerCache.get(cacheHash)) {
            let cachedLayer = this.layerCache.get(cacheHash);
            cachedLayer.setOpacity(layer.get("opacity"));
            cachedLayer.setVisible(layer.get("isActive"));
            return cachedLayer;
        }

        switch (layer.get("handleAs")) {
            case appStrings.LAYER_GIBS_RASTER:
                mapLayer = this.createWMTSLayer(layer, fromCache);
                break;
            case appStrings.LAYER_WMTS_RASTER:
                mapLayer = this.createWMTSLayer(layer, fromCache);
                break;
            case appStrings.LAYER_XYZ_RASTER:
                mapLayer = this.createWMTSLayer(layer, fromCache);
                break;
            case appStrings.LAYER_VECTOR_GEOJSON:
                mapLayer = this.createVectorLayer(layer, fromCache);
                break;
            case appStrings.LAYER_VECTOR_TOPOJSON:
                mapLayer = this.createVectorLayer(layer, fromCache);
                break;
            case appStrings.LAYER_VECTOR_KML:
                mapLayer = this.createVectorLayer(layer, fromCache);
                break;
            default:
                console.warn("Error in MapWrapper_openlayers.createLayer: unknown layer type - ", layer.get("handleAs"));
                mapLayer = false;
                break;
        }

        if (mapLayer) {
            mapLayer.set("_layerId", layer.get("id"));
            mapLayer.set("_layerType", layer.get("type"));
            mapLayer.set("_layerCacheHash", this.getCacheHash(layer));
            mapLayer.set("_layerTime", moment(this.mapDate).format(layer.get("timeFormat")));
        }
        return mapLayer;
    }

    createWMTSLayer(layer, fromCache = true) {
        try {
            if (layer && layer.get("wmtsOptions")) {

                let options = layer.get("wmtsOptions").toJS();
                let layerSource = this.createLayerSource(layer, options);

                // set up wrap around extents
                // let mapProjExtent = this.map.getView().getProjection().getExtent();

                let mapLayer = new Ol_Layer_Tile({
                    opacity: layer.get("opacity"),
                    visible: layer.get("isActive"),
                    crossOrigin: "anonymous",
                    source: layerSource,
                    extent: appConfig.DEFAULT_MAP_EXTENT
                });

                // override tile url and load functions
                let origTileUrlFunc = layerSource.getTileUrlFunction();
                let origTileLoadFunc = layerSource.getTileLoadFunction();
                layerSource.setTileUrlFunction((tileCoord, pixelRatio, projectionString) => {
                    return this.generateTileUrl(layer, mapLayer, layerSource, tileCoord, pixelRatio, projectionString, origTileUrlFunc);
                });
                layerSource.setTileLoadFunction((tile, url) => {
                    return this.handleTileLoad(layer, mapLayer, tile, url, origTileLoadFunc);
                });

                return mapLayer;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.createWMTSLayer:", err);
            return false;
        }
    }

    createVectorLayer(layer, fromCache = true) {
        try {
            let layerSource = this.createLayerSource(layer, {
                url: layer.get("url")
            });
            if (layer.get("clusterVector")) {
                layerSource = new Ol_Source_Cluster({ source: layerSource });
            }

            return new Ol_Layer_Vector({
                source: layerSource,
                opacity: layer.get("opacity"),
                visible: layer.get("isActive"),
                extent: appConfig.DEFAULT_MAP_EXTENT
            });

        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.createVectorLayer:", err);
            return false;
        }
    }

    getCenter() {
        return [0, 0];
    }

    setExtent(extent) {
        try {
            if (extent) {
                let mapSize = this.map.getSize() || [];
                this.map.getView().fit(extent, {
                    size: mapSize,
                    constrainResolution: false
                });
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.setExtent:", err);
            return false;
        }
    }

    getExtent() {
        try {
            return this.map.getView().calculateExtent(this.map.getSize());
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.getExtent:", err);
            return false;
        }
    }

    panMap(direction, extraFar) {
        try {
            let deltaX = 0;
            let deltaY = 0;
            let view = this.map.getView();
            let pixelDelta = extraFar ? 200 : 100;

            switch (direction) {
                case appStrings.MAP_PAN_DIRECTION_UP:
                    deltaY = pixelDelta;
                    break;
                case appStrings.MAP_PAN_DIRECTION_DOWN:
                    deltaY = -pixelDelta;
                    break;
                case appStrings.MAP_PAN_DIRECTION_LEFT:
                    deltaX = pixelDelta;
                    break;
                case appStrings.MAP_PAN_DIRECTION_RIGHT:
                    deltaX = -pixelDelta;
                    break;
                default:
                    return false;
            }

            let delta = [deltaX, deltaY];
            let centerInPx = this.map.getPixelFromCoordinate(view.getCenter());
            let newCenterInPx = [centerInPx[0] - delta[0], centerInPx[1] - delta[1]];
            let newCenter = this.map.getCoordinateFromPixel(newCenterInPx);
            this.map.getView().setCenter(this.map.getView().getCenter());
            let pan = this.map.getView().animate({
                duration: 175,
                easing: Ol_Easing.linear,
                center: newCenter
            });
            return true;

        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.panMap:", err);
            return false;
        }
    }

    zoomIn(duration = 175) {
        try {
            if (typeof this.map !== "undefined" &&
                typeof this.map.getView() !== "undefined") {
                this.map.getView().setResolution(this.map.getView().getResolution());
                this.map.getView().animate({
                    resolution: this.map.getView().getResolution(),
                    zoom: this.map.getView().getZoom() + 1,
                    duration: duration
                });
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.zoomIn:", err);
            return false;
        }
    }
    zoomOut(duration = 175) {
        try {
            if (typeof this.map !== "undefined" &&
                typeof this.map.getView() !== "undefined") {
                this.map.getView().setResolution(this.map.getView().getResolution());
                this.map.getView().animate({
                    resolution: this.map.getView().getResolution(),
                    zoom: this.map.getView().getZoom() - 1,
                    duration: duration
                });
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.zoomOut:", err);
            return false;
        }
    }

    enableDrawing(geometryType) {
        try {
            // remove double-click zoom while drawing so we can double-click complete
            this.setDoubleClickZoomEnabled(false);

            // Get drawHandler by geometryType
            let drawInteraction = this.miscUtil.findObjectInArray(this.map.getInteractions().getArray(), "_id", appStrings.INTERACTION_DRAW + geometryType);
            if (drawInteraction) {
                // Call setActive(true) on handler to enable
                drawInteraction.setActive(true);
                // Check that handler is active
                return drawInteraction.getActive();
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.enableDrawing:", err);
            return false;
        }
    }

    disableDrawing(delayDblClickEnable = true) {
        try {
            // Call setActive(false) on all handlers
            let drawInteractions = this.miscUtil.findAllMatchingObjectsInArray(this.map.getInteractions().getArray(), appStrings.INTERACTION_DRAW, true);
            drawInteractions.map((handler) => {
                handler.setActive(false);

                // Check that handler is not active
                if (handler.getActive()) {
                    console.warn("could not disable openlayers draw handler:", handler.get("_id"));
                }
            });

            // re-enable double-click zoom
            if (delayDblClickEnable) {
                setTimeout(() => {
                    this.setDoubleClickZoomEnabled(true);
                }, 251);
            } else {
                this.setDoubleClickZoomEnabled(true);
            }
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.disableDrawing:", err);
            return false;
        }
    }

    completeDrawing() {
        try {
            let drawInteractions = this.miscUtil.findAllMatchingObjectsInArray(this.map.getInteractions().getArray(), appStrings.INTERACTION_DRAW, true);
            drawInteractions.map((handler) => {
                if (handler.getActive()) {
                    handler.finishDrawing();
                }
            });
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.completeDrawing:", err);
            return false;
        }
    }

    enableMeasuring(geometryType, measurementType) {
        try {
            // remove double-click zoom while drawing so we can double-click complete
            this.setDoubleClickZoomEnabled(false);

            // Get drawHandler by geometryType
            let interaction = this.miscUtil.findObjectInArray(this.map.getInteractions().getArray(), "_id", appStrings.INTERACTION_MEASURE + geometryType);
            if (interaction) {
                // Call setActive(true) on handler to enable
                interaction.setActive(true);
                // Check that handler is active
                return interaction.getActive();
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.enableMeasuring:", err);
            return false;
        }
    }

    disableMeasuring(delayDblClickEnable = true) {
        try {
            // Call setActive(false) on all handlers
            let measureInteractions = this.miscUtil.findAllMatchingObjectsInArray(this.map.getInteractions().getArray(), appStrings.INTERACTION_MEASURE, true);
            measureInteractions.map((handler) => {
                handler.setActive(false);

                // Check that handler is not active
                if (handler.getActive()) {
                    console.warn("could not disable openlayers measure handler:", handler.get("_id"));
                }
            });
            // re-enable double-click zoom
            if (delayDblClickEnable) {
                setTimeout(() => {
                    this.setDoubleClickZoomEnabled(true);
                }, 251);
            } else {
                this.setDoubleClickZoomEnabled(true);
            }
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.disableMeasuring:", err);
            return false;
        }
    }

    completeMeasuring() {
        try {
            let measureInteractions = this.miscUtil.findAllMatchingObjectsInArray(this.map.getInteractions().getArray(), appStrings.INTERACTION_MEASURE, true);
            measureInteractions.map((handler) => {
                if (handler.getActive()) {
                    handler.finishDrawing();
                }
            });
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.completeMeasuring:", err);
            return false;
        }
    }

    setDoubleClickZoomEnabled(enabled) {
        try {
            let dblClickInteraction = this.miscUtil.findObjectInArray(this.map.getInteractions().getArray(), (interaction) => {
                return interaction instanceof Ol_Interaction_DoubleClickZoom;
            });
            if (dblClickInteraction) {
                dblClickInteraction.setActive(enabled);
            }
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.setDoubleClickZoomEnabled:", err);
            return false;
        }
    }

    enableActiveListeners(active) {
        return false;
    }

    addGeometry(geometry, interactionType, geodesic = false) {
        let mapLayers = this.map.getLayers().getArray();
        let mapLayer = this.miscUtil.findObjectInArray(mapLayers, "_layerId", "_vector_drawings");
        if (!mapLayer) {
            console.warn("could not find drawing layer in openlayers map");
            return false;
        }
        if (geometry.type === appStrings.GEOMETRY_CIRCLE) {
            let circleGeom = null;
            if (geometry.coordinateType === appStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                circleGeom = new Ol_Geom_Circle([geometry.center.lon, geometry.center.lat], geometry.radius / Ol_Proj.METERS_PER_UNIT[this.map.getView().getProjection().getUnits()]);
            } else {
                console.warn("Unsupported geometry coordinateType ", geometry.coordinateType, " for openlayers circle");
                return false;
            }
            let circleFeature = new Ol_Feature({
                geometry: circleGeom
            });
            circleFeature.set("interactionType", interactionType);
            circleFeature.setId(geometry.id);
            mapLayer.getSource().addFeature(circleFeature);
            return true;
        }
        if (geometry.type === appStrings.GEOMETRY_LINE_STRING) {
            let lineStringGeom = null;
            if (geometry.coordinateType === appStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                let geomCoords = geometry.coordinates.map((x) => {
                    return [x.lon, x.lat];
                });

                // generate geodesic arcs from points
                if (geodesic) {
                    geomCoords = this.mapUtil.generateGeodesicArcsForLineString(geomCoords);
                }

                lineStringGeom = new Ol_Geom_Linestring(geomCoords);
            } else {
                console.warn("Unsupported geometry coordinateType ", geometry.coordinateType, " for openlayers lineString");
                return false;
            }

            let lineStringFeature = new Ol_Feature({
                geometry: lineStringGeom
            });
            lineStringFeature.set("interactionType", interactionType);
            lineStringFeature.setId(geometry.id);
            mapLayer.getSource().addFeature(lineStringFeature);
            return true;
        }
        if (geometry.type === appStrings.GEOMETRY_POLYGON) {
            let polygonGeom = null;
            if (geometry.coordinateType === appStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                // Map obj to array
                let geomCoords = geometry.coordinates.map((x) => {
                    return [x.lon, x.lat];
                });
                // Push the first point to close the ring
                geomCoords.push([geometry.coordinates[0].lon, geometry.coordinates[0].lat]);

                // generate geodesic arcs from points
                if (geodesic) {
                    geomCoords = this.mapUtil.generateGeodesicArcsForLineString(geomCoords);
                }

                // Put these coordinates into a ring by adding to array
                polygonGeom = new Ol_Geom_Polygon([geomCoords]);
            } else {
                console.warn("Unsupported geometry coordinateType ", geometry.coordinateType, " for openlayers polygon");
                return false;
            }
            let polygonFeature = new Ol_Feature({
                geometry: polygonGeom
            });
            polygonFeature.set("interactionType", interactionType);
            polygonFeature.setId(geometry.id);
            mapLayer.getSource().addFeature(polygonFeature);
            return true;
        }
        return false;
    }

    addLabel(label, coords, opt_meta = {}) {
        try {
            // Create label domNode
            let measureLabelEl = document.createElement('div');
            measureLabelEl.className = "tooltip tooltip-static";
            measureLabelEl.innerHTML = label;

            // create ol overlay
            let measureLabel = new Ol_Overlay({
                element: measureLabelEl,
                offset: [0, -15],
                positioning: 'bottom-center'
            });

            // store meta opt_meta
            for (let key in opt_meta) {
                if (opt_meta.hasOwnProperty(key)) {
                    measureLabel.set(key, opt_meta[key], true);
                }
            }

            // position and place
            measureLabel.setPosition(coords);
            this.map.addOverlay(measureLabel);
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.addLabel:", err);
            return false;
        }
    }

    removeAllDrawings() {
        let mapLayers = this.map.getLayers().getArray();
        let mapLayer = this.miscUtil.findObjectInArray(mapLayers, "_layerId", "_vector_drawings");
        if (!mapLayer) {
            console.warn("could not remove all geometries in openlayers map");
            return false;
        }
        // Remove geometries
        let mapLayerFeatures = mapLayer.getSource().getFeatures();
        let featuresToRemove = mapLayerFeatures.filter(x => x.get('interactionType') === appStrings.INTERACTION_DRAW);
        for (let i = 0; i < featuresToRemove.length; i++) {
            mapLayer.getSource().removeFeature(featuresToRemove[i]);
        }
        return mapLayer.getSource().getFeatures().filter(x => x.get('interactionType') === appStrings.INTERACTION_DRAW).length === 0;
    }

    removeAllMeasurements() {
        let mapLayers = this.map.getLayers().getArray();
        let mapLayer = this.miscUtil.findObjectInArray(mapLayers, "_layerId", "_vector_drawings");
        if (!mapLayer) {
            console.warn("could not remove all geometries in openlayers map");
            return false;
        }
        // Remove geometries
        let mapLayerFeatures = mapLayer.getSource().getFeatures();
        let featuresToRemove = mapLayerFeatures.filter(x => x.get('interactionType') === appStrings.INTERACTION_MEASURE);
        for (let i = 0; i < featuresToRemove.length; i++) {
            mapLayer.getSource().removeFeature(featuresToRemove[i]);
        }
        // Remove overlays
        this.map.getOverlays().clear();
        return mapLayer.getSource().getFeatures().filter(x => x.get('interactionType') === appStrings.INTERACTION_MEASURE).length === 0 && this.map.getOverlays().getArray().length === 0;
    }

    resetOrientation(duration) {
        return true;
    }

    addDrawHandler(geometryType, onDrawEnd, interactionType) {
        try {
            let mapLayers = this.map.getLayers().getArray();
            let mapLayer = this.miscUtil.findObjectInArray(mapLayers, "_layerId", "_vector_drawings");
            if (mapLayer) {
                let measureDistGeom = (coords, opt_geom) => {
                    let geom = opt_geom ? opt_geom : new Ol_Geom_Linestring();

                    // remove duplicates
                    let newCoords = coords.reduce((acc, el, i) => {
                        let prev = acc[i - 1];
                        el = this.mapUtil.constrainCoordinates(el);
                        if (!prev || (prev[0] !== el[0] || prev[1] !== el[1])) {
                            acc.push(el);
                        }
                        return acc;
                    }, []);

                    let lineCoords = this.mapUtil.generateGeodesicArcsForLineString(newCoords);
                    geom.setCoordinates(lineCoords);
                    geom.set("originalCoordinates", newCoords, true);
                    return geom;
                };
                let measureAreaGeom = (coords, opt_geom) => {
                    coords = coords[0]; // TODO: find case where this isn't what we want
                    let geom = opt_geom ? opt_geom : new Ol_Geom_Polygon();

                    // remove duplicates
                    let newCoords = coords.reduce((acc, el, i) => {
                        let prev = acc[i - 1];
                        el = this.mapUtil.constrainCoordinates(el);
                        if (!prev || (prev[0] !== el[0] || prev[1] !== el[1])) {
                            acc.push(el);
                        }
                        return acc;
                    }, []);

                    let lineCoords = this.mapUtil.generateGeodesicArcsForLineString(newCoords);
                    geom.setCoordinates([lineCoords]);
                    geom.set("originalCoordinates", newCoords, true);
                    return geom;
                };

                let geometryFunction = undefined;
                if (interactionType === appStrings.INTERACTION_MEASURE) {
                    if (geometryType === appStrings.GEOMETRY_LINE_STRING) {
                        geometryFunction = measureDistGeom;
                    } else if (geometryType === appStrings.GEOMETRY_POLYGON) {
                        geometryFunction = measureAreaGeom;
                    }
                }
                let drawStyle = interactionType === appStrings.INTERACTION_MEASURE ? this.defaultMeasureStyle : this.defaultGeometryStyle;
                let drawInteraction = new Ol_Interaction_Draw({
                    source: mapLayer.getSource(),
                    type: geometryType,
                    geometryFunction: geometryFunction,
                    style: drawStyle,
                    wrapX: true
                });

                if (appConfig.DEFAULT_MAP_EXTENT) {
                    // Override creation of overlay_ so we can pass in an extent
                    // since OL doesn't let you do this via options
                    drawInteraction.overlay_ = new Ol_Layer_Vector({
                        extent: appConfig.DEFAULT_MAP_EXTENT,
                        source: new Ol_Source_Vector({
                            useSpatialIndex: false,
                            wrapX: true
                        }),
                        style: drawStyle
                    });
                }

                // Set callback
                drawInteraction.on('drawend', (event) => {
                    if (typeof onDrawEnd === "function") {
                        // store type of feature and id for later reference
                        let geometry = this.retrieveGeometryFromEvent(event, geometryType);
                        event.feature.set("interactionType", interactionType);
                        event.feature.setId(geometry.id);
                        onDrawEnd(geometry, event);
                    }
                });

                // Disable
                drawInteraction.setActive(false);

                // Set properties we'll need
                drawInteraction.set('_id', interactionType + geometryType);
                drawInteraction.set(interactionType, true);

                // Add to map
                this.map.addInteraction(drawInteraction);
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.addDrawHandler:", err);
            return false;
        }
    }

    retrieveGeometryFromEvent(event, geometryType) {
        if (geometryType === appStrings.GEOMETRY_CIRCLE) {
            let center = event.feature.getGeometry().getCenter();
            return {
                type: appStrings.GEOMETRY_CIRCLE,
                id: Math.random(),
                center: { lon: center[0], lat: center[1] },
                radius: event.feature.getGeometry().getRadius(),
                proj: this.map.getView().getProjection().getCode(),
                coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC
            };
        } else if (geometryType === appStrings.GEOMETRY_LINE_STRING) {
            let tmpCoords = [];
            if (event.feature.getGeometry().get("originalCoordinates")) {
                tmpCoords = event.feature.getGeometry().get("originalCoordinates").map(x => {
                    return { lon: x[0], lat: x[1] };
                });
            } else {
                tmpCoords = event.feature.getGeometry().getCoordinates().map(x => {
                    return { lon: x[0], lat: x[1] };
                });
            }
            return {
                type: appStrings.GEOMETRY_LINE_STRING,
                id: Math.random(),
                proj: this.map.getView().getProjection().getCode(),
                coordinates: tmpCoords,
                coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC
            };
        } else if (geometryType === appStrings.GEOMETRY_POLYGON) {
            let tmpCoords = [];
            if (event.feature.getGeometry().get("originalCoordinates")) {
                tmpCoords = event.feature.getGeometry().get("originalCoordinates").map(x => {
                    return { lon: x[0], lat: x[1] };
                });
            } else {
                tmpCoords = event.feature.getGeometry().getCoordinates()[0].map(x => {
                    return { lon: x[0], lat: x[1] };
                });
            }
            return {
                type: appStrings.GEOMETRY_POLYGON,
                id: Math.random(),
                proj: this.map.getView().getProjection().getCode(),
                coordinates: tmpCoords,
                coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC
            };
        }

        return false;
    }

    setScaleUnits(units) {
        try {
            // Set scalebar units
            let controls = this.map.getControls();
            controls.forEach((el, index, arr) => {
                if (typeof el.setUnits === "function") {
                    el.setUnits(units);
                }
            });
            // Set measurement units
            this.map.getOverlays().forEach(overlay => {
                if (overlay.get("measurementType") === appStrings.MEASURE_AREA) {
                    overlay.getElement().innerHTML = this.mapUtil.formatArea(this.mapUtil.convertAreaUnits(overlay.get("meters"), units), units);
                } else if (overlay.get("measurementType") === appStrings.MEASURE_DISTANCE) {
                    overlay.getElement().innerHTML = this.mapUtil.formatDistance(this.mapUtil.convertDistanceUnits(overlay.get("meters"), units), units);
                } else {
                    console.warn("could not set openlayers scale units.");
                    return false;
                }
            });
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.setScaleUnits:", err);
            return false;
        }
    }

    addLayer(mapLayer) {
        try {
            let index = this.findTopInsertIndexForLayer(mapLayer);
            this.map.getLayers().insertAt(index, mapLayer);
            this.layerCache.set(mapLayer.get("_layerCacheHash"), mapLayer);
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.addLayer:", err);
            return false;
        }
    }

    removeLayer(mapLayer) {
        try {
            this.map.removeLayer(mapLayer);
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.removeLayer:", err);
            return false;
        }
    }

    replaceLayer(mapLayer, index) {
        try {
            this.map.getLayers().setAt(index, mapLayer);
            this.layerCache.set(mapLayer.get("_layerCacheHash"), mapLayer);
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.replaceLayer:", err);
            return false;
        }
    }

    activateLayer(layer) {
        try {
            let mapLayers = this.map.getLayers().getArray();

            // check if layer already exists on map, just move to top
            let mapLayer = this.miscUtil.findObjectInArray(mapLayers, "_layerId", layer.get("id"));
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

            // layer creation succeeded, add and set visible
            this.addLayer(mapLayer);
            mapLayer.setVisible(true);
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.activateLayer:", err);
            return false;
        }
    }

    deactivateLayer(layer) {
        try {
            // find the layer on the map
            let mapLayers = this.map.getLayers().getArray();
            let mapLayer = this.miscUtil.findObjectInArray(mapLayers, "_layerId", layer.get("id"));

            // remove the layer
            if (mapLayer) {
                return this.removeLayer(mapLayer);
            }

            // Layer is already not active
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.deactivateLayer:", err);
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
            let mapLayer = this.miscUtil.findObjectInArray(mapLayers, "_layerId", layer.get("id"));
            if (mapLayer) {
                mapLayer.setOpacity(opacity);
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.setLayerOpacity:", err);
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
                if (mapLayers.getLength() > 0 && mapLayers.item(0).get("_layerType") === appStrings.LAYER_GROUP_TYPE_BASEMAP) {
                    mapLayers.setAt(0, newBasemap);
                } else {
                    mapLayers.insertAt(0, newBasemap);
                }
                newBasemap.setVisible(true);
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.setBasemap:", err);
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
            console.warn("Error in MapWrapper_openlayers.hideBasemap:", err);
            return false;
        }
    }

    addEventListener(eventStr, callback) {
        try {
            switch (eventStr) {
                case appStrings.EVENT_MOUSE_HOVER:
                    return this.map.addEventListener("pointermove", (position) => {
                        callback(position.pixel);
                    });
                case appStrings.EVENT_MOUSE_CLICK:
                    return this.map.addEventListener("click", (clickEvt) => {
                        callback({ pixel: clickEvt.pixel });
                    });
                case appStrings.EVENT_MOVE_END:
                    return this.map.addEventListener("moveend", callback);
                default:
                    return this.map.addEventListener(eventStr, callback);
            }
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.addEventListener:", err);
            return false;
        }
    }


    getZoom() {
        try {
            return this.map.getView().getZoom();
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.getZoom:", err);
            return false;
        }
    }

    getProjection() {
        try {
            return this.map.getView().getProjection().getCode();
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.getProjection:", err);
            return false;
        }
    }

    updateLayer(layer) {
        try {
            let mapLayers = this.map.getLayers().getArray();
            let mapLayerWithIndex = this.miscUtil.findObjectWithIndexInArray(mapLayers, "_layerId", layer.get("id"));
            if (mapLayerWithIndex) {
                let mapLayer = this.createLayer(layer);
                this.replaceLayer(mapLayer, mapLayerWithIndex.index);
            }
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.updateLayer:", err);
            return false;
        }
    }

    getLatLonFromPixelCoordinate(pixel) {
        try {
            let coordinate = this.map.getCoordinateFromPixel(pixel);
            let constrainCoordinate = this.mapUtil.constrainCoordinates(coordinate);
            if (typeof constrainCoordinate[0] !== "undefined" &&
                typeof constrainCoordinate[1] !== "undefined" &&
                !isNaN(constrainCoordinate[0]) &&
                !isNaN(constrainCoordinate[0])) {
                return {
                    lat: constrainCoordinate[0],
                    lon: constrainCoordinate[1],
                    isValid: coordinate[1] <= 90 && coordinate[1] >= -90
                };
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.getLatLonFromPixelCoordinate:", err);
            return false;
        }
    }

    moveLayerToTop(layer) {
        try {
            let mapLayers = this.map.getLayers();
            let mapLayerWithIndex = this.miscUtil.findObjectWithIndexInArray(mapLayers.getArray(), "_layerId", layer.get("id"));
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
            console.warn("Error in MapWrapper_openlayers.moveLayerToTop:", err);
            return false;
        }
    }

    moveLayerToBottom(layer) {
        try {
            let mapLayers = this.map.getLayers();
            let mapLayerWithIndex = this.miscUtil.findObjectWithIndexInArray(mapLayers.getArray(), "_layerId", layer.get("id"));
            if (mapLayerWithIndex) {
                let mapLayer = mapLayerWithIndex.value;
                let currIndex = mapLayerWithIndex.index;
                mapLayers.removeAt(currIndex);
                mapLayers.insertAt(1, mapLayer); // index 1 because we always have a basemap. TODO - verify
                return true;
            }
            return false;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.moveLayerToBottom:", err);
            return false;
        }
    }

    moveLayerUp(layer) {
        try {
            let mapLayers = this.map.getLayers();
            let mapLayerWithIndex = this.miscUtil.findObjectWithIndexInArray(mapLayers.getArray(), "_layerId", layer.get("id"));
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
            console.warn("Error in MapWrapper_openlayers.moveLayerUp:", err);
            return false;
        }
    }

    moveLayerDown(layer) {
        try {
            let mapLayers = this.map.getLayers();
            let mapLayerWithIndex = this.miscUtil.findObjectWithIndexInArray(mapLayers.getArray(), "_layerId", layer.get("id"));
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
            console.warn("Error in MapWrapper_openlayers.moveLayerDown:", err);
            return false;
        }
    }

    getActiveLayerIds() {
        try {
            let retList = [];
            let mapLayers = this.map.getLayers();
            mapLayers.forEach((mapLayer) => {
                if (mapLayer.get("_layerType") === appStrings.LAYER_GROUP_TYPE_DATA && mapLayer.getVisible()) {
                    retList.push(mapLayer.get("_layerId"));
                }
            });
            return retList;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.getActiveLayerIds:", err);
            return false;
        }
    }

    getPixelFromClickEvent(clickEvt) {
        try {
            return clickEvt.pixel;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.getPixelFromClickEvent:", err);
            return false;
        }
    }

    clearCache() {
        try {
            this.layerCache.clear();
            return true;
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.clearCache:", err);
            return false;
        }
    }

    /* functions for openlayers only */
    generateTileUrl(layer, mapLayer, layerSource, tileCoord, pixelRatio, projectionString, origFunc) {
        try {
            let origUrl = layer.getIn(["wmtsOptions", "url"]);
            let customUrlFunction = this.tileHandler.getUrlFunction(layer.getIn(["wmtsOptions", "urlFunctions", appStrings.MAP_LIB_2D]));
            let tileMatrixIds = typeof layerSource.getTileGrid === "function" &&
                typeof layerSource.getTileGrid().getMatrixIds === "function" ? layerSource.getTileGrid().getMatrixIds() : [];
            if (typeof customUrlFunction === "function") {
                return customUrlFunction.call(this.tileHandler, {
                    layer,
                    mapLayer,
                    origUrl,
                    tileCoord,
                    tileMatrixIds,
                    pixelRatio,
                    projectionString,
                    context: appStrings.MAP_LIB_2D
                });
            }
            return origFunc(tileCoord, pixelRatio, projectionString);
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.generateTileUrl:", err);
            return false;
        }
    }

    handleTileLoad(layer, mapLayer, tile, url, origFunc) {
        try {
            let customTileFunction = this.tileHandler.getTileFunction(layer.getIn(["wmtsOptions", "tileFunctions", appStrings.MAP_LIB_2D]));
            if (typeof customTileFunction === "function") {
                return customTileFunction.call(this.tileHandler, {
                    layer,
                    mapLayer,
                    tile,
                    url,
                    defaultFunc: () => { return origFunc(tile, url); }
                });
            }
            return origFunc(tile, url);
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.handleTileLoad:", err);
            return false;
        }
    }
    createLayerSource(layer, options) {
        switch (layer.get("handleAs")) {
            case appStrings.LAYER_GIBS_RASTER:
                return this.createGIBSWMTSSource(layer, options);
            case appStrings.LAYER_WMTS_RASTER:
                return this.createWMTSSource(layer, options);
            case appStrings.LAYER_XYZ_RASTER:
                return this.createXYZSource(layer, options);
            case appStrings.LAYER_VECTOR_GEOJSON:
                return this.createVectorGeojsonSource(layer, options);
            case appStrings.LAYER_VECTOR_TOPOJSON:
                return this.createVectorTopojsonSource(layer, options);
            case appStrings.LAYER_VECTOR_KML:
                return this.createVectorKMLSource(layer, options);
            case appStrings.LAYER_VECTOR_DRAWING:
                return this.createVectorDrawingSource(layer, options);
            default:
                console.warn("Error in MapWrapper_openlayers.createLayerSource: unknonw layer type - ", layer.get("handleAs"));
                return false;
        }
    }

    createWMTSSource(layer, options) {
        return new Ol_Source_WMTS({
            url: options.url,
            layer: options.layer,
            format: options.format,
            requestEncoding: options.requestEncoding,
            matrixSet: options.matrixSet,
            projection: options.projection,
            tileGrid: new Ol_Tilegrid_WMTS({
                extent: options.extents,
                origin: options.tileGrid.origin,
                resolutions: options.tileGrid.resolutions,
                matrixIds: options.tileGrid.matrixIds,
                tileSize: options.tileGrid.tileSize
            }),
            wrapX: true
        });
    }

    createGIBSWMTSSource(layer, options) {
        return new Ol_Source_WMTS({
            url: options.url,
            layer: options.layer,
            format: options.format,
            requestEncoding: options.requestEncoding,
            matrixSet: options.matrixSet,
            projection: options.projection,
            tileGrid: new Ol_Tilegrid_WMTS({
                extent: options.extents,
                origin: options.tileGrid.origin,
                resolutions: options.tileGrid.resolutions.slice(2, appConfig.GIBS_IMAGERY_RESOLUTIONS.length),
                // resolutions: options.tileGrid.resolutions,
                matrixIds: options.tileGrid.matrixIds.slice(2, options.tileGrid.matrixIds.length),
                // matrixIds: options.tileGrid.matrixIds,
                tileSize: options.tileGrid.tileSize
            }),
            wrapX: true
        });
    }

    createXYZSource(layer, options) {
        return new Ol_Source_XYZ({
            url: options.url,
            projection: options.projection,
            maxZoom: options.tileGrid.maxZoom,
            minZoom: options.tileGrid.minZoom,
            tileSize: options.tileGrid.tileSize,
            wrapX: true
        });
    }

    createVectorGeojsonSource(layer, options) {
        // customize the layer url if needed
        if (typeof options.url !== "undefined" && typeof layer.getIn(["urlFunctions", appStrings.MAP_LIB_2D]) !== "undefined") {
            let urlFunction = this.tileHandler.getUrlFunction(layer.getIn(["urlFunctions", appStrings.MAP_LIB_2D]));
            options.url = urlFunction.call(this.tileHandler, {
                layer: layer,
                url: options.url
            });
        }

        return new Ol_Source_Vector({
            url: options.url,
            format: new Ol_Format_GeoJSON()
        });
    }

    createVectorTopojsonSource(layer, options) {
        // customize the layer url if needed
        if (typeof options.url !== "undefined" && typeof layer.getIn(["urlFunctions", appStrings.MAP_LIB_2D]) !== "undefined") {
            let urlFunction = this.tileHandler.getUrlFunction(layer.getIn(["urlFunctions", appStrings.MAP_LIB_2D]));
            options.url = urlFunction.call(this.tileHandler, {
                layer: layer,
                url: options.url
            });
        }

        return new Ol_Source_Vector({
            url: options.url,
            format: new Ol_Format_TopoJSON()
        });
    }

    createVectorKMLSource(layer, options) {
        // customize the layer url if needed
        if (typeof options.url !== "undefined" && typeof layer.getIn(["urlFunctions", appStrings.MAP_LIB_2D]) !== "undefined") {
            let urlFunction = this.tileHandler.getUrlFunction(layer.getIn(["urlFunctions", appStrings.MAP_LIB_2D]));
            options.url = urlFunction.call(this.tileHandler, {
                layer: layer,
                url: options.url
            });
        }

        return new Ol_Source_Vector({
            url: options.url,
            format: new Ol_Format_KML()
        });
    }

    createVectorDrawingSource(options) {
        return new Ol_Source_Vector({
            wrapX: false
        });
    }

    findTopInsertIndexForLayer(mapLayer) {
        let mapLayers = this.map.getLayers();
        let index = mapLayers.getLength();

        if (mapLayer.get("_layerType") === appStrings.LAYER_GROUP_TYPE_REFERENCE) { // referece layers always on top
            return index;
        } else if (mapLayer.get("_layerType") === appStrings.LAYER_GROUP_TYPE_BASEMAP) { // basemaps always on bottom
            return 0;
        } else { // data layers in the middle
            for (let i = index - 1; i >= 0; --i) {
                let compareLayer = mapLayers.item(i);
                if (compareLayer.get("_layerType") === appStrings.LAYER_GROUP_TYPE_DATA ||
                    compareLayer.get("_layerType") === appStrings.LAYER_GROUP_TYPE_BASEMAP) {
                    return i + 1;
                }
            }
            index = 0;
        }
        return index;
    }

    getCacheHash(layer) {
        return layer.get("id") + moment(this.mapDate).format(layer.get("timeFormat"));
    }

    static prepProjection() {
        // define the projection for this application and reproject defaults
        Ol_Proj.setProj4(proj4js);
        proj4js.defs(appConfig.DEFAULT_PROJECTION.code, appConfig.DEFAULT_PROJECTION.proj4Def);

        // Ol3 doesn't properly handle the "urn:ogc:def:crs:OGC:1.3:CRS84"
        // string in getCapabilities and parses it into "OGC:CRS84". This
        // hopefully adds that as an equivalent projection
        let epsg4326Proj = Ol_Proj.get('EPSG:4326');
        let ogcCrs84Proj = new Ol_Proj_Projection({
            code: 'OGC:CRS84',
            units: epsg4326Proj.getUnits(),
            extent: epsg4326Proj.getExtent(),
            global: epsg4326Proj.isGlobal(),
            metersPerUnit: epsg4326Proj.getMetersPerUnit(),
            worldExtent: epsg4326Proj.getWorldExtent(),
            getPointResolution: function(res, point) {
                return Ol_Proj.getPointResolution('EPSG:4326', res, point);
            }

        });
        Ol_Proj.addProjection(ogcCrs84Proj);
        Ol_Proj.addEquivalentProjections([ogcCrs84Proj, epsg4326Proj]);

        let mapProjection = Ol_Proj.get(appConfig.DEFAULT_PROJECTION.code);
        mapProjection.setExtent(appConfig.DEFAULT_PROJECTION.extent);

        return mapProjection;
    }

    static parseCapabilities(xmlString) {
        try {
            let parser = new Ol_Format_WMTSCapabilities();
            return parser.read(xmlString);
        } catch (err) {
            console.warn("Error in MapWrapper_openlayers.parseCapabilities:", err);
            return false;
        }
    }


    static getWmtsOptions(options) {
        try {
            let parseOptions = Ol_Source_WMTS.optionsFromCapabilities(options.capabilities, options.options);
            return {
                url: parseOptions.urls[0],
                layer: options.options.layer,
                format: parseOptions.format,
                requestEncoding: parseOptions.requestEncoding,
                matrixSet: parseOptions.matrixSet,
                projection: parseOptions.projection.getCode(),
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
            console.warn("Error in MapWrapper_openlayers.getWmtsOptions:", err);
            return false;
        }
    }
}
