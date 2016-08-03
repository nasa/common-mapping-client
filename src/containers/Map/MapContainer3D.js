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
            map.addDrawHandler(mapStrings.GEOMETRY_CIRCLE, (center, radius) => {
                // Draw end
                // Disable drawing
                this.props.actions.disableDrawing();

                let cartographicCenter = map.cartesianToCartographic(center);
                // Recover geometry from event in cartographic
                let geometry = {
                    type: mapStrings.GEOMETRY_CIRCLE,
                    center: cartographicCenter,
                    radius: radius,
                    coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
                };

                // Add geometry to other maps
                this.props.actions.addGeometryToMap(geometry);
            });
            map.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING, (coordinates) => {
                // Draw end
                // Disable drawing
                this.props.actions.disableDrawing();

                let cartesianCoordinates = coordinates.map((pos) => {
                    return map.cartesianToCartographic(pos);
                });

                // Recover geometry from event in cartographic
                let geometry = {
                    type: mapStrings.GEOMETRY_LINE_STRING,
                    coordinates: cartesianCoordinates,
                    coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
                };

                // Add geometry to other maps
                this.props.actions.addGeometryToMap(geometry);
            });
            map.addDrawHandler(mapStrings.GEOMETRY_POLYGON, (coordinates) => {
                // Draw end
                // Disable drawing
                this.props.actions.disableDrawing();
                let cartesianCoordinates = coordinates.map((pos) => {
                    return map.cartesianToCartographic(pos);
                });

                // Recover geometry from event in cartographic
                let geometry = {
                    type: mapStrings.GEOMETRY_POLYGON,
                    coordinates: cartesianCoordinates,
                    coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
                };

                // Add geometry to other maps
                this.props.actions.addGeometryToMap(geometry);
            });
        }
    }

    initializeMapListeners() {
        let map = this.props.maps.get(mapStrings.MAP_LIB_3D);
        if (typeof map !== "undefined") {
            map.addEventListener("moveend", () => {
                // Only fire move event if this map is active
                if (map.isActive) {
                    this.props.actions.setMapViewInfo({
                        center: map.getCenter(),
                        extent: map.getExtent()
                    });
                }
            });
            map.addEventListener("mousemove", (pixel) => {
                if (map.isActive) {
                    this.props.actions.pixelHover(pixel);
                }
            });
            map.addEventListener("click", (pixel) => {
                if (map.isActive) {
                    this.props.actions.pixelClick(pixel);
                }
            });
        } else {
            console.error("MAP NOT AVAILABLE");
        }
    }

    render() {
        // need to get some sort of stored state value
        if (this.props.initialLoadComplete && !this.listenersInitialized) {
            this.initializeMapListeners();
            this.initializeMapDrawHandlers();
            this.listenersInitialized = true;
        }

        let containerClass = MiscUtil.generateStringFromSet({
            "inactive": !this.props.in3DMode
        });
        return (
            <div id="mapContainer3D" className={containerClass}>
                <div id="map3D"></div>
            </div>
        );
    }
}

MapContainer3D.propTypes = {
    maps: PropTypes.object.isRequired,
    in3DMode: PropTypes.bool.isRequired,
    initialLoadComplete: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        maps: state.map.get("maps"),
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
