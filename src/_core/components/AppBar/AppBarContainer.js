/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppTitleContainer, AppButtons } from "_core/components/AppBar";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/AppBar/AppBarContainer.scss";
import displayStyles from "_core/styles/display.scss";

export class AppBarContainer extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [displayStyles.hiddenFadeIn]: !this.props.distractionFreeMode,
            [displayStyles.hiddenFadeOut]: this.props.distractionFreeMode,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <div className={containerClasses}>
                <AppTitleContainer className={styles.title} />
                <AppButtons className={styles.actions} />
            </div>
        );
    }
}

AppBarContainer.propTypes = {
    distractionFreeMode: PropTypes.bool.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        distractionFreeMode: state.view.get("distractionFreeMode")
    };
}

export default connect(mapStateToProps, null)(AppBarContainer);
