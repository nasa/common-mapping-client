/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from "_core/actions/mapActions";
import * as appStrings from "_core/constants/appStrings";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Map/MapContainer.scss";
import displayStyles from "_core/styles/display.scss";

export class MapContainer2D extends Component {
    constructor(props) {
        super(props);

        // We need this instance variable because the map will take an unknown number of
        // render cycles as the map is initialized in appContainer
        this.listenersInitialized = false;
    }

    initializeMapListeners() {
        let map = this.props.maps.get(appStrings.MAP_LIB_2D);
        if (typeof map !== "undefined") {
            // mouse event listeners
            map.addEventListener(appStrings.EVENT_MOVE_END, () => this.handleMapMoveEnd(map));
            map.addEventListener(appStrings.EVENT_MOUSE_HOVER, pixel =>
                this.handlePixelHover(map, pixel)
            );
            map.addEventListener(appStrings.EVENT_MOUSE_CLICK, clickEvt =>
                this.handlePixelClick(map, clickEvt)
            );

            // draw handlers
            map.addDrawHandler(
                appStrings.GEOMETRY_CIRCLE,
                geometry => this.handleDrawEnd(geometry),
                appStrings.INTERACTION_DRAW
            );
            map.addDrawHandler(
                appStrings.GEOMETRY_LINE_STRING,
                geometry => this.handleDrawEnd(geometry),
                appStrings.INTERACTION_DRAW
            );
            map.addDrawHandler(
                appStrings.GEOMETRY_POLYGON,
                geometry => this.handleDrawEnd(geometry),
                appStrings.INTERACTION_DRAW
            );
            map.addDrawHandler(
                appStrings.GEOMETRY_POINT,
                geometry => this.handleDrawEnd(geometry),
                appStrings.INTERACTION_DRAW
            );
            map.addDrawHandler(
                appStrings.GEOMETRY_LINE,
                geometry => this.handleDrawEnd(geometry),
                appStrings.INTERACTION_DRAW
            );
            map.addDrawHandler(
                appStrings.GEOMETRY_BOX,
                geometry => this.handleDrawEnd(geometry),
                appStrings.INTERACTION_DRAW
            );

            // measurement listeners
            map.addDrawHandler(
                appStrings.GEOMETRY_LINE_STRING,
                geometry => this.handleMeasureEnd(geometry, appStrings.MEASURE_DISTANCE),
                appStrings.INTERACTION_MEASURE
            );
            map.addDrawHandler(
                appStrings.GEOMETRY_POLYGON,
                geometry => this.handleMeasureEnd(geometry, appStrings.MEASURE_AREA),
                appStrings.INTERACTION_MEASURE
            );
        } else {
            console.error("Cannot initialize event listeners: 2D MAP NOT AVAILABLE");
        }
    }

    handleMapMoveEnd(map) {
        // Only fire move event if this map is active
        // and target inactive map
        if (map.isActive) {
            this.props.mapActions.setMapView(
                {
                    extent: map.getExtent(),
                    projection: map.getProjection()
                },
                false
            );
        }
    }

    handlePixelHover(map, pixel) {
        // Only fire move event if this map is active
        if (map.isActive) {
            this.props.mapActions.pixelHover(pixel);
        }
    }

    handlePixelClick(map, clickEvt) {
        // Only fire move event if this map is active
        if (map.isActive) {
            this.props.mapActions.pixelClick(clickEvt);
        }
    }

    handleDrawEnd(geometry) {
        // Disable drawing
        this.props.mapActions.disableDrawing();
    }

    handleMeasureEnd(geometry, measurementType) {
        // Disable measurement
        this.props.mapActions.disableMeasuring();
        // Add geometry to other maps
        this.props.mapActions.addGeometryToMap(geometry, appStrings.INTERACTION_MEASURE, false);
        // Add label to geometry
        this.props.mapActions.addMeasurementLabelToGeometry(
            geometry,
            measurementType,
            this.props.units
        );
    }

    render() {
        // need to get some sort of stored state value
        if (this.props.initialLoadComplete && !this.listenersInitialized) {
            this.initializeMapListeners();
            this.listenersInitialized = true;
        }

        let containerClass = MiscUtil.generateStringFromSet({
            [styles.mapRenderWrapper]: true,
            [displayStyles.hidden]: this.props.in3DMode,
            [displayStyles.animationFadeIn]: !this.props.in3DMode,
            [displayStyles.animationFadeOut]: this.props.in3DMode,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <div className={containerClass}>
                <div id="map2D" className={styles.mapRender} />
            </div>
        );
    }
}

MapContainer2D.propTypes = {
    maps: PropTypes.object.isRequired,
    units: PropTypes.string.isRequired,
    in3DMode: PropTypes.bool.isRequired,
    initialLoadComplete: PropTypes.bool.isRequired,
    mapActions: PropTypes.object.isRequired,
    className: PropTypes.string
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
        mapActions: bindActionCreators(mapActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapContainer2D);
