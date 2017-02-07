import MiscUtil from '_core/utils/MiscUtil';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class ViewReducer {
    static miscUtil = new MiscUtil();

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
            this.miscUtil.enterFullScreen();
        } else {
            this.miscUtil.exitFullscreen();
        }
        return state.set("isFullscreen", action.enabled);
    }

    static resetApplicationState(state, action) {
        state = this.setLayerMenuOpen(state, { open: true });
        return state.set("appResetCounter", state.get("appResetCounter") + 1);
    }

    static setDistractionFreeMode(state, action) {
        return state.set("distractionFreeMode", action.enabled);
    }

    static setMapControlsToolsOpen(state, action) {
        return state.set("mapControlsToolsOpen", action.open);
    }

    static hideMapControls(state, action) {
        return state.set("mapControlsHidden", action.hidden);
    }
}