import Immutable from 'immutable';

export const analyticsState = Immutable.fromJS({
    isEnabled: false,
    currentBatch: [],
    timeLastSent: new Date(),
    currBatchNum: 0
});
