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

const MAX_LENGTH = 4;

export class YearPicker extends Component {
    componentDidMount() {
        this.year = this.props.year;
        this.error = false;
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.year !== this.props.year || nextProps.year !== this.year;
    }
    handleKeyPress(evt) {
        let yearStr = this.year;
        if (evt.charCode === 13) {
            // enter key
            this.submitYear(yearStr);
        }
    }
    handleBlur(yearStr) {
        yearStr = this.year;
        this.submitYear(yearStr);
    }
    handleChange(yearStr) {
        if (yearStr.length <= MAX_LENGTH) {
            this.year = yearStr;
        }
        this.error = false;
        this.updateFromInternal = true;
        this.forceUpdate();
    }
    submitYear(yearStr) {
        this.props.onUpdate(yearStr);

        // if the update failed because date was invalid
        // force a re-render the go back to previous valid state
        this.error = this.year !== this.props.year;
        this.forceUpdate();
    }
    render() {
        let yearStr = this.updateFromInternal ? this.year : this.props.year;
        this.year = this.updateFromInternal ? this.year : yearStr;
        this.updateFromInternal = false;
        let containerClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <Input
                type="text"
                fullWidth={true}
                value={yearStr}
                error={this.error}
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

YearPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    year: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default YearPicker;
