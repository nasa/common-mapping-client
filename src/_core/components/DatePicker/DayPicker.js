import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Input from "react-toolbox/lib/input";
import MiscUtil from "_core/utils/MiscUtil";
import appConfig from "constants/appConfig";

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
            "date-picker-selection col-xs-3": true,
            error: this.error
        });
        return (
            <div className={containerClasses}>
                <Input
                    ref="input"
                    type="text"
                    tabIndex="0"
                    value={dayStr}
                    onBlur={evt => this.handleBlur(evt)}
                    onKeyPress={evt => this.handleKeyPress(evt)}
                    onChange={evt => this.handleChange(evt)}
                />
            </div>
        );
    }
}

DayPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    day: PropTypes.string.isRequired
};

export default connect()(DayPicker);
