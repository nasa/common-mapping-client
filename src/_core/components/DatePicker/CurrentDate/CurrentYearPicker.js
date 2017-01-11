import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import YearPicker from '_core/components/DatePicker/YearPicker';
import * as appConfig from 'constants/appConfig';

export class CurrentYearPicker extends Component {
    shouldComponentUpdate(nextProps) {
        let nextDate = moment(nextProps.date);
        let currentDate = moment(this.props.date);
        return nextDate.year() !== currentDate.year();
    }
    render() {
        let date = moment(this.props.date);
        let year = date.format("YYYY");
        return (
            <YearPicker year={year} onUpdate={this.props.onUpdate} />
        );
    }
}

CurrentYearPicker.propTypes = {
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
)(CurrentYearPicker);
