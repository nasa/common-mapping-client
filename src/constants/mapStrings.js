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
export const LAYER_GIBS = 'GIBS';
export const LAYER_WMTS = 'wmts';
export const LAYER_XYZ = 'xyz';
export const LAYER_VECTOR_GEOJSON = 'vector_geojson';
export const LAYER_VECTOR_TOPOJSON = 'vector_topojson';
export const LAYER_VECTOR_KML = 'vector_kml';
export const LAYER_VECTOR_DRAWING = 'vector_drawing';

// layer colorbar formats
export const COLORBAR_IMAGE = "image";
export const COLORBAR_JSON_FIXED = "json-fixed";
export const COLORBAR_JSON_RELATIVE = "json-relative";

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