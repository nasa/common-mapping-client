/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import appConfig from "constants/appConfig";

// pull autoUpdateUrl from local storage, default to appConfig value if missing
let localStorageAutoUpdateUrl = window.localStorage.getItem("autoUpdateUrl");
let autoUpdateUrl =
    localStorageAutoUpdateUrl !== null
        ? localStorageAutoUpdateUrl === "true"
        : appConfig.DEFAULT_AUTO_UPDATE_URL_ENABLED;

export const shareState = Immutable.fromJS({
    isOpen: false,
    updateFlag: true,
    autoUpdateUrl: autoUpdateUrl
});
