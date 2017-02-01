import * as appConfig_core from '_core/constants/appConfig';

/* APP DISPLAY */
export const APP_TITLE = appConfig_core.APP_TITLE; // display title for the app
export const APP_VERSION = appConfig_core.APP_VERSION; // current verison number
export const APP_SUBTITLE = appConfig_core.APP_SUBTITLE; // display subtitle
/* END APP DISPLAY */

/* VARIOUS URLS */
export const URLS = appConfig_core.URLS; // set of url endpoints for layer data, analytics, etc
/* END VARIOUS URLS */

/* SHAREABLE URL */
export const URL_KEYS = appConfig_core.URL_KEYS; // url keys for sharable urls
export const URL_KEY_ORDER = appConfig_core.URL_KEY_ORDER; // the order the url keys should be accessed
export const DEFAULT_AUTO_UPDATE_URL_ENABLED = appConfig_core.DEFAULT_AUTO_UPDATE_URL_ENABLED; // should the url update by default
/* END SHAREABLE URL */

/* ANALYTICS */
export const DEFAULT_ANALYTICS_ENABLED = appConfig_core.DEFAULT_ANALYTICS_ENABLED; // should analytics be enabled by default
export const GOOGLE_ANALYTICS_ENABLED = appConfig_core.GOOGLE_ANALYTICS_ENABLED; // should google analytics be enabled
export const GOOGLE_ANALYTICS_ID = appConfig_core.GOOGLE_ANALYTICS_ID; // google analytics app id
export const ANALYTICS_BATCH_WAIT_TIME_MS = appConfig_core.ANALYTICS_BATCH_WAIT_TIME_MS; // wait time for batched analytics updates
export const ANALYTICS_BATCH_SIZE = appConfig_core.ANALYTICS_BATCH_SIZE; // analytics batch size
export const SESSION_ID = appConfig_core.SESSION_ID; // analytics session id
/* END ANALYTICS */


/* DATE */
export const DEFAULT_DATE = appConfig_core.DEFAULT_DATE; // default date for the app
export const MIN_DATE = appConfig_core.MIN_DATE; // min date for the app date slider
export const MAX_DATE = appConfig_core.MAX_DATE; // max date for the app date slider
export const YEAR_ARRAY = appConfig_core.YEAR_ARRAY; // array of valid year strings given the min/max date
export const MONTH_ARRAY = appConfig_core.MONTH_ARRAY; // array of valid month strings
export const DAY_ARRAY = appConfig_core.DAY_ARRAY; // array of valid day strings
export const DATE_SLIDER_RESOLUTIONS = appConfig_core.DATE_SLIDER_RESOLUTIONS; // set of available date slider resolution selections
/* END DATE */

/* MAP */
export const DEFAULT_PROJECTION = appConfig_core.DEFAULT_PROJECTION; // map projection for the 2D map
export const DEFAULT_BBOX_EXTENT = appConfig_core.DEFAULT_BBOX_EXTENT; // default view extents for the maps
export const DEFAULT_SCALE_UNITS = appConfig_core.DEFAULT_SCALE_UNITS; // default scale units for measurement tools
export const DEFAULT_TERRAIN_EXAGGERATION = appConfig_core.DEFAULT_TERRAIN_EXAGGERATION; // default terrain exaggeration levels for th 3D map
export const DEFAULT_TERRAIN_ENDPOINT = appConfig_core.DEFAULT_TERRAIN_ENDPOINT; // endpoint for terrain data for the 3D map
export const DEFAULT_TERRAIN_ENABLED = appConfig_core.DEFAULT_TERRAIN_ENABLED; // enable terrain by default in the 3D map
export const MIN_ZOOM = appConfig_core.MIN_ZOOM; // minimum zoom level for the 2D map
export const MAX_ZOOM = appConfig_core.MAX_ZOOM; // maximum zoom level for the 2D map
export const MAX_ZOOM_DISTANCE_3D = appConfig_core.MAX_ZOOM_DISTANCE_3D; // maximum zoom level for the 3D map
export const MIN_ZOOM_DISTANCE_3D = appConfig_core.MIN_ZOOM_DISTANCE_3D; // minimum zoom level for the 3D map
export const REFERENCE_LABELS_LAYER_ID = appConfig_core.REFERENCE_LABELS_LAYER_ID; // layer id for the reference labels layer
export const POLITICAL_BOUNDARIES_LAYER_ID = appConfig_core.POLITICAL_BOUNDARIES_LAYER_ID; // layer id for the reference boundaries layer
export const SCALE_OPTIONS = appConfig_core.SCALE_OPTIONS; // scale options for measurement tools
export const TERRAIN_EXAGGERATION_OPTIONS = appConfig_core.TERRAIN_EXAGGERATION_OPTIONS; // terrain exaggeration options
export const GEOMETRY_FILL_COLOR = appConfig_core.GEOMETRY_FILL_COLOR; // default fill color for drawing shapes
export const GEOMETRY_STROKE_COLOR = appConfig_core.GEOMETRY_STROKE_COLOR; // default stroke color for drawing shapes
export const GEOMETRY_STROKE_WEIGHT = appConfig_core.GEOMETRY_STROKE_WEIGHT; // default stroke weight for drawing shapes
export const MEASURE_FILL_COLOR = appConfig_core.MEASURE_FILL_COLOR; // default fill color for measurement shapes
export const MEASURE_STROKE_COLOR = appConfig_core.MEASURE_STROKE_COLOR; // default stroke color for measurement shapes
/* END MAP */
