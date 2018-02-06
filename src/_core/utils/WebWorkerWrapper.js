/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// Wrapper class that abstracts the message listening of web workers

import * as appStrings from "_core/constants/appStrings";
import WebWorker from "utils/WebWorker";

const worker = new WebWorker();

self.addEventListener("message", event => {
    let operation = event.data.operation;
    let workerId = event.data.workerId;
    let data = null;
    try {
        switch (operation) {
            case appStrings.WORKER_TASK_COMPLETE:
                break;
            case appStrings.WORKER_TASK_COMPLETE_ERROR:
                break;
            case appStrings.WORKER_TASK_CLOSE:
                _handleClose();
                break;
            default:
                data = worker.handleMessage(event.data, self).then(
                    data => {
                        self.postMessage({
                            operation: appStrings.WORKER_TASK_COMPLETE,
                            prevOperation: operation,
                            workerId: workerId,
                            data: data
                        });
                    },
                    err => {
                        self.postMessage({
                            operation: appStrings.WORKER_TASK_COMPLETE_ERROR,
                            prevOperation: operation,
                            workerId: workerId
                        });
                    }
                );
                break;
        }
    } catch (err) {
        console.warn("ERROR in Worker: " + workerId, err);
        self.postMessage({
            operation: appStrings.WORKER_TASK_COMPLETE_ERROR,
            prevOperation: operation,
            workerId: workerId
        });
    }
});

function _handleClose() {
    close();
}
