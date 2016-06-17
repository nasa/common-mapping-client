import * as actionTypes from '../constants/actionTypes';
import { helpContainerState } from './models/helpContainer';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const openHelp = (state, action) => {
    return state.set("isOpen", true);
};

const closeHelp = (state, action) => {
    return state.set("isOpen", false);
};

const selectHelpPage = (state, action) => {
    return state.set("helpPage", action.param);
};

export default function helpContainer(state = helpContainerState, action) {
    switch (action.type) {
        case actionTypes.OPEN_HELP:
            return openHelp(state, action);

        case actionTypes.CLOSE_HELP:
            return closeHelp(state, action);

        case actionTypes.SELECT_HELP_PAGE:
            return selectHelpPage(state, action);

        default:
            return state;
    }
}
