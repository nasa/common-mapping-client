import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as layerActions from '../actions/LayerActions';
import { IconButton } from 'react-toolbox/lib/button';

export class DatasetListingContainer extends Component {
    render() {
        return (
            <div className="dataset-listing">
                <div className="row middle-xs dataset-listing-header">
                    <div className="col-xs-8 text-wrap">
                        <h3 className="no-margin">{this.props.layer.get("title")}</h3>
                    </div>
                    <div className="col-xs-4 text-right">
                        <IconButton neutral icon="info_outline" className="no-padding" />
                        <IconButton neutral icon="close" className="no-padding" />
                    </div>
                </div>
                <div className="dataset-listing-summary">
                    <div className="row middle-xs dataset-summary-row">
                        <span className="col-xs-6 dataset-summary-header">Available Dates</span>
                        <span className="col-xs-6 text-left dataset-summary-value">
                            <span className="link-text" onClick={() => console.log("SET DATE")}>Aug. 1, 2000</span> - <span className="link-text" onClick={() => console.log("SET DATE")}>Aug. 2, 2020</span>
                        </span>
                    </div>
                    <div className="row middle-xs dataset-summary-row">
                        <span className="col-xs-6 dataset-summary-header">Resolution</span>
                        <span className="col-xs-6 text-left dataset-summary-value">1 Day, 25km</span>
                    </div>
                    <div className="row middle-xs dataset-summary-row">
                        <span className="col-xs-6 dataset-summary-header">Sources</span>
                        <span className="col-xs-6 text-left dataset-summary-value">NASA/JPL</span>
                    </div>
                </div>
                <hr className="divider" />
            </div>
        );
    }
}

DatasetListingContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(layerActions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(DatasetListingContainer);
