/** Tile Load Function Parameters

options: object containing the following...
	layer: the ImmutbleJS layer object from the store
	url: the url for the retrieved tile
	tile: the openlayers3 tile object
	processedTile: the returned object from openlayers3 default tile load function
**/

export function basicIntercept(options) {
    let tile = options.tile;

    // override getImage()
    if (typeof tile._origGetImageFunc === "undefined") {
        tile._origGetImageFunc = tile.getImage;

        // fb() == getImage() in minified ol3 code
        // do NOT use an arrow function (loses context)
        tile.getImage = tile.fb = function(optContext) {
            let node = this._origGetImageFunc(optContext);
            node.className = "map-image-tile";
            return node;
        };
    }

    return options.processedTile;
}
