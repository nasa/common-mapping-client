import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MiscUtil from "_core/utils/MiscUtil";

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
            "current-coordinate": true
        });

        return (
            <div
                className={containerClasses}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: displayText }}
            />
        );
    }
}

MouseCoordinates.propTypes = {
    pixelCoordinate: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        pixelCoordinate: state.map.getIn(["view", "pixelHoverCoordinate"])
    };
}

export default connect(mapStateToProps, null)(MouseCoordinates);
