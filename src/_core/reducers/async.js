/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actionTypes from "_core/constants/actionTypes";
import { asyncState } from "_core/reducers/models/async";
import AsyncReducer from "_core/reducers/reducerFunctions/AsyncReducer";

export default function asynchronous(state = asyncState, action, opt_reducer = AsyncReducer) {
    switch (action.type) {
        case actionTypes.SET_ASYNC_LOADING_STATE:
            return opt_reducer.setAsyncLoadingState(state, action);
        case actionTypes.DISMISS_ALERT:
            return opt_reducer.dismissAlert(state, action);
        case actionTypes.DISMISS_ALL_ALERTS:
            return opt_reducer.dismissAllAlerts(state, action);
        default:
            return state;
    }
}
