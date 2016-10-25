import MiscUtil from '_core/utils/MiscUtil';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class ViewReducer {
    static completeInitialLoad(state, action) {
        return state.set("initialLoadComplete", true);
    }

    static setLayerMenuOpen(state, action) {
        return state.set("layerMenuOpen", action.open);
    }

    static dismissAlert(state, action) {
        let remAlert = action.alert;
        return state.set("alerts", state.get("alerts").filter((alert) => {
            return alert !== remAlert;
        }));
    }

    static dismissAllAlerts(state, action) {
        return state.set("alerts", state.get("alerts").clear());
    }

    static setFullScreen(state, action) {
        if (action.enabled) {
            MiscUtil.enterFullScreen();
        } else {
            MiscUtil.exitFullscreen();
        }
        return state.set("isFullscreen", action.enabled);
    }

    static resetApplicationState(state, action) {
        return this.setLayerMenuOpen(state, { open: true });
    }
}