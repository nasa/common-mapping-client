import fetch from 'isomorphic-fetch';
import { URLS } from '../constants/appConfig';
import * as types from '../constants/actionTypes';
import * as mapStrings from '../constants/mapStrings';

export function openLayerInfo(layer) {
    console.log("open with", layer);
    return { type: types.OPEN_LAYER_INFO, layer };
}

export function closeLayerInfo() {
    return { type: types.CLOSE_LAYER_INFO };
}

export function setLayerMenuOpen(open) {
    return { type: types.SET_LAYER_MENU_OPEN, open };
}

export function setLayerActive(layer, active) {
    return { type: types.SET_LAYER_ACTIVE, layer, active };
}

export function setLayerOpacity(layer, opacity) {
    return { type: types.SET_LAYER_OPACITY, layer, opacity };
}

export function startChangingLayerOpacity(layer) {
    return { type: types.START_CHANGING_OPACITY, layer };
}

export function stopChangingLayerOpacity(layer) {
    return { type: types.STOP_CHANGING_OPACITY, layer };
}

export function startChangingLayerPosition(layer) {
    return { type: types.START_CHANGING_POSITION, layer };
}

export function stopChangingLayerPosition(layer) {
    return { type: types.STOP_CHANGING_POSITION, layer };
}

export function changeLayerPalette(layer, palette) {
    return { type: types.SET_LAYER_PALETTE, layer, palette };
}

export function moveLayerToTop(layer) {
    return { type: types.MOVE_LAYER_TO_TOP, layer };
}

export function moveLayerToBottom(layer) {
    return { type: types.MOVE_LAYER_TO_BOTTOM, layer };
}

export function moveLayerUp(layer) {
    return { type: types.MOVE_LAYER_UP, layer };
}

export function moveLayerDown(layer) {
    return { type: types.MOVE_LAYER_DOWN, layer };
}

export function activateDefaultLayers() {
    return { type: types.ACTIVATE_DEFAULT_LAYERS };
}

export function fetchInitialData(callback = null) {
    return (dispatch) => {
        dispatch(loadInitialData());
        return Promise.all([
            dispatch(fetchLayers()),
            dispatch(fetchLayerPalettes())
        ]).then(() => {
            dispatch(initialDataLoaded());
            if (typeof callback === "function") {
                callback.call(this);
            }
        }).catch((err) => {
            console.warn("ERROR", err);
        });
    };
}

export function fetchLayerPalettes() {
    return (dispatch) => {
        let url = URLS.paletteConfig;
        return fetch(url).then((response) => {
            return response.json();
        }).then((resp) => {
            dispatch(ingestLayerPalettes(resp));
        }).catch((err) => {
            console.warn("ERROR LOADING PALETTES", err);
        });
    };
}


export function fetchLayers() {
    return (dispatch) => {
        dispatch(loadLayers());
        return Promise.all(URLS.layerConfig.map((el) => {
            return dispatch(fetchSingleLayerSource(el));
        })).then(() => {
            dispatch(mergeLayers());
            dispatch(layersLoaded());
        }).catch((err) => {
            console.warn("ERROR", err);
        });
    };
}
export function fetchSingleLayerSource(options) {
    return (dispatch) => {
        let url = options.url;
        let type = options.type;
        return fetch(url).then((response) => {
            if (type === mapStrings.LAYER_CONFIG_JSON) {
                return response.json();
            } else if (type === mapStrings.LAYER_CONFIG_WMTS_XML) {
                return response.text();
            } else {
                return response;
            }
        }).then((resp) => {
            dispatch(ingestLayerConfig(resp, options));
        }).catch((err) => {
            console.warn("ERROR LOADING CONFIG", err);
        });
    };
}


// async action helpers

function loadInitialData() {
    return { type: types.LOAD_INITIAL_DATA };
}

function initialDataLoaded() {
    return { type: types.INITIAL_DATA_LOADED };
}

function loadLayerPalettes() {
    return { type: types.LOAD_LAYER_PALETTES };
}

function layerPalettesLoaded() {
    return { type: types.LAYER_PALETTES_LOADED };
}

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

function ingestLayerPalettes(paletteConfig) {
    return { type: types.INGEST_LAYER_PALETTES, paletteConfig };
}
