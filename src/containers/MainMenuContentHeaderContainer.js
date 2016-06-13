import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/MainMenuActions';
import { Button, IconButton } from 'react-toolbox/lib/button';

export class MainMenuContentHeaderContainer extends Component {
    // <IconButton neutral icon="close" onMouseUp={() => this.props.actions.closeMainMenu()}/>
    render() {
        return (
            <div className="menu-content-header-container">
                <div className="header-title-row">
                    <h2 className="menu-content-header-label text-center">{this.props.label}</h2>
                    <Button flat className="small header-close-button" label="close" onClick={this.props.actions.closeMainMenu} />
                </div>
                <hr className="divider medium" />
            </div>
        );
    }
}

MainMenuContentHeaderContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(MainMenuContentHeaderContainer);
