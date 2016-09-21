import Immutable from 'immutable';
import * as appStrings from '../../constants/appStrings';

export const viewState = Immutable.fromJS({
    title: appStrings.APP_TITLE,
    subtitle: appStrings.APP_SUBTITLE,
    version: appStrings.APP_VERSION,
    initialLoadComplete: false,
    layerMenuOpen: true,
    isFullscreen: false,
    alerts: []
});
