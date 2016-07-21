import * as types from '../constants/actionTypes';

export function setAnalyticsEnabled(isEnabled) {
    return { type: types.SET_ANALYTICS_ENABLED, isEnabled };
}