/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MapAction } from "actions";
import { DatePicker } from "_core/components/DatePicker";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/DatePicker/DatePickerContainer.scss";
import displayStyles from "_core/styles/display.scss";

export class DatePickerContainer extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.datePickerContainer]: true,
            [displayStyles.hiddenFadeOut]: this.props.distractionFreeMode,
            [displayStyles.hiddenFadeIn]: !this.props.distractionFreeMode,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div className={containerClasses}>
                <DatePicker date={this.props.date} setDate={this.props.setDate} />
            </div>
        );
    }
}

DatePickerContainer.propTypes = {
    date: PropTypes.object.isRequired,
    distractionFreeMode: PropTypes.bool.isRequired,
    setDate: PropTypes.func.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date"),
        distractionFreeMode: state.view.get("distractionFreeMode")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setDate: MiscUtil.bindActionCreators(MapAction.setDate, dispatch, MapAction)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DatePickerContainer);
