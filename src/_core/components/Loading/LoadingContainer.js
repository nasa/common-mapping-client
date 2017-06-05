import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { ProgressBar } from 'react-toolbox';
import * as actions from '_core/actions/AppActions';
import AsyncImageContainer from '_core/components/AsyncImage/AsyncImageContainer';

export class LoadingContainer extends Component {
    componentDidUpdate() {
        document.getElementById("loadingContainer").style.opacity = 0;
        document.getElementById("loadingContainer").style.pointerEvents = "none";  
        setTimeout(() => {
            document.getElementById("loadingContainer").innerHTML = "";
            document.getElementById("loadingContainer").style.display = "none";
        }, 1300);
    }
    render() {
        return (
            <div/>
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
