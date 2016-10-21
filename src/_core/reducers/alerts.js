import * as actionTypes from '_core/constants/actionTypes';
import { alertState, alert } from './models/alert';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const addAlert = (state, action) => {
    return state.set("alerts", state.get("alerts").push(alert.merge(action.alert)));
};

const dismissAlert = (state, action) => {
    let remAlert = action.alert;
    return state.set("alerts", state.get("alerts").filter((alert) => {
        return alert !== remAlert;
    }));
};

const dismissAllAlerts = (state, action) => {
    return state.set("alerts", state.get("alerts").clear());
};

export default function alerts(state = alertState, action) {
    switch (action.type) {
        case actionTypes.ADD_ALERT:
            return addAlert(state, action);

        case actionTypes.DISMISS_ALERT:
            return dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return dismissAllAlerts(state, action);

        default:
            return state;
    }
}