import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { List, ListItem, ListSubHeader, ListCheckbox, ListDivider } from 'react-toolbox/lib/list';
import * as actions from '../../actions/AppActions';
import * as appStrings from '../../constants/appStrings';
import * as mapStrings from '../../constants/mapStrings';
import * as mapConfig from '../../constants/mapConfig';
import ModalMenuContainer from '../ModalMenu/ModalMenuContainer';

export class ShareContainer extends Component {
    focusTextArea() {
        this.urlText.focus();
        this.urlText.select();
    }
    generateShareUrl() {
        let activeLayers = this.getActiveLayerString();
        let opacities = this.getOpacitiesString();
        let viewMode = this.getViewModeString();
        let basemap = this.getBasemapString();
        let extent = this.getExtentString();
        let enablePlaceLables = this.getPlaceLabelsString();
        let enablePoliticalBoundaries = this.getPoliticalBoundariesString();
        let enable3DTerrain = this.getTerrainString();
        let date = this.getDateString();

        return "http://" + window.location.host + "#" + [activeLayers, opacities, viewMode, basemap, extent, enablePlaceLables, enablePoliticalBoundaries, enable3DTerrain, date].join("&");
    }
    getActiveLayerString() {
        let map = this.props.maps.get(mapStrings.MAP_LIB_2D);
        if(map) {
            let layerIds = map.getActiveLayerIds();
            if(layerIds) {
                return appStrings.URL_KEYS.ACTIVE_LAYERS + "=" + layerIds.join(",");
            }
        }
        return "";
    }
    getOpacitiesString() {
        return this.props.layers.get("data").size > 0 ? appStrings.URL_KEYS.OPACITIES + "=" + this.props.layers.get("data").reduce((acc, layer) => {
            acc.push(layer.get("id"));
            acc.push(layer.get("opacity"));
            return acc;
        }, []).join(",") : "";
    }
    getBasemapString() {
        return appStrings.URL_KEYS.BASEMAP + "=" + this.props.layers.get("basemap").reduce((acc, layer) => {
            if (layer.get("isActive")) {
                acc = layer.get("id");
            }
            return acc;
        }, "");
    }
    getPlaceLabelsString() {
        let placeLabelsLayer = this.props.layers.get("reference").find((layer) => {
            return layer.get("id") === mapConfig.REFERENCE_LABELS_LAYER_ID;
        });
        return appStrings.URL_KEYS.ENABLE_PLACE_LABLES + "=" + (placeLabelsLayer && placeLabelsLayer.get("isActive"));
    }
    getPoliticalBoundariesString() {
        let politicalBoundariesLayer = this.props.layers.get("reference").find((layer) => {
            return layer.get("id") === mapConfig.POLITICAL_BOUNDARIES_LAYER_ID;
        });
        return appStrings.URL_KEYS.ENABLE_POLITICAL_BOUNDARIES + "=" + (politicalBoundariesLayer && politicalBoundariesLayer.get("isActive"));
    }
    getViewModeString() {
        return appStrings.URL_KEYS.VIEW_MODE + "=" + (this.props.mapView.get("in3DMode") ? mapStrings.MAP_VIEW_MODE_3D : mapStrings.MAP_VIEW_MODE_2D);
    }
    getExtentString() {
        return appStrings.URL_KEYS.VIEW_EXTENT + "=" + this.props.mapView.get("extent");
    }
    getTerrainString() {
        return appStrings.URL_KEYS.ENABLE_3D_TERRAIN + "=" + this.props.mapDisplay.get("enableTerrain");
    }
    getDateString() {
        return appStrings.URL_KEYS.DATE + "=" + this.props.mapDate.toISOString().split("T")[0];
    }
    openEmail(url) {
        window.location.href = "mailto:?subject=Check%20out%20what%20I%20found%20in%20" + appStrings.APP_TITLE + "&body=%0A%0A" + encodeURIComponent(url) + "%0A";
    }
    render() {
        let shareUrl = this.generateShareUrl();
        return (
            <ModalMenuContainer
                small
                title="Share"
                active={this.props.isOpen}
                closeFunc={() => this.props.actions.closeShare()} >
                <div className="share-container">
                    <p>
                        This URL contains the information to reproduce this current view of the map.
                    </p>
                    <p>
                        Please copy and share it to your heart's content.
                    </p>
                    <input type="text" ref={(ref) => this.urlText = ref} readOnly="readonly" defaultValue={shareUrl} className="permalink-text" onClick={() => this.focusTextArea()}/>
                    <div className="text-center">
                        <Button primary raised label="Email this Link" onClick={() => this.openEmail(shareUrl)}/>
                    </div>
                </div>
            </ModalMenuContainer>
        );
    }
}

ShareContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    layers: PropTypes.object.isRequired,
    maps: PropTypes.object.isRequired,
    mapView: PropTypes.object.isRequired,
    mapDisplay: PropTypes.object.isRequired,
    mapDate: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        isOpen: state.share.get("isOpen"),
        maps: state.map.get("maps"),
        layers: state.map.get("layers"),
        mapView: state.map.get("view"),
        mapDisplay: state.map.get("displaySettings"),
        mapDate: state.map.get("date")
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
)(ShareContainer);
