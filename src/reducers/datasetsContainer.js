import * as actionTypes from '../constants/actionTypes';
import {datasetsContainerState} from './models/datasetsContainer';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.


export default function datasetsContainer(state = datasetsContainerState, action) {
    switch (action.type) {
        default:
            return state;
    }
}