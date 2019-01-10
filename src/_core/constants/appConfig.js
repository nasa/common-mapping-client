/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/*global __VERSION__*/

import moment from "moment";
import * as appStrings from "_core/constants/appStrings";

/* APP DISPLAY */
export const APP_TITLE = "Common Mapping Client";
export const APP_VERSION = __VERSION__ || "Unknown Version"; // __VERSION__ is a plugin defined in webpack config. Use eslint global flag for this global excpetion.
export const APP_SUBTITLE = APP_VERSION.split(".")
    .slice(0, 2)
    .join(".");
/* END APP DISPLAY */

/* VARIOUS URLS */
export const URLS = {
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
    paletteConfig: "default-data/_core_default-data/palettes.json",
    analyticsEndpoint: "http://localhost:3050/analyticsEndpoint"
};
/* END VARIOUS URLS */

/* SHAREABLE URL */
export const URL_KEYS = {
    ACTIVE_LAYERS: "l",
    VIEW_MODE: "vm",
    BASEMAP: "b",
    VIEW_EXTENT: "ve",
    ENABLE_PLACE_LABLES: "pl",
    ENABLE_POLITICAL_BOUNDARIES: "pb",
    ENABLE_3D_TERRAIN: "tr",
    DATE: "d",
    TIMELINE_RES: "tlr"
};
export const DEFAULT_AUTO_UPDATE_URL_ENABLED = true;
/* END SHAREABLE URL */

/* ANALYTICS */
export const DEFAULT_ANALYTICS_ENABLED = false;
export const GOOGLE_ANALYTICS_ENABLED = false;
export const GOOGLE_ANALYTICS_ID = "";
export const ANALYTICS_BATCH_WAIT_TIME_MS = 5000;
export const ANALYTICS_BATCH_SIZE = 10;
export const SESSION_ID = (() => {
    // generate random 7 digit string
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 7; ++i) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
})();
/* END ANALYTICS */

/* DATE */
export const DEFAULT_DATE = moment(new Date())
    .subtract(3, "d")
    .startOf("d")
    .toDate();
export const MIN_DATE = moment("1900-01-01", "YYYY-MM-DD", true).toDate();
export const MAX_DATE = moment(new Date())
    .add(1, "month")
    .toDate();
export const DATE_SLIDER_RESOLUTIONS = [
    {
        label: appStrings.SECONDS,
        resolution: appStrings.SECONDS,
        format: "YYYY MMM DD, HH:mm:ss",
        visMajorFormat: "D MMMM HH:mm"
    },
    {
        label: appStrings.MINUTES,
        resolution: appStrings.MINUTES,
        format: "YYYY MMM DD, HH:mm:ss",
        visMajorFormat: "ddd D MMMM"
    },
    {
        label: appStrings.HOURS,
        resolution: appStrings.HOURS,
        format: "YYYY MMM DD, HH:mm:ss",
        visMajorFormat: "ddd D MMMM"
    },
    {
        label: appStrings.DAYS,
        resolution: appStrings.DAYS,
        format: "YYYY MMM DD",
        visMajorFormat: "MMMM YYYY"
    },
    {
        label: appStrings.MONTHS,
        resolution: appStrings.MONTHS,
        format: "YYYY MMM DD",
        visMajorFormat: "YYYY"
    },
    {
        label: appStrings.YEARS,
        resolution: appStrings.YEARS,
        format: "YYYY MMM DD",
        visMajorFormat: "YYYY"
    }
];
export const DEFAULT_DATE_SLIDER_RESOLUTION = DATE_SLIDER_RESOLUTIONS[3];
/* END DATE */

/* MAP */
export const DEFAULT_PROJECTION = appStrings.PROJECTIONS.latlon;
export const DEFAULT_AVAILABLE_PROJECTIONS = [
    appStrings.PROJECTIONS.latlon,
    appStrings.PROJECTIONS.webmercator,
    appStrings.PROJECTIONS.northpolar,
    appStrings.PROJECTIONS.southpolar
];
export const DEFAULT_BBOX_EXTENT = [-90, -45, 90, 45];
export const DEFAULT_MAP_EXTENT = undefined; // Ex: [-360, -90, 360, 90]
export const DEFAULT_SCALE_UNITS = "metric";
export const DEFAULT_TERRAIN_EXAGGERATION = 1;
export const DEFAULT_TERRAIN_ENDPOINT = "//assets.agi.com/stk-terrain/world";
export const DEFAULT_TERRAIN_ENABLED = false;
export const MIN_ZOOM = 2;
export const MAX_ZOOM = 16;
export const MAX_ZOOM_DISTANCE_3D = 26000000.0;
export const MIN_ZOOM_DISTANCE_3D = 500.0;
export const GIBS_IMAGERY_RESOLUTIONS = {
    [appStrings.PROJECTIONS.latlon.code]: [
        0.5625,
        0.28125,
        0.140625,
        0.0703125,
        0.03515625,
        0.017578125,
        0.0087890625,
        0.00439453125,
        0.002197265625,
        0.0010986328125,
        0.00054931640625,
        0.00027465820313
    ],
    [appStrings.PROJECTIONS.webmercator.code]: [
        156543.03392804085,
        78271.51696402043,
        39135.75848201021,
        19567.879241005106,
        9783.939620502553,
        4891.969810251277,
        2445.9849051256383,
        1222.9924525628192,
        611.4962262814096,
        305.7481131407048,
        152.8740565703524,
        76.4370282851762,
        38.2185141425881,
        19.10925707129405
    ],
    [appStrings.PROJECTIONS.northpolar.code]: [8192, 4096, 2048, 1024, 512, 256],
    [appStrings.PROJECTIONS.southpolar.code]: [8192, 4096, 2048, 1024, 512, 256]
};
export const MAX_RESOLUTION = GIBS_IMAGERY_RESOLUTIONS[appStrings.PROJECTIONS.latlon.code][0];
export const MAX_LAYER_CACHE = 50;
export const DELETE_LAYER_PARTIALS = true;

export const REFERENCE_LABELS_LAYER_ID = "Reference_Labels";
export const POLITICAL_BOUNDARIES_LAYER_ID = "Reference_Features";

export const SCALE_OPTIONS = [
    { value: "metric", label: "Metric", abbrev: "m/km", qtyType: "m" },
    { value: "imperial", label: "Imperial", abbrev: "ft/mi", qtyType: "ft" },
    { value: "nautical", label: "Nautical", abbrev: "nmi", qtyType: "nmi" },
    { value: "schoolbus", label: "Schoolbus", abbrev: "", toMeters: 13.72 }
];

export const TERRAIN_EXAGGERATION_OPTIONS = [
    { value: 0.5, label: "0.5" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" }
];

export const GEOMETRY_FILL_COLOR = "rgba(255, 255, 255, 0.1)";
export const GEOMETRY_STROKE_COLOR = "rgba(255, 255, 255, 1)";
export const GEOMETRY_STROKE_WEIGHT = 2;
export const GEOMETRY_OUTLINE_COLOR = "rgba(0, 0, 0, 1)";

export const TILE_LAYER_UPDATE_STRATEGY = appStrings.TILE_LAYER_UPDATE_STRATEGIES.TILE; // {openlayers only} strategy for updating tile layers
export const DEFAULT_TILE_TRANSITION_TIME = 150; // {openlayers only} set to 0 to disable http://openlayers.org/en/latest/apidoc/ol.source.WMTS.html

/* END MAP */

/* WORKERS */
export const DEFAULT_WEB_WORKER_NUM = 0;
/* END WORKERS */
