import Immutable from 'immutable';
import appConfig from 'constants/appConfig';

export const dateSliderState = Immutable.fromJS({
	isDragging: false,
	hoverDate: {
		date: null,
		x: 0,
		isValid: false
	},
	resolution: appConfig.DEFAULT_DATE_SLIDER_RESOLUTION,
	alerts: []
});