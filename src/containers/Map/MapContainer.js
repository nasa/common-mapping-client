import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-toolbox/lib/button';
import * as actions from '../../actions/MapActions';
import * as mapStrings from '../../constants/mapStrings';
import MiscUtil from '../../utils/MiscUtil';
import KeyHandler, { KEYUP } from 'react-key-handler';

export class MapContainer extends Component {

    componentDidMount() {
        //initialize the map. I know this is hacky, but there simply doesn't seem to be a good way to
        // wait for the DOM to complete rendering.
        // see: http://stackoverflow.com/a/34999925
        window.requestAnimationFrame(() => {
            setTimeout(() => {
                this.props.actions.initializeMap(mapStrings.MAP_LIB_2D, "map2D");
                this.initializeMapListeners();
                this.initializeMapDrawHandlers();
            }, 0);
        });
    }

    initializeMapDrawHandlers() {
        let map = this.props.mapState.maps.get(mapStrings.MAP_LIB_2D);
        if (typeof map !== "undefined") {
            map.addDrawHandler(mapStrings.SHAPE_CIRCLE, (event) => {
                // Draw end
                // Disable drawing
                this.props.actions.disableDrawing();

                // Recover geometry from event
                let geometry = {
                    type: mapStrings.SHAPE_CIRCLE,
                    center: event.feature.getGeometry().getCenter(),
                    radius: event.feature.getGeometry().getRadius()
                }

                // console.log(mapStrings.SHAPE_CIRCLE, " = ", geometry);
                // Add geometry to other maps
                this.props.actions.addGeometryToMap(geometry)
            })
            map.addDrawHandler(mapStrings.SHAPE_LINE_STRING, (event) => {
                // Draw end
                // Disable drawing
                this.props.actions.disableDrawing();

                // Recover geometry from event
                let geometry = {
                    type: mapStrings.SHAPE_LINE_STRING
                    // center: event.feature.getGeometry().getCenter(),
                    // radius: event.feature.getGeometry().getRadius()
                }

                // console.log(mapStrings.SHAPE_LINE_STRING, " = ", geometry);
                // Add geometry to other maps
                this.props.actions.addGeometryToMap(geometry)
            })
        }
    }

    initializeMapListeners() {
        let map = this.props.mapState.maps.get(mapStrings.MAP_LIB_2D);
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
        } else {
            console.error("MAP NOT AVAILABLE");
        }
    }

    render() {
        return (
            <div id="mapContainer2D" className={this.props.mapState.in3DMode ? "hidden" : ""}>
                <div id="map2D"></div>
                <KeyHandler keyEventName={KEYUP} keyValue="Escape" onKeyHandle={(evt) => 
                    {
                        // Only disable if drawing is enabled
                        if (this.props.mapState.isDrawingEnabled) {
                            // Add other dialog checks here?
                            this.props.actions.disableDrawing()
                        }
                    }
                } />
            </div>
        );
    }
}

MapContainer.propTypes = {
    mapState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        mapState: {
            maps: state.map.get("maps"),
            in3DMode: state.map.getIn(["view", "in3DMode"]),
            isDrawingEnabled: state.map.getIn(["drawing", "isDrawingEnabled"])
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
)(MapContainer);
