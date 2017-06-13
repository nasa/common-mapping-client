import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import appConfig from 'constants/appConfig';
import * as DateSliderActions from '_core/actions/DateSliderActions';
import * as MapActions from '_core/actions/MapActions';
import * as appStrings from '_core/constants/appStrings';
import TimeAxisD3 from '_core/utils/TimeAxisD3';
import MiscUtil from '_core/utils/MiscUtil';
import CurrentDate from '_core/components/DateSlider/CurrentDate';

const miscUtil = new MiscUtil();

export class TimeAxis extends Component {
    constructor(options) {
        super(options);
        this.autoScrollInterval = null;
    }

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
            date = this.getMaskedDate(this.props.date, date);
            this.props.dateSliderActions.hoverDate(date, xValue);
        }
    }
    handleSingleDateDragStart() {
        this.props.dateSliderActions.beginDragging();
    }
    handleSingleDateDragEnd(xValue) {
        let date = this.timeAxisD3.getNearestDate(xValue);
        date = this.getMaskedDate(this.props.date, date);
        this.props.dateSliderActions.dragEnd(date);
    }
    handleSingleDateDragUpdate(xValue, date) {
        date = this.getMaskedDate(this.props.date, date);
        this.props.dateSliderActions.hoverDate(date, xValue);
        if (date - this.props.date !== 0) {
            this.props.mapActions.setDate(date);
        }
    }
    getMaskedDate(date, maskDate) {
        let resolution = this.timeAxisD3.getTickResolution();
        date = moment(date);
        maskDate = moment(maskDate);
        switch(resolution) {
            case appStrings.SECONDS:
                date.second(maskDate.second());
                // falls through
            case appStrings.MINUTES:
                date.minute(maskDate.minute());
                // falls through
            case appStrings.HOURS:
                date.hour(maskDate.hour());
                // falls through
            case appStrings.DAYS:
                date.date(maskDate.date());
                // falls through
            case appStrings.MONTHS:
                date.month(maskDate.month());
                // falls through
            case appStrings.YEARS:
                date.year(maskDate.year());
                break;
            default:
                console.warn("Error in TimeAxis.getMaskedDate: unknown date resolution. ", resolution);
        }
        return date.toDate();
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
            right: 70,
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
                <line className="timeline-horiz-axis" y1="14" y2="14" />
                <g id="x-axis" />
                <CurrentDate
                    active={true}
                    beforeDrag={() => {
                        clearInterval(this.autoScrollInterval);
                        this.handleSingleDateDragStart();
                    }} 
                    onDrag={(x, date, scrollFlag) => {
                        clearInterval(this.autoScrollInterval);

                        this.handleSingleDateDragUpdate(x, date);

                        // handle auto-scrolling
                        if(scrollFlag > 0) {
                            this.autoScrollInterval = setInterval(() => {
                                this.autoScroll(true);
                            }, 50);
                        } else if(scrollFlag < 0) {
                            this.autoScrollInterval = setInterval(() => {
                                this.autoScroll(false);
                            }, 50);
                        }
                    }}
                    afterDrag={(value) => {
                        clearInterval(this.autoScrollInterval);
                        this.handleSingleDateDragEnd(value);
                    }}
                    getNearestDate={(x) => typeof this.timeAxisD3 !== "undefined" ? this.timeAxisD3.getNearestDate(x) : 0}
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
