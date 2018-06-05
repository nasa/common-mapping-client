/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import MiscUtil from "_core/utils/MiscUtil";
import { MouseCoordinates } from "_core/components/MouseFollower";
import styles from "_core/components/Map/CoordinateTracker.scss";
import displayStyles from "_core/styles/display.scss";
import textStyles from "_core/styles/text.scss";

export class CoordinateTracker extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.coordinateTracker]: true,
            [displayStyles.hiddenFadeOut]: this.props.distractionFreeMode,
            [displayStyles.hiddenFadeIn]: !this.props.distractionFreeMode,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <Paper elevation={2} className={containerClasses}>
                <MouseCoordinates className={textStyles.fontRobotoMono} />
            </Paper>
        );
    }
}

CoordinateTracker.propTypes = {
    distractionFreeMode: PropTypes.bool.isRequired,
    mapControlsHidden: PropTypes.bool.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        distractionFreeMode: state.view.get("distractionFreeMode"),
        mapControlsHidden: state.view.get("mapControlsHidden")
    };
}

export default connect(mapStateToProps, null)(CoordinateTracker);
