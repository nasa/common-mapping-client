import * as actionTypes from '../constants/actionTypes';
import { toolsContainerState } from './models/toolsContainer';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const dismissAlert = (state, action) => {
    let remAlert = action.alert;
    return state.set("alerts", state.get("alerts").filter((alert) => {
        return alert !== remAlert;
    }));
};

export default function toolsContainer(state = toolsContainerState, action) {
    switch (action.type) {
        case actionTypes.DISMISS_ALERT:
            return dismissAlert(state, action);

        default:
            return state;
    }
}
