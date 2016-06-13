import Immutable from 'immutable';

export const toolsContainerState = Immutable.fromJS({
    selectedSubpage: "",
    subpages: {
        "animation": {
            startDate: null,
            endDate: null
        },
        "snapshot": {
            date: null
        },
        "charting": {
            startDate: null,
            endDate: null
        }
    },
    alerts: []
});