import * as actionTypes from '_core/constants/actionTypes';
import { dateSliderState } from '_core/reducers/models/dateSlider';
import DateSliderReducer from '_core/reducers/reducerFunctions/DateSliderReducer';

export default function dateSlider(state = dateSliderState, action) {
    switch (action.type) {
        case actionTypes.BEGIN_DRAGGING:
            return DateSliderReducer.beginDragging(state, action);

        case actionTypes.END_DRAGGING:
            return DateSliderReducer.endDragging(state, action);

        case actionTypes.HOVER_DATE:
            return DateSliderReducer.hoverDate(state, action);

        case actionTypes.TIMELINE_MOUSE_OUT:
            return DateSliderReducer.timelineMouseOut(state, action);

        case actionTypes.SET_DATE_RESOLUTION:
            return DateSliderReducer.setDateResolution(state, action);

        case actionTypes.SET_CHANGING_RESOLUTION:
            return DateSliderReducer.setChangingResolution(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return DateSliderReducer.resetApplicationState(state, action);

        default:
            return state;
    }
}
