/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as types from "_core/constants/actionTypes";
import { MapAction } from "actions";

export default class DateSliderAction {
    static beginDragging() {
        return { type: types.BEGIN_DRAGGING };
    }

    static endDragging() {
        return { type: types.END_DRAGGING };
    }

    static hoverDate(date, x) {
        return { type: types.HOVER_DATE, date, x };
    }

    static timelineMouseOut() {
        return { type: types.TIMELINE_MOUSE_OUT };
    }

    static setDateResolution(resolution) {
        return { type: types.SET_DATE_RESOLUTION, resolution };
    }

    static dragEnd(newDate) {
        return dispatch => {
            return Promise.all([
                dispatch(this.endDragging()),
                dispatch(MapAction.setDate(newDate))
            ]).catch(err => {
                console.warn("Error in dateSliderActions.dragEnd:", err);
            });
        };
    }
}
