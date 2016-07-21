import Immutable from 'immutable';

export const analyticsState = Immutable.fromJS({
    isEnabled: true,
    currentBatch: [],
    timeLastSent: new Date(),
    currBatchNum: 0
});
