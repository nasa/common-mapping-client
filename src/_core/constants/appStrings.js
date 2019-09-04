/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* MAP */
// map library types
export const MAP_LIB_2D = "openlayers";
export const MAP_LIB_3D = "cesium";

// map view modes
export const MAP_VIEW_MODE_2D = "2D";
export const MAP_VIEW_MODE_3D = "3D";

// map pan directions
export const MAP_PAN_DIRECTION_UP = "MAP_PAN_DIRECTION_UP";
export const MAP_PAN_DIRECTION_DOWN = "MAP_PAN_DIRECTION_DOWN";
export const MAP_PAN_DIRECTION_LEFT = "MAP_PAN_DIRECTION_LEFT";
export const MAP_PAN_DIRECTION_RIGHT = "MAP_PAN_DIRECTION_RIGHT";

// layer group types
export const LAYER_GROUP_TYPE_BASEMAP = "basemap";
export const LAYER_GROUP_TYPE_DATA = "data";
export const LAYER_GROUP_TYPE_REFERENCE = "reference";
export const LAYER_GROUP_TYPE_PARTIAL = "partial";

// layer config formats
export const LAYER_CONFIG_JSON = "json";
export const LAYER_CONFIG_WMTS_XML = "wmts/xml";
export const LAYER_CONFIG_WMS_XML = "wms/xml";

// layer handler types
export const LAYER_GIBS_RASTER = "GIBS_raster";
export const LAYER_WMTS_RASTER = "wmts_raster";
export const LAYER_WMS_RASTER = "wms_raster";
export const LAYER_XYZ_RASTER = "xyz_raster";
export const LAYER_VECTOR_GEOJSON = "vector_geojson";
export const LAYER_VECTOR_TOPOJSON = "vector_topojson";
export const LAYER_VECTOR_KML = "vector_kml";

// layer colorbar formats
export const COLORBAR_IMAGE = "image";
export const COLORBAR_JSON_FIXED = "json-fixed";
export const COLORBAR_JSON_RELATIVE = "json-relative";

// file formats
export const FILE_TYPE_JSON = "json";
export const FILE_TYPE_MARKDOWN = "markdown";
export const FILE_TYPE_XML = "xml";
export const FILE_TYPE_TEXT = "xml";

// tile URL function
export const DEFAULT_URL_FUNC_WMTS = "DEFAULT_URL_FUNC_WMTS";
export const DEFAULT_URL_FUNC_WMS = "DEFAULT_URL_FUNC_WMS";
export const ESRI_CUSTOM_512 = "esriCustom512";
export const KVP_TIME_PARAM_WMTS = "kvpTimeParam_wmts";
export const KVP_TIME_PARAM_WMS = "kvpTimeParam_wms";
export const CATS_URL = "catsUrl";

// tile load function
export const CATS_TILE_OL = "catsTile_OL";
export const CATS_TILE_CS = "catsTile_CS";

// drawing geometry types
export const GEOMETRY_CIRCLE = "Circle";
export const GEOMETRY_LINE_STRING = "LineString";
export const GEOMETRY_POLYGON = "Polygon";
export const GEOMETRY_POINT = "Point";
export const GEOMETRY_LINE = "Line";
export const GEOMETRY_BOX = "Box";

// map of CMC geometry types to OpenLayers geometry types
export const OL_GEOMETRY_TYPES = {
    [GEOMETRY_CIRCLE]: GEOMETRY_CIRCLE,
    [GEOMETRY_LINE_STRING]: GEOMETRY_LINE_STRING,
    [GEOMETRY_POLYGON]: GEOMETRY_POLYGON,
    [GEOMETRY_POINT]: GEOMETRY_POINT,
    [GEOMETRY_LINE]: GEOMETRY_LINE_STRING,
    [GEOMETRY_BOX]: GEOMETRY_CIRCLE
};

// measurement types
export const MEASURE_DISTANCE = "Distance";
export const MEASURE_AREA = "Area";

// interaction types
export const INTERACTION_DRAW = "Draw";
export const INTERACTION_MEASURE = "Measure";

// Shape types
export const SHAPE_DISTANCE = "Shape_Distance";
export const SHAPE_AREA = "Shape_Area";

// event types
export const EVENT_MOUSE_HOVER = "mousemove";
export const EVENT_MOVE_END = "moveend";
export const EVENT_MOUSE_CLICK = "click";

// coordinate types
export const COORDINATE_TYPE_CARTESIAN = "Cartesian";
export const COORDINATE_TYPE_CARTOGRAPHIC = "Cartographic";

// timeline resolutions
export const SECONDS = "seconds";
export const MINUTES = "minutes";
export const HOURS = "hours";
export const DAYS = "days";
export const MONTHS = "months";
export const YEARS = "years";

// projections
export const PROJECTIONS = {
    northpolar: {
        code: "EPSG:3413",
        proj4Def:
            "+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
        extent: [-4194304, -4194304, 4194304, 4194304],
        aliases: ["northpolar", "urn:ogc:def:crs:EPSG::3413"]
    },
    southpolar: {
        code: "EPSG:3031",
        proj4Def:
            "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
        extent: [-4194304, -4194304, 4194304, 4194304],
        aliases: ["southpolar", "urn:ogc:def:crs:EPSG::3031"]
    },
    webmercator: {
        code: "EPSG:3857",
        proj4Def:
            "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
        extent: [-20026376.39, -20048966.1, 20026376.39, 20048966.1],
        aliases: [
            "webmercator",
            "EPSG:102100",
            "EPSG:102113",
            "EPSG:900913",
            "urn:ogc:def:crs:EPSG:6.18:3:3857",
            "urn:ogc:def:crs:EPSG::3857",
            "http://www.opengis.net/gml/srs/epsg.xml#3857"
        ]
    },
    latlon: {
        code: "EPSG:4326",
        proj4Def: "+proj=longlat +datum=WGS84 +no_defs",
        extent: [-180, -90, 180, 90],
        aliases: [
            "latlon",
            "CRS:84",
            "urn:ogc:def:crs:EPSG::4326",
            "urn:ogc:def:crs:EPSG:6.6:4326",
            "urn:ogc:def:crs:OGC:1.3:CRS84",
            "urn:ogc:def:crs:OGC:2:84",
            "http://www.opengis.net/gml/srs/epsg.xml#4326",
            "urn:x-ogc:def:crs:EPSG:4326"
        ]
    }
};

// tile layer updates
export const TILE_LAYER_UPDATE_STRATEGIES = {
    TILE: "replace_tile",
    LAYER: "replace_layer"
};
/* END MAP */

/* MISC */
export const MAP_CONTEXT_MENU_ID = "mapContextMenu";
export const WORKER_TASK_COMPLETE = "WORKER_TASK_COMPLETE";
export const WORKER_TASK_COMPLETE_ERROR = "WORKER_TASK_COMPLETE_ERROR";
export const WORKER_TASK_CLOSE = "WORKER_TASK_CLOSE";
export const WORKER_TASK_TEST = "WORKER_TASK_TEST";
/* END MISC */

/* ALERTS */
export const ALERTS = {
    INITIAL_DATA_LOAD_FAILED: {
        title: "Data Loading Failed",
        formatString: "Failed to load data for this application.",
        severity: 3
    },
    URL_CONFIG_FAILED: {
        title: "Loading from URL Failed",
        formatString: "Failed to load application state configuration from url parameters.",
        severity: 2
    },
    BROWSER_FUNCTIONALITY_MISSING: {
        title: "Missing Browser Functionality",
        formatString:
            "Browser does not support {FUNCTIONALITY}. {SYMPTOM}. Please refer to the System Requirements section in Help for a list of supported browsers.",
        severity: 2
    },
    LAYER_ACTIVATION_FAILED: {
        title: "Layer Activation Failed",
        formatString: "Activating {LAYER} on the {MAP} map failed.",
        severity: 2
    },
    BASEMAP_UPDATE_FAILED: {
        title: "Basemap Update Failed",
        formatString: "Activating {LAYER} as the basemap on the {MAP} map failed.",
        severity: 2
    },
    LAYER_OPACITY_CHANGE_FAILED: {
        title: "Layer Opacity Change Failed",
        formatString: "Setting opacity for {LAYER} failed.",
        severity: 2
    },
    GEOMETRY_SYNC_FAILED: {
        title: "Geometry Sync Failed",
        formatString: "Synchronizing geometry on the {MAP} map failed.",
        severity: 2
    },
    GEOMETRY_REMOVAL_FAILED: {
        title: "Shape Removal Failed",
        formatString: "Removal of all shapes from the {MAP} map failed.",
        severity: 2
    },
    MEASUREMENT_REMOVAL_FAILED: {
        title: "Measurement Removal Failed",
        formatString: "Removal of all measurements from the {MAP} map failed.",
        severity: 2
    },
    VIEW_MODE_CHANGE_FAILED: {
        title: "Map View Mode Change Failed",
        formatString: "Changing of map view mode to {MAP_VIEW_MODE} failed.",
        severity: 2
    },
    VIEW_SYNC_FAILED: {
        title: "Setting Map Extent Failed",
        formatString: "Setting the extent of the {MAP} map failed.",
        severity: 2
    },
    SET_DATE_FAILED: {
        title: "Date Update Failed",
        formatString: "Setting the date in the {MAP} map failed.",
        severity: 2
    },
    CREATE_MAP_FAILED: {
        title: "Map Creation Failed",
        formatString: "The {MAP} map failed to initialize.",
        severity: 3
    },
    FETCH_METADATA_FAILED: {
        title: "Loading Metadata Failed",
        formatString: "Could not retrieve metadata for {LAYER}.",
        severity: 1
    },
    TIMELINE_RES_FAILED: {
        title: "Setting Timeline Resolution Failed",
        formatString: "Could not set the timeline resolution.",
        severity: 1
    },
    UNKNOWN_ASYNC_KEY: {
        title: "Async Data Error",
        formatString: "Unrecognized async key {KEY}",
        severity: 2
    }
};
/* END ALERTS */
