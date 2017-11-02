import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import d3 from "d3";
import SingleDateD3 from "_core/utils/SingleDateD3";
import MiscUtil from "_core/utils/MiscUtil";

const miscUtil = new MiscUtil();

export class SingleDate extends Component {
    componentDidMount() {
        // get D3 wrapper
        this.singleDateD3 = new SingleDateD3({
            selectNode: ReactDOM.findDOMNode(this),
            symbolWidth: 16,
            symbolWidthLarge: 26,
            maxX: this.props.maxX,
            minX: this.props.minX,
            beforeDrag: this.props.beforeDrag,
            onDrag: this.props.onDrag,
            afterDrag: this.props.afterDrag,
            getNearestDate: this.props.getNearestDate,
            getXFromDate: this.props.getXFromDate
        });

        // get it going
        this.singleDateD3.enter({
            date: this.props.date,
            isDragging: this.props.isDragging
        });
    }
    shouldComponentUpdate(nextProps) {
        // update the d3 component
        if (
            (nextProps.date !== this.props.date && !nextProps.isDragging) ||
            nextProps.isDragging !== this.props.isDragging ||
            nextProps.maxX !== this.props.maxX ||
            nextProps.minX !== this.props.minX
        ) {
            this.singleDateD3.update({
                date: nextProps.date,
                isDragging: nextProps.isDragging,
                maxX: nextProps.maxX,
                minX: nextProps.minX
            });
        }
        return (
            nextProps.isDragging !== this.props.isDragging || nextProps.active !== this.props.active
        );
    }
    render() {
        let classNames = miscUtil.generateStringFromSet({
            "single-date": true,
            dragging: this.props.isDragging,
            hidden: !this.props.active
        });
        return (
            <g className={classNames}>
                <circle
                    className="single-date-inner"
                    cx="0"
                    cy="15"
                    r="8"
                    filter="url('#dropshadowFilter')"
                />
            </g>
        );
    }
}
SingleDate.propTypes = {
    active: PropTypes.bool.isRequired,
    date: PropTypes.object.isRequired,
    getNearestDate: PropTypes.func.isRequired,
    getXFromDate: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    onDrag: PropTypes.func,
    beforeDrag: PropTypes.func,
    afterDrag: PropTypes.func,
    maxX: PropTypes.number,
    minX: PropTypes.number
};

export default connect()(SingleDate);
