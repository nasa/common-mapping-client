/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import { alert } from "_core/reducers/models/alert";
import * as appStrings from "_core/constants/appStrings";

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class AsyncReducer {
    static setAsyncLoadingState(state, action) {
        if (!state.has(action.key)) {
            let alerts = state.get("alerts");
            alerts = alerts.push(
                alert.merge({
                    title: appStrings.ALERTS.UNKNOWN_ASYNC_KEY.title,
                    body: appStrings.ALERTS.UNKNOWN_ASYNC_KEY.formatString.replace(
                        "{KEY}",
                        action.key
                    ),
                    severity: appStrings.ALERTS.UNKNOWN_ASYNC_KEY.severity,
                    time: new Date()
                })
            );
            return state.set("alerts", alerts);
        }
        // Merge newAsyncState into corresponding state object
        return state.set(
            action.key,
            state.get(action.key).merge(Immutable.fromJS(action.newAsyncState))
        );
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
