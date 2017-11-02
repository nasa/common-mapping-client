import Immutable from "immutable";
import appConfig from "constants/appConfig";

// pull analyticsEnabled from local storage, default to appConfig default value if missing
let localStorageAnalyticsEnabled = window.localStorage.getItem("analyticsEnabled");
let analyticsEnabled =
    localStorageAnalyticsEnabled !== null
        ? localStorageAnalyticsEnabled === "true"
        : appConfig.DEFAULT_ANALYTICS_ENABLED;

// analyticsEnabled = true;
export const analyticsState = Immutable.fromJS({
    isEnabled: analyticsEnabled,
    currentBatch: [],
    timeLastSent: new Date(),
    sequenceIndex: 0
});
