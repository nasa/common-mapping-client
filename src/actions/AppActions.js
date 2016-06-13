import * as types from '../constants/actionTypes';

export function initialLoad() {
    return { type: types.COMPLETE_INITIAL_LOAD };
}
export function openHelp(param) {
    return { type: types.OPEN_HELP, param };
}
export function closeHelp() {
    return { type: types.CLOSE_HELP };
}
export function selectHelpPage(param) {
    return { type: types.SELECT_HELP_PAGE, param};
}
export function dismissAlert(alert) {
	return { type: types.DISMISS_ALERT, alert };
}
export function toggleFullScreen() {
	return { type: types.TOGGLE_FULL_SCREEN };
}