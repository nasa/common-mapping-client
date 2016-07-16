import * as actionTypes from '../constants/actionTypes';
import { toolsState } from './models/tools';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

const openTools = (state, action) => {
    return state.set("isOpen", true);
};

const closeTools = (state, action) => {
    return state.set("isOpen", false);
};

const enable2DDrawing = (state, action) => {
    return state.set("is2DDrawingEnabled", true).set("drawingType2D", action.type);
};
export default function tools(state = toolsState, action) {
    switch (action.type) {
        case actionTypes.OPEN_TOOLS:
            return openTools(state, action);

        case actionTypes.CLOSE_TOOLS:
            return closeTools(state, action);

        case actionTypes.ENABLE_2D_DRAWING:
            return enable2DDrawing(state, action);

        default:
            return state;
    }
}
