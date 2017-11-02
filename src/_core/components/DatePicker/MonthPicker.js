import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Input from "react-toolbox/lib/input";
import MiscUtil from "_core/utils/MiscUtil";
import appConfig from "constants/appConfig";

const MAX_LENGTH = 3;
const miscUtil = new MiscUtil();

export class MonthPicker extends Component {
    componentDidMount() {
        this.month = this.props.month;
        this.error = false;
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.month !== this.props.month || nextProps.month !== this.month;
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
        this.props.onUpdate(monthStr);

        // if the update failed because date was invalid
        // force a re-render the go back to previous valid state
        if (this.month !== this.props.month) {
            this.error = true;
            this.forceUpdate();
        }
    }
    render() {
        let monthStr = this.updateFromInternal ? this.month : this.props.month;
        this.month = monthStr;
        this.updateFromInternal = false;
        let containerClasses = miscUtil.generateStringFromSet({
            "date-picker-selection col-xs-4": true,
            error: this.error
        });
        return (
            <div className={containerClasses}>
                <Input
                    ref="input"
                    type="text"
                    tabIndex="0"
                    value={monthStr}
                    onBlur={evt => this.handleBlur(evt)}
                    onKeyPress={evt => this.handleKeyPress(evt)}
                    onChange={evt => this.handleChange(evt)}
                />
            </div>
        );
    }
}

MonthPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    month: PropTypes.string.isRequired
};

export default connect()(MonthPicker);
