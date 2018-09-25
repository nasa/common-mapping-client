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
import HelpIcon from "@material-ui/icons/Help";
import ShareIcon from "@material-ui/icons/Share";
import SettingsIcon from "@material-ui/icons/Settings";
import { EnhancedTooltip, IconButtonSmall } from "_core/components/Reusables";
import { FullscreenButton } from "_core/components/AppBar";
import { AppAction } from "actions";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/AppBar/AppButtons.scss";

export class AppButtons extends Component {
    render() {
        let { className, setHelpOpen, setShareOpen, setSettingsOpen, ...other } = this.props;

        let rootClasses = MiscUtil.generateStringFromSet({
            [className]: typeof className !== "undefined"
        });

        return (
            <div className={rootClasses} {...other}>
                <EnhancedTooltip
                    disableTriggerFocus
                    title="Help"
                    placement="bottom"
                    className={styles.btnWrapper}
                >
                    <IconButtonSmall
                        color="inherit"
                        className={styles.btn}
                        onClick={() => setHelpOpen(true)}
                    >
                        <HelpIcon />
                    </IconButtonSmall>
                </EnhancedTooltip>
                <EnhancedTooltip
                    disableTriggerFocus
                    title="Share"
                    placement="bottom"
                    className={styles.btnWrapper}
                >
                    <IconButtonSmall
                        color="inherit"
                        className={styles.btn}
                        onClick={() => setShareOpen(true)}
                    >
                        <ShareIcon />
                    </IconButtonSmall>
                </EnhancedTooltip>
                <EnhancedTooltip
                    disableTriggerFocus
                    title="Settings"
                    placement="bottom"
                    className={styles.btnWrapper}
                >
                    <IconButtonSmall
                        color="inherit"
                        className={styles.btn}
                        onClick={() => setSettingsOpen(true)}
                    >
                        <SettingsIcon />
                    </IconButtonSmall>
                </EnhancedTooltip>
                <EnhancedTooltip
                    disableTriggerFocus
                    title="Fullscreen"
                    placement="bottom"
                    className={styles.btnWrapper}
                >
                    <FullscreenButton className={styles.btn} />
                </EnhancedTooltip>
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
        setHelpOpen: MiscUtil.bindActionCreators(AppAction.setHelpOpen, dispatch, AppAction),
        setShareOpen: MiscUtil.bindActionCreators(AppAction.setShareOpen, dispatch, AppAction),
        setSettingsOpen: MiscUtil.bindActionCreators(AppAction.setSettingsOpen, dispatch, AppAction)
    };
}

export default connect(null, mapDispatchToProps)(AppButtons);
