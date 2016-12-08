import Immutable from 'immutable';

export const layerInfoState = Immutable.fromJS({
    isOpen: false,
    activeLayerId: "",
    activeThumbnailUrl: "",
    metadata: { content: null }
});
