import Immutable from 'immutable';

export const alertState = Immutable.fromJS({
    alerts: []
});

export const alert = Immutable.fromJS({
    title: "Alert",
    body: "There was an error",
    severity: 1,
    time: new Date()
});