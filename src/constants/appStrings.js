export const APP_TITLE = 'Common Mapping Client';
export const APP_VERSION = '0.9-beta';
export const APP_SUBTITLE = APP_VERSION;
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

export const MAP_CONTEXT_MENU = "MAP_CONTEXT_MENU";

// Date slider strings, maybe we need a misc? or a datesliderStrings?
export const DATE_SLIDER_RESOLUTIONS = {
    DAYS: "Days",
    MONTHS: "Months",
    YEARS: "Years"
};

// alert templates
export const ALERTS = {
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
    VIEW_SYNC_FAILED: {
        title: "View Sync Failed",
        formatString: "Synchronizing the view on the {MAP} map failed.",
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
    }
};
