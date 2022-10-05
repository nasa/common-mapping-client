/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import { viewState as viewStateCore } from "_core/reducers/models/view";
import appConfig from "constants/appConfig";

export const viewState = viewStateCore.mergeDeep(
    Immutable.fromJS({
        logo: appConfig.APP_LOGO
    })
);
