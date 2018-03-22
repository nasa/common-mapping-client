import React, { Component } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import EventListener from "react-event-listener";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Reusables/ClickAwayListener.scss";

const isDescendant = (el, target) => {
    if (target !== null && target.parentNode) {
        return el === target || isDescendant(el, target.parentNode);
    }
    return false;
};

/**
 * Listen for click events that are triggered outside of the component children.
 */
export class ClickAwayListener extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
    }
    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleClickAway = event => {
        // Ignore events that have been `event.preventDefault()` marked.
        if (event.defaultPrevented) {
            return;
        }

        // IE11 support, which trigger the handleClickAway even after the unbind
        if (this.mounted) {
            const el = findDOMNode(this);

            if (
                (event.target instanceof HTMLElement || event.target instanceof SVGElement) &&
                document.documentElement &&
                document.documentElement.contains(event.target) &&
                !isDescendant(el, event.target)
            ) {
                this.props.onClickAway(event);
            }
        }
    };

    render() {
        if (this.props.wrap) {
            let wrapperClasses = MiscUtil.generateStringFromSet({
                [styles.wrap]: true,
                [this.props.className]: typeof this.props.className !== "undefined"
            });
            return (
                <EventListener
                    target="document"
                    onMouseup={this.handleClickAway}
                    onTouchend={this.handleClickAway}
                >
                    <div className={wrapperClasses}>{this.props.children}</div>
                </EventListener>
            );
        } else {
            return (
                <EventListener
                    target="document"
                    onMouseup={this.handleClickAway}
                    onTouchend={this.handleClickAway}
                >
                    {this.props.children}
                </EventListener>
            );
        }
    }
}

ClickAwayListener.propTypes = {
    children: PropTypes.node.isRequired,
    onClickAway: PropTypes.func.isRequired,
    className: PropTypes.string,
    wrap: PropTypes.bool
};

export default ClickAwayListener;
