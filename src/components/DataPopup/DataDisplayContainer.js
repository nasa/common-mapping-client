import React, { Component } from "react";
import PropTypes from "prop-types";
import MiscUtil from "_core/utils/MiscUtil";
import { DataDisplay } from "components/DataPopup";

export class DataDisplayContainer extends Component {
    render() {
        let classes = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div className={classes}>
                {this.props.data.map((entry, i) => (
                    <DataDisplay key={"popup-data-" + i} data={entry} />
                ))}
            </div>
        );
    }
}

DataDisplayContainer.propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string
};

export default DataDisplayContainer;
