import moment from 'moment';

// General
export const APP_NAME = "RiPTIDE";

// Endpoints
export const URLS = {
    layerConfig: [{
        url: "default-data/capabilities_northpolar.xml",
        type: "wmts/xml"
    },{
        url: "default-data/layers.json",
        type: "json"
    }],
    paletteConfig: "default-data/palettes.json"
};

// Time slider
export const MIN_DATE = moment("2000-06-11", "YYYY-MM-DD").toDate();
export const MAX_DATE = moment(new Date()).add(3, 'd').toDate();

// Analytics
export const ANALYTICS_ENDPOINT = "http://localhost:3000";
export const ANALYTICS_BATCH_WAIT_TIME_MS = 5000;
export const ANALYTICS_BATCH_SIZE = 10;
export const SESSION_ID = (() => {
    // generate random 7 digit string
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 7; ++i) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
})();
