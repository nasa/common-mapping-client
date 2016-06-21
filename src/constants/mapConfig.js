// Map View Config
export const DEFAULT_PROJECTION = 'EPSG:4326';
export const DEFAULT_CENTER = [-98.5795, 39.8282];
export const DEFAULT_EXTENT = [-180, -90, 180, 90];
export const DEFAULT_ZOOM = 5;
export const MIN_ZOOM = 2;
export const MAX_ZOOM = 16;
export const MAX_ZOOM_DISTANCE_3D = 26000000.0;
export const MIN_ZOOM_DISTANCE_3D = 500.0;

// misc.
export const REFERENCE_LABELS_LAYER_ID = "Reference_Labels";
export const POLITICAL_BOUNDARIES_LAYER_ID = "Reference_Features";
export const DEFAULT_DATE = new Date("2015-05-20");
export const SCALE_OPTIONS = [{ value: 'metric', label: 'Metric', abbrev: 'm/Km' },
    { value: 'imperial', label: 'Imperial', abbrev: 'ft/mi' },
    { value: 'nautical', label: 'Nautical', abbrev: 'nm' },
    { value: 'degrees', label: 'Degrees', abbrev: '°/\'/"' }
];