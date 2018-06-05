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
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Paper from "@material-ui/core/Paper";
import { IncrementButton, IncrementIcon } from "_core/components/DatePicker";
import * as dateSliderActions from "_core/actions/dateSliderActions";
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
                        this.props.dateSliderActions.setDateResolution(
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
                        this.props.dateSliderActions.setDateResolution(
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
    dateSliderActions: PropTypes.object.isRequired,
    resolution: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return {
        dateSliderActions: bindActionCreators(dateSliderActions, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        resolution: state.dateSlider.get("resolution")
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResolutionStep);
