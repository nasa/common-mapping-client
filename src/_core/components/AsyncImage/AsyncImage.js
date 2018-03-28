/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/AsyncImage/AsyncImage.scss";
import displayStyles from "_core/styles/display.scss";

export class AsyncImage extends Component {
    constructor(props) {
        super(props);

        this.imageLoaded = false;
    }

    componentDidMount() {
        let imgLoader = ReactDOM.findDOMNode(this.refs.imgLoader);
        let imgSrc = imgLoader.getAttribute("src");
        imgLoader.onload = () => {
            this.onImageLoad();
        };
        imgLoader.src = imgSrc;
    }

    onImageLoad() {
        this.imageLoaded = true;
        this.forceUpdate();
    }

    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        let imageClasses = MiscUtil.generateStringFromSet({
            [styles.image]: true,
            [displayStyles.hidden]: this.imageLoaded
        });

        let destinationClasses = MiscUtil.generateStringFromSet({
            [styles.display]: true,
            [displayStyles.hiddenFadeIn]: this.imageLoaded,
            [displayStyles.hiddenFadeOut]: !this.imageLoaded
        });

        let destinationStyles = {
            backgroundImage: this.imageLoaded ? "url(" + this.props.src + ")" : ""
        };

        return (
            <div className={containerClasses}>
                <img ref="imgLoader" src={this.props.src} className={imageClasses} />
                <div ref="imgDest" className={destinationClasses} style={destinationStyles} />
            </div>
        );
    }
}

AsyncImage.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default AsyncImage;
