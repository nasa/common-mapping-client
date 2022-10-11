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
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import Grow from "@material-ui/core/Grow";
import Popover from "@material-ui/core/Popover";
import InfoOutlineIcon from "mdi-material-ui/InformationOutline";
import { Manager, Target, Popper } from "react-popper";
import {
    EnhancedSwitch,
    IconButtonSmall,
    ClickAwayListener,
    EnhancedTooltip
} from "_core/components/Reusables";
import * as mapActions from "_core/actions/mapActions";
import {
    LayerPositionIcon,
    LayerPositionControl,
    LayerOpacityIcon,
    LayerOpacityControl
} from "_core/components/LayerMenu";
import { Colorbar } from "_core/components/Colorbar";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/LayerMenu/LayerControlContainer.scss";
import textStyles from "_core/styles/text.scss";
import displayStyles from "_core/styles/display.scss";

export class LayerControlContainer extends Component {
    constructor(props) {
        super(props);

        this.isChangingOpacity = false;
        this.isChangingPosition = false;
        this.opacityButton = null;
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

    renderTopContent() {
        let secondaryActionClasses = MiscUtil.generateStringFromSet({
            [displayStyles.invisible]: this.props.layer.get("isActive"),
            [displayStyles.hiddenFadeIn]: !this.props.layer.get("isActive")
        });
        return (
            <ListItem dense={true} classes={{ dense: styles.dense }}>
                <EnhancedTooltip
                    title={this.props.layer.get("isActive") ? "Hide Layer" : "Show Layer"}
                    placement="top"
                >
                    <EnhancedSwitch
                        checked={this.props.layer.get("isActive")}
                        onChange={(value, checked) => this.setLayerActive(!checked)}
                        onClick={evt => this.setLayerActive(evt.target.checked)}
                    />
                </EnhancedTooltip>
                <span className={textStyles.textEllipsis}>
                    <ListItemText primary={this.props.layer.get("title")} />
                </span>
                <ListItemSecondaryAction className={secondaryActionClasses}>
                    <EnhancedTooltip title="Layer information" placement="left">
                        <IconButtonSmall onClick={() => this.openLayerInfo()}>
                            <InfoOutlineIcon />
                        </IconButtonSmall>
                    </EnhancedTooltip>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }

    renderBottomContent() {
        return (
            <div>
                <Collapse
                    in={this.props.layer.get("isActive")}
                    timeout="auto"
                    className={styles.layerControl}
                    classes={{ entered: styles.collapseEntered }}
                >
                    <div className={styles.layerControlContent}>
                        <Colorbar
                            palette={this.props.palette}
                            min={parseFloat(this.props.layer.get("min"))}
                            max={parseFloat(this.props.layer.get("max"))}
                            units={this.props.layer.get("units")}
                            displayMin={this.props.layer.getIn(["palette", "min"])}
                            displayMax={this.props.layer.getIn(["palette", "max"])}
                            handleAs={this.props.layer.getIn(["palette", "handleAs"])}
                            url={this.props.layer.getIn(["palette", "url"])}
                            className={styles.colorbar}
                        />
                        {this.renderIconRow()}
                    </div>
                </Collapse>
                <Divider />
            </div>
        );
    }

    renderIconRow() {
        let positionPopoverClasses = MiscUtil.generateStringFromSet({
            [styles.popover]: true,
            [styles.positionPopover]: true,
            [displayStyles.noPointer]: !this.isChangingPosition
        });

        let opacityPopoverClasses = MiscUtil.generateStringFromSet({
            [styles.popover]: true,
            [displayStyles.noPointer]: !this.isChangingOpacity
        });

        return (
            <div className={styles.layerControlIconRow}>
                <Manager style={{ display: "inline-block" }}>
                    <ClickAwayListener
                        wrap={true}
                        onClickAway={() => {
                            if (this.isChangingPosition) {
                                this.toggleChangingPosition();
                            }
                        }}
                    >
                        <Target>
                            <EnhancedTooltip title={"Set Layer Position"} placement="top">
                                <LayerPositionIcon
                                    displayIndex={this.props.layer.get("displayIndex")}
                                    activeNum={this.props.activeNum}
                                    className={styles.iconButtonSmall}
                                    color={this.isChangingPosition ? "primary" : "default"}
                                    onClick={() => this.toggleChangingPosition()}
                                />
                            </EnhancedTooltip>
                        </Target>
                        <Popper
                            placement="left"
                            modifiers={{
                                computeStyle: {
                                    gpuAcceleration: false
                                }
                            }}
                            eventsEnabled={this.isChangingPosition}
                            className={positionPopoverClasses}
                        >
                            <Grow style={{ transformOrigin: "right" }} in={this.isChangingPosition}>
                                <div>
                                    <LayerPositionControl
                                        isActive={this.isChangingPosition}
                                        moveToTop={() => this.moveToTop()}
                                        moveToBottom={() => this.moveToBottom()}
                                        moveUp={() => this.moveUp()}
                                        moveDown={() => this.moveDown()}
                                    />
                                </div>
                            </Grow>
                        </Popper>
                    </ClickAwayListener>
                    <ClickAwayListener
                        wrap={true}
                        onClickAway={() => {
                            if (this.isChangingOpacity) {
                                this.toggleChangingOpacity();
                            }
                        }}
                    >
                        <Target>
                            <EnhancedTooltip title={"Set Layer Opacity"} placement="top">
                                <LayerOpacityIcon
                                    opacity={this.props.layer.get("opacity")}
                                    className={styles.iconButtonSmall}
                                    color={this.isChangingOpacity ? "primary" : "default"}
                                    onClick={() => this.toggleChangingOpacity()}
                                />
                            </EnhancedTooltip>
                        </Target>
                        <Popper
                            placement="left"
                            modifiers={{
                                computeStyle: {
                                    gpuAcceleration: false
                                }
                            }}
                            className={opacityPopoverClasses}
                            eventsEnabled={this.isChangingOpacity}
                        >
                            <Grow style={{ transformOrigin: "right" }} in={this.isChangingOpacity}>
                                <div>
                                    <LayerOpacityControl
                                        isActive={this.isChangingOpacity}
                                        opacity={this.props.layer.get("opacity")}
                                        onChange={value => this.changeOpacity(value)}
                                    />
                                </div>
                            </Grow>
                        </Popper>
                    </ClickAwayListener>
                </Manager>
                <EnhancedTooltip title="Layer information" placement="top">
                    <IconButtonSmall
                        className={styles.iconButtonSmall}
                        onClick={() => this.openLayerInfo()}
                    >
                        <InfoOutlineIcon />
                    </IconButtonSmall>
                </EnhancedTooltip>
            </div>
        );
    }

    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div className={containerClasses}>
                {this.renderTopContent()}
                {this.renderBottomContent()}
            </div>
        );
    }
}

LayerControlContainer.propTypes = {
    mapActions: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    activeNum: PropTypes.number.isRequired,
    palette: PropTypes.object,
    className: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(LayerControlContainer);
