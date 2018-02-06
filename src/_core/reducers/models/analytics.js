/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import appConfig from "constants/appConfig";

// pull analyticsEnabled from local storage, default to appConfig default value if missing
let localStorageAnalyticsEnabled = window.localStorage.getItem("analyticsEnabled");
let analyticsEnabled =
    localStorageAnalyticsEnabled !== null
        ? localStorageAnalyticsEnabled === "true"
        : appConfig.DEFAULT_ANALYTICS_ENABLED;

// analyticsEnabled = true;
export const analyticsState = Immutable.fromJS({
    isEnabled: analyticsEnabled,
    currentBatch: [],
    timeLastSent: new Date(),
    sequenceIndex: 0
});
