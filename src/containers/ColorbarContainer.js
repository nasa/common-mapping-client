import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/LayerActions';

export class ColorbarContainer extends Component {
    componentDidMount() {
        this.draw();
    }
    componentDidUpdate(nextProps, nextState) {
        this.draw();
    }

    draw() {
        let canvas = this.refs.canvas;
        let ctx = canvas.getContext('2d');

        let my_gradient = ctx.createLinearGradient(0, 0, 255, 0);
        my_gradient.addColorStop(0, "purple");
        my_gradient.addColorStop(0.25, "blue");
        my_gradient.addColorStop(0.5, "green");
        my_gradient.addColorStop(0.75, "yellow");
        my_gradient.addColorStop(1, "red");
        ctx.fillStyle = my_gradient;
        ctx.fillRect(0, 0, 255, 12);
    }
    render() {
        return (
            <div className="colorbar-container">
                <canvas ref="canvas" width="255" height="12" className="colorbar-canvas"></canvas>
            </div>
        );
    }
}

ColorbarContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(ColorbarContainer);
