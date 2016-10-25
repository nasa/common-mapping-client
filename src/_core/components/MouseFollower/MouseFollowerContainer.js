import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DrawingTooltip from '_core/components/MouseFollower/DrawingTooltip';
import MiscUtil from '_core/utils/MiscUtil';

export class MouseFollowerContainer extends Component {
    render() {
        let maxLeft = window.innerWidth - 300;
        let maxTop = window.innerHeight;

        let top = parseInt(this.props.pixelCoordinate.get("y"));
        let left = parseInt(this.props.pixelCoordinate.get("x"));

        let style = { top, left };

        let drawOrMeasure = this.props.drawing.get("isDrawingEnabled") || this.props.measuring.get("isMeasuringEnabled");

        let currCoord = this.props.pixelCoordinate.get("lat").toFixed(3) + "," + this.props.pixelCoordinate.get("lon").toFixed(3);

        let containerClasses = MiscUtil.generateStringFromSet({
            "mouse-follower-container dark": true,
            "active": drawOrMeasure,
            "right": left > maxLeft
        });

        // TODO - make a data display component
        return (
            <div className={containerClasses} style={style}>
                <div className="content-container">
                    <DrawingTooltip
                        drawing={this.props.drawing}
                        measuring={this.props.measuring}
                    />
                </div>
                <div className="current-coordinate">
                    {currCoord}
                </div>
            </div>
        );
    }
}

MouseFollowerContainer.propTypes = {
    pixelCoordinate: PropTypes.object.isRequired,
    drawing: PropTypes.object.isRequired,
    measuring: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        pixelCoordinate: state.map.getIn(["view", "pixelHoverCoordinate"]),
        drawing: state.map.get("drawing"),
        measuring: state.map.get("measuring")
    };
}

export default connect(
    mapStateToProps,
    null
)(MouseFollowerContainer);
