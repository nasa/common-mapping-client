// largely a copy/paste replacement of https://github.com/vkbansal/react-contextmenu/blob/master/src/submenu/index.js

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import { MenuItem } from "react-contextmenu";
import { Button } from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';
import MiscUtil from '../../utils/MiscUtil';

const menuStyles = {
    position: "relative",
    zIndex: "auto"
};
const initialState = {
    visible: false
};
const initialPosition = {
    top: false,
    bottom: false,
    left: false,
    right: false
};
const showDelay = 500;
const hideDelay = 250;

export class ContextMenuSubMenu extends Component {
    componentWillMount() {
        this.setState({...initialState });
        this.position = {...initialPosition };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.isVisible !== nextState.visible;
    }
    componentWillUpdate() {
        this.position = this.getMenuPosition();
    }
    componentWillUnmount() {
        if (this.opentimer) clearTimeout(this.opentimer);

        if (this.closetimer) clearTimeout(this.closetimer);
    }
    getMenuPosition() {
        let { innerWidth, innerHeight } = window;
        let rect = ReactDOM.findDOMNode(this.refs.menu).getBoundingClientRect();
        let position = {...initialPosition };

        if ((rect.bottom + rect.height) > innerHeight) {
            position.bottom = true;
        } else {
            position.top = true;
        }

        if ((rect.right + rect.width) > innerWidth) {
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

        this.setState({ visible: true });
    }
    handleMouseEnter() {
        if (this.closetimer) clearTimeout(this.closetimer);

        if (this.props.disabled || this.state.visible) return;

        let delay = typeof this.props.showDelay !== "undefined" ? this.props.showDelay : showDelay;
        this.opentimer = setTimeout(() => this.setState({ visible: true }), delay);
    }
    handleMouseLeave() {
        if (this.opentimer) clearTimeout(this.opentimer);

        if (!this.state.visible) return;

        let delay = typeof this.props.hideDelay !== "undefined" ? this.props.hideDelay : hideDelay;
        this.closetimer = setTimeout(() => this.setState({ visible: false }), delay);
    }

    render() {
        let { disabled, children, title, icon, customIcon } = this.props, { visible } = this.state;

        let menuClasses = "context-menu-item submenu";
        let subMenuClasses = MiscUtil.generateStringFromSet({
            "context-menu-sub-menu": true,
            "active": visible,
            "top": this.position.top,
            "bottom": this.position.bottom,
            "left": this.position.left,
            "right": this.position.right
        });
        let labelClasses = MiscUtil.generateStringFromSet({
            "context-menu-item context-menu-sub-menu-label": true,
            "disabled": disabled,
            "active": visible
        });

        return (
            <div
                ref="menu"
                className={menuClasses}
                style={menuStyles}
                onMouseEnter={() => this.handleMouseEnter()}
                onMouseLeave={() => this.handleMouseLeave()} >
                <Button
                    primary={visible}
                    className={labelClasses}
                    onClick={(e) => this.handleClick(e)}
                    label={icon ? title : ""}
                    icon={icon || ""} >
                    <i className={customIcon} />
                    <span className="context-menu-label">{customIcon ? title : "" }</span>
                    <FontIcon value="keyboard_arrow_right" className="button-icon-right" />
                </Button>
                <div className={subMenuClasses}>
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
    hideDelay: PropTypes.number,
    children: PropTypes.array
};

export default connect()(ContextMenuSubMenu);
