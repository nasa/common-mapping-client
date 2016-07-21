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
        let map = this.props.mapState.maps.get(mapStrings.MAP_LIB_3D);
        if (typeof map !== "undefined") {
            // map.addDrawHandler(mapStrings.GEOMETRY_CIRCLE, (event) => {
                // Draw end
                // Disable drawing
                // this.props.actions.disableDrawing();

                // // Recover geometry from event
                // let geometry = {
                //     type: mapStrings.GEOMETRY_CIRCLE,
                //     center: event.feature.getGeometry().getCenter(),
                //     radius: event.feature.getGeometry().getRadius()
                // }

                // console.log(mapStrings.GEOMETRY_CIRCLE, " = ", geometry);
                // Add geometry to other maps
                // this.props.actions.addGeometryToMap(geometry)
            // })
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
        // need to get some sort of stored state value
        if(this.props.viewState.initialLoadComplete && !this.listenersInitialized) {
            this.initializeMapListeners();
            // this.initializeMapDrawHandlers();
            this.listenersInitialized = true;
        }
        return (
            <div id="mapContainer3D" className={this.props.mapState.in3DMode ? "" : "hidden"}>
                <div id="map3D"></div>
            </div>
        );
    }
}

MapContainer3D.propTypes = {
    mapState: PropTypes.object.isRequired,
    viewState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        mapState: {
            maps: state.map.get("maps"),
            in3DMode: state.map.getIn(["view", "in3DMode"])
        },
        viewState: {
            initialLoadComplete: state.view.get("initialLoadComplete")
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
