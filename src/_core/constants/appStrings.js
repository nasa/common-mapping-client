/* MAP */
// map library types
export const MAP_LIB_2D = 'openlayers';
export const MAP_LIB_3D = 'cesium';

// map view modes
export const MAP_VIEW_MODE_2D = 'MAP_VIEW_MODE_2D';
export const MAP_VIEW_MODE_3D = 'MAP_VIEW_MODE_3D';

// layer group types
export const LAYER_GROUP_TYPE_BASEMAP = "basemap";
export const LAYER_GROUP_TYPE_DATA = "data";
export const LAYER_GROUP_TYPE_REFERENCE = "reference";
export const LAYER_GROUP_TYPE_PARTIAL = "partial";

// layer config formats
export const LAYER_CONFIG_JSON = 'json';
export const LAYER_CONFIG_WMTS_XML = 'wmts/xml';

// layer handler types
export const LAYER_GIBS_RASTER = 'GIBS_raster';
export const LAYER_WMTS_RASTER = 'wmts_raster';
export const LAYER_XYZ_RASTER = 'xyz_raster';
export const LAYER_VECTOR_GEOJSON = 'vector_geojson';
export const LAYER_VECTOR_TOPOJSON = 'vector_topojson';
export const LAYER_VECTOR_KML = 'vector_kml';
export const LAYER_VECTOR_DRAWING = 'vector_drawing';

// layer colorbar formats
export const COLORBAR_IMAGE = "image";
export const COLORBAR_JSON_FIXED = "json-fixed";
export const COLORBAR_JSON_RELATIVE = "json-relative";

// file formats
export const FILE_TYPE_JSON = "json";
export const FILE_TYPE_MARKDOWN = "markdown";

// tile URL function
export const DEFAULT_URL_FUNC = "DEFAULT_URL_FUNC";
export const ESRI_CUSTOM_512 = "esriCustom512";
export const KVP_TIME_PARAM = "kvpTimeParam";
export const CATS_URL = 'catsUrl';

// tile load function
export const CATS_TILE_OL = 'catsTile_OL';
export const CATS_TILE_CS = 'catsTile_CS';

// drawing geometry types
export const GEOMETRY_CIRCLE = 'Circle';
export const GEOMETRY_LINE_STRING = 'LineString';
export const GEOMETRY_POLYGON = 'Polygon';

// measurement types
export const MEASURE_DISTANCE = 'Distance';
export const MEASURE_AREA = 'Area';

// interaction types
export const INTERACTION_DRAW = 'Draw';
export const INTERACTION_MEASURE = 'Measure';

// event types
export const EVENT_MOUSE_HOVER = 'mousemove';
export const EVENT_MOVE_END = 'moveend';
export const EVENT_MOUSE_CLICK = 'click';

// coordinate types
export const COORDINATE_TYPE_CARTESIAN = 'Cartesian';
export const COORDINATE_TYPE_CARTOGRAPHIC = 'Cartographic';

// projections
export const PROJECTIONS = {
    northpolar: {
        code: "EPSG:3413",
        proj4Def: "+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
        extent: [-4194304, -4194304, 4194304, 4194304]
    },
    webmercator: {
        code: "EPSG:3857",
        proj4Def: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
        extent: [-20026376.39, -20048966.10, 20026376.39, 20048966.10]
    },
    latlon: {
        code: "EPSG:4326",
        proj4Def: "+proj=longlat +datum=WGS84 +no_defs",
        extent: [-180, -90, 180, 90]
    }
};
/* END MAP */

/* MISC */
export const MAP_CONTEXT_MENU_ID = "mapContextMenu";
/* END MISC */

/* ALERTS */
export const ALERTS = {
    INITIAL_DATA_LOAD_FAILED: {
        title: "Data Loading Failed",
        formatString: "Failed to load initial data for this application.",
        severity: 5
    },
    URL_CONFIG_FAILED: {
        title: "Loading from URL Failed",
        formatString: "Failed to load application state configuration from url parameters.",
        severity: 4
    },
    LAYER_ACTIVATION_FAILED: {
        title: "Layer Activation Failed",
        formatString: "Activating {LAYER} on the {MAP} map failed.",
        severity: 5
    },
    BASEMAP_UPDATE_FAILED: {
        title: "Basemap Update Failed",
        formatString: "Activating {LAYER} as the basemap on the {MAP} map failed.",
        severity: 3
    },
    LAYER_OPACITY_CHANGE_FAILED: {
        title: "Layer Opacity Change Failed",
        formatString: "Setting opacity for {LAYER} failed.",
        severity: 3
    },
    GEOMETRY_SYNC_FAILED: {
        title: "Geometry Sync Failed",
        formatString: "Synchronizing geometry on the {MAP} map failed.",
        severity: 2
    },
    GEOMETRY_REMOVAL_FAILED: {
        title: "Shape Removal Failed",
        formatString: "Removal of all shapes from the {MAP} map failed.",
        severity: 3
    },
    MEASUREMENT_REMOVAL_FAILED: {
        title: "Measurement Removal Failed",
        formatString: "Removal of all measurements from the {MAP} map failed.",
        severity: 3
    },
    VIEW_MODE_CHANGE_FAILED: {
        title: "Map View Mode Change Failed",
        formatString: "Changing of map view mode to {MAP_VIEW_MODE} failed.",
        severity: 3
    },
    VIEW_SYNC_FAILED: {
        title: "Setting Map Extent Failed",
        formatString: "Setting the extent of the {MAP} map failed.",
        severity: 2
    },
    SET_DATE_FAILED: {
        title: "Date Update Failed",
        formatString: "Setting the date in the {MAP} map failed.",
        severity: 4
    },
    CREATE_MAP_FAILED: {
        title: "Map Creation Failed",
        formatString: "The {MAP} map failed to initialize.",
        severity: 5
    },
    FETCH_METADATA_FAILED: {
        title: "Loading Metadata Failed",
        formatString: "Could not retrieve metadata for {LAYER}.",
        severity: 3
    }
};
/* END ALERTS */
