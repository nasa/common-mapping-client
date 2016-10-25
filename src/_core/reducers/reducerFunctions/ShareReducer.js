//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class ShareReducer {
    static openShare(state, action) {
        return state.set("isOpen", true);
    }

    static closeShare(state, action) {
        return state.set("isOpen", false);
    }

    static setAutoUpdateUrl(state, action) {
        window.localStorage.setItem("autoUpdateUrl", action.autoUpdateUrl);
        return state.set("autoUpdateUrl", action.autoUpdateUrl);
    }
}
