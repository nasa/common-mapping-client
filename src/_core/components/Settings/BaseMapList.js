/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import ListItemText from "@material-ui/core/ListItemText";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Settings/BaseMapList.scss";
require("_core/styles/resources/img/no_tile.png");

const BaseMapList = props => {
    let containerClasses = MiscUtil.generateStringFromSet({
        [props.className]: typeof props.className !== "undefined"
    });
    return (
        <Paper className={containerClasses}>
            <MenuList dense>
                {props.items.map(x => (
                    <MenuItem
                        onClick={() => props.onClick(x.value)}
                        value={x.value}
                        key={x.value}
                        selected={props.value === x.value}
                        className={styles.menuItemRoot}
                    >
                        <img
                            src={x.thumbnailImage ? x.thumbnailImage : "img/no_tile.png"}
                            className={styles.preview}
                            alt="basemap preview image"
                        />
                        <ListItemText inset style={{ padding: "0px" }} primary={x.label} />
                    </MenuItem>
                ))}
            </MenuList>
        </Paper>
    );
};

BaseMapList.propTypes = {
    value: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string
};

export default BaseMapList;
