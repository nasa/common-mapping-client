/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Alerts/AlertGroup.scss";

export class AlertGroup extends Component {
    render() {
        let title = "Alert";
        if (this.props.alerts.length > 0) {
            title = this.props.alerts[0].get("title");
        }

        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <div className={containerClasses}>
                <Typography variant="h6">{title}</Typography>
                {this.props.alerts.map((alert, alertIndex) => (
                    <Typography
                        key={"alert" + alert.get("severity") + "_ " + alertIndex}
                        variant="body2"
                    >
                        {alert.get("body")}
                    </Typography>
                ))}
            </div>
        );
    }
}

AlertGroup.propTypes = {
    alerts: PropTypes.array.isRequired,
    className: PropTypes.string
};

export default AlertGroup;
