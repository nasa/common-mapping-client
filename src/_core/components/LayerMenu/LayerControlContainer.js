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
import Immutable from "immutable";
import { ListItem, ListItemSecondaryAction, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import InfoOutlineIcon from "material-ui-icons/InfoOutline";
import Typography from "material-ui/Typography";
import Tooltip from "material-ui/Tooltip";
import Collapse from "material-ui/transitions/Collapse";
import Popover from "material-ui/Popover";
import Grow from "material-ui/transitions/Grow";
import { Manager, Target, Popper } from "react-popper";
import { EnhancedSwitch, IconButtonSmall, ClickAwayListener } from "_core/components/Reusables";
import * as mapActions from "_core/actions/mapActions";
import {
    LayerControlBase,
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

export class LayerControlContainer extends LayerControlBase {
    renderTopContent() {
        return (
            <ListItem dense={true} classes={{ dense: styles.dense }}>
                <Tooltip
                    title={this.props.layer.get("isActive") ? "Hide Layer" : "Show Layer"}
                    placement="top"
                >
                    <EnhancedSwitch
                        checked={this.props.layer.get("isActive")}
                        onChange={(value, checked) => this.setLayerActive(!checked)}
                        onClick={evt => this.setLayerActive(evt.target.checked)}
                    />
                </Tooltip>
                <span className={textStyles.textEllipsis}>
                    <ListItemText primary={this.props.layer.get("title")} />
                </span>
                <ListItemSecondaryAction
                    classes={{
                        root: `${styles.secondaryActionRoot} ${
                            this.props.layer.get("isActive")
                                ? displayStyles.invisible
                                : displayStyles.hiddenFadeIn
                        }`
                    }}
                >
                    <Tooltip title="Layer information" placement="left">
                        <IconButtonSmall onClick={() => this.openLayerInfo()}>
                            <InfoOutlineIcon />
                        </IconButtonSmall>
                    </Tooltip>
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
            <span className={styles.layerControlIconRow}>
                <Manager style={{ display: "inline-block" }}>
                    <ClickAwayListener
                        onClickAway={() => {
                            if (this.isChangingPosition) {
                                this.toggleChangingPosition();
                            }
                        }}
                    >
                        <Target style={{ display: "inline-block" }}>
                            <Tooltip title={"Set Layer Position"} placement="top">
                                <LayerPositionIcon
                                    displayIndex={this.props.layer.get("displayIndex")}
                                    activeNum={this.props.activeNum}
                                    className={styles.iconButtonSmall}
                                    color={this.isChangingPosition ? "primary" : "default"}
                                    onClick={() => this.toggleChangingPosition()}
                                />
                            </Tooltip>
                        </Target>
                        <Popper
                            placement="left-end"
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
                        onClickAway={() => {
                            if (this.isChangingOpacity) {
                                this.toggleChangingOpacity();
                            }
                        }}
                    >
                        <Target style={{ display: "inline-block" }}>
                            <Tooltip title={"Set Layer Opacity"} placement="top">
                                <LayerOpacityIcon
                                    opacity={this.props.layer.get("opacity")}
                                    className={styles.iconButtonSmall}
                                    color={this.isChangingOpacity ? "primary" : "default"}
                                    onClick={() => this.toggleChangingOpacity()}
                                />
                            </Tooltip>
                        </Target>
                        <Popper
                            placement="left-end"
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
                <Tooltip title="Layer information" placement="top">
                    <IconButtonSmall
                        className={styles.iconButtonSmall}
                        onClick={() => this.openLayerInfo()}
                    >
                        <InfoOutlineIcon />
                    </IconButtonSmall>
                </Tooltip>
            </span>
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

LayerControlContainer.propTypes = MiscUtil.mergeObjects(LayerControlBase.propTypes, {
    className: PropTypes.string
});

export default connect(null, LayerControlBase.mapDispatchToProps)(LayerControlContainer);
