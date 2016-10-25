//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class SettingsReducer {
    static openSettings(state, action) {
        return state.set("isOpen", true);
    }
    static closeSettings(state, action) {
        return state.set("isOpen", false);
    }
    static resetApplicationState(state, action) {
        return this.closeSettings(state, action);
    }
}
