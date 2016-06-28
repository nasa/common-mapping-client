import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import d3 from 'd3';
import * as DateSliderActions from '../../actions/DateSliderActions';
import MiscUtil from '../../utils/MiscUtil';

let defaultWidth = 12;
let activeWidth = 7;
let SingleDateD3 = {};

SingleDateD3.enter = (selection) => {
    selection.call(SingleDateD3.update);
};

SingleDateD3.update = (selection) => {
    selection
        .attr('width', (d) => {
            return d.isDragging ? activeWidth : defaultWidth;
        })
        .attr('transform', (d) => {
            return !d.isDragging ? 'translate(' + (-1 * activeWidth / 2) + ',' + 0 + ')' : '';
        });
};

SingleDateD3.drag = (selection, beforeDrag, onDrag, afterDrag, maxX, minX) => {
    maxX = maxX - (2 * activeWidth);
    minX = minX + (2 * activeWidth);
    let drag = d3.behavior.drag()
        .on('dragstart', () => {
            d3.event.sourceEvent.stopPropagation();
            selection.transition()
                .duration(150)
                .style('opacity', 0.5);
            beforeDrag();
        })
        .on('drag', () => {
            if (d3.event.x > maxX) {
                selection.attr('x', (d) => maxX);
            } else if (d3.event.x < minX) {
                selection.attr('x', (d) => minX);
            } else {
                selection.attr('x', (d) => d3.event.x);
            }
            onDrag(d3.event.x, d3.event.y);
        })
        .on('dragend', () => {
            selection.transition()
                .duration(150)
                .style('opacity', 1);
            afterDrag(selection.attr('x'));
        });
    selection.call(drag);
};

export class SingleDate extends Component {
    componentDidMount() {
        let data = {
            date: this.props.date,
            isDragging: this.props.isDragging
        };
        // wrap element in d3
        this.d3Node = d3.select(ReactDOM.findDOMNode(this));
        this.d3Node.datum(data)
            .call(SingleDateD3.drag,
                this.props.beforeDrag,
                this.props.onDrag,
                this.props.afterDrag,
                this.props.maxX,
                this.props.minX)
            .call(SingleDateD3.enter);
    }
    componentDidUpdate() {
        let data = {
            date: this.props.date,
            isDragging: this.props.isDragging
        };
        this.d3Node.datum(data)
            .call(SingleDateD3.update);
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
    isDragging: PropTypes.bool.isRequired,
    onDrag: PropTypes.func.isRequired,
    beforeDrag: PropTypes.func.isRequired,
    afterDrag: PropTypes.func.isRequired,
    maxX: PropTypes.number.isRequired,
    minX: PropTypes.number.isRequired
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
)(SingleDate);
