import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, IconButton } from 'react-toolbox/lib/button';
import * as actions from '_core/actions/AppActions';
import MiscUtil from '_core/utils/MiscUtil';

const miscUtil = new MiscUtil();

export class AppBarContainer extends Component {
    componentDidMount() {
        // have to retroactively sync the state given browser specific hardware options to enter/exit full screen
        document.addEventListener("fullscreenchange", () => { this.handleFullScreenChange(); }, false);
        document.addEventListener("webkitfullscreenchange", () => { this.handleFullScreenChange(); }, false);
        document.addEventListener("mozfullscreenchange", () => { this.handleFullScreenChange(); }, false);
    }

    handleFullScreenChange() {
        if (miscUtil.getIsInFullScreenMode()) {
            this.props.actions.setFullScreenMode(true);
        } else {
            this.props.actions.setFullScreenMode(false);
        }
    }

    render() {
        return (
            <div id="titleContainer">
                <div className="row middle-xs">
                    <div className="col-xs-6">
                        <h1 id="appTitle" >{this.props.title}</h1>
                        <span id="appSubtitle" className={this.props.subtitle ? "" : "hidden"}>{this.props.subtitle}</span>
                    </div>
                    <div className="buttons-container col-xs-6">
                        <IconButton
                            neutral
                            icon="help"
                            className="title-button mini-xs" 
                            onClick={this.props.actions.openHelp} 
                            data-tip="Help"
                            data-place="bottom"
                        />
                        <IconButton
                            neutral
                            icon="share"
                            className="title-button mini-xs"
                            onClick={this.props.actions.openShare} 
                            data-tip="Share"
                            data-place="bottom"
                        />
                        <IconButton
                            neutral
                            icon="settings"
                            className="title-button mini-xs"
                            onClick={this.props.actions.openSettings} 
                            data-tip="Settings"
                            data-place="bottom"
                        />
                        <IconButton
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
    subtitle: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        title: state.view.get("title"),
        subtitle: state.view.get("subtitle"),
        isFullscreen: state.view.get("isFullscreen")
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
