import Immutable from 'immutable';
import * as appConfig from 'constants/appConfig';

// pull autoUpdateUrl from local storage, default to appConfig value if missing
let localStorageAutoUpdateUrl = window.localStorage.getItem("autoUpdateUrl");
let autoUpdateUrl = localStorageAutoUpdateUrl !== null ? localStorageAutoUpdateUrl === "true" : appConfig.DEFAULT_AUTO_UPDATE_URL_ENABLED;

export const shareState = Immutable.fromJS({
    isOpen: false,
    updateFlag: true,
    autoUpdateUrl: autoUpdateUrl
});
