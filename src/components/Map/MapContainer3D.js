import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/MapActions';
import * as mapStrings from '../../constants/mapStrings';
import MiscUtil from '../../utils/MiscUtil';

export class MapContainer3D extends Component {

    componentWillMount() {
        this.listenersInitialized = false;
    }

    initializeMapDrawHandlers() {
        let map = this.props.maps.get(mapStrings.MAP_LIB_3D);
        if (typeof map !== "undefined") {
            map.addDrawHandler(mapStrings.GEOMETRY_CIRCLE, (geometry) => this.handleDrawEnd(geometry), mapStrings.INTERACTION_DRAW);
            map.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING, (geometry) => this.handleDrawEnd(geometry), mapStrings.INTERACTION_DRAW);
            map.addDrawHandler(mapStrings.GEOMETRY_POLYGON, (geometry) => this.handleDrawEnd(geometry), mapStrings.INTERACTION_DRAW);
        } else {
            console.error("Cannot initialize 3D draw listeners: MAP NOT AVAILABLE");
        }
    }

    initializeMapMeasurementHandlers() {
        let map = this.props.maps.get(mapStrings.MAP_LIB_3D);
        if (typeof map !== "undefined") {
            map.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING, (geometry) => this.handleMeasureEnd(geometry, mapStrings.MEASURE_DISTANCE), mapStrings.INTERACTION_MEASURE);
            map.addDrawHandler(mapStrings.GEOMETRY_POLYGON, (geometry) => this.handleMeasureEnd(geometry, mapStrings.MEASURE_AREA), mapStrings.INTERACTION_MEASURE);
        } else {
            console.error("Cannot initialize 3D measurement listeners: MAP NOT AVAILABLE");
        }
    }

    initializeMapListeners() {
        let map = this.props.maps.get(mapStrings.MAP_LIB_3D);
        if (typeof map !== "undefined") {
            map.addEventListener(mapStrings.EVENT_MOVE_END, () => {
                // Only fire move event if this map is active
                if (map.isActive) {
                    this.props.actions.setMapViewInfo({
                        center: map.getCenter(),
                        extent: map.getExtent()
                    });
                }
            });
            map.addEventListener(mapStrings.EVENT_MOUSE_HOVER, (pixel) => {
                if (map.isActive) {
                    this.props.actions.pixelHover(pixel);
                }
            });
            map.addEventListener(mapStrings.EVENT_MOUSE_CLICK, (pixel) => {
                if (map.isActive) {
                    this.props.actions.pixelClick(pixel);
                }
            });
        } else {
            console.error("MAP NOT AVAILABLE");
        }
    }

    handleDrawEnd(geometry) {
        // Disable drawing
        this.props.actions.disableDrawing();
        // Add geometry to other maps
        // this.props.actions.addGeometryToMap(geometry, mapStrings.INTERACTION_DRAW);
    }

    handleMeasureEnd(geometry, measurementType) {
        // Disable drawing
        this.props.actions.disableMeasuring();
        // Add geometry to other maps
        this.props.actions.addGeometryToMap(geometry, mapStrings.INTERACTION_MEASURE, true);
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

        let containerClass = MiscUtil.generateStringFromSet({
            "inactive": !this.props.in3DMode
        });
        return (
            <div id="mapContainer3D" className={containerClass}>
                <div id="map3D" />
            </div>
        );
    }
}

MapContainer3D.propTypes = {
    maps: PropTypes.object.isRequired,
    units: PropTypes.string.isRequired,
    in3DMode: PropTypes.bool.isRequired,
    initialLoadComplete: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        maps: state.map.get("maps"),
        units: state.map.getIn(["displaySettings", "selectedScaleUnits"]),
        in3DMode: state.map.getIn(["view", "in3DMode"]),
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
)(MapContainer3D);
