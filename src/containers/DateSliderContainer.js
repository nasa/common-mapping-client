import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/MapActions';
import d3 from 'd3';

const TimelineChartType = {
    POINT: Symbol(),
    INTERVAL: Symbol()
}

let DATA = [{
    label: 'Name',
    data: [{
        label: 'Label 1',
        type: TimelineChartType.INTERVAL,
        from: new Date([2016, 6, 13]),
        to: new Date([2016, 6, 14])
    }, {
        label: 'Label 2',
        type: TimelineChartType.INTERVAL,
        from: new Date([2015, 4, 1]),
        to: new Date([2015, 5, 12])
    }]
}];
let DateSlider = {};
let currentDate = new Date("06/13/2016");
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

let groupWidth = 100;

let xFn = d3.time.scale()
    .domain([minDt, maxDt])
    .range([groupWidth, width]);

let xAxis = d3.svg.axis()
    .scale(xFn)
    .orient('bottom')
    .tickSize(-height);

let intervalMinWidth = 8;
let textTruncateThreshold = 30;
// let withCustom = function(defaultClass) {
//     return d => d.customClass ? [d.customClass, defaultClass].join(' ') : defaultClass
// }

let getPointMinDt = function(p) {
    return p.type === TimelineChartType.POINT ? p.at : p.from;
}
let getPointMaxDt = function(p) {
    return p.type === TimelineChartType.POINT ? p.at : p.to;
}
DateSlider.enter = (selection) => {
    console.log("DATE SLIDER ENTER", selection);


    let zoom = d3.behavior.zoom()
        .x(xFn)
        .on('zoom', () => {
            console.log("zoom");
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
        console.log("ZOOMED")
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

    selection.select("svg g")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);

    selection.select('clippath rect')
        .attr('x', groupWidth)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width - groupWidth);

    selection.select('rect#chart-bounds')
        .attr('x', groupWidth)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width - groupWidth);

    selection.select("#x-axis")
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);


    // MAKE THIS REACTy!!
    let groupHeight = height / DATA.length;
    let groupSection = selection.selectAll('.group-section')
        .data(DATA)
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d, i) => {
            return groupHeight * (i + 1);
        })
        .attr('y2', (d, i) => {
            console.log(d,i,"IMPORTAA")
            return groupHeight * (i + 1);
        });

    console.log(groupSection,"groupSection");

    let groupLabels = selection.selectAll('.group-label')
        .data(DATA)
        .attr('x', 0)
        .attr('y', (d, i) => {
            return (groupHeight * i) + (groupHeight / 2) + 5.5;
        })
        .attr('dx', '0.5em')

    console.log(groupLabels,"groupLabels");
    let lineSection = selection.select('.group-content-divider')
        .attr('x1', groupWidth)
        .attr('x2', groupWidth)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', 'black');


    console.log("groupIntervalItems", groupIntervalItems);
    let groupIntervalItems = selection.selectAll('.group-interval-item')
        .attr('clip-path', 'url(#chart-content)')
        .attr('transform', (d, i) => `translate(0, ${groupHeight * i})`)


    let intervalBarHeight = 0.8 * groupHeight;
    let intervalBarMargin = (groupHeight - intervalBarHeight) / 2;
    let intervalMinWidth = 8;
    let intervals = groupIntervalItems.selectAll('rect')
        // .attr('class', withCustom('interval'))
        // .attr('width', (d) => {
        //     console.log(d, "!");
        //     return Math.max(intervalMinWidth, x(d.to) - x(d.from))
        // })
        .attr('height', intervalBarHeight)
        .attr('y', intervalBarMargin)
        // .attr('x', (d) => xFn(d.from));

    // let intervalTexts = groupIntervalItems
    //     .attr('fill', 'white')
    //     // .attr('class', withCustom('interval-text'))
    //     .attr('y', (groupHeight / 2) + 5)
    //     .attr('x', (d) => x(d.from));

    // zoomed();
};
DateSlider.update = (selection) => {
    console.log("DATE SLIDER UPDATE", selection);
};

export class DateSliderContainer extends Component {
    componentDidMount() {
        // wrap element in d3
        this.d3Node = d3.select(ReactDOM.findDOMNode(this));
        this.d3Node.datum(DATA)
            .call(DateSlider.enter);
        // this.d3ChartCreate(el, {
        //     width: '100%',
        //     height: '500px'
        // }, this.getChartState());
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.data.update) {
            // use d3 to update component
            this.d3Node.datum(nextProps.date)
                .call(DateSlider.update);
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        // let el = ReactDOM.findDOMNode(this);
        // this.d3ChartUpdate(el, this.getChartState());
        this.d3Node.datum(DATA);
    }

    componentWillUnmount() {
        // let el = ReactDOM.findDOMNode(this);
        // this.d3ChartDestroy(el);
    }

    // getChartState() {
    //     return {
    //         data: [{
    //             label: 'Name',
    //             data: [{
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 1, 1])
    //             }, {
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 2, 1])
    //             }, {
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 3, 1])
    //             }, {
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 4, 1])
    //             }, {
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 5, 1])
    //             }, {
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 6, 1]),
    //                 customClass: 'blue-dot'
    //             }]
    //         }, {
    //             label: 'Type',
    //             data: [{
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 1, 11])
    //             }, {
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 1, 15])
    //             }, {
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 3, 10])
    //             }, {
    //                 label: 'I\'m a label with a custom class',
    //                 type: TimelineChartType.INTERVAL,
    //                 from: new Date([2015, 2, 1]),
    //                 to: new Date([2015, 3, 1]),
    //                 customClass: 'blue-interval'
    //             }, {
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 6, 1])
    //             }, {
    //                 type: TimelineChartType.POINT,
    //                 at: new Date([2015, 7, 1])
    //             }]
    //         }, {
    //             label: 'Imp',
    //             data: [{
    //                 label: 'Label 1',
    //                 type: TimelineChartType.INTERVAL,
    //                 from: new Date([2015, 1, 15]),
    //                 to: new Date([2015, 3, 1])
    //             }, {
    //                 label: 'Label 2',
    //                 type: TimelineChartType.INTERVAL,
    //                 from: new Date([2015, 4, 1]),
    //                 to: new Date([2015, 5, 12])
    //             }]
    //         }]
    //     };
    // }

    // d3ChartCreate(el, props, state) {
    //     // let svg = d3.select(el).append('svg')
    //     //     .attr('class', 'd3')
    //     //     .attr('width', props.width)
    //     //     .attr('height', props.height);

    //     // svg.append('g')
    //     //     .attr('class', 'timeline-chart');

    //     this.d3ChartUpdate(el, state);
    //     document.body.onresize = () => {
    //         // this.d3ChartUpdate(el, state)
    //     };
    // }
    // d3ChartUpdate(el, state) {
    //     console.log("EL", el)
    //     let allElements = state.data.reduce((agg, e) => agg.concat(e.data), []);
    //     let minDt = d3.min(allElements, this.getPointMinDt);
    //     let maxDt = d3.max(allElements, this.getPointMaxDt);

    //     // let elementWidth = el.clientWidth || 200;
    //     // let elementHeight = el.clientHeight || 800;

    //     let elementWidth = 500;
    //     let elementHeight = 200;

    //     let margin = {
    //         top: 0,
    //         right: 0,
    //         bottom: 20,
    //         left: 0
    //     };

    //     let width = elementWidth - margin.left - margin.right;
    //     let height = elementHeight - margin.top - margin.bottom;

    //     let groupWidth = 100;

    //     let x = d3.time.scale()
    //         .domain([minDt, maxDt])
    //         .range([groupWidth, width]);

    //     let xAxis = d3.svg.axis()
    //         .scale(x)
    //         .orient('bottom')
    //         .tickSize(-height);


    //     let zoom = d3.behavior.zoom()
    //         .x(x)
    //         .on('zoom', () => {
    //             console.log("zoom");
    //             zoomed()
    //         });

    //     let svg = d3.select(el).append('svg')
    //         .attr('class', 'timeline-chart')
    //         .attr('width', width + margin.left + margin.right)
    //         .attr('height', height + margin.top + margin.bottom)
    //         .append('g')
    //         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    //         .call(zoom);

    //     svg.append('defs')
    //         .append('clipPath')
    //         .attr('id', 'chart-content')
    //         .append('rect')
    //         .attr('x', groupWidth)
    //         .attr('y', 0)
    //         .attr('height', height)
    //         .attr('width', width - groupWidth);

    //     svg.append('rect')
    //         .attr('class', 'chart-bounds')
    //         .attr('x', groupWidth)
    //         .attr('y', 0)
    //         .attr('height', height)
    //         .attr('width', width - groupWidth);

    //     svg.append('g')
    //         .attr('class', 'x axis')
    //         .attr('transform', 'translate(0,' + height + ')')
    //         .call(xAxis);

    //     let groupHeight = height / state.data.length;
    //     let groupSection = svg.selectAll('.group-section')
    //         .data(state.data)
    //         .enter()
    //         .append('line')
    //         .attr('class', 'group-section')
    //         .attr('x1', 0)
    //         .attr('x2', width)
    //         .attr('y1', (d, i) => {
    //             return groupHeight * (i + 1);
    //         })
    //         .attr('y2', (d, i) => {
    //             return groupHeight * (i + 1);
    //         });

    //     let groupLabels = svg.selectAll('.group-label')
    //         .data(state.data)
    //         .enter()
    //         .append('text')
    //         .attr('class', 'group-label')
    //         .attr('x', 0)
    //         .attr('y', (d, i) => {
    //             return (groupHeight * i) + (groupHeight / 2) + 5.5;
    //         })
    //         .attr('dx', '0.5em')
    //         .text(d => d.label);

    //     let lineSection = svg.append('line').attr('x1', groupWidth).attr('x2', groupWidth).attr('y1', 0).attr('y2', height).attr('stroke', 'black');

    //     let groupIntervalItems = svg.selectAll('.group-interval-item')
    //         .data(state.data)
    //         .enter()
    //         .append('g')
    //         .attr('clip-path', 'url(#chart-content)')
    //         .attr('class', 'item')
    //         .attr('transform', (d, i) => `translate(0, ${groupHeight * i})`)
    //         .selectAll('.dot')
    //         .data(d => d.data.filter(_ => _.type === TimelineChartType.INTERVAL))
    //         .enter();

    //     let intervalBarHeight = 0.8 * groupHeight;
    //     let intervalBarMargin = (groupHeight - intervalBarHeight) / 2;
    //     let intervalMinWidth = 8;
    //     let intervals = groupIntervalItems
    //         .append('rect')
    //         .attr('class', this.withCustom('interval'))
    //         .attr('width', (d) => Math.max(intervalMinWidth, x(d.to) - x(d.from)))
    //         .attr('height', intervalBarHeight)
    //         .attr('y', intervalBarMargin)
    //         .attr('x', (d) => x(d.from));

    //     let intervalTexts = groupIntervalItems
    //         .append('text')
    //         .text(d => d.label)
    //         .attr('fill', 'white')
    //         .attr('class', this.withCustom('interval-text'))
    //         .attr('y', (groupHeight / 2) + 5)
    //         .attr('x', (d) => x(d.from));

    //     let groupDotItems = svg.selectAll('.group-dot-item')
    //         .data(state.data)
    //         .enter()
    //         .append('g')
    //         .attr('clip-path', 'url(#chart-content)')
    //         .attr('class', 'item')
    //         .attr('transform', (d, i) => `translate(0, ${groupHeight * i})`)
    //         .selectAll('.dot')
    //         .data(d => {
    //             return d.data.filter(_ => _.type === TimelineChartType.POINT);
    //         })
    //         .enter();

    //     let dots = groupDotItems
    //         .append('circle')
    //         .attr('class', this.withCustom('dot'))
    //         .attr('cx', d => x(d.at))
    //         .attr('cy', groupHeight / 2)
    //         .attr('r', 5);

    //     let getTextPositionData = function(d) {
    //         this.textSizeInPx = this.textSizeInPx || this.getComputedTextLength();
    //         let from = x(d.from);
    //         let to = x(d.to);
    //         return {
    //             xPosition: from,
    //             upToPosition: to,
    //             width: to - from,
    //             textWidth: this.textSizeInPx
    //         };
    //     };

    //     let zoomed = function() {
    //         console.log("I AM ZOOMED");
    //         let intervalMinWidth = 8;
    //         let textTruncateThreshold = 30;
    //         if (self.onVizChangeFn && d3.event) {
    //             self.onVizChangeFn.call(self, {
    //                 scale: d3.event.scale,
    //                 translate: d3.event.translate,
    //                 domain: x.domain()
    //             });
    //         }

    //         svg.select('.x.axis').call(xAxis);

    //         svg.selectAll('circle.dot').attr('cx', d => x(d.at));
    //         svg.selectAll('rect.interval').attr('x', d => x(d.from)).attr('width', d => Math.max(intervalMinWidth, x(d.to) - x(d.from)));

    //         svg.selectAll('.interval-text').attr('x', function(d) {
    //                 let positionData = getTextPositionData.call(this, d);
    //                 if ((positionData.upToPosition - groupWidth - 10) < positionData.textWidth) {
    //                     return positionData.upToPosition;
    //                 } else if (positionData.xPosition < groupWidth && positionData.upToPosition > groupWidth) {
    //                     return groupWidth;
    //                 }
    //                 return positionData.xPosition;
    //             }).attr('text-anchor', function(d) {
    //                 let positionData = getTextPositionData.call(this, d);
    //                 if ((positionData.upToPosition - groupWidth - 10) < positionData.textWidth) {
    //                     return 'end';
    //                 }
    //                 return 'start';
    //             })
    //             .attr('dx', function(d) {
    //                 let positionData = getTextPositionData.call(this, d);
    //                 if ((positionData.upToPosition - groupWidth - 10) < positionData.textWidth) {
    //                     return '-0.5em';
    //                 }
    //                 return '0.5em';
    //             }).text(function(d) {
    //                 let positionData = getTextPositionData.call(this, d);
    //                 let percent = (positionData.width - textTruncateThreshold) / positionData.textWidth;
    //                 if (percent < 1) {
    //                     if (positionData.width > textTruncateThreshold) {
    //                         return d.label.substr(0, Math.floor(d.label.length * percent)) + '...';
    //                     } else {
    //                         return '';
    //                     }
    //                 }

    //                 return d.label;
    //             })
    //     }

    //     // Call zoomed
    //     zoomed();
    // }

    // withCustom(defaultClass) {
    //     return d => d.customClass ? [d.customClass, defaultClass].join(' ') : defaultClass
    // }

    // getPointMinDt(p) {
    //     return p.type === TimelineChartType.POINT ? p.at : p.from;
    // }
    // getPointMaxDt(p) {
    //     return p.type === TimelineChartType.POINT ? p.at : p.to;
    // }

    // d3ChartDestroy(el) {
    //     // Any clean-up would go here
    //     // in this example there is nothing to do
    // }

    // d3Chart_drawPoints(el, scales, data) {
    //     // let g = d3.select(el).selectAll('.d3-points');

    //     // let point = g.selectAll('.d3-point')
    //     //     .data(data, function(d) {
    //     //         return d.id;
    //     //     });

    //     // // ENTER
    //     // point.enter().append('circle')
    //     //     .attr('class', 'd3-point');

    //     // // ENTER & UPDATE
    //     // point.attr('cx', function(d) {
    //     //         return scales.x(d.x);
    //     //     })
    //     //     .attr('cy', function(d) {
    //     //         return scales.y(d.y);
    //     //     })
    //     //     .attr('r', function(d) {
    //     //         return scales.z(d.z);
    //     //     });

    //     // // EXIT
    //     // point.exit()
    //     //     .remove();
    // }

    render() {
        console.log("RENDER")
        // let allElements = state.data.reduce((agg, e) => agg.concat(e.data), []);
        // let minDt = d3.min(allElements, this.getPointMinDt);
        // let maxDt = d3.max(allElements, this.getPointMaxDt);


        let groupSections = DATA && DATA.map((x) => {
            return (<line key={x.label} data={x} className="group-section" />)
        })
        let groupLabels = DATA && DATA.map((x) => {
            return (<text key={x.label} data={x} className="group-label">{x.label}</text>)
        })

        let groupIntervalItems = DATA && DATA.filter((y) => {
            return y.data.filter(z => z.type === TimelineChartType.INTERVAL);
        }).map((x) => {
            return (<g className="group-interval-item" key={Math.random()}>
                        {
                            x.data.map((y) => {
                                let width = Math.max(intervalMinWidth, xFn(y.to) - xFn(y.from));
                                let xAttr = xFn(y.from);
                                return (
                                    <g key={y.label}>
                                        <rect className="interval" width={width} x={xAttr} key={y.label+"interval"}></rect>
                                        <text className="interval-text" key={y.label+"text"}>{y.label}</text>
                                    </g>
                                    )
                            })
                        }
                    </g>)
                // return x.data.map()
                // console.log(x, x.label)
                // return (<g className="group-interval-item">
                //             <rect className="interval" key={x.data.label} data={x.data}></rect>
                //             <text className="interval-text" key={x.data.label} data={x.data}></text>
                //         </g>)
        })


        return (
            <svg id="dateSlider">
                    <g>
                        <defs>
                            <clippath id="chart-content">
                                <rect></rect>
                                <g></g>
                            </clippath>
                        </defs>
                        <rect id="chart-bounds"></rect>
                        <g id="x-axis"></g>
                        {groupSections}
                        {groupLabels}
                        <line className="group-content-divider"></line>
                        {groupIntervalItems}
                    </g>
                </svg>
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
