/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { LonLatCoordinates } from "_core/components/Reusables";

export class MouseCoordinates extends Component {
    render() {
        return (
            <LonLatCoordinates
                lon={this.props.pixelCoordinate.get("lon")}
                lat={this.props.pixelCoordinate.get("lat")}
                invalid={!this.props.pixelCoordinate.get("isValid")}
                className={this.props.className}
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
