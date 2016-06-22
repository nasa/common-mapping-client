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
