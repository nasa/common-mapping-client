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
import { AppTitle } from "_core/components/AppBar";

export class AppTitleContainer extends Component {
    render() {
        let { title, subtitle, className, ...other } = this.props;
        return <AppTitle title={title} version={subtitle} className={className} />;
    }
}

AppTitleContainer.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        title: state.view.get("title"),
        subtitle: state.view.get("subtitle")
    };
}

export default connect(mapStateToProps, null)(AppTitleContainer);
