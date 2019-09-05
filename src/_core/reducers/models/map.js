/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import appConfig from "constants/appConfig";

export const mapState = Immutable.fromJS({
    layers: {
        data: {},
        reference: {},
        basemap: {},
        partial: []
    },
    maps: {},
    palettes: {},
    date: appConfig.DEFAULT_DATE,
    view: {
        in3DMode: false,
        maxZoom: appConfig.MAX_ZOOM,
        minZoom: appConfig.MIN_ZOOM,
        maxResolution: appConfig.MAX_RESOLUTION,
        maxZoomDistance3D: appConfig.MAX_ZOOM_DISTANCE_3D,
        minZoomDistance3D: appConfig.MIN_ZOOM_DISTANCE_3D,
        projection: appConfig.DEFAULT_PROJECTION,
        extent: appConfig.DEFAULT_BBOX_EXTENT,
        pixelHoverCoordinate: {
            lat: 0.0,
            lon: 0.0,
            x: 0,
            y: 0,
            isValid: false
        },
        pixelClickCoordinate: {
            lat: 0.0,
            lon: 0.0,
            x: 0,
            y: 0,
            isValid: false
        }
    },
    drawing: {
        isDrawingEnabled: false,
        geometryType: ""
    },
    measuring: {
        isMeasuringEnabled: false,
        geometryType: "",
        measurementType: ""
    },
    displaySettings: {
        enableTerrain: appConfig.DEFAULT_TERRAIN_ENABLED,
        selectedTerrainExaggeration: 1,
        selectedScaleUnits: "metric"
    },
    alerts: []
});

export const layerModel = Immutable.fromJS({
    id: undefined,
    title: "",
    isActive: false,
    isDisabled: false,
    opacity: 1.0,
    displayIndex: 0,
    url: "",
    palette: {
        name: "",
        url: "",
        handleAs: "",
        min: 0,
        max: 0
    },
    min: 0,
    max: 0,
    units: "",
    timeFormat: "YYYY-MM-DD",
    type: "",
    isDefault: false,
    mappingOptions: {
        urlFunctions: {},
        tileFunctions: {},
        url: "",
        layer: "",
        format: "image/png",
        requestEncoding: "KVP",
        matrixSet: undefined,
        projection: undefined,
        extents: [-180, -90, 180, 90],
        tileGrid: {
            origin: [-180, 90],
            resolutions: [],
            matrixIds: [],
            tileSize: 256
        }
    },
    urlFunctions: {},
    metadata: {
        url: null,
        handleAs: "markdown"
    },
    thumbnailImage: "https://unsplash.it/700/400?image=1025",
    fromJson: false,
    clusterVector: false,
    handleAs: "generic",
    updateParameters: { time: true }
});

export const paletteModel = Immutable.fromJS({
    id: "",
    values: []
});
