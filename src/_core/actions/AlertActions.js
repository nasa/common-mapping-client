import * as types from '_core/constants/actionTypes';

export function addAlert(alert) {
    return { type: types.ADD_ALERT, alert };
}