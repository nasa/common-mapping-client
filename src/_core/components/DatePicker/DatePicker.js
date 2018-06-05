/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import { YearPicker, MonthPicker, DayPicker, IncrementButton } from "_core/components/DatePicker";
import appConfig from "constants/appConfig";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/DatePicker/DatePicker.scss";

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
        newDate = moment(newDate, "YYYY-MMM-DD", true);

        let minDate = moment(appConfig.MIN_DATE);
        let maxDate = moment(appConfig.MAX_DATE);

        if (newDate.isValid() && newDate.isBetween(minDate, maxDate)) {
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

        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.datePicker]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <div className={containerClasses}>
                <Grid container spacing={0}>
                    <Grid item xs={5} className={styles.incrementButtonWrapper}>
                        <IncrementButton
                            className={styles.incrementButton}
                            aria-label="Years +1"
                            decrement={false}
                            onClick={() => this.incrementDate("years", true)}
                        />
                    </Grid>
                    <Grid item xs={4} className={styles.incrementButtonWrapper}>
                        <IncrementButton
                            className={styles.incrementButton}
                            aria-label="Months +1"
                            decrement={false}
                            onClick={() => this.incrementDate("months", true)}
                        />
                    </Grid>
                    <Grid item xs={3} className={styles.incrementButtonWrapper}>
                        <IncrementButton
                            className={styles.incrementButton}
                            aria-label="Days +1"
                            decrement={false}
                            onClick={() => this.incrementDate("days", true)}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={5} className={styles.datePickerSelection}>
                        <YearPicker
                            year={year}
                            onUpdate={value => this.updateDate("years", value)}
                        />
                    </Grid>
                    <Grid item xs={4} className={styles.datePickerSelection}>
                        <MonthPicker
                            month={month}
                            onUpdate={value => this.updateDate("months", value)}
                        />
                    </Grid>
                    <Grid item xs={3} className={styles.datePickerSelection}>
                        <DayPicker day={day} onUpdate={value => this.updateDate("days", value)} />
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={5} className={styles.incrementButtonWrapper}>
                        <IncrementButton
                            className={styles.incrementButton}
                            aria-label="Years -1"
                            decrement={true}
                            onClick={() => this.incrementDate("years", false)}
                        />
                    </Grid>
                    <Grid item xs={4} className={styles.incrementButtonWrapper}>
                        <IncrementButton
                            className={styles.incrementButton}
                            aria-label="Months -1"
                            decrement={true}
                            onClick={() => this.incrementDate("months", false)}
                        />
                    </Grid>
                    <Grid item xs={3} className={styles.incrementButtonWrapper}>
                        <IncrementButton
                            className={styles.incrementButton}
                            aria-label="Days -1"
                            decrement={true}
                            onClick={() => this.incrementDate("days", false)}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

DatePicker.propTypes = {
    setDate: PropTypes.func.isRequired,
    date: PropTypes.object.isRequired,
    className: PropTypes.string
};

export default DatePicker;
