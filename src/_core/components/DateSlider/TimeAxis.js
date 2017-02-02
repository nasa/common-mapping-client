import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import appConfig from 'constants/appConfig';
import * as DateSliderActions from '_core/actions/DateSliderActions';
import * as MapActions from '_core/actions/MapActions';
import TimeAxisD3 from '_core/utils/TimeAxisD3';
import MiscUtil from '_core/utils/MiscUtil';
import CurrentDate from '_core/components/DateSlider/CurrentDate';

const miscUtil = new MiscUtil();

export class TimeAxis extends Component {
    componentDidMount() {
        let sizes = this.getSizes();
        this.resizeTimeout = null;

        // get D3 wrapper
        this.timeAxisD3 = new TimeAxisD3({
            selectNode: ReactDOM.findDOMNode(this),
            minDt: appConfig.MIN_DATE,
            maxDt: appConfig.MAX_DATE,
            elementWidth: sizes.elementWidth,
            elementHeight: sizes.elementHeight,
            margin: sizes.margin,
            symbolWidth: 0,
            onClick: (x, date) => { this.handleSingleDateDragUpdate(x, date); },
            onHover: (x, date) => { this.handleTimelineHover(x, date); },
            onMouseOut: () => { this.handleTimeLineMouseOut(); }
        });

        // get it going
        this.timeAxisD3.enter({
            date: this.props.date,
            scale: this.props.resolution.toJS()
        });

        window.addEventListener("resize", () => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(() => {
                let options = this.getSizes();
                options.date = this.props.date;
                options.scale = this.props.resolution.toJS();
                this.timeAxisD3.resize(options);
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = null;
            }, 50);
        });
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.date !== this.props.date ||
            nextProps.resolution !== this.props.resolution) {
            this.timeAxisD3.update({
                date: nextProps.date,
                scale: nextProps.resolution !== this.props.resolution ? nextProps.resolution.toJS() : undefined
            });
        }

        return nextProps.isDragging !== this.props.isDragging;
    }
    handleTimeLineMouseOut() {
        this.props.dateSliderActions.timelineMouseOut();
    }
     handleTimelineHover(xValue, date) {
        if (!this.props.isDragging) {
            // let date = this.timeAxisD3.getDateFromX(xValue);
            this.props.dateSliderActions.hoverDate(date, xValue);
        }
    }
    handleSingleDateDragStart() {
        this.props.dateSliderActions.beginDragging();
    }
    handleSingleDateDragEnd(xValue) {
        let date = this.timeAxisD3.getDateFromX(xValue);
        this.props.dateSliderActions.dragEnd(date);
    }
    handleSingleDateDragUpdate(xValue, date) {
        // let date = this.timeAxisD3.getDateFromX(xValue);
        this.props.dateSliderActions.hoverDate(date, xValue);
        if(date - this.props.date !== 0) {
            this.props.mapActions.setDate(date);
        }
    }
    autoScroll(toLeft) {
        this.timeAxisD3.autoScroll(toLeft);
    }
    getSizes() {
        // IMPORTANT: these sizes seem to have to be hardcoded
        // cannot pull from CSS as components are not mounted yet
        let elementWidth = window.innerWidth;
        let elementHeight = 50;
        let margin = {
            top: 0,
            right: 60,
            bottom: 18,
            left: 200 // there is a bug where auto-scrolling breaks to the left with left == 0, so keep it >= 1
        };

        let width = elementWidth - (margin.left + margin.right);
        let height = elementHeight - (margin.top + margin.bottom);

        return {
            elementWidth,
            elementHeight,
            width,
            height,
            margin
        };
    }
    render() {
        let autoScrollInterval = null;
        let sizes = this.getSizes();
        let axisClassNames = miscUtil.generateStringFromSet({
            timeAxis: true,
            dragging: this.props.isDragging
        });
        return (
            <g className={axisClassNames}>
                <clipPath id="chart-content">
                    <rect />
                </clipPath>
                <rect id="chart-bounds" />
                <g id="x-axis" />
                <line className="timeline-horiz-axis" y1="14" y2="14" />
                <CurrentDate
                    active={true}
                    beforeDrag={() => {
                        clearInterval(autoScrollInterval);
                        this.handleSingleDateDragStart();
                    }} 
                    onDrag={(x, date, scrollFlag) => {
                        clearInterval(autoScrollInterval);

                        this.handleSingleDateDragUpdate(x, date);

                        // handle auto-scrolling
                        if(scrollFlag > 0) {
                            autoScrollInterval = setInterval(() => {
                                this.autoScroll(true);
                            }, 50);
                        } else if(scrollFlag < 0) {
                            autoScrollInterval = setInterval(() => {
                                this.autoScroll(false);
                            }, 50);
                        }
                    }}
                    afterDrag={(value) => {
                        clearInterval(autoScrollInterval);
                        this.handleSingleDateDragEnd(value);
                    }}
                    getDateFromX={(x) => typeof this.timeAxisD3 !== "undefined" ? this.timeAxisD3.getDateFromX(x) : 0}
                    getXFromDate={(date) => typeof this.timeAxisD3 !== "undefined" ? this.timeAxisD3.getXFromDate(date) : 0}
                    maxX={sizes.margin.left + sizes.width}
                    minX={sizes.margin.left}
                />
            </g>
        );
    }
}
TimeAxis.propTypes = {
    date: PropTypes.object.isRequired,
    mapActions: PropTypes.object.isRequired,
    dateSliderActions: PropTypes.object.isRequired,
    isDragging: PropTypes.bool.isRequired,
    resolution: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date"),
        isDragging: state.dateSlider.get("isDragging"),
        resolution: state.dateSlider.get("resolution")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(MapActions, dispatch),
        dateSliderActions: bindActionCreators(DateSliderActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeAxis);
