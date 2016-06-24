import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as DateSliderActions from '../../actions/DateSliderActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import d3 from 'd3';
import SingleDate from './SingleDate';

let TimeAxisD3 = {};

let minDt = new Date("06/11/2000");
let maxDt = new Date("06/15/2019");

let elementWidth = 1000;
let elementHeight = 50;

let margin = {
    top: 0,
    right: 0,
    bottom: 20,
    left: 0
};

let width = elementWidth - margin.left - margin.right;
let height = elementHeight - margin.top - margin.bottom;

let xFn = d3.time.scale()
    .domain([minDt, maxDt])
    .range([0, width]);

let xAxis = d3.svg.axis()
    .scale(xFn)
    .orient('bottom')
    .tickSize(-height);

let intervalMinWidth = 8;
let textTruncateThreshold = 30;

TimeAxisD3.enter = (selection) => {
    let zoom = d3.behavior.zoom()
        .x(xFn)
        .on('zoom', () => {
            zoomed()
        })

    let zoomed = function() {
        // Check that the domain is not larger than bounds
        if (xFn.domain()[1] - xFn.domain()[0] > maxDt - minDt) {
            // Constrain scale to 1
            zoom.scale(1);
        }
        if (xFn.domain()[0] < minDt) {
            zoom.translate([zoom.translate()[0] - xFn(minDt) + xFn.range()[0], zoom.translate()[1]])
        }
        if (xFn.domain()[1] > maxDt) {
            zoom.translate([zoom.translate()[0] - xFn(maxDt) + xFn.range()[1], zoom.translate()[1]]);
        }

        selection.select('#x-axis')
            .call(xAxis);

        let singleDate = selection.select('.singleDate');
        // If not isDragging, set x of singledate to new value
        // If isDragging, do not set value so that single date can be
        //  dragged while zoom is in progress
        if (!singleDate.attr().data()[0].isDragging) {
            singleDate.attr('x', d => {
                return xFn(d.date);
            })

        }
    }
    selection
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom)
        // .on("dblclick.zoom", null)

    selection.select('clippath rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width);

    selection.select('rect#chart-bounds')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width);

    selection.select("#x-axis")
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    // Single date
    selection.select(".singleDate")
        .attr('clip-path', 'url(#chart-content)')
        // .attr('width', 10)
        .attr('height', height)
        .attr('x', (d) => xFn(d.date))
        .attr('y', 2)

    // Done entering, time to call update
    selection.call(TimeAxisD3.update)
}

TimeAxisD3.update = (selection) => {
    selection.select('#x-axis')
        .call(xAxis);
    selection.select(".singleDate")
        .attr('x', (d) => xFn(d.date))
}

TimeAxisD3.exit = () => {

}

export class TimeAxis extends Component {
    componentDidMount() {
        // wrap element in d3
        this.d3Node = d3.select(ReactDOM.findDOMNode(this));
        this.d3Node.call(TimeAxisD3.enter);
    }
    shouldComponentUpdate(nextProps) {
        // console.log("next props", nextProps);

        // Maybe if date same, don't update or something.

        // if (stuff) {
        //     this.d3Node.datum(nextProps.date)
        //         .call(TimeAxis.update)
        //     return false;
        // }
        return true;
    }
    componentDidUpdate() {
        this.d3Node.call(TimeAxisD3.update);
    }
    componentWillUnmount() {

    }
    render() {
        return (
            <g className="timeAxis">
                <defs>
                    <clippath id="chart-content">
                        <rect></rect>
                        <g></g>
                    </clippath>
                </defs>
                <rect id="chart-bounds"></rect>
                <g id="x-axis"></g>
                <SingleDate
                    beforeDrag={() => {
                        this.props.actions.beginDragging()
                    }} 
                    onDrag={() => {}} 
                    afterDrag={(value) => {
                        let newDate = xFn.invert(value);
                        this.props.actions.dragEnd(newDate)
                    }}/>
            </g>
        )
    }
}
TimeAxis.propTypes = {
    date: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(DateSliderActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeAxis);
