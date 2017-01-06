import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import MonthPicker from '_core/components/DatePicker/MonthPicker';
import * as appConfig from 'constants/appConfig';

export class CurrentMonthPicker extends Component {
    shouldComponentUpdate(nextProps) {
        let nextDate = moment(nextProps.date);
        let currentDate = moment(this.props.date);
        return nextDate.format("MMM") !== currentDate.format("MMM");
    }
    render() {
        let date = moment(this.props.date);
        let month = date.format("MMM");
        return (
            <MonthPicker month={month} onUpdate={this.props.onUpdate} />
        );
    }
}

CurrentMonthPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    date: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date")
    };
}

export default connect(
    mapStateToProps,
    null
)(CurrentMonthPicker);
