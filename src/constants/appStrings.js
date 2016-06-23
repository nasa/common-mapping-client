export const APP_TITLE = 'RiPTIDE';
export const APP_VERSION = '0.1';
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

// for reference, not export
const URL_TEMPLATE_EXAMPLE = 'localhost:3000#activeLayers=lions,tigers,bears&opacities=tigers,0,bears,1,lions,0.5&viewMode=2d&basemap=land_water&extent=-180,-90,180,90&enablePlaceLables=false&enablePoliticalBoundaries=false&enable3DTerrain=true&date=2015-01-31';