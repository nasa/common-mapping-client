import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Snackbar } from 'react-toolbox';
import Dialog from 'react-toolbox/lib/dialog';
import * as actions from '../../actions/AppActions';


export class AlertsContainer extends Component {
    render() {
        // reverst sort them according to severity, title, and time of entry
        // we want the oldest, highest severity on bottom to appear first
        let alerts = this.props.alerts.sort((a, b) => {
            let aTitle = a.get("title");
            let bTitle = b.get("title");
            let aSeverity = a.get("severity");
            let bSeverity = b.get("severity");
            let aTime = a.get("time");
            let bTime = b.get("time");

            let ret = 0;

            if (aSeverity > bSeverity) {
                ret = 1;
            } else if (aSeverity < bSeverity) {
                ret = -1;
            } else {
                if (aTitle < bTitle) {
                    ret = 1;
                } else if (aTitle > bTitle) {
                    ret = -1;
                } else if (aTime < bTime) {
                    ret = 1;
                }
            }

            return ret;
        });

        let l3Alerts = alerts.filter((alert) => {
            return alert.get("severity") === 3;
        });
        let l2Alerts = alerts.filter((alert) => {
            return alert.get("severity") === 2;
        });
        let l1Alerts = alerts.filter((alert) => {
            return alert.get("severity") === 1;
        });

        let alertPresent = alerts.size > 0;

        let currAlert = alertPresent ? alerts.last() : this.lastAlert;
        this.lastAlert = currAlert;

        let numPending = Math.max(alerts.size - 1, 0);
        let dismissLabel = numPending === 0 ? "Dismiss" : "Next";

        let actions = [{
            label: "Dismiss All",
            onClick: () => {
                this.props.actions.dismissAllAlerts();
            }
        }, {
            label: dismissLabel,
            onClick: () => {
                this.props.actions.dismissAlert(currAlert);
            }
        }];

        return (
            <div className={alertPresent ? "" : "hidden"}>
                <Dialog
                    className="alert-dialogue"
                    actions={actions}
                    active={alertPresent && currAlert.get("severity") >= 3}
                    onEscKeyDown={() => this.props.actions.dismissAlert(currAlert)}
                    onOverlayClick={() => this.props.actions.dismissAlert(currAlert)}
                    title={currAlert ? currAlert.get("title") : ""}
                >
                    <p>{currAlert ? currAlert.get("body") : ""}</p>
                    <span className="alert-note"><span className="alert-note-active">{numPending}</span> more pending</span>
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
