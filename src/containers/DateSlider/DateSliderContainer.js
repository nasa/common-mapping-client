import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import d3 from 'd3';
import TimeAxis from './TimeAxis';

export class DateSliderContainer extends Component {
    componentDidMount() {}

    componentDidUpdate() {}

    componentWillUnmount() {}

    render() {
        return (
            <svg className="dateSliderContainer">
                <g id="dateSlider">
                    <TimeAxis />
                </g>
            </svg>
        );
    }
}

DateSliderContainer.propTypes = {};

export default connect()(DateSliderContainer);
