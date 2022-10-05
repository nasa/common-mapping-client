/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { combineReducers } from "redux";
import view from "reducers/view";
import map from "reducers/map";
import settings from "_core/reducers/settings";
import help from "_core/reducers/help";
import layerInfo from "_core/reducers/layerInfo";
import share from "_core/reducers/share";
import dateSlider from "_core/reducers/dateSlider";
import asynchronous from "_core/reducers/async";
import analytics from "_core/reducers/analytics";
import alerts from "_core/reducers/alerts";
import webWorker from "_core/reducers/webWorker";

const rootReducer = combineReducers({
    view,
    map,
    settings,
    help,
    layerInfo,
    share,
    dateSlider,
    asynchronous,
    analytics,
    alerts,
    webWorker
});

export default rootReducer;
