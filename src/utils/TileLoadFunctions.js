import MiscUtil from "./MiscUtil";

/** Tile Load Function Parameters

OPENLAYERS
options: object containing the following...
	layer: the ImmutbleJS layer object from the store
	url: the url for the retrieved tile
	tile: the openlayers3 tile object
	processedTile: the returned object from openlayers3 default tile load function
RETURN: an ol3 tile object

CESIUM
options: object containing the following...
    layer: the ImmutbleJS layer object from the store
    url: the url for the retrieved tile
    success: the function to call once the tile has been successfully generated, passing the resulting tile as the only arg
    fail: the function to call once the tile has failed to be generated, passing the resulting error as the only arg
RETURN: none
**/

const CAT_SIZES = [128, 256, 512, 1024, 200, 300, 400, 500, 700];

export function catsIntercept_OL(options) {
    let tile = options.tile;

    // override getImage()
    if (typeof tile._origGetImageFunc === "undefined") {
        tile._origGetImageFunc = tile.getImage;

        // $a() == getImage() in minified ol3 code
        // TODO: this function must be updated if openlayers is updated
        // do NOT use an arrow function (loses context)
        let tileSize = CAT_SIZES[Math.floor(Math.random() * (CAT_SIZES.length - 1)) + 1];
        let url = "http://placekitten.com/g/" + tileSize + "/" + tileSize;
        tile.getImage = tile.$a = function(optContext) {
            let node = this._origGetImageFunc(optContext);
            node.src = url;
            return node;
        };
    }

    return options.processedTile;
}

export function catsIntercept_CS(options) {
    let imgTile = new Image();
    let tileSize = CAT_SIZES[Math.floor(Math.random() * (CAT_SIZES.length - 1)) + 1];
    let url = "http://placekitten.com/g/" + tileSize + "/" + tileSize;

    imgTile.onload = () => {
        options.success(imgTile);
    };
    imgTile.onerror = (err) => {
        options.fail(err);
    };
    if (MiscUtil.urlIsCrossorigin(url)) {
        imgTile.crossOrigin = '';
    }

    imgTile.src = url;
}