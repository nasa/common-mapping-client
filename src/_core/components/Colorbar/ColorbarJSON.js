/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MiscUtil from "_core/utils/MiscUtil";

const CANVAS_WIDTH = 255;
const CANVAS_HEIGHT = 12;

export class ColorbarJSON extends Component {
    componentDidMount() {
        this.draw();
    }

    componentDidUpdate(nextProps, nextState) {
        this.draw();
    }

    draw() {
        if (this.props.palette) {
            let canvas = this.canvasNode;
            let ctx = canvas.getContext("2d");
            let paletteValues = this.props.palette.get("values");
            let numValues = paletteValues.size;

            let width = typeof this.props.width !== "undefined" ? this.props.width : CANVAS_WIDTH;
            let height =
                typeof this.props.height !== "undefined" ? this.props.height : CANVAS_HEIGHT;
            let binWidth = width / numValues;
            let drawWidth = Math.ceil(binWidth);
            for (let i = 0; i < width; ++i) {
                let valueIndex = Math.min(i, numValues - 1);
                let valueEntry = paletteValues.get(valueIndex);
                let color = valueEntry.get("color");
                ctx.fillStyle = color;
                ctx.fillRect(Math.floor(binWidth * i), 0, drawWidth, height);
            }
        }
    }

    render() {
        let width = typeof this.props.width !== "undefined" ? this.props.width : CANVAS_WIDTH;
        let height = typeof this.props.height !== "undefined" ? this.props.height : CANVAS_HEIGHT;

        let containerClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <canvas
                ref={node => (this.canvasNode = node)}
                className={containerClasses}
                width={width}
                height={height}
            />
        );
    }
}

ColorbarJSON.propTypes = {
    palette: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string
};

export default connect()(ColorbarJSON);
