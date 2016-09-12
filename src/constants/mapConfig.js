import * as mapStrings from './mapStrings';
import moment from "moment";

// Map View Config
export const DEFAULT_PROJECTION = mapStrings.PROJECTIONS.latlon;
export const DEFAULT_CENTER = [0, 0];
export const DEFAULT_ZOOM = 3;
export const DEFAULT_SCALE_UNITS = 'meters';
export const DEFAULT_TERRAIN_ENDPOINT = '//assets.agi.com/stk-terrain/world';
export const MIN_ZOOM = 2;
export const MAX_ZOOM = 10000;
export const MAX_ZOOM_DISTANCE_3D = 26000000.0;
export const MIN_ZOOM_DISTANCE_3D = 500.0;

// misc.
export const REFERENCE_LABELS_LAYER_ID = "Reference_Labels";
export const POLITICAL_BOUNDARIES_LAYER_ID = "Reference_Features";
// export const DEFAULT_DATE = new Date();
export const DEFAULT_DATE = moment("2015-05-20", "YYYY-MM-DD").toDate(); // set to 2015-05-20 for testing
export const SCALE_OPTIONS = [
    { value: 'metric', label: 'Metric', abbrev: 'm/km', qtyType: 'm'},
    { value: 'imperial', label: 'Imperial', abbrev: 'ft/mi', qtyType: 'ft'},
    { value: 'nautical', label: 'Nautical', abbrev: 'nmi', qtyType: 'nmi'},
    { value: 'schoolbus', label: 'Schoolbus', abbrev: '', qtyType: 'm' }
];
export const GEOMETRY_FILL_COLOR = "rgba(255, 255, 255, 0.2)";
export const GEOMETRY_STROKE_COLOR = "rgba(255, 204, 0, 1)";
export const GEOMETRY_STROKE_WEIGHT = 3;

export const MEASURE_FILL_COLOR = "rgba(255, 255, 255, 0.2)";
export const MEASURE_STROKE_COLOR = "rgba(255, 255, 255, 0.75)";
