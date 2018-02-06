/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actionTypes from "_core/constants/actionTypes";
import { viewState } from "_core/reducers/models/view";
import ViewReducer from "_core/reducers/reducerFunctions/ViewReducer";

export default function view(state = viewState, action, opt_reducer = ViewReducer) {
    switch (action.type) {
        case actionTypes.CHECK_BROWSER_FUNCTIONALITIES:
            return opt_reducer.checkBrowserFunctionalities(state, action);

        case actionTypes.COMPLETE_INITIAL_LOAD:
            return opt_reducer.completeInitialLoad(state, action);

        case actionTypes.SET_LAYER_MENU_OPEN:
            return opt_reducer.setLayerMenuOpen(state, action);

        case actionTypes.DISMISS_ALERT:
            return opt_reducer.dismissAlert(state, action);

        case actionTypes.DISMISS_ALL_ALERTS:
            return opt_reducer.dismissAllAlerts(state, action);

        case actionTypes.SET_FULL_SCREEN:
            return opt_reducer.setFullScreen(state, action);

        case actionTypes.SET_DISTRACTION_FREE_MODE:
            return opt_reducer.setDistractionFreeMode(state, action);

        case actionTypes.SET_MAP_CONTROL_TOOLS_OPEN:
            return opt_reducer.setMapControlsToolsOpen(state, action);

        case actionTypes.SET_MAP_CONTROL_BASEMAP_PICKER_OPEN:
            return opt_reducer.setMapControlsBasemapPickerOpen(state, action);

        case actionTypes.HIDE_MAP_CONTROLS:
            return opt_reducer.hideMapControls(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return opt_reducer.resetApplicationState(state, action);

        default:
            return state;
    }
}
