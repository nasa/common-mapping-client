import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as actions from '../../actions/MapActions';
import MiscUtil from '../../utils/MiscUtil';

export class DatePickerContainer extends Component {
    render() {
        let date = moment(this.props.date);
        let year = date.format("YYYY");
        let month = date.format("MMM");
        let day = date.format("DD");
        return (
            <div id="datePickerContainer" className="row middle-xs">
                <div className="date-picker-selection col-xs-4">
                    {year}
                </div>
                <div className="date-picker-selection col-xs-4">
                    {month}
                </div>
                <div className="date-picker-selection col-xs-4">
                    {day}
                </div>
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
