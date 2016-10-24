export const MAP_CONTEXT_MENU_ID = "mapContextMenu";

// Alert templates
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
