import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import d3 from 'd3';
import moment from 'moment';
import * as appConfig from '../../constants/appConfig';
import * as DateSliderActions from '../../actions/DateSliderActions';
import MiscUtil from '../../utils/MiscUtil';
import SingleDate from './SingleDate';

let TimeAxisD3 = {};

let minDt = appConfig.MIN_DATE;
let maxDt = appConfig.MAX_DATE;

let elementWidth = window.innerWidth;
let elementHeight = 50;

let margin = {
    top: 0,
    right: 300,
    bottom: 20,
    left: 300
};

let width = elementWidth - (margin.left + margin.right);
let height = elementHeight - (margin.top + margin.bottom);

let xFn = d3.time.scale()
    .domain([minDt, maxDt])
    .range([margin.left, margin.left + width]);

let xAxis = d3.svg.axis()
    .scale(xFn)
    .orient('bottom')
    .tickSize(-height);

let intervalMinWidth = 8;
let textTruncateThreshold = 30;

TimeAxisD3.enter = (selection, handleSingleDateDragEnd) => {
    selection.zoom = d3.behavior.zoom()
        .x(xFn)
        .on('zoom', () => {
            selection.zoomed();
        });

    selection.drag = d3.behavior.drag()
        .on('dragstart', () => {
            d3.event.sourceEvent.stopPropagation();
        });

    selection.zoomed = function() {
        // Check that the domain is not larger than bounds
        if (xFn.domain()[1] - xFn.domain()[0] > maxDt - minDt) {
            // Constrain scale to 1
            selection.zoom.scale(1);
        }
        if (xFn.domain()[0] < minDt) {
            selection.zoom.translate([selection.zoom.translate()[0] - xFn(minDt) + xFn.range()[0], selection.zoom.translate()[1]]);
        }
        if (xFn.domain()[1] > maxDt) {
            selection.zoom.translate([selection.zoom.translate()[0] - xFn(maxDt) + xFn.range()[1], selection.zoom.translate()[1]]);
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
            });
        }
    };

    selection
        .call(selection.zoom)
        .on("dblclick.zoom", null)
        .call(selection.drag)
        .on("click", (v) => {
            if (!d3.event.defaultPrevented) {
                handleSingleDateDragEnd(d3.event.x);
            }
        });

    selection.select('clipPath rect')
        .attr('x', margin.left)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width);

    selection.select('rect#chart-bounds')
        .attr('x', margin.left)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width);

    selection.select("#x-axis")
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    // Single date
    selection.select(".singleDate")
        .attr('x', (d) => xFn(d.date))
        .attr('y', 2)
        .attr('clip-path', "url(#chart-content)");

    // Done entering, time to call update
    selection.call(TimeAxisD3.update);
};

TimeAxisD3.update = (selection) => {
    selection.select('#x-axis')
        .call(xAxis);
    selection.select(".singleDate")
        .attr('x', (d) => xFn(d.date));
};

TimeAxisD3.exit = () => {

};

export class TimeAxis extends Component {
    componentDidMount() {
        // wrap element in d3
        this.d3Node = d3.select(ReactDOM.findDOMNode(this));
        this.d3Node.call(TimeAxisD3.enter, (value) => { this.handleSingleDateDragEnd(value); });
        window.addEventListener("resize", () => {
            this.d3Node.call(TimeAxisD3.update);
        });
    }
    componentDidUpdate() {
        this.d3Node.call(TimeAxisD3.update);
    }

    handleSingleDateDragEnd(value) {
        let newDate = xFn.invert(value);
        this.props.actions.dragEnd(newDate);
    }
    autoScroll(toLeft) {
        // get current translation
        let currTrans = this.d3Node.zoom.translate();

        // determine autoscroll amount (one-half tick)
        let currTicks = xFn.ticks();
        let tickDiff = (xFn(currTicks[1]) - xFn(currTicks[0])) / 2;

        // prep the timeline
        this.d3Node.call(this.d3Node.zoom.translate(currTrans).event);

        // shift the timeline
        if (toLeft) {
            this.d3Node.transition()
                .duration(150)
                .call(this.d3Node.zoom.translate([currTrans[0] - tickDiff, currTrans[1]]).event);
        } else {
            this.d3Node.transition()
                .duration(150)
                .call(this.d3Node.zoom.translate([currTrans[0] + tickDiff, currTrans[1]]).event);
        }
    }
    render() {
        let autoScrollInterval = null;
        let maxX = margin.left + width;
        let minX = margin.left;

        let axisClassNames = MiscUtil.generateStringFromSet({
            timeAxis: true,
            dragging: this.props.isDragging
        });
        return (
            <g className={axisClassNames}>
                <clipPath id="chart-content">
                    <rect></rect>
                    <g></g>
                </clipPath>
                <rect id="chart-bounds"></rect>
                <g id="x-axis"></g>
                <SingleDate
                    beforeDrag={() => {
                        clearInterval(autoScrollInterval);
                        this.props.actions.beginDragging();
                    }} 
                    onDrag={(x, y) => {
                        clearInterval(autoScrollInterval);
                        if(x > maxX) {
                            autoScrollInterval = setInterval(() => {
                                this.autoScroll(true);
                            }, 350);
                        } else if(x < minX) {
                            autoScrollInterval = setInterval(() => {
                                this.autoScroll(false);
                            }, 350);
                        }
                    }}
                    afterDrag={(value) => {
                        clearInterval(autoScrollInterval);
                        this.handleSingleDateDragEnd(value);
                    }}
                    maxX={maxX}
                    minX={minX}
                />
            </g>
        );
    }
}
TimeAxis.propTypes = {
    date: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    isDragging: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date"),
        isDragging: state.dateSlider.get("isDragging")
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
