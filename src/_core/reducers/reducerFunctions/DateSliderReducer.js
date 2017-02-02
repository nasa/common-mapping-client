import Immutable from 'immutable';
import appConfig from 'constants/appConfig';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.
export default class DateSliderReducer {
    static beginDragging(state, action) {
        return state.set("isDragging", true);
    }
    static endDragging(state, action) {
        return state
            .set("isDragging", false)
            .setIn(["hoverDate", "isValid"], false);
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
        return state.set("resolution", Immutable.Map(action.resolution));
    }
    static resetApplicationState(state, action) {
        let newState = this.endDragging(state, action);
        newState = this.setDateResolution(newState, { resolution: appConfig.DATE_SLIDER_RESOLUTIONS.DAYS });
        return newState;
    }
}