import * as actionTypes from '../constants/actionTypes';
import {helpContainerState} from './models/helpContainer';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default function helpContainer(state = helpContainerState, action) {
    switch (action.type) {
        default:
            return state;
    }
}
