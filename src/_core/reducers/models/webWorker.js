import Immutable from 'immutable';
import appConfig from 'constants/appConfig';
import WorkerManager from '_core/utils/WorkerManager';

export const webWorkerState = Immutable.fromJS({
    workerManager: new WorkerManager(appConfig.DEFAULT_WEB_WORKER_NUM)
});
