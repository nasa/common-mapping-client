import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Input from 'react-toolbox/lib/input';
import MiscUtil from '_core/utils/MiscUtil';
import * as appConfig from 'constants/appConfig';

const MAX_LENGTH = 2;
const miscUtil = new MiscUtil();

export class DayPicker extends Component {
    componentWillMount() {
        this.setState({ day: this.props.day, error: false });
    }
    componentDidMount() {
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.day !== this.props.day || nextProps.day !== this.state.day;
    }
    handleKeyPress(evt) {
        let dayStr = this.state.day;
        dayStr = miscUtil.padNumber(dayStr, 2);
        if (evt.charCode === 13) { // enter key
            this.submitDay(dayStr);
        }
    }
    handleBlur(evt) {
        let dayStr = this.state.day;
        dayStr = miscUtil.padNumber(dayStr, 2);
        this.submitDay(dayStr);
    }
    handleChange(dayStr) {
        let newState = {...this.state };
        newState.error = false;
        if (dayStr.length <= MAX_LENGTH) {
            newState.day = dayStr;
        }
        this.setState(newState);
        this.updateFromInternal = true;
    }
    isDayValid(dayStr) {
        dayStr = miscUtil.padNumber(dayStr, 2);
        return appConfig.DAY_ARRAY.indexOf(dayStr) !== -1;
    }
    submitDay(dayStr) {
        if (this.isDayValid(dayStr)) {
            this.props.onUpdate(dayStr);
        } else {
            this.setState({ error: true });
        }
    }
    render() {
        let dayStr = this.updateFromInternal ? this.state.day : this.props.day;
        this.updateFromInternal = false;
        let containerClasses = miscUtil.generateStringFromSet({
            "date-picker-selection col-xs-3": true,
            "error": this.state.error
        });
        return (
             <div className={containerClasses}>
                <Input
                    ref="input"
                    type="text"
                    value={dayStr}
                    onBlur={(evt) => this.handleBlur(evt)}
                    onKeyPress={(evt) => this.handleKeyPress(evt)}
                    onChange={(evt) => this.handleChange(evt)} />
            </div>
        );
    }
}

DayPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    day: PropTypes.string.isRequired
};

export default connect()(DayPicker);
