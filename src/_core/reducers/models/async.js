import Immutable from "immutable";

export const asyncState = Immutable.fromJS({
    loadingInitialData: false,
    initialLoadingAttempted: false,
    loadingLayerSources: false,
    layerLoadingAttempted: false,
    loadingLayerPalettes: false,
    paletteLoadingAttempted: false,
    loadingLayerMetadata: false,
    loadingMetadataAttempted: false,
    alerts: []
});
