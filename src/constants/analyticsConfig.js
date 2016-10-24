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