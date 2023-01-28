/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import * as coreConfig from "_core/constants/appConfig";

// the config as defined by CMC Core
const CORE_CONFIG = Immutable.fromJS(coreConfig);

// this config is defined in `src/config.js` for in ops changes
const OPS_CONFIG = Immutable.fromJS(window.APPLICATION_CONFIG);

// define your overrides for Core config here
const APP_CONFIG = Immutable.fromJS({});

const isList = Immutable.List.isList;
function merger(a, b) {
    if (a && a.mergeWith && !isList(a) && !isList(b)) {
        return a.mergeWith(merger, b);
    }
    return b;
}

// define and export the final config
const appConfig = merger(CORE_CONFIG.mergeDeep(APP_CONFIG), OPS_CONFIG).toJS();
window._MERGED_APPLICATION_CONFIG = appConfig;
export default appConfig;
