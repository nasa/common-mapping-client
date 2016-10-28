import Immutable from 'immutable';
import moment from 'moment';
import { layerModel, paletteModel } from '_core/reducers/models/map';
import { alert } from '_core/reducers/models/alert';
import MapUtil from '_core/utils/MapUtil';
import MiscUtil from '_core/utils/MiscUtil';
import * as appStrings from '_core/constants/appStrings';
import * as appConfig from 'constants/appConfig';
import { createMap } from 'utils/MapCreator';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.
export default class MapReducer {
    static mapUtil = new MapUtil();
    static miscUtil = new MiscUtil();

    static initializeMap(state, action) {
        let map = createMap(action.mapType, action.container, state);
        if (map) {
            return state.setIn(["maps", action.mapType], map);
        }

        let contextStr = action.mapType === appStrings.MAP_LIB_3D ? "3D" : "2D";
        return state.set("alerts", state.get("alerts").push(alert.merge({
            title: appStrings.ALERTS.CREATE_MAP_FAILED.title,
            body: appStrings.ALERTS.CREATE_MAP_FAILED.formatString.replace("{MAP}", contextStr),
            severity: appStrings.ALERTS.CREATE_MAP_FAILED.severity,
            time: new Date()
        })));
    }

    static setMapViewMode(state, action) {
        // rendering issues in cesium
        state = this.disableDrawing(state, action);
        state = this.disableMeasuring(state, action);

        let mode_3D = action.mode === appStrings.MAP_VIEW_MODE_3D;
        state = state.set("maps", state.get("maps").map((map) => {
            if (map.is3D) {
                map.isActive = mode_3D;
            } else {
                map.isActive = !mode_3D;
            }
            if (map.isActive) {
                // delay for next animation frame
                window.requestAnimationFrame(() => {
                    let mapSize = map.getMapSize();
                    map.enableActiveListeners(true);
                    if (mapSize && (mapSize.width === 0 && mapSize.height === 0)) {
                        // If map size is 0,0 we resize and then set extent
                        map.resize();
                        map.setExtent(state.getIn(["view", "extent"]).toJS());
                    }
                });
            } else {
                map.enableActiveListeners(false);
            }
            return map;
        }));
        return state.setIn(["view", "in3DMode"], mode_3D);
    }

    static setTerrainEnabled(state, action) {
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.is3D) {
                if (map.enableTerrain(action.enabled)) {
                    return true;
                }
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state.setIn(["displaySettings", "enableTerrain"], action.enabled);
        }
        return state;
    }

    static setTerrainExaggeration(state, action) {
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.is3D) {
                if (map.setTerrainExaggeration(action.terrainExaggeration)) {
                    return true;
                }
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state.setIn(["displaySettings", "selectedTerrainExaggeration"], action.terrainExaggeration);
        }
        return state;
    }

    static setScaleUnits(state, action) {
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.setScaleUnits(action.units)) {
                return true;
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state.setIn(["displaySettings", "selectedScaleUnits"], action.units);
        }
        return state;
    }
    static setMapView(state, action) {
        let alerts = state.get("alerts");
        let anySucceed = state.get("maps").reduce((acc, map) => {
            // Only apply view to active map
            if (map.isActive) {
                if (map.setExtent(action.viewInfo.extent)) {
                    return true;
                } else {
                    let contextStr = map.is3D ? "3D" : "2D";
                    alerts = alerts.push(alert.merge({
                        title: appStrings.ALERTS.VIEW_SYNC_FAILED.title,
                        body: appStrings.ALERTS.VIEW_SYNC_FAILED.formatString.replace("{MAP}", contextStr),
                        severity: appStrings.ALERTS.VIEW_SYNC_FAILED.severity,
                        time: new Date()
                    }));
                }
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state
                .setIn(["view", "zoom"], typeof action.viewInfo.zoom !== "undefined" ? action.viewInfo.zoom : state.getIn(["view", "zoom"]))
                .setIn(["view", "center"], typeof action.viewInfo.center !== "undefined" ? Immutable.List(action.viewInfo.center) : state.getIn(["view", "center"]))
                .setIn(["view", "extent"], typeof action.viewInfo.extent !== "undefined" ? Immutable.List(action.viewInfo.extent) : state.getIn(["view", "extent"]))
                .setIn(["view", "projection"], typeof action.viewInfo.projection !== "undefined" ? action.viewInfo.projection : state.getIn(["view", "projection"]))
                .set("alerts", alerts);
        }
        return state;
    }
    static setViewInfo(state, action) {
        let alerts = state.get("alerts");
        // TODO split out projection changes?
        let anySucceed = state.get("maps").reduce((acc, map) => {
            // Only apply view to inactive maps
            if (!map.isActive) {
                if (map.setExtent(action.viewInfo.extent)) {
                    return true;
                } else {
                    let contextStr = map.is3D ? "3D" : "2D";
                    alerts = alerts.push(alert.merge({
                        title: appStrings.ALERTS.VIEW_SYNC_FAILED.title,
                        body: appStrings.ALERTS.VIEW_SYNC_FAILED.formatString.replace("{MAP}", contextStr),
                        severity: appStrings.ALERTS.VIEW_SYNC_FAILED.severity,
                        time: new Date()
                    }));
                }
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state
                .setIn(["view", "zoom"], typeof action.viewInfo.zoom !== "undefined" ? action.viewInfo.zoom : state.getIn(["view", "zoom"]))
                .setIn(["view", "center"], typeof action.viewInfo.center !== "undefined" ? Immutable.List(action.viewInfo.center) : state.getIn(["view", "center"]))
                .setIn(["view", "extent"], typeof action.viewInfo.extent !== "undefined" ? Immutable.List(action.viewInfo.extent) : state.getIn(["view", "extent"]))
                .setIn(["view", "projection"], typeof action.viewInfo.projection !== "undefined" ? action.viewInfo.projection : state.getIn(["view", "projection"]))
                .set("alerts", alerts);
        }
        return state;
    }
    static zoomIn(state, action) {
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.isActive) {
                if (map.zoomIn()) {
                    return true;
                }
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state.setIn(["view", "zoom"], state.getIn(["view", "zoom"]) + 1);
        }
        return state;
    }
    static zoomOut(state, action) {
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.isActive) {
                if (map.zoomOut()) {
                    return true;
                }
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state.setIn(["view", "zoom"], state.getIn(["view", "zoom"]) - 1);
        }
        return state;
    }
    static resetOrientation(state, action) {
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.isActive) {
                if (map.resetOrientation(action.duration)) {
                    return true;
                }
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state;
        }
        return state;
    }

    static setLayerActive(state, action) {
        let alerts = state.get("alerts");

        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
        }

        if (typeof actionLayer !== "undefined") {
            let anySucceed = state.get("maps").reduce((acc, map) => {
                if (map.setLayerActive(actionLayer, action.active)) {
                    return true;
                } else {
                    let contextStr = map.is3D ? "3D" : "2D";
                    alerts = alerts.push(alert.merge({
                        title: appStrings.ALERTS.LAYER_ACTIVATION_FAILED.title,
                        body: appStrings.ALERTS.LAYER_ACTIVATION_FAILED.formatString.replace("{LAYER}", actionLayer.get("title")).replace("{MAP}", contextStr),
                        severity: appStrings.ALERTS.LAYER_ACTIVATION_FAILED.severity,
                        time: new Date()
                    }));
                }
                return acc;
            }, false);

            if (anySucceed) {
                let layerList = state.getIn(["layers", actionLayer.get("type")]);
                if (typeof layerList !== "undefined") {
                    let newLayer = actionLayer
                        .set("isActive", action.active)
                        .set("isChangingOpacity", false)
                        .set("isChangingPosition", false);
                    let index = actionLayer.get("id");
                    return state
                        .setIn(["layers", actionLayer.get("type"), index], newLayer)
                        .set("alerts", alerts);
                }
                return state.set("alerts", alerts);
            }
        }
        return state.set("alerts", alerts);
    }

    static setLayerDisabled(state, action) {
        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
        }

        if (typeof actionLayer !== "undefined") {
            let layerList = state.getIn(["layers", actionLayer.get("type")]);
            if (typeof layerList !== "undefined") {
                let newLayer = actionLayer
                    .set("isDisabled", action.disabled)
                    .set("isChangingOpacity", false)
                    .set("isChangingPosition", false);
                let index = actionLayer.get("id");
                return state.setIn(["layers", actionLayer.get("type"), index], newLayer);
            }
        }
        return state;
    }

    static setLayerOpacity(state, action) {
        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
        }

        let anyFail = state.get("maps").reduce((acc, map) => {
            if (!map.setLayerOpacity(actionLayer, action.opacity)) {
                return true;
            }
            return acc;
        }, false);

        let layerList = state.getIn(["layers", actionLayer.get("type")]);
        if (typeof layerList !== "undefined") {
            let newLayer = actionLayer.set("opacity", action.opacity);
            let index = actionLayer.get("id");
            return state.setIn(["layers", actionLayer.get("type"), index], newLayer);
        }
        return state;
    }

    static startChangingOpacity(state, action) {
        let layerList = state.getIn(["layers", action.layer.get("type")]);
        if (typeof layerList !== "undefined") {
            let newLayer = action.layer.set("isChangingOpacity", true).set("isChangingPosition", false);
            let index = action.layer.get("id");
            return state.setIn(["layers", action.layer.get("type"), index], newLayer);
        }
        return state;
    }

    static stopChangingOpacity(state, action) {
        let layerList = state.getIn(["layers", action.layer.get("type")]);
        if (typeof layerList !== "undefined") {
            let newLayer = action.layer.set("isChangingOpacity", false);
            let index = action.layer.get("id");
            return state.setIn(["layers", action.layer.get("type"), index], newLayer);
        }
        return state;
    }

    static startChangingPosition(state, action) {
        let layerList = state.getIn(["layers", action.layer.get("type")]);
        if (typeof layerList !== "undefined") {
            let newLayer = action.layer.set("isChangingPosition", true).set("isChangingOpacity", false);
            let index = action.layer.get("id");
            return state.setIn(["layers", action.layer.get("type"), index], newLayer);
        }
        return state;
    }

    static stopChangingPosition(state, action) {
        let layerList = state.getIn(["layers", action.layer.get("type")]);
        if (typeof layerList !== "undefined") {
            let newLayer = action.layer.set("isChangingPosition", false);
            let index = action.layer.get("id");
            return state.setIn(["layers", action.layer.get("type"), index], newLayer);
        }
        return state;
    }

    static setLayerPalette(state, action) {
        // TODO
        let layerList = state.getIn(["layers", action.layer.get("type")]);
        if (typeof layerList !== "undefined") {
            let newLayer = action.layer.set("palette", action.palette);
            let index = action.layer.get("id");
            return state.setIn(["layers", action.layer.get("type"), index], newLayer);
        }
        return state;
    }
    static setBasemap(state, action) {
        let alerts = state.get("alerts");

        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
        }

        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.setBasemap(actionLayer)) {
                return true;
            } else {
                let contextStr = map.is3D ? "3D" : "2D";
                alerts = alerts.push(alert.merge({
                    title: appStrings.ALERTS.BASEMAP_UPDATE_FAILED.title,
                    body: appStrings.ALERTS.BASEMAP_UPDATE_FAILED.formatString.replace("{LAYER}", actionLayer.get("title")).replace("{MAP}", contextStr),
                    severity: appStrings.ALERTS.BASEMAP_UPDATE_FAILED.severity,
                    time: new Date()
                }));
            }
            return acc;
        }, false);

        if (anySucceed) {
            let layerList = state.getIn(["layers", actionLayer.get("type")]);
            if (typeof layerList !== "undefined") {
                layerList = layerList.map((layer) => {
                    if (layer.get("id") === actionLayer.get("id")) {
                        return layer.set("isActive", true);
                    }
                    return layer.set("isActive", false);
                });
                return state
                    .setIn(["layers", actionLayer.get("type")], layerList)
                    .set("alerts", alerts);
            }
            return state.set("alerts", alerts);
        }
        return state.set("alerts", alerts);
    }
    static hideBasemap(state, action) {
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.hideBasemap()) {
                return true;
            }
            return acc;
        }, false);

        if (anySucceed) {
            let layerList = state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_BASEMAP]);
            if (typeof layerList !== "undefined") {
                layerList = layerList.map((layer) => {
                    return layer.set("isActive", false);
                });
                return state.setIn(["layers", appStrings.LAYER_GROUP_TYPE_BASEMAP], layerList);
            }
            return state;
        }
        return state;
    }
    static ingestLayerConfig(state, action) {
        if (action.options.type === appStrings.LAYER_CONFIG_JSON) {
            let currPartials = state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL]);
            let newPartials = this.generatePartialsListFromJson(action.config);
            return state.setIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL], currPartials.concat(newPartials));
        } else if (action.options.type === appStrings.LAYER_CONFIG_WMTS_XML) {
            let currPartials = state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL]);
            let newPartials = this.generatePartialsListFromWmtsXml(action.config);
            return state.setIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL], currPartials.concat(newPartials));
        } else {
            console.warn("could not ingest layer config");
        }
        return state;
    }
    static mergeLayers(state, action) {
        let partials = state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL]);
        let refPartial = null;
        let matchingPartials = null;
        let mergedLayer = null;
        let newLayers = null;
        while (partials.size > 0) {
            // grab a partial
            refPartial = partials.last();
            // remove it from future evaluation
            partials = partials.pop();
            // grab matching partials
            matchingPartials = partials.filter((el) => {
                return el.get("id") === refPartial.get("id");
            });
            // remove them from future evaluation
            partials = partials.filter((el) => {
                return el.get("id") !== refPartial.get("id");
            });
            // merge the matching partials together
            mergedLayer = matchingPartials.reduce((acc, el) => {
                if (el.get("fromJson")) {
                    return acc.mergeDeep(el);
                }
                return el.mergeDeep(acc);
            }, refPartial);
            // merge in the default values
            mergedLayer = layerModel.mergeDeep(mergedLayer);
            // update layer time
            mergedLayer = mergedLayer.set("time", moment(appConfig.DEFAULT_DATE).format(mergedLayer.get("timeFormat")));
            // put the newly minted layer into state storage
            if (typeof mergedLayer.get("id") !== "undefined") {
                state = state.setIn(["layers", mergedLayer.get("type"), mergedLayer.get("id")], mergedLayer);
            }
        }
        return state.removeIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL]); // remove the partials list so that it doesn't intrude later
    }

    static activateDefaultLayers(state, action) {
        // we use an explicit group order to avoid issues with draw initialization

        // activate basemap
        state = state.setIn(["layers", appStrings.LAYER_GROUP_TYPE_BASEMAP], state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_BASEMAP]).map((layer) => {
            if (layer.get("isDefault")) {
                let anySucceed = state.get("maps").reduce((acc, map) => {
                    if (map.setBasemap(layer)) {
                        return true;
                    }
                    return acc;
                }, false);
                if (anySucceed) {
                    return layer.set("isActive", true);
                }
            }
            return layer;
        }));

        // activate data layers
        state = state.setIn(["layers", appStrings.LAYER_GROUP_TYPE_DATA], state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_DATA]).map((layer) => {
            if (layer.get("isDefault")) {
                let anySucceed = state.get("maps").reduce((acc, map) => {
                    if (map.setLayerActive(layer, true)) {
                        return true;
                    }
                    return acc;
                }, false);
                if (anySucceed) {
                    return layer.set("isActive", true);
                }
            }
            return layer;
        }));

        // activate reference layers
        state = state.setIn(["layers", appStrings.LAYER_GROUP_TYPE_REFERENCE], state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_REFERENCE]).map((layer) => {
            if (layer.get("isDefault")) {
                let anySucceed = state.get("maps").reduce((acc, map) => {
                    if (map.setLayerActive(layer, true)) {
                        return true;
                    }
                    return acc;
                }, false);
                if (anySucceed) {
                    return layer.set("isActive", true);
                }
            }
            return layer;
        }));

        return state;
    }

    static setMapDate(state, action) {
        let date = action.date;

        // shortcut non-updates
        if (date === state.get("date")) {
            return state;
        }

        // make sure we are in bounds
        if (moment(date).isBefore(moment(appConfig.MIN_DATE))) {
            date = appConfig.MIN_DATE;
        } else if (moment(date).isAfter(moment(appConfig.MAX_DATE))) {
            date = appConfig.MAX_DATE;
        }

        // update the layer objects
        state = state.set("layers", state.get("layers").map((layerSection) => {
            return layerSection.map((layer) => {
                return layer.set("time", moment(date).format(layer.get("timeFormat")));
            });
        }));

        // update the layers on the map
        let anyFail = state.get("maps").reduce((acc1, map) => {
            // only updated data layers, should we update basemaps and reference layers too?
            let mapFail = state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_DATA]).reduce((acc2, layer) => {
                if (layer.get("updateParameters").get("time")) {
                    if (!map.updateLayer(layer)) {
                        return true;
                    }
                    return false;
                }
                return acc2;
            }, false);

            if (mapFail) {
                let contextStr = map.is3D ? "3D" : "2D";
                state = state.set("alerts", state.get("alerts").push(alert.merge({
                    title: appStrings.ALERTS.SET_DATE_FAILED.title,
                    body: appStrings.ALERTS.SET_DATE_FAILED.formatString.replace("{MAP}", contextStr),
                    severity: appStrings.ALERTS.SET_DATE_FAILED.severity,
                    time: new Date()
                })));
                return true;
            }
            return acc1;

        }, false);


        if (!anyFail) {
            return state.set("date", date);
        }
    }

    static pixelHover(state, action) {
        let pixelCoordinate = state.getIn(["view", "pixelHoverCoordinate"]).set("isValid", false);
        state.get("maps").forEach((map) => {
            if (map.isActive) {
                let coords = map.getLatLonFromPixelCoordinate(action.pixel);
                if (coords) {
                    pixelCoordinate = pixelCoordinate
                        .set("lat", coords.lat)
                        .set("lon", coords.lon)
                        .set("x", action.pixel[0])
                        .set("y", action.pixel[1])
                        .set("isValid", coords.isValid);
                    return false;
                }
            }
            return true;
        });
        return state.setIn(["view", "pixelHoverCoordinate"], pixelCoordinate);
    }

    static invalidatePixelHover(state, action) {
        return state.setIn(["view", "pixelHoverCoordinate", "isValid"], false);
    }

    static pixelClick(state, action) {
        let pixelCoordinate = state.getIn(["view", "pixelClickCoordinate"]).set("isValid", false);
        state.get("maps").forEach((map) => {
            if (map.isActive) {
                let pixel = map.getPixelFromClickEvent(action.clickEvt);
                if (pixel) {
                    let coords = map.getLatLonFromPixelCoordinate(pixel);
                    if (coords) {
                        pixelCoordinate = pixelCoordinate
                            .set("lat", coords.lat)
                            .set("lon", coords.lon)
                            .set("x", pixel[0])
                            .set("y", pixel[1])
                            .set("isValid", coords.isValid);
                        return false;
                    }
                }
            }
            return true;
        });
        return state.setIn(["view", "pixelClickCoordinate"], pixelCoordinate);
    }

    static dismissAlert(state, action) {
        let remAlert = action.alert;
        return state.set("alerts", state.get("alerts").filter((alert) => {
            return alert !== remAlert;
        }));
    }

    static dismissAllAlerts(state, action) {
        return state.set("alerts", state.get("alerts").clear());
    }

    static moveLayerToTop(state, action) {
        state.get("maps").map((map) => {
            map.moveLayerToTop(action.layer);
        });
        return state;
    }


    static moveLayerToBottom(state, action) {
        state.get("maps").map((map) => {
            map.moveLayerToBottom(action.layer);
        });
        return state;
    }
    static moveLayerUp(state, action) {
        state.get("maps").map((map) => {
            map.moveLayerUp(action.layer);
        });
        return state;
    }
    static moveLayerDown(state, action) {
        state.get("maps").map((map) => {
            map.moveLayerDown(action.layer);
        });
        return state;
    }

    static ingestLayerPalettes(state, action) {
        if (action.paletteConfig && action.paletteConfig.paletteArray) {
            let palettesArray = action.paletteConfig.paletteArray;
            for (let i = 0; i < palettesArray.length; ++i) {
                let palette = this.readPalette(palettesArray[i]);
                state = state.setIn(["palettes", palette.get("id")], palette);
            }
        }
        return state;
    }

    static enableDrawing(state, action) {
        action.delayClickEnable = false;
        state = this.disableMeasuring(state, action);
        state = this.disableDrawing(state, action);

        // For each map, enable drawing
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.isActive) {
                if (map.enableDrawing(action.geometryType)) {
                    return true;
                }
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state
                .setIn(["drawing", "isDrawingEnabled"], true)
                .setIn(["drawing", "geometryType"], action.geometryType);
        }
        return state;
    }

    static disableDrawing(state, action) {
        // For each map, disable drawing
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.disableDrawing(action.delayClickEnable)) {
                return true;
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state
                .setIn(["drawing", "isDrawingEnabled"], false)
                .setIn(["drawing", "geometryType"], "");
        }
        return state;
    }

    static enableMeasuring(state, action) {
        action.delayClickEnable = false;
        state = this.disableDrawing(state, action);
        state = this.disableMeasuring(state, action);

        // For each map, enable measuring
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.isActive) {
                if (map.enableMeasuring(action.geometryType, action.measurementType)) {
                    return true;
                }
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state
                .setIn(["measuring", "isMeasuringEnabled"], true)
                .setIn(["measuring", "geometryType"], action.geometryType)
                .setIn(["measuring", "measurementType"], action.measurementType);
        }
        return state;
    }

    static disableMeasuring(state, action) {
        // For each map, disable drawing
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.disableMeasuring(action.delayClickEnable)) {
                return true;
            }
            return acc;
        }, false);

        if (anySucceed) {
            return state
                .setIn(["measuring", "isMeasuringEnabled"], false)
                .setIn(["measuring", "geometryType"], "")
                .setIn(["measuring", "measurementType"], "");
        }
        return state;
    }

    static addGeometryToMap(state, action) {
        let alerts = state.get("alerts");
        // Add geometry to each inactive map
        let anySucceed = state.get("maps").reduce((acc, map) => {
            // Only add geometry to inactive maps
            if (!map.isActive) {
                if (map.addGeometry(action.geometry, action.interactionType, action.geodesic)) {
                    return true;
                } else {
                    let contextStr = map.is3D ? "3D" : "2D";
                    alerts = alerts.push(alert.merge({
                        title: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.title,
                        body: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.formatString.replace("{MAP}", contextStr),
                        severity: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.severity,
                        time: new Date()
                    }));
                }
            }
            return acc;
        }, false);

        return state.set("alerts", alerts);
    }

    static addMeasurementLabelToGeometry(state, action) {
        let alerts = state.get("alerts");

        // calculate measurement and placement
        let measurement = this.mapUtil.measureGeometry(action.geometry, action.measurementType);
        let measurementLabel = this.mapUtil.formatMeasurement(measurement, action.measurementType, action.units);
        let measurementPosition = this.mapUtil.getLabelPosition(action.geometry);
        let labelMeta = {
            "meters": measurement,
            "measurementType": action.measurementType,
            interactionType: appStrings.INTERACTION_MEASURE
        };

        let anySucceed = state.get("maps").reduce((acc, map) => {
            // add label to all maps since it's not done automatically for anyone
            if (map.addLabel(measurementLabel, measurementPosition, labelMeta)) {
                return true;
            } else {
                let contextStr = map.is3D ? "3D" : "2D";
                alerts = alerts.push(alert.merge({
                    title: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.title,
                    body: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.formatString.replace("{MAP}", contextStr),
                    severity: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.severity,
                    time: new Date()
                }));
            }
            return acc;
        }, false);

        return state.set("alerts", alerts);
    }

    static removeAllDrawings(state, action) {
        state = this.disableDrawing(state, action);
        state = this.disableMeasuring(state, action);

        let alerts = state.get("alerts");
        // Add geometry to each inactive map
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.removeAllDrawings()) {
                return true;
            } else {
                let contextStr = map.is3D ? "3D" : "2D";
                alerts = alerts.push(alert.merge({
                    title: appStrings.ALERTS.GEOMETRY_REMOVAL_FAILED.title,
                    body: appStrings.ALERTS.GEOMETRY_REMOVAL_FAILED.formatString.replace("{MAP}", contextStr),
                    severity: appStrings.ALERTS.GEOMETRY_REMOVAL_FAILED.severity,
                    time: new Date()
                }));
            }
            return acc;
        }, false);

        return state.set("alerts", alerts);
    }

    static removeAllMeasurements(state, action) {
        state = this.disableMeasuring(state, action);
        state = this.disableDrawing(state, action);

        let alerts = state.get("alerts");
        // Add geometry to each inactive map
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.removeAllMeasurements()) {
                return true;
            } else {
                let contextStr = map.is3D ? "3D" : "2D";
                alerts = alerts.push(alert.merge({
                    title: appStrings.ALERTS.MEASUREMENT_REMOVAL_FAILED.title,
                    body: appStrings.ALERTS.MEASUREMENT_REMOVAL_FAILED.formatString.replace("{MAP}", contextStr),
                    severity: appStrings.ALERTS.MEASUREMENT_REMOVAL_FAILED.severity,
                    time: new Date()
                }));
            }
            return acc;
        }, false);

        return state.set("alerts", alerts);
    }

    static resetApplicationState(state, action) {
        let newState = state;

        // set data/reference layers opacity to 1
        newState.getIn(["layers", appStrings.LAYER_GROUP_TYPE_DATA]).forEach((layer) => {
            newState = this.setLayerOpacity(newState, { layer, opacity: 1 });
        });
        newState.getIn(["layers", appStrings.LAYER_GROUP_TYPE_REFERENCE]).forEach((layer) => {
            newState = this.setLayerOpacity(newState, { layer, opacity: 1 });
        });

        // turn off data/reference layers
        newState.getIn(["layers", appStrings.LAYER_GROUP_TYPE_DATA]).forEach((layer) => {
            newState = this.setLayerActive(newState, { layer, active: false });
        });
        newState.getIn(["layers", appStrings.LAYER_GROUP_TYPE_REFERENCE]).forEach((layer) => {
            newState = this.setLayerActive(newState, { layer, active: false });
        });

        // set view to 2D
        newState = this.setMapViewMode(newState, { mode: appStrings.MAP_VIEW_MODE_2D });

        // set view extent to global
        newState = this.setMapView(newState, {
            viewInfo: {
                extent: [-180, -90, 180, 90]
            }
        });

        // set date to today
        newState = this.setMapDate(newState, { date: appConfig.DEFAULT_DATE });

        // set scale units
        newState = this.setScaleUnits(newState, { units: appConfig.DEFAULT_SCALE_UNITS });

        // set terrain exaggeration
        newState = this.setTerrainExaggeration(newState, { terrainExaggeration: appConfig.DEFAULT_TERRAIN_EXAGGERATION });

        // Remove all user vector geometries
        newState = this.removeAllDrawings(newState, {});

        // Remove all measurements
        newState = this.removeAllMeasurements(newState, {});

        return newState;
    }

    /****************/
    /*   helpers   */
    /****************/

    static findLayerById(state, layerId) {
        return state.get("layers").reduce((acc, layerList) => {
            if (!acc) {
                return layerList.find((layer) => {
                    return layer.get("id") === layerId;
                });
            }
            return acc;
        }, false);
    }

    static readPalette(palette) {
        return paletteModel.merge({
            id: palette.name,
            values: Immutable.List(palette.values.map((entry) => {
                return Immutable.Map({
                    value: parseFloat(entry[0]),
                    color: this.miscUtil.getHexFromColorString(entry[1])
                });
            }))
        });
    }

    static generatePartialsListFromJson(config) {
        return config.layers.map((layer) => {
            let newLayer = Immutable.fromJS(layer);
            return newLayer.set("fromJson", true);
        });
    }

    static generatePartialsListFromWmtsXml(config) {
        let capabilities = this.mapUtil.parseCapabilities(config);
        if (capabilities) {
            let wmtsLayers = capabilities.Contents.Layer;
            let newLayers = wmtsLayers.map((layer) => {
                let wmtsOptions = this.mapUtil.getWmtsOptions({
                    capabilities: capabilities,
                    options: {
                        layer: layer.Identifier,
                        matrixSet: layer.TileMatrixSetLink[0].TileMatrixSet
                    }
                });
                return {
                    id: layer.Identifier,
                    title: layer.Title,
                    fromJson: false,
                    wmtsOptions: wmtsOptions
                };
            });
            return Immutable.fromJS(newLayers);
        }
        return [];
    }

}
