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
import Tooltip from "material-ui/Tooltip";
import HelpIcon from "material-ui-icons/Help";
import ShareIcon from "material-ui-icons/Share";
import SettingsIcon from "material-ui-icons/Settings";
import { IconButtonSmall } from "_core/components/Reusables";
import { FullscreenButton } from "_core/components/AppBar";
import { AppAction } from "actions";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/AppBar/AppButtons.scss";

export class AppButtons extends Component {
    render() {
        let { className, ...other } = this.props;

        let rootClasses = MiscUtil.generateStringFromSet({
            [className]: typeof className !== "undefined"
        });

        return (
            <div className={rootClasses} {...other}>
                <Tooltip
                    disableTriggerFocus
                    title="Help"
                    placement="bottom"
                    className={styles.btnWrapper}
                >
                    <IconButtonSmall
                        color="inherit"
                        className={styles.btn}
                        onClick={() => this.props.setHelpOpen(true)}
                    >
                        <HelpIcon />
                    </IconButtonSmall>
                </Tooltip>
                <Tooltip
                    disableTriggerFocus
                    title="Share"
                    placement="bottom"
                    className={styles.btnWrapper}
                >
                    <IconButtonSmall
                        color="inherit"
                        className={styles.btn}
                        onClick={() => this.props.setShareOpen(true)}
                    >
                        <ShareIcon />
                    </IconButtonSmall>
                </Tooltip>
                <Tooltip
                    disableTriggerFocus
                    title="Settings"
                    placement="bottom"
                    className={styles.btnWrapper}
                >
                    <IconButtonSmall
                        color="inherit"
                        className={styles.btn}
                        onClick={() => this.props.setSettingsOpen(true)}
                    >
                        <SettingsIcon />
                    </IconButtonSmall>
                </Tooltip>
                <Tooltip
                    disableTriggerFocus
                    title="Fullscreen"
                    placement="bottom"
                    className={styles.btnWrapper}
                >
                    <FullscreenButton className={styles.btn} />
                </Tooltip>
            </div>
        );
    }
}

AppButtons.propTypes = {
    setHelpOpen: PropTypes.func.isRequired,
    setShareOpen: PropTypes.func.isRequired,
    setSettingsOpen: PropTypes.func.isRequired,
    className: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return {
        setHelpOpen: bindActionCreators(AppAction.setHelpOpen, dispatch),
        setShareOpen: bindActionCreators(AppAction.setShareOpen, dispatch),
        setSettingsOpen: bindActionCreators(AppAction.setSettingsOpen, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(AppButtons);
