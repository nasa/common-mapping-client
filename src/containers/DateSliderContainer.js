import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/MapActions';

export class DateSliderContainer extends Component {
    render() {
        return (
            <div id="dateSlider">
                {this.props.date.toISOString().split("T")[0]}
            </div>
        );
    }
}

DateSliderContainer.propTypes = {
    date: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
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
)(DateSliderContainer);
