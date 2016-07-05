import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'react-toolbox/lib/button';
import * as appStrings from '../../constants/appStrings';
import * as DateSliderActions from '../../actions/DateSliderActions';
import MiscUtil from '../../utils/MiscUtil';

export class ResolutionStep extends Component {
    render() {
        return (
            <div id="dateSliderResolutionStepContainer" className="text-wrap">
                <Button
                    neutral
                    // inverse
                    label={appStrings.DATE_SLIDER_RESOLUTIONS.DAYS}
                    className="no-padding resolution-step small"
                    onClick={() => this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.DAYS)}
                />
                <Button
                    neutral
                    // inverse
                    label={appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS}
                    className="no-padding resolution-step small"
                    onClick={() => this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS)}
                />
                <Button
                    neutral
                    // inverse
                    label={appStrings.DATE_SLIDER_RESOLUTIONS.YEARS}
                    className="no-padding resolution-step small"
                    onClick={() => this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.YEARS)}
                />
            </div>
        );
    }
}
ResolutionStep.propTypes = {
    resolution: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        resolution: state.dateSlider.get("resolution")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(DateSliderActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResolutionStep);
