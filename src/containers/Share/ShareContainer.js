import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { List, ListItem, ListSubHeader, ListCheckbox, ListDivider } from 'react-toolbox/lib/list';
import * as actions from '../../actions/AppActions';
import * as appStrings from '../../constants/appStrings';
import * as mapStrings from '../../constants/mapStrings';
import * as mapConfig from '../../constants/mapConfig';
import MiscUtil from '../../utils/MiscUtil';
import ModalMenuContainer from '../ModalMenu/ModalMenuContainer';


const FacebookIcon = () => (
    <svg className="shareIcon FacebookIcon" viewBox="0 0 24 24">
        <path fill="white" d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" /> 
    </svg>
);

const TwitterIcon = () => (
    <svg className="shareIcon TwitterIcon" viewBox="0 0 24 24">
        <path fill="white" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />  
    </svg>
);

const GooglePlusIcon = () => (
    <svg className="shareIcon GooglePlusIcon" viewBox="0 0 24 24">
        <path fill="white" d="M23,11H21V9H19V11H17V13H19V15H21V13H23M8,11V13.4H12C11.8,14.4 10.8,16.4 8,16.4C5.6,16.4 3.7,14.4 3.7,12C3.7,9.6 5.6,7.6 8,7.6C9.4,7.6 10.3,8.2 10.8,8.7L12.7,6.9C11.5,5.7 9.9,5 8,5C4.1,5 1,8.1 1,12C1,15.9 4.1,19 8,19C12,19 14.7,16.2 14.7,12.2C14.7,11.7 14.7,11.4 14.6,11H8Z" />
    </svg>
);

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
        if (map) {
            let layerIds = map.getActiveLayerIds();
            if (layerIds) {
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

    shareEmail(url) {
        window.location.href = "mailto:?subject=Check%20out%20what%20I%20found%20in%20" + appStrings.APP_TITLE + "&body=%0A%0A" + encodeURIComponent(url) + "%0A";
    }
    shareFacebook(url) {
        MiscUtil.openLinkInNewTab("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url));
    }
    shareTwitter(url) {
        MiscUtil.openLinkInNewTab("https://www.twitter.com/share?url=" + encodeURIComponent(url) + "text=Check out what I found in " + appStrings.APP_TITLE);
    }
    shareGooglePlus(url) {
        MiscUtil.openLinkInNewTab("https://plus.google.com/share?url=" + encodeURIComponent(url));
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
                    <div className="text-left row">
                        <Button floating neutral className="emailIcon" style={{color: "white", background: "#505050"}} icon="email" onClick={() => this.shareEmail(shareUrl)} />
                        <Button floating neutral style={{background: "#3B5998"}} className="FacebookIcon" onClick={() => this.shareFacebook(shareUrl)}><FacebookIcon/></Button>
                        <Button floating neutral style={{background: "#55ACEE"}} onClick={() => this.shareTwitter(shareUrl)}><TwitterIcon/></Button>
                        <Button floating neutral style={{background: "#DD4B39"}} onClick={() => this.shareGooglePlus(shareUrl)}><GooglePlusIcon/></Button>
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
