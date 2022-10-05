import MapWrapperCesiumCore from "_core/utils/MapWrapperCesium";
import * as appStringsCore from "_core/constants/appStrings";
import * as appStrings from "constants/appStrings";
import appConfig from "constants/appConfig";
import moment from "moment";
import Modernizr from "modernizr";
import Immutable, { List } from "immutable";
import MapUtil from "utils/MapUtil";
import TileHandler from "_core/utils/TileHandler";
import MiscUtil from "_core/utils/MiscUtil";

export default class MapWrapperCesium extends MapWrapperCesiumCore {
    /**
     * Creates an instance of MapWrapperCesium.
     *
     * @param {string|domnode} container the container to render this map into
     * @param {object} options view options for constructing this map wrapper (usually map state from redux)
     * @memberof MapWrapperOpenlayers
     */
    constructor(container, options) {
        super(container, options);
    }

    init(container, options) {
        this.initBools(container, options);
        this.initStaticClasses(container, options);
        this.initObjects(container, options);

        // this.mapUtil = MapUtil;
        this.initializationSuccess = this.map ? true : false;
        this.palettesOptions = options.get("palettes");
    }

    /**
     * Initialize static class references for this instance
     *
     * @param {string|domnode} container the container to render this map into
     * @param {object} options view options for constructing this map wrapper (usually map state from redux)
     * @memberof MapWrapperCesium
     */
    initStaticClasses(container, options) {
        this.tileHandler = TileHandler;
        this.mapUtil = MapUtil;
        this.miscUtil = MiscUtil;

        this.initCesium(container, options);
    }

    /**
     * create a cesium map object
     *
     * @param {string|domnode} container the domnode to render to
     * @param {object} options options for creating this map (usually map state from redux)
     * @returns {object} cesium viewer object
     * @memberof MapWrapperCesium
     */
    createMap(container, options) {
        try {
            // Check for webgl support
            if (!Modernizr.webgl) {
                throw "WebGL not available in this browser but is required by CesiumJS";
            }
            let map = new this.cesium.Viewer(container, {
                animation: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: false,
                sceneModePicker: false,
                selectionIndicator: false,
                timeline: false,
                navigationHelpButton: false,
                vrButton: false,
                contextOptions: {
                    alpha: true
                },
                terrainExaggeration: 1,
                navigationInstructionsInitiallyVisible: false,
                scene3DOnly: true,
                //initialize an empty layer so Cesium doesn't load bing maps
                imageryProvider: new this.cesium.WebMapServiceImageryProvider({
                    url: " ",
                    layers: 0
                })
            });

            // Terrain

            this.flatTerrainProvider = new this.cesium.EllipsoidTerrainProvider();
            let terrainProvider = this.flatTerrainProvider;
            if (appConfig.DEFAULT_TERRAIN_ENABLED) {
                terrainProvider = new this.cesium.CesiumTerrainProvider({
                    url: appConfig.DEFAULT_TERRAIN_ENDPOINT
                });
            }

            map.terrainProvider = terrainProvider;

            // remove sun and moon
            map.scene.sun = undefined;
            map.scene.moon = undefined;

            //change the maximum distance we can move from the globe
            map.scene.screenSpaceCameraController.maximumZoomDistance = options.getIn([
                "view",
                "maxZoomDistance3D"
            ]);
            map.scene.screenSpaceCameraController.minimumZoomDistance = options.getIn([
                "view",
                "minZoomDistance3D"
            ]);

            // disable right click zoom weirdness
            map.scene.screenSpaceCameraController.zoomEventTypes = this.cesium.CameraEventType.WHEEL;

            // set base color
            map.scene.globe.baseColor = this.cesium.Color.BLACK;

            // remove ground atmosphere
            map.scene.globe.showGroundAtmosphere = false;

            //remove all preloaded earth layers
            map.scene.globe.imageryLayers.removeAll();

            return map;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.createMap:", err);
            return false;
        }
    }

    /**
     * Get layer data for pixel.
     *
     * To create data contents, features properties collected from the WFS service have to respect some standards in order to
     * represente them in a popup.
     *
     * Popup title call featureTitle = properties named "platform_number"
     * Popup subtitle call featureSubtitle : properties named "time"
     * Popup content call extra : will be a list of all the provided properties except title and subtitle
     *
     * @param {number[]} pixel
     */
    getDataAtPoint(pixel, layers) {
        try {
            let data = []; // the collection of pixel data to return
            let pickedObjects = this.map.scene.drillPick(
                new this.cesium.Cartesian2(pixel[0], pixel[1]),
                1
            );
            for (let i = 0; i < pickedObjects.length; ++i) {
                let feature = pickedObjects[i];

                if (
                    this.cesium.defined(feature) ||
                    feature instanceof this.cesium.Cesium3DTileFeature
                ) {
                    // get selected feature layer
                    const featureLayer = layers.find(
                        layer => layer.get("id") === feature.id._layerId
                    );

                    if (featureLayer) {
                        // popup subtitle
                        const subtitle = feature.id.properties[
                            featureLayer.get("mapping").get("subtitle")
                        ]
                            ? feature.id.properties[
                                  featureLayer.get("mapping").get("subtitle")
                              ].getValue()
                            : "";

                        // list of properties acccording to mapping defined in layer.json
                        const properties = {};
                        featureLayer.getIn(["mapping", "properties"]).forEach((value, key) => {
                            if (value instanceof List) {
                                // if List object
                                const parametersMatrix = [Immutable.List(value)];
                                feature.id.properties[key]
                                    .getValue()
                                    .forEach((featureValue, featureKey) => {
                                        const paramArray = [];
                                        for (let subValue of Object.values(featureValue)) {
                                            paramArray.push(subValue);
                                        }
                                        parametersMatrix.push(Immutable.List(paramArray));
                                    });
                                properties[key] = Immutable.List(parametersMatrix);
                            } else {
                                // if string
                                properties[value] = feature.id.properties[key].getValue();
                            }
                        });

                        // create link to data measure from mapping
                        let dataLink = undefined;
                        const featureData = featureLayer.getIn(["mapping", "data"]);
                        if (featureData) {
                            let indentifier = undefined;
                            if (featureData.getIn(["identifier", "type"]) === "array") {
                                // its an array get first value, TODO : improve this, create liste of link for example.
                                const identifiersJson = JSON.parse(
                                    feature.id.properties[
                                        featureData.getIn(["identifier", "code"])
                                    ].getValue()
                                );
                                identifiersJson.sort(function(a, b) {
                                    return a - b;
                                });
                                indentifier = identifiersJson[0];
                            } else {
                                // its a string so get value
                                indentifier = feature.id.properties[
                                    featureData.getIn(["identifier", "code"])
                                ].getValue();
                            }

                            // format link to measure data
                            dataLink = featureData.get("link");
                            dataLink = dataLink.replace(/\{IDENTIFIER\}/g, indentifier);
                        }

                        // convert cartesian position to geographic coordinates (latitude,longitude)
                        const coordinates = this.cesium.Ellipsoid.WGS84.cartesianToCartographic(
                            feature.id.position.getValue()
                        );

                        // no data if no mapping title defined in layer.json
                        if (featureLayer.get("mapping").get("title")) {
                            data.push({
                                layerId: feature.id._layerId,
                                properties: {
                                    featureTitle: feature.id.properties[
                                        featureLayer.get("mapping").get("title")
                                    ].getValue(),
                                    featureSubtitle: subtitle,
                                    extra: properties,
                                    data: dataLink
                                },
                                coords: [
                                    this.cesium.Math.toDegrees(coordinates.longitude),
                                    this.cesium.Math.toDegrees(coordinates.latitude)
                                ]
                            });
                        }
                    }
                }
            }

            // pull just one feature to display
            return data.slice(0, 1);

            // return data;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.getDataAtPoint:", err);
            return [];
        }
    }

    /**
     *
     * @param {*} pixel
     */
    getDragTranslation(pixel) {
        try {
            //TODO drag translation
        } catch (err) {
            console.warn("Error in MapWrapperCesium.getDataAtPoint:", err);
            return [];
        }
    }

    /**
     * create a cesium layer corresponding to the
     * given layer
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {object|boolean} cesium layer object or false if it fails
     * @memberof MapWrapperCesium
     */
    createLayer(layer) {
        switch (layer.get("handleAs")) {
            case appStringsCore.LAYER_GIBS_RASTER:
                return this.createWMTSLayer(layer);
            case appStringsCore.LAYER_WMTS_RASTER:
                return this.createWMTSLayer(layer);
            case appStringsCore.LAYER_WMS_RASTER:
                return this.createWMSLayer(layer);
            case appStringsCore.LAYER_XYZ_RASTER:
                return this.createWMTSLayer(layer);
            case appStringsCore.LAYER_VECTOR_GEOJSON:
                return this.createVectorLayer(layer);
            case appStrings.LAYER_VECTOR_GEOJSON_RASTER:
                return this.createVectorRasterLayer(layer);
            case appStringsCore.LAYER_VECTOR_TOPOJSON:
                return this.createVectorLayer(layer);
            case appStringsCore.LAYER_VECTOR_KML:
                return this.createVectorLayer(layer);
            default:
                console.warn(
                    "Error in MapWrapperCesium.createLayer: unknown layer type - " +
                        layer.get("handleAs")
                );
                return false;
        }
    }

    /**
     * create a vector cesium layer corresponding
     * to the given layer
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {object|boolean} cesium layer object or false if it fails
     * @memberof MapWrapperCesium
     */
    createVectorRasterLayer(layer, fromCache = true) {
        try {
            const end_date = moment.utc(this.mapDate);
            // TODO : Substract month number should be configurable
            const start_date = moment(end_date).subtract(1, "month");
            const end_date_str = end_date.format(layer.get("timeFormat"));
            const start_date_str = start_date.format(layer.get("timeFormat"));

            /**
             * Create URL with declared parameters
             */
            let url = layer.get("url");
            url = url.replace(/\{TIME_MIN\}/g, start_date_str);
            url = url.replace(/\{TIME_MAX\}/g, end_date_str);
            url = url.replace(/\{BOUNDING_BOX\}/g, this.getExtent());
            // add filters from layer configurations to url
            layer.getIn(["updateParameters", "filters"]).forEach((value, key) => {
                if (key && value.get("value") !== undefined && value.get("value") !== "") {
                    url = url.concat("&", key, "=", value.get("value"));
                }
            });

            let options = { url: url };
            let layerSource = this.createVectorSource(layer, options);

            // get palette to apply to feature
            const palette = this.palettesOptions.find(
                palette => palette.get("id") === layer.getIn(["palette", "name"])
            );
            if (layerSource) {
                // layer source is a promise that acts as a stand-in while the data loads
                layerSource.then(mapLayer => {
                    this.setLayerRefInfo(layer, mapLayer);
                    if (palette) {
                        this.createVectorLayerStyle(layer, palette, mapLayer);
                    }
                    setTimeout(() => {
                        this.setLayerOpacity(layer, layer.get("opacity"));
                    }, 0);
                });

                // need to add custom metadata while data loads
                this.setLayerRefInfo(layer, layerSource);

                return layerSource;
            }

            return false;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.createVectorLayer:", err);
        }
    }

    /**
     * create a geojson vector data source
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @param {object} options vector data source options
     * - url - {string} url for the data
     * @returns {object} a cesium vector data source
     * @memberof MapWrapperCesium
     */
    createGeoJsonSource(layer, options) {
        return this.cesium.GeoJsonDataSource.load(options.url, {
            stroke: this.cesium.Color.fromCssColorString("#ffc844"),
            fill: this.cesium.Color.fromCssColorString("#ffc844").withAlpha(0.5),
            strokeWidth: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT,
            show: layer.get("isActive")
        });
    }

    /**
     * create a cesium vector data source
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @param {object} options vector data source options
     * - url - {string} url for the data
     * @returns {object} a cesium vector data source
     * @memberof MapWrapperCesium
     */
    createVectorSource(layer, options) {
        switch (layer.get("handleAs")) {
            case appStringsCore.LAYER_VECTOR_GEOJSON:
                return this.createGeoJsonSource(layer, options);
            case appStrings.LAYER_VECTOR_GEOJSON_RASTER:
                return this.createGeoJsonSource(layer, options);
            case appStringsCore.LAYER_VECTOR_TOPOJSON:
                return this.createGeoJsonSource(layer, options);
            case appStringsCore.LAYER_VECTOR_KML:
                return this.createKmlSource(layer, options);
            default:
                return false;
        }
    }

    /**
     * return the set of layers matching the provided type
     *
     * @param {string} type (GIBS_raster|wmts_raster|xyz_raster|vector_geojson|vector_topojson|vector_kml)
     * @returns {array} list of matching cesium map layers
     * @memberof MapWrapperCesium
     */
    getMapLayers(type) {
        switch (type) {
            case appStringsCore.LAYER_GIBS_RASTER:
                return this.map.imageryLayers;
            case appStringsCore.LAYER_WMTS_RASTER:
                return this.map.imageryLayers;
            case appStringsCore.LAYER_XYZ_RASTER:
                return this.map.imageryLayers;
            case appStringsCore.LAYER_VECTOR_GEOJSON:
                return this.map.dataSources;
            case appStrings.LAYER_VECTOR_GEOJSON_RASTER:
                return this.map.dataSources;
            case appStringsCore.LAYER_VECTOR_TOPOJSON:
                return this.map.dataSources;
            case appStringsCore.LAYER_VECTOR_KML:
                return this.map.dataSources;
            default:
                return this.map.imageryLayers;
        }
    }

    /**
     * add a listener to the map for a given interaction
     *
     * @param {string} eventStr event type to listen for (mousemove|moveend|click)
     * @param {function} callback function to call when the event is fired
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperCesium
     */
    addEventListener(eventStr, callback) {
        try {
            switch (eventStr) {
                case appStringsCore.EVENT_MOVE_END:
                    this.map.camera.moveEnd.addEventListener(callback);
                    return true;
                case appStringsCore.EVENT_MOUSE_HOVER:
                    new this.cesium.ScreenSpaceEventHandler(this.map.scene.canvas).setInputAction(
                        movement => {
                            callback([movement.endPosition.x, movement.endPosition.y]);
                        },
                        this.cesium.ScreenSpaceEventType.MOUSE_MOVE
                    );
                    return true;
                case appStringsCore.EVENT_MOUSE_CLICK:
                    new this.cesium.ScreenSpaceEventHandler(this.map.scene.canvas).setInputAction(
                        movement => {
                            callback({
                                pixel: [movement.position.x, movement.position.y]
                            });
                        },
                        this.cesium.ScreenSpaceEventType.LEFT_CLICK
                    );
                    return true;
                case appStrings.EVENT_MOUSE_DRAG:
                    new this.cesium.ScreenSpaceEventHandler(this.map.scene.canvas).setInputAction(
                        movement => {
                            callback([movement.endPosition.x, movement.endPosition.y]);
                        },
                        this.cesium.ScreenSpaceEventType.MOUSE_MOVE
                    );
                    return true;
                default:
                    return true;
            }
        } catch (err) {
            console.warn("Error in MapWrapperCesium.addEventListener:", err);
            return false;
        }
    }

    /**
     * Define vector layer style dynamically
     *
     * @param {*} layer
     * @param {*} mapLayer
     */
    createVectorLayerStyle(layer, palette, mapLayer) {
        try {
            let features = mapLayer.entities.values;
            if (palette.get("values")) {
                for (let i = 0; i < features.length; ++i) {
                    let feature = features[i];
                    feature.billboard = undefined;
                    feature.label = undefined;
                    feature._layerId = layer.get("id");
                    const bindParameter = layer.getIn([
                        "updateParameters",
                        "filters",
                        layer.get("bindingParameter")
                    ]);
                    if (
                        bindParameter &&
                        bindParameter.get("value") &&
                        bindParameter.get("property")
                    ) {
                        const parameterValue = feature.properties[
                            bindParameter.get("property")
                        ].getValue();
                        if (parameterValue) {
                            const color = this.mapUtil.getFeatureColorFromPalette(
                                palette.toJS(),
                                parseFloat(parameterValue)
                            );
                            feature.point = this.getLayerStyle(layer.get("vectorStyle"), color);
                        } else {
                            feature.point = this.getLayerStyle(layer.get("vectorStyle"));
                        }
                    } else {
                        feature.point = this.getLayerStyle(layer.get("vectorStyle"));
                    }
                }
            }
            return true;
        } catch (err) {
            console.warn("Error in MapWrapperCesium.setVectorLayerFeatureStyles:", err);
            return false;
        }
    }

    /**
     * prepare the default style objects that will be used
     * in drawing/measuring
     *
     * @param {string|domnode} container the domnode to render to
     * @param {object} options options for creating this map (usually map state from redux)
     * @memberof MapWrapperOpenlayers
     */
    // configureLayerStyles() {
    //     let layerStyles = {};
    //     layerStyles[appStrings.VECTOR_STYLE_VERTICAL_PROFILE] = new this.cesium.PointGraphics({
    //         color: this.cesium.Color.fromCssColorString(appConfig.VERTICAL_PROFILE_FILL_COLOR),
    //         pixelSize: 10,
    //         outlineWidth: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
    //     });
    //     layerStyles[appStrings.VECTOR_STYLE_TIMESERIE] = new this.cesium.PointGraphics({
    //         color: this.cesium.Color.fromCssColorString(appConfig.VERTICAL_PROFILE_FILL_COLOR),
    //         pixelSize: 10,
    //         outlineWidth: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
    //     });
    //     layerStyles[appStrings.VECTOR_STYLE_TRAJECTORY] = new this.cesium.PointGraphics({
    //         color: this.cesium.Color.fromCssColorString(appConfig.VERTICAL_PROFILE_FILL_COLOR),
    //         pixelSize: 10,
    //         outlineWidth: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
    //     });
    //     this.getLayerStyle = (vectorStyle) => {
    //         return layerStyles[vectorStyle];
    //     };
    // }

    /**
     * define the layer style that will be used according to "vectorStyle" property (layer.json)
     *
     * @param {string|domnode} container the domnode to render to
     * @param {object} options options for creating this map (usually map state from redux)
     * @memberof MapWrapperOpenlayers
     */
    getLayerStyle(vectorStyle, color) {
        switch (vectorStyle) {
            case appStrings.VECTOR_STYLE_VERTICAL_PROFILE:
                return new this.cesium.PointGraphics({
                    color: color
                        ? this.cesium.Color.fromCssColorString(color)
                        : this.cesium.Color.fromCssColorString(
                              appConfig.VERTICAL_PROFILE_FILL_COLOR
                          ),
                    pixelSize: 10,
                    outlineWidth: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
                });
            case appStrings.VECTOR_STYLE_TIMESERIE:
                return new this.cesium.PointGraphics({
                    color: color
                        ? this.cesium.Color.fromCssColorString(color)
                        : this.cesium.Color.fromCssColorString(
                              appConfig.VERTICAL_PROFILE_FILL_COLOR
                          ),
                    pixelSize: 10,
                    outlineWidth: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
                });
            case appStrings.VECTOR_STYLE_TRAJECTORY:
                return new this.cesium.PointGraphics({
                    color: color
                        ? this.cesium.Color.fromCssColorString(color)
                        : this.cesium.Color.fromCssColorString(
                              appConfig.VERTICAL_PROFILE_FILL_COLOR
                          ),
                    pixelSize: 10,
                    outlineWidth: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
                });
            default:
                return new this.cesium.PointGraphics({
                    color: this.cesium.Color.fromCssColorString(
                        appConfig.VERTICAL_PROFILE_FILL_COLOR
                    ),
                    pixelSize: 10,
                    outlineWidth: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
                });
        }
    }

    /**
     * Do nothing cose no cache with celsium
     *
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperOpenlayers
     */
    clearCacheForLayer(layer) {}
}
