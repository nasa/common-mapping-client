import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MiscUtil from "_core/utils/MiscUtil";
import MouseCoordinates from "_core/components/MouseFollower/MouseCoordinates";

export class CoordinateTracker extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            active: !this.props.mapControlsHidden,
            "distraction-free": this.props.distractionFreeMode
        });

        return (
            <div id="mouseCoordinateTracker" className={containerClasses}>
                <MouseCoordinates />
            </div>
        );
    }
}

CoordinateTracker.propTypes = {
    distractionFreeMode: PropTypes.bool.isRequired,
    mapControlsHidden: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        distractionFreeMode: state.view.get("distractionFreeMode"),
        mapControlsHidden: state.view.get("mapControlsHidden")
    };
}

export default connect(mapStateToProps, null)(CoordinateTracker);
