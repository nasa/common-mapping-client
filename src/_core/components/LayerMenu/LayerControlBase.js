/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as mapActions from "_core/actions/mapActions";
import displayStyles from "_core/styles/display.scss";

export class LayerControlBase extends Component {
    constructor(props) {
        super(props);

        this.isChangingOpacity = false;
        this.isChangingPosition = false;
        this.opacityButton = null;
    }

    shouldComponentUpdate(nextProps) {
        // Here we prevent unnecessary renderings by explicitly
        // ignoring certain pieces of the layer state. We do this
        // since LayerControlBase is passed an entire layer object
        // when instantiated in LayerMenuContainer, which contains state
        // we want to ignore. By ignoring certain things, we can reduce
        // the number of unnecessary renderings.
        let nextLayer = nextProps.layer;
        let currLayer = this.props.layer;
        return (
            nextProps.palette !== this.props.palette ||
            nextLayer.get("title") !== currLayer.get("title") ||
            nextLayer.get("opacity") !== currLayer.get("opacity") ||
            nextLayer.get("isActive") !== currLayer.get("isActive") ||
            nextLayer.get("palette") !== currLayer.get("palette") ||
            nextLayer.get("min") !== currLayer.get("min") ||
            nextLayer.get("max") !== currLayer.get("max") ||
            nextLayer.get("units") !== currLayer.get("units") ||
            nextLayer.get("displayIndex") !== currLayer.get("displayIndex")
        );
    }

    setLayerActive(active) {
        this.isChangingPosition = false;
        this.isChangingOpacity = false;
        this.props.mapActions.setLayerActive(this.props.layer.get("id"), !active);
    }

    changeOpacity(value) {
        let opacity = value / 100.0;
        this.props.mapActions.setLayerOpacity(this.props.layer, opacity);
    }

    toggleChangingOpacity() {
        this.isChangingOpacity = !this.isChangingOpacity;
        this.isChangingPosition = false;
        this.forceUpdate();
    }

    toggleChangingPosition() {
        this.isChangingPosition = !this.isChangingPosition;
        this.isChangingOpacity = false;
        this.forceUpdate();
    }

    openLayerInfo() {
        this.props.mapActions.loadLayerMetadata(this.props.layer);
    }

    changePalette() {
        this.props.mapActions.changeLayerPalette(this.props.layer.get("id"), {});
    }

    moveToTop() {
        this.props.mapActions.moveLayerToTop(this.props.layer.get("id"));
    }

    moveToBottom() {
        this.props.mapActions.moveLayerToBottom(this.props.layer.get("id"));
    }

    moveUp() {
        this.props.mapActions.moveLayerUp(this.props.layer.get("id"));
    }

    moveDown() {
        this.props.mapActions.moveLayerDown(this.props.layer.get("id"));
    }

    render() {
        return <div className={displayStyles.hidden} />;
    }
}

LayerControlBase.propTypes = {
    mapActions: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    activeNum: PropTypes.number.isRequired,
    palette: PropTypes.object
};

LayerControlBase.mapDispatchToProps = function(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch)
    };
};

export default LayerControlBase;
