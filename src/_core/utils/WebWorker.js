/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// Parent class for WebWorker utility class
import * as appStrings from "_core/constants/appStrings";

export default class WebWorker {
    /**
     * handle a message sent to this worker
     *
     * @param {object} message data message posted to this worker
     * - operation - {string} the task to perform
     * - {any} additional values for the task
     * @param {WebWorker} workerRef backing web worker
     * @returns {Promise} promise resolved when the task is complete
     * @memberof WebWorker
     */
    handleMessage(message, workerRef) {
        let operation = message.operation;
        switch (operation) {
            case appStrings.WORKER_TASK_TEST:
                return this.handleTest(message);
            default:
                return new Promise((resolve, reject) => {
                    resolve({});
                });
        }
    }

    /**
     * handle the test task
     *
     * @param {object} message
     * - delay - {number} how long to delay before resolving
     * - data - {any} data to resolve
     * @returns {Promise} promise resolved after a brief timeout
     * @memberof WebWorker
     */
    handleTest(message) {
        let data = message.data;
        let delay = typeof message.delay !== "undefined" ? message.delay : 500;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(data);
            }, delay);
        });
    }
}
