import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MiscUtil from '../../utils/MiscUtil';
import * as mapStrings from '../../constants/mapStrings';

export class MouseFollowerContainer extends Component {
    render() {
        let maxLeft = window.innerWidth - 250;
        let maxTop = window.innerHeight;

        let top = parseInt(this.props.pixelCoordinate.get("y"));
        let left = parseInt(this.props.pixelCoordinate.get("x")) + 25;
        let style = { top, left };

        let content = [];
        if(this.props.drawing.get("isDrawingEnabled") || this.props.measuring.get("isMeasuringEnabled")) {
            // place the coordinates at the top
            content.push("" + this.props.pixelCoordinate.get("lat").toFixed(3) + "," + this.props.pixelCoordinate.get("lon").toFixed(3) + "");

            // add drawing/measuring specific tag
            let referenceGroup = {};
            if(this.props.measuring.get("isMeasuringEnabled")) {
                content.push("Click to start measuring.");
                referenceGroup = this.props.measuring;
            } else {
                content.push("Click to start drawing.");
                referenceGroup = this.props.drawing;
            }

            // add shape hints
            if(referenceGroup.get("geometryType") === mapStrings.GEOMETRY_CIRCLE) {
                content.push( "Press enter or click to complete.");
            } else if (referenceGroup.get("geometryType") === mapStrings.GEOMETRY_LINE_STRING) {
                content.push("Press enter or double-click to complete.");
            } else if (referenceGroup.get("geometryType") === mapStrings.GEOMETRY_POLYGON) {
                content.push("Press enter or double-click to complete.");
            }
        }

        let containerClasses = MiscUtil.generateStringFromSet({
            "hidden": !this.props.pixelCoordinate.get("isValid") || content.length === 0
        });

        return (
            <div id="mouseFollowerContainer" className={containerClasses} style={style}>
                {content.map((line, i) => 
                    <div key={"mouse-follow-line-" + i} className={"mouse-follower-line line-" + i}>
                        {line}
                    </div>
                )}
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
