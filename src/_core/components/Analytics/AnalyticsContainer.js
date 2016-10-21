import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ContextMenuLayer } from "react-contextmenu";
import { bindActionCreators } from 'redux';
import * as appConfig from '../../constants/appConfig';
import * as actions from '../../actions/AnalyticsActions';

export class AnalyticsContainer extends Component {
    componentDidMount() {
        this.batchInterval = null;
        this.checkInterval();
    }
    
    componentDidUpdate() {
        this.checkInterval();
    }

    checkInterval() {
        if (this.props.isEnabled) {
            if (this.batchInterval === null) {
                // every 5 seconds, check to see if it's been more than 5 seconds since
                // the last analytics batch was sent. If it has, send out the current batch
                this.batchInterval = setInterval(() => {
                    if (new Date() - this.props.timeLastSent >= appConfig.ANALYTICS_BATCH_WAIT_TIME_MS) {
                        this.props.actions.sendAnalyticsBatch();
                    }
                }, appConfig.ANALYTICS_BATCH_WAIT_TIME_MS);
            }
        } else {
            if (this.batchInterval !== null) {
                clearInterval(this.batchInterval);
                this.batchInterval = null;
            }
        }
    }

    render() {
        return (
            <div id="analyticsContainer" />
        );
    }
}

AnalyticsContainer.propTypes = {
    timeLastSent: PropTypes.object.isRequired,
    isEnabled: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        timeLastSent: state.analytics.get("timeLastSent"),
        isEnabled: state.analytics.get("isEnabled")
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
)(AnalyticsContainer);
