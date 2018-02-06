/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class SettingsReducer {
    static setSettingsOpen(state, action) {
        return state.set("isOpen", action.isOpen);
    }

    static resetApplicationState(state, action) {
        return this.setSettingsOpen(state, { isOpen: false });
    }
}
