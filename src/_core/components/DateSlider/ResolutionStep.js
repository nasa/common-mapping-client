import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import KeyHandler, { KEYPRESS, KEYUP } from 'react-key-handler';
import {Button, IconButton} from 'react-toolbox/lib/button';
import * as appStrings from '_core/constants/appStrings';
import * as DateSliderActions from '_core/actions/DateSliderActions';
import MiscUtil from '_core/utils/MiscUtil';

export class ResolutionStep extends Component {
    adjustResolution(up) {
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
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowUp" onKeyHandle={() => this.adjustResolution(true)} />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowDown" onKeyHandle={() => this.adjustResolution(false)} />
                <div className={resolutionSelectorClasses}>
                    <Button
                        primary
                        label={appStrings.DATE_SLIDER_RESOLUTIONS.DAYS.label}
                        className="no-padding resolution-step small"
                        onClick={() => this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.DAYS)}
                    />
                    <Button
                        primary
                        label={appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS.label}
                        className="no-padding resolution-step small"
                        onClick={() => this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS)}
                    />
                    <Button
                        primary
                        label={appStrings.DATE_SLIDER_RESOLUTIONS.YEARS.label}
                        className="no-padding resolution-step small"
                        onClick={() => this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.YEARS)}
                    />
                </div>
                <IconButton
                    primary={this.props.isSelectingResolution}
                    onClick={() => this.toggleResolutionSelector()}
                    className="timeline-zoom"
                    icon="filter_list"
                    data-tip="Adjust the slider resolution"
                    data-place="left"
                />
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
