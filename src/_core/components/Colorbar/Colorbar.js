/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import MiscUtil from "_core/utils/MiscUtil";
import { ColorbarJSON, ColorbarImage } from "_core/components/Colorbar";
import * as appStrings from "_core/constants/appStrings";
import styles from "_core/components/Colorbar/Colorbar.scss";

export class Colorbar extends Component {
    constructor(props) {
        super(props);

        this.colorPreviewValid = false;
        this.colorPreview = {};
    }

    renderColorbar() {
        switch (this.props.handleAs) {
            case appStrings.COLORBAR_JSON_FIXED:
            // falls through
            case appStrings.COLORBAR_JSON_RELATIVE:
                return (
                    <ColorbarJSON
                        palette={this.props.palette}
                        handleAs={this.props.handleAs}
                        min={this.props.min}
                        max={this.props.max}
                        onMouseOver={val => this.handleMouseOver(val)}
                        onMouseOut={val => this.handleMouseOut()}
                    />
                );
            case appStrings.COLORBAR_IMAGE:
                return <ColorbarImage url={this.props.url} />;
            default:
                return (
                    <div className={styles.typeNone}>
                        <span className={styles.warning}>No Colorbar Available</span>
                    </div>
                );
        }
    }

    handleMouseOver(val) {
        this.colorPreviewValid = true;
        this.colorPreview = val;
        this.forceUpdate();
    }

    handleMouseOut() {
        this.colorPreviewValid = false;
        this.forceUpdate();
    }

    renderRange() {
        if (this.props.handleAs) {
            if (!this.colorPreviewValid) {
                return (
                    <div className={styles.labelContainer}>
                        <span className={styles.min}>
                            {this.props.displayMin || this.props.min}
                        </span>
                        <span className={styles.units}>{this.props.units}</span>
                        <span className={styles.max}>
                            {this.props.displayMax || this.props.max}
                        </span>
                    </div>
                );
            } else {
                return (
                    <div className={styles.colorPreview}>
                        <span
                            className={styles.color}
                            style={{
                                backgroundColor: this.colorPreview.color
                            }}
                        />
                        <span className={styles.value}>{this.colorPreview.value}</span>
                        <span className={styles.units}>{this.props.units}</span>
                    </div>
                );
            }
        } else {
            return <div />;
        }
    }

    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.colorbar]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div className={containerClasses}>
                {this.renderColorbar()}
                {this.renderRange()}
            </div>
        );
    }
}

Colorbar.propTypes = {
    palette: PropTypes.object,
    min: PropTypes.number,
    max: PropTypes.number,
    units: PropTypes.string,
    displayMin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    displayMax: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleAs: PropTypes.string,
    url: PropTypes.string,
    className: PropTypes.string
};

export default Colorbar;
