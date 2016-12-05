import * as actionTypes from '_core/constants/actionTypes';
import { viewState } from '_core/reducers/models/view';
import ViewReducer from '_core/reducers/reducerFunctions/ViewReducer';

export default function view(state = viewState, action) {
    switch (action.type) {
        case actionTypes.COMPLETE_INITIAL_LOAD:
            return ViewReducer.completeInitialLoad(state, action);

        case actionTypes.SET_LAYER_MENU_OPEN:
            return ViewReducer.setLayerMenuOpen(state, action);

        case actionTypes.DISMISS_ALERT:
            return ViewReducer.dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return ViewReducer.dismissAllAlerts(state, action);

        case actionTypes.SET_FULL_SCREEN:
            return ViewReducer.setFullScreen(state, action);

        case actionTypes.SET_DISTRACTION_FREE_MODE:
            return ViewReducer.setDistractionFreeMode(state, action);

        case actionTypes.SET_MAP_CONTROL_TOOLS_OPEN:
            return ViewReducer.setMapControlsToolsOpen(state, action);

        case actionTypes.HIDE_MAP_CONTROLS:
            return ViewReducer.hideMapControls(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return ViewReducer.resetApplicationState(state, action);

        default:
            return state;
    }
}
