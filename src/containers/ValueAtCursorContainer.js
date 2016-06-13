import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export class ValueAtCursorContainer extends Component {
    render() {
        let maxLeft = window.innerWidth - 150;
        let maxTop = window.innerHeight;

        let top = parseInt(this.props.pixelCoordinate.get("y"));
        let left = parseInt(this.props.pixelCoordinate.get("x")) + 50;

        if(left > maxLeft) {
            left = parseInt(this.props.pixelCoordinate.get("x")) - 150;
        }

        let style = { top, left }
        return (
            <div id="valueAtCursorContainer" className={this.props.pixelCoordinate.get("isValid") ? "" : "hidden"} style={style}>
                {this.props.pixelCoordinate.get("x") + " " + this.props.pixelCoordinate.get("y")}
            </div>
        );
    }
}

ValueAtCursorContainer.propTypes = {
    pixelCoordinate: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        pixelCoordinate: state.map.getIn(["view", "pixelHoverCoordinate"])
    };
}

export default connect(
    mapStateToProps,
    null
)(ValueAtCursorContainer);
