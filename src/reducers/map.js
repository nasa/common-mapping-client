import Immutable from 'immutable';
import * as actionTypes from '../constants/actionTypes';
import { mapState, layerModel, paletteModel } from './models/map';
import { alert } from './models/view';
import MapUtil from '../utils/MapUtil.js';
import MiscUtil from '../utils/MiscUtil.js';
import * as mapStrings from '../constants/mapStrings';
import * as mapConfig from '../constants/mapConfig';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const initializeMap = (state, action) => {
    let map = MapUtil.createMap(action.mapType, action.container, state);
    if (map) {
        return state.setIn(["maps", action.mapType], map);
    }
    return state.set("alerts", state.get("alerts").push(alert.merge({
        title: "Map Creation Failed",
        body: "One of the maps failed to initialize",
        severity: 5,
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
                alerts = alerts.push(alert.merge({
                    title: "View Synchronization Failed",
                    body: "One of the maps failed to synchronize its view",
                    severity: 3,
                    time: new Date()
                }));
            }
        }
        return acc;
    }, false);

    if (anySucceed) {
        return state
            .setIn(["view", "zoom"], action.viewInfo.zoom || state.getIn(["view", "zoom"]))
            .setIn(["view", "center"], action.viewInfo.center || state.getIn(["view", "center"]))
            .setIn(["view", "extent"], action.viewInfo.extent || state.getIn(["view", "extent"]))
            .setIn(["view", "projection"], action.viewInfo.projection || state.getIn(["view", "projection"]))
            .set("alerts", alerts);
    }
    return state;
};
const setViewInfo = (state, action) => {
    let alerts = state.get("alerts");
    // TODO split out projection changes?
    let anySucceed = state.get("maps").reduce((acc, map) => {
        // Only apply view to inactive map
        if (!map.isActive) {
            if (map.setExtent(action.viewInfo.extent)) {
                return true;
            } else {
                alerts = alerts.push(alert.merge({
                    title: "View Synchronization Failed",
                    body: "One of the maps failed to synchronize its view",
                    severity: 3,
                    time: new Date()
                }));
            }
        }
        return acc;
    }, false);

    if (anySucceed) {
        return state
            .setIn(["view", "zoom"], action.viewInfo.zoom || state.getIn(["view", "zoom"]))
            .setIn(["view", "center"], action.viewInfo.center || state.getIn(["view", "center"]))
            .setIn(["view", "extent"], action.viewInfo.extent || state.getIn(["view", "extent"]))
            .setIn(["view", "projection"], action.viewInfo.projection || state.getIn(["view", "projection"]))
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
            if (map.resetOrientation()) {
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
                alerts = alerts.push(alert.merge({
                    title: "Activate Layer Failed",
                    body: "One of the maps failed to activate that layer. We don't know why, and neither do you.",
                    severity: 3,
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

const setLayerOpacity = (state, action) => {

    // resolve layer from id if necessary
    let actionLayer = action.layer;
    if (typeof actionLayer === "string") {
        actionLayer = findLayerById(state, actionLayer);
    }

    let anySucceed = state.get("maps").reduce((acc, map) => {
        if (map.setLayerOpacity(actionLayer, action.opacity)) {
            return true;
        }
        return acc;
    }, false);

    if (anySucceed) {
        let layerList = state.getIn(["layers", actionLayer.get("type")]);
        if (typeof layerList !== "undefined") {
            let newLayer = actionLayer.set("opacity", action.opacity);
            let index = layerList.findKey((layer) => {
                return layer.get("id") === actionLayer.get("id");
            });
            return state.setIn(["layers", actionLayer.get("type")], layerList.set(index, newLayer));
        }
        return state;
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
            alerts = alerts.push(alert.merge({
                title: "Basemap Update Failed",
                body: "One of the maps failed to update its basemap. We don't know why, and neither do you.",
                severity: 3,
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
        let layerList = state.getIn(["layers", "basemap"]);
        if (typeof layerList !== "undefined") {
            layerList = layerList.map((layer) => {
                return layer.set("isActive", false);
            });
            return state.setIn(["layers", "basemap"], layerList);
        }
        return state;
    }
    return state;
};
const ingestLayerConfig = (state, action) => {
    if (action.options.type === mapStrings.LAYER_CONFIG_JSON) {
        let currPartials = state.getIn(["layers", "partial"]);
        let newPartials = generatePartialsListFromJson(action.config);
        return state.setIn(["layers", "partial"], currPartials.concat(newPartials));
    } else if (action.options.type === mapStrings.LAYER_CONFIG_WMTS_XML) {
        let currPartials = state.getIn(["layers", "partial"]);
        let newPartials = generatePartialsListFromWmtsXml(action.config);
        return state.setIn(["layers", "partial"], currPartials.concat(newPartials));
    } else {
        console.warn("could not ingest layer config");
    }
    return state;
};
const mergeLayers = (state, action) => {
    let partials = state.getIn(["layers", "partial"]);
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
        // put the newly minted layer into state storage
        newLayers = state.getIn(["layers", mergedLayer.get("type")]);
        if (typeof newLayers !== "undefined") {
            state = state.setIn(["layers", mergedLayer.get("type")], newLayers.push(mergedLayer));
        }
    }
    return state.removeIn(["layers", "partial"]); // remove the partials list so that it doesn't intrude later
};

const activateDefaultLayers = (state, action) => {
    return state.set("layers", state.get("layers").map((layerSet) => {
        return layerSet.map((layer) => {
            if (layer.get("isDefault")) {
                let anySucceed = state.get("maps").reduce((acc, map) => {
                    if (layer.get("type") === "basemap") {
                        if (map.setBasemap(layer)) {
                            return true;
                        }
                    } else {
                        if (map.setLayerActive(layer, true)) {
                            return true;
                        }
                    }
                    return acc;
                }, false);
                if (anySucceed) {
                    return layer.set("isActive", true);
                }
            }
            return layer;
        });
    }));
};

const setMapDate = (state, action) => {
    // update the layer objects
    state = state.set("layers", state.get("layers").map((layerSection) => {
        return layerSection.map((layer) => {
            return layer.set("time", action.date.toISOString().split("T")[0]);
        });
    }));

    // update the layers on the map
    state.get("maps").map((map) => {
        // only updated data layers, should we update basemaps and reference layers too?
        state.getIn(["layers", "data"]).map((layer) => {
            if (!map.updateLayer(layer)) {
                console.log("couldn't update layer, probably need alert here?");
            }
            return layer;
        });
        return map;
    });
    return state.set("date", action.date);
};

const endDragging = (state, action) => {
    return state.set("date", action.newDate);
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

const dismissAlert = (state, action) => {
    let remAlert = action.alert;
    return state.set("alerts", state.get("alerts").filter((alert) => {
        return alert !== remAlert;
    }));
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

const resetApplicationState = (state, action) => {
    let newState = state;

    // set data/reference layers opacity to 1
    newState.getIn(["layers", "data"]).forEach((layer) => {
        newState = setLayerOpacity(newState, { layer, opacity: 1 });
    });
    newState.getIn(["layers", "reference"]).forEach((layer) => {
        newState = setLayerOpacity(newState, { layer, opacity: 1 });
    });

    // turn off data/reference layers
    newState.getIn(["layers", "data"]).forEach((layer) => {
        newState = setLayerActive(newState, { layer, active: false });
    });
    newState.getIn(["layers", "reference"]).forEach((layer) => {
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
    newState = setMapDate(newState, {date: new Date()});

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

        case actionTypes.DISMISS_ALERT:
            return dismissAlert(state, action);

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
                    matrixSet: layer.matrixSet
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
