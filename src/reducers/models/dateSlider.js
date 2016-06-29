import Immutable from 'immutable';

export const dateSliderState = Immutable.fromJS({
	isDragging: false,
	hoverDate: {
		date: null,
		x: 0,
		isValid: false
	}
});