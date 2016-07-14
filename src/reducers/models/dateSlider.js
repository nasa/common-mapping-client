import Immutable from 'immutable';
import * as appStrings from '../../constants/appStrings';

export const dateSliderState = Immutable.fromJS({
	isDragging: false,
	hoverDate: {
		date: null,
		x: 0,
		isValid: false
	},
	resolution: appStrings.DATE_SLIDER_RESOLUTIONS.YEARS,
	resolutionHack: false,
	sliderCollapsed: false
});