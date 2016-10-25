import { analyticsState } from '_core/reducers/models/analytics';
import * as actionTypes from '_core/constants/actionTypes';
import AnalyticsReducer from '_core/reducers/reducerFunctions/AnalyticsReducer';

export default function analytics(state = analyticsState, action) {
    switch (action.type) {
        case actionTypes.SET_ANALYTICS_ENABLED:
            return AnalyticsReducer.setAnalyticsEnabled(state, action);
        case actionTypes.SEND_ANALYTICS_BATCH:
            return AnalyticsReducer.sendAnalyticsBatch(state, action);
        default:
            return AnalyticsReducer.processAction(state, action);
    }
}
