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
