/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// Manager class for web workers. Import this to start running jobs on a webworker

import Immutable from "immutable";
import * as appStrings from "_core/constants/appStrings";
import WebWorker from "worker-loader?inline=fallback!_core/utils/WebWorkerWrapper.js";

/**
 * Class for managing a pool of workers and dispatching jobs to them
 *
 * @export
 * @class WorkerManager
 */
export default class WorkerManager {
    /**
     * Creates an instance of WorkerManager.
     *
     * @param {number} [limit=0] the number of workers to populate at inception
     * @memberof WorkerManager
     */
    constructor(limit = 0) {
        this.workerCounter = 0;
        this.workerMap = Immutable.Map();
        this.callbackMap = Immutable.Map();
        this.jobQueue = Immutable.List();

        // prefill workers
        this.createWorkers(limit);
    }

    /**
     * create a pool of workers
     *
     * @param {number} [limit=0]  the number of workers to create
     * @returns {array} list of worker ids
     * @memberof WorkerManager
     */
    createWorkers(limit = 0) {
        let ids = [];
        for (let i = 0; i < limit; ++i) {
            let worker = new WebWorker();
            let workerId = this.getWorkerId();

            worker.addEventListener("message", (event) => {
                let workerId = event.data.workerId;
                let callbacks = this.callbackMap.get(workerId);
                let resolve = callbacks.resolve;
                let reject = callbacks.reject;
                if (event.data.operation === appStrings.WORKER_TASK_COMPLETE) {
                    this.workerMap = this.workerMap.setIn([workerId, "isActive"], false);
                    this.callbackMap = this.callbackMap.delete(workerId);
                    resolve(event.data);
                    this.checkQueue();
                } else if (event.data.operation === appStrings.WORKER_TASK_COMPLETE_ERROR) {
                    this.workerMap = this.workerMap.setIn([workerId, "isActive"], false);
                    this.callbackMap = this.callbackMap.delete(workerId);
                    reject(event.data);
                    this.checkQueue();
                }
            });

            this.workerMap = this.workerMap.set(
                workerId,
                Immutable.Map({
                    worker: worker,
                    isActive: false,
                })
            );

            ids.push(workerId);
        }
        return ids;
    }

    /**
     * closes all workers in the pool and clears the pool
     *
     * @memberof WorkerManager
     */
    clearWorkers() {
        this.workerMap.forEach((workerEntry) => {
            workerEntry.get("worker").postMessage({
                operation: appStrings.WORKER_TASK_CLOSE,
            });
        });
        this.workerMap = this.workerMap.clear();
    }

    /**
     * adds a job to the queue
     *
     * @param {object} jobOptions information for the worker to perform a task
     * - operation - {string} the task to perform
     * - any additonal fields to be passed to the worker
     * @returns {Promise} a promise that will be resolved when the job completes
     * @memberof WorkerManager
     */
    queueJob(jobOptions) {
        return new Promise((resolve, reject) => {
            // TODO - validate input
            this.jobQueue = this.jobQueue.push({ jobOptions, resolve, reject });
            this.checkQueue();
        });
    }

    /**
     * check if there are jobs to perform an available workers,
     * if there are then run the next job
     *
     * @memberof WorkerManager
     */
    checkQueue() {
        if (this.workerAvailable() && !this.jobQueue.isEmpty()) {
            this.runNextJob();
        }
    }

    /**
     * run the next job in the queue
     *
     * @memberof WorkerManager
     */
    runNextJob() {
        let workerMapEntry = this.getInactiveWorker();

        let job = this.dequeueJob();
        let jobOptions = job.jobOptions;
        let resolve = job.resolve;
        let reject = job.reject;
        let workerId = workerMapEntry[0];
        let workerEntry = workerMapEntry[1];
        let worker = workerEntry.get("worker");
        workerEntry = workerEntry.set("isActive", true);
        this.workerMap = this.workerMap.set(workerId, workerEntry);
        this.callbackMap = this.callbackMap.set(workerId, { resolve, reject });

        let jobOptionsMod = {};
        for (let key in jobOptions) {
            if (jobOptions.hasOwnProperty(key) && key !== "transfer") {
                jobOptionsMod[key] = jobOptions[key];
            }
        }

        jobOptionsMod.workerId = workerId;
        worker.postMessage(jobOptionsMod, jobOptions.transfer);
    }

    /**
     * remove the next job from the queue
     *
     * @returns {object} job options
     * @memberof WorkerManager
     */
    dequeueJob() {
        let job = this.jobQueue.get(0);
        this.jobQueue = this.jobQueue.shift();
        return job;
    }

    /**
     * get the next worker id in an ever increasing set
     *
     * @returns
     * @memberof WorkerManager
     */
    getWorkerId() {
        return "worker_" + this.workerCounter++;
    }

    /**
     * get an inactive worker
     *
     * @returns {WebWorkerWrapper} inactive web worker
     * @memberof WorkerManager
     */
    getInactiveWorker() {
        return this.workerMap.findEntry((value, key) => {
            return !value.get("isActive");
        });
    }

    /**
     * check if there is an available worker
     *
     * @returns {boolean} true if a web worker is available
     * @memberof WorkerManager
     */
    workerAvailable() {
        return (
            typeof this.workerMap.find((value, key) => {
                return !value.get("isActive");
            }) !== "undefined"
        );
    }

    /**
     * get the current size of the worker pool
     *
     * @returns {number} the number of workers in the pool
     * @memberof WorkerManager
     */
    workersTotal() {
        return this.workerMap.size;
    }

    /**
     * get the number of workers that are not currently working on a job
     *
     * @returns {number} of workers not currently working on a job
     * @memberof WorkerManager
     */
    workersAvailable() {
        return this.workerMap.filter((workerEntry) => {
            return !workerEntry.get("isActive");
        }).size;
    }
}
