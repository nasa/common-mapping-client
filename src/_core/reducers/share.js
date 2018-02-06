/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as actionTypes from "_core/constants/actionTypes";
import { shareState } from "_core/reducers/models/share";
import ShareReducer from "_core/reducers/reducerFunctions/ShareReducer";

export default function share(state = shareState, action, opt_reducer = ShareReducer) {
    switch (action.type) {
        case actionTypes.SET_SHARE_OPEN:
            return opt_reducer.setShareOpen(state, action);

        case actionTypes.TOGGLE_SHARE_UPDATE_FLAG:
            return opt_reducer.toggleShareUpdateFlag(state, action);

        case actionTypes.SET_AUTO_UPDATE_URL:
            return opt_reducer.setAutoUpdateUrl(state, action);

        default:
            return state;
    }
}
