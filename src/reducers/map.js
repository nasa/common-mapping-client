import Immutable from 'immutable';
import * as actionTypes from '../constants/actionTypes';
import { mapState, layerModel, paletteModel } from './models/map';
import { alert } from './models/view';
import MapUtil from '../utils/MapUtil.js';
import MiscUtil from '../utils/MiscUtil.js';
import * as mapStrings from '../constants/mapStrings';
import * as mapConfig from '../config/mapConfig';

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

const toggle2D3D = (state, action) => {
    let newVal = !state.getIn(["view", "in3DMode"]);
    state = state.set("maps", state.get("maps").map((map) => {
        if (map.is3D) {
            map.isActive = newVal;
        } else {
            map.isActive = !newVal;
        }
        return map;
    }));
    return state.setIn(["view", "in3DMode"], newVal);
};

const togglePoliticalBoundaries = (state, action) => {
    // get the political boundaries layer
    let politicalBoundariesLayer = state.getIn(["layers", "reference"]).find((el) => {
        return el.get("refType") === "features";
    });
    if (typeof politicalBoundariesLayer !== "undefined") {
        // store is previous state
        let prevState = politicalBoundariesLayer.get("isActive");
        // toggle the layer
        state = toggleLayer(state, { layer: politicalBoundariesLayer });
        // retrieve the updated layer
        politicalBoundariesLayer = state.getIn(["layers", "reference"]).find((el) => {
            return el.get("refType") === "features";
        });
        // verify it was toggled
        if (politicalBoundariesLayer.get("isActive") !== prevState) {
            return state.setIn(["displaySettings", "displayPoliticalBoundaries"], !state.getIn(["displaySettings", "displayPoliticalBoundaries"]));
        }
    }
    return state;
};

const togglePlaceLabels = (state, action) => {
    // get the place labels layer
    let placeLabelsLayer = state.getIn(["layers", "reference"]).find((el) => {
        return el.get("refType") === "labels";
    });
    if (typeof placeLabelsLayer !== "undefined") {
        // store is previous state
        let prevState = placeLabelsLayer.get("isActive");
        // toggle the layer
        state = toggleLayer(state, { layer: placeLabelsLayer });
        // retrieve the updated layer
        placeLabelsLayer = state.getIn(["layers", "reference"]).find((el) => {
            return el.get("refType") === "labels";
        });
        // verify it was toggled
        if (placeLabelsLayer.get("isActive") !== prevState) {
            return state.setIn(["displaySettings", "displayPlaceLabels"], !state.getIn(["displaySettings", "displayPlaceLabels"]));
        }
    }
    return state;
};
const toggleEnableTerrain = (state, action) => {
    let anySucceed = state.get("maps").reduce((acc, map) => {
        if (map.enableTerrain(!state.getIn(["displaySettings", "enableTerrain"]))) {
            return true;
        }
        return acc;
    }, false);

    if (anySucceed) {
        return state.setIn(["displaySettings", "enableTerrain"], !state.getIn(["displaySettings", "enableTerrain"]));
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
const setViewInfo = (state, action) => {
    let alerts = state.get("alerts");
    // TODO split out projection changes?
    let anySucceed = state.get("maps").reduce((acc, map) => {
        // Only apply view to opposite mode map
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
        return state;
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
        return state;
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
const toggleLayer = (state, action) => {
    let alerts = state.get("alerts");
    let anySucceed = state.get("maps").reduce((acc, map) => {
        if (map.toggleLayer(action.layer)) {
            return true;
        } else {
            alerts = alerts.push(alert.merge({
                title: "Toggle Layer Failed",
                body: "One of the maps failed to toggle that layer. We don't know why, and neither do you.",
                severity: 3,
                time: new Date()
            }));
        }
        return acc;
    }, false);

    if (anySucceed) {
        let layerList = state.getIn(["layers", action.layer.get("type")]);
        if (typeof layerList !== "undefined") {
            let newLayer = action.layer.set("isActive", !action.layer.get("isActive"));
            let index = layerList.findKey((layer) => {
                return layer.get("id") === action.layer.get("id");
            });
            return state
                .setIn(["layers", action.layer.get("type")], layerList.set(index, newLayer))
                .set("alerts", alerts);
        }
        return state.set("alerts", alerts);
    }
    return state.set("alerts", alerts);
};
const setLayerOpacity = (state, action) => {
    let anySucceed = state.get("maps").reduce((acc, map) => {
        if (map.setLayerOpacity(action.layer, action.opacity)) {
            return true;
        }
        return acc;
    }, false);

    if (anySucceed) {
        let layerList = state.getIn(["layers", action.layer.get("type")]);
        if (typeof layerList !== "undefined") {
            let newLayer = action.layer.set("opacity", action.opacity);
            let index = layerList.findKey((layer) => {
                return layer.get("id") === action.layer.get("id");
            });
            return state.setIn(["layers", action.layer.get("type")], layerList.set(index, newLayer));
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
    let anySucceed = state.get("maps").reduce((acc, map) => {
        if (map.setBasemap(action.layer)) {
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
        let layerList = state.getIn(["layers", action.layer.get("type")]);
        if (typeof layerList !== "undefined") {
            layerList = layerList.map((layer) => {
                if (layer.get("id") === action.layer.get("id")) {
                    return layer.set("isActive", true);
                }
                return layer.set("isActive", false);
            });
            return state
                .setIn(["layers", action.layer.get("type")], layerList)
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
                return acc.merge(el);
            }
            return el.merge(acc);
        }, refPartial);
        // merge in the default values
        mergedLayer = layerModel.merge(mergedLayer);
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
            if (layer.get("isDefault") && !layer.get("isActive")) {
                let anySucceed = state.get("maps").reduce((acc, map) => {
                    if (layer.get("type") === "basemap") {
                        if (map.setBasemap(layer)) {
                            return true;
                        }
                    } else {
                        if (map.toggleLayer(layer)) {
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

export default function map(state = mapState, action) {
    switch (action.type) {
        case actionTypes.INITIALIZE_MAP:
            return initializeMap(state, action);

        case actionTypes.TOGGLE_2D_3D:
            return toggle2D3D(state, action);

        case actionTypes.TOGGLE_POLITICAL_BOUNDARIES:
            return togglePoliticalBoundaries(state, action);

        case actionTypes.TOGGLE_PLACE_LABELS:
            return togglePlaceLabels(state, action);

        case actionTypes.TOGGLE_ENABLE_TERRAIN:
            return toggleEnableTerrain(state, action);

        case actionTypes.SET_SCALE_UNITS:
            return setScaleUnits(state, action);

        case actionTypes.SET_MAP_VIEW_INFO:
            return setViewInfo(state, action);

        case actionTypes.ZOOM_IN:
            return zoomIn(state, action);

        case actionTypes.ZOOM_OUT:
            return zoomOut(state, action);

        case actionTypes.RESET_ORIENTATION:
            return resetOrientation(state, action);

        case actionTypes.TOGGLE_LAYER:
            return toggleLayer(state, action);

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

        default:
            return state;
    }
}


/****************/
/*   helpers   */
/****************/

const readPalette = (palette) => {
    switch (palette.handleAs) {
        case mapStrings.COLORBAR_JSON_FIXED:
            return readJsonFixedPalette(palette);
        case mapStrings.COLORBAR_JSON_RELATIVE:
            return readJsonRelativePalette(palette);
        default:
            return false
    }
};

const readJsonFixedPalette = (palette) => {
    return paletteModel.merge({
        id: palette.name,
        handleAs: palette.handleAs,
        values: Immutable.List(palette.values.map((entry) => {
            return Immutable.Map({
                value: parseFloat(entry.value),
                color: MiscUtil.getHexFromColorString(entry.color)
            });
        }))
    });
};

const readJsonRelativePalette = (palette) => {
    return paletteModel.merge({
        id: palette.name,
        handleAs: palette.handleAs,
        values: Immutable.List(palette.values.map((entry) => {
            return Immutable.Map({
                value: parseFloat(entry.scaleIndex),
                color: MiscUtil.getHexFromColorString(entry.color)
            });
        }))
    });
};

const generatePartialsListFromJson = (config) => {
    return config.layers.map((layer) => {
        let newLayer = Immutable.fromJS(layer);
        return newLayer
            .set("fromJson", true);
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
