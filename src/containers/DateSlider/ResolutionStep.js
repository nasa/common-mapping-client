import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import KeyHandler, { KEYPRESS, KEYUP } from 'react-key-handler';
import {Button, IconButton} from 'react-toolbox/lib/button';
import * as appStrings from '../../constants/appStrings';
import * as DateSliderActions from '../../actions/DateSliderActions';
import MiscUtil from '../../utils/MiscUtil';

export class ResolutionStep extends Component {
    handleIncremendClick(up) {
        if(up) {
            if(this.props.resolution === appStrings.DATE_SLIDER_RESOLUTIONS.YEARS) {
                this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS);
            } else {
                this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.DAYS);
            }
        } else {
            if(this.props.resolution === appStrings.DATE_SLIDER_RESOLUTIONS.DAYS) {
                this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS);
            } else {
                this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.YEARS);
            }
        }
    }
    toggleResolutionSelector() {
        this.props.actions.setIsSelectionResolution(!this.props.isSelectingResolution);
    }
    render() {
        let resolutionSelectorClasses = MiscUtil.generateStringFromSet({
            "resolution-selector": true,
            "active": this.props.isSelectingResolution
        });
        return (
            <div id="dateSliderResolutionStepContainer" className="text-wrap">
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowUp" onKeyHandle={(evt) => {evt.altKey ? this.handleIncremendClick(true) : false;}} />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowDown" onKeyHandle={(evt) => {evt.altKey ? this.handleIncremendClick(false) : false;}} />
                <div className={resolutionSelectorClasses}>
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
                <IconButton
                    accent={this.props.isSelectingResolution}
                    onClick={() => this.toggleResolutionSelector()}
                    className="timeline-zoom" 
                    data-tip="Zoom the Slider"
                    data-place="left"
                >
                    <i className="button-icon ms ms-fw ms-zoom-to-point"></i>
                </IconButton>
            </div>
        );
    }
}
ResolutionStep.propTypes = {
    resolution: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    isSelectingResolution: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        resolution: state.dateSlider.get("resolution"),
        isSelectingResolution: state.dateSlider.get("isSelectingResolution")
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
