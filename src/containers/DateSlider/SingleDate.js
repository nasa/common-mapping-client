import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import d3 from 'd3';
import SingleDateD3 from '../../utils/SingleDateD3';
import MiscUtil from '../../utils/MiscUtil';

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
            afterDrag: this.props.afterDrag
        });

        // get it going
        this.singleDateD3.enter({
            date: this.props.date,
            isDragging: this.props.isDragging
        });
    }
    shouldComponentUpdate(nextProps) {
        return (nextProps.date !== this.props.date &&
                !nextProps.isDragging) ||
            nextProps.isDragging !== this.props.isDragging ||
            nextProps.maxX !== this.props.maxX ||
            nextProps.minX !== this.props.minX;
    }
    componentDidUpdate() {
        this.singleDateD3.update({
            date: this.props.date,
            isDragging: this.props.isDragging,
            maxX: this.props.maxX,
            minX: this.props.minX
        });
    }
    render() {
        let classNames = MiscUtil.generateStringFromSet({
            "single-date": true,
            dragging: this.props.isDragging
        });
        return (
            <g className={classNames}>
                <circle className="single-date-inner" cx="0" cy="15" r="8" filter="url(#dropshadowFilter)"/>
            </g>
        );
    }
}
SingleDate.propTypes = {
    date: PropTypes.object.isRequired,
    isDragging: PropTypes.bool,
    onDrag: PropTypes.func,
    beforeDrag: PropTypes.func,
    afterDrag: PropTypes.func,
    maxX: PropTypes.number,
    minX: PropTypes.number
};

export default connect()(SingleDate);
