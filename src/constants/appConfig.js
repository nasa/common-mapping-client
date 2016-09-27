import moment from 'moment';

// Endpoints
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

// Time slider
export const SCRUBBING_UPDATE = true;
export const MIN_DATE = moment("2000-06-01", "YYYY-MM-DD").toDate();
export const MAX_DATE = moment(new Date()).add(1, 'month').toDate();

// Date Picker
export const YEAR_ARRAY = (() => {
    // generate array of years spanning configured range
    let yearArr = [];
    for (let tmpYr = parseInt(moment(MIN_DATE).format("YYYY")); tmpYr <= moment(MAX_DATE).format("YYYY"); ++tmpYr) {
        yearArr.push("" + tmpYr);
    }
    return yearArr;
})();
export const MONTH_ARRAY = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DAY_ARRAY = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

// Analytics
export const ANALYTICS_ENDPOINT = "http://localhost:3050/analyticsEndpoint";
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