import * as actionTypes from '_core/constants/actionTypes';
import { settingsState } from './models/settings';
import SettingsReducer from './reducerFunctions/SettingsReducer';

export default function settings(state = settingsState, action) {
    switch (action.type) {
        case actionTypes.OPEN_SETTINGS:
            return SettingsReducer.openSettings(state, action);

        case actionTypes.CLOSE_SETTINGS:
            return SettingsReducer.closeSettings(state, action);

        case actionTypes.RESET_APPLICATION_STATE:
            return SettingsReducer.resetApplicationState(state, action);

        default:
            return state;
    }
}
