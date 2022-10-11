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
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import * as appActions from "_core/actions/appActions";
import { IconButtonSmall } from "_core/components/Reusables";
import MiscUtil from "_core/utils/MiscUtil";

export class FullscreenButton extends Component {
    componentDidMount() {
        // have to retroactively sync the state given browser specific hardware options to enter/exit full screen
        document.addEventListener(
            "fullscreenchange",
            () => {
                this.handleFullScreenChange();
            },
            false
        );
        document.addEventListener(
            "webkitfullscreenchange",
            () => {
                this.handleFullScreenChange();
            },
            false
        );
        document.addEventListener(
            "mozfullscreenchange",
            () => {
                this.handleFullScreenChange();
            },
            false
        );
    }

    handleFullScreenChange() {
        if (MiscUtil.getIsInFullScreenMode()) {
            this.props.appActions.setFullScreenMode(true);
        } else {
            this.props.appActions.setFullScreenMode(false);
        }
    }

    render() {
        let { className, isFullscreen, appActions, ...other } = this.props;

        let rootClasses = MiscUtil.generateStringFromSet({
            [className]: typeof className !== "undefined",
        });

        return (
            <IconButtonSmall
                color="inherit"
                className={rootClasses}
                onClick={() => this.props.appActions.setFullScreenMode(!isFullscreen)}
                {...other}
            >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButtonSmall>
        );
    }
}

FullscreenButton.propTypes = {
    appActions: PropTypes.object.isRequired,
    isFullscreen: PropTypes.bool.isRequired,
    className: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        isFullscreen: state.view.get("isFullscreen"),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FullscreenButton);
