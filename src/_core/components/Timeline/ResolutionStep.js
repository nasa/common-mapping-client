/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import KeyboardArrowUpIcon from "material-ui-icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "material-ui-icons/KeyboardArrowDown";
import Paper from "material-ui/Paper";
import { IncrementButton, IncrementIcon } from "_core/components/DatePicker";
import { DateSliderAction } from "actions";
import appConfig from "constants/appConfig";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Timeline/ResolutionStep.scss";

export class ResolutionStep extends Component {
    render() {
        let currentResolution = MiscUtil.findObjectWithIndexInArray(
            appConfig.DATE_SLIDER_RESOLUTIONS,
            "resolution",
            this.props.resolution.get("resolution")
        );
        let canIncrementStep =
            currentResolution.index < appConfig.DATE_SLIDER_RESOLUTIONS.length - 1;
        let canDecrementStep = currentResolution.index > 0;

        let higherResolutionComponent = "";
        if (canIncrementStep) {
            higherResolutionComponent = (
                <Button
                    classes={{ label: styles.stepButtonLabel }}
                    onClick={() => {
                        this.props.setDateResolution(
                            appConfig.DATE_SLIDER_RESOLUTIONS[currentResolution.index + 1],
                            false
                        );
                    }}
                >
                    {appConfig.DATE_SLIDER_RESOLUTIONS[currentResolution.index + 1].label}
                    <span className={styles.stepIconContainer}>
                        <KeyboardArrowUpIcon />
                    </span>
                </Button>
            );
        }

        let lowerResolutionComponent = "";
        if (canDecrementStep) {
            lowerResolutionComponent = (
                <Button
                    classes={{ label: styles.stepButtonLabel }}
                    onClick={() => {
                        this.props.setDateResolution(
                            appConfig.DATE_SLIDER_RESOLUTIONS[currentResolution.index - 1],
                            false
                        );
                    }}
                >
                    {appConfig.DATE_SLIDER_RESOLUTIONS[currentResolution.index - 1].label}
                    <span className={styles.stepIconContainer}>
                        <KeyboardArrowDownIcon />
                    </span>
                </Button>
            );
        }

        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.container]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div className={containerClasses}>
                <Grid container spacing={0}>
                    <Grid item xs={12} className={styles.stepContainer}>
                        {higherResolutionComponent}
                    </Grid>
                    <Grid item xs={12} className={styles.currentStepContainer}>
                        <Paper classes={{ root: styles.currentStepPaper }}>
                            <Typography className={styles.currentStepLabel}>
                                {this.props.resolution.get("label")}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} className={styles.stepContainer}>
                        {lowerResolutionComponent}
                    </Grid>
                </Grid>
            </div>
        );
    }
}
ResolutionStep.propTypes = {
    setDateResolution: PropTypes.func.isRequired,
    resolution: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        resolution: state.dateSlider.get("resolution")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setDateResolution: bindActionCreators(DateSliderAction.setDateResolution, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResolutionStep);
