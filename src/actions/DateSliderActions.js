import * as types from '../constants/actionTypes';

export function beginDragging() {
    return { type: types.BEGIN_DRAGGING };
}

export function endDragging() {
    return { type: types.END_DRAGGING };
}

export function setDate(date) {
    return { type: types.SET_MAP_DATE, date };
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

export function setSliderCollapsed(collapsed) {
    return { type: types.SET_SLIDER_COLLAPSED, collapsed };
}

export function setIsSelectionResolution(isSelectingResolution) {
    return { type: types.SET_CHANGING_RESOLUTION, isSelectingResolution };
}

export function dragEnd(newDate) {
    return (dispatch) => {
        return Promise.all([
            dispatch(endDragging()),
            dispatch(setDate(newDate))
        ]).catch((err) => {
            console.warn("ERROR", err);
        });
    };
}
