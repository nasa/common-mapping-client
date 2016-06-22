import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import d3 from 'd3';
import SingleDate from './SingleDate';

let TimeAxisD3 = {};

let minDt = new Date("06/11/2016");
let maxDt = new Date("06/15/2016");

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
    console.log("enter", selection)

    let zoom = d3.behavior.zoom()
        .x(xFn)
        .on('zoom', () => {
            // console.log("zoom");
            zoomed()
        });
    let getTextPositionData = function(d) {
        this.textSizeInPx = this.textSizeInPx || this.getComputedTextLength();
        let from = xFn(d.from);
        let to = xFn(d.to);
        return {
            xPosition: from,
            upToPosition: to,
            width: to - from,
            textWidth: this.textSizeInPx
        };
    };
    let zoomed = function() {
        // console.log("ZOOMED")
        if (self.onVizChangeFn && d3.event) {
            self.onVizChangeFn.call(self, {
                scale: d3.event.scale,
                translate: d3.event.translate,
                domain: xFn.domain()
            });
        }

        selection.select('#x-axis')
            .call(xAxis);

        // this.render();
        // selection.selectAll('circle.dot')
        //     .attr('cx', d => xFn(d.at));

        // selection.selectAll('rect.interval')
        //     .attr('x', d => {
        //         console.log("ddddd", d)
        //         return xFn(d.from) 
        //     })
        //     .attr('width', d => Math.max(intervalMinWidth, xFn(d.to) - xFn(d.from)));

        // selection.selectAll('.interval-text')
        //     .attr('x', function(d) {
        //         let positionData = getTextPositionData.call(this, d);
        //         if ((positionData.upToPosition - groupWidth - 10) < positionData.textWidth) {
        //             return positionData.upToPosition;
        //         } else if (positionData.xPosition < groupWidth && positionData.upToPosition > groupWidth) {
        //             return groupWidth;
        //         }
        //         return positionData.xPosition;
        //     })
        //     .attr('text-anchor', function(d) {
        //         let positionData = getTextPositionData.call(this, d);
        //         if ((positionData.upToPosition - groupWidth - 10) < positionData.textWidth) {
        //             return 'end';
        //         }
        //         return 'start';
        //     })
        //     .attr('dx', function(d) {
        //         let positionData = getTextPositionData.call(this, d);
        //         if ((positionData.upToPosition - groupWidth - 10) < positionData.textWidth) {
        //             return '-0.5em';
        //         }
        //         return '0.5em';
        //     })
        //     .text(function(d) {
        //         let positionData = getTextPositionData.call(this, d);
        //         let percent = (positionData.width - textTruncateThreshold) / positionData.textWidth;
        //         if (percent < 1) {
        //             if (positionData.width > textTruncateThreshold) {
        //                 return d.label.substr(0, Math.floor(d.label.length * percent)) + '...';
        //             } else {
        //                 return '';
        //             }
        //         }

        //         return d.label;
        //     })
    }
    selection
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);

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
        .attr('transform', (d, i) => `translate(0, ${0 * i})`)
        .attr('x', (d) => xFn(d))

    // Done entering, time to call update
    selection.call(TimeAxisD3.update)
}

TimeAxisD3.update = (selection) => {
    selection
    // .transition()
}

TimeAxisD3.exit = () => {

}


export class TimeAxis extends Component {
    componentDidMount() {
        // wrap element in d3
        this.d3Node = d3.select(ReactDOM.findDOMNode(this));
        this.d3Node.datum(this.props.data)
            .call(TimeAxisD3.enter);
    }
    shouldComponentUpdate(nextProps) {
        console.log("next props", nextProps);
        // if (stuff) {
        //     this.d3Node.datum(nextProps.data)
        //         .call(TimeAxis.update)
        //     return false;
        // }
        return true;
    }
    componentDidUpdate() {
        this.d3Node.datum(this.props.data)
            .call(TimeAxisD3.update);
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
                <SingleDate date={this.props.date} />
            </g>
        )
    }
}
TimeAxis.propTypes = {
    date: PropTypes.object.isRequired
};



export default connect()(TimeAxis);
