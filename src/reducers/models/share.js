import Immutable from 'immutable';

// pull autoUpdateUrl from local storage, default to true if missing
let localStorageAutoUpdateUrl = window.localStorage.getItem("autoUpdateUrl");
let autoUpdateUrl = localStorageAutoUpdateUrl !== null ? localStorageAutoUpdateUrl === "true" : true;

export const shareState = Immutable.fromJS({
    isOpen: false,
    autoUpdateUrl: autoUpdateUrl
});
