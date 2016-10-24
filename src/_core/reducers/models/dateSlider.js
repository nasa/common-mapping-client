import Immutable from 'immutable';
import * as appStrings from '_core/constants/appStrings';

export const dateSliderState = Immutable.fromJS({
	isDragging: false,
	hoverDate: {
		date: null,
		x: 0,
		isValid: false
	},
	resolution: appStrings.DATE_SLIDER_RESOLUTIONS.DAYS,
	resolutionHack: false,
	sliderCollapsed: false,
	isSelectingResolution: false
});