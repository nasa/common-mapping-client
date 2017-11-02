// Parent class for WebWorker utility class
import * as appStrings from "_core/constants/appStrings";

export default class WebWorker {
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
