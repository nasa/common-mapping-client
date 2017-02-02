//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class ShareReducer {
    static setShareOpen(state, action) {
        return state.set("isOpen", action.isOpen);
    }

    static toggleShareUpdateFlag(state, action) {
        return state.set("updateFlag", !state.get("updateFlag"));
    }

    static setAutoUpdateUrl(state, action) {
        window.localStorage.setItem("autoUpdateUrl", action.autoUpdateUrl);
        return state.set("autoUpdateUrl", action.autoUpdateUrl);
    }
}
