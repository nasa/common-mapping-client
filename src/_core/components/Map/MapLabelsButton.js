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
import Button from "@material-ui/core/Button";
import MapMarkerIcon from "mdi-material-ui/MapMarker";
import { MapButton, EnhancedTooltip } from "_core/components/Reusables";
import * as appStrings from "_core/constants/appStrings";
import * as mapActions from "_core/actions/mapActions";
import MiscUtil from "_core/utils/MiscUtil";
import appConfig from "constants/appConfig";

export class MapLabelsButton extends Component {
    toggleMapLabels() {
        let labelsLayer = this.props.referenceLayers.get(appConfig.REFERENCE_LABELS_LAYER_ID);
        let boundariesLayer = this.props.referenceLayers.get(
            appConfig.POLITICAL_BOUNDARIES_LAYER_ID
        );
        let eitherOn = labelsLayer.get("isActive") || boundariesLayer.get("isActive");

        this.props.mapActions.setLayerActive(appConfig.REFERENCE_LABELS_LAYER_ID, !eitherOn);
        this.props.mapActions.setLayerActive(appConfig.POLITICAL_BOUNDARIES_LAYER_ID, !eitherOn);
    }
    render() {
        let mapLabelsActive = false;

        // We may not have reference layers upon first render of this component
        if (this.props.referenceLayers) {
            // check the reference and boundary layers
            let labelsLayer = this.props.referenceLayers.get(appConfig.REFERENCE_LABELS_LAYER_ID);
            let boundariesLayer = this.props.referenceLayers.get(
                appConfig.POLITICAL_BOUNDARIES_LAYER_ID
            );

            if (labelsLayer && boundariesLayer) {
                mapLabelsActive = labelsLayer.get("isActive") || boundariesLayer.get("isActive");
            }
        }

        let btnClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <EnhancedTooltip
                title={mapLabelsActive ? "Hide Map Labels" : "Show Map Labels"}
                placement="right"
            >
                <MapButton
                    color={mapLabelsActive ? "primary" : "default"}
                    onClick={() => this.toggleMapLabels()}
                    aria-label="Map Layers"
                    className={btnClasses}
                >
                    <MapMarkerIcon />
                </MapButton>
            </EnhancedTooltip>
        );
    }
}

MapLabelsButton.propTypes = {
    referenceLayers: PropTypes.object.isRequired,
    mapActions: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        referenceLayers: state.map.getIn(["layers", appStrings.LAYER_GROUP_TYPE_REFERENCE])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapLabelsButton);
