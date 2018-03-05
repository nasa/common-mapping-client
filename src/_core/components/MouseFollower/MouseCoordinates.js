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
import MapUtil from "_core/utils/MapUtil";
import styles from "_core/components/MouseFollower/MouseCoordinates.scss";

export class MouseCoordinates extends Component {
    render() {
        let lat = this.props.pixelCoordinate.get("lat");
        let lon = this.props.pixelCoordinate.get("lon");

        let displayText = MapUtil.formatLatLon(lat, lon, this.props.pixelCoordinate.get("isValid"));

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
