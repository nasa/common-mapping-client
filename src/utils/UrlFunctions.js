import MapUtil from './MapUtil';

/** Tile Url Function Parameters

OPENLAYERS
options: object containing the following...
    layer: the ImmutbleJS layer object from the store
    origUrl: the original url (template or base endpoint) for the layer
    tileCoord: the coordinates of the tile currently requested [z,x,y]
    tileMatrixIds: array of tile matrix ids mapped by zoom level
    pixelRatio: the current pixel ratio of the display
    projectionString: the string name of the current projection
    context: "openlayers"

CESIUM
options: object containing the following...
    layer: the ImmutbleJS layer object from the store
    origUrl: the original url (template or base endpoint) for the layer
    tileCoord: the coordinates of the tile currently requested [z,x,y]
    context: "cesium"
**/

export function defaultKVPUrlFunc(options) {
    let layer = options.layer;
    let url = MapUtil.buildTileUrl({
        layerId: layer.get("id"),
        url: options.origUrl,
        tileMatrixSet: layer.getIn(["wmtsOptions", "matrixSet"]),
        format: layer.getIn(["wmtsOptions", "format"]),
        col: options.tileCoord[1],
        row: options.tileCoord[2],
        level: typeof options.tileMatrixIds !== "undefined" &&
            typeof options.tileMatrixIds[options.tileCoord[0]] !== "undefined" ? options.tileMatrixIds[options.tileCoord[0]] : options.tileCoord[0],
        context: options.context
    });

    return url;
}

export function esriCustom512(options) {
    let urlTemplate = options.origUrl;
    let tileCoord = options.tileCoord;
    if (urlTemplate) {
        return urlTemplate.replace('{z}', (tileCoord[0] - 1).toString())
            .replace('{x}', tileCoord[1].toString())
            .replace('{y}', (-tileCoord[2] - 1).toString());
    }
    return undefined;
}

export function kvpTimeParam(options) {
    let layer = options.layer;
    let url = defaultKVPUrlFunc(options);

    if (layer.get("time")) {
        if (url.indexOf('{') >= 0) {
            url = url.replace('{Time}', layer.get("time"));
        } else {
            url = url + "&TIME=" + layer.get("time");
        }
    }

    return url;
}

export function catsIntercept(options) {
    let tileSize = options.layer.getIn(["wmtsOptions", "tileGrid", "tileSize"]);
    return "http://placekitten.com/g/" + tileSize + "/" + tileSize;
}
