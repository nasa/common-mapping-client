import { webWorkerState } from '_core/reducers/models/webWorker';
import WebWorkerReducer from '_core/reducers/reducerFunctions/WebWorkerReducer';

export default function webWorker(state = webWorkerState, action, opt_reducer = WebWorkerReducer) {
    switch (action.type) {
        default:
            return state;
    }
}
