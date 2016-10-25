import * as actionTypes from '_core/constants/actionTypes';
import { asyncState } from '_core/reducers/models/async';
import AsyncReducer from '_core/reducers/reducerFunctions/AsyncReducer';

export default function asyncronous(state = asyncState, action) {
    switch (action.type) {
        case actionTypes.INITIAL_DATA_LOADING:
            return AsyncReducer.initialDataLoading(state, action);

        case actionTypes.INITIAL_DATA_LOADED:
            return AsyncReducer.initialDataLoaded(state, action);

        case actionTypes.LAYER_DATA_LOADING:
            return AsyncReducer.layerDataLoading(state, action);

        case actionTypes.LAYER_DATA_LOADED:
            return AsyncReducer.layerDataLoaded(state, action);

        case actionTypes.PALETTE_DATA_LOADING:
            return AsyncReducer.paletteDataLoading(state, action);

        case actionTypes.PALETTE_DATA_LOADED:
            return AsyncReducer.paletteDataLoaded(state, action);

        case actionTypes.DISMISS_ALERT:
            return AsyncReducer.dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return AsyncReducer.dismissAllAlerts(state, action);

        default:
            return state;
    }
}