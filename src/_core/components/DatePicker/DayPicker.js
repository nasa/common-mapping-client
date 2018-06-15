/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import Input from "@material-ui/core/Input";
import MiscUtil from "_core/utils/MiscUtil";
import appConfig from "constants/appConfig";
import styles from "_core/components/DatePicker/DatePicker.scss";

const MAX_LENGTH = 2;

export class DayPicker extends Component {
    componentDidMount() {
        this.day = this.props.day;
        this.error = false;
        this.submitUpdate = false;
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        let wasSubmitUpdate = this.submitUpdate;
        this.submitUpdate = false;
        if (wasSubmitUpdate && parseInt(nextProps.day) !== parseInt(this.day)) {
            this.error = true;
        } else {
            this.error = false;
        }
        return wasSubmitUpdate || nextProps.day !== this.props.day || nextProps.day !== this.day;
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
        this.submitUpdate = true;
        this.props.onUpdate(dayStr);
    }
    render() {
        let dayStr = this.updateFromInternal ? this.day : this.props.day;
        this.day = this.updateFromInternal ? this.day : dayStr;
        this.updateFromInternal = false;
        let containerClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <Input
                type="text"
                tabIndex="0"
                fullWidth={true}
                error={this.error}
                value={dayStr}
                onBlur={evt => {
                    this.handleBlur(evt.target.value);
                }}
                inputProps={{
                    onKeyPress: evt => {
                        this.handleKeyPress(evt);
                    }
                }}
                onChange={evt => this.handleChange(evt.target.value)}
                classes={{ root: containerClasses, input: styles.selectionInput }}
            />
        );
    }
}

DayPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    day: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default DayPicker;
