import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Button, IconButton } from "react-toolbox/lib/button";
import appConfig from "constants/appConfig";
import * as DateSliderActions from "_core/actions/DateSliderActions";
import MiscUtil from "_core/utils/MiscUtil";

export class ResolutionStep extends Component {
    constructor(props) {
        super(props);
    }
    toggleResolutionSelector() {
        this.isSelectingResolution = !this.isSelectingResolution;
        this.forceUpdate();
    }
    render() {
        let resolutionSelectorClasses = MiscUtil.generateStringFromSet({
            "resolution-selector": true,
            active: this.isSelectingResolution
        });
        let currentResolution = MiscUtil.findObjectWithIndexInArray(
            appConfig.DATE_SLIDER_RESOLUTIONS,
            "resolution",
            this.props.resolution.get("resolution")
        );
        let canIncrementStep =
            currentResolution.index <
            appConfig.DATE_SLIDER_RESOLUTIONS.length - 1;
        let canDecrementStep = currentResolution.index > 0;
        return (
            <div id="dateSliderResolutionStepContainer" className="text-wrap">
                <div className="no-margin">
                    <div className="increment-button">
                        <Button
                            neutral
                            disabled={!canDecrementStep}
                            icon="keyboard_arrow_up"
                            className="no-padding"
                            onClick={() => {
                                this.props.actions.setDateResolution(
                                    appConfig.DATE_SLIDER_RESOLUTIONS[
                                        currentResolution.index - 1
                                    ],
                                    false
                                );
                            }}
                        />
                    </div>
                    <div>{this.props.resolution.get("label")}</div>
                    <div className="increment-button">
                        <Button
                            neutral
                            disabled={!canIncrementStep}
                            icon="keyboard_arrow_down"
                            className="no-padding"
                            onClick={() => {
                                this.props.actions.setDateResolution(
                                    appConfig.DATE_SLIDER_RESOLUTIONS[
                                        currentResolution.index + 1
                                    ],
                                    false
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
ResolutionStep.propTypes = {
    actions: PropTypes.object.isRequired,
    resolution: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(DateSliderActions, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        resolution: state.dateSlider.get("resolution")
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResolutionStep);
