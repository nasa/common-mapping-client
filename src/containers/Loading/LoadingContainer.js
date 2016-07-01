import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/AppActions';
import AsyncImageContainer from '../AsyncImage/AsyncImageContainer';

export class LoadingContainer extends Component {
    render() {
        return (
            <div id="loadingContainer" className={this.props.initialLoadComplete ? "close" : ""}>
                {/*<h1 id="loadingHeader">ಠ╭╮ಠ</h1>*/}
                <h1 id="loadingHeader">common mapping client</h1>
                <h1 className="loadingIntro">The new<br />way to not<br />reinvent<br />the wheel</h1>
                <h1 className="loadingAttribution">NASA/JPL</h1>
                <div className="loadingSpinner spinnerAnimate">
                    <div className="loadingSpinnerSq1"></div>
                    <div className="loadingSpinnerSq2"></div>
                </div>
            </div>
        );
    }
}

LoadingContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    initialLoadComplete: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        initialLoadComplete: state.view.get("initialLoadComplete")
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
)(LoadingContainer);
