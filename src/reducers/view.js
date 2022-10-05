import { viewState } from "reducers/models/view";
import viewCore from "_core/reducers/view";
import ViewReducer from "_core/reducers/reducerFunctions/ViewReducer";

export default function map(state = viewState, action, opt_reducer = ViewReducer) {
    switch (action.type) {
        default:
            return viewCore.call(this, state, action, opt_reducer);
    }
}
