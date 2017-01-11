import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import DayPicker from '_core/components/DatePicker/DayPicker';
import * as appConfig from 'constants/appConfig';

export class CurrentDayPicker extends Component {
    shouldComponentUpdate(nextProps) {
        let nextDate = moment(nextProps.date);
        let currentDate = moment(this.props.date);
        return nextDate.day() !== currentDate.day();
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
