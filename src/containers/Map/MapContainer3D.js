import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/MapActions';
import * as mapStrings from '../../constants/mapStrings';
import MiscUtil from '../../utils/MiscUtil';

export class MapContainer3D extends Component {

    componentDidMount() {
        //initialize the map. I know this is hacky, but there simply doesn't seem to be a good way to
        // wait for the DOM to complete rendering.
        // see: http://stackoverflow.com/a/34999925
        window.requestAnimationFrame(() => {
            setTimeout(() => {
                this.props.actions.initializeMap(mapStrings.MAP_LIB_3D, "map3D");
                this.initializeMapListeners();
                this.initializeMapDrawHandlers();
            }, 0);
        });
    }

    initializeMapDrawHandlers() {
        let map = this.props.mapState.maps.get(mapStrings.MAP_LIB_3D);
        if (typeof map !== "undefined") {
            map.addDrawHandler(mapStrings.GEOMETRY_CIRCLE, (center, radius) => {
                console.log("DRAW END", center, radius);
                // Draw end
                // Disable drawing
                this.props.actions.disableDrawing();

                let cartesianCenter = map.cartesianToCartographic(center);
                // Recover geometry from event in cartographic
                let geometry = {
                    type: mapStrings.GEOMETRY_CIRCLE,
                    center: cartesianCenter,
                    radius: radius,
                    coordinateType: mapStrings.COORDINATE_TYPE_CARTESIAN
                }

                // Add geometry to other maps
                this.props.actions.addGeometryToMap(geometry)
            })
        }
    }

    initializeMapListeners() {
        let map = this.props.mapState.maps.get(mapStrings.MAP_LIB_3D);
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
        } else {
            console.error("MAP NOT AVAILABLE");
        }
    }

    render() {
        return (
            <div id="mapContainer3D" className={this.props.mapState.in3DMode ? "" : "hidden"}>
                <div id="map3D"></div>
            </div>
        );
    }
}

MapContainer3D.propTypes = {
    mapState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        mapState: {
            maps: state.map.get("maps"),
            in3DMode: state.map.getIn(["view", "in3DMode"])
        }
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
