import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Input from 'react-toolbox/lib/input';
import MiscUtil from '_core/utils/MiscUtil';
import * as appConfig from 'constants/appConfig';

const MAX_LENGTH = 2;
const miscUtil = new MiscUtil();

export class DayPicker extends Component {
    componentWillMount() {
        this.setState({ renderToggle: false });
    }
    componentDidMount() {
        this.day = this.props.day;
        this.error = false;
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        return (nextProps.day !== this.props.day) || (nextProps.day !== this.day);
    }
    handleKeyPress(evt) {
        let dayStr = this.day;
        dayStr = miscUtil.padNumber(dayStr, 2);
        if (evt.charCode === 13) { // enter key
            this.submitDay(dayStr);
        }
    }
    handleBlur(evt) {
        let dayStr = this.day;
        dayStr = miscUtil.padNumber(dayStr, 2);
        this.submitDay(dayStr);
    }
    handleChange(dayStr) {
        if (dayStr.length <= MAX_LENGTH) {
            this.day = dayStr;
        }
        this.error = false;
        this.updateFromInternal = true;
        this.setState({ renderToggle: !this.state.renderToggle });
    }
    submitDay(dayStr) {
        this.props.onUpdate(dayStr);

        // if the update failed because date was invalid
        // force a re-render the go back to previous valid state
        if (this.day !== this.props.day) {
            this.error = true;
            this.setState({ renderToggle: !this.state.renderToggle });
        }
    }
    render() {
        let dayStr = this.updateFromInternal ? this.day : this.props.day;
        this.day = dayStr;
        this.updateFromInternal = false;
        let containerClasses = miscUtil.generateStringFromSet({
            "date-picker-selection col-xs-3": true,
            "error": this.error
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
