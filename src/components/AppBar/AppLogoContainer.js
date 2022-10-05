/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "components/AppBar/AppLogoContainer.scss";
import { connect } from "react-redux";

export class AppTitleContainer extends Component {
    render() {
        return <img className={styles.logo} src={this.props.logo} height="30" />;
    }
}

AppTitleContainer.propTypes = {
    logo: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        logo: state.view.get("logo")
    };
}

export default connect(
    mapStateToProps,
    null
)(AppTitleContainer);
