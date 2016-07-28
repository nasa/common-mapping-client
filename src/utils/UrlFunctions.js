import MapUtil from './MapUtil';

/** Tile Url Function Parameters

OPENLAYERS
options: object containing the following...
    layer: the ImmutbleJS layer object from the store
    origUrl: the original url (template or base endpoint) for the layer
    processedUrl: the url openlayers automatically generated
    tileCoord: the coordinates of the tile currently requested [z,x,y]
    pixelRatio: the current pixel ratio of the display
    projectionString: the string name of the current projection

CESIUM
options: object containing the following...
    layer: the ImmutbleJS layer object from the store
    origUrl: the original url (template or base endpoint) for the layer
    tileCoord: the coordinates of the tile currently requested [z,x,y]
**/

export function defaultUrlFunc(options) {
    let layer = options.layer;

    let url = typeof options.processedUrl !== "undefined" ?
        options.processedUrl :
        MapUtil.buildTileUrl({
            layerId: layer.get("id"),
            url: options.origUrl,
            tileMatrixSet: layer.getIn(["wmtsOptions", "matrixSet"]),
            format: layer.getIn(["wmtsOptions", "format"]),
            col: options.tileCoord[1],
            row: options.tileCoord[2],
            level: options.tileCoord[0]
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
    let url = defaultUrlFunc(options);

    if (layer.get("time")) {
        return url + "&TIME=" + layer.get("time");
    }

    return url;
}

export function catsIntercept(options) {
    let tileSize = options.layer.getIn(["wmtsOptions", "tileGrid", "tileSize"]);
    return "http://placekitten.com/g/" + tileSize + "/" + tileSize;
}