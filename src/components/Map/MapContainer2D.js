/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from "_core/actions/mapActions";
import * as mapActionsIfr from "actions/mapActions";
import * as appStringsCore from "_core/constants/appStrings";
import * as appStrings from "constants/appStrings";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Map/MapContainer.scss";
import displayStyles from "_core/styles/display.scss";
import { MapContainer2D as MapContainer2DCore } from "_core/components/Map/MapContainer2D";

export class MapContainer2D extends MapContainer2DCore {
    constructor(props) {
        super(props);
    }

    initializeMapListeners() {
        super.initializeMapListeners();
        let map = this.props.maps.get(appStringsCore.MAP_LIB_2D);
        if (typeof map !== "undefined") {
            map.addEventListener(appStrings.EVENT_MOUSE_DRAG, pixel =>
                this.handlePixelDrag(map, pixel)
            );
        } else {
            console.error("Cannot initialize event listeners: 2D MAP NOT AVAILABLE");
        }
    }

    handlePixelDrag(map, pixel) {
        // Only fire move event if this map is active
        if (map.isActive) {
            this.props.mapActionsIfr.pixelDrag(pixel);
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
            // Manage to update URL when MapMoveEnd
            this.props.mapActionsIfr.mapMoveEnd();
        }
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
    mapActionsIfr: PropTypes.object.isRequired,
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
        mapActions: bindActionCreators(mapActions, dispatch),
        mapActionsIfr: bindActionCreators(mapActionsIfr, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapContainer2D);
