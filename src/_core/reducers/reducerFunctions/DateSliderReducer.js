import Immutable from 'immutable';
import appConfig from 'constants/appConfig';
import { alert } from '_core/reducers/models/alert';
import * as appStrings from '_core/constants/appStrings';

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.
export default class DateSliderReducer {
    static beginDragging(state, action) {
        return state.set("isDragging", true);
    }

    static endDragging(state, action) {
        return state
            .set("isDragging", false)
            .setIn(["hoverDate", "isValid"], false);
    }

    static hoverDate(state, action) {
        return state
            .setIn(["hoverDate", "date"], action.date)
            .setIn(["hoverDate", "x"], action.x)
            .setIn(["hoverDate", "isValid"], true);
    }

    static timelineMouseOut(state, action) {
        return state.setIn(["hoverDate", "isValid"], false);
    }

    static setDateResolution(state, action) {
        let alerts = state.get("alerts");
        let actionResolution = action.resolution;
        if (typeof actionResolution === "string") {
            actionResolution = actionResolution.toLowerCase();
            switch (actionResolution) {
                case "days":
                    actionResolution = appConfig.DATE_SLIDER_RESOLUTIONS.DAYS;
                    break;
                case "months":
                    actionResolution = appConfig.DATE_SLIDER_RESOLUTIONS.MONTHS;
                    break;
                case "years":
                    actionResolution = appConfig.DATE_SLIDER_RESOLUTIONS.YEARS;
                    break;
                default:
                    alerts = alerts.push(alert.merge({
                        title: appStrings.ALERTS.TIMELINE_RES_FAILED.title,
                        body: appStrings.ALERTS.TIMELINE_RES_FAILED.formatString,
                        severity: appStrings.ALERTS.TIMELINE_RES_FAILED.severity,
                        time: new Date()
                    }));
                    actionResolution = state.get("resolution").toJS();
            }
        }

        if (actionResolution) {
            state = state
                .setIn(["resolution", "label"], actionResolution.label)
                .setIn(["resolution", "resolution"], actionResolution.resolution);
        } else {
            alerts = alerts.push(alert.merge({
                title: appStrings.ALERTS.TIMELINE_RES_FAILED.title,
                body: appStrings.ALERTS.TIMELINE_RES_FAILED.formatString,
                severity: appStrings.ALERTS.TIMELINE_RES_FAILED.severity,
                time: new Date()
            }));
        }

        return state.set("alerts", alerts);
    }

    static dismissAlert(state, action) {
        let remAlert = action.alert;
        return state.set("alerts", state.get("alerts").filter((alert) => {
            return alert !== remAlert;
        }));
    }

    static dismissAllAlerts(state, action) {
        return state.set("alerts", state.get("alerts").clear());
    }

    static resetApplicationState(state, action) {
        let newState = this.endDragging(state, action);
        newState = this.setDateResolution(newState, { resolution: appConfig.DATE_SLIDER_RESOLUTIONS.DAYS });
        return newState;
    }
}
