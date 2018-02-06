/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";

export const asyncModel = {
    loading: false,
    failed: false
};

export const asyncState = Immutable.fromJS({
    initialDataAsync: asyncModel,
    layerSourcesAsync: asyncModel,
    layerPalettesAsync: asyncModel,
    layerMetadataAsync: asyncModel,
    alerts: []
});
