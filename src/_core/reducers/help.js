import * as actionTypes from '_core/constants/actionTypes';
import { helpState } from './models/help';
import HelpReducer from './reducerFunctions/HelpReducer';

export default function help(state = helpState, action) {
    switch (action.type) {
        case actionTypes.OPEN_HELP:
            return HelpReducer.openHelp(state, action);

        case actionTypes.CLOSE_HELP:
            return HelpReducer.closeHelp(state, action);

        case actionTypes.SELECT_HELP_PAGE:
            return HelpReducer.selectHelpPage(state, action);

        default:
            return state;
    }
}
