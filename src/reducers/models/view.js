import Immutable from 'immutable';
import * as appStrings from '../../constants/appStrings';

export const viewState = Immutable.fromJS({
    title: appStrings.APP_TITLE,
    version: appStrings.APP_VERSION,
    initialLoadComplete: false,
    layerMenuOpen: true,
    mainMenuOpen: false,
    isFullscreen: false,
    sharingOpen: false,
    helpOpen: false,
    helpPage: "",
    mainMenuTab: "",
    alerts: []
});

export const alert = Immutable.fromJS({
    title: "Alert",
    body: "There was an error",
    severity: 1,
    time: new Date()
});
