import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-toolbox/lib/button';
import * as actions from '../../actions/MapActions';
import * as mapStrings from '../../constants/mapStrings';
import MiscUtil from '../../utils/MiscUtil';
import KeyHandler, { KEYUP } from 'react-key-handler';

export class MapContainer extends Component {
    componentWillMount() {
        this.listenersInitialized = false;
    }

    initializeMapDrawHandlers() {
        let map = this.props.maps.get(mapStrings.MAP_LIB_2D);
        if (typeof map !== "undefined") {
            map.addDrawHandler(mapStrings.GEOMETRY_CIRCLE, (event) => {
                // Draw end
                // Disable drawing
                this.props.actions.disableDrawing();

                // Recover geometry from event
                let center = event.feature.getGeometry().getCenter();
                let geometry = {
                    type: mapStrings.GEOMETRY_CIRCLE,
                    center: { lon: center[0], lat: center[1] },
                    radius: event.feature.getGeometry().getRadius(),
                    coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
                };

                // Add geometry to other maps
                this.props.actions.addGeometryToMap(geometry);
            });
            map.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING, (event) => {
                // Draw end
                // Disable drawing
                this.props.actions.disableDrawing();
                // Recover geometry from event
                let geometry = {
                    type: mapStrings.GEOMETRY_LINE_STRING,
                    coordinates: event.feature.getGeometry().getCoordinates(),
                    coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
                };

                // console.log(mapStrings.GEOMETRY_LINE_STRING, " = ", geometry);
                // Add geometry to other maps
                this.props.actions.addGeometryToMap(geometry);
            });
            map.addDrawHandler(mapStrings.GEOMETRY_POLYGON, (event) => {
                // Draw end
                // Disable drawing
                this.props.actions.disableDrawing();
                // Recover geometry from event
                let geometry = {
                    type: mapStrings.GEOMETRY_POLYGON,
                    coordinates: event.feature.getGeometry().getCoordinates()[0],
                    coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
                };

                // Add geometry to other maps
                this.props.actions.addGeometryToMap(geometry);
            });
        }
    }

    initializeMapListeners() {
        let map = this.props.maps.get(mapStrings.MAP_LIB_2D);
        if (typeof map !== "undefined") {
            map.addEventListener("moveend", () => {
                // Only fire move event if this map is active
                if (map.isActive) {
                    this.props.actions.setMapViewInfo({
                        center: map.getCenter(),
                        extent: map.getExtent(),
                        projection: map.getProjection(),
                        zoom: map.getZoom()
                    });
                }
            });
            map.addEventListener("mousemove", (pixel) => {
                // Only fire move event if this map is active
                if (map.isActive) {
                    this.props.actions.pixelHover(pixel);
                }
            });
            map.addEventListener("click", (clickEvt) => {
                // Only fire move event if this map is active
                if (map.isActive) {
                    this.props.actions.pixelClick(clickEvt);
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
            "inactive": this.props.in3DMode
        });

        return (
            <div id="mapContainer2D" className={containerClass}>
                <div id="map2D"></div>
                <KeyHandler keyEventName={KEYUP} keyValue="Escape" onKeyHandle={(evt) => 
                    {
                        // Only disable if drawing is enabled
                        if (this.props.isDrawingEnabled) {
                            // Add other dialog checks here?
                            this.props.actions.disableDrawing();
                        }
                    }
                } />
            </div>
        );
    }
}

MapContainer.propTypes = {
    maps: PropTypes.object.isRequired,
    in3DMode: PropTypes.bool.isRequired,
    isDrawingEnabled: PropTypes.bool.isRequired,
    initialLoadComplete: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        maps: state.map.get("maps"),
        in3DMode: state.map.getIn(["view", "in3DMode"]),
        isDrawingEnabled: state.map.getIn(["drawing", "isDrawingEnabled"]),
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
)(MapContainer);
