import * as actionTypes from '../constants/actionTypes';
import {settingsContainerState} from './models/settingsContainer';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.


export default function settingsContainer(state = settingsContainerState, action) {
    switch (action.type) {
        default:
            return state;
    }
}