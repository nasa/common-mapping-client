/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as appStrings from "_core/constants/appStrings";
import styles from "_core/components/MouseFollower/DrawingTooltip.scss";

export class DrawingTooltip extends Component {
    render() {
        let beginHint = "Click to start drawing";
        let endHint = "Press enter to complete";
        let referenceGroup = this.props.drawing;

        // check the hint to begin
        if (this.props.measuring.get("isMeasuringEnabled")) {
            beginHint = "Click to start measuring";
            referenceGroup = this.props.measuring;
        }

        // set the hint to complete
        if (referenceGroup.get("geometryType") === appStrings.GEOMETRY_CIRCLE) {
            endHint = "Press enter or click to complete";
        } else if (referenceGroup.get("geometryType") === appStrings.GEOMETRY_LINE_STRING) {
            endHint = "Press enter or double-click to complete";
        } else if (referenceGroup.get("geometryType") === appStrings.GEOMETRY_POLYGON) {
            endHint = "Press enter or double-click to complete";
        }

        // TODO - make a data display component
        return (
            <div className={styles.drawingTooltip}>
                <div className={styles.beginHint}>{beginHint}</div>
                <div className={styles.endHint}>{endHint}</div>
            </div>
        );
    }
}

DrawingTooltip.propTypes = {
    drawing: PropTypes.object.isRequired,
    measuring: PropTypes.object.isRequired
};

export default connect()(DrawingTooltip);
