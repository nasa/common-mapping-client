import Immutable from 'immutable';

export const asyncState = Immutable.fromJS({
    loadingLayers: false,
    layerLoadingAttempted: false,
    loadingChart: {},
    alerts: []
});