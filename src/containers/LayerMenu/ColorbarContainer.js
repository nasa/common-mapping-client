import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MiscUtil from '../../utils/MiscUtil';
import * as actions from '../../actions/LayerActions';
import * as mapStrings from '../../constants/mapStrings';

const CANVAS_WIDTH = 255;
const CANVAS_HEIGHT = 12;

export class ColorbarContainer extends Component {

    componentDidMount() {
        if (this.props.handleAs === mapStrings.COLORBAR_JSON_FIXED ||
            this.props.handleAs === mapStrings.COLORBAR_JSON_RELATIVE) {
            this.draw();
        }
    }

    componentDidUpdate(nextProps, nextState) {
        if (this.props.handleAs === mapStrings.COLORBAR_JSON_FIXED ||
            this.props.handleAs === mapStrings.COLORBAR_JSON_RELATIVE) {
            this.draw();
        }
    }

    draw() {
        if (this.props.palette) {
            let canvas = this.refs.canvas;
            let ctx = canvas.getContext('2d');
            let paletteValues = this.props.palette.get("values");
            let numValues = paletteValues.size;

            let binWidth = CANVAS_WIDTH / numValues;
            let drawWidth = Math.ceil(binWidth);
            for(let i = 0; i < CANVAS_WIDTH; ++i) {
                let valueIndex = Math.min(i, numValues - 1);
                let valueEntry = paletteValues.get(valueIndex);
                let color = valueEntry.get("color");
                ctx.fillStyle = color;
                ctx.fillRect(Math.floor(binWidth * i), 0, drawWidth, CANVAS_HEIGHT);
            }
        }
    }

    render() {
        let canvasClass = MiscUtil.generateStringFromSet({
            "colorbar": true,
            "hidden": this.props.handleAs !== mapStrings.COLORBAR_JSON_FIXED && this.props.handleAs !== mapStrings.COLORBAR_JSON_RELATIVE
        });
        let imageClass = MiscUtil.generateStringFromSet({
            "colorbar": true,
            "hidden": this.props.handleAs !== mapStrings.COLORBAR_IMAGE
        });

        return (
            <div className="colorbar-container">
                <canvas ref="canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className={canvasClass}></canvas>
                <img src={this.props.url} className={imageClass} />
            </div>
        );
    }
}

ColorbarContainer.propTypes = {
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

export default connect(
    null,
    mapDispatchToProps
)(ColorbarContainer);
