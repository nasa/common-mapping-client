import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Input from 'react-toolbox/lib/input';
import MiscUtil from '_core/utils/MiscUtil';
import * as appConfig from 'constants/appConfig';

const MAX_LENGTH = 3;
const miscUtil = new MiscUtil();

export class MonthPicker extends Component {
    componentWillMount() {
        this.setState({ month: this.props.month, error: false });
    }
    componentDidMount() {
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.month !== this.props.month || nextProps.month !== this.state.month;
    }
    handleKeyPress(evt) {
        let monthStr = this.state.month;
        if (evt.charCode === 13) { // enter key
            this.submitMonth(monthStr);
        }
    }
    handleBlur(evt) {
        let monthStr = this.state.month;
        this.submitMonth(monthStr);
    }
    handleChange(monthStr) {
        let newState = {...this.state };
        newState.error = false;
        if (monthStr.length <= MAX_LENGTH) {
            newState.month = monthStr;
        }
        this.setState(newState);
        this.updateFromInternal = true;
    }
    isMonthValid(monthStr) {
        return appConfig.MONTH_ARRAY.indexOf(monthStr.toLowerCase()) !== -1;
    }
    submitMonth(monthStr) {
        if (this.isMonthValid(monthStr)) {
            this.props.onUpdate(monthStr);
        } else {
            this.setState({ error: true });
        }
    }
    render() {
        let monthStr = this.updateFromInternal ? this.state.month : this.props.month;
        this.updateFromInternal = false;
        let containerClasses = miscUtil.generateStringFromSet({
            "date-picker-selection col-xs-4": true,
            "error": this.state.error
        });
        return (
             <div className={containerClasses}>
                <Input
                    ref="input"
                    type="text"
                    value={monthStr}
                    onBlur={(evt) => this.handleBlur(evt)}
                    onKeyPress={(evt) => this.handleKeyPress(evt)}
                    onChange={(evt) => this.handleChange(evt)} />
            </div>
        );
    }
}

MonthPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    month: PropTypes.string.isRequired
};

export default connect()(MonthPicker);