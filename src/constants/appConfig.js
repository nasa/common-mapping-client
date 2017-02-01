import Immutable from 'immutable';
import * as coreConfig from '_core/constants/appConfig';

// the config as defined by CMC Core
const CORE_CONFIG = Immutable.fromJS(coreConfig);

// this config is defined in `src/config.js` for in ops changes
const OPS_CONFIG = Immutable.fromJS(window.APPLICATION_CONFIG);

// define your overrides for Core config here
const APP_CONFIG = Immutable.fromJS({});

// define and export the final config
const appConfig = CORE_CONFIG.mergeDeep(APP_CONFIG).mergeDeep(OPS_CONFIG).toJS();
export default appConfig;
