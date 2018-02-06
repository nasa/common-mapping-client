/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { webWorkerState } from "_core/reducers/models/webWorker";
import WebWorkerReducer from "_core/reducers/reducerFunctions/WebWorkerReducer";

export default function webWorker(state = webWorkerState, action, opt_reducer = WebWorkerReducer) {
    switch (action.type) {
        default:
            return state;
    }
}
