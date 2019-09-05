/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import moment from "moment";
import { layerModel, paletteModel } from "_core/reducers/models/map";
import { alert } from "_core/reducers/models/alert";
import MapUtil from "_core/utils/MapUtil";
import MiscUtil from "_core/utils/MiscUtil";
import * as appStrings from "_core/constants/appStrings";
import appConfig from "constants/appConfig";
import { createMap } from "utils/MapCreator";

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class MapReducer {
    static mapUtil = MapUtil;
    static miscUtil = MiscUtil;

    static getLayerModel() {
        return layerModel;
    }

    static getPaletteModel() {
        return paletteModel;
    }

    static initializeMap(state, action) {
        let map = createMap(action.mapType, action.container, state);
        if (map && map.initializationSuccess) {
            return state.setIn(["maps", action.mapType], map);
        }

        let contextStr = action.mapType === appStrings.MAP_LIB_3D ? "3D" : "2D";
        return state.set(
            "alerts",
            state.get("alerts").push(
                alert.merge({
                    title: appStrings.ALERTS.CREATE_MAP_FAILED.title,
                    body: appStrings.ALERTS.CREATE_MAP_FAILED.formatString.replace(
                        "{MAP}",
                        contextStr
                    ),
                    severity: appStrings.ALERTS.CREATE_MAP_FAILED.severity,
                    time: new Date()
                })
            )
        );
    }

    static setMapViewMode(state, action) {
        let alerts = state.get("alerts");

        // rendering issues in cesium
        state = this.disableDrawing(state, action);
        state = this.disableMeasuring(state, action);

        // Check validity of action.mode
        if (
            action.mode !== appStrings.MAP_VIEW_MODE_2D &&
            action.mode !== appStrings.MAP_VIEW_MODE_3D
        ) {
            alerts = alerts.push(
                alert.merge({
                    title: appStrings.ALERTS.VIEW_MODE_CHANGE_FAILED.title,
                    body: appStrings.ALERTS.VIEW_MODE_CHANGE_FAILED.formatString.replace(
                        "{MAP_VIEW_MODE}",
                        action.mode
                    ),
                    severity: appStrings.ALERTS.VIEW_MODE_CHANGE_FAILED.severity,
                    time: new Date()
                })
            );
            return state.set("alerts", alerts);
        }

        let mode3D = action.mode === appStrings.MAP_VIEW_MODE_3D;
        state = state.set(
            "maps",
            state.get("maps").map(map => {
                if (map.is3D) {
                    map.isActive = mode3D;
                } else {
                    map.isActive = !mode3D;
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
            })
        );
        return state.setIn(["view", "in3DMode"], mode3D);
    }

    static setTerrainEnabled(state, action) {
        if (state.getIn(["displaySettings", "enableTerrain"]) !== action.enabled) {
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
        }

        return state;
    }

    static setTerrainExaggeration(state, action) {
        if (
            state.getIn(["displaySettings", "selectedTerrainExaggeration"]) !==
            action.terrainExaggeration
        ) {
            let anySucceed = state.get("maps").reduce((acc, map) => {
                if (map.is3D) {
                    if (map.setTerrainExaggeration(action.terrainExaggeration)) {
                        return true;
                    }
                }
                return acc;
            }, false);

            if (anySucceed) {
                return state.setIn(
                    ["displaySettings", "selectedTerrainExaggeration"],
                    action.terrainExaggeration
                );
            }
        }

        return state;
    }

    static setScaleUnits(state, action) {
        if (state.getIn(["displaySettings", "selectedScaleUnits"]) !== action.units) {
            let anySucceed = state.get("maps").reduce((acc, map) => {
                if (map.setScaleUnits(action.units)) {
                    return true;
                }
                return acc;
            }, false);

            if (anySucceed) {
                return state.setIn(["displaySettings", "selectedScaleUnits"], action.units);
            }
        }

        return state;
    }

    static setMapView(state, action) {
        let alerts = state.get("alerts");
        let validatedExtent = this.mapUtil.parseStringExtent(action.viewInfo.extent);
        if (!validatedExtent) {
            alerts = alerts.push(
                alert.merge({
                    title: appStrings.ALERTS.VIEW_SYNC_FAILED.title,
                    body: appStrings.ALERTS.VIEW_SYNC_FAILED.formatString.replace(
                        "{MAP}",
                        "2D & 3D"
                    ),
                    severity: appStrings.ALERTS.VIEW_SYNC_FAILED.severity,
                    time: new Date()
                })
            );
            state = state.set("alerts", alerts);
        }
        let anyFail = state.get("maps").reduce((acc, map) => {
            // Apply view to active/inactive maps depending on targetActiveMap
            if (map.isActive === action.targetActiveMap) {
                if (!map.setExtent(validatedExtent)) {
                    let contextStr = map.is3D ? "3D" : "2D";
                    alerts = alerts.push(
                        alert.merge({
                            title: appStrings.ALERTS.VIEW_SYNC_FAILED.title,
                            body: appStrings.ALERTS.VIEW_SYNC_FAILED.formatString.replace(
                                "{MAP}",
                                contextStr
                            ),
                            severity: appStrings.ALERTS.VIEW_SYNC_FAILED.severity,
                            time: new Date()
                        })
                    );
                    return true;
                }
            }
            return acc;
        }, false);

        if (!anyFail) {
            return state
                .setIn(
                    ["view", "extent"],
                    typeof validatedExtent !== "undefined"
                        ? Immutable.List(action.viewInfo.extent)
                        : state.getIn(["view", "extent"])
                )
                .setIn(
                    ["view", "projection"],
                    typeof action.viewInfo.projection !== "undefined"
                        ? action.viewInfo.projection
                        : state.getIn(["view", "projection"])
                )
                .set("alerts", alerts);
        }
        return state;
    }

    static panMap(state, action) {
        let alerts = state.get("alerts");
        let anySucceed = state.get("maps").reduce((acc, map) => {
            if (map.isActive) {
                if (map.panMap(action.direction, action.extraFar)) {
                    return true;
                } else {
                    let contextStr = map.is3D ? "3D" : "2D";
                    alerts = alerts.push(
                        alert.merge({
                            title: appStrings.ALERTS.VIEW_SYNC_FAILED.title,
                            body: appStrings.ALERTS.VIEW_SYNC_FAILED.formatString.replace(
                                "{MAP}",
                                contextStr
                            ),
                            severity: appStrings.ALERTS.VIEW_SYNC_FAILED.severity,
                            time: new Date()
                        })
                    );
                }
            }
            return acc;
        }, false);

        // if (anySucceed) {
        //     return state
        //         .setIn(["view", "extent"], typeof validatedExtent !== "undefined" ? Immutable.List(action.viewInfo.extent) : state.getIn(["view", "extent"]))
        //         .setIn(["view", "projection"], typeof action.viewInfo.projection !== "undefined" ? action.viewInfo.projection : state.getIn(["view", "projection"]))
        //         .set("alerts", alerts);
        // }
        return state;
    }

    static zoomIn(state, action) {
        state.get("maps").forEach(map => {
            if (map.isActive) {
                map.zoomIn();
            }
        });

        return state;
    }

    static zoomOut(state, action) {
        state.get("maps").forEach(map => {
            if (map.isActive) {
                map.zoomOut();
            }
        });

        return state;
    }

    static resetOrientation(state, action) {
        state.get("maps").forEach(map => {
            if (map.isActive) {
                map.resetOrientation(action.duration);
            }
        });

        return state;
    }

    static setLayerActive(state, action) {
        let alerts = state.get("alerts");

        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
            if (typeof actionLayer === "undefined") {
                alerts = alerts.push(
                    alert.merge({
                        title: appStrings.ALERTS.LAYER_ACTIVATION_FAILED.title,
                        body: appStrings.ALERTS.LAYER_ACTIVATION_FAILED.formatString
                            .replace("{LAYER}", action.layer)
                            .replace("{MAP}", "the"),
                        severity: appStrings.ALERTS.LAYER_ACTIVATION_FAILED.severity,
                        time: new Date()
                    })
                );
            }
        }

        if (typeof actionLayer !== "undefined" && actionLayer.get("isActive") !== action.active) {
            let anySucceed = state.get("maps").reduce((acc, map) => {
                if (map.setLayerActive(actionLayer, action.active)) {
                    return true;
                } else {
                    let contextStr = map.is3D ? "3D" : "2D";
                    alerts = alerts.push(
                        alert.merge({
                            title: appStrings.ALERTS.LAYER_ACTIVATION_FAILED.title,
                            body: appStrings.ALERTS.LAYER_ACTIVATION_FAILED.formatString
                                .replace("{LAYER}", actionLayer.get("title"))
                                .replace("{MAP}", contextStr),
                            severity: appStrings.ALERTS.LAYER_ACTIVATION_FAILED.severity,
                            time: new Date()
                        })
                    );
                }
                return acc;
            }, false);

            if (anySucceed) {
                let newLayer = actionLayer.set("isActive", action.active);
                state = state.setIn(
                    ["layers", actionLayer.get("type"), actionLayer.get("id")],
                    newLayer
                );
            }

            state = this.updateLayerOrder(state, {});
        }

        return state.set("alerts", alerts);
    }

    static setLayerDisabled(state, action) {
        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
            if (typeof actionLayer === "undefined") {
                return state;
            }
        }

        if (
            typeof actionLayer !== "undefined" &&
            actionLayer.get("isDisabled") !== action.disabled
        ) {
            let newLayer = actionLayer.set("isDisabled", action.disabled);
            state = state.setIn(
                ["layers", actionLayer.get("type"), actionLayer.get("id")],
                newLayer
            );
        }
        return state;
    }

    static setLayerOpacity(state, action) {
        let alerts = state.get("alerts");

        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
            if (typeof actionLayer === "undefined") {
                alerts = alerts.push(
                    alert.merge({
                        title: appStrings.ALERTS.LAYER_OPACITY_CHANGE_FAILED.title,
                        body: appStrings.ALERTS.LAYER_OPACITY_CHANGE_FAILED.formatString.replace(
                            "{LAYER}",
                            action.layer
                        ),
                        severity: appStrings.ALERTS.LAYER_OPACITY_CHANGE_FAILED.severity,
                        time: new Date()
                    })
                );
                return state.set("alerts", alerts);
            }
        }

        // validate opacity
        let opacity = parseFloat(action.opacity);
        if (isNaN(opacity)) {
            alerts = alerts.push(
                alert.merge({
                    title: appStrings.ALERTS.LAYER_OPACITY_CHANGE_FAILED.title,
                    body: appStrings.ALERTS.LAYER_OPACITY_CHANGE_FAILED.formatString.replace(
                        "{LAYER}",
                        action.layer
                    ),
                    severity: appStrings.ALERTS.LAYER_OPACITY_CHANGE_FAILED.severity,
                    time: new Date()
                })
            );
        } else {
            if (opacity >= 0 && opacity <= 1) {
                // If opacity has not changed, no need to update
                if (actionLayer.get("opacity") !== opacity) {
                    state.get("maps").forEach(map => {
                        map.setLayerOpacity(actionLayer, opacity);
                    });

                    state = state.setIn(
                        ["layers", actionLayer.get("type"), actionLayer.get("id"), "opacity"],
                        opacity
                    );
                }
            } else {
                alerts = alerts.push(
                    alert.merge({
                        title: appStrings.ALERTS.LAYER_OPACITY_CHANGE_FAILED.title,
                        body: appStrings.ALERTS.LAYER_OPACITY_CHANGE_FAILED.formatString.replace(
                            "{LAYER}",
                            action.layer
                        ),
                        severity: appStrings.ALERTS.LAYER_OPACITY_CHANGE_FAILED.severity,
                        time: new Date()
                    })
                );
            }
        }

        return state.set("alerts", alerts);
    }

    // TODO
    static setLayerPalette(state, action) {
        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
            if (typeof actionLayer === "undefined") {
                return state;
            }
        }

        let newLayer = actionLayer.set("palette", action.palette);
        return state.setIn(["layers", actionLayer.get("type"), actionLayer.get("id")], newLayer);
    }

    static setBasemap(state, action) {
        let alerts = state.get("alerts");

        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
            if (typeof actionLayer === "undefined") {
                alerts = alerts.push(
                    alert.merge({
                        title: appStrings.ALERTS.BASEMAP_UPDATE_FAILED.title,
                        body: appStrings.ALERTS.BASEMAP_UPDATE_FAILED.formatString
                            .replace("{LAYER}", action.layer)
                            .replace("{MAP}", "2D & 3D"),
                        severity: appStrings.ALERTS.BASEMAP_UPDATE_FAILED.severity,
                        time: new Date()
                    })
                );
                return state.set("alerts", alerts);
            }
        }

        if (
            actionLayer.get("type") === appStrings.LAYER_GROUP_TYPE_BASEMAP &&
            !actionLayer.get("isActive")
        ) {
            let anySucceed = state.get("maps").reduce((acc, map) => {
                if (map.setBasemap(actionLayer)) {
                    return true;
                } else {
                    let contextStr = map.is3D ? "3D" : "2D";
                    alerts = alerts.push(
                        alert.merge({
                            title: appStrings.ALERTS.BASEMAP_UPDATE_FAILED.title,
                            body: appStrings.ALERTS.BASEMAP_UPDATE_FAILED.formatString
                                .replace("{LAYER}", actionLayer.get("title"))
                                .replace("{MAP}", contextStr),
                            severity: appStrings.ALERTS.BASEMAP_UPDATE_FAILED.severity,
                            time: new Date()
                        })
                    );
                }
                return acc;
            }, false);

            if (anySucceed) {
                let basemapList = state
                    .getIn(["layers", appStrings.LAYER_GROUP_TYPE_BASEMAP])
                    .map(layer => {
                        if (layer.get("id") === actionLayer.get("id")) {
                            return layer.set("isActive", true);
                        }
                        return layer.set("isActive", false);
                    });
                state = state.setIn(["layers", appStrings.LAYER_GROUP_TYPE_BASEMAP], basemapList);
            }
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
            let basemapList = state
                .getIn(["layers", appStrings.LAYER_GROUP_TYPE_BASEMAP])
                .map(layer => {
                    return layer.set("isActive", false);
                });
            state = state.setIn(["layers", appStrings.LAYER_GROUP_TYPE_BASEMAP], basemapList);
        }
        return state;
    }

    static ingestLayerConfig(state, action) {
        if (action.options.type === appStrings.LAYER_CONFIG_JSON) {
            let currPartials = state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL]);
            let newPartials = this.generatePartialsListFromJson(action.config, action.options);
            return state.setIn(
                ["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL],
                currPartials.concat(newPartials)
            );
        } else if (action.options.type === appStrings.LAYER_CONFIG_WMTS_XML) {
            let currPartials = state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL]);
            let newPartials = this.generatePartialsListFromWmtsXml(action.config, action.options);
            return state.setIn(
                ["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL],
                currPartials.concat(newPartials)
            );
        } else if (action.options.type === appStrings.LAYER_CONFIG_WMS_XML) {
            let currPartials = state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL]);
            let newPartials = this.generatePartialsListFromWmsXml(action.config, action.options);
            return state.setIn(
                ["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL],
                currPartials.concat(newPartials)
            );
        } else {
            console.warn("Error in MapReducer.ingestLayerConfig: Could not ingest layer config");
        }
        return state;
    }

    static mergeLayers(state, action) {
        let partials = state.getIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL]);
        let refPartial = null;
        let matchingPartials = null;
        let mergedLayer = null;
        let newLayers = null;
        let unmatchedLayers = Immutable.List();
        while (partials.size > 0) {
            // grab a partial
            refPartial = partials.last();
            // remove it from future evaluation
            partials = partials.pop();
            // grab matching partials
            matchingPartials = partials.filter(el => {
                return el.get("id") === refPartial.get("id");
            });
            // remove them from future evaluation
            partials = partials.filter(el => {
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
            mergedLayer = this.getLayerModel().mergeDeep(mergedLayer);

            // put the newly minted layer into state storage
            if (
                typeof mergedLayer.get("id") !== "undefined" &&
                typeof state.getIn(["layers", mergedLayer.get("type")]) !== "undefined"
            ) {
                state = state.setIn(
                    ["layers", mergedLayer.get("type"), mergedLayer.get("id")],
                    mergedLayer
                );
            } else {
                unmatchedLayers = unmatchedLayers.push(mergedLayer);
            }
        }

        if (unmatchedLayers.size > 0) {
            console.warn(
                "Error in MapReducer.mergeLayers: could not store merged layers; missing a valid id or type.",
                unmatchedLayers
            );
        }

        if (appConfig.DELETE_LAYER_PARTIALS) {
            return state.removeIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL]); // remove the partials list so that it doesn't intrude later
        }
        return state.setIn(["layers", appStrings.LAYER_GROUP_TYPE_PARTIAL], unmatchedLayers); // store only unmatched partials
    }

    static activateDefaultLayers(state, action) {
        // we use an explicit group order to avoid issues with draw initialization

        let defaultBasemaps = state
            .getIn(["layers", appStrings.LAYER_GROUP_TYPE_BASEMAP])
            .filter(layer => {
                return layer.get("isDefault");
            });

        let defaultDataLayers = state
            .getIn(["layers", appStrings.LAYER_GROUP_TYPE_DATA])
            .filter(layer => {
                return layer.get("isDefault");
            });

        let defaultReferenceLayers = state
            .getIn(["layers", appStrings.LAYER_GROUP_TYPE_REFERENCE])
            .filter(layer => {
                return layer.get("isDefault");
            });

        defaultBasemaps.forEach(layer => {
            state = this.setBasemap(state, { layer: layer });
        });

        defaultDataLayers.forEach(layer => {
            state = this.setLayerActive(state, { layer: layer, active: true });
        });

        defaultReferenceLayers.forEach(layer => {
            state = this.setLayerActive(state, { layer: layer, active: true });
        });

        return state;
    }

    static setMapDate(state, action) {
        let alerts = state.get("alerts");
        let date = action.date;
        let anyMapFail = false;

        // shortcut non-updates
        if (date === state.get("date")) {
            return state;
        }

        // type check, if string we need to do certain validations
        if (typeof date === "string") {
            // If the date is a today string we always convert to start of local today
            if (date.toLowerCase() === "today") {
                date = moment(new Date()).startOf("day");
            } else {
                date = moment(date, "YYYY-MM-DD", true).startOf("day");
            }
            // Now check date validity after being momentified
            if (date.isValid()) {
                date = date.toDate();
            } else {
                alerts = alerts.push(
                    alert.merge({
                        title: appStrings.ALERTS.SET_DATE_FAILED.title,
                        body: appStrings.ALERTS.SET_DATE_FAILED.formatString.replace(
                            "{MAP}",
                            "2D & 3D"
                        ),
                        severity: appStrings.ALERTS.SET_DATE_FAILED.severity,
                        time: new Date()
                    })
                );
                return state.set("alerts", alerts);
            }
        }

        // make sure we are in bounds
        if (moment(date).isBefore(moment(appConfig.MIN_DATE))) {
            date = appConfig.MIN_DATE;
        } else if (moment(date).isAfter(moment(appConfig.MAX_DATE))) {
            date = appConfig.MAX_DATE;
        }

        // update each map
        state.get("maps").forEach(map => {
            if (map.setMapDate(date)) {
                // update each layer on the map
                state.get("layers").forEach(layerSection => {
                    layerSection.forEach(layer => {
                        if (layer.get("isActive") && layer.get("updateParameters").get("time")) {
                            // update the layer and track if any fail
                            if (!map.updateLayer(layer)) {
                                let contextStr = map.is3D ? "3D" : "2D";
                                alerts = alerts.push(
                                    alert.merge({
                                        title: appStrings.ALERTS.SET_DATE_FAILED.title,
                                        body: appStrings.ALERTS.SET_DATE_FAILED.formatString.replace(
                                            "{MAP}",
                                            contextStr
                                        ),
                                        severity: appStrings.ALERTS.SET_DATE_FAILED.severity,
                                        time: new Date()
                                    })
                                );
                                anyMapFail = true;
                            }
                        }
                    });
                });
            } else {
                let contextStr = map.is3D ? "3D" : "2D";
                alerts = alerts.push(
                    alert.merge({
                        title: appStrings.ALERTS.SET_DATE_FAILED.title,
                        body: appStrings.ALERTS.SET_DATE_FAILED.formatString.replace(
                            "{MAP}",
                            contextStr
                        ),
                        severity: appStrings.ALERTS.SET_DATE_FAILED.severity,
                        time: new Date()
                    })
                );
                anyMapFail = true;
            }
        });

        // only update date if everything went well
        if (!anyMapFail) {
            state = state.set("date", date);
        }

        return state.set("alerts", alerts);
    }

    static pixelHover(state, action) {
        let pixelCoordinate = state.getIn(["view", "pixelHoverCoordinate"]).set("isValid", false);
        state.get("maps").forEach(map => {
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
        state.get("maps").forEach(map => {
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
        return state.set(
            "alerts",
            state.get("alerts").filter(alert => {
                return alert !== remAlert;
            })
        );
    }

    static dismissAllAlerts(state, action) {
        return state.set("alerts", state.get("alerts").clear());
    }

    static moveLayerToTop(state, action) {
        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
            if (typeof actionLayer === "undefined") {
                return state;
            }
        }

        state.get("maps").map(map => {
            map.moveLayerToTop(actionLayer);
        });

        state = this.updateLayerOrder(state, {});

        return state;
    }

    static moveLayerToBottom(state, action) {
        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
            if (typeof actionLayer === "undefined") {
                return state;
            }
        }

        state.get("maps").map(map => {
            map.moveLayerToBottom(actionLayer);
        });

        state = this.updateLayerOrder(state, {});

        return state;
    }

    static moveLayerUp(state, action) {
        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
            if (typeof actionLayer === "undefined") {
                return state;
            }
        }

        state.get("maps").map(map => {
            map.moveLayerUp(actionLayer);
        });

        state = this.updateLayerOrder(state, {});

        return state;
    }

    static moveLayerDown(state, action) {
        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
            if (typeof actionLayer === "undefined") {
                return state;
            }
        }

        state.get("maps").map(map => {
            map.moveLayerDown(actionLayer);
        });

        state = this.updateLayerOrder(state, {});

        return state;
    }

    static updateLayerOrder(state, action) {
        // use the 2D map as it sorts all layer types together
        const map2D = state.getIn(["maps", appStrings.MAP_LIB_2D]);

        let layerOrder = map2D.getActiveLayerIds();
        for (let i = 0; i < layerOrder.length; ++i) {
            state = state.setIn(
                ["layers", appStrings.LAYER_GROUP_TYPE_DATA, layerOrder[i], "displayIndex"],
                layerOrder.length - i
            );
        }

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
        state.get("maps").forEach(map => {
            // Only add geometry to inactive maps
            if (!map.isActive) {
                if (!map.addGeometry(action.geometry, action.interactionType, action.geodesic)) {
                    let contextStr = map.is3D ? "3D" : "2D";
                    alerts = alerts.push(
                        alert.merge({
                            title: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.title,
                            body: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.formatString.replace(
                                "{MAP}",
                                contextStr
                            ),
                            severity: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.severity,
                            time: new Date()
                        })
                    );
                }
            }
        });

        return state.set("alerts", alerts);
    }

    static addMeasurementLabelToGeometry(state, action) {
        let alerts = state.get("alerts");

        // calculate measurement from geometry
        let measurement = this.mapUtil.measureGeometry(action.geometry, action.measurementType);

        // convert measurement to selected scale units
        let measurementInSelectedScaleUnits;
        if (action.measurementType === appStrings.MEASURE_AREA) {
            measurementInSelectedScaleUnits = this.mapUtil.convertAreaUnits(
                measurement,
                action.units
            );
        } else if (action.measurementType === appStrings.MEASURE_DISTANCE) {
            measurementInSelectedScaleUnits = this.mapUtil.convertDistanceUnits(
                measurement,
                action.units
            );
        } else {
            // If unrecognized measurement type, create an alert and do not continue
            alerts = alerts.push(
                alert.merge({
                    title: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.title,
                    body: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.formatString.replace(
                        "{MAP}",
                        "2D & 3D"
                    ),
                    severity: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.severity,
                    time: new Date()
                })
            );
            return state.set("alerts", alerts);
        }

        // format measurement label
        let measurementLabel = this.mapUtil.formatMeasurement(
            measurementInSelectedScaleUnits,
            action.measurementType,
            action.units
        );

        // determine measurement label position from geometry
        let measurementPosition = this.mapUtil.getLabelPosition(action.geometry);
        let labelMeta = {
            meters: measurement,
            measurementType: action.measurementType,
            interactionType: appStrings.INTERACTION_MEASURE
        };

        // add label to all maps since it's not done automatically for anyone
        state.get("maps").forEach(map => {
            if (!map.addLabel(measurementLabel, measurementPosition, labelMeta)) {
                let contextStr = map.is3D ? "3D" : "2D";
                alerts = alerts.push(
                    alert.merge({
                        title: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.title,
                        body: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.formatString.replace(
                            "{MAP}",
                            contextStr
                        ),
                        severity: appStrings.ALERTS.GEOMETRY_SYNC_FAILED.severity,
                        time: new Date()
                    })
                );
            }
        });

        return state.set("alerts", alerts);
    }

    static removeAllDrawings(state, action) {
        state = this.disableDrawing(state, action);
        state = this.disableMeasuring(state, action);

        let alerts = state.get("alerts");
        state.get("maps").forEach(map => {
            if (!map.removeAllDrawings()) {
                let contextStr = map.is3D ? "3D" : "2D";
                alerts = alerts.push(
                    alert.merge({
                        title: appStrings.ALERTS.GEOMETRY_REMOVAL_FAILED.title,
                        body: appStrings.ALERTS.GEOMETRY_REMOVAL_FAILED.formatString.replace(
                            "{MAP}",
                            contextStr
                        ),
                        severity: appStrings.ALERTS.GEOMETRY_REMOVAL_FAILED.severity,
                        time: new Date()
                    })
                );
            }
        });

        return state.set("alerts", alerts);
    }

    static removeAllMeasurements(state, action) {
        state = this.disableMeasuring(state, action);
        state = this.disableDrawing(state, action);

        let alerts = state.get("alerts");
        state.get("maps").forEach(map => {
            if (!map.removeAllMeasurements()) {
                let contextStr = map.is3D ? "3D" : "2D";
                alerts = alerts.push(
                    alert.merge({
                        title: appStrings.ALERTS.MEASUREMENT_REMOVAL_FAILED.title,
                        body: appStrings.ALERTS.MEASUREMENT_REMOVAL_FAILED.formatString.replace(
                            "{MAP}",
                            contextStr
                        ),
                        severity: appStrings.ALERTS.MEASUREMENT_REMOVAL_FAILED.severity,
                        time: new Date()
                    })
                );
            }
        });

        return state.set("alerts", alerts);
    }

    static resetApplicationState(state, action) {
        let newState = state;

        // set data/reference layers opacity to 1
        newState.getIn(["layers", appStrings.LAYER_GROUP_TYPE_DATA]).forEach(layer => {
            newState = this.setLayerOpacity(newState, {
                layer,
                opacity: 1
            });
        });
        newState.getIn(["layers", appStrings.LAYER_GROUP_TYPE_REFERENCE]).forEach(layer => {
            newState = this.setLayerOpacity(newState, {
                layer,
                opacity: 1
            });
        });

        // turn off data/reference layers
        newState.getIn(["layers", appStrings.LAYER_GROUP_TYPE_DATA]).forEach(layer => {
            newState = this.setLayerActive(newState, {
                layer,
                active: false
            });
        });
        newState.getIn(["layers", appStrings.LAYER_GROUP_TYPE_REFERENCE]).forEach(layer => {
            newState = this.setLayerActive(newState, {
                layer,
                active: false
            });
        });

        // set view to 2D
        newState = this.setMapViewMode(newState, {
            mode: appStrings.MAP_VIEW_MODE_2D
        });

        // set view extent to global
        newState = this.setMapView(newState, {
            viewInfo: {
                extent: appConfig.DEFAULT_BBOX_EXTENT
            },
            targetActiveMap: true
        });

        // set date to today
        newState = this.setMapDate(newState, { date: appConfig.DEFAULT_DATE });

        // set scale units
        newState = this.setScaleUnits(newState, {
            units: appConfig.DEFAULT_SCALE_UNITS
        });

        // set terrain exaggeration
        newState = this.setTerrainExaggeration(newState, {
            terrainExaggeration: appConfig.DEFAULT_TERRAIN_EXAGGERATION
        });

        // Remove all user vector geometries
        newState = this.removeAllDrawings(newState, {});

        // Remove all measurements
        newState = this.removeAllMeasurements(newState, {});

        // turn on the default layers
        newState = this.activateDefaultLayers(newState, {});

        return newState;
    }

    /****************/
    /*   helpers   */
    /****************/

    static findLayerById(state, layerId) {
        let layer = undefined;

        // search through layer lists
        state.get("layers").forEach(layerList => {
            if (Immutable.Map.isMap(layerList)) {
                if (layerList.has(layerId)) {
                    layer = layerList.get(layerId);
                    return false;
                }
            } else {
                layer = layerList.find(entry => {
                    return entry.get("id") === layerId;
                });
                if (typeof layer !== "undefined") {
                    return false;
                }
            }
        });
        if (typeof layer === "undefined") {
            console.warn(
                "Error in MapReducer.findLayerById: Could not resolve layer from id - ",
                layerId
            );
        }
        return layer;
    }

    static readPalette(palette) {
        return this.getPaletteModel().merge({
            id: palette.name,
            values: Immutable.List(
                palette.values.map(entry => {
                    return Immutable.Map({
                        value: entry[0],
                        color: this.miscUtil.getHexFromColorString(entry[1])
                    });
                })
            )
        });
    }

    static generatePartialsListFromJson(config, options) {
        return config.layers.map(layer => {
            let newLayer = Immutable.fromJS(layer);
            return newLayer.set("fromJson", true);
        });
    }

    static generatePartialsListFromWmtsXml(config, options) {
        let capabilities = this.mapUtil.parseWMTSCapabilities(config);
        if (capabilities) {
            let layers = capabilities.Contents.Layer;
            let newLayers = layers.map(layer => {
                let mappingOptions = this.mapUtil.getWmtsOptions({
                    capabilities: capabilities,
                    options: {
                        layer: layer.Identifier,
                        matrixSet: layer.TileMatrixSetLink[0].TileMatrixSet
                    },
                    requestOptions: options
                });
                return {
                    id: layer.Identifier,
                    title: layer.Title,
                    fromJson: false,
                    handleAs: appStrings.LAYER_WMTS_RASTER,
                    mappingOptions: mappingOptions
                };
            });
            return Immutable.fromJS(newLayers);
        }
        return [];
    }

    static generatePartialsListFromWmsXml(config, options) {
        let capabilities = this.mapUtil.parseWMSCapabilities(config);
        // console.log(capabilities, options);
        if (capabilities) {
            let layers = capabilities.Capability.Layer.Layer;
            let newLayers = layers.map(layer => {
                let id = layer.Identifier || layer.Name;
                let wmsOptions = this.mapUtil.getWmsOptions({
                    capabilities: capabilities,
                    options: {
                        layer: id
                    },
                    requestOptions: options
                });
                return {
                    id: id,
                    title: layer.Title,
                    fromJson: false,
                    handleAs: appStrings.LAYER_WMS_RASTER,
                    mappingOptions: wmsOptions
                };
            });
            return Immutable.fromJS(newLayers);
        }
        return [];
    }
}
