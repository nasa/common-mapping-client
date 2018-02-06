/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";

export const alertState = Immutable.fromJS({
    alerts: []
});

export const alert = Immutable.fromJS({
    title: "Alert",
    body: "There was an error",
    severity: 1,
    time: new Date()
});
