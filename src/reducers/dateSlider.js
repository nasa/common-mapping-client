import * as actionTypes from '../constants/actionTypes';
import { dateSliderState } from './models/dateSlider';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const beginDragging = (state, action) => {
    return state.set("isDragging", true);
};
const endDragging = (state, action) => {
    return state.set("isDragging", false);
};
const hoverDate = (state, action) => {
    return state
        .setIn(["hoverDate", "date"], action.date)
        .setIn(["hoverDate", "x"], action.x)
        .setIn(["hoverDate", "isValid"], true);
};
const timelineMouseOut = (state, action) => {
    return state.setIn(["hoverDate", "isValid"], false);
};
const resetApplicationState = (state, action) => {
    return endDragging(state, action);
};

export default function settingsContainer(state = dateSliderState, action) {
    switch (action.type) {
        case actionTypes.BEGIN_DRAGGING:
            return beginDragging(state, action);

        case actionTypes.END_DRAGGING:
            return endDragging(state, action);

        case actionTypes.HOVER_DATE:
            return hoverDate(state, action);

        case actionTypes.TIMELINE_MOUSE_OUT:
            return timelineMouseOut(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return resetApplicationState(state, action);

        default:
            return state;
    }
}
