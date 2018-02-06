/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import displayStyles from "_core/styles/display.scss";

export class LoadingContainer extends Component {
    componentDidUpdate() {
        document.getElementById("loadingContainer").style.opacity = 0;
        setTimeout(() => {
            document.getElementById("loadingContainer").innerHTML = "";
            document.getElementById("loadingContainer").style.display = "none";
        }, 1000);
    }
    render() {
        return <div className={displayStyles.hidden} />;
    }
}

LoadingContainer.propTypes = {
    initialLoadComplete: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        initialLoadComplete: state.view.get("initialLoadComplete")
    };
}

export default connect(mapStateToProps, null)(LoadingContainer);
