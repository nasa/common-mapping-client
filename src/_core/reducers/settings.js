/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actionTypes from "_core/constants/actionTypes";
import { settingsState } from "_core/reducers/models/settings";
import SettingsReducer from "_core/reducers/reducerFunctions/SettingsReducer";

export default function settings(state = settingsState, action, opt_reducer = SettingsReducer) {
    switch (action.type) {
        case actionTypes.SET_SETTINGS_OPEN:
            return opt_reducer.setSettingsOpen(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return opt_reducer.resetApplicationState(state, action);

        default:
            return state;
    }
}
