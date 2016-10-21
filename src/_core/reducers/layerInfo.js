import * as actionTypes from '../constants/actionTypes';
import { layerInfoState } from './models/layerInfo';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const openLayerInfo = (state, action) => {
    return state.set("isOpen", true).set("layer", action.layer);
};

const closeLayerInfo = (state, action) => {
    return state.set("isOpen", false);
};

export default function layerInfo(state = layerInfoState, action) {
    switch (action.type) {
        case actionTypes.OPEN_LAYER_INFO:
            return openLayerInfo(state, action);

        case actionTypes.CLOSE_LAYER_INFO:
            return closeLayerInfo(state, action);

        default:
            return state;
    }
}
