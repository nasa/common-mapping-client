import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import d3 from 'd3';
import * as DateSliderActions from '../../actions/DateSliderActions';
import SingleDateD3 from '../../utils/SingleDateD3';
import MiscUtil from '../../utils/MiscUtil';

export class SingleDate extends Component {
    componentDidMount() {
        // get D3 wrapper
        this.singleDateD3 = new SingleDateD3({
            selectNode: ReactDOM.findDOMNode(this),
            defaultWidth: 12,
            activeWidth: 7,
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
            singleDate: true,
            dragging: this.props.isDragging
        });
        return (
            // <g><path d="M150 0 L75 200 L225 200 Z" /></g>
            <path className={classNames} d="M 7.3151,0.7426 C 3.5507,0.7426 0.5,3.7926 0.5,7.5553 l 0,21.2724 14.6038,15.7112 14.6039,15.7111 14.6038,-15.7111 14.6037,-15.7112 0,-21.2724 c 0,-3.7627 -3.051,-6.8127 -6.8151,-6.8127 l -44.785,0 z"/>
            // <rect className={classNames}></rect>
        );
    }
}
SingleDate.propTypes = {
    date: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    isDragging: PropTypes.bool,
    onDrag: PropTypes.func,
    beforeDrag: PropTypes.func,
    afterDrag: PropTypes.func,
    maxX: PropTypes.number,
    minX: PropTypes.number
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(DateSliderActions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(SingleDate);
