import moment from 'moment';

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
export const MIN_DATE = moment("2000-06-11", "YYYY-MM-DD").toDate();
export const MAX_DATE = moment(new Date()).add(3, 'd').toDate();
export const ANALYTICS_ENDPOINT = "http://localhost:3000";