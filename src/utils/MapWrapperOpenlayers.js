import MapWrapperOpenlayersCore from "_core/utils/MapWrapperOpenlayers";
import Ol_Layer_Vector from "ol/layer/Vector";
import Ol_Source_Cluster from "ol/source/Cluster";
import Ol_Geom_Point from "ol/geom/Point";
import Ol_Style_Fill from "ol/style/Fill";
import Ol_Style from "ol/style/Style";
import Ol_Style_Circle from "ol/style/Circle";
import Ol_Style_Stroke from "ol/style/Stroke";
import * as appStringsCore from "_core/constants/appStrings";
import * as appStrings from "constants/appStrings";
import appConfig from "constants/appConfig";
import moment from "moment";
import Ol_Layer_Image from "ol/layer/Image";
import Ol_Source_WMS from "ol/source/ImageWMS";
import Immutable, { List } from "immutable";
import MapUtil from "utils/MapUtil";
import Cache from "_core/utils/Cache";
import TileHandler from "_core/utils/TileHandler";
import MiscUtil from "_core/utils/MiscUtil";

export default class MapWrapperOpenlayers extends MapWrapperOpenlayersCore {
    /**
     * Creates an instance of MapWrapperOpenlayers.
     *
     * @param {string|domnode} container the container to render this map into
     * @param {object} options view options for constructing this map wrapper (usually map state from redux)
     * @memberof MapWrapperOpenlayers
     */
    constructor(container, options) {
        super(container, options);
    }

    /**
     * Initialize instance variables
     *
     * @param {string|domnode} container the container to render this map into
     * @param {object} options view options for constructing this map wrapper (usually map state from redux)
     * @memberof MapWrapperOpenlayers
     */
    init(container, options) {
        this.initBools(container, options);
        this.initStaticClasses(container, options);
        this.initObjects(container, options);

        this.initializationSuccess = this.map ? true : false;
        this.palettesOptions = options.get("palettes");
    }

    /**
     * Initialize static class references for this instance
     *
     * @param {string|domnode} container the container to render this map into
     * @param {object} options view options for constructing this map wrapper (usually map state from redux)
     * @memberof MapWrapperOpenlayers
     */
    initStaticClasses(container, options) {
        this.tileHandler = TileHandler;
        this.mapUtil = MapUtil;
        this.miscUtil = MiscUtil;
    }

    // initStaticClasses(container, options) {
    //     MapWrapperOpenlayersCore.prototype.initStaticClasses.call(this, container, options);
    //     this.mapUtil = MapUtil;
    // }

    /**
     * Get layer data for pixel.
     *
     * To create data contents, features properties collected from the WFS service have to respect some standards in order to
     * represente them in a popup.
     *
     * Popup title call featureTitle = properties named "platform_n"
     * Popup subtitle call featureSubtitle : properties named "time"
     * Popup content call extra : will be a list of all the provided properties except title and subtitle
     *
     * @param {number[]} pixel
     */
    getDataAtPoint(pixel, layers) {
        try {
            let data = []; // the collection of pixel data to return
            this.map.forEachFeatureAtPixel(
                pixel,
                (feature, mapLayer) => {
                    if (mapLayer) {
                        // get selected feature layer
                        const featureLayer = layers.find(
                            layer => layer.get("id") === mapLayer.get("_layerId")
                        );

                        if (featureLayer) {
                            if (feature.getGeometry() instanceof Ol_Geom_Point) {
                                // list of properties according to mapping defined in layer.json
                                const properties = {};
                                featureLayer
                                    .getIn(["mapping", "properties"])
                                    .forEach((value, key) => {
                                        if (value instanceof List) {
                                            // if List object
                                            const parametersMatrix = [Immutable.List(value)];
                                            feature.get(key).forEach((featureValue, featureKey) => {
                                                const paramArray = [];
                                                for (let subValue of Object.values(featureValue)) {
                                                    paramArray.push(subValue);
                                                }
                                                parametersMatrix.push(Immutable.List(paramArray));
                                            });
                                            properties[key] = Immutable.List(parametersMatrix);
                                        } else {
                                            // if string
                                            properties[value] = feature.get(key);
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
                                            feature.get(featureData.getIn(["identifier", "code"]))
                                        );
                                        identifiersJson.sort(function(a, b) {
                                            return a - b;
                                        });
                                        indentifier = identifiersJson[0];
                                    } else {
                                        // its a string so get value
                                        indentifier = feature.get(
                                            featureData.getIn(["identifier", "code"])
                                        );
                                    }

                                    // format link to measure data
                                    dataLink = featureData.get("link");
                                    dataLink = dataLink.replace(/\{IDENTIFIER\}/g, indentifier);
                                }

                                // no data if no mapping title defined in layer.json
                                if (featureLayer.get("mapping").get("title")) {
                                    // create data object
                                    data.push({
                                        layerId: mapLayer.get("_layerId"),
                                        properties: {
                                            featureTitle:
                                                feature.get(
                                                    featureLayer.get("mapping").get("title")
                                                ) || featureLayer.get("mapping").get("title"),
                                            featureSubtitle:
                                                feature.get(
                                                    featureLayer.get("mapping").get("subtitle")
                                                ) || "",
                                            extra: properties,
                                            extrarrays: properties,
                                            data: dataLink
                                        },
                                        coords: feature.getGeometry().getCoordinates()
                                    });
                                }
                                return false;
                            }
                        }
                    }
                },
                undefined,
                mapLayer => {
                    return (
                        mapLayer.getVisible() &&
                        mapLayer.get("_layerType") === appStringsCore.LAYER_GROUP_TYPE_DATA
                    );
                }
            );

            // pull just one feature to display
            return data.slice(0, 1);

            // return data;
        } catch (err) {
            console.warn("Error in MapWrapperOpenlayers.getDataAtPoint:", err);
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
            console.warn("Error in MapWrapperOpenlayers.getDragTranslation:", err);
            return [];
        }
    }

    /**
     * create an openlayers layer object
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @param {boolean} [fromCache=true] true if the layer may be pulled from the cache
     * @returns {object|boolean} openlayers layer object or false if it fails
     * @memberof MapWrapperOpenlayers
     */
    createLayer(layer, fromCache = true) {
        let mapLayer = false;

        // pull from cache if possible
        let cacheHash = this.getCacheHash(layer);
        if (fromCache && this.layerCache.get(cacheHash)) {
            let cachedLayer = this.layerCache.get(cacheHash);
            cachedLayer.setOpacity(layer.get("opacity"));
            cachedLayer.setVisible(layer.get("isActive"));
            return cachedLayer;
        }

        switch (layer.get("handleAs")) {
            case appStringsCore.LAYER_GIBS_RASTER:
                mapLayer = this.createWMTSLayer(layer, fromCache);
                break;
            case appStringsCore.LAYER_WMTS_RASTER:
                mapLayer = this.createWMTSLayer(layer, fromCache);
                break;
            case appStringsCore.LAYER_XYZ_RASTER:
                mapLayer = this.createWMTSLayer(layer, fromCache);
                break;
            case appStringsCore.LAYER_WMS_RASTER:
                mapLayer = this.createWMSLayer(layer, fromCache);
                break;
            case appStringsCore.LAYER_VECTOR_GEOJSON:
                mapLayer = this.createVectorLayer(layer, fromCache);
                break;
            case appStrings.LAYER_VECTOR_GEOJSON_RASTER:
                mapLayer = this.createVectorRasterLayer(layer, fromCache);
                break;
            case appStringsCore.LAYER_VECTOR_TOPOJSON:
                mapLayer = this.createVectorLayer(layer, fromCache);
                break;
            case appStringsCore.LAYER_VECTOR_KML:
                mapLayer = this.createVectorLayer(layer, fromCache);
                break;
            default:
                console.warn(
                    "Error in MapWrapperOpenlayers.createLayer: unknown layer type - ",
                    layer.get("handleAs")
                );
                mapLayer = false;
                break;
        }

        this.setLayerRefInfo(layer, mapLayer);

        return mapLayer;
    }

    /**
     * creates an openlayers layer source
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @param {object} options raster imagery options for layer from redux state
     * - url - {string} base url for this layer
     * - layer - {string} layer identifier
     * - format - {string} tile resouce format
     * - requestEncoding - {string} url encoding (REST|KVP)
     * - matrixSet - {string} matrix set for the tile pyramid
     * - projection - {string} projection string
     * - extents - {array} bounding box extents for this layer
     * - tileGrid - {object} of tiling options
     *   - origin - {array} lat lon coordinates of layer upper left
     *   - resolutions - {array} list of tile resolutions
     *   - matrixIds - {array} identifiers for each zoom level
     *   - tileSize - {number} size of the tiles
     * @param {boolean} [fromCache=true] true if the source may be pulled from the cache
     * @returns {object} openlayers source object
     * @memberof MapWrapperOpenlayers
     */
    createLayerSource(layer, options, fromCache = true) {
        // check cache
        if (fromCache) {
            let cacheHash = this.getCacheHash(layer) + "_source";
            if (this.layerCache.get(cacheHash)) {
                return this.layerCache.get(cacheHash);
            }
        }

        switch (layer.get("handleAs")) {
            case appStringsCore.LAYER_GIBS_RASTER:
                return this.createGIBSWMTSSource(layer, options);
            case appStringsCore.LAYER_WMTS_RASTER:
                return this.createWMTSSource(layer, options);
            case appStringsCore.LAYER_XYZ_RASTER:
                return this.createXYZSource(layer, options);
            case appStringsCore.LAYER_WMS_RASTER:
                return this.createWMSSource(layer, options);
            case appStringsCore.LAYER_VECTOR_GEOJSON:
                return this.createVectorGeojsonSource(layer, options);
            case appStrings.LAYER_VECTOR_GEOJSON_RASTER:
                return this.createVectorGeojsonSource(layer, options);
            case appStringsCore.LAYER_VECTOR_TOPOJSON:
                return this.createVectorTopojsonSource(layer, options);
            case appStringsCore.LAYER_VECTOR_KML:
                return this.createVectorKMLSource(layer, options);
            default:
                console.warn(
                    "Error in MapWrapperOpenlayers.createLayerSource: unknonw layer type - ",
                    layer.get("handleAs")
                );
                return false;
        }
    }

    /**
     * creates an openlayers wms layer source
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @param {object} options raster imagery options for layer from redux state
     * - url - {string} base url for this layer
     * - layer - {string} layer identifier
     * - projection - {string} projection string
     * - extents - {array} bounding box extents for this layer
     * @returns {object} openlayers source object
     * @memberof MapWrapperOpenlayers
     */
    createWMSSource(layer, options) {
        //        console.debug("options : ");
        //        console.debug(options);
        return new Ol_Source_WMS({
            url: options.url,
            params: {
                LAYERS: options.layer,
                WIDTH: options.width,
                ELEVATION: options.depth
            },
            crossOrigin: "anonymous"
        });
    }

    /**
     * create an openlayers vector layer
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @param {boolean} [fromCache=true] true if the layer may be pulled from the cache
     * @returns {object} openlayers vector layer
     * @memberof MapWrapperOpenlayers
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

            let layerSource = this.createLayerSource(
                layer,
                {
                    url: url
                },
                fromCache
            );
            if (layer.get("clusterVector")) {
                layerSource = new Ol_Source_Cluster({
                    source: layerSource
                });
            }

            /**
             * Define layer style according to data binding parameter
             */
            const bindParameter = layer.getIn([
                "updateParameters",
                "filters",
                layer.get("bindingParameter")
            ]);
            if (bindParameter && bindParameter.get("value") && bindParameter.get("property")) {
                // get palette to apply to feature
                const palette = this.palettesOptions.find(
                    palette => palette.get("id") === layer.getIn(["palette", "name"])
                );
                return new Ol_Layer_Vector({
                    source: layerSource,
                    opacity: layer.get("opacity"),
                    visible: layer.get("isActive"),
                    style: this.createVectorLayerStyle(layer, palette, bindParameter),
                    extent: appConfig.DEFAULT_MAP_EXTENT
                });
            } else {
                return new Ol_Layer_Vector({
                    source: layerSource,
                    opacity: layer.get("opacity"),
                    visible: layer.get("isActive"),
                    style: this.getLayerStyle(layer.get("vectorStyle")),
                    extent: appConfig.DEFAULT_MAP_EXTENT
                });
            }
        } catch (err) {
            console.warn("Error in MapWrapperOpenlayers.createVectorLayer:", err);
            return false;
        }
    }

    /**
     * Define vector layer style dynamically
     *
     * @param {*} layer
     */
    createVectorLayerStyle(layer, palette, parameter) {
        return (feature, resolution) => {
            if (!feature.getStyle()) {
                const parameterValue = feature.get(parameter.get("property"));
                let style = this.getLayerStyle(layer.get("vectorStyle"), undefined);
                if (parameterValue && palette && palette.get("values")) {
                    const color = this.mapUtil.getFeatureColorFromPalette(
                        palette.toJS(),
                        parseFloat(parameterValue)
                    );
                    style = this.getLayerStyle(layer.get("vectorStyle"), color);
                }
                feature.setStyle(style);
            }
            return feature.getStyle();
        };
    }

    /**
     * add a listener to the map for a given interaction
     *
     * @param {string} eventStr event type to listen for (mousemove|moveend|click)
     * @param {function} callback function to call when the event is fired
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperOpenlayers
     */
    addEventListener(eventStr, callback) {
        try {
            switch (eventStr) {
                case appStringsCore.EVENT_MOUSE_HOVER:
                    return this.map.addEventListener("pointermove", position => {
                        callback(position.pixel);
                    });
                case appStringsCore.EVENT_MOUSE_CLICK:
                    return this.map.addEventListener("click", clickEvt => {
                        callback({ pixel: clickEvt.pixel });
                    });
                case appStringsCore.EVENT_MOVE_END:
                    return this.map.addEventListener("moveend", callback);
                case appStrings.EVENT_MOUSE_DRAG:
                    return this.map.addEventListener("pointerdrag", position => {
                        callback(position.pixel);
                    });
                default:
                    return this.map.addEventListener(eventStr, callback);
            }
        } catch (err) {
            console.warn("Error in MapWrapperOpenlayers.addEventListener:", err);
            return false;
        }
    }

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
                return new Ol_Style({
                    image: new Ol_Style_Circle({
                        radius: 5,
                        fill: new Ol_Style_Fill({
                            color: color ? color : appConfig.VERTICAL_PROFILE_FILL_COLOR
                        }),
                        stroke: new Ol_Style_Stroke({
                            color: appConfig.VERTICAL_PROFILE_STROKE_COLOR,
                            width: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
                        })
                    }),
                    zIndex: Infinity
                });
            case appStrings.VECTOR_STYLE_TIMESERIE:
                return new Ol_Style({
                    image: new Ol_Style_Circle({
                        radius: 5,
                        fill: new Ol_Style_Fill({
                            color: color ? color : appConfig.VERTICAL_PROFILE_FILL_COLOR
                        }),
                        stroke: new Ol_Style_Stroke({
                            color: appConfig.VERTICAL_PROFILE_STROKE_COLOR,
                            width: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
                        })
                    }),
                    zIndex: Infinity
                });
            case appStrings.VECTOR_STYLE_TRAJECTORY:
                return new Ol_Style({
                    image: new Ol_Style_Circle({
                        radius: 5,
                        fill: new Ol_Style_Fill({
                            color: color ? color : appConfig.VERTICAL_PROFILE_FILL_COLOR
                        }),
                        stroke: new Ol_Style_Stroke({
                            color: appConfig.VERTICAL_PROFILE_STROKE_COLOR,
                            width: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
                        })
                    }),
                    zIndex: Infinity
                });
            default:
                return new Ol_Style({
                    image: new Ol_Style_Circle({
                        radius: 5,
                        fill: new Ol_Style_Fill({
                            color: appConfig.VERTICAL_PROFILE_FILL_COLOR
                        }),
                        stroke: new Ol_Style_Stroke({
                            color: appConfig.VERTICAL_PROFILE_STROKE_COLOR,
                            width: appConfig.VERTICAL_PROFILE_STROKE_WEIGHT
                        })
                    }),
                    zIndex: Infinity
                });
        }
    }

    /**
     * get the a string representing this layer to be used in the layer cache
     *
     * @param {ImmutableJS.Map} layer layer object from map state in redux
     * @returns {string} string representing this layer
     * @memberof MapWrapperOpenlayers
     */
    getCacheHash(layer) {
        let variableHash = "";
        if (layer.getIn(["updateParameters", "filters"]).size) {
            // apply filters for cache
            const filterHash = layer
                .getIn(["updateParameters", "filters"])
                .map((properties, key) => key + "_" + properties.get("value"))
                .join("_");
            if (filterHash) {
                variableHash += filterHash;
            }
        }
        if (layer.getIn(["updateParameters", "bbox"])) {
            // apply bbox for cache
            const bboxHash = this.map
                .getView()
                .calculateExtent(this.map.getSize())
                .join("_");
            if (bboxHash) {
                variableHash += bboxHash;
            }
        }
        return (
            layer.get("id") + variableHash + moment(this.mapDate).format(layer.get("timeFormat"))
        );
    }

    /**
     * clear parameter layer cache
     *
     * @returns {boolean} true if it succeeds
     * @memberof MapWrapperOpenlayers
     */
    clearCacheForLayer(layer) {
        try {
            const key = layer.get("id");
            this.layerCache.clearByKeyMatch(key);
            return true;
        } catch (err) {
            console.warn("Error in MapWrapperOpenlayers.clearCacheForLayer:", err);
            return false;
        }
    }
}
