import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { List, ListItem, ListSubHeader, ListCheckbox, ListDivider } from 'react-toolbox/lib/list';
import * as actions from '_core/actions/AppActions';
import * as appStrings from '_core/constants/appStrings';
import appConfig from 'constants/appConfig';
import MiscUtil from '_core/utils/MiscUtil';
import ModalMenuContainer from '_core/components/ModalMenu/ModalMenuContainer';
import moment from 'moment';
import { FacebookIcon, GooglePlusIcon, TwitterIcon } from '_core/components/Reusables/CustomIcons';

const miscUtil = new MiscUtil();

export class ShareContainer extends Component {
    componentDidMount() {
        this.updateTimeout = null;
    }
    shouldComponentUpdate(nextProps) {
        if (this.props.updateFlag !== nextProps.updateFlag ||
            this.props.isOpen !== nextProps.isOpen ||
            this.props.autoUpdateUrl !== nextProps.autoUpdateUrl) {
            return true;
        }

        // delay updates to fix performance hit
        if(this.updateTimeout === null) {
            this.updateTimeout = setTimeout(() => {
                this.props.actions.toggleShareUpdateFlag();
                clearInterval(this.updateTimeout);
                this.updateTimeout = null;
            }, 1000);
        }
        return false;
    }
    focusTextArea() {
        this.urlText.focus();
        this.urlText.select();
    }
    generateShareQuery() {
        let activeLayers = this.getActiveLayerString();
        let opacities = this.getOpacitiesString();
        let viewMode = this.getViewModeString();
        let basemap = this.getBasemapString();
        let extent = this.getExtentString();
        let enablePlaceLabels = this.getPlaceLabelsString();
        let enablePoliticalBoundaries = this.getPoliticalBoundariesString();
        let enable3DTerrain = this.getTerrainString();
        let date = this.getDateString();

        return [basemap, activeLayers, opacities, viewMode, extent, enablePlaceLabels, enablePoliticalBoundaries, enable3DTerrain, date].join("&").split(" ").join("");
    }
    getActiveLayerString() {
        let map = this.props.maps.get(appStrings.MAP_LIB_2D);
        if (map) {
            let layerIds = map.getActiveLayerIds();
            if (layerIds) {
                return appConfig.URL_KEYS.ACTIVE_LAYERS + "=" + layerIds.join(",");
            }
        }
        return "";
    }
    getOpacitiesString() {
        let dataLayers = this.props.layers.get(appStrings.LAYER_GROUP_TYPE_DATA);
        return dataLayers.size > 0 ? appConfig.URL_KEYS.OPACITIES + "=" + dataLayers.reduce((acc, layer) => {
            acc.push(layer.get("id"));
            acc.push(layer.get("opacity"));
            return acc;
        }, []).join(",") : "";
    }
    getBasemapString() {
        return appConfig.URL_KEYS.BASEMAP + "=" + this.props.layers.get(appStrings.LAYER_GROUP_TYPE_BASEMAP).reduce((acc, layer) => {
            if (layer.get("isActive")) {
                acc = layer.get("id");
            }
            return acc;
        }, "");
    }
    getPlaceLabelsString() {
        let placeLabelsLayer = this.props.layers.getIn([appStrings.LAYER_GROUP_TYPE_REFERENCE, appConfig.REFERENCE_LABELS_LAYER_ID]);
        return appConfig.URL_KEYS.ENABLE_PLACE_LABLES + "=" + (placeLabelsLayer && placeLabelsLayer.get("isActive"));
    }
    getPoliticalBoundariesString() {
        let politicalBoundariesLayer = this.props.layers.getIn([appStrings.LAYER_GROUP_TYPE_REFERENCE, appConfig.POLITICAL_BOUNDARIES_LAYER_ID]);
        return appConfig.URL_KEYS.ENABLE_POLITICAL_BOUNDARIES + "=" + (politicalBoundariesLayer && politicalBoundariesLayer.get("isActive"));
    }
    getViewModeString() {
        return appConfig.URL_KEYS.VIEW_MODE + "=" + (this.props.in3DMode ? appStrings.MAP_VIEW_MODE_3D : appStrings.MAP_VIEW_MODE_2D);
    }
    getExtentString() {
        return appConfig.URL_KEYS.VIEW_EXTENT + "=" + this.props.extent.join(",");
    }
    getTerrainString() {
        return appConfig.URL_KEYS.ENABLE_3D_TERRAIN + "=" + this.props.enableTerrain;
    }
    getDateString() {
        return appConfig.URL_KEYS.DATE + "=" + moment(this.props.mapDate).format("YYYY-MM-DD");
    }
    shareEmail(url) {
        window.location.href = "mailto:?subject=Check%20out%20what%20I%20found%20in%20" + appConfig.APP_TITLE + "&body=%0A%0A" + encodeURIComponent(url) + "%0A";
    }
    shareFacebook(url) {
        miscUtil.openLinkInNewTab("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url));
    }
    shareTwitter(url) {
        miscUtil.openLinkInNewTab("https://www.twitter.com/share?url=" + encodeURIComponent(url) + "text=Check out what I found in " + appConfig.APP_TITLE);
    }
    shareGooglePlus(url) {
        miscUtil.openLinkInNewTab("https://plus.google.com/share?url=" + encodeURIComponent(url));
    }

    render() {
        let shareQuery = this.generateShareQuery();
        let shareUrl = window.location.protocol + "//" + window.location.host + "#" + shareQuery;
        if(this.props.autoUpdateUrl) {
            window.history.replaceState(undefined, undefined, "#" + shareQuery);
        } else if(window.location.hash !== "") {
            window.history.replaceState(undefined, undefined, "#");
        }
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
                    <div className="text-center row">
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
    updateFlag: PropTypes.bool.isRequired,
    autoUpdateUrl: PropTypes.bool.isRequired,
    layers: PropTypes.object.isRequired,
    maps: PropTypes.object.isRequired,
    in3DMode: PropTypes.bool.isRequired,
    extent: PropTypes.object.isRequired,
    enableTerrain: PropTypes.bool.isRequired,
    mapDate: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        isOpen: state.share.get("isOpen"),
        updateFlag: state.share.get("updateFlag"),
        autoUpdateUrl: state.share.get("autoUpdateUrl"),
        maps: state.map.get("maps"),
        layers: state.map.get("layers"),
        in3DMode: state.map.getIn(["view", "in3DMode"]),
        extent: state.map.getIn(["view", "extent"]),
        enableTerrain: state.map.getIn(["displaySettings", "enableTerrain"]),
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
