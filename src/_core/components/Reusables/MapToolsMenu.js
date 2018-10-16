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
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import DeleteIcon from "@material-ui/icons/Delete";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import EditIcon from "@material-ui/icons/Edit";
import MiscUtil from "_core/utils/MiscUtil";
import * as appStrings from "_core/constants/appStrings";
import * as mapActions from "_core/actions/mapActions";
import * as appActions from "_core/actions/appActions";
import { ContextMenuSubMenu } from "_core/components/Reusables";
import { DrawLineIcon } from "_core/components/Reusables/CustomIcons";
import styles from "_core/components/Reusables/MapToolsMenu.scss";

export class MapToolsMenu extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.mapToolsMenu]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <Paper className={containerClasses}>
                <MenuList dense>
                    <ContextMenuSubMenu
                        title="Measure"
                        icon={
                            <Icon>
                                <i className="ms ms-measure-area" />
                            </Icon>
                        }
                    >
                        <MenuItem
                            className={styles.contextMenuItem}
                            onClick={() => {
                                this.props.handleRequestClose();
                                this.props.mapActions.enableMeasuring(
                                    appStrings.GEOMETRY_LINE_STRING,
                                    appStrings.MEASURE_DISTANCE
                                );
                            }}
                            aria-label="Measure Distance"
                        >
                            <ListItemIcon classes={{ root: styles.listItemIcon }}>
                                <Icon>
                                    <i className="ms ms-measure-distance" />
                                </Icon>
                            </ListItemIcon>
                            <ListItemText inset primary="Distance" />
                        </MenuItem>
                        <MenuItem
                            className={styles.contextMenuItem}
                            aria-label="Measure Area"
                            onClick={() => {
                                this.props.handleRequestClose();
                                this.props.mapActions.enableMeasuring(
                                    appStrings.GEOMETRY_POLYGON,
                                    appStrings.MEASURE_AREA
                                );
                            }}
                        >
                            <ListItemIcon classes={{ root: styles.listItemIcon }}>
                                <Icon>
                                    <i className="ms ms-measure-area" />
                                </Icon>
                            </ListItemIcon>
                            <ListItemText inset primary="Area" />
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            className={styles.contextMenuItem}
                            label="Clear Measurements"
                            aria-label="Clear Measurements"
                            onClick={() => {
                                this.props.handleRequestClose();
                                this.props.mapActions.removeAllMeasurements();
                            }}
                        >
                            <ListItemIcon classes={{ root: styles.listItemIcon }}>
                                <DeleteIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Clear Measurements" />
                        </MenuItem>
                    </ContextMenuSubMenu>
                    <ContextMenuSubMenu title="Draw" icon={<EditIcon />}>
                        <MenuItem
                            className={styles.contextMenuItem}
                            dense
                            aria-label="Circle"
                            icon="radio_button_unchecked"
                            onClick={() => {
                                this.props.handleRequestClose();
                                this.props.mapActions.enableDrawing(appStrings.GEOMETRY_CIRCLE);
                            }}
                        >
                            <ListItemIcon classes={{ root: styles.listItemIcon }}>
                                <RadioButtonUncheckedIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Circle" />
                        </MenuItem>
                        <MenuItem
                            className={styles.contextMenuItem}
                            dense
                            aria-label="Line"
                            onClick={() => {
                                this.props.handleRequestClose();
                                this.props.mapActions.enableDrawing(appStrings.GEOMETRY_LINE);
                            }}
                        >
                            <ListItemIcon classes={{ root: styles.listItemIcon }}>
                                <DrawLineIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Line" />
                        </MenuItem>
                        <MenuItem
                            className={styles.contextMenuItem}
                            dense
                            aria-label="Polyline"
                            onClick={() => {
                                this.props.handleRequestClose();
                                this.props.mapActions.enableDrawing(
                                    appStrings.GEOMETRY_LINE_STRING
                                );
                            }}
                        >
                            <ListItemIcon classes={{ root: styles.listItemIcon }}>
                                <Icon>
                                    <i className="ms ms-line" />
                                </Icon>
                            </ListItemIcon>
                            <ListItemText inset primary="Polyline" />
                        </MenuItem>
                        <MenuItem
                            className={styles.contextMenuItem}
                            dense
                            aria-label="Polygon"
                            onClick={() => {
                                this.props.handleRequestClose();
                                this.props.mapActions.enableDrawing(appStrings.GEOMETRY_POLYGON);
                            }}
                        >
                            <ListItemIcon classes={{ root: styles.listItemIcon }}>
                                <Icon>
                                    <i className="ms ms-polygon" />
                                </Icon>
                            </ListItemIcon>
                            <ListItemText inset primary="Polygon" />
                        </MenuItem>
                        <MenuItem
                            className={styles.contextMenuItem}
                            dense
                            aria-label="Point"
                            onClick={() => {
                                this.props.handleRequestClose();
                                this.props.mapActions.enableDrawing(appStrings.GEOMETRY_POINT);
                            }}
                        >
                            <ListItemIcon classes={{ root: styles.listItemIcon }}>
                                <Icon>
                                    <i className="ms ms-points" />
                                </Icon>
                            </ListItemIcon>
                            <ListItemText inset primary="Point" />
                        </MenuItem>
                        <MenuItem
                            className={styles.contextMenuItem}
                            dense
                            aria-label="Box"
                            onClick={() => {
                                this.props.handleRequestClose();
                                this.props.mapActions.enableDrawing(appStrings.GEOMETRY_BOX);
                            }}
                        >
                            <ListItemIcon classes={{ root: styles.listItemIcon }}>
                                <Icon>
                                    <i className="ms ms-vector" />
                                </Icon>
                            </ListItemIcon>
                            <ListItemText inset primary="Box" />
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            className={styles.contextMenuItem}
                            dense
                            aria-label="Clear Drawings"
                            onClick={() => {
                                this.props.handleRequestClose();
                                this.props.mapActions.removeAllDrawings();
                            }}
                        >
                            <ListItemIcon classes={{ root: styles.listItemIcon }}>
                                <DeleteIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Clear Drawings" />
                        </MenuItem>
                    </ContextMenuSubMenu>
                    <Divider />
                    <MenuItem
                        className={styles.contextMenuItem}
                        dense
                        aria-label="Clear Map"
                        onClick={() => {
                            this.props.handleRequestClose();
                            this.props.mapActions.removeAllDrawings();
                            this.props.mapActions.removeAllMeasurements();
                        }}
                    >
                        <ListItemIcon classes={{ root: styles.listItemIcon }}>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Clear Map" />
                    </MenuItem>
                </MenuList>
            </Paper>
        );
    }
}

MapToolsMenu.propTypes = {
    handleRequestClose: PropTypes.func.isRequired,
    appActions: PropTypes.object.isRequired,
    mapActions: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(MapToolsMenu);
