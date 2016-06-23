import * as actionTypes from '../constants/actionTypes';
import { shareState } from './models/share';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const openShare = (state, action) => {
    return state.set("isOpen", true);
};

const closeShare = (state, action) => {
    return state.set("isOpen", false);
};

export default function help(state = shareState, action) {
    switch (action.type) {
        case actionTypes.OPEN_SHARE:
            return openShare(state, action);

        case actionTypes.CLOSE_SHARE:
            return closeShare(state, action);

        default:
            return state;
    }
}
