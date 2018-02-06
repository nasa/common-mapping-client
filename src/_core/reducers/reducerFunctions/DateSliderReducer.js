/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import appConfig from "constants/appConfig";
import { alert } from "_core/reducers/models/alert";
import * as appStrings from "_core/constants/appStrings";

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class DateSliderReducer {
    static beginDragging(state, action) {
        return state.set("isDragging", true);
    }

    static endDragging(state, action) {
        return state.set("isDragging", false).setIn(["hoverDate", "isValid"], false);
    }

    static hoverDate(state, action) {
        return state
            .setIn(["hoverDate", "date"], action.date)
            .setIn(["hoverDate", "x"], action.x)
            .setIn(["hoverDate", "isValid"], true);
    }

    static timelineMouseOut(state, action) {
        return state.setIn(["hoverDate", "isValid"], false);
    }

    static setDateResolution(state, action) {
        let alerts = state.get("alerts");
        let actionResolution = action.resolution;
        if (typeof actionResolution === "string") {
            actionResolution = actionResolution.toLowerCase();
            actionResolution = appConfig.DATE_SLIDER_RESOLUTIONS.reduce((acc, res) => {
                if (actionResolution === res.label) {
                    return res;
                }
                return acc;
            }, state.get("resolution").toJS());
        }

        if (actionResolution) {
            // Here we make a new copy of actionResolution instead of preserving original object in
            // order to force an update of TimeAxis resolution since the state value may not have changed
            // since last state *but* the user may have interacted with timeline using mouse zoom which does
            // not get captured in state.
            state = state.set("resolution", Immutable.Map(actionResolution));
        } else {
            alerts = alerts.push(
                alert.merge({
                    title: appStrings.ALERTS.TIMELINE_RES_FAILED.title,
                    body: appStrings.ALERTS.TIMELINE_RES_FAILED.formatString,
                    severity: appStrings.ALERTS.TIMELINE_RES_FAILED.severity,
                    time: new Date()
                })
            );
        }

        return state.set("alerts", alerts);
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

    static resetApplicationState(state, action) {
        let newState = this.endDragging(state, action);
        newState = this.setDateResolution(newState, {
            resolution: appConfig.DEFAULT_DATE_SLIDER_RESOLUTION
        });
        return newState;
    }
}
