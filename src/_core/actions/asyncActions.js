/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as types from "_core/constants/actionTypes";

export function setAsyncLoadingState(key, newAsyncState) {
    return { type: types.SET_ASYNC_LOADING_STATE, key, newAsyncState };
}
