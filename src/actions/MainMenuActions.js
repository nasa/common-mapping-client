import * as types from '../constants/actionTypes';

export function openMainMenu(param) {
	return { type: types.OPEN_MAIN_MENU, param };
}
export function closeMainMenu() {
	return { type: types.CLOSE_MAIN_MENU };
}