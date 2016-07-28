import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, IconButton } from 'react-toolbox/lib/button';
import * as actions from '../../actions/AppActions';
import MiscUtil from '../../utils/MiscUtil';

export class AppBarContainer extends Component {
    componentDidMount() {
        // have to retroactively sync the state given browser specific hardware options to enter/exit full screen
        document.addEventListener("fullscreenchange", () => { this.handleFullScreenChange(); }, false);
        document.addEventListener("webkitfullscreenchange", () => { this.handleFullScreenChange(); }, false);
        document.addEventListener("mozfullscreenchange", () => { this.handleFullScreenChange(); }, false);
    }

    handleFullScreenChange() {
        if (MiscUtil.getIsInFullScreenMode()) {
            this.props.actions.setFullScreenMode(true);
        } else {
            this.props.actions.setFullScreenMode(false);
        }
    }

    render() {
        return (
            <div id="titleContainer">
                <div className="row middle-xs">
                    <div className="col-xs-3">
                        <h1 id="appTitle" >{this.props.title}</h1>
                        <span id="appSubtitle" className={this.props.subtitle ? "" : "hidden"}>{this.props.subtitle}</span>
                    </div>
                    <div className="main-actions-container col-xs">
                        <Button
                            neutral
                            className="main-action-button main-action-button-inactive"
                            label="Datasets"
                        />
                        <Button 
                            neutral
                            className="main-action-button main-action-button-inactive"
                            label="Timeline"
                        />
                        <Button 
                            neutral
                            accent
                            raised
                            className={"main-action-button "+ (!this.props.toolsOpen ? "main-action-button-inactive" : "")}
                            label="Tools"
                            onClick={() => this.props.toolsOpen ? this.props.actions.closeTools() : this.props.actions.openTools()} 
                        />
                    </div>
                    <div className="buttons-container col-xs-2">
                        <IconButton
                            // floating
                            neutral
                            icon="help" 
                            // label="?"
                            className="title-button mini-xs" 
                            onClick={this.props.actions.openHelp} 
                            data-tip="Help"
                            data-place="bottom"
                        />
                        <IconButton
                            // floating
                            neutral
                            icon="share"
                            className="title-button mini-xs"
                            onClick={this.props.actions.openShare} 
                            data-tip="Share"
                            data-place="bottom"
                        />
                        <IconButton
                            // floating
                            neutral
                            icon="settings"
                            className="title-button mini-xs"
                            onClick={this.props.actions.openSettings} 
                            data-tip="Settings"
                            data-place="bottom"
                        />
                        <IconButton
                            // floating
                            neutral
                            icon={this.props.isFullscreen ? "fullscreen_exit" : "fullscreen"} 
                            className="title-button mini-xs" 
                            onClick={() => this.props.actions.setFullScreenMode(!this.props.isFullscreen)} 
                            data-tip={this.props.isFullscreen ? "Exit Fullscreen" : "Fullscreen"} 
                            data-place="bottom"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

AppBarContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    isFullscreen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    toolsOpen: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        title: state.view.get("title"),
        subtitle: state.view.get("subtitle"),
        isFullscreen: state.view.get("isFullscreen"),
        toolsOpen: state.tools.get("isOpen")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppBarContainer);
