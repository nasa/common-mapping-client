/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as types from "_core/constants/actionTypes";
import { setDate } from "_core/actions/mapActions";

export function beginDragging() {
    return { type: types.BEGIN_DRAGGING };
}

export function endDragging() {
    return { type: types.END_DRAGGING };
}

export function hoverDate(date, x) {
    return { type: types.HOVER_DATE, date, x };
}

export function timelineMouseOut() {
    return { type: types.TIMELINE_MOUSE_OUT };
}

export function setDateResolution(resolution) {
    return { type: types.SET_DATE_RESOLUTION, resolution };
}

export function dragEnd(newDate) {
    return dispatch => {
        return Promise.all([dispatch(endDragging()), dispatch(setDate(newDate))]).catch(err => {
            console.warn("Error in dateSliderActions.dragEnd:", err);
        });
    };
}
