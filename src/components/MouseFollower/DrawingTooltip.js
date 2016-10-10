import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as mapStrings from '../../constants/mapStrings';

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
        if (referenceGroup.get("geometryType") === mapStrings.GEOMETRY_CIRCLE) {
            endHint = "Press enter or click to complete";
        } else if (referenceGroup.get("geometryType") === mapStrings.GEOMETRY_LINE_STRING) {
            endHint = "Press enter or double-click to complete";
        } else if (referenceGroup.get("geometryType") === mapStrings.GEOMETRY_POLYGON) {
            endHint = "Press enter or double-click to complete";
        }

        // TODO - make a data display component
        return (
            <div className="drawing-tooltip">
                <div className="begin-hint">
                    {beginHint}
                </div>
                <div className="end-hint">
                    {endHint}
                </div>
            </div>
        );
    }
}

DrawingTooltip.propTypes = {
    drawing: PropTypes.object.isRequired,
    measuring: PropTypes.object.isRequired
};

export default connect()(DrawingTooltip);
