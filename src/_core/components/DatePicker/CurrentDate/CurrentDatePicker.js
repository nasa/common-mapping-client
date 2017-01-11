import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Button } from 'react-toolbox/lib/button';
import CurrentYearPicker from '_core/components/DatePicker/CurrentDate/CurrentYearPicker';
import CurrentMonthPicker from '_core/components/DatePicker/CurrentDate/CurrentMonthPicker';
import CurrentDayPicker from '_core/components/DatePicker/CurrentDate/CurrentDayPicker';
import * as appConfig from 'constants/appConfig';

export class CurrentDatePicker extends Component {
    shouldComponentUpdate(nextProps) {
        return false;
    }

    incrementDate(resolution, increment = true) {
        let newDate = moment(this.props.date);
        if (increment) {
            newDate = newDate.add(1, resolution);
        } else {
            newDate = newDate.subtract(1, resolution);
        }

        let minDate = moment(appConfig.MIN_DATE);
        let maxDate = moment(appConfig.MAX_DATE);

        if (newDate.isBetween(minDate, maxDate)) {
            this.props.setDate(newDate.toDate());
        }
    }

    updateDate(resolution, value) {
        // Update the application date based off 
        // Autocomplete incomplete date string
        let date = moment(this.props.date);
        let newDate = date.format("YYYY-MMM-DD");
        if (resolution === "days") {
            newDate = date.format("YYYY-MMM") + "-" + value;
        } else if (resolution === "months") {
            newDate = date.format("YYYY") + "-" + value + "-" + date.format("DD");
        } else if (resolution === "years") {
            newDate = value + "-" + date.format("MMM-DD");
        }
        newDate = moment(newDate, "YYYY-MMM-DD");

        let minDate = moment(appConfig.MIN_DATE);
        let maxDate = moment(appConfig.MAX_DATE);

        if (newDate.isValid() && newDate.isBetween(minDate, maxDate)) {
            this.props.setDate(newDate.toDate());
        } else {
            this.props.setDate(date.toDate());
        }
    }
    render() {
        return (
            <div className="date-picker">
                <div className="row middle-xs no-margin">
                    <div className="date-picker-selection-increment col-xs-5">
                        <Button neutral primary icon="arrow_drop_up" className="no-padding" onClick={() => this.incrementDate("years", true)}/>
                    </div>
                    <div className="date-picker-selection-increment col-xs-4">
                        <Button neutral primary icon="arrow_drop_up" className="no-padding" onClick={() => this.incrementDate("months", true)}/>
                    </div>
                    <div className="date-picker-selection-increment col-xs-3">
                        <Button neutral primary icon="arrow_drop_up" className="no-padding" onClick={() => this.incrementDate("days", true)}/>
                    </div>
                </div>
                <div className="row middle-xs no-margin">
                    <CurrentYearPicker onUpdate={(value) => this.updateDate("years", value)} />
                    <CurrentMonthPicker onUpdate={(value) => this.updateDate("months", value)} />
                    <CurrentDayPicker onUpdate={(value) => this.updateDate("days", value)} />
                </div>
                <div className="row middle-xs no-margin">
                    <div className="date-picker-selection-increment col-xs-5">
                        <Button neutral primary icon="arrow_drop_down" className="no-padding" onClick={() => this.incrementDate("years", false)}/>
                    </div>
                    <div className="date-picker-selection-increment col-xs-4">
                        <Button neutral primary icon="arrow_drop_down" className="no-padding" onClick={() => this.incrementDate("months", false)}/>
                    </div>
                    <div className="date-picker-selection-increment col-xs-3">
                        <Button neutral primary icon="arrow_drop_down" className="no-padding" onClick={() => this.incrementDate("days", false)}/>
                    </div>
                </div>
            </div>
        );
    }
}

CurrentDatePicker.propTypes = {
    setDate: PropTypes.func.isRequired,
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
)(CurrentDatePicker);