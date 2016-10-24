//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class HelpReducer {
    static openHelp(state, action) {
        return state.set("isOpen", true).set("helpPage", "");
    }

    static closeHelp(state, action) {
        return state.set("isOpen", false).set("helpPage", "");
    }

    static selectHelpPage(state, action) {
        return state.set("helpPage", action.param);
    }
}
