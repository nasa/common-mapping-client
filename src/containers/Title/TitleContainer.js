import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-toolbox/lib/button';
import * as actions from '../../actions/AppActions';
import MiscUtil from '../../utils/MiscUtil';


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
                        <Button floating neutral icon="" label="?" className="title-button mini-xs" onClick={this.props.actions.openHelp} />
                        <Button floating neutral icon={this.props.isFullscreen ? "fullscreen_exit" : "fullscreen"} className="title-button mini-xs" onClick={() => this.props.actions.setFullScreenMode(!this.props.isFullscreen)} />
                        <Button floating neutral icon="share" className="title-button mini-xs" onClick={() => console.log("clicked share")} />
                        <Button floating neutral icon="settings" className="title-button mini-xs" onClick={this.props.actions.openSettings} />
                    </div>
                </div>
            </div>
        );
    }
}

TitleContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    isFullscreen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        title: state.view.get("title"),
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
