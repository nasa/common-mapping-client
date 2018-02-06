/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

//This file merely configures the store for hot reloading.
//This boilerplate file is likely to be the same for each project that uses Redux.
//With Redux, the actual stores are in /reducers.

import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "reducers";
import thunkMiddleware from "redux-thunk";

export default function configureStore(initialState) {
    let store = createStore(
        rootReducer,
        initialState,
        compose(
            // Add other middleware on this line...
            applyMiddleware(thunkMiddleware),
            window.devToolsExtension ? window.devToolsExtension() : f => f //add support for Redux dev tools
        )
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept("../reducers", () => {
            const nextReducer = require("../reducers").default;
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
