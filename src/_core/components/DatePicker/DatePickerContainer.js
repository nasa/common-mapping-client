import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import { Button } from 'react-toolbox/lib/button';
import * as actions from '_core/actions/MapActions';
import DatePicker from '_core/components/DatePicker/DatePicker';
import DateKeyboardControls from '_core/components/DatePicker/DateKeyboardControls';

export class DatePickerContainer extends Component {
    render() {
        return (
            <div id="datePickerContainer" className="row middle-xs">
                <DateKeyboardControls />
                <DatePicker date={this.props.date} setDate={this.props.actions.setDate} />
            </div>
        );
    }
}

DatePickerContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    date: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DatePickerContainer);
