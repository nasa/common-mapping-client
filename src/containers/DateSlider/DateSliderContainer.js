import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/MapActions';
import d3 from 'd3';
import TimeAxis from './TimeAxis';

export class DateSliderContainer extends Component {
    componentDidMount() {
        // wrap element in d3
        this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    }

    componentDidUpdate() {
        // this.d3Node.call(DateSlider.update)
    }

    componentWillUnmount() {}

    render() {
        let svgStyle = {
            display: 'block',
            width: 1000,
            height: 100,
            left: 0
        };
        let data = {
            date: this.props.date,
            isDragging: this.props.isDragging
        }
        let timeAxis = (<TimeAxis date={this.props.date}/>);
        return (
            <svg style={svgStyle}>
                <g id="dateSlider">
                    {timeAxis}
                </g>
          </svg>
        );
    }
}

DateSliderContainer.propTypes = {
    // date: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

// function mapStateToProps(state) {
//     return {
//         date: state.map.get("date"),
//         isDragging: state.dateSlider.isDragging
//     };
// }

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(DateSliderContainer);
