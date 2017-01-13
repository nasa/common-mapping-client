import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Button, IconButton} from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import MiscUtil from '_core/utils/MiscUtil';

const miscUtil = new MiscUtil();

export class ModalMenuContainer extends Component {
    render() {
        let classNameSet = {
            "modal-menu no-padding": true,
            "modal-menu-subpage": this.props.back,
            "small": this.props.small
        };
        classNameSet[this.props.className] = true;
        let modalMenuClasses = miscUtil.generateStringFromSet(classNameSet);
        return (
            <Dialog className={modalMenuClasses}
                    active={this.props.active} 
                    onEscKeyDown={this.props.closeFunc} 
                    onOverlayClick={this.props.closeFunc} 
                    title={this.props.title}>
                <IconButton neutral inverse icon="close" onClick={this.props.closeFunc} className="modal-menu-close"/>
                <IconButton neutral inverse icon="arrow_back" onClick={this.props.backFunc} className={"modal-menu-back " + (!this.props.back ? "hidden" : "")} />
                <div className="no-margin modal-menu-content">
                    {this.props.children}
                </div>
            </Dialog>
        );
    }
}

ModalMenuContainer.propTypes = {
    title: PropTypes.string,
    active: PropTypes.bool,
    back: PropTypes.bool,
    className: PropTypes.string,
    closeFunc: PropTypes.func,
    backFunc: PropTypes.func,
    small: PropTypes.bool,
    children: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ])
};

export default connect()(ModalMenuContainer);
