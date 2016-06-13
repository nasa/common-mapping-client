import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/MapActions';
import d3 from 'd3';

export class DateSliderContainer extends Component {
    // componentDidMount() {
    //     let el = React.findDOMNode(this);
    //     this.d3ChartCreate(el, {
    //         width: '100%',
    //         height: '300px'
    //     }, this.getChartState());
    // }

    // componentDidUpdate() {
    //     let el = React.findDOMNode(this);
    //     this.d3ChartUpdate(el, this.getChartState());
    // }

    // componentWillUnmount() {
    //     let el = React.findDOMNode(this);
    //     this.d3ChartDestroy(el);
    // }

    // getChartState() {
    //     return {
    //         data: [
    //             { id: '5fbmzmtc', x: 7, y: 41, z: 6 },
    //             { id: 's4f8phwm', x: 11, y: 45, z: 9 }
    //         ],
    //         domain: { x: [0, 30], y: [0, 100] }
    //     };
    // }

    // d3ChartCreate(el, props, state) {
    //     let svg = d3.select(el).append('svg')
    //         .attr('class', 'd3')
    //         .attr('width', props.width)
    //         .attr('height', props.height);

    //     svg.append('g')
    //         .attr('class', 'd3-points');

    //     this.update(el, state);
    // }
    // d3ChartUpdate(el, state) {
    //     // Re-compute the scales, and render the data points
    //     let scales = this._scales(el, state.domain);
    //     this._drawPoints(el, scales, state.data);
    // }

    // d3ChartDestroy(el) {
    //     // Any clean-up would go here
    //     // in this example there is nothing to do
    // }

    // d3Chart_drawPoints(el, scales, data) {
    //     let g = d3.select(el).selectAll('.d3-points');

    //     let point = g.selectAll('.d3-point')
    //         .data(data, function(d) {
    //             return d.id;
    //         });

    //     // ENTER
    //     point.enter().append('circle')
    //         .attr('class', 'd3-point');

    //     // ENTER & UPDATE
    //     point.attr('cx', function(d) {
    //             return scales.x(d.x);
    //         })
    //         .attr('cy', function(d) {
    //             return scales.y(d.y);
    //         })
    //         .attr('r', function(d) {
    //             return scales.z(d.z);
    //         });

    //     // EXIT
    //     point.exit()
    //         .remove();
    // }

    render() {
        return (
            <div id="dateSlider">
            <div className="Chart"></div>
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
