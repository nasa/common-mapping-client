import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/AppActions';
import { Button } from 'react-toolbox/lib/button';


export class TitleContainer extends Component {
    render() {
        return (
            <div id="titleContainer">
                <div className="row middle-xs">
                    <h1 id="appTitle" className="col-xs">{this.props.title}</h1>
                    <div className="col-xs">
                        <Button floating neutral icon="" label="?" className="title-button mini-xs" onClick={this.props.actions.openHelp} />
                        <Button floating neutral icon="fullscreen" className="title-button mini-xs" onClick={this.props.actions.toggleFullScreen} />
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
    title: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        title: state.view.get("title")
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
