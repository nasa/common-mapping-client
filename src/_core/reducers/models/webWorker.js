/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import appConfig from "constants/appConfig";
import WorkerManager from "_core/utils/WorkerManager";

export const webWorkerState = Immutable.fromJS({
    workerManager: new WorkerManager(appConfig.DEFAULT_WEB_WORKER_NUM)
});
