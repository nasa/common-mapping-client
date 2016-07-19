import * as actionTypes from '../constants/actionTypes';
import { toolsState } from './models/tools';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const openTools = (state, action) => {
    return state.set("isOpen", true);
};

const closeTools = (state, action) => {
    return state.set("isOpen", false);
};

export default function tools(state = toolsState, action) {
    switch (action.type) {
        case actionTypes.OPEN_TOOLS:
            return openTools(state, action);

        case actionTypes.CLOSE_TOOLS:
            return closeTools(state, action);

        default:
            return state;
    }
}
