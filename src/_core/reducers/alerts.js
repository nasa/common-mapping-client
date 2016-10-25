import * as actionTypes from '_core/constants/actionTypes';
import { alertState } from '_core/reducers/models/alert';
import AlertsReducer from '_core/reducers/reducerFunctions/AlertsReducer';

export default function alerts(state = alertState, action) {
    switch (action.type) {
        case actionTypes.ADD_ALERT:
            return AlertsReducer.addAlert(state, action);

        case actionTypes.DISMISS_ALERT:
            return AlertsReducer.dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return AlertsReducer.dismissAllAlerts(state, action);

        default:
            return state;
    }
}
