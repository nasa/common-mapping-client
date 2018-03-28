/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { AlertLevel } from "_core/components/Alerts";
import MiscUtil from "_core/utils/MiscUtil";

export class AlertList extends Component {
    sortAlerts(alerts) {
        // sort alerts according to severity, title, and time of entry
        return alerts.sort((a, b) => {
            let aTitle = a.get("title");
            let bTitle = b.get("title");
            let aSeverity = a.get("severity");
            let bSeverity = b.get("severity");
            let aTime = a.get("time");
            let bTime = b.get("time");

            let ret = 0;

            if (aSeverity > bSeverity) {
                ret = -1;
            } else if (aSeverity < bSeverity) {
                ret = 1;
            } else {
                if (aTitle < bTitle) {
                    ret = -1;
                } else if (aTitle > bTitle) {
                    ret = 1;
                } else if (aTime < bTime) {
                    ret = -1;
                }
            }

            return ret;
        });
    }
    groupAlerts(alerts) {
        // break the alerts into groups based on title
        return alerts.reduce((acc, alert, i, arr) => {
            let severityGroup = acc[acc.length - 1];
            if (severityGroup && severityGroup[0][0].get("severity") === alert.get("severity")) {
                let alertGroup = severityGroup[severityGroup.length - 1];
                if (alertGroup && alertGroup[0].get("title") === alert.get("title")) {
                    alertGroup.push(alert);
                } else {
                    severityGroup.push([alert]);
                }
            } else {
                acc.push([[alert]]);
            }
            return acc;
        }, []);
    }
    render() {
        // process the alerts
        let alerts = this.sortAlerts(this.props.alerts);
        let alertGroups = this.groupAlerts(alerts);

        // store numbers
        let numAlerts = alerts.size;
        let alertsPresent = numAlerts > 0;

        let containerClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div className={containerClasses}>
                {alertGroups.map((severityGroup, severityIndex) => (
                    <AlertLevel
                        key={
                            "alertSeverityGroup" +
                            severityGroup[0][0].get("severity") +
                            "_" +
                            severityIndex
                        }
                        alerts={severityGroup}
                        severity={severityGroup[0][0].get("severity")}
                    />
                ))}
            </div>
        );
    }
}

AlertList.propTypes = {
    alerts: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    className: PropTypes.string
};

export default AlertList;
