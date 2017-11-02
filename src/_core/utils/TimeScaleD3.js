import d3 from "d3";
import * as appStrings from "_core/constants/appStrings";

let scaleSteps = [
    3e4, // 30-second
    6e4, // 1-minute
    18e5, // 30-minute
    36e5, // 1-hour
    216e5, // 6-hour
    864e5, // 1-day
    2592e6, // 1-month
    31536e6, // 1-year
    1577e8, // 5-year
    3154e8 // 10-year
];

let scaleLocalMethods = [
    [d3.time.second, 1, appStrings.SECONDS], // 30-second
    [d3.time.second, 30, appStrings.SECONDS], // 1-minute
    [d3.time.minute, 1, appStrings.MINUTES], // 30-minute
    [d3.time.minute, 30, appStrings.MINUTES], // 1-hour
    [d3.time.hour, 1, appStrings.HOURS], // 6-hour
    [d3.time.hour, 6, appStrings.HOURS], // 1-day
    [d3.time.day, 1, appStrings.DAYS], // 1-month
    [d3.time.month, 1, appStrings.MONTHS], // 1-year
    [d3.time.year, 1, appStrings.YEARS], // 5-year
    [d3.time.year, 1, appStrings.YEARS], // 10-year
    [d3.time.year, 1, appStrings.YEARS] // 10-year +
];

scaleLocalMethods.year = d3.time.year;

const scaleLocalFormat30Second = d3.time.format.multi([
    [
        "",
        d => {
            return d.getSeconds() % 30;
        }
    ],
    [
        "%I:%M%:%Sp",
        d => {
            return true;
        }
    ]
]);

const scaleLocalFormatMinute = d3.time.format.multi([
    [
        "",
        d => {
            return d.getSeconds();
        }
    ],
    [
        "%I:%M%p",
        d => {
            return true;
        }
    ]
]);

const scaleLocalFormat30Minute = d3.time.format.multi([
    [
        "",
        d => {
            return d.getMinutes() % 30;
        }
    ],
    [
        "%I:%M%p",
        d => {
            return true;
        }
    ]
]);

const scaleLocalFormatHour = d3.time.format.multi([
    [
        "",
        d => {
            return d.getMinutes();
        }
    ],
    [
        "%I%p",
        d => {
            return true;
        }
    ]
]);

const scaleLocalFormatDay = d3.time.format.multi([
    [
        "",
        d => {
            return d.getHours();
        }
    ],
    [
        "%a %d",
        d => {
            return true;
        }
    ]
]);

const scaleLocalFormatMonth = d3.time.format.multi([
    [
        "",
        d => {
            return d.getDate() != 1;
        }
    ],
    [
        "%B",
        d => {
            return true;
        }
    ]
]);

const scaleLocalFormatYear = d3.time.format.multi([
    [
        "",
        d => {
            return d.getMonth();
        }
    ],
    [
        "%Y",
        d => {
            return true;
        }
    ]
]);

const scaleLocalFormat5Year = d3.time.format.multi([
    [
        "",
        d => {
            return d.getYear() % 5;
        }
    ],
    [
        "%Y",
        () => {
            return true;
        }
    ]
]);

const scaleLocalFormat10Year = d3.time.format.multi([
    [
        "",
        d => {
            return d.getYear() % 10;
        }
    ],
    [
        "%Y",
        () => {
            return true;
        }
    ]
]);

const formatScales = [
    scaleLocalFormat30Second,
    scaleLocalFormatMinute,
    scaleLocalFormat30Minute,
    scaleLocalFormatHour,
    scaleLocalFormatDay,
    scaleLocalFormatDay,
    scaleLocalFormatMonth,
    scaleLocalFormatYear,
    scaleLocalFormat5Year,
    scaleLocalFormat10Year,
    scaleLocalFormat10Year
];

function timeScaleD3(linear, methods, format) {
    let currFormat = format;

    function scale(x) {
        return linear(x);
    }

    function scaleDate(t) {
        return new Date(t);
    }

    function scaleExtent(domain) {
        let start = domain[0];
        let stop = domain[domain.length - 1];
        return start < stop ? [start, stop] : [stop, start];
    }

    function tickMethod(extent, count) {
        let span = extent[1] - extent[0];
        let target = span / count;
        let i = d3.bisect(scaleSteps, target);
        i = target / scaleSteps[i - 1] < scaleSteps[i] / target ? i - 1 : i;

        currFormat = formatScales[i];
        return scaleLocalMethods[i];
    }

    function scaleNice(domain, nice) {
        let i0 = 0;
        let i1 = domain.length - 1;
        let x0 = domain[i0];
        let x1 = domain[i1];
        let dx;

        if (x1 < x0) {
            (dx = i0), (i0 = i1), (i1 = dx);
            (dx = x0), (x0 = x1), (x1 = dx);
        }

        domain[i0] = nice.floor(x0);
        domain[i1] = nice.ceil(x1);
        return domain;
    }

    function linearRebind(scale, linear) {
        return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
    }

    scale.invert = function(x) {
        return scaleDate(linear.invert(x));
    };

    scale.domain = function(x) {
        if (!arguments.length) return linear.domain().map(scaleDate);
        linear.domain(x);
        return scale;
    };

    scale.nice = function(interval, skip) {
        let domain = scale.domain();
        let extent = scaleExtent(domain);
        let method =
            interval == null
                ? tickMethod(extent, 10)
                : typeof interval === "number" && tickMethod(extent, interval);

        if (method) (interval = method[0]), (skip = method[1]);

        function skipped(date) {
            return !isNaN(date) && !interval.range(date, scaleDate(+date + 1), skip).length;
        }

        return scale.domain(
            scaleNice(
                domain,
                skip > 1
                    ? {
                          floor: function(date) {
                              while (skipped((date = interval.floor(date))))
                                  date = scaleDate(date - 1);
                              return date;
                          },
                          ceil: function(date) {
                              while (skipped((date = interval.ceil(date))))
                                  date = scaleDate(+date + 1);
                              return date;
                          }
                      }
                    : interval
            )
        );
    };

    scale.ticks = function(interval, skip) {
        let extent = scaleExtent(scale.domain());
        let method =
            interval == null
                ? tickMethod(extent, 10)
                : typeof interval === "number"
                  ? tickMethod(extent, interval)
                  : !interval.range && [{ range: interval }, skip]; // assume deprecated range function

        if (method) {
            (interval = method[0]), (skip = method[1]);
        }

        return interval.range(extent[0], scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip); // inclusive upper bound
    };

    scale.tickFormat = function() {
        return currFormat;
    };

    scale.copy = function() {
        return timeScaleD3(linear.copy(), methods, format);
    };

    scale.getTickResolution = function() {
        let extent = scaleExtent(scale.domain());
        let method = tickMethod(extent, 10);

        return method[2];
    };

    return linearRebind(scale, linear);
}

export default function() {
    return timeScaleD3(d3.scale.linear(), scaleLocalMethods, formatScales[0]);
}
