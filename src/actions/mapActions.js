import * as coreTypes from "_core/constants/actionTypes";
import * as types from "constants/actionTypes";

export function pixelDrag(clickEvt) {
    return { type: types.PIXEL_DRAG, clickEvt };
}

export function mapMoveEnd() {
    return { type: types.MAP_MOVE_END };
}

export function updateFilteredLayer(layer, parameter, value, palette) {
    return { type: types.UPDATE_FILTERED_LAYER, layer, parameter, value, palette };
}

export function setLayerPalette(layer, palette) {
    return { type: coreTypes.SET_LAYER_PALETTE, layer, palette };
}
