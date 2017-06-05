import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalMenuContainer from '_core/components/ModalMenu/ModalMenuContainer';
import * as actions from '_core/actions/AppActions';


export class AlertsContainer extends Component {
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
                acc.push([
                    [alert]
                ]);
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
        let alerstPresent = numAlerts > 0;

        // cache the groups for dismissal
        alertGroups = alerstPresent ? alertGroups : (this.prevGroups ? this.prevGroups : []);
        this.prevGroups = alertGroups;

        return (
            <ModalMenuContainer
                title="Alert"
                active={alerstPresent}
                closeFunc={() => {this.props.actions.dismissAllAlerts(this.props.alerts);}}>
                    {alertGroups.map((severityGroup, severityIndex) =>
                        <div key={"severity-group" + severityIndex} className={"alert-severity-group severity-" + severityGroup[0][0].get("severity")}>
                        {severityGroup.map((alertGroup, groupIndex) =>
                            <div key={"alert-group" + groupIndex} className="alert-group">
                                <span className="alert-group-title">{alertGroup[0].get("title")}</span>
                                {alertGroup.map((alert, alertIndex) =>
                                    <div key={"alert-" + groupIndex + "-" + alertIndex} className="alert-listing">
                                        {alert.get("body")}
                                    </div>
                                )}
                            </div>
                        )}
                        </div>
                    )}
            </ModalMenuContainer>
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
