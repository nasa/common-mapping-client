import * as actionTypes from '../constants/actionTypes';
import {exportsContainerState} from './models/exportsContainer';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.


export default function exportsContainer(state = exportsContainerState, action) {
    switch (action.type) {
        default:
            return state;
    }
}