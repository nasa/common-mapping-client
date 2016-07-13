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
            <rect className={classNames}></rect>
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
