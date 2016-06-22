import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import d3 from 'd3';

let SingleDateD3 = {};

SingleDateD3.enter = (selection) => {
    selection
        .attr()
        // .attr()

    selection.call(SingleDateD3.update)
}

SingleDateD3.update = (selection) => {
    selection
    // .transition()
}

SingleDateD3.exit = () => {

}


export class SingleDate extends Component {
    componentDidMount() {
        // wrap element in d3
        this.d3Node = d3.select(ReactDOM.findDOMNode(this));
        this.d3Node.datum(this.props.date)
            .call(SingleDateD3.enter);
    }
    shouldComponentUpdate(nextProps) {
        console.log("next props", nextProps);
        // if (stuff) {
        //     this.d3Node.datum(nextProps.data)
        //         .call(SingleDate.update)
        //     return false;
        // }
        return true;
    }
    componentDidUpdate() {
        this.d3Node.datum(this.props.date)
            .call(SingleDateD3.update);
    }
    componentWillUnmount() {

    }
    render() {
        return (
            <rect className="singleDate">{this.props.date.toString()}</rect>
        )
    }
}
SingleDate.propTypes = {
    date: PropTypes.object.isRequired
};



export default connect()(SingleDate);
