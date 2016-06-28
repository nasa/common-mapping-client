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

export class TimeAxis extends Component {
    componentDidMount() {
        // get TimeAxisD3 object
        this.timeAxisD3 = new TimeAxisD3({
            selectNode: ReactDOM.findDOMNode(this),
            minDt: minDt,
            maxDt: maxDt,
            elementWidth: elementWidth,
            elementHeight: elementHeight,
            margin: margin,
            onClick: (value) => { this.handleSingleDateDragEnd(value); }
        });

        // get it going
        this.timeAxisD3.enter();

        window.addEventListener("resize", () => {
            this.timeAxisD3.resize({
                elementWidth: window.innerWidth,
                elementHeight: elementHeight
            });
        });
    }
    componentDidUpdate() {
        this.timeAxisD3.update();
    }

    handleSingleDateDragEnd(value) {
        let newDate = this.timeAxisD3.invert(value);
        this.props.actions.dragEnd(newDate);
    }
    autoScroll(toLeft) {
        this.timeAxisD3.autoScroll(toLeft);
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
