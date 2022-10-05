import { mapState } from "reducers/models/map";
import mapCore from "_core/reducers/map";
import MapReducer from "reducers/reducerFunctions/MapReducer";
import * as coreTypes from "_core/constants/actionTypes";
import * as actionTypes from "constants/actionTypes";

export default function map(state = mapState, action, opt_reducer = MapReducer) {
    switch (action.type) {
        case actionTypes.PIXEL_DRAG:
            return opt_reducer.pixelDrag(state, action);
        case actionTypes.MAP_MOVE_END:
            return opt_reducer.mapMoveEnd(state, action);
        case actionTypes.UPDATE_FILTERED_LAYER:
            return opt_reducer.updateFilteredLayer(state, action);
        case coreTypes.SET_LAYER_PALETTE:
            return opt_reducer.setLayerPalette(state, action);
        default:
            return mapCore.call(this, state, action, opt_reducer);
    }
}
