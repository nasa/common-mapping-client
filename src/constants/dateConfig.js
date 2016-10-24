import moment from 'moment';

export const DEFAULT_DATE = moment(new Date()).subtract(3, "d").startOf('d').toDate();
export const MIN_DATE = moment("2000-06-01", "YYYY-MM-DD").toDate();
export const MAX_DATE = moment(new Date()).add(1, 'month').toDate();
export const YEAR_ARRAY = (() => {
    // generate array of years spanning configured range
    let yearArr = [];
    for (let tmpYr = parseInt(moment(MIN_DATE).format("YYYY")); tmpYr <= moment(MAX_DATE).format("YYYY"); ++tmpYr) {
        yearArr.push("" + tmpYr);
    }
    return yearArr;
})();
export const MONTH_ARRAY = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DAY_ARRAY = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

export const DATE_SLIDER_RESOLUTIONS = {
    DAYS: {label: "Days", resolution: 512},
    MONTHS: {label: "Months", resolution: 16},
    YEARS: {label: "Years", resolution: 1}
};