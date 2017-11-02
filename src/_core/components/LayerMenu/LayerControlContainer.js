import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Button, IconButton } from "react-toolbox/lib/button";
import Switch from "react-toolbox/lib/switch";
import Slider from "react-toolbox/lib/slider";
import * as layerActions from "_core/actions/LayerActions";
import Colorbar from "_core/components/LayerMenu/Colorbar";
import MiscUtil from "_core/utils/MiscUtil";
import {
    OpacityIcon0,
    OpacityIcon25,
    OpacityIcon50,
    OpacityIcon75,
    OpacityIcon100,
    LayerIconTop,
    LayerIconMiddle,
    LayerIconBottom
} from "_core/components/Reusables/CustomIcons";

export class LayerControlContainer extends Component {
    constructor(props) {
        super(props);

        this.isChangingOpacity = false;
        this.isChangingPosition = false;
    }

    shouldComponentUpdate(nextProps) {
        // Here we prevent unnecessary renderings by explicitly
        // ignoring certain pieces of the layer state. We do this
        // since LayerControlContainer is passed an entire layer object
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
        this.props.actions.setLayerActive(this.props.layer.get("id"), active);
    }

    changeOpacity(value) {
        let opacity = value / 100.0;
        this.props.actions.setLayerOpacity(this.props.layer, opacity);
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
        this.props.actions.loadLayerMetadata(this.props.layer);
    }

    changePalette() {
        this.props.actions.changeLayerPalette(this.props.layer.get("id"), {});
    }

    moveToTop() {
        this.props.actions.moveLayerToTop(this.props.layer.get("id"));
    }

    moveToBottom() {
        this.props.actions.moveLayerToBottom(this.props.layer.get("id"));
    }

    moveUp() {
        this.props.actions.moveLayerUp(this.props.layer.get("id"));
    }

    moveDown() {
        this.props.actions.moveLayerDown(this.props.layer.get("id"));
    }

    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            "layer-control pos-rel": true,
            active: this.props.layer.get("isActive")
        });
        let switchClasses = MiscUtil.generateStringFromSet({
            "layer-toggle": true,
            active: this.props.layer.get("isActive")
        });
        let sliderContainerClasses = MiscUtil.generateStringFromSet({
            "opacity-slider-container row middle-xs": true,
            active: this.isChangingOpacity
        });
        let positionContainerClasses = MiscUtil.generateStringFromSet({
            "position-controls-container": true,
            active: this.isChangingPosition
        });
        let colorbarRangeClasses = MiscUtil.generateStringFromSet({
            "row middle-xs colorbar-range-wrapper": true,
            active: this.props.layer.getIn(["palette", "handleAs"]) !== ""
        });
        let currOpacity = Math.floor(this.props.layer.get("opacity") * 100);
        let layerOrderClassName = MiscUtil.generateStringFromSet({
            "layer-order-label": true,
            active: this.isChangingPosition
        });
        let opacityIcon =
            currOpacity === 0 ? (
                <OpacityIcon0 />
            ) : currOpacity < 50 ? (
                <OpacityIcon25 />
            ) : currOpacity < 75 ? (
                <OpacityIcon50 />
            ) : currOpacity < 100 ? (
                <OpacityIcon75 />
            ) : (
                <OpacityIcon100 />
            );

        let layerOrderIcon =
            this.props.layer.get("displayIndex") === 1 ? (
                <LayerIconTop />
            ) : this.props.layer.get("displayIndex") === this.props.activeNum ? (
                <LayerIconBottom />
            ) : (
                <LayerIconMiddle />
            );

        return (
            <div className={containerClasses}>
                <div className="row middle-xs">
                    <div className="col-xs-2 text-left toggle">
                        <div
                            data-tip={
                                this.props.layer.get("isActive") ? "Hide Layer" : "Show Layer"
                            }
                            data-place="left"
                        >
                            <Switch
                                className={switchClasses}
                                checked={this.props.layer.get("isActive")}
                                onChange={active => this.setLayerActive(active)}
                                theme={{
                                    on: "switch-thumb-on",
                                    off: "switch-thumb-off",
                                    thumb: "switch-thumb"
                                }}
                            />
                        </div>
                    </div>
                    <span
                        className="layer-header text-ellipsis col-xs-9"
                        data-tip={this.props.layer.get("title")}
                        data-place="left"
                    >
                        {this.props.layer.get("title")}
                    </span>
                    <span className="col-xs-1 inactive-info-btn">
                        <IconButton
                            icon="info_outline"
                            className="no-padding mini-xs-waysmall"
                            data-tip="Layer information"
                            data-place="left"
                            onClick={() => this.openLayerInfo()}
                        />
                    </span>
                </div>
                <div className="lower-content">
                    <div className="row middle-xs">
                        <div className="col-xs-9 text-left no-padding">
                            <Colorbar
                                palette={this.props.palette}
                                min={parseFloat(this.props.layer.get("min"))}
                                max={parseFloat(this.props.layer.get("max"))}
                                displayMin={parseFloat(this.props.layer.getIn(["palette", "min"]))}
                                displayMax={parseFloat(this.props.layer.getIn(["palette", "max"]))}
                                handleAs={this.props.layer.getIn(["palette", "handleAs"])}
                                url={this.props.layer.getIn(["palette", "url"])}
                            />
                        </div>
                        <div className="col-xs-3 text-right no-padding">
                            <IconButton
                                primary={this.isChangingPosition}
                                disabled={!this.props.layer.get("isActive")}
                                className="no-padding mini-xs-waysmall"
                                data-tip={
                                    !this.isChangingPosition ? "Adjust layer positioning" : null
                                }
                                data-place="left"
                                tabIndex={this.props.layer.get("isActive") ? 0 : -1}
                                onClick={() => this.toggleChangingPosition()}
                            >
                                {/*<i className="button-icon ms ms-fw ms-layers-overlay" />*/}
                                {layerOrderIcon}
                                <span className={layerOrderClassName}>
                                    {this.props.layer.get("displayIndex")}
                                </span>
                            </IconButton>
                            <div className={positionContainerClasses}>
                                <div className="popover-label">Layer Positioning</div>
                                <div className="position-control-content row middle-xs">
                                    <Button
                                        primary
                                        label="Top"
                                        className="position-control-button col-xs-6"
                                        onClick={() => this.moveToTop()}
                                    />
                                    <Button
                                        primary
                                        label="Up"
                                        className="position-control-button col-xs-6"
                                        onClick={() => this.moveUp()}
                                    />
                                    <Button
                                        primary
                                        label="Bottom"
                                        className="position-control-button col-xs-6"
                                        onClick={() => this.moveToBottom()}
                                    />
                                    <Button
                                        primary
                                        label="Down"
                                        className="position-control-button col-xs-6"
                                        onClick={() => this.moveDown()}
                                    />
                                </div>
                            </div>
                            <IconButton
                                primary={this.isChangingOpacity}
                                disabled={!this.props.layer.get("isActive")}
                                className="no-padding mini-xs-waysmall"
                                data-tip={!this.isChangingOpacity ? "Adjust layer opacity" : null}
                                data-place="left"
                                tabIndex={this.props.layer.get("isActive") ? 0 : -1}
                                onClick={() => this.toggleChangingOpacity()}
                            >
                                {opacityIcon}
                            </IconButton>
                            <div className={sliderContainerClasses}>
                                <div className="popover-label">Layer Opacity</div>
                                <div className="opacity-slider-content row middle-xs">
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={10}
                                        value={this.props.layer.get("opacity") * 100}
                                        className="react-toolbox-slider-overrides col-xs-9 no-padding"
                                        onChange={value => this.changeOpacity(value)}
                                    />
                                    <span className="opacity-label col-xs-3 no-padding">
                                        {currOpacity}%
                                    </span>
                                </div>
                            </div>
                            <IconButton
                                icon="info_outline"
                                className="no-padding mini-xs-waysmall"
                                data-tip="Layer information"
                                data-place="left"
                                tabIndex={this.props.layer.get("isActive") ? 0 : -1}
                                onClick={() => this.openLayerInfo()}
                            />
                        </div>
                    </div>
                    <div className={colorbarRangeClasses}>
                        <div className="col-xs-12 no-padding">
                            <div className="colorbar-label-container pos-rel">
                                <span className="colorbar-label min">
                                    {this.props.layer.get("min")}
                                </span>
                                <span className="colorbar-label mid">
                                    {this.props.layer.get("units")}
                                </span>
                                <span className="colorbar-label max">
                                    {this.props.layer.get("max")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LayerControlContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    activeNum: PropTypes.number.isRequired,
    palette: PropTypes.object
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(layerActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(LayerControlContainer);
