import fetch from 'isomorphic-fetch';
import { URLS } from '../config/appConfig';
import * as types from '../constants/actionTypes';
import * as mapStrings from '../constants/mapStrings';

export function toggleLayerMenu() {
    return { type: types.TOGGLE_LAYER_MENU };
}

export function toggleLayer(layer) {
    return { type: types.TOGGLE_LAYER, layer };
}

export function changeLayerOpacity(layer, opacity) {
    return { type: types.SET_LAYER_OPACITY, layer, opacity };
}

export function startChangingLayerOpacity(layer) {
    return { type: types.START_CHANGING_OPACITY, layer };
}

export function stopChangingLayerOpacity(layer) {
    return { type: types.STOP_CHANGING_OPACITY, layer };
}

export function changeLayerPalette(layer, palette) {
    return { type: types.SET_LAYER_PALETTE, layer, palette };
}

export function activateDefaultLayers() {
    return {type: types.ACTIVATE_DEFAULT_LAYERS };
}

export function fetchLayers(callback = null) {
    return (dispatch) => {
        dispatch(loadLayers());
        Promise.all(URLS.layerConfig.map((el) => {
                return dispatch(fetchSingleLayerSource(el));
            }))
            .then(() => {
                dispatch(mergeLayers());
                dispatch(layersLoaded());
                if (typeof callback === "function") {
                    callback.call(this);
                }
            })
            .catch((err) => {
                console.warn("ERROR", err);
            });
    };
}
export function fetchSingleLayerSource(options) {
    return (dispatch) => {
        let url = options.url;
        let type = options.type;
        return fetch(url)
            .then((response) => {
                if (type === mapStrings.LAYER_CONFIG_JSON) {
                    return response.json();
                } else if (type === mapStrings.LAYER_CONFIG_WMTS_XML) {
                    return response.text();
                } else {
                    return response;
                }
            })
            .then((resp) => {
                dispatch(ingestLayerConfig(resp, options));
            })
            .catch((err) => {
                console.warn("ERROR LOADING CONFIG", err);
            });
    };
}


// async action helpers
function loadLayers() {
    return { type: types.LOAD_LAYERS };
}

function layersLoaded() {
    return { type: types.LAYERS_LOADED };
}

function ingestLayerConfig(config, options) {
    return { type: types.INGEST_LAYER_CONFIG, config, options };
}

function mergeLayers() {
    return { type: types.MERGE_LAYERS };
}
