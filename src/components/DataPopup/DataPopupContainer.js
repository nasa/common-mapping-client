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
import { MouseCoordinates } from "_core/components/MouseFollower";
import styles from "components/DataPopup/DataPopupContainer.scss";
import { DataDisplayContainer } from "components/DataPopup";
import displayStyles from "_core/styles/display.scss";

export class DataPopupContainer extends Component {
    renderCoordinates(data) {
        if (data.size > 0) {
            return "";
        } else {
            return <MouseCoordinates />;
        }
    }

    render() {
        let limitRight = window.innerWidth - 500;
        let limitLeft = 500;
        let limitTop = 400;

        let x = parseInt(this.props.pixelCoordinate.get("x"));
        let y = parseInt(this.props.pixelCoordinate.get("y"));

        let style = { top: y, left: x };

        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.dataPopupContainer]: true,
            [styles.active]:
                this.props.pixelCoordinate.get("isValid") &&
                this.props.pixelCoordinate.get("data").size > 0,
            [styles.right]: x < limitLeft,
            [styles.left]: x > limitRight,
            [styles.bottom]: y < limitTop,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        let dataClasses = MiscUtil.generateStringFromSet({
            [displayStyles.hidden]: !(this.props.pixelCoordinate.get("data").size > 0)
        });

        return (
            <div className={containerClasses} style={style}>
                <div className={styles.content}>
                    <DataDisplayContainer
                        className={dataClasses}
                        data={this.props.pixelCoordinate.get("data")}
                    />
                </div>
                <div className={styles.footer}>
                    {this.renderCoordinates(this.props.pixelCoordinate.get("data"))}
                </div>
            </div>
        );
    }
}

DataPopupContainer.propTypes = {
    pixelCoordinate: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        pixelCoordinate: state.map.getIn(["view", "pixelClickCoordinate"])
    };
}

export default connect(
    mapStateToProps,
    null
)(DataPopupContainer);
