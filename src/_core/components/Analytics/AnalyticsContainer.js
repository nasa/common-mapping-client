import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appConfig from 'constants/appConfig';
import * as actions from '_core/actions/AnalyticsActions';
import ReactGA from 'react-ga';

export class AnalyticsContainer extends Component {
    componentDidMount() {
        this.batchInterval = null;
        this.checkInterval();
        if (appConfig.GOOGLE_ANALYTICS_ENABLED) {
            // Initialize basic google analytics tracking
            ReactGA.initialize(appConfig.GOOGLE_ANALYTICS_ID);
            // Initialize root page view to start collecting data
            ReactGA.pageview('/');
            // Can also use ReactGA.pageview elsewhere to note view changes
            // Can also use ReactGA.event to log custom events if desired
        }
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
