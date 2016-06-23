import * as actionTypes from '../constants/actionTypes';
import { settingsState } from './models/settings';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const openSettings = (state, action) => {
    return state.set("isOpen", true);
};
const closeSettings = (state, action) => {
    return state.set("isOpen", false);
};

export default function settings(state = settingsState, action) {
    switch (action.type) {
        case actionTypes.OPEN_SETTINGS:
            return openSettings(state, action);

        case actionTypes.CLOSE_SETTINGS:
            return closeSettings(state, action);

        default:
            return state;
    }
}
