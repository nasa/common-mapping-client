import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "react-toolbox/lib/button";
import Modernizr from "modernizr";
import { ContextMenuSubMenu } from "_core/components/Reusables/ContextMenuSubMenu";
import * as actions from "_core/actions/MapActions";
import * as appActions from "_core/actions/AppActions";
import * as appStrings from "_core/constants/appStrings";
import appConfig from "constants/appConfig";
import MiscUtil from "_core/utils/MiscUtil";
import { EyeIcon, EyeOffIcon } from "_core/components/Reusables/CustomIcons";
import { MenuItem } from "react-toolbox/lib/menu";

export class MapControlsContainer extends Component {
    componentDidMount() {
        this.hideMapControlsTimeout = null;
        this.mouseMovementTimeThreshold = 2000;
        this.hideMapControlsEnabled = false;
        this._isInDistractionFreeMode = false;
    }
    componentWillUpdate(nextProps, nextState) {
        // If we're not going to be in distractionFreeMode we can stop everything
        if (!nextProps.distractionFreeMode) {
            this.stopListeningToMouseMovement();
            this._isInDistractionFreeMode = false;
        } else if (
            !this.props.distractionFreeMode &&
            nextProps.distractionFreeMode
        ) {
            // If we are transitioning to distractionFreeMode
            this._isInDistractionFreeMode = true;
        }
    }
    startListeningToMouseMovement() {
        this.hideMapControlsTimeout = setTimeout(() => {
            this.hideMapControls();
        }, this.mouseMovementTimeThreshold);
        window.onmousemove = () => {
            // Clear the timeout
            clearTimeout(this.hideMapControlsTimeout);
            this.hideMapControlsTimeout = null;
            this.hideMapControlsEnabled = false;
            this.startListeningToMouseMovement();
            this.props.appActions.hideMapControls(false);
        };
    }
    stopListeningToMouseMovement() {
        clearTimeout(this.hideMapControlsTimeout);
        this.hideMapControlsTimeout = null;
        this.hideMapControlsEnabled = false;
        window.onmousemove = null;
        this.props.appActions.hideMapControls(false);
    }
    hideMapControls() {
        if (!this.hideMapControlsEnabled) {
            this.hideMapControlsEnabled = true;
            this.hideMapControlsTimeout = null;
            this.props.appActions.hideMapControls(true);
        }
    }
    onMapControlsMouseEnter() {
        if (this.props.distractionFreeMode) {
            this.stopListeningToMouseMovement();
        }
    }
    onMapControlsMouseLeave() {
        if (this.props.distractionFreeMode) {
            this.startListeningToMouseMovement();
        }
    }
    setViewMode() {
        if (this.props.in3DMode) {
            this.props.actions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D);
        } else {
            this.props.actions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D);
        }
    }

    handleClearMap() {
        this.props.actions.removeAllDrawings();
        this.props.actions.removeAllMeasurements();
    }

    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            "hidden-fade-out":
                this.props.mapControlsHidden && this.props.distractionFreeMode,
            "hidden-fade-in":
                !this.props.mapControlsHidden && this.props.distractionFreeMode
        });
        let toolsMenuClasses = MiscUtil.generateStringFromSet({
            active: this.props.mapControlsToolsOpen,
            "react-contextmenu": true
        });
        let drawingCircle =
            this.props.drawing.get("isDrawingEnabled") &&
            this.props.drawing.get("geometryType") ===
                appStrings.GEOMETRY_CIRCLE;
        let drawingLineString =
            this.props.drawing.get("isDrawingEnabled") &&
            this.props.drawing.get("geometryType") ===
                appStrings.GEOMETRY_LINE_STRING;
        let drawingPolygon =
            this.props.drawing.get("isDrawingEnabled") &&
            this.props.drawing.get("geometryType") ===
                appStrings.GEOMETRY_POLYGON;
        let measuringDistance =
            this.props.measuring.get("isMeasuringEnabled") &&
            this.props.measuring.get("geometryType") ===
                appStrings.GEOMETRY_LINE_STRING;
        let measuringArea =
            this.props.measuring.get("isMeasuringEnabled") &&
            this.props.measuring.get("geometryType") ===
                appStrings.GEOMETRY_POLYGON;
        return (
            <div
                className={containerClasses}
                onMouseLeave={() => {
                    this.onMapControlsMouseLeave();
                }}
                onMouseEnter={() => {
                    this.onMapControlsMouseEnter();
                }}
            >
                <div id="mapControls">
                    <Button
                        neutral
                        icon="add"
                        className="primary-map-button mini-xs"
                        onClick={this.props.actions.zoomIn}
                        data-tip="Zoom in"
                        data-place="right"
                        aria-label="Zoom in"
                    />
                    <Button
                        neutral
                        icon="remove"
                        className="primary-map-button mini-xs"
                        onClick={this.props.actions.zoomOut}
                        data-tip="Zoom out"
                        data-place="right"
                        aria-label="Zoom out"
                    />
                    <Button
                        neutral
                        icon="home"
                        className={"primary-map-button mini-xs"}
                        onClick={() => {
                            this.props.actions.setMapView(
                                { extent: appConfig.DEFAULT_BBOX_EXTENT },
                                true
                            );
                        }}
                        data-tip="Reset Map View"
                        data-place="right"
                        aria-label="Reset Map View"
                    />
                    <Button
                        neutral
                        primary={this.props.distractionFreeMode ? true : false}
                        className={"primary-map-button mini-xs"}
                        onClick={() => {
                            this.props.appActions.setDistractionFreeMode(
                                !this.props.distractionFreeMode
                            );
                        }}
                        data-tip={
                            this.props.distractionFreeMode ? (
                                "Disable distraction free mode"
                            ) : (
                                "Enable distraction free mode"
                            )
                        }
                        data-place="right"
                        aria-label={
                            this.props.distractionFreeMode ? (
                                "Disable distraction free mode"
                            ) : (
                                "Enable distraction free mode"
                            )
                        }
                    >
                        {this.props.distractionFreeMode ? (
                            <EyeIcon />
                        ) : (
                            <EyeOffIcon />
                        )}
                    </Button>
                    <Button
                        neutral
                        disabled={
                            !Modernizr.webgl && !this.props.in3DMode ? (
                                true
                            ) : (
                                false
                            )
                        }
                        label={this.props.in3DMode ? "2D" : "3D"}
                        className="primary-map-button mini-xs"
                        onClick={() => this.setViewMode()}
                        data-tip={
                            this.props.in3DMode ? (
                                "Switch to 2D map"
                            ) : (
                                "Switch to 3D map"
                            )
                        }
                        data-place="right"
                        aria-label={
                            this.props.in3DMode ? (
                                "Switch to 2D map"
                            ) : (
                                "Switch to 3D map"
                            )
                        }
                    />
                    <Button
                        neutral
                        primary={this.props.mapControlsToolsOpen ? true : false}
                        icon="build"
                        className="primary-map-button mini-xs"
                        onClick={() => {
                            this.props.appActions.setMapControlsToolsOpen(
                                !this.props.mapControlsToolsOpen
                            );
                        }}
                        data-tip="Tools"
                        data-place="right"
                        aria-label="Tools"
                    />
                </div>
                <div id="mapToolsMenu" className={toolsMenuClasses}>
                    <ContextMenuSubMenu
                        tabIndex={this.props.mapControlsToolsOpen ? 0 : -1}
                        title="Measure"
                        icon=""
                        customIcon="ms ms-measure-distance context-menu-icon"
                    >
                        <MenuItem data={{}}>
                            <Button
                                primary={measuringDistance}
                                onClick={() => {
                                    this.props.appActions.setMapControlsToolsOpen(
                                        false
                                    );
                                    this.props.actions.enableMeasuring(
                                        appStrings.GEOMETRY_LINE_STRING,
                                        appStrings.MEASURE_DISTANCE
                                    );
                                }}
                                tabIndex={
                                    this.props.mapControlsToolsOpen ? 0 : -1
                                }
                                aria-label="Measure Distance"
                                className="context-menu-item"
                            >
                                <i className="ms ms-measure-distance context-menu-icon" />
                                <span className="context-menu-label">
                                    Distance
                                </span>
                            </Button>
                        </MenuItem>
                        <MenuItem data={{}}>
                            <Button
                                primary={measuringArea}
                                tabIndex={
                                    this.props.mapControlsToolsOpen ? 0 : -1
                                }
                                aria-label="Measure Area"
                                onClick={() => {
                                    this.props.appActions.setMapControlsToolsOpen(
                                        false
                                    );
                                    this.props.actions.enableMeasuring(
                                        appStrings.GEOMETRY_POLYGON,
                                        appStrings.MEASURE_AREA
                                    );
                                }}
                                className="context-menu-item"
                            >
                                <i className="ms ms-measure-area context-menu-icon" />
                                <span className="context-menu-label">Area</span>
                            </Button>
                        </MenuItem>
                        <hr className="divider medium-light" />
                        <MenuItem data={{}}>
                            <Button
                                label="Clear Measurements"
                                aria-label="Clear Measurements"
                                tabIndex={
                                    this.props.mapControlsToolsOpen ? 0 : -1
                                }
                                icon="delete"
                                onClick={() => {
                                    this.props.appActions.setMapControlsToolsOpen(
                                        false
                                    );
                                    this.props.actions.removeAllMeasurements();
                                }}
                                className="context-menu-item"
                            />
                        </MenuItem>
                    </ContextMenuSubMenu>
                    <ContextMenuSubMenu
                        tabIndex={this.props.mapControlsToolsOpen ? 0 : -1}
                        title="Draw"
                        icon="mode_edit"
                        customIcon=""
                    >
                        <MenuItem data={{}}>
                            <Button
                                primary={drawingCircle}
                                tabIndex={
                                    this.props.mapControlsToolsOpen ? 0 : -1
                                }
                                label="Circle"
                                aria-label="Circle"
                                icon="radio_button_unchecked"
                                onClick={() => {
                                    this.props.appActions.setMapControlsToolsOpen(
                                        false
                                    );
                                    this.props.actions.enableDrawing(
                                        appStrings.GEOMETRY_CIRCLE
                                    );
                                }}
                                className="context-menu-item"
                            />
                        </MenuItem>
                        <MenuItem data={{}}>
                            <Button
                                primary={drawingLineString}
                                aria-label="Polyline"
                                tabIndex={
                                    this.props.mapControlsToolsOpen ? 0 : -1
                                }
                                onClick={() => {
                                    this.props.appActions.setMapControlsToolsOpen(
                                        false
                                    );
                                    this.props.actions.enableDrawing(
                                        appStrings.GEOMETRY_LINE_STRING
                                    );
                                }}
                                className="context-menu-item"
                            >
                                <i className="ms ms-line context-menu-icon" />
                                <span className="context-menu-label">
                                    Polyline
                                </span>
                            </Button>
                        </MenuItem>
                        <MenuItem data={{}}>
                            <Button
                                primary={drawingPolygon}
                                aria-label="Polygon"
                                tabIndex={
                                    this.props.mapControlsToolsOpen ? 0 : -1
                                }
                                onClick={() => {
                                    this.props.appActions.setMapControlsToolsOpen(
                                        false
                                    );
                                    this.props.actions.enableDrawing(
                                        appStrings.GEOMETRY_POLYGON
                                    );
                                }}
                                className="context-menu-item"
                            >
                                <i className="ms ms-polygon context-menu-icon" />
                                <span className="context-menu-label">
                                    Polygon
                                </span>
                            </Button>
                        </MenuItem>
                        <hr className="divider medium-light" />
                        <MenuItem data={{}}>
                            <Button
                                label="Clear Drawings"
                                aria-label="Clear Drawings"
                                tabIndex={
                                    this.props.mapControlsToolsOpen ? 0 : -1
                                }
                                icon="delete"
                                onClick={() => {
                                    this.props.appActions.setMapControlsToolsOpen(
                                        false
                                    );
                                    this.props.actions.removeAllDrawings();
                                }}
                                className="context-menu-item"
                            />
                        </MenuItem>
                    </ContextMenuSubMenu>
                    <hr className="divider medium-light" />
                    <MenuItem className="menu-i" data={{}}>
                        <Button
                            label="Clear Map"
                            icon="delete"
                            aria-label="Clear Map"
                            tabIndex={this.props.mapControlsToolsOpen ? 0 : -1}
                            onClick={() => {
                                this.props.appActions.setMapControlsToolsOpen(
                                    false
                                );
                                this.handleClearMap();
                            }}
                            className="context-menu-item"
                        />
                    </MenuItem>
                </div>
            </div>
        );
    }
}

MapControlsContainer.propTypes = {
    in3DMode: PropTypes.bool.isRequired,
    distractionFreeMode: PropTypes.bool.isRequired,
    mapControlsHidden: PropTypes.bool.isRequired,
    mapControlsToolsOpen: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    drawing: PropTypes.object.isRequired,
    measuring: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        in3DMode: state.map.getIn(["view", "in3DMode"]),
        drawing: state.map.get("drawing"),
        measuring: state.map.get("measuring"),
        distractionFreeMode: state.view.get("distractionFreeMode"),
        mapControlsToolsOpen: state.view.get("mapControlsToolsOpen"),
        mapControlsHidden: state.view.get("mapControlsHidden")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(
    MapControlsContainer
);
