// Manager class for web workers. Import this to start running jobs on a webworker

import Immutable from "immutable";
import * as appStrings from "_core/constants/appStrings";
import WebWorker from "worker-loader?inline!_core/utils/WebWorkerWrapper.js";

export default class WorkerManager {
    constructor(limit = 0) {
        this.workerCounter = 0;
        this.workerMap = Immutable.Map();
        this.callbackMap = Immutable.Map();
        this.jobQueue = Immutable.List();

        // prefill workers
        this.createWorkers(limit);
    }

    /*
    creates a pool of workers
    
    limit: (number) the numer of workers to create

    return: a list of the ids of the workers created
    */
    createWorkers(limit = 0) {
        let ids = [];
        for (let i = 0; i < limit; ++i) {
            let worker = new WebWorker();
            let workerId = this.getWorkerId();

            worker.addEventListener("message", event => {
                let workerId = event.data.workerId;
                let callbacks = this.callbackMap.get(workerId);
                let resolve = callbacks.resolve;
                let reject = callbacks.reject;
                if (event.data.operation === appStrings.WORKER_TASK_COMPLETE) {
                    this.workerMap = this.workerMap.setIn(
                        [workerId, "isActive"],
                        false
                    );
                    this.callbackMap = this.callbackMap.delete(workerId);
                    resolve(event.data);
                    this.checkQueue();
                } else if (
                    event.data.operation ===
                    appStrings.WORKER_TASK_COMPLETE_ERROR
                ) {
                    this.workerMap = this.workerMap.setIn(
                        [workerId, "isActive"],
                        false
                    );
                    this.callbackMap = this.callbackMap.delete(workerId);
                    reject(event.data);
                    this.checkQueue();
                }
            });

            this.workerMap = this.workerMap.set(
                workerId,
                Immutable.Map({
                    worker: worker,
                    isActive: false
                })
            );

            ids.push(workerId);
        }
        return ids;
    }

    /*
    closes all workers in the pool
    */
    clearWorkers() {
        this.workerMap.forEach(workerEntry => {
            workerEntry.get("worker").postMessage({
                operation: appStrings.WORKER_TASK_CLOSE
            });
        });
        this.workerMap = this.workerMap.clear();
    }

    /*
    adds a job to the queue

    jobOptions: (object) of information to be sent to the worker that executes this job
        it must include a `operation` that is a string indicating what job is to be run

    return: a promise that will be resolved when the job completes
    */
    queueJob(jobOptions) {
        return new Promise((resolve, reject) => {
            // TODO - validate input
            this.jobQueue = this.jobQueue.push({ jobOptions, resolve, reject });
            this.checkQueue();
        });
    }

    checkQueue() {
        if (this.workerAvailable() && !this.jobQueue.isEmpty()) {
            this.runNextJob();
        }
    }

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

    dequeueJob() {
        let job = this.jobQueue.get(0);
        this.jobQueue = this.jobQueue.shift();
        return job;
    }

    getWorkerId() {
        return "worker_" + this.workerCounter++;
    }

    getInactiveWorker() {
        return this.workerMap.findEntry((value, key) => {
            return !value.get("isActive");
        });
    }

    workerAvailable() {
        return (
            typeof this.workerMap.find((value, key) => {
                return !value.get("isActive");
            }) !== "undefined"
        );
    }

    workersTotal() {
        return this.workerMap.size;
    }

    workersAvailable() {
        return this.workerMap.filter((workerEntry) => {
            return !workerEntry.get("isActive");
        }).size;
    }
}
