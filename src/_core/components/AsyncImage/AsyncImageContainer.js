import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import * as actions from '_core/actions/AppActions';


export class AsyncImageContainer extends Component {
    componentDidMount() {
        let imgLoader = ReactDOM.findDOMNode(this.refs.imgLoader);
        let imgDest = ReactDOM.findDOMNode(this.refs.imgDest);
        imgLoader.onload = null;
        imgDest.style.backgroundImage = "";

        let imgSrc = imgLoader.getAttribute('src');
        imgLoader.onload = () => { this.onImageLoad(); };
        imgLoader.src = imgSrc;

    }
    componentWillUpdate(nextProps, nextState) {
        // Here we can catch props that are changing when component doesn't actually unmount
        let imgDest = ReactDOM.findDOMNode(this.refs.imgDest);
        imgDest.style.backgroundImage = "";
    }
    componentWillUnmount() {
        this.destroyLoader();
    }
    onImageLoad() {
        let imgLoader = ReactDOM.findDOMNode(this.refs.imgLoader);
        let imgSrc = imgLoader.getAttribute('src');
        let imgDest = ReactDOM.findDOMNode(this.refs.imgDest);
        imgDest.style.backgroundImage = "url(" + imgSrc + ")";
        imgDest.style.opacity = "1";
    }
    destroyLoader() {
        let imgLoader = ReactDOM.findDOMNode(this.refs.imgLoader);
        let imgDest = ReactDOM.findDOMNode(this.refs.imgDest);
        imgLoader.onload = null;
        imgLoader.src = "";
        imgDest.style.backgroundImage = "";
    }
    render() {
        return (
            <div className="async-image-container">
                <img style={{"display":"none"}} src={this.props.src} ref="imgLoader" />
                <div style={{"transition":"opacity 0.3s"}} className={this.props.className} ref="imgDest" />
            </div>
        );
    }
}

AsyncImageContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    src: PropTypes.string.isRequired,
    className: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(AsyncImageContainer);
