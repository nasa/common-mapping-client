import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import * as appConfig from '../../constants/appConfig';
import * as DateSliderActions from '../../actions/DateSliderActions';
import TimeAxisD3 from '../../utils/TimeAxisD3';
import MiscUtil from '../../utils/MiscUtil';
import SingleDate from './SingleDate';

export class TimeAxis extends Component {
    componentDidMount() {
        let sizes = this.getSizes();

        // get D3 wrapper
        this.timeAxisD3 = new TimeAxisD3({
            selectNode: ReactDOM.findDOMNode(this),
            minDt: appConfig.MIN_DATE,
            maxDt: appConfig.MAX_DATE,
            elementWidth: sizes.elementWidth,
            elementHeight: sizes.elementHeight,
            margin: sizes.margin,
            onClick: (value) => { this.handleSingleDateDragEnd(value); },
            onHover: (value) => { this.handleTimelineHover(value); },
            onMouseOut: () => { this.handleTimeLineMouseOut(); }
        });

        // get it going
        this.timeAxisD3.enter();

        window.addEventListener("resize", () => {
            this.timeAxisD3.resize(this.getSizes());
        });
    }
    componentDidUpdate() {
        this.timeAxisD3.update();
    }
    handleTimeLineMouseOut() {
        this.props.actions.timelineMouseOut();
    }
    handleTimelineHover(xValue) {
        let date = this.timeAxisD3.invert(xValue);
        this.props.actions.hoverDate(date, xValue);
    }
    handleSingleDateDragEnd(value) {
        let newDate = this.timeAxisD3.invert(value);
        this.props.actions.dragEnd(newDate);
    }
    autoScroll(toLeft) {
        this.timeAxisD3.autoScroll(toLeft);
    }
    getSizes() {
        // IMPORTANT: these sizes seem to have to be hardcoded
        // cannot pull from CSS as components are not mounted yet
        let elementWidth = window.innerWidth;
        let elementHeight = 60;
        let margin = {
            top: 0,
            right: 100,
            bottom: 25,
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
                    onDrag={(x, scrollFlag) => {
                        clearInterval(autoScrollInterval);
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
                    maxX={sizes.margin.left + sizes.width}
                    minX={sizes.margin.left}
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
