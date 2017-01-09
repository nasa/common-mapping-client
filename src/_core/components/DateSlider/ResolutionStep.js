import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import KeyHandler, { KEYPRESS, KEYUP } from 'react-key-handler';
import {Button, IconButton} from 'react-toolbox/lib/button';
import * as appConfig from 'constants/appConfig';
import * as DateSliderActions from '_core/actions/DateSliderActions';
import MiscUtil from '_core/utils/MiscUtil';

const miscUtil = new MiscUtil();

export class ResolutionStep extends Component {
    adjustResolution(up) {
        if(up) {
            if(this.props.resolution.get("label") === appConfig.DATE_SLIDER_RESOLUTIONS.YEARS.label) {
                this.props.actions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.MONTHS);
            } else {
                this.props.actions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.DAYS);
            }
        } else {
            if(this.props.resolution.get("label") === appConfig.DATE_SLIDER_RESOLUTIONS.DAYS.label) {
                this.props.actions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.MONTHS);
            } else {
                this.props.actions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.YEARS);
            }
        }
    }
    toggleResolutionSelector() {
        this.props.actions.setIsSelectionResolution(!this.props.isSelectingResolution);
    }
    render() {
        let resolutionSelectorClasses = miscUtil.generateStringFromSet({
            "resolution-selector": true,
            "active": this.props.isSelectingResolution
        });
        return (
            <div id="dateSliderResolutionStepContainer" className="text-wrap">
                <IconButton
                    primary={this.props.isSelectingResolution}
                    onClick={() => this.toggleResolutionSelector()}
                    className="timeline-zoom"
                    icon="filter_list"
                    data-tip="Adjust the slider resolution"
                    data-place="left"
                />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowUp" onKeyHandle={() => this.adjustResolution(true)} />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowDown" onKeyHandle={() => this.adjustResolution(false)} />
                <div className={resolutionSelectorClasses}>
                    <Button
                        primary
                        tabIndex={this.props.isSelectingResolution ? 0 : -1}
                        label={appConfig.DATE_SLIDER_RESOLUTIONS.DAYS.label}
                        className="no-padding resolution-step small"
                        onClick={() => this.props.actions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.DAYS)}
                    />
                    <Button
                        primary
                        tabIndex={this.props.isSelectingResolution ? 0 : -1}
                        label={appConfig.DATE_SLIDER_RESOLUTIONS.MONTHS.label}
                        className="no-padding resolution-step small"
                        onClick={() => this.props.actions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.MONTHS)}
                    />
                    <Button
                        primary
                        tabIndex={this.props.isSelectingResolution ? 0 : -1}
                        label={appConfig.DATE_SLIDER_RESOLUTIONS.YEARS.label}
                        className="no-padding resolution-step small"
                        onClick={() => this.props.actions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.YEARS)}
                    />
                </div>
            </div>
        );
    }
}
ResolutionStep.propTypes = {
    resolution: PropTypes.object.isRequired,
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
