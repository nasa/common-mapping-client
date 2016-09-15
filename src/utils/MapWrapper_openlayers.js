import Immutable from 'immutable';
import ol from 'openlayers';
import proj4js from 'proj4';
import arc from '../lib/arc/arc';
// let arc = require('arc');
// let Arc = window.arc;
import * as mapStrings from '../constants/mapStrings';
import * as mapConfig from '../constants/mapConfig';
import MapWrapper from './MapWrapper';
import MiscUtil from './MiscUtil';
import MapUtil from './MapUtil';
import Cache from './Cache';

export default class MapWrapper_openlayers extends MapWrapper {
    constructor(container, options) {
        super(container, options);
        this.is3D = false;
        this.isActive = !options.getIn(["view", "in3DMode"]);
        this.layerCache = new Cache(50); // TODO - move this number into a config?
        this.cachedGeometry = null;
        this.defaultGeometryStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: mapConfig.GEOMETRY_FILL_COLOR
            }),
            stroke: new ol.style.Stroke({
                color: mapConfig.GEOMETRY_STROKE_COLOR,
                width: mapConfig.GEOMETRY_STROKE_WEIGHT
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        });
        this.defaultMeasureStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: mapConfig.MEASURE_FILL_COLOR
            }),
            stroke: new ol.style.Stroke({
                color: mapConfig.MEASURE_STROKE_COLOR,
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 255, 255, 0.75)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.5)'
                })
            })
        });
        this.map = this.createMap(container, options);
    }

    createMap(container, options) {
        try {
            // create default draw layer
            let vectorSource = new ol.source.Vector({ wrapX: true });
            let vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: this.defaultGeometryStyle
            });
            vectorLayer.set("_layerId", "_vector_drawings");
            vectorLayer.set("_layerType", mapStrings.LAYER_GROUP_TYPE_REFERENCE);


            // get the view options for the map
            let viewOptions = options.get("view").toJS();

            let mapProjection = ol.proj.get(mapConfig.DEFAULT_PROJECTION.code);

            let center = viewOptions.center;

            return new ol.Map({
                target: container,
                renderer: ['canvas', 'dom'],
                layers: [vectorLayer],
                view: new ol.View({
                    zoom: viewOptions.zoom,
                    maxZoom: viewOptions.maxZoom,
                    minZoom: viewOptions.minZoom,
                    center: center,
                    projection: mapProjection
                }),
                controls: [
                    new ol.control.ScaleLine({
                        className: "map-scale-container"
                    })
                ],
                interactions: ol.interaction.defaults({
                    altShiftDragRotate: false,
                    pinchRotate: false,
                    shiftDragZoom: false,
                    keyboard: false
                })
            });
        } catch (err) {
            console.warn("could not create openlayers map.", err);
            return false;
        }
    }

    getMapSize() {
        let size = this.map.getSize();
        if (!size) {
            return { width: 0, height: 0 };
        } else {
            return { width: size[0], height: size[1] };
        }
    }

    resize() {
        this.map.updateSize();
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
            mapLayer.set("_layerId", layer.get("id"));
            mapLayer.set("_layerCacheHash", layer.get("id") + layer.get("time"));
            mapLayer.set("_layerType", layer.get("type"));
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
                layerSource.setTileUrlFunction((tileCoord, pixelRatio, projectionString) => {
                    return this.generateTileUrl(layer, layerSource, tileCoord, pixelRatio, projectionString, origTileUrlFunc);
                });
                layerSource.setTileLoadFunction((tile, url) => {
                    return this.handleTileLoad(layer, tile, url, origTileLoadFunc);
                });

                // set up wrap around extents
                let mapProjExtent = this.map.getView().getProjection().getExtent();
                return new ol.layer.Tile({
                    opacity: layer.get("opacity"),
                    visible: layer.get("isActive"),
                    crossOrigin: "anonymous",
                    // extent: mapProjExtent,
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
            if (layer.get("clusterVector")) {
                layerSource = new ol.source.Cluster({ source: layerSource });
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
            let mapSize = this.map.getSize() || [];
            this.map.getView().fit(extent, mapSize);
            return true;
        } catch (err) {
            console.warn("could not set openlayers extent.", err);
            return false;
        }
    }

    getExtent() {
        return this.map.getView().calculateExtent(this.map.getSize());
    }

    zoomIn(duration = 175) {
        try {
            if (typeof this.map !== "undefined" &&
                typeof this.map.getView() !== "undefined") {
                this.map.beforeRender(ol.animation.zoom({
                    resolution: this.map.getView().getResolution(),
                    duration: duration
                }));
                this.map.getView().setZoom(this.map.getView().getZoom() + 1);
                return true;
            }
        } catch (err) {
            console.warn("could not zoom openlayers map.", err);
            return false;
        }
    }
    zoomOut(duration = 175) {
        try {
            if (typeof this.map !== "undefined" &&
                typeof this.map.getView() !== "undefined") {
                this.map.beforeRender(ol.animation.zoom({
                    resolution: this.map.getView().getResolution(),
                    duration: duration
                }));
                this.map.getView().setZoom(this.map.getView().getZoom() - 1);
                return true;
            }
        } catch (err) {
            console.warn("could not zoom openlayers map.", err);
            return false;
        }
    }

    enableDrawing(geometryType) {
        try {
            // remove double-click zoom while drawing so we can double-click complete
            this.setDoubleClickZoomEnabled(false);

            // Get drawHandler by geometryType
            let drawInteraction = MiscUtil.findObjectInArray(this.map.getInteractions().getArray(), "_id", mapStrings.INTERACTION_DRAW + geometryType);
            if (drawInteraction) {
                // Call setActive(true) on handler to enable
                drawInteraction.setActive(true);
                // Check that handler is active
                return drawInteraction.getActive();
            }
            console.warn("could not enable openlayers drawing for:", geometryType);
            return false;
        } catch (err) {
            console.warn("could not enable drawing on openlayers map.", err);
            return false;
        }
    }

    disableDrawing(delayDblClickEnable = true) {
        try {
            // Call setActive(false) on all handlers
            let drawInteractions = MiscUtil.findAllMatchingObjectsInArray(this.map.getInteractions().getArray(), mapStrings.INTERACTION_DRAW, true);
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
            console.warn("could not disable drawing on openlayers map.", err);
            return false;
        }
    }

    completeDrawing() {
        try {
            let drawInteractions = MiscUtil.findAllMatchingObjectsInArray(this.map.getInteractions().getArray(), mapStrings.INTERACTION_DRAW, true);
            drawInteractions.map((handler) => {
                if (handler.getActive()) {
                    handler.finishDrawing();
                }
            });
            return true;
        } catch (err) {
            console.warn("could not complete drawing on openlayers map.", err);
            return false;
        }
    }

    enableMeasuring(geometryType, measurementType) {
        try {
            // remove double-click zoom while drawing so we can double-click complete
            this.setDoubleClickZoomEnabled(false);

            // Get drawHandler by geometryType
            let interaction = MiscUtil.findObjectInArray(this.map.getInteractions().getArray(), "_id", mapStrings.INTERACTION_MEASURE + geometryType);
            if (interaction) {
                // Call setActive(true) on handler to enable
                interaction.setActive(true);
                // Check that handler is active
                return interaction.getActive();
            }
            console.warn("could not enable openlayers measuring for:", geometryType, measurementType);
            return false;
        } catch (err) {
            console.warn("could not enable measuring on openlayers map.", err);
            return false;
        }
    }

    disableMeasuring(delayDblClickEnable = true) {
        try {
            // Call setActive(false) on all handlers
            let measureInteractions = MiscUtil.findAllMatchingObjectsInArray(this.map.getInteractions().getArray(), mapStrings.INTERACTION_MEASURE, true);
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
            console.warn("could not disable measuring on openlayers map.", err);
        }
    }

    completeMeasuring() {
        try {
            let measureInteractions = MiscUtil.findAllMatchingObjectsInArray(this.map.getInteractions().getArray(), mapStrings.INTERACTION_MEASURE, true);
            measureInteractions.map((handler) => {
                if (handler.getActive()) {
                    handler.finishDrawing();
                }
            });
            return true;
        } catch (err) {
            console.warn("could not disable measuring on openlayers map.", err);
        }
    }

    setDoubleClickZoomEnabled(enabled) {
        try {
            let dblClickInteraction = MiscUtil.findObjectInArray(this.map.getInteractions().getArray(), (interaction) => {
                return interaction instanceof ol.interaction.DoubleClickZoom;
            });
            if (dblClickInteraction) {
                dblClickInteraction.setActive(enabled);
            }
        } catch (err) {
            console.warn("could not enable double click zoom in openlayers", err);
            return false;
        }
    }

    enableActiveListeners(active) {
        return false;
    }

    addGeometry(geometry, interactionType) {
        let mapLayers = this.map.getLayers().getArray();
        let mapLayer = MiscUtil.findObjectInArray(mapLayers, "_layerId", "_vector_drawings");
        if (!mapLayer) {
            console.warn("could not find drawing layer in openlayers map");
            return false;
        }
        if (geometry.type === mapStrings.GEOMETRY_CIRCLE) {
            let circleGeom = null;
            if (geometry.coordinateType === mapStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                circleGeom = new ol.geom.Circle([geometry.center.lon, geometry.center.lat], geometry.radius / ol.proj.METERS_PER_UNIT[this.map.getView().getProjection().getUnits()]);
            } else {
                console.warn("Unsupported geometry coordinateType ", geometry.coordinateType, " for openlayers circle");
                return false;
            }
            let circleFeature = new ol.Feature({
                geometry: circleGeom
            });
            circleFeature.set("interactionType", interactionType);
            circleFeature.setId(geometry.id);
            mapLayer.getSource().addFeature(circleFeature);
            return true;
        }
        if (geometry.type === mapStrings.GEOMETRY_LINE_STRING) {
            let lineStringGeom = null;
            if (geometry.coordinateType === mapStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                lineStringGeom = new ol.geom.LineString(geometry.coordinates.map((x) => {
                    return [x.lon, x.lat];
                }));
            } else {
                console.warn("Unsupported geometry coordinateType ", geometry.coordinateType, " for openlayers lineString");
                return false;
            }
            let lineStringFeature = new ol.Feature({
                geometry: lineStringGeom
            });
            lineStringFeature.set("interactionType", interactionType);
            lineStringFeature.setId(geometry.id);
            mapLayer.getSource().addFeature(lineStringFeature);
            return true;
        }
        if (geometry.type === mapStrings.GEOMETRY_POLYGON) {
            let polygonGeom = null;
            if (geometry.coordinateType === mapStrings.COORDINATE_TYPE_CARTOGRAPHIC) {
                // Map obj to array
                let newCoords = geometry.coordinates.map((x) => {
                    return [x.lon, x.lat];
                });
                // Push the first point to close the ring
                newCoords.push([geometry.coordinates[0].lon, geometry.coordinates[0].lat]);
                // Put these coordinates into a ring by adding to array
                polygonGeom = new ol.geom.Polygon([newCoords]);
            } else {
                console.warn("Unsupported geometry coordinateType ", geometry.coordinateType, " for openlayers polygon");
                return false;
            }
            let polygonFeature = new ol.Feature({
                geometry: polygonGeom
            });
            polygonFeature.set("interactionType", interactionType);
            polygonFeature.setId(geometry.id);
            mapLayer.getSource().addFeature(polygonFeature);
            return true;
        }
        return false;
    }

    addMeasurementLabelToGeometry(geometry, measurementType, units) {
        // Create label
        let measureLabelEl = document.createElement('div');
        measureLabelEl.className = "tooltip tooltip-static";
        let measureLabel = new ol.Overlay({
            element: measureLabelEl,
            offset: [0, -15],
            positioning: 'bottom-center'
        });

        // Set label according to geometry type and measurement type
        if (measurementType === mapStrings.MEASURE_DISTANCE) {
            if (geometry.type === mapStrings.GEOMETRY_LINE_STRING) {
                let coords = geometry.coordinates.map(x => [x.lon, x.lat]);
                measureLabel.setPosition(coords.length > 1 ? coords[coords.length - 1] : coords[0]);

                // Get distance
                let distance = MapUtil.calculatePolylineDistance(coords, geometry.proj);

                // Format distance
                let formattedDistance = MapUtil.formatDistance(distance, units);

                // let output = "";
                // if (distance > 100) {
                //     output = (Math.round(distance / 1000 * 100) / 100) + ' ' + 'km';
                // } else {
                //     output = (Math.round(distance * 100) / 100) + ' ' + 'm';
                // }
                measureLabelEl.innerHTML = formattedDistance;
                // measureLabel._measurement = new Qty(distance, MiscUtil.findObjectInArray(mapConfig.SCALE_OPTIONS, 'value', units).qtyType);
                measureLabel._meters = distance;
                measureLabel._measurementType = mapStrings.MEASURE_DISTANCE;
                // measureLabel._units = units;
            } else {
                console.warn("could not add distance measurement label to geometry in openlayers map, unsupported geometry type ", geometry.type);
                return false;
            }
        } else if (measurementType === mapStrings.MEASURE_AREA) {
            if (geometry.type === mapStrings.GEOMETRY_POLYGON) {
                let coords = geometry.coordinates.map(x => [x.lon, x.lat]);
                let polygonCenter = MapUtil.calculatePolygonCenter(coords, geometry.proj);
                measureLabel.setPosition(polygonCenter);
                let area = MapUtil.calculatePolygonArea(coords, geometry.proj);

                // Format area
                let formattedArea = MapUtil.formatArea(area, units);
                measureLabelEl.innerHTML = formattedArea;
                // measureLabel._measurement = area;
                // measureLabel._meters = new Qty(area, MiscUtil.findObjectInArray(mapConfig.SCALE_OPTIONS, 'value', units).qtyType + "^2");
                measureLabel._meters = area;
                measureLabel._measurementType = mapStrings.MEASURE_AREA;
                // measureLabel._units = units;
            } else {
                console.warn("could not add area measurement label to geometry in openlayers map, unsupported geometry type ", geometry.type);
                return false;
            }
        } else {
            console.warn("could not add measurement label to geometry in openlayers map, unsupported measurementType ", measurementType);
            return false;
        }
        this.map.addOverlay(measureLabel);
        return true;
    }

    removeAllDrawings() {
        let mapLayers = this.map.getLayers().getArray();
        let mapLayer = MiscUtil.findObjectInArray(mapLayers, "_layerId", "_vector_drawings");
        if (!mapLayer) {
            console.warn("could not remove all geometries in openlayers map");
            return false;
        }
        // Remove geometries
        let mapLayerFeatures = mapLayer.getSource().getFeatures();
        let featuresToRemove = mapLayerFeatures.filter(x => x.get('interactionType') === mapStrings.INTERACTION_DRAW);
        for (let i = 0; i < featuresToRemove.length; i++) {
            mapLayer.getSource().removeFeature(featuresToRemove[i]);
        }
        return mapLayer.getSource().getFeatures().filter(x => x.get('interactionType') === mapStrings.INTERACTION_DRAW).length === 0;
    }

    removeAllMeasurements() {
        let mapLayers = this.map.getLayers().getArray();
        let mapLayer = MiscUtil.findObjectInArray(mapLayers, "_layerId", "_vector_drawings");
        if (!mapLayer) {
            console.warn("could not remove all geometries in openlayers map");
            return false;
        }
        // Remove geometries
        let mapLayerFeatures = mapLayer.getSource().getFeatures();
        let featuresToRemove = mapLayerFeatures.filter(x => x.get('interactionType') === mapStrings.INTERACTION_MEASURE);
        for (let i = 0; i < featuresToRemove.length; i++) {
            mapLayer.getSource().removeFeature(featuresToRemove[i]);
        }
        // Remove overlays
        this.map.getOverlays().clear();
        return mapLayer.getSource().getFeatures().filter(x => x.get('interactionType') === mapStrings.INTERACTION_MEASURE).length === 0 && this.map.getOverlays().getArray().length === 0;
    }

    resetOrientation(duration) {
        return true;
    }

    addDrawHandler(geometryType, onDrawEnd, interactionType) {
        try {
            let mapLayers = this.map.getLayers().getArray();
            let mapLayer = MiscUtil.findObjectInArray(mapLayers, "_layerId", "_vector_drawings");
            if (mapLayer) {
                let measureDistGeom = (coords, opt_geom) => {
                    let geom = opt_geom ? opt_geom : new ol.geom.LineString();
                    let lineCoords = this.generateGeodesicArcsForLineString(coords);
                    geom.setCoordinates(lineCoords);
                    return geom;
                };
                let measureAreaGeom = (coords, opt_geom) => {
                    coords = coords[0]; // TODO: find case where this isn't what we want
                    let geom = opt_geom ? opt_geom : new ol.geom.Polygon();
                    let lineCoords = this.generateGeodesicArcsForLineString(coords);
                    geom.setCoordinates([lineCoords]);
                    return geom;
                };

                let geometryFunction = undefined;
                if (interactionType === mapStrings.INTERACTION_MEASURE) {
                    if (geometryType === mapStrings.GEOMETRY_LINE_STRING) {
                        geometryFunction = measureDistGeom;
                    } else if (geometryType === mapStrings.GEOMETRY_POLYGON) {
                        geometryFunction = measureAreaGeom;
                    }
                }
                let drawInteraction = new ol.interaction.Draw({
                    source: mapLayer.getSource(),
                    type: geometryType,
                    geometryFunction: geometryFunction,
                    style: interactionType === mapStrings.INTERACTION_MEASURE ? this.defaultMeasureStyle : this.defaultGeometryStyle,
                    wrapX: true
                });

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
            } else {
                console.warn("could not enable drawing in openlayers map");
                return false;
            }
        } catch (err) {
            console.warn("could not enable drawing in openlayers map", err);
            return false;
        }
    }

    retrieveGeometryFromEvent(event, geometryType) {
        if (geometryType === mapStrings.GEOMETRY_CIRCLE) {
            let center = event.feature.getGeometry().getCenter();
            return {
                type: mapStrings.GEOMETRY_CIRCLE,
                id: Math.random(),
                center: { lon: center[0], lat: center[1] },
                radius: event.feature.getGeometry().getRadius(),
                proj: this.map.getView().getProjection().getCode(),
                coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
            };
        } else if (geometryType === mapStrings.GEOMETRY_LINE_STRING) {
            let tmpCoords = event.feature.getGeometry().getCoordinates()
                .map(x => {
                    return { lon: x[0], lat: x[1] };
                });
            return {
                type: mapStrings.GEOMETRY_LINE_STRING,
                id: Math.random(),
                proj: this.map.getView().getProjection().getCode(),
                coordinates: tmpCoords,
                coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
            };
        } else if (geometryType === mapStrings.GEOMETRY_POLYGON) {
            let tmpCoords = event.feature.getGeometry().getCoordinates()[0]
                .map(x => {
                    return { lon: x[0], lat: x[1] };
                });
            return {
                type: mapStrings.GEOMETRY_POLYGON,
                id: Math.random(),
                proj: this.map.getView().getProjection().getCode(),
                coordinates: tmpCoords,
                coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
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
                if (overlay._measurementType === mapStrings.MEASURE_AREA) {
                    overlay.getElement().innerHTML = MapUtil.formatArea(MapUtil.convertAreaUnits(overlay._meters, units), units);
                } else if (overlay._measurementType === mapStrings.MEASURE_DISTANCE) {
                    overlay.getElement().innerHTML = MapUtil.formatDistance(MapUtil.convertDistanceUnits(overlay._meters, units), units);
                } else {
                    console.warn("could not set openlayers scale units.");
                    return false;
                }
            })
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
            this.layerCache.set(mapLayer.get("_layerCacheHash"), mapLayer);
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
            this.layerCache.set(mapLayer.get("_layerCacheHash"), mapLayer);
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
                // mapLayer.setVisible(false);
                this.removeLayer(mapLayer);
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
                if (mapLayers.getLength() > 0 && mapLayers.item(0).get("_layerType") === mapStrings.LAYER_GROUP_TYPE_BASEMAP) {
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
                case mapStrings.EVENT_MOUSE_HOVER:
                    return this.map.addEventListener("pointermove", (position) => {
                        callback(position.pixel);
                    });
                case mapStrings.EVENT_MOUSE_CLICK:
                    return this.map.addEventListener("click", (clickEvt) => {
                        callback({ pixel: clickEvt.pixel });
                    });
                case mapStrings.EVENT_MOVE_END:
                    return this.map.addEventListener("moveend", callback);
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
                if (mapLayer.get("_layerType") === mapStrings.LAYER_GROUP_TYPE_DATA && mapLayer.getVisible()) {
                    retList.push(mapLayer.get("_layerId"));
                }
            });
            return retList;
        } catch (err) {
            console.warn("could not generate openlayers active layer list.", err);
            return false;
        }
    }

    getPixelFromClickEvent(clickEvt) {
        try {
            return clickEvt.pixel;
        } catch (err) {
            console.warn("could not retrieve pixel from openlayers click event.", err);
            return false;
        }
    }

    /* functions for openlayers only */
    generateGeodesicArcsForLineString(coords) {
        let lineCoords = [];
        for (let i = 0; i < coords.length - 1; ++i) {
            let start = coords[i];
            let end = coords[i + 1];

            // arc doesn't play well with two points in the same place
            if (start[0] === end[0] && start[1] === end[1]) {
                continue;
            }

            // generate the arcs
            let generator = new arc.GreatCircle({ x: start[0], y: start[1] }, { x: end[0], y: end[1] });
            let arcLines = generator.Arc(100, { offset: 180 }).geometries;

            // shift all the arcs as part of a polyline
            if (i >= 1 && lineCoords[lineCoords.length - 1][0] !== arcLines[0].coords[0][0]) {
                let initialShift = 1;
                if (lineCoords[lineCoords.length - 1][0] < 0) {
                    initialShift = -1;
                }
                arcLines = arcLines.map((arc) => {
                    let refCoord = arc.coords[0];
                    let shift = initialShift;
                    if (refCoord[0] <= 0) {
                        if (initialShift <= 0) {
                            shift = 0;
                        } else {
                            shift = initialShift;
                        }
                    } else {
                        if (initialShift <= 0) {
                            shift = initialShift
                        } else {
                            shift = 0;
                        }
                    }
                    return arc.coords.map((coord) => {
                        coord = coord.slice(0, coord.length);
                        coord[0] += (360 * shift);
                        return coord;
                    });
                });
            } else {
                arcLines = arcLines.map((arc) => {
                    return arc.coords;
                });
            }

            // wrap the arcs beyond [-180,180]
            let arcCoords = arcLines[0];
            if (arcLines.length >= 2) {
                arcCoords = MapUtil.deconstrainArcCoordinates(arcLines);
            }
            lineCoords = lineCoords.concat(arcCoords.slice(0, arcCoords.length));
        }
        return lineCoords;
    }

    generateTileUrl(layer, layerSource, tileCoord, pixelRatio, projectionString, origFunc) {
        try {
            let origUrl = layer.getIn(["wmtsOptions", "url"]);
            let customUrlFunction = MapUtil.getUrlFunction(layer.getIn(["wmtsOptions", "urlFunctions", mapStrings.MAP_LIB_2D]));
            let tileMatrixIds = typeof layerSource.getTileGrid === "function" &&
                typeof layerSource.getTileGrid().getMatrixIds === "function" ? layerSource.getTileGrid().getMatrixIds() : [];
            if (typeof customUrlFunction === "function") {
                return customUrlFunction({
                    layer,
                    origUrl,
                    tileCoord,
                    tileMatrixIds,
                    pixelRatio,
                    projectionString,
                    context: mapStrings.MAP_LIB_2D
                });
            }
            return origFunc(tileCoord, pixelRatio, projectionString);
        } catch (err) {
            console.warn("could not generate openlayers layer tile url.", err);
            return false;
        }
    }

    handleTileLoad(layer, tile, url, origFunc) {
        try {
            let customTileFunction = MapUtil.getTileFunction(layer.getIn(["wmtsOptions", "tileFunctions", mapStrings.MAP_LIB_2D]));
            let processedTile = origFunc(tile, url);
            if (typeof customTileFunction === "function") {
                return customTileFunction({
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
                return this.createGIBSWMTSSource(layer, options);
            case mapStrings.LAYER_WMTS:
                return this.createWMTSSource(layer, options);
            case mapStrings.LAYER_XYZ:
                return this.createXYZSource(layer, options);
            case mapStrings.LAYER_VECTOR_GEOJSON:
                return this.createVectorGeojsonSource(layer, options);
            case mapStrings.LAYER_VECTOR_TOPOJSON:
                return this.createVectorTopojsonSource(layer, options);
            case mapStrings.LAYER_VECTOR_KML:
                return this.createVectorKMLSource(layer, options);
            case mapStrings.LAYER_VECTOR_DRAWING:
                return this.createVectorDrawingSource(layer, options);
            default:
                return this.createXYZSource(layer, options);
        }
    }

    createWMTSSource(layer, options) {
        return new ol.source.WMTS({
            url: options.url,
            layer: options.layer,
            format: options.format,
            requestEncoding: options.requestEncoding,
            matrixSet: options.matrixSet,
            projection: options.projection,
            tileGrid: new ol.tilegrid.WMTS({
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
        return new ol.source.WMTS({
            url: options.url,
            layer: options.layer,
            format: options.format,
            requestEncoding: options.requestEncoding,
            matrixSet: options.matrixSet,
            projection: options.projection,
            tileGrid: new ol.tilegrid.WMTS({
                extent: options.extents,
                origin: options.tileGrid.origin,
                resolutions: options.tileGrid.resolutions.slice(2, options.tileGrid.resolutions.length),
                // resolutions: options.tileGrid.resolutions,
                matrixIds: options.tileGrid.matrixIds.slice(2, options.tileGrid.matrixIds.length),
                // matrixIds: options.tileGrid.matrixIds,
                tileSize: options.tileGrid.tileSize
            }),
            wrapX: true
        });
    }

    createXYZSource(layer, options) {
        return new ol.source.XYZ({
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
        if (typeof options.url !== "undefined" && typeof layer.getIn(["urlFunctions", mapStrings.MAP_LIB_2D]) !== "undefined") {
            let urlFunction = MapUtil.getUrlFunction(layer.getIn(["urlFunctions", mapStrings.MAP_LIB_2D]));
            options.url = urlFunction({
                layer: layer,
                url: options.url
            });
        }

        return new ol.source.Vector({
            url: options.url,
            format: new ol.format.GeoJSON()
        });
    }

    createVectorTopojsonSource(layer, options) {
        // customize the layer url if needed
        if (typeof options.url !== "undefined" && typeof layer.getIn(["urlFunctions", mapStrings.MAP_LIB_2D]) !== "undefined") {
            let urlFunction = MapUtil.getUrlFunction(layer.getIn(["urlFunctions", mapStrings.MAP_LIB_2D]));
            options.url = urlFunction({
                layer: layer,
                url: options.url
            });
        }

        return new ol.source.Vector({
            url: options.url,
            format: new ol.format.TopoJSON()
        });
    }

    createVectorKMLSource(layer, options) {
        // customize the layer url if needed
        if (typeof options.url !== "undefined" && typeof layer.getIn(["urlFunctions", mapStrings.MAP_LIB_2D]) !== "undefined") {
            let urlFunction = MapUtil.getUrlFunction(layer.getIn(["urlFunctions", mapStrings.MAP_LIB_2D]));
            options.url = urlFunction({
                layer: layer,
                url: options.url
            });
        }

        return new ol.source.Vector({
            url: options.url,
            format: new ol.format.KML()
        });
    }

    createVectorDrawingSource(options) {
        return new ol.source.Vector({
            wrapX: false
        });
    }

    findTopInsertIndexForLayer(mapLayer) {
        let mapLayers = this.map.getLayers();
        let index = mapLayers.getLength();

        if (mapLayer.get("_layerType") === mapStrings.LAYER_GROUP_TYPE_REFERENCE) { // referece layers always on top
            return index;
        } else if (mapLayer.get("_layerType") === mapStrings.LAYER_GROUP_TYPE_BASEMAP) { // basemaps always on bottom
            return 0;
        } else { // data layers in the middle
            for (let i = index - 1; i >= 0; --i) {
                let compareLayer = mapLayers.item(i);
                if (compareLayer.get("_layerType") === mapStrings.LAYER_GROUP_TYPE_DATA ||
                    compareLayer.get("_layerType") === mapStrings.LAYER_GROUP_TYPE_BASEMAP) {
                    return i + 1;
                }
            }
        }
        return index;
    }

    static prepProjection() {
        // define the projection for this application and reproject defaults
        ol.proj.setProj4(proj4js);
        proj4js.defs(mapConfig.DEFAULT_PROJECTION.code, mapConfig.DEFAULT_PROJECTION.proj4Def);

        let mapProjection = ol.proj.get(mapConfig.DEFAULT_PROJECTION.code);
        mapProjection.setExtent(mapConfig.DEFAULT_PROJECTION.extent);

        return mapProjection;
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


    static getWmtsOptions(options) {
        try {
            let parseOptions = ol.source.WMTS.optionsFromCapabilities(options.capabilities, options.options);
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
            console.warn("could not generate openlayers wmts options.", err);
            return false;
        }
    }
}
