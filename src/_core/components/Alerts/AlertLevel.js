/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import { AlertGroup } from "_core/components/Alerts";
import styles from "_core/components/Alerts/AlertLevel.scss";
import MiscUtil from "_core/utils/MiscUtil";

export class AlertLevel extends Component {
    render() {
        let severity = typeof this.props.severity !== "undefined" ? this.props.severity : 1;
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [styles["severity" + severity]]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div className={containerClasses}>
                {this.props.alerts.map((alertGroup, groupIndex) => (
                    <AlertGroup
                        key={"alertGroup" + severity + "_" + groupIndex}
                        alerts={alertGroup}
                    />
                ))}
                <Divider />
            </div>
        );
    }
}

AlertLevel.propTypes = {
    severity: PropTypes.number,
    alerts: PropTypes.array.isRequired,
    className: PropTypes.string
};

export default AlertLevel;
