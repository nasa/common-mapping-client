export const APP_TITLE = 'RiPTIDE';
export const APP_VERSION = '0.1';
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

// Date slider strings, maybe we need a misc? or a datesliderStrings?
export const DATE_SLIDER_RESOLUTIONS = {
	DAYS: "Days",
	MONTHS: "Months",
	YEARS: "Years"
};

export const ALERTS = {
	LAYER_ACTIVATION_FAILED: {
		title: "Layer Activation Failed",
		formatString: "Activating {LAYER} on the {MAP} map failed.",
		severity: 3
	}
};