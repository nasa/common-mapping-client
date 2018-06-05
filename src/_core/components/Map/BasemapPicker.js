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
import { Manager, Target, Popper } from "react-popper";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import * as mapActions from "_core/actions/mapActions";
import * as appActions from "_core/actions/appActions";
import * as appStrings from "_core/constants/appStrings";
import { BaseMapList } from "_core/components/Settings";
import { ClickAwayListener, EnhancedTooltip } from "_core/components/Reusables";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Map/BasemapPicker.scss";
import displayStyles from "_core/styles/display.scss";

export class BasemapPicker extends Component {
    setBasemap(layerId) {
        if (layerId && layerId !== "") {
            this.props.mapActions.setBasemap(layerId);
        } else {
            this.props.mapActions.hideBasemap();
        }
    }
    render() {
        // sort and gather the basemaps into a set of dropdown options
        let activeBasemapId = "";
        let activeBasemapThumbnail = "img/no_tile.png";
        let basemapList = this.props.basemaps.sort(MiscUtil.getImmutableObjectSort("title"));
        let basemapOptions = basemapList.reduce((acc, layer) => {
            if (layer.get("isActive")) {
                activeBasemapId = layer.get("id");
                activeBasemapThumbnail = layer.get("thumbnailImage");
            }

            acc.push({
                value: layer.get("id"),
                label: layer.get("title"),
                thumbnailImage: layer.get("thumbnailImage")
            });
            return acc;
        }, []);
        basemapOptions.push({
            value: "",
            label: "None",
            thumbnailImage: ""
        });

        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.basemapPicker]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        let popperClasses = MiscUtil.generateStringFromSet({
            [displayStyles.noPointer]: !this.props.mapControlsBasemapPickerOpen
        });
        return (
            <ClickAwayListener
                onClickAway={() => {
                    if (this.props.mapControlsBasemapPickerOpen) {
                        this.props.appActions.setMapControlsBasemapPickerOpen(false);
                    }
                }}
            >
                <div className={containerClasses}>
                    <Manager>
                        <Target>
                            <EnhancedTooltip title={"Select Basemap"} placement="left">
                                <Paper elevation={2}>
                                    <ButtonBase
                                        onClick={() =>
                                            this.props.appActions.setMapControlsBasemapPickerOpen(
                                                !this.props.mapControlsBasemapPickerOpen
                                            )
                                        }
                                        focusRipple
                                        style={{ width: "100%" }}
                                        className={styles.buttonBase}
                                    >
                                        <div>
                                            <div
                                                className={styles.image}
                                                style={{
                                                    backgroundImage: `url(${activeBasemapThumbnail})`
                                                }}
                                                alt="basemap preview image"
                                            />
                                            <Typography
                                                variant="caption"
                                                className={styles.caption}
                                            >
                                                Basemap
                                            </Typography>
                                        </div>
                                    </ButtonBase>
                                </Paper>
                            </EnhancedTooltip>
                        </Target>
                        <Popper
                            placement="left-end"
                            style={{ marginRight: "5px", zIndex: "3001" }}
                            modifiers={{
                                computeStyle: {
                                    gpuAcceleration: false
                                }
                            }}
                            eventsEnabled={this.props.mapControlsBasemapPickerOpen}
                            className={popperClasses}
                        >
                            <Grow
                                style={{ transformOrigin: "right bottom" }}
                                in={this.props.mapControlsBasemapPickerOpen}
                            >
                                <div>
                                    <BaseMapList
                                        value={activeBasemapId}
                                        items={basemapOptions}
                                        onClick={value => this.setBasemap(value)}
                                    />
                                </div>
                            </Grow>
                        </Popper>
                    </Manager>
                </div>
            </ClickAwayListener>
        );
    }
}

BasemapPicker.propTypes = {
    basemaps: PropTypes.object.isRequired,
    mapActions: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
    mapControlsBasemapPickerOpen: PropTypes.bool.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        basemaps: state.map.getIn(["layers", appStrings.LAYER_GROUP_TYPE_BASEMAP]),
        mapControlsBasemapPickerOpen: state.view.get("mapControlsBasemapPickerOpen")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BasemapPicker);
