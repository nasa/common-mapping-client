/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ContextMenuTrigger } from "react-contextmenu";
import { bindActionCreators } from "redux";
import * as appStrings from "_core/constants/appStrings";
import * as mapActions from "_core/actions/mapActions";
import MapContainer2D from "_core/components/Map/MapContainer2D";
import MapContainer3D from "_core/components/Map/MapContainer3D";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Map/MapContainer.scss";

export class MapContainer extends Component {
    componentDidMount() {
        this.refs.container.addEventListener("mouseout", evt => {
            this.props.mapActions.invalidatePixelHover();
        });
    }

    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.mapContainer]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div ref="container" className={containerClasses}>
                <ContextMenuTrigger id={appStrings.MAP_CONTEXT_MENU_ID} holdToDisplay={-1}>
                    <MapContainer2D />
                    <MapContainer3D />
                </ContextMenuTrigger>
            </div>
        );
    }
}

MapContainer.propTypes = {
    mapActions: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(MapContainer);
