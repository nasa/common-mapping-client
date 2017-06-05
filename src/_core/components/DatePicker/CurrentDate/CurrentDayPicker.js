import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import DayPicker from '_core/components/DatePicker/DayPicker';
import appConfig from 'constants/appConfig';

export class CurrentDayPicker extends Component {
    shouldComponentUpdate(nextProps) {
        let nextDate = moment(nextProps.date);
        let currentDate = moment(this.props.date);
        return nextDate.date() !== currentDate.date();
    }
    render() {
        let date = moment(this.props.date);
        let day = date.format("DD");
        return (
            <DayPicker day={day} onUpdate={this.props.onUpdate} />
        );
    }
}

CurrentDayPicker.propTypes = {
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
)(CurrentDayPicker);
