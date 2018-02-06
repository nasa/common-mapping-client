/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actionTypes from "_core/constants/actionTypes";
import { dateSliderState } from "_core/reducers/models/dateSlider";
import DateSliderReducer from "_core/reducers/reducerFunctions/DateSliderReducer";

export default function dateSlider(
    state = dateSliderState,
    action,
    opt_reducer = DateSliderReducer
) {
    switch (action.type) {
        case actionTypes.BEGIN_DRAGGING:
            return opt_reducer.beginDragging(state, action);

        case actionTypes.END_DRAGGING:
            return opt_reducer.endDragging(state, action);

        case actionTypes.HOVER_DATE:
            return opt_reducer.hoverDate(state, action);

        case actionTypes.TIMELINE_MOUSE_OUT:
            return opt_reducer.timelineMouseOut(state, action);

        case actionTypes.SET_DATE_RESOLUTION:
            return opt_reducer.setDateResolution(state, action);

        case actionTypes.DISMISS_ALERT:
            return opt_reducer.dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return opt_reducer.dismissAllAlerts(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return opt_reducer.resetApplicationState(state, action);

        default:
            return state;
    }
}
