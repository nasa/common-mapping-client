// Map View Config

// EPSG:3413 Artic Polar
export const DEFAULT_PROJECTION = {
    code: "EPSG:3413",
    proj4Def: "+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
    extent: [-4194304, -4194304, 4194304, 4194304]
};

// EPSG:3857 Web Mercator
// export const DEFAULT_PROJECTION = {
//     code: "EPSG:3857",
//     proj4Def: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
//     latLonExtent: [-20026376.39, -20048966.10, 20026376.39, 20048966.10]
// };

// EPSG:4326 LAT LON
// export const DEFAULT_PROJECTION = {
//     code: "EPSG:4326",
//     proj4Def: "+proj=longlat +datum=WGS84 +no_defs",
//     latLonExtent: [-180, 90, 180, -90]
// };

export const DEFAULT_CENTER = [0,0];
// export const DEFAULT_CENTER = [-98.5795, 39.8282];
export const DEFAULT_ZOOM = 5;
export const MIN_ZOOM = 2;
export const MAX_ZOOM = 10000;
export const MAX_ZOOM_DISTANCE_3D = 26000000.0;
export const MIN_ZOOM_DISTANCE_3D = 500.0;

// misc.
export const REFERENCE_LABELS_LAYER_ID = "Reference_Labels";
export const POLITICAL_BOUNDARIES_LAYER_ID = "Reference_Features";
export const DEFAULT_DATE = new Date("2015-05-20");
export const SCALE_OPTIONS = [
    { value: 'metric', label: 'Metric', abbrev: 'm/Km' },
    { value: 'imperial', label: 'Imperial', abbrev: 'ft/mi' },
    { value: 'nautical', label: 'Nautical', abbrev: 'nm' },
    { value: 'degrees', label: 'Degrees', abbrev: '°' }
];
