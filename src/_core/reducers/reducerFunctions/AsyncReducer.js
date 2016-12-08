//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class AsyncReducer {
    static initialDataLoading(state, action) {
        return state.set("loadingInitialData", true);
    }
    static initialDataLoaded(state, action) {
        return state
            .set("loadingInitialData", false)
            .set("initialLoadingAttempted", true);
    }

    static layerDataLoading(state, action) {
        return state.set("loadingLayerSources", true);
    }

    static layerDataLoaded(state, action) {
        return state
            .set("loadingLayerSources", false)
            .set("layerLoadingAttempted", true);
    }

    static paletteDataLoading(state, action) {
        return state.set("loadingLayerPalettes", true);
    }

    static paletteDataLoaded(state, action) {
        return state
            .set("loadingLayerPalettes", false)
            .set("paletteLoadingAttempted", true);
    }

    static metadataLoading(state, action) {
        return state.set("loadingLayerMetadata", true);
    }

    static metadataLoaded(state, action) {
        return state
            .set("loadingLayerMetadata", false)
            .set("loadingMetadataAttempted", true);
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
}