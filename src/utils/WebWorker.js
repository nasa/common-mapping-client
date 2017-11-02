import WebWorkerCore from "_core/utils/WebWorker";

export default class WebWorker extends WebWorkerCore {
    /*
    Edit this function to handle worker jobs.
    Whatever is sent back by the promise will be
    sent back to the main thread under the key `data`.
    See `_core/utils/WebWorker.js` as an example of handling
    a message

    message: object passed to the WorkerManager in queueJob()
    workerRef: reference to the worker object

    return: a Promise. When this promise is resolved, the worker
    will send the data back to the main thread.
    */
    handleMessage(message, workerRef) {
        let operation = message.operation;
        switch (operation) {
            default:
                return WebWorkerCore.prototype.handleMessage.call(
                    this,
                    message,
                    workerRef
                );
        }
    }
}
