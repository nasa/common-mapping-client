import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-toolbox/lib/button';
import * as actions from '_core/actions/MapActions';
import * as appStrings from '_core/constants/appStrings';
import MiscUtil from '_core/utils/MiscUtil';

const miscUtil = new MiscUtil();

export class MapContainer2D extends Component {
    componentWillMount() {
        // We need this instance variable because the map will take an unknown number of
        // render cycles as the map is initialized in appContainer
        this.listenersInitialized = false;
    }

    initializeMapDrawHandlers() {
        let map = this.props.maps.get(appStrings.MAP_LIB_2D);
        if (typeof map !== "undefined") {
            map.addDrawHandler(appStrings.GEOMETRY_CIRCLE, (geometry) => this.handleDrawEnd(geometry), appStrings.INTERACTION_DRAW);
            map.addDrawHandler(appStrings.GEOMETRY_LINE_STRING, (geometry) => this.handleDrawEnd(geometry), appStrings.INTERACTION_DRAW);
            map.addDrawHandler(appStrings.GEOMETRY_POLYGON, (geometry) => this.handleDrawEnd(geometry), appStrings.INTERACTION_DRAW);
        } else {
            console.error("Cannot initialize draw listeners: MAP NOT AVAILABLE");
        }
    }

    initializeMapMeasurementHandlers() {
        let map = this.props.maps.get(appStrings.MAP_LIB_2D);
        if (typeof map !== "undefined") {
            map.addDrawHandler(appStrings.GEOMETRY_LINE_STRING, (geometry) => this.handleMeasureEnd(geometry, appStrings.MEASURE_DISTANCE), appStrings.INTERACTION_MEASURE);
            map.addDrawHandler(appStrings.GEOMETRY_POLYGON, (geometry) => this.handleMeasureEnd(geometry, appStrings.MEASURE_AREA), appStrings.INTERACTION_MEASURE);
        } else {
            console.error("Cannot initialize draw listeners: MAP NOT AVAILABLE");
        }
    }

    initializeMapListeners() {
        let map = this.props.maps.get(appStrings.MAP_LIB_2D);
        if (typeof map !== "undefined") {
            map.addEventListener(appStrings.EVENT_MOVE_END, () => {
                // Only fire move event if this map is active
                if (map.isActive) {
                    this.props.actions.setMapViewInfo({
                        extent: map.getExtent(),
                        projection: map.getProjection()
                    });
                }
            });
            map.addEventListener(appStrings.EVENT_MOUSE_HOVER, (pixel) => {
                // Only fire move event if this map is active
                if (map.isActive) {
                    this.props.actions.pixelHover(pixel);
                }
            });
            map.addEventListener(appStrings.EVENT_MOUSE_CLICK, (clickEvt) => {
                // Only fire move event if this map is active
                if (map.isActive) {
                    this.props.actions.pixelClick(clickEvt);
                }
            });
        } else {
            console.error("Cannot initialize event listeners: MAP NOT AVAILABLE");
        }
    }

    handleDrawEnd(geometry) {
        // Disable drawing
        this.props.actions.disableDrawing();
        // Add geometry to other maps
        // this.props.actions.addGeometryToMap(geometry, appStrings.INTERACTION_DRAW);
    }

    handleMeasureEnd(geometry, measurementType) {
        // Disable measurement
        this.props.actions.disableMeasuring();
        // Add geometry to other maps
        this.props.actions.addGeometryToMap(geometry, appStrings.INTERACTION_MEASURE, false);
        // Add label to geometry
        this.props.actions.addMeasurementLabelToGeometry(geometry, measurementType, this.props.units);
    }

    render() {
        // need to get some sort of stored state value
        if (this.props.initialLoadComplete && !this.listenersInitialized) {
            this.initializeMapListeners();
            this.initializeMapDrawHandlers();
            this.initializeMapMeasurementHandlers();
            this.listenersInitialized = true;
        }

        let containerClass = miscUtil.generateStringFromSet({
            "inactive": this.props.in3DMode
        });

        return (
            <div id="mapContainer2D" className={containerClass}>
                <div id="map2D" />
            </div>
        );
    }
}

MapContainer2D.propTypes = {
    maps: PropTypes.object.isRequired,
    units: PropTypes.string.isRequired,
    in3DMode: PropTypes.bool.isRequired,
    isDrawingEnabled: PropTypes.bool.isRequired,
    isMeasuringEnabled: PropTypes.bool.isRequired,
    initialLoadComplete: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        maps: state.map.get("maps"),
        units: state.map.getIn(["displaySettings", "selectedScaleUnits"]),
        in3DMode: state.map.getIn(["view", "in3DMode"]),
        isDrawingEnabled: state.map.getIn(["drawing", "isDrawingEnabled"]),
        isMeasuringEnabled: state.map.getIn(["measuring", "isMeasuringEnabled"]),
        initialLoadComplete: state.view.get("initialLoadComplete")
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
)(MapContainer2D);
