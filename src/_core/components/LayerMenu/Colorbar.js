import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MiscUtil from "_core/utils/MiscUtil";
import * as actions from "_core/actions/LayerActions";
import * as appStrings from "_core/constants/appStrings";

const CANVAS_WIDTH = 255;
const CANVAS_HEIGHT = 12;

const miscUtil = new MiscUtil();

export class Colorbar extends Component {
    componentDidMount() {
        if (
            this.props.handleAs === appStrings.COLORBAR_JSON_FIXED ||
            this.props.handleAs === appStrings.COLORBAR_JSON_RELATIVE
        ) {
            this.draw();
        }
    }

    componentDidUpdate(nextProps, nextState) {
        if (
            this.props.handleAs === appStrings.COLORBAR_JSON_FIXED ||
            this.props.handleAs === appStrings.COLORBAR_JSON_RELATIVE
        ) {
            this.draw();
        }
    }

    draw() {
        if (this.props.palette) {
            let canvas = this.refs.canvas;
            let ctx = canvas.getContext("2d");
            let paletteValues = this.props.palette.get("values");
            let numValues = paletteValues.size;

            let binWidth = CANVAS_WIDTH / numValues;
            let drawWidth = Math.ceil(binWidth);
            for (let i = 0; i < CANVAS_WIDTH; ++i) {
                let valueIndex = Math.min(i, numValues - 1);
                let valueEntry = paletteValues.get(valueIndex);
                let color = valueEntry.get("color");
                ctx.fillStyle = color;
                ctx.fillRect(Math.floor(binWidth * i), 0, drawWidth, CANVAS_HEIGHT);
            }
        }
    }

    render() {
        let containerClass = miscUtil.generateStringFromSet({
            "colorbar-container": true,
            "no-colorbar": this.props.handleAs === ""
        });
        let canvasClass = miscUtil.generateStringFromSet({
            colorbar: true,
            hidden:
                this.props.handleAs !== appStrings.COLORBAR_JSON_FIXED &&
                this.props.handleAs !== appStrings.COLORBAR_JSON_RELATIVE
        });
        let imageClass = miscUtil.generateStringFromSet({
            colorbar: true,
            hidden: this.props.handleAs !== appStrings.COLORBAR_IMAGE
        });
        let warningClass = miscUtil.generateStringFromSet({
            "colorbar-warning": true,
            hidden: this.props.handleAs !== ""
        });

        return (
            <div className={containerClass}>
                <canvas
                    ref="canvas"
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className={canvasClass}
                />
                <img src={this.props.url} className={imageClass} />
                <span className={warningClass}>No Colorbar Available</span>
            </div>
        );
    }
}

Colorbar.propTypes = {
    actions: PropTypes.object.isRequired,
    palette: PropTypes.object,
    min: PropTypes.number,
    max: PropTypes.number,
    displayMin: PropTypes.number,
    displayMax: PropTypes.number,
    handleAs: PropTypes.string,
    url: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Colorbar);
