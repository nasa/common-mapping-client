import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import { Button } from 'react-toolbox/lib/button';
import * as appConfig from 'constants/appConfig';

export class DatePicker extends Component {
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

        if (newDate.isBetween(minDate, maxDate)) {
            this.props.setDate(newDate.toDate());
        } else {
            this.props.setDate(date.toDate());
        }
    }
    render() {
        let date = moment(this.props.date);
        let year = date.format("YYYY");
        let month = date.format("MMM");
        let day = date.format("DD");
        return (
            <div className="row middle-xs date-picker">
                <div className="date-picker-selection col-xs-5">
                    <div className="date-picker-selection-increment">
                        <Button neutral primary icon="arrow_drop_up" className="no-padding" onClick={() => this.incrementDate("years", true)}/>
                    </div>
                    <Autocomplete
                      direction="up"
                      onChange={(value) => this.updateDate("years", value)}
                      label=""
                      tabIndex="1"
                      multiple={false}
                      source={appConfig.YEAR_ARRAY}
                      value={year}
                    />
                    <div className="date-picker-selection-increment">
                        <Button neutral primary icon="arrow_drop_down" className="no-padding" onClick={() => this.incrementDate("years", false)}/>
                    </div>
                </div>
                <div className="date-picker-selection col-xs-4">
                    <div className="date-picker-selection-increment">
                        <Button neutral primary icon="arrow_drop_up" className="no-padding" onClick={() => this.incrementDate("months", true)}/>
                    </div>
                    <Autocomplete
                      direction="up"
                      onChange={(value) => this.updateDate("months", value)}
                      label=""
                      tabIndex="2"
                      multiple={false}
                      source={appConfig.MONTH_ARRAY}
                      value={month}
                    />
                    <div className="date-picker-selection-increment">
                        <Button neutral primary icon="arrow_drop_down" className="no-padding" onClick={() => this.incrementDate("months", false)}/>
                    </div>
                </div>
                <div className="date-picker-selection col-xs-3">
                    <div className="date-picker-selection-increment">
                        <Button neutral primary icon="arrow_drop_up" className="no-padding" onClick={() => this.incrementDate("days", true)}/>
                    </div>
                    <Autocomplete
                      direction="up"
                      onChange={(value) => this.updateDate("days", value)}
                      label=""
                      tabIndex="3"
                      multiple={false}
                      source={appConfig.DAY_ARRAY}
                      value={day}
                    />
                    <div className="date-picker-selection-increment">
                        <Button neutral primary icon="arrow_drop_down" className="no-padding" onClick={() => this.incrementDate("days", false)}/>
                    </div>
                </div>
            </div>
        );
    }
}

DatePicker.propTypes = {
    setDate: PropTypes.func.isRequired,
    date: PropTypes.object.isRequired
};

export default connect()(DatePicker);
