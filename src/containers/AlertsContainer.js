import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/AppActions';
import { Snackbar } from 'react-toolbox';
import Dialog from 'react-toolbox/lib/dialog';


export class AlertsContainer extends Component {
    render() {
        // reverst sort them according to severity and time of entry
        // we want the oldest, highest severity on bottom to appear first
        let alerts = this.props.alerts.sort((a, b) => {
            let aSeverity = a.get("severity");
            let bSeverity = b.get("severity");
            let aTime = a.get("time");
            let bTime = b.get("time");

            let ret = 0;
            if (aSeverity > bSeverity) {
                ret = 1;
            } else if (aSeverity < bSeverity) {
                ret = -1;
            } else if (aTime < bTime) {
                ret = 1;
            }
            return ret;
        });

        let topAlert = alerts.last();
        let alertPresent = typeof topAlert !== "undefined";

        let actions = [{
            label: "Dismiss",
            onClick: () => {
                this.props.actions.dismissAlert(topAlert);
            }
        }];

        return (
            <div className={alertPresent ? "" : "hidden"}>
                <Snackbar
                    action="Dismiss"
                    active={alertPresent && topAlert.get("severity") <= 2}
                    icon="warning"
                    label={alertPresent ? topAlert.get("body") : ""}
                    onClick={() => this.props.actions.dismissAlert(topAlert)}
                    type="warning"
                />
                <Dialog
                    actions={actions}
                    active={alertPresent && topAlert.get("severity") >= 3}
                    onEscKeyDown={() => this.props.actions.dismissAlert(topAlert)}
                    onOverlayClick={() => this.props.actions.dismissAlert(topAlert)}
                    title={alertPresent ? topAlert.get("title") : ""}
                >
                    <p>{alertPresent ? topAlert.get("body") : ""}</p>
                </Dialog>
            </div>
        );
    }
}

AlertsContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    alerts: PropTypes.object.isRequired
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
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertsContainer);
