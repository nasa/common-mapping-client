import * as actionTypes from "_core/constants/actionTypes";
import { helpState } from "_core/reducers/models/help";
import HelpReducer from "_core/reducers/reducerFunctions/HelpReducer";

export default function help(state = helpState, action, opt_reducer = HelpReducer) {
    switch (action.type) {
        case actionTypes.SET_HELP_OPEN:
            return opt_reducer.setHelpOpen(state, action);

        case actionTypes.SELECT_HELP_PAGE:
            return opt_reducer.selectHelpPage(state, action);

        default:
            return state;
    }
}
