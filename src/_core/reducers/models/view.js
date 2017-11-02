import Immutable from "immutable";
import appConfig from "constants/appConfig";

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
    appResetCounter: 0,
    alerts: []
});
