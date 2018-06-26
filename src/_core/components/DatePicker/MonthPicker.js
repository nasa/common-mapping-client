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

const MAX_LENGTH = 3;

export class MonthPicker extends Component {
    componentDidMount() {
        this.month = this.props.month;
        this.error = false;
        this.submitUpdate = false;
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        let wasSubmitUpdate = this.submitUpdate;
        this.submitUpdate = false;
        if (wasSubmitUpdate && nextProps.month.toLowerCase() !== this.month.toLowerCase()) {
            this.error = true;
        } else {
            this.error = false;
        }
        return (
            wasSubmitUpdate ||
            nextProps.month !== this.props.month ||
            nextProps.month !== this.month
        );
    }
    handleKeyPress(evt) {
        let monthStr = this.month;
        if (evt.charCode === 13) {
            // enter key
            this.submitMonth(monthStr);
        }
    }
    handleBlur(evt) {
        let monthStr = this.month;
        this.submitMonth(monthStr);
    }
    handleChange(monthStr) {
        if (monthStr.length <= MAX_LENGTH) {
            this.month = monthStr;
        }
        this.error = false;
        this.updateFromInternal = true;
        this.forceUpdate();
    }
    submitMonth(monthStr) {
        this.submitUpdate = true;
        this.props.onUpdate(monthStr);
    }
    render() {
        let monthStr = this.updateFromInternal ? this.month : this.props.month;
        this.month = this.updateFromInternal ? this.month : monthStr;
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
                value={monthStr}
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

MonthPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    month: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default MonthPicker;
