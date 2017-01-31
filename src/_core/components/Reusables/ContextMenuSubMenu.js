// largely a copy/paste replacement of https://github.com/vkbansal/react-contextmenu/blob/master/src/submenu/index.js

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import { MenuItem } from "react-contextmenu";
import { Button } from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';
import MiscUtil from '_core/utils/MiscUtil';

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

const miscUtil = new MiscUtil();

export class ContextMenuSubMenu extends Component {
    constructor(props) {
        super(props);

        this.visible = false;
        this.position = {...INITIAL_POSITION };
    }
   
    componentWillUnmount() {
        if (this.opentimer) clearTimeout(this.opentimer);

        if (this.closetimer) clearTimeout(this.closetimer);
    }
    getMenuPosition() {
        let { innerWidth, innerHeight } = window;
        let menuRect = ReactDOM.findDOMNode(this.refs.menu).getBoundingClientRect();
        let submenuRect = ReactDOM.findDOMNode(this.refs.submenu).getBoundingClientRect();
        let position = {...INITIAL_POSITION };
        if ((menuRect.top + submenuRect.height + EDGE_PADDING) > innerHeight) {
            position.bottom = true;
        } else {
            position.top = true;
        }

        if ((menuRect.right + submenuRect.width + EDGE_PADDING) > innerWidth) {
            position.left = true;
        } else {
            position.right = true;
        }

        return position;
    }
    handleClick(e) {
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
        let { disabled, children, title, icon, customIcon, tabIndex } = this.props;

        let menuClasses = "context-menu-item submenu";
        let subMenuClasses = miscUtil.generateStringFromSet({
            "context-menu-sub-menu": true,
            "active": this.visible,
            "top": this.position.top,
            "bottom": this.position.bottom,
            "left": this.position.left,
            "right": this.position.right
        });
        let labelClasses = miscUtil.generateStringFromSet({
            "context-menu-item context-menu-sub-menu-label": true,
            "disabled": disabled,
            "active": this.visible
        });

        return (
            <div
                ref="menu"
                className={menuClasses}
                style={MENU_STYLES}
                onMouseEnter={() => this.handleMouseEnter()}
                onMouseLeave={() => this.handleMouseLeave()} >
                <Button
                    tabIndex={tabIndex}
                    primary={this.visible}
                    aria-label={title}
                    className={labelClasses}
                    onClick={(e) => this.handleClick(e)}
                    label={icon ? title : ""}
                    icon={icon || ""} >
                    <i className={customIcon} />
                    <span className="context-menu-label">{customIcon ? title : "" }</span>
                    <FontIcon value="keyboard_arrow_right" className="button-icon-right" />
                </Button>
                <div className={subMenuClasses} ref="submenu">
                    {children}
                </div>
            </div>
        );
    }
}

ContextMenuSubMenu.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    customIcon: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    showDelay: PropTypes.number,
    tabIndex: PropTypes.number,
    hideDelay: PropTypes.number,
    children: PropTypes.array
};

export default connect()(ContextMenuSubMenu);
