import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import MonthPicker from "_core/components/DatePicker/MonthPicker";
import appConfig from "constants/appConfig";

export class CurrentMonthPicker extends Component {
    shouldComponentUpdate(nextProps) {
        let nextDate = moment(nextProps.date);
        let currentDate = moment(this.props.date);
        return nextDate.month() !== currentDate.month();
    }
    render() {
        let date = moment(this.props.date);
        let month = date.format("MMM");
        return <MonthPicker month={month} onUpdate={this.props.onUpdate} />;
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

export default connect(mapStateToProps, null)(CurrentMonthPicker);
