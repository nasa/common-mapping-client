/*global __VERSION__*/

import moment from 'moment';
import * as appStrings from '_core/constants/appStrings';

/* APP DISPLAY */
export const APP_TITLE = 'Common Mapping Client';
export const APP_VERSION = __VERSION__ || 'Unknown Version'; // __VERSION__ is a plugin defined in webpack config. Use eslint global flag for this global excpetion.
export const APP_SUBTITLE = APP_VERSION.split(".").slice(0,2).join(".");
/* END APP DISPLAY */

/* VARIOUS URLS */
export const URLS = {
    layerConfig: [{
        url: "default-data/_core_default-data/capabilities.xml",
        type: "wmts/xml"
    }, {
        url: "default-data/_core_default-data/layers.json",
        type: "json"
    }],
    paletteConfig: "default-data/_core_default-data/palettes.json",
    analyticsEndpoint: "http://localhost:3050/analyticsEndpoint"
};
/* END VARIOUS URLS */

/* SHAREABLE URL */
export const URL_KEYS = {
    ACTIVE_LAYERS: 'activeLayers',
    OPACITIES: 'opacities',
    VIEW_MODE: 'viewMode',
    BASEMAP: 'basemap',
    VIEW_EXTENT: 'extent',
    ENABLE_PLACE_LABLES: 'enablePlaceLables',
    ENABLE_POLITICAL_BOUNDARIES: 'enablePoliticalBoundaries',
    ENABLE_3D_TERRAIN: 'enable3DTerrain',
    DATE: 'date'
};

export const URL_KEY_ORDER = [
    URL_KEYS.OPACITIES,
    URL_KEYS.VIEW_MODE,
    URL_KEYS.VIEW_EXTENT,
    URL_KEYS.DATE,
    URL_KEYS.ENABLE_3D_TERRAIN,
    URL_KEYS.ENABLE_PLACE_LABLES,
    URL_KEYS.ACTIVE_LAYERS,
    URL_KEYS.BASEMAP,
    URL_KEYS.ENABLE_POLITICAL_BOUNDARIES
];
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
export const DEFAULT_DATE = moment(new Date()).subtract(3, "d").startOf('d').toDate();
export const MIN_DATE = moment("2000-06-01", "YYYY-MM-DD").toDate();
export const MAX_DATE = moment(new Date()).add(1, 'month').toDate();
export const YEAR_ARRAY = (() => {
    // generate array of years spanning configured range
    let yearArr = [];
    let startYr = parseInt(moment(MIN_DATE).format("YYYY"));
    let endYr = parseInt(moment(MAX_DATE).format("YYYY"));
    for (let tmpYr = startYr; tmpYr <= endYr; ++tmpYr) {
        yearArr.push("" + tmpYr);
    }
    return yearArr;
})();
export const MONTH_ARRAY = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
export const DAY_ARRAY = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
export const DATE_SLIDER_RESOLUTIONS = {
    DAYS: { label: "Days", resolution: 512 },
    MONTHS: { label: "Months", resolution: 16 },
    YEARS: { label: "Years", resolution: 1 }
};
/* END DATE */

/* MAP */
// Map View Config
export const DEFAULT_PROJECTION = appStrings.PROJECTIONS.latlon;
export const DEFAULT_BBOX_EXTENT = [-90,-45,90,45];
export const DEFAULT_SCALE_UNITS = 'metric';
export const DEFAULT_TERRAIN_EXAGGERATION = 1;
export const DEFAULT_TERRAIN_ENDPOINT = '//assets.agi.com/stk-terrain/world';
export const MIN_ZOOM = 2;
export const MAX_ZOOM = 10000;
export const MAX_ZOOM_DISTANCE_3D = 26000000.0;
export const MIN_ZOOM_DISTANCE_3D = 500.0;

export const REFERENCE_LABELS_LAYER_ID = "Reference_Labels";
export const POLITICAL_BOUNDARIES_LAYER_ID = "Reference_Features";

export const SCALE_OPTIONS = [
    { value: 'metric', label: 'Metric', abbrev: 'm/km', qtyType: 'm' },
    { value: 'imperial', label: 'Imperial', abbrev: 'ft/mi', qtyType: 'ft' },
    { value: 'nautical', label: 'Nautical', abbrev: 'nmi', qtyType: 'nmi' },
    { value: 'schoolbus', label: 'Schoolbus', abbrev: '', toMeters: 13.72 }
];

export const TERRAIN_EXAGGERATION_OPTIONS = [
    { value: 0.5, label: '0.5' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 5, label: '5' },
    { value: 10, label: '10' }
];

export const GEOMETRY_FILL_COLOR = "rgba(255, 255, 255, 0.2)";
export const GEOMETRY_STROKE_COLOR = "rgba(255, 204, 0, 1)";
export const GEOMETRY_STROKE_WEIGHT = 3;

export const MEASURE_FILL_COLOR = "rgba(255, 255, 255, 0.2)";
export const MEASURE_STROKE_COLOR = "rgba(255, 255, 255, 0.75)";
/* END MAP */
