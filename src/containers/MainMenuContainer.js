import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mainMenuActions from '../actions/MainMenuActions';
import MainMenuControls from '../components/MainMenuControls';
import MainMenuContentContainer from './MainMenuContentContainer';
import LayerMenuContainer from './LayerMenuContainer';
import MiscUtil from '../utils/MiscUtil';

export class MainMenuContainer extends Component {
    // I know this is hacky, but there simply doesn't seem to be a good way to
    // wait for the DOM to complete rendering.
    // see: http://stackoverflow.com/a/34999925
    componentDidMount() {
        window.requestAnimationFrame(() => {
            setTimeout(() => {
                // fire a resize event because sliders don't initialize well in absolute elements
                window.dispatchEvent(new Event('resize'));
            }, 0);
        });
    }
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            open: this.props.menuOpen
        });

        return (
            <div id="mainMenuContainer" className={containerClasses}>
                <MainMenuControls
                    openMainMenu={this.props.mainMenuActions.openMainMenu}
                    selectedTab={this.props.selectedTab}
                />
                <MainMenuContentContainer />
                <LayerMenuContainer />
            </div>
        );
    }
}

MainMenuContainer.propTypes = {
    mainMenuActions: PropTypes.object.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    selectedTab: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        menuOpen: state.view.get("mainMenuOpen"),
        selectedTab: state.view.get("mainMenuTab")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mainMenuActions: bindActionCreators(mainMenuActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainMenuContainer);
