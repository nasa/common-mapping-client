import Immutable from 'immutable';
import * as appStrings from '../../constants/appStrings';

export const viewState = Immutable.fromJS({
    title: appStrings.APP_TITLE,
    subtitle: appStrings.APP_SUBTITLE,
    version: appStrings.APP_VERSION,
    initialLoadComplete: false,
    layerMenuOpen: true,
    isFullscreen: false,
    sharingOpen: false,
    alerts: []
});

export const alert = Immutable.fromJS({
    title: "Alert",
    body: "There was an error",
    severity: 1,
    time: new Date()
});
