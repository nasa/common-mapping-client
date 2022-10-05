/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import * as coreConfig from "_core/constants/appConfig";

// the config as defined by CMC Core
const CORE_CONFIG = Immutable.fromJS(coreConfig);

// this config is defined in `src/config.js` for in ops changes
const OPS_CONFIG = Immutable.fromJS(window.APPLICATION_CONFIG);

// define your overrides for Core config here
const APP_CONFIG = Immutable.fromJS({
    URLS: {
        layerConfig: [
            {
                url: "default-data/_core_default-data/capabilities.xml",
                type: "wmts/xml"
            },
            {
                url: "default-data/_core_default-data/layers.json",
                type: "json"
            }
        ],
        paletteConfig: "default-data/_core_default-data/palettes.json"
    },
    DATA_DIRECTORY: "default-data/_core_default-data",
    ABOUT_MARKDOWN: require("default-data/_core_default-data/help/about.md"),
    FAQ_MARKDOWN: require("default-data/_core_default-data/help/about.md"),
    SYSTEM_REQS_MARKDOWN: require("default-data/_core_default-data/help/about.md"),
    /* MAP */
    VERTICAL_PROFILE_FILL_COLOR: "rgba(255,200,68, 1)",
    VERTICAL_PROFILE_STROKE_COLOR: "rgba(48, 48, 48, 1)",
    VERTICAL_PROFILE_STROKE_WEIGHT: 1.25,
    VERTICAL_PROFILE_OUTLINE_COLOR: "rgba(0, 0, 0, 1)"
});

// define and export the final config
const appConfig = CORE_CONFIG.mergeDeep(APP_CONFIG)
    .mergeDeep(OPS_CONFIG)
    .toJS();
export default appConfig;
