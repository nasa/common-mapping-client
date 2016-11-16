import * as actionTypes from '_core/constants/actionTypes';
import { shareState } from '_core/reducers/models/share';
import ShareReducer from '_core/reducers/reducerFunctions/ShareReducer';

export default function share(state = shareState, action) {
    switch (action.type) {
        case actionTypes.OPEN_SHARE:
            return ShareReducer.openShare(state, action);

        case actionTypes.CLOSE_SHARE:
            return ShareReducer.closeShare(state, action);

        case actionTypes.TOGGLE_SHARE_UPDATE_FLAG:
            return ShareReducer.toggleShareUpdateFlag(state, action);

        case actionTypes.SET_AUTO_UPDATE_URL:
            return ShareReducer.setAutoUpdateUrl(state, action);

        default:
            return state;
    }
}
