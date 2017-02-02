//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class HelpReducer {
	static setHelpOpen(state, action) {
		if(action.isOpen) {
			state = state.set("helpPage", "");
		}
        return state.set("isOpen", action.isOpen);
	}

    static selectHelpPage(state, action) {
        return state.set("helpPage", action.param);
    }
}
