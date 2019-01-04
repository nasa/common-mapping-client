/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import * as actionTypes from "_core/constants/actionTypes";
import appConfig from "constants/appConfig";
import MiscUtil from "_core/utils/MiscUtil";

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const INCLUDED_ACTIONS = new Immutable.List([]);
const EXCLUDED_ACTIONS = new Immutable.List([
    // Map Actions
    actionTypes.SET_LAYER_OPACITY,
    actionTypes.INGEST_LAYER_CONFIG,
    actionTypes.MERGE_LAYERS,
    actionTypes.PIXEL_HOVER,
    actionTypes.INVALIDATE_PIXEL_HOVER,
    actionTypes.INGEST_LAYER_PALETTES,

    // Date Slider Actions
    actionTypes.BEGIN_DRAGGING,
    actionTypes.END_DRAGGING,
    actionTypes.HOVER_DATE,
    actionTypes.TIMELINE_MOUSE_OUT,

    // Misc
    actionTypes.NO_ACTION
]);

export default class AnalyticsReducer {
    static miscUtil = MiscUtil;

    static processAction(state, action) {
        // skip items we don't care about or if analytics is not enabled
        if (
            !state.get("isEnabled") ||
            (INCLUDED_ACTIONS.size > 0 && !INCLUDED_ACTIONS.contains(action.type)) ||
            (EXCLUDED_ACTIONS.size > 0 && EXCLUDED_ACTIONS.contains(action.type))
        ) {
            return state;
        }

        // iterate over action members converting Immutable data to standard JS objects
        for (let param in action) {
            if (action.hasOwnProperty(param)) {
                let val = action[param];
                if (typeof val.toJS !== "undefined") {
                    action[param] = val.toJS();
                }
            }
        }

        // create and store the analytic
        let analytic = {
            sessionId: appConfig.SESSION_ID,
            sequenceId: state.get("sequenceIndex"),
            time: new Date().toISOString(),
            action: action
        };
        state = state
            .set("currentBatch", state.get("currentBatch").push(analytic))
            .set("sequenceIndex", state.get("sequenceIndex") + 1);

        // send batches when 10 actions are gathered
        if (state.get("currentBatch").size >= appConfig.ANALYTICS_BATCH_SIZE) {
            return this.sendAnalyticsBatch(state, action);
        }
        return state;
    }

    static sendAnalyticsBatch(state, action) {
        if (state.get("currentBatch").size > 0) {
            // convert the current batch to a string
            let batch = JSON.stringify({ data: state.get("currentBatch") });
            // post the batch
            this.miscUtil
                .asyncFetch({
                    url: appConfig.URLS.analyticsEndpoint,
                    options: {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: batch
                    }
                })
                .then(
                    data => {
                        console.log("Anlytics push successful.");
                    },
                    err => {
                        console.warn("Error in analytics.sendAnalyticsBatch: ", err);
                    }
                );

            // clear the current batch and update the sent time
            state = state.set("currentBatch", Immutable.List()).set("timeLastSent", new Date());
        }
        return state;
    }

    static setAnalyticsEnabled(state, action) {
        window.localStorage.setItem("analyticsEnabled", action.isEnabled);
        return state.set("isEnabled", action.isEnabled);
    }
}
