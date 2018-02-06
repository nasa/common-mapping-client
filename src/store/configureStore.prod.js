/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { createStore, applyMiddleware } from "redux";
import rootReducer from "reducers";
import thunkMiddleware from "redux-thunk";

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
}
