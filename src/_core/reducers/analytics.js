/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { analyticsState } from "_core/reducers/models/analytics";
import * as actionTypes from "_core/constants/actionTypes";
import AnalyticsReducer from "_core/reducers/reducerFunctions/AnalyticsReducer";

export default function analytics(state = analyticsState, action, opt_reducer = AnalyticsReducer) {
    switch (action.type) {
        case actionTypes.SET_ANALYTICS_ENABLED:
            return opt_reducer.setAnalyticsEnabled(state, action);
        case actionTypes.SEND_ANALYTICS_BATCH:
            return opt_reducer.sendAnalyticsBatch(state, action);
        default:
            return opt_reducer.processAction(state, action);
    }
}
