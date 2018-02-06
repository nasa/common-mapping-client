/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import appConfig from "constants/appConfig";

export const viewState = Immutable.fromJS({
    title: appConfig.APP_TITLE,
    subtitle: appConfig.APP_SUBTITLE,
    version: appConfig.APP_VERSION,
    initialLoadComplete: false,
    layerMenuOpen: true,
    isFullscreen: false,
    distractionFreeMode: false,
    mapControlsHidden: false,
    mapControlsToolsOpen: false,
    mapControlsBasemapPickerOpen: false,
    appResetCounter: 0,
    alerts: []
});
