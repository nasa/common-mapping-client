import * as types from "_core/constants/actionTypes";

export function setAnalyticsEnabled(isEnabled) {
    return { type: types.SET_ANALYTICS_ENABLED, isEnabled };
}

export function sendAnalyticsBatch() {
    return { type: types.SEND_ANALYTICS_BATCH };
}
