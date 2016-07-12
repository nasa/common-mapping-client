import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-toolbox/lib/button';
import * as actions from '../../actions/AppActions';
import MiscUtil from '../../utils/MiscUtil';
import ReactTooltip from 'react-tooltip';


export class TitleContainer extends Component {
    componentDidMount() {
        // have to retroactively sync the state given browser specific hardware options to enter/exit full screen
        document.addEventListener("fullscreenchange", () => {this.handleFullScreenChange();}, false);
        document.addEventListener("webkitfullscreenchange", () => {this.handleFullScreenChange();}, false);
        document.addEventListener("mozfullscreenchange", () => {this.handleFullScreenChange();}, false);
    }

    handleFullScreenChange() {
        if(MiscUtil.getIsInFullScreenMode()) {
            this.props.actions.setFullScreenMode(true);
        } else {
            this.props.actions.setFullScreenMode(false);
        }
    }

    render() {
        return (
            <div id="titleContainer">
                <div className="row middle-xs">
                    <h1 id="appTitle" className="col-xs">{this.props.title}</h1>
                    <div className="col-xs">
                        <Button
                            // floating
                            neutral
                            icon="" 
                            label="?"
                            className="title-button mini-xs" 
                            onClick={this.props.actions.openHelp} 
                            data-tip="Help"
                            data-place="bottom"
                        />
                        <Button
                            // floating
                            neutral
                            icon={this.props.isFullscreen ? "fullscreen_exit" : "fullscreen"} 
                            className="title-button mini-xs" 
                            onClick={() => this.props.actions.setFullScreenMode(!this.props.isFullscreen)} 
                            data-tip={this.props.isFullscreen ? "Exit Fullscreen" : "Fullscreen"} 
                            data-place="bottom"
                        />
                        <Button
                            // floating
                            neutral
                            icon="share"
                            className="title-button mini-xs"
                            onClick={this.props.actions.openShare} 
                            data-tip="Share"
                            data-place="bottom"
                        />
                        <Button
                            // floating
                            neutral
                            icon="settings"
                            className="title-button mini-xs"
                            onClick={this.props.actions.openSettings} 
                            data-tip="Settings"
                            data-place="bottom"
                        />
                    </div>
                </div>
                <div id="appSubtitle" className={this.props.subtitle ? "" : "hidden"}>{this.props.subtitle}</div>
                <ReactTooltip effect="solid" globalEventOff="click" delayShow={750} />
            </div>
        );
    }
}

TitleContainer.propTypes = {
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
)(TitleContainer);
