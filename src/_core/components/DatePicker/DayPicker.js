/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Input from "material-ui/Input";
import MiscUtil from "_core/utils/MiscUtil";
import appConfig from "constants/appConfig";
import styles from "_core/components/DatePicker/DatePicker.scss";

const MAX_LENGTH = 2;

export class DayPicker extends Component {
    componentDidMount() {
        this.day = this.props.day;
        this.error = false;
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.day !== this.props.day || nextProps.day !== this.day;
    }
    handleKeyPress(evt) {
        let dayStr = this.day;
        dayStr = MiscUtil.padNumber(dayStr, 2);
        if (evt.charCode === 13) {
            // enter key
            this.submitDay(dayStr);
        }
    }
    handleBlur(evt) {
        let dayStr = this.day;
        dayStr = MiscUtil.padNumber(dayStr, 2);
        this.submitDay(dayStr);
    }
    handleChange(dayStr) {
        if (dayStr.length <= MAX_LENGTH) {
            this.day = dayStr;
        }
        this.error = false;
        this.updateFromInternal = true;
        this.forceUpdate();
    }
    submitDay(dayStr) {
        this.props.onUpdate(dayStr);

        // if the update failed because date was invalid
        // force a re-render the go back to previous valid state
        if (this.day !== this.props.day) {
            this.error = true;
            this.forceUpdate();
        }
    }
    render() {
        let dayStr = this.updateFromInternal ? this.day : this.props.day;
        this.day = dayStr;
        this.updateFromInternal = false;
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.datePickerSelector]: true,
            [styles.datePickerSelectorError]: this.error,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div className={containerClasses}>
                <Input
                    type="text"
                    tabIndex="0"
                    value={dayStr}
                    inputProps={{
                        onBlur: evt => {
                            this.handleBlur(evt.target.value);
                        },
                        onKeyPress: evt => {
                            this.handleKeyPress(evt);
                        }
                    }}
                    onChange={evt => this.handleChange(evt.target.value)}
                    classes={{ input: styles.selectionInput }}
                />
            </div>
        );
    }
}

DayPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    day: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default connect()(DayPicker);
