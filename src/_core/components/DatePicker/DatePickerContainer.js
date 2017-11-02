import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Autocomplete from "react-toolbox/lib/autocomplete";
import { Button } from "react-toolbox/lib/button";
import * as actions from "_core/actions/MapActions";
import CurrentDatePicker from "_core/components/DatePicker/CurrentDate/CurrentDatePicker";
import MiscUtil from "_core/utils/MiscUtil";

const miscUtil = new MiscUtil();

export class DatePickerContainer extends Component {
    render() {
        let containerClasses = miscUtil.generateStringFromSet({
            "row middle-xs": true,
            "hidden-fade-out": this.props.distractionFreeMode,
            "hidden-fade-in": !this.props.distractionFreeMode
        });
        return (
            <div id="datePickerContainer" className={containerClasses}>
                <CurrentDatePicker setDate={this.props.actions.setDate} />
            </div>
        );
    }
}

DatePickerContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    distractionFreeMode: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        distractionFreeMode: state.view.get("distractionFreeMode")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DatePickerContainer);
