import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Input } from 'react-toolbox/lib/input';
import MiscUtil from '_core/utils/MiscUtil';
import * as appConfig from 'constants/appConfig';

const MAX_LENGTH = 4;
const miscUtil = new MiscUtil();

export class YearPicker extends Component {
    componentWillMount() {
        this.setState({ year: this.props.year, error: false });
    }
    componentDidMount() {
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.year !== this.props.year || nextProps.year !== this.state.year;
    }
    handleKeyPress(evt) {
        let yearStr = this.state.year;
        if (evt.charCode === 13) { // enter key
            this.submitYear(yearStr);
        }
    }
    handleBlur(evt) {
        let yearStr = this.state.year;
        this.submitYear(yearStr);
    }
    handleChange(yearStr) {
        let newState = {...this.state };
        newState.error = false;
        if (yearStr.length <= MAX_LENGTH) {
            newState.year = yearStr;
        }
        this.setState(newState);
        this.updateFromInternal = true;
    }
    isYearValid(yearStr) {
        return appConfig.YEAR_ARRAY.indexOf(yearStr) !== -1;
    }
    submitYear(yearStr) {
        if (this.isYearValid(yearStr)) {
            this.props.onUpdate(yearStr);
        } else {
            this.setState({ error: true });
        }
    }
    render() {
        let yearStr = this.updateFromInternal ? this.state.year : this.props.year;
        this.updateFromInternal = false;
        let containerClasses = miscUtil.generateStringFromSet({
            "date-picker-selection col-xs-5": true,
            "error": this.state.error
        });
        return (
            <div className={containerClasses}>
                <Input
                    ref="input"
                    type="text"
                    value={yearStr}
                    onBlur={(evt) => this.handleBlur(evt)}
                    onKeyPress={(evt) => this.handleKeyPress(evt)}
                    onChange={(evt) => this.handleChange(evt)} />
            </div>
        );
    }
}

YearPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    year: PropTypes.string.isRequired
};

export default connect()(YearPicker);
