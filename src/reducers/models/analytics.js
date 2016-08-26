import Immutable from 'immutable';

// pull analyticsEnabled from local storage, default to false if missing
let localStorageAnalyticsEnabled = window.localStorage.getItem("analyticsEnabled");
let analyticsEnabled = localStorageAnalyticsEnabled !== null ? localStorageAnalyticsEnabled === "true" : false;

// analyticsEnabled = true;
export const analyticsState = Immutable.fromJS({
    isEnabled: analyticsEnabled,
    currentBatch: [],
    timeLastSent: new Date(),
    currBatchNum: 0
});
