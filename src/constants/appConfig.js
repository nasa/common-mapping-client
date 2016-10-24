export const APP_TITLE = 'Common Mapping Client';
export const APP_VERSION = '0.9-beta';
export const APP_SUBTITLE = APP_VERSION;

// various urls for the app
export const URLS = {
    layerConfig: [{
        url: "default-data/capabilities.xml",
        type: "wmts/xml"
    }, {
        url: "default-data/layers.json",
        type: "json"
    }],
    paletteConfig: "default-data/palettes.json"
};

// keys for shareable url
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
