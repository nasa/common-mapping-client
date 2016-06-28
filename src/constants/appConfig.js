export const APP_NAME = "RiPTIDE";
export const URLS = {
    layerConfig: [{
        url: "default-data/capabilities.xml",
        type: "wmts/xml"
    }, {
        url: "default-data/layers.json",
        type: "json"
    }],
    paletteConfig: "default-data/palettes.json"
};
export const MIN_DATE = new Date("2000-06-11");
export const MAX_DATE = new Date();