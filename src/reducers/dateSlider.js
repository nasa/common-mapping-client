import * as actionTypes from '../constants/actionTypes';
import * as appStrings from '../constants/appStrings';
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
const setDateResolution = (state, action) => {
    let newState = state
        .set("resolution", action.resolution)
        .set("resolutionHack", !state.get("resolutionHack"));
    newState = setChangingResolution(newState, { isSelectingResolution: false });
    return newState;
};
const setSliderCollapsed = (state, action) => {
    return state.set("sliderCollapsed", action.collapsed);
};
const setChangingResolution = (state, action) => {
    return state.set("isSelectingResolution", action.isSelectingResolution);
};
const resetApplicationState = (state, action) => {
    let newState = endDragging(state, action);
    newState = setDateResolution(newState, { resolution: appStrings.DATE_SLIDER_RESOLUTIONS.YEARS });
    newState = setChangingResolution(newState, { isSelectingResolution: false });
    return newState;
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

        case actionTypes.SET_DATE_RESOLUTION:
            return setDateResolution(state, action);

        case actionTypes.SET_SLIDER_COLLAPSED:
            return setSliderCollapsed(state, action);

        case actionTypes.SET_CHANGING_RESOLUTION:
            return setChangingResolution(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return resetApplicationState(state, action);

        default:
            return state;
    }
}
