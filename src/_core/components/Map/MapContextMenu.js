import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ContextMenu, MenuItem } from "react-contextmenu";
import { Button } from 'react-toolbox/lib/button';
import { ContextMenuSubMenu } from '_core/components/Reusables/ContextMenuSubMenu';
import * as actions from '_core/actions/MapActions';
import * as appStrings from '_core/constants/appStrings';

export class MapContextMenu extends Component {

    dummyHandleClick(data) {
        // The Context Menu component library *fails* when you don't give an item
        // a click listener, so we have this here to keep it happy. 
        return false;
    }

    handleClearMap() {
        this.props.actions.removeAllDrawings();
        this.props.actions.removeAllMeasurements();
    }

    render() {
        let drawingCircle = this.props.drawing.get("isDrawingEnabled") && this.props.drawing.get("geometryType") === appStrings.GEOMETRY_CIRCLE;
        let drawingLineString = this.props.drawing.get("isDrawingEnabled") && this.props.drawing.get("geometryType") === appStrings.GEOMETRY_LINE_STRING;
        let drawingPolygon = this.props.drawing.get("isDrawingEnabled") && this.props.drawing.get("geometryType") === appStrings.GEOMETRY_POLYGON;
        let measuringDistance = this.props.measuring.get("isMeasuringEnabled") && this.props.measuring.get("geometryType") === appStrings.GEOMETRY_LINE_STRING;
        let measuringArea = this.props.measuring.get("isMeasuringEnabled") && this.props.measuring.get("geometryType") === appStrings.GEOMETRY_POLYGON;
        return (
            <ContextMenu identifier={appStrings.MAP_CONTEXT_MENU_ID}>
                <ContextMenuSubMenu title="Measure" icon="" customIcon="ms ms-measure-distance context-menu-icon">
                    <MenuItem data={{}} onClick={this.dummyHandleClick}>
                        <Button
                            primary={measuringDistance}
                            onClick={() => this.props.actions.enableMeasuring(appStrings.GEOMETRY_LINE_STRING, appStrings.MEASURE_DISTANCE)}
                            className="context-menu-item" >
                            <i className="ms ms-measure-distance context-menu-icon" />
                            <span className="context-menu-label">Distance</span>
                        </Button>
                    </MenuItem>
                    <MenuItem data={{}} onClick={this.dummyHandleClick}>
                        <Button
                            primary={measuringArea}
                            onClick={() => this.props.actions.enableMeasuring(appStrings.GEOMETRY_POLYGON, appStrings.MEASURE_AREA)}
                            className="context-menu-item" >
                            <i className="ms ms-measure-area context-menu-icon" />
                            <span className="context-menu-label">Area</span>
                        </Button>
                    </MenuItem>
                    <hr className="divider medium-light" />
                    <MenuItem data={{}} onClick={this.dummyHandleClick}>
                        <Button
                            label="Clear Measurements"
                            icon="delete"
                            onClick={() => this.props.actions.removeAllMeasurements()}
                            className="context-menu-item" />
                    </MenuItem>
                </ContextMenuSubMenu>
                <ContextMenuSubMenu title="Draw" icon="mode_edit" customIcon="">
                    <MenuItem data={{}} onClick={this.dummyHandleClick}>
                        <Button
                            primary={drawingCircle}
                            label="Circle"
                            icon="radio_button_unchecked"
                            onClick={() => this.props.actions.enableDrawing(appStrings.GEOMETRY_CIRCLE)}
                            className="context-menu-item" />
                    </MenuItem>
                    <MenuItem data={{}} onClick={this.dummyHandleClick}>
                        <Button
                            primary={drawingLineString}
                            onClick={() => this.props.actions.enableDrawing(appStrings.GEOMETRY_LINE_STRING)}
                            className="context-menu-item" >
                            <i className="ms ms-line context-menu-icon" />
                            <span className="context-menu-label">Polyline</span>
                        </Button>
                    </MenuItem>
                    <MenuItem data={{}} onClick={this.dummyHandleClick}>
                        <Button
                            primary={drawingPolygon}
                            onClick={() => this.props.actions.enableDrawing(appStrings.GEOMETRY_POLYGON)}
                            className="context-menu-item" >
                            <i className="ms ms-polygon context-menu-icon" />
                            <span className="context-menu-label">Polygon</span>
                        </Button>
                    </MenuItem>
                    <hr className="divider medium-light" />
                    <MenuItem data={{}} onClick={this.dummyHandleClick}>
                        <Button
                            label="Clear Drawings"
                            icon="delete"
                            onClick={() => this.props.actions.removeAllDrawings()}
                            className="context-menu-item" />
                    </MenuItem>
                </ContextMenuSubMenu>
                <hr className="divider medium-light" />
                <MenuItem data={{}} onClick={this.dummyHandleClick}>
                    <Button
                        label="Clear Map"
                        icon="delete"
                        onClick={() => this.handleClearMap()}
                        className="context-menu-item" />
                </MenuItem>
            </ContextMenu>
        );
    }
}

MapContextMenu.propTypes = {
    drawing: PropTypes.object.isRequired,
    measuring: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        drawing: state.map.get("drawing"),
        measuring: state.map.get("measuring")
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
)(MapContextMenu);
