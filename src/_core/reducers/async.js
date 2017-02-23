import * as actionTypes from '_core/constants/actionTypes';
import { asyncState } from '_core/reducers/models/async';
import AsyncReducer from '_core/reducers/reducerFunctions/AsyncReducer';

export default function asynchronous(state = asyncState, action, opt_reducer = AsyncReducer) {
    switch (action.type) {
        case actionTypes.INITIAL_DATA_LOADING:
            return opt_reducer.initialDataLoading(state, action);

        case actionTypes.INITIAL_DATA_LOADED:
            return opt_reducer.initialDataLoaded(state, action);

        case actionTypes.LAYER_DATA_LOADING:
            return opt_reducer.layerDataLoading(state, action);

        case actionTypes.LAYER_DATA_LOADED:
            return opt_reducer.layerDataLoaded(state, action);

        case actionTypes.PALETTE_DATA_LOADING:
            return opt_reducer.paletteDataLoading(state, action);

        case actionTypes.PALETTE_DATA_LOADED:
            return opt_reducer.paletteDataLoaded(state, action);

        case actionTypes.LAYER_METADATA_LOADING:
            return opt_reducer.metadataLoading(state, action);

        case actionTypes.LAYER_METADATA_LOADED:
            return opt_reducer.metadataLoaded(state, action);

        case actionTypes.DISMISS_ALERT:
            return opt_reducer.dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return opt_reducer.dismissAllAlerts(state, action);

        default:
            return state;
    }
}