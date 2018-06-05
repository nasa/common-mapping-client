/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { ModalMenu } from "_core/components/ModalMenu";
import { AlertList } from "_core/components/Alerts";
import MiscUtil from "_core/utils/MiscUtil";
import * as appActions from "_core/actions/appActions";
import styles from "_core/components/Alerts/AlertsContainer.scss";

export class AlertsContainer extends Component {
    render() {
        // process the alerts
        let alertsPresent = this.props.alerts.size > 0;

        // cache the groups for dismissal
        let alerts = alertsPresent ? this.props.alerts : this.prevGroups ? this.prevGroups : [];
        this.prevGroups = this.props.alerts;

        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <ModalMenu
                title="Alert"
                active={alertsPresent}
                className={containerClasses}
                closeFunc={() => {
                    this.props.appActions.dismissAllAlerts(this.props.alerts);
                }}
            >
                <AlertList alerts={alerts} />
            </ModalMenu>
        );
    }
}

AlertsContainer.propTypes = {
    appActions: PropTypes.object.isRequired,
    alerts: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    // find all the alerts from all the states
    let alerts = [];
    for (let subState in state) {
        if (state.hasOwnProperty(subState)) {
            let subStateAlerts = state[subState].get("alerts");
            if (typeof subStateAlerts !== "undefined") {
                if (alerts) {
                    alerts = subStateAlerts.concat(alerts);
                } else {
                    alerts = subStateAlerts;
                }
            }
        }
    }

    return {
        alerts: alerts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertsContainer);
