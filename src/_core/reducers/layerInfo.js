/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actionTypes from "_core/constants/actionTypes";
import { layerInfoState } from "_core/reducers/models/layerInfo";
import LayerInfoReducer from "_core/reducers/reducerFunctions/LayerInfoReducer";

export default function layerInfo(state = layerInfoState, action, opt_reducer = LayerInfoReducer) {
    switch (action.type) {
        case actionTypes.OPEN_LAYER_INFO:
            return opt_reducer.openLayerInfo(state, action);

        case actionTypes.CLOSE_LAYER_INFO:
            return opt_reducer.closeLayerInfo(state, action);

        case actionTypes.SET_CURRENT_METADATA:
            return opt_reducer.setCurrentMetadata(state, action);

        default:
            return state;
    }
}
