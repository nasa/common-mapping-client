import * as actionTypes from '_core/constants/actionTypes';
import { layerInfoState } from './models/layerInfo';
import LayerInfoReducer from './reducerFunctions/LayerInfoReducer';

export default function layerInfo(state = layerInfoState, action) {
    switch (action.type) {
        case actionTypes.OPEN_LAYER_INFO:
            return LayerInfoReducer.openLayerInfo(state, action);

        case actionTypes.CLOSE_LAYER_INFO:
            return LayerInfoReducer.closeLayerInfo(state, action);

        default:
            return state;
    }
}
