import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input } from 'react-toolbox/lib/input';
import MiscUtil from '_core/utils/MiscUtil';
import appConfig from 'constants/appConfig';

const MAX_LENGTH = 4;
const miscUtil = new MiscUtil();

export class YearPicker extends Component {
    componentDidMount() {
        this.year = this.props.year;
        this.error = false;
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        return (nextProps.year !== this.props.year) || (nextProps.year !== this.year);
    }
    handleKeyPress(evt) {
        let yearStr = this.year;
        if (evt.charCode === 13) { // enter key
            this.submitYear(yearStr);
        }
    }
    handleBlur(evt) {
        let yearStr = this.year;
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
        if (this.year !== this.props.year) {
            this.error = true;
            this.forceUpdate();
        }
    }
    render() {
        let yearStr = this.updateFromInternal ? this.year : this.props.year;
        this.year = yearStr;
        this.updateFromInternal = false;
        let containerClasses = miscUtil.generateStringFromSet({
            "date-picker-selection col-xs-5": true,
            "error": this.error
        });
        return (
            <div className={containerClasses}>
                <Input
                    ref="input"
                    type="text"
                    tabIndex="0"
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
