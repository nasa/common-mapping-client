/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Typography from "material-ui/Typography";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/MouseFollower/MouseCoordinates.scss";

export class MouseCoordinates extends Component {
    render() {
        let latCoord = this.props.pixelCoordinate.get("lat");
        let lonCoord = this.props.pixelCoordinate.get("lon");

        let latUnit = latCoord >= 0 ? "°E" : "°W";
        let lonUnit = lonCoord >= 0 ? "°N" : "°S";

        let currCoord =
            MiscUtil.padNumber(Math.abs(lonCoord).toFixed(3), 5, "&nbsp;") +
            lonUnit +
            "," +
            MiscUtil.padNumber(Math.abs(latCoord).toFixed(3), 6, "&nbsp;") +
            latUnit;

        let displayText = this.props.pixelCoordinate.get("isValid")
            ? currCoord
            : " ------" + lonUnit + ", ------" + latUnit;

        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.text]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <Typography
                variant="body1"
                className={containerClasses}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: displayText }}
            />
        );
    }
}

MouseCoordinates.propTypes = {
    pixelCoordinate: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        pixelCoordinate: state.map.getIn(["view", "pixelHoverCoordinate"])
    };
}

export default connect(mapStateToProps, null)(MouseCoordinates);
