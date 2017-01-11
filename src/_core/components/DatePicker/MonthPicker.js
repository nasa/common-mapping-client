import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Input from 'react-toolbox/lib/input';
import MiscUtil from '_core/utils/MiscUtil';
import * as appConfig from 'constants/appConfig';

const MAX_LENGTH = 3;
const miscUtil = new MiscUtil();

export class MonthPicker extends Component {
    componentWillMount() {
        this.setState({ renderToggle: false });
    }
    componentDidMount() {
        this.month = this.props.month;
        this.error = false;
        this.updateFromInternal = false;
    }
    shouldComponentUpdate(nextProps) {
        return (nextProps.month !== this.props.month) || (nextProps.month !== this.month);
    }
    handleKeyPress(evt) {
        let monthStr = this.month;
        if (evt.charCode === 13) { // enter key
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
        this.setState({ renderToggle: !this.state.renderToggle });
    }
    submitMonth(monthStr) {
        this.props.onUpdate(monthStr);

        // if the update failed because date was invalid
        // force a re-render the go back to previous valid state
        if (this.month !== this.props.month) {
            this.error = true;
            this.setState({ renderToggle: !this.state.renderToggle });
        }
    }
    render() {
        let monthStr = this.updateFromInternal ? this.month : this.props.month;
        this.month = monthStr;
        this.updateFromInternal = false;
        let containerClasses = miscUtil.generateStringFromSet({
            "date-picker-selection col-xs-4": true,
            "error": this.error
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
