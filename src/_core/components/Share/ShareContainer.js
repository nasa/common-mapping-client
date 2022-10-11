/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import Facebook from "mdi-material-ui/Facebook";
import Twitter from "mdi-material-ui/Twitter";
import Email from "mdi-material-ui/Email";
import Reddit from "mdi-material-ui/Reddit";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import * as appActions from "_core/actions/appActions";
import * as appStrings from "_core/constants/appStrings";
import appConfig from "constants/appConfig";
import MiscUtil from "_core/utils/MiscUtil";
import { ModalMenu } from "_core/components/ModalMenu";
import styles from "_core/components/Share/ShareContainer.scss";

export class ShareContainer extends Component {
    componentDidMount() {
        this.updateTimeout = null;
    }
    shouldComponentUpdate(nextProps) {
        if (
            this.props.updateFlag !== nextProps.updateFlag ||
            this.props.isOpen !== nextProps.isOpen ||
            this.props.autoUpdateUrl !== nextProps.autoUpdateUrl
        ) {
            return true;
        }

        // delay updates to fix performance hit
        if (this.updateTimeout === null) {
            this.updateTimeout = setTimeout(() => {
                this.props.appActions.toggleShareUpdateFlag();
                clearInterval(this.updateTimeout);
                this.updateTimeout = null;
            }, 1000);
        }
        return false;
    }
    focusTextArea() {
        this.urlText.select();
        this.urlText.focus();
    }
    generateShareQuery() {
        let activeLayers = this.getActiveLayerString();
        let viewMode = this.getViewModeString();
        let basemap = this.getBasemapString();
        let extent = this.getExtentString();
        let enablePlaceLabels = this.getPlaceLabelsString();
        let enablePoliticalBoundaries = this.getPoliticalBoundariesString();
        let enable3DTerrain = this.getTerrainString();
        let date = this.getDateString();
        let dateSliderResolution = this.getDateSliderResolutionString();

        return [
            basemap,
            activeLayers,
            viewMode,
            extent,
            enablePlaceLabels,
            enablePoliticalBoundaries,
            enable3DTerrain,
            date,
            dateSliderResolution
        ]
            .join("&")
            .split(" ")
            .join("");
    }
    getActiveLayerString() {
        let map = this.props.maps.get(appStrings.MAP_LIB_2D);
        if (map) {
            let layerIds = map.getActiveLayerIds();
            if (layerIds) {
                let idsWithOpacity = layerIds.map(layerId => {
                    return (
                        layerId +
                        "(" +
                        this.props.layers.getIn([
                            appStrings.LAYER_GROUP_TYPE_DATA,
                            layerId,
                            "opacity"
                        ]) +
                        ")"
                    );
                });
                return appConfig.URL_KEYS.ACTIVE_LAYERS + "=" + idsWithOpacity.join(",");
            }
        }
        return "";
    }
    getBasemapString() {
        return (
            appConfig.URL_KEYS.BASEMAP +
            "=" +
            this.props.layers.get(appStrings.LAYER_GROUP_TYPE_BASEMAP).reduce((acc, layer) => {
                if (layer.get("isActive")) {
                    acc = layer.get("id");
                }
                return acc;
            }, "")
        );
    }
    getPlaceLabelsString() {
        let placeLabelsLayer = this.props.layers.getIn([
            appStrings.LAYER_GROUP_TYPE_REFERENCE,
            appConfig.REFERENCE_LABELS_LAYER_ID
        ]);
        return (
            appConfig.URL_KEYS.ENABLE_PLACE_LABLES +
            "=" +
            (placeLabelsLayer && placeLabelsLayer.get("isActive"))
        );
    }
    getPoliticalBoundariesString() {
        let politicalBoundariesLayer = this.props.layers.getIn([
            appStrings.LAYER_GROUP_TYPE_REFERENCE,
            appConfig.POLITICAL_BOUNDARIES_LAYER_ID
        ]);
        return (
            appConfig.URL_KEYS.ENABLE_POLITICAL_BOUNDARIES +
            "=" +
            (politicalBoundariesLayer && politicalBoundariesLayer.get("isActive"))
        );
    }
    getViewModeString() {
        return (
            appConfig.URL_KEYS.VIEW_MODE +
            "=" +
            (this.props.in3DMode ? appStrings.MAP_VIEW_MODE_3D : appStrings.MAP_VIEW_MODE_2D)
        );
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
    getDateSliderResolutionString() {
        return (
            appConfig.URL_KEYS.TIMELINE_RES +
            "=" +
            this.props.dateSliderResolution.get("label").toLowerCase()
        );
    }
    shareEmail(url) {
        window.location.href =
            "mailto:?subject=Check%20out%20what%20I%20found%20in%20" +
            appConfig.APP_TITLE +
            "&body=%0A%0A" +
            encodeURIComponent(url) +
            "%0A";
    }
    shareFacebook(url) {
        MiscUtil.openLinkInNewTab(
            "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url)
        );
    }
    shareTwitter(url) {
        MiscUtil.openLinkInNewTab(
            "https://www.twitter.com/share?url=" +
                encodeURIComponent(url) +
                "text=Check out what I found in " +
                appConfig.APP_TITLE
        );
    }
    shareReddit(url) {
        MiscUtil.openLinkInNewTab("https://www.reddit.com/submit?url=" + encodeURIComponent(url));
    }

    render() {
        let shareQuery = this.generateShareQuery();
        let shareUrl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "#" +
            shareQuery;
        if (this.props.autoUpdateUrl) {
            window.history.replaceState(undefined, undefined, "#" + shareQuery);
        } else if (window.location.hash !== "") {
            window.history.replaceState(undefined, undefined, "#");
        }

        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.shareContainer]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <ModalMenu
                small
                title="Share"
                active={this.props.isOpen}
                closeFunc={() => this.props.appActions.setShareOpen(false)}
                onRendered={() => {
                    this.focusTextArea();
                }}
            >
                <div className={containerClasses}>
                    <p>
                        This URL contains the information to reproduce this current view of the map.
                    </p>
                    <input
                        type="text"
                        ref={input => {
                            if (typeof input !== "undefined") {
                                this.urlText = input;
                            }
                        }}
                        readOnly="readonly"
                        defaultValue={shareUrl}
                        className={styles.permalink}
                        onClick={() => this.focusTextArea()}
                    />
                    <div className={styles.buttons}>
                        <Grid container spacing={0}>
                            <Grid item xs>
                                <Fab
                                    style={{ color: "white", background: "#505050" }}
                                    onClick={() => this.shareEmail(shareUrl)}
                                >
                                    <Email />
                                </Fab>
                            </Grid>
                            <Grid item xs>
                                <Fab
                                    style={{ color: "white", background: "#3B5998" }}
                                    onClick={() => this.shareFacebook(shareUrl)}
                                >
                                    <Facebook />
                                </Fab>
                            </Grid>
                            <Grid item xs>
                                <Fab
                                    style={{ color: "white", background: "#55ACEE" }}
                                    onClick={() => this.shareTwitter(shareUrl)}
                                >
                                    <Twitter />
                                </Fab>
                            </Grid>
                            <Grid item xs>
                                <Fab
                                    style={{ color: "white", background: "#DD4B39" }}
                                    onClick={() => this.shareReddit(shareUrl)}
                                >
                                    <Reddit />
                                </Fab>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </ModalMenu>
        );
    }
}

ShareContainer.propTypes = {
    appActions: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    updateFlag: PropTypes.bool.isRequired,
    autoUpdateUrl: PropTypes.bool.isRequired,
    layers: PropTypes.object.isRequired,
    maps: PropTypes.object.isRequired,
    in3DMode: PropTypes.bool.isRequired,
    extent: PropTypes.object.isRequired,
    enableTerrain: PropTypes.bool.isRequired,
    mapDate: PropTypes.object.isRequired,
    dateSliderResolution: PropTypes.object.isRequired,
    className: PropTypes.string
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
        mapDate: state.map.get("date"),
        dateSliderResolution: state.dateSlider.get("resolution")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareContainer);
