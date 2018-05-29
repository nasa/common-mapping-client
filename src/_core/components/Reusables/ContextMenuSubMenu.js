/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// largely a copy/paste replacement of https://github.com/vkbansal/react-contextmenu/blob/master/src/submenu/index.js

import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import ReactDOM from "react-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import PlusIcon from "@material-ui/icons/Add";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Reusables/ContextMenuSubMenu.scss";

const MENU_STYLES = {
    position: "relative",
    zIndex: "auto"
};
const initialState = {
    visible: false
};
const INITIAL_POSITION = {
    top: false,
    bottom: false,
    left: false,
    right: false
};
const SHOW_DELAY = 500;
const HIDE_DELAY = 250;
const EDGE_PADDING = 50;

export class ContextMenuSubMenu extends Component {
    constructor(props) {
        super(props);

        this.visible = false;
        this.position = { ...INITIAL_POSITION };
    }

    componentWillUnmount() {
        if (this.opentimer) clearTimeout(this.opentimer);

        if (this.closetimer) clearTimeout(this.closetimer);
    }
    getMenuPosition() {
        let { innerWidth, innerHeight } = window;
        let menuRect = ReactDOM.findDOMNode(this.refs.menu).getBoundingClientRect();
        let submenuRect = ReactDOM.findDOMNode(this.refs.submenu).getBoundingClientRect();
        let position = { ...INITIAL_POSITION };
        if (menuRect.top + submenuRect.height + EDGE_PADDING > innerHeight) {
            position.bottom = true;
        } else {
            position.top = true;
        }

        if (menuRect.right + submenuRect.width + EDGE_PADDING > innerWidth) {
            position.left = true;
        } else {
            position.right = true;
        }

        return position;
    }
    handleClick(e) {
        e.currentTarget.blur();
        e.preventDefault();
        if (this.closetimer) clearTimeout(this.closetimer);
        if (this.opentimer) clearTimeout(this.opentimer);

        this.open();
    }
    handleMouseEnter() {
        if (this.closetimer) clearTimeout(this.closetimer);

        if (this.props.disabled || this.visible) return;

        let delay = typeof this.props.showDelay !== "undefined" ? this.props.showDelay : SHOW_DELAY;
        this.opentimer = setTimeout(() => this.open(), delay);
    }
    handleMouseLeave() {
        if (this.opentimer) clearTimeout(this.opentimer);

        if (!this.visible) return;

        let delay = typeof this.props.hideDelay !== "undefined" ? this.props.hideDelay : HIDE_DELAY;
        this.closetimer = setTimeout(() => this.close(), delay);
    }
    open() {
        this.visible = true;
        this.position = this.getMenuPosition();
        this.forceUpdate();
    }
    close() {
        this.visible = false;
        this.forceUpdate();
    }

    render() {
        let { disabled, children, title, icon, tabIndex } = this.props;

        // let menuClasses = "context-menu-item submenu";
        let subMenuClasses = MiscUtil.generateStringFromSet({
            [styles.subMenu]: true,
            [styles.active]: this.visible,
            [styles.top]: this.position.top,
            [styles.bottom]: this.position.bottom,
            [styles.left]: this.position.left,
            [styles.right]: this.position.right
        });

        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <div
                ref="menu"
                className={containerClasses}
                style={MENU_STYLES}
                onMouseEnter={() => this.handleMouseEnter()}
                onMouseLeave={() => this.handleMouseLeave()}
            >
                <MenuItem
                    dense
                    tabIndex={tabIndex}
                    aria-label={title}
                    onClick={e => this.handleClick(e)}
                >
                    <ListItemIcon classes={{ root: styles.itemIcon }}>
                        {this.props.icon}
                    </ListItemIcon>
                    <ListItemText inset primary={title} />
                    <ListItemIcon classes={{ root: styles.itemIcon }}>
                        <KeyboardArrowRightIcon />
                    </ListItemIcon>
                </MenuItem>
                <Paper className={subMenuClasses} ref="submenu">
                    <MenuList dense>{children}</MenuList>
                </Paper>
            </div>
        );
    }
}

ContextMenuSubMenu.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    showDelay: PropTypes.number,
    tabIndex: PropTypes.number,
    hideDelay: PropTypes.number,
    children: PropTypes.array,
    className: PropTypes.string
};

export default ContextMenuSubMenu;
