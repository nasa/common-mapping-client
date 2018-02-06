/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import appConfig from "constants/appConfig";

export const dateSliderState = Immutable.fromJS({
    isDragging: false,
    hoverDate: {
        date: null,
        x: 0,
        isValid: false
    },
    resolution: appConfig.DEFAULT_DATE_SLIDER_RESOLUTION,
    alerts: []
});
