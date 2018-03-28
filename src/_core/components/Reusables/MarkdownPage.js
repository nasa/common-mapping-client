/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import showdown from "showdown";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Reusables/MarkdownPage.scss";

export class MarkdownPage extends Component {
    constructor(props) {
        super(props);

        // set up our markdown converter
        this.cvt = new showdown.Converter();
        this.cvt.setFlavor("github");
    }
    render() {
        let pageContent = typeof this.props.content !== "undefined" ? this.props.content : "";

        if (pageContent && !this.props.converted) {
            pageContent = this.cvt.makeHtml(this.props.content);
        }

        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <div
                className={containerClasses}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: pageContent }}
            />
        );
    }
}

MarkdownPage.propTypes = {
    content: PropTypes.string,
    converted: PropTypes.bool,
    className: PropTypes.string
};

export default MarkdownPage;
