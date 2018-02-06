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
import { ColorbarJSON, ColorbarImage } from "_core/components/Colorbar";
import * as appStrings from "_core/constants/appStrings";
import styles from "_core/components/Colorbar/Colorbar.scss";

export class Colorbar extends Component {
    renderColorbar() {
        switch (this.props.handleAs) {
            case appStrings.COLORBAR_JSON_FIXED:
            // falls through
            case appStrings.COLORBAR_JSON_RELATIVE:
                return <ColorbarJSON palette={this.props.palette} />;
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

    renderRange() {
        if (this.props.handleAs) {
            return (
                <div className={styles.labelContainer}>
                    <span className={styles.min}>{this.props.displayMin || this.props.min}</span>
                    <span className={styles.units}>{this.props.units}</span>
                    <span className={styles.max}>{this.props.displayMax || this.props.max}</span>
                </div>
            );
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
    displayMin: PropTypes.number,
    displayMax: PropTypes.number,
    handleAs: PropTypes.string,
    url: PropTypes.string,
    className: PropTypes.string
};

export default connect()(Colorbar);
