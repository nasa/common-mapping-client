/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import MiscUtil from "_core/utils/MiscUtil";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import styles from "_core/components/ModalMenu/ModalMenu.scss";
import displayStyles from "_core/styles/display.scss";

export class ModalMenu extends Component {
    render() {
        let paperClasses = MiscUtil.generateStringFromSet({
            [styles.paper]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        let backClasses = MiscUtil.generateStringFromSet({
            [styles.back]: true,
            [displayStyles.hidden]: !this.props.back
        });
        let closeClasses = MiscUtil.generateStringFromSet({
            [styles.close]: true
        });
        return (
            <Dialog
                classes={{ paper: paperClasses }}
                open={this.props.active}
                onClose={this.props.closeFunc}
                onRendered={this.props.onRendered}
            >
                <AppBar className={styles.appbar}>
                    <Toolbar>
                        <IconButton
                            onClick={this.props.backFunc}
                            color="inherit"
                            className={backClasses}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={styles.flex}>
                            {this.props.title}
                        </Typography>
                        <IconButton
                            color="inherit"
                            onClick={this.props.closeFunc}
                            className={closeClasses}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <DialogContent className={styles.root}>{this.props.children}</DialogContent>
            </Dialog>
        );
    }
}

ModalMenu.propTypes = {
    title: PropTypes.string,
    active: PropTypes.bool,
    back: PropTypes.bool,
    closeFunc: PropTypes.func,
    backFunc: PropTypes.func,
    className: PropTypes.string,
    onRendered: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default ModalMenu;
