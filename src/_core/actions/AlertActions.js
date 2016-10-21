import * as types from '../constants/actionTypes';

export function addAlert(alert) {
    return { type: types.ADD_ALERT, alert };
}