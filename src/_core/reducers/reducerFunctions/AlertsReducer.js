/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { alert } from "_core/reducers/models/alert";

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class AlertsReducer {
    static addAlert(state, action) {
        return state.set("alerts", state.get("alerts").push(alert.merge(action.alert)));
    }

    static dismissAlert(state, action) {
        let remAlert = action.alert;
        return state.set(
            "alerts",
            state.get("alerts").filter(alert => {
                return alert !== remAlert;
            })
        );
    }

    static dismissAllAlerts(state, action) {
        return state.set("alerts", state.get("alerts").clear());
    }
}
