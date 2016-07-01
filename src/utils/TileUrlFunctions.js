/** Tile Url Function Parameters

options: object containing the following...
	layer: the ImmutbleJS layer object from the store
	origUrl: the original url (template or base endpoint) for the layer
	processedUrl: the url openlayers automatically generated
	tileCoord: the coordinates of the tile currently requested [x,y,z]
	pixelRatio: the current pixel ratio of the display
	projectionString: the string name of the current projection
**/

export function esriCustom512(options) {
	let urlTemplate = options.origUrl;
	let tileCoord = options.tileCoord
    if (urlTemplate) {
        return urlTemplate.replace('{z}', (tileCoord[0] - 1).toString())
            .replace('{x}', tileCoord[1].toString())
            .replace('{y}', (-tileCoord[2] - 1).toString());
    }
    return undefined;
}


export function kvpTimeParam(options) {
	let processedUrl = options.processedUrl;
	let layer = options.layer;

    if (layer.get("time")) {
        return processedUrl + "&TIME=" + layer.get("time");
    }

    return processedUrl;
}
