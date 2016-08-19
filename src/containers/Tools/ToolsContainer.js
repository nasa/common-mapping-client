import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, IconButton } from 'react-toolbox/lib/button';
import * as actions from '../../actions/MapActions';
import * as mapStrings from '../../constants/mapStrings';
import MiscUtil from '../../utils/MiscUtil';
import ReactTooltip from 'react-tooltip';

const CircleIcon = () => (
    <svg className="CircleIcon" viewBox="0 0 24 24">
        <path fill="#000000" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    </svg>
);
export class ToolsContainer extends Component {
    render() {
        let toolsClasses = MiscUtil.generateStringFromSet({
            "tools-container": true,
            "hidden": !this.props.toolsOpen
        });
        return (
            <div className={toolsClasses}>
                <IconButton
                    neutral
                    onClick={() => {this.props.actions.disableDrawing(); this.props.actions.enableDrawing(mapStrings.GEOMETRY_CIRCLE)}}
                    data-tip="Draw Circle"
                    data-place="right">
                    <CircleIcon/>
                </IconButton>
                <IconButton
                    neutral
                    onClick={() => {this.props.actions.disableDrawing(); this.props.actions.enableDrawing(mapStrings.GEOMETRY_LINE_STRING)}}
                    data-tip="Draw LineString"
                    data-place="right">
                    <i className="ms ms-line"/>
                </IconButton>
                <IconButton
                    neutral
                    onClick={() => {this.props.actions.disableDrawing(); this.props.actions.enableDrawing(mapStrings.GEOMETRY_POLYGON)}}
                    data-tip="Draw Polygon"
                    data-place="right">
                    <i className="ms ms-polygon"/>
                </IconButton>
                <IconButton
                    neutral
                    onClick={() => {this.props.actions.removeAllGeometries()}}
                    data-tip="Delete All Shapes"
                    data-place="right"
                    icon="delete">
                </IconButton>
            </div>
        );
    }
}

ToolsContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    toolsOpen: PropTypes.bool.isRequired,
    isDrawingEnabled: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        toolsOpen: state.tools.get("isOpen"),
        isDrawingEnabled: state.map.getIn(["drawing", "isDrawingEnabled"])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolsContainer);
