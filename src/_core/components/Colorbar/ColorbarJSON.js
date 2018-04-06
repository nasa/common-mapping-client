/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import MiscUtil from "_core/utils/MiscUtil";
import * as appStrings from "_core/constants/appStrings";
import styles from "_core/components/Colorbar/Colorbar.scss";

const CANVAS_WIDTH = 255;
const CANVAS_HEIGHT = 12;

export class ColorbarJSON extends Component {
    constructor(props) {
        super(props);

        this.listenersInitialized = false;
    }

    componentDidMount() {
        this.draw();

        this.initListeners();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.palette !== this.props.palette) {
            this.draw();
            this.initListeners();
        }
    }

    initListeners() {
        if (!this.listenersInitialized && this.props.palette && this.props.onMouseOver) {
            // add the mouse over listener
            let canvas = this.canvasNode;
            canvas.addEventListener("mousemove", evt => {
                let val = this.getValueFromX(evt.clientX);
                if (val) {
                    this.props.onMouseOver(val);
                }
            });

            if (this.props.onMouseOut) {
                canvas.addEventListener("mouseout", evt => {
                    this.props.onMouseOut();
                });
            }

            this.listenersInitialized = true;
        }
    }

    getValueFromX(x) {
        let canvas = this.canvasNode;
        let canvasDim = canvas.getBoundingClientRect();
        let canvasX = canvasDim.left;
        x = x - canvasX;
        let min = 0;
        let max = CANVAS_WIDTH - 1;
        if (x >= min && x <= max) {
            let listSize = this.props.palette.get("values").size;
            let offsetPercent = x / CANVAS_WIDTH;
            let offset = Math.min(Math.floor(offsetPercent * listSize), listSize - 1);
            let value = this.props.palette.getIn(["values", offset]);
            let val = value.get("value");
            let colorStr = value.get("color");

            val = this.scaleValue(val, true);
            return { offset: offset, color: colorStr, value: val };
        }
        return false;
    }

    scaleValue(val, format = false) {
        if (this.props.handleAs === appStrings.COLORBAR_JSON_RELATIVE) {
            val = parseFloat(val);
            let min = parseFloat(this.props.min) || 0;
            let max = parseFloat(this.props.max) || 0;
            val = min + (max - min) * val;
            if (format) {
                val = val.toFixed(2);
            }
        }
        return val;
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
            [styles.hoverCross]: typeof this.props.onMouseOver !== "undefined",
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
    handleAs: PropTypes.string,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    className: PropTypes.string
};

export default ColorbarJSON;
