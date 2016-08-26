import Immutable from 'immutable';
import moment from 'moment';
import * as actionTypes from '../constants/actionTypes';
import { mapState, layerModel, paletteModel } from './models/map';
import { alert } from './models/view';
import MapUtil from '../utils/MapUtil.js';
import MiscUtil from '../utils/MiscUtil.js';
import * as appStrings from '../constants/appStrings';
import * as mapStrings from '../constants/mapStrings';
import * as appConfig from '../constants/appConfig';
import * as mapConfig from '../constants/mapConfig';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const initializeMap = (state, action) => {
    let map = MapUtil.createMap(action.mapType, action.container, state);
    if (map) {
        return state.setIn(["maps", action.mapType], map);
    }

    let contextStr = action.mapType === mapStrings.MAP_LIB_3D ? "3D" : "2D";
    return state.set("alerts", state.get("alerts").push(alert.merge({
        title: appStrings.ALERTS.CREATE_MAP_FAILED.title,
        body: appStrings.ALERTS.CREATE_MAP_FAILED.formatString.replace("{MAP}", contextStr),
        severity: appStrings.ALERTS.CREATE_MAP_FAILED.severity,
        time: new Date()
    })));
};

const setMapViewMode = (state, action) => {
    let mode_3D = action.mode === mapStrings.MAP_VIEW_MODE_3D;
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
};

const setTerrainEnabled = (state, action) => {
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
};

const setScaleUnits = (state, action) => {
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
};
const setMapView = (state, action) => {
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
};
const setViewInfo = (state, action) => {
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
};
const zoomIn = (state, action) => {
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
};
const zoomOut = (state, action) => {
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
};
const resetOrientation = (state, action) => {
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
};

const setLayerActive = (state, action) => {
    let alerts = state.get("alerts");

    // resolve layer from id if necessary
    let actionLayer = action.layer;
    if (typeof actionLayer === "string") {
        actionLayer = findLayerById(state, actionLayer);
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
                let index = layerList.findKey((layer) => {
                    return layer.get("id") === actionLayer.get("id");
                });
                return state
                    .setIn(["layers", actionLayer.get("type"), index], newLayer)
                    .set("alerts", alerts);
            }
            return state.set("alerts", alerts);
        }
    }
    return state.set("alerts", alerts);
};

const setLayerDisabled = (state, action) => {
    // resolve layer from id if necessary
    let actionLayer = action.layer;
    if (typeof actionLayer === "string") {
        actionLayer = findLayerById(state, actionLayer);
    }

    if (typeof actionLayer !== "undefined") {
        let layerList = state.getIn(["layers", actionLayer.get("type")]);
        if (typeof layerList !== "undefined") {
            let newLayer = actionLayer
                .set("isDisabled", action.disabled)
                .set("isChangingOpacity", false)
                .set("isChangingPosition", false);
            let index = layerList.findKey((layer) => {
                return layer.get("id") === actionLayer.get("id");
            });
            return state.setIn(["layers", actionLayer.get("type"), index], newLayer);
        }
    }
    return state;
};

const setLayerOpacity = (state, action) => {
    // resolve layer from id if necessary
    let actionLayer = action.layer;
    if (typeof actionLayer === "string") {
        actionLayer = findLayerById(state, actionLayer);
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
        let index = layerList.findKey((layer) => {
            return layer.get("id") === actionLayer.get("id");
        });
        return state.setIn(["layers", actionLayer.get("type")], layerList.set(index, newLayer));
    }
    return state;
};

const startChangingOpacity = (state, action) => {
    let layerList = state.getIn(["layers", action.layer.get("type")]);
    if (typeof layerList !== "undefined") {
        let newLayer = action.layer.set("isChangingOpacity", true).set("isChangingPosition", false);
        let index = layerList.findKey((layer) => {
            return layer.get("id") === action.layer.get("id");
        });
        return state.setIn(["layers", action.layer.get("type")], layerList.set(index, newLayer));
    }
    return state;
};

const stopChangingOpacity = (state, action) => {
    let layerList = state.getIn(["layers", action.layer.get("type")]);
    if (typeof layerList !== "undefined") {
        let newLayer = action.layer.set("isChangingOpacity", false);
        let index = layerList.findKey((layer) => {
            return layer.get("id") === action.layer.get("id");
        });
        return state.setIn(["layers", action.layer.get("type")], layerList.set(index, newLayer));
    }
    return state;
};

const startChangingPosition = (state, action) => {
    let layerList = state.getIn(["layers", action.layer.get("type")]);
    if (typeof layerList !== "undefined") {
        let newLayer = action.layer.set("isChangingPosition", true).set("isChangingOpacity", false);
        let index = layerList.findKey((layer) => {
            return layer.get("id") === action.layer.get("id");
        });
        return state.setIn(["layers", action.layer.get("type")], layerList.set(index, newLayer));
    }
    return state;
};

const stopChangingPosition = (state, action) => {
    let layerList = state.getIn(["layers", action.layer.get("type")]);
    if (typeof layerList !== "undefined") {
        let newLayer = action.layer.set("isChangingPosition", false);
        let index = layerList.findKey((layer) => {
            return layer.get("id") === action.layer.get("id");
        });
        return state.setIn(["layers", action.layer.get("type")], layerList.set(index, newLayer));
    }
    return state;
};

const setLayerPalette = (state, action) => {
    // TODO
    let layerList = state.getIn(["layers", action.layer.get("type")]);
    if (typeof layerList !== "undefined") {
        let newLayer = action.layer.set("palette", action.palette);
        let index = layerList.findKey((layer) => {
            return layer.get("id") === action.layer.get("id");
        });
        return state.setIn(["layers", action.layer.get("type")], layerList.set(index, newLayer));
    }
    return state;
};
const setBasemap = (state, action) => {
    let alerts = state.get("alerts");

    // resolve layer from id if necessary
    let actionLayer = action.layer;
    if (typeof actionLayer === "string") {
        actionLayer = findLayerById(state, actionLayer);
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
};
const hideBasemap = (state, action) => {
    let anySucceed = state.get("maps").reduce((acc, map) => {
        if (map.hideBasemap()) {
            return true;
        }
        return acc;
    }, false);

    if (anySucceed) {
        let layerList = state.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_BASEMAP]);
        if (typeof layerList !== "undefined") {
            layerList = layerList.map((layer) => {
                return layer.set("isActive", false);
            });
            return state.setIn(["layers", mapStrings.LAYER_GROUP_TYPE_BASEMAP], layerList);
        }
        return state;
    }
    return state;
};
const ingestLayerConfig = (state, action) => {
    if (action.options.type === mapStrings.LAYER_CONFIG_JSON) {
        let currPartials = state.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_PARTIAL]);
        let newPartials = generatePartialsListFromJson(action.config);
        return state.setIn(["layers", mapStrings.LAYER_GROUP_TYPE_PARTIAL], currPartials.concat(newPartials));
    } else if (action.options.type === mapStrings.LAYER_CONFIG_WMTS_XML) {
        let currPartials = state.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_PARTIAL]);
        let newPartials = generatePartialsListFromWmtsXml(action.config);
        return state.setIn(["layers", mapStrings.LAYER_GROUP_TYPE_PARTIAL], currPartials.concat(newPartials));
    } else {
        console.warn("could not ingest layer config");
    }
    return state;
};
const mergeLayers = (state, action) => {
    let partials = state.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_PARTIAL]);
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
        mergedLayer = mergedLayer.set("time", moment(mapConfig.DEFAULT_DATE).format(mergedLayer.get("timeFormat")));
        // put the newly minted layer into state storage
        newLayers = state.getIn(["layers", mergedLayer.get("type")]);
        if (typeof newLayers !== "undefined") {
            state = state.setIn(["layers", mergedLayer.get("type")], newLayers.push(mergedLayer));
        }
    }
    return state.removeIn(["layers", mapStrings.LAYER_GROUP_TYPE_PARTIAL]); // remove the partials list so that it doesn't intrude later
};

const activateDefaultLayers = (state, action) => {
    // we use an explicit group order to avoid issues with draw initialization

    // activate basemap
    state = state.setIn(["layers", mapStrings.LAYER_GROUP_TYPE_BASEMAP], state.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_BASEMAP]).map((layer) => {
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
    state = state.setIn(["layers", mapStrings.LAYER_GROUP_TYPE_DATA], state.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_DATA]).map((layer) => {
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
    state = state.setIn(["layers", mapStrings.LAYER_GROUP_TYPE_REFERENCE], state.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_REFERENCE]).map((layer) => {
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
};

const setMapDate = (state, action) => {
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
        let mapFail = state.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_DATA]).reduce((acc2, layer) => {
            if (layer.get("updateParameters").get("time")) {
                if (!map.updateLayer(layer)) {
                    return true;
                }
                return false;
            }
            return acc2;
        }, false);

        if (mapFail) {
            return true;
        }
        return acc1;
    }, false);

    // set alert if any fail
    if (anyFail) {
        let contextStr = map.is3D ? "3D" : "2D";
        state = state.set("alerts", state.get("alerts").push(alert.merge({
            title: appStrings.ALERTS.SET_DATE_FAILED.title,
            body: appStrings.ALERTS.SET_DATE_FAILED.formatString.replace("{MAP}", contextStr),
            severity: appStrings.ALERTS.SET_DATE_FAILED.severity,
            time: new Date()
        })));
    }

    return state.set("date", date);
};

const pixelHover = (state, action) => {
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
};

const pixelClick = (state, action) => {
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
};

const dismissAlert = (state, action) => {
    let remAlert = action.alert;
    return state.set("alerts", state.get("alerts").filter((alert) => {
        return alert !== remAlert;
    }));
};

const dismissAllAlerts = (state, action) => {
    return state.set("alerts", state.get("alerts").clear());
};

const moveLayerToTop = (state, action) => {
    state.get("maps").map((map) => {
        map.moveLayerToTop(action.layer);
    });
    return state;
};


const moveLayerToBottom = (state, action) => {
    state.get("maps").map((map) => {
        map.moveLayerToBottom(action.layer);
    });
    return state;
};
const moveLayerUp = (state, action) => {
    state.get("maps").map((map) => {
        map.moveLayerUp(action.layer);
    });
    return state;
};
const moveLayerDown = (state, action) => {
    state.get("maps").map((map) => {
        map.moveLayerDown(action.layer);
    });
    return state;
};

const ingestLayerPalettes = (state, action) => {
    if (action.paletteConfig && action.paletteConfig.paletteArray) {
        let palettesArray = action.paletteConfig.paletteArray;
        for (let i = 0; i < palettesArray.length; ++i) {
            let palette = readPalette(palettesArray[i]);
            state = state.setIn(["palettes", palette.get("id")], palette);
        }
    }
    return state;
};

const enableDrawing = (state, action) => {
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
        return state.setIn(["drawing", "isDrawingEnabled"], true).setIn(["drawing", "geometryType"], action.geometryType);
    }
    return state;
};

const disableDrawing = (state, action) => {
    // For each map, disable drawing
    let anySucceed = state.get("maps").reduce((acc, map) => {
        if (map.disableDrawing()) {
            return true;
        }
        return acc;
    }, false);

    if (anySucceed) {
        return state.setIn(["drawing", "isDrawingEnabled"], false).setIn(["drawing", "geometryType"], "");
    }
    return state;
};

const addGeometryToMap = (state, action) => {
    let alerts = state.get("alerts");
    // Add geometry to each inactive map
    let anySucceed = state.get("maps").reduce((acc, map) => {
        // Only add geometry to inactive maps
        if (!map.isActive) {
            if (map.addGeometry(action.geometry)) {
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
};

const removeAllGeometries = (state, action) => {
    let alerts = state.get("alerts");
    // Add geometry to each inactive map
    let anySucceed = state.get("maps").reduce((acc, map) => {
        if (map.removeAllGeometries()) {
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
};

const resetApplicationState = (state, action) => {
    let newState = state;

    // set data/reference layers opacity to 1
    newState.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_DATA]).forEach((layer) => {
        newState = setLayerOpacity(newState, { layer, opacity: 1 });
    });
    newState.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_REFERENCE]).forEach((layer) => {
        newState = setLayerOpacity(newState, { layer, opacity: 1 });
    });

    // turn off data/reference layers
    newState.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_DATA]).forEach((layer) => {
        newState = setLayerActive(newState, { layer, active: false });
    });
    newState.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_REFERENCE]).forEach((layer) => {
        newState = setLayerActive(newState, { layer, active: false });
    });

    // set view to 2D
    newState = setMapViewMode(newState, { mode: mapStrings.MAP_VIEW_MODE_2D });

    // set view extent to global
    newState = setMapView(newState, {
        viewInfo: {
            extent: [-180, -90, 180, 90]
        }
    });

    // set date to today
    newState = setMapDate(newState, { date: mapConfig.DEFAULT_DATE });

    // set scale units
    newState = setScaleUnits(newState, { units: mapConfig.DEFAULT_SCALE_UNITS });

    // Remove all user vector geometries
    newState = removeAllGeometries(newState, {});

    return newState;
};

export default function map(state = mapState, action) {
    switch (action.type) {
        case actionTypes.INITIALIZE_MAP:
            return initializeMap(state, action);

        case actionTypes.SET_MAP_VIEW_MODE:
            return setMapViewMode(state, action);

        case actionTypes.SET_TERRAIN_ENABLED:
            return setTerrainEnabled(state, action);

        case actionTypes.SET_SCALE_UNITS:
            return setScaleUnits(state, action);

        case actionTypes.SET_MAP_VIEW:
            return setMapView(state, action);

        case actionTypes.SET_MAP_VIEW_INFO:
            return setViewInfo(state, action);

        case actionTypes.ZOOM_IN:
            return zoomIn(state, action);

        case actionTypes.ZOOM_OUT:
            return zoomOut(state, action);

        case actionTypes.RESET_ORIENTATION:
            return resetOrientation(state, action);

        case actionTypes.SET_LAYER_ACTIVE:
            return setLayerActive(state, action);

        case actionTypes.SET_LAYER_DISABLED:
            return setLayerDisabled(state, action);

        case actionTypes.SET_LAYER_OPACITY:
            return setLayerOpacity(state, action);

        case actionTypes.START_CHANGING_OPACITY:
            return startChangingOpacity(state, action);

        case actionTypes.STOP_CHANGING_OPACITY:
            return stopChangingOpacity(state, action);

        case actionTypes.START_CHANGING_POSITION:
            return startChangingPosition(state, action);

        case actionTypes.STOP_CHANGING_POSITION:
            return stopChangingPosition(state, action);

        case actionTypes.SET_LAYER_PALETTE:
            return setLayerPalette(state, action);

        case actionTypes.SET_BASEMAP:
            return setBasemap(state, action);

        case actionTypes.HIDE_BASEMAP:
            return hideBasemap(state, action);

        case actionTypes.INGEST_LAYER_CONFIG:
            return ingestLayerConfig(state, action);

        case actionTypes.MERGE_LAYERS:
            return mergeLayers(state, action);

        case actionTypes.ACTIVATE_DEFAULT_LAYERS:
            return activateDefaultLayers(state, action);

        case actionTypes.SET_MAP_DATE:
            return setMapDate(state, action);

        case actionTypes.PIXEL_HOVER:
            return pixelHover(state, action);

        case actionTypes.PIXEL_CLICK:
            return pixelClick(state, action);

        case actionTypes.DISMISS_ALERT:
            return dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return dismissAllAlerts(state, action);

        case actionTypes.MOVE_LAYER_TO_TOP:
            return moveLayerToTop(state, action);

        case actionTypes.MOVE_LAYER_TO_BOTTOM:
            return moveLayerToBottom(state, action);

        case actionTypes.MOVE_LAYER_UP:
            return moveLayerUp(state, action);

        case actionTypes.MOVE_LAYER_DOWN:
            return moveLayerDown(state, action);

        case actionTypes.INGEST_LAYER_PALETTES:
            return ingestLayerPalettes(state, action);

        case actionTypes.ENABLE_DRAWING:
            return enableDrawing(state, action);

        case actionTypes.DISABLE_DRAWING:
            return disableDrawing(state, action);

        case actionTypes.ADD_GEOMETRY_TO_MAP:
            return addGeometryToMap(state, action);

        case actionTypes.REMOVE_ALL_GEOMETRIES:
            return removeAllGeometries(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return resetApplicationState(state, action);

        default:
            return state;
    }
}


/****************/
/*   helpers   */
/****************/

const findLayerById = (state, layerId) => {
    return state.get("layers").reduce((acc, layerList) => {
        if (!acc) {
            return layerList.find((layer) => {
                return layer.get("id") === layerId;
            });
        }
        return acc;
    }, false);
};

const readPalette = (palette) => {
    return paletteModel.merge({
        id: palette.name,
        values: Immutable.List(palette.values.map((entry) => {
            return Immutable.Map({
                value: parseFloat(entry[0]),
                color: MiscUtil.getHexFromColorString(entry[1])
            });
        }))
    });
};

const generatePartialsListFromJson = (config) => {
    return config.layers.map((layer) => {
        let newLayer = Immutable.fromJS(layer);
        return newLayer.set("fromJson", true);
    });
};

const generatePartialsListFromWmtsXml = (config) => {
    let capabilities = MapUtil.parseCapabilities(config);
    if (capabilities) {
        let wmtsLayers = capabilities.Contents.Layer;
        let newLayers = wmtsLayers.map((layer) => {
            let wmtsOptions = MapUtil.getWmtsOptions({
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
};
