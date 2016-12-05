import Immutable from 'immutable';
import * as appConfig from 'constants/appConfig';

export const viewState = Immutable.fromJS({
    title: appConfig.APP_TITLE,
    subtitle: appConfig.APP_SUBTITLE,
    version: appConfig.APP_VERSION,
    initialLoadComplete: false,
    layerMenuOpen: true,
    isFullscreen: false,
    distractionFreeMode: false,
    mapControlsHidden: false,
    mapControlsToolsOpen: false,
    alerts: []
});
