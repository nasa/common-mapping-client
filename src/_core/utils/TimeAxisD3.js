import d3 from "d3";
import TimeScaleD3 from "_core/utils/TimeScaleD3";
import moment from "moment";
import appConfig from "constants/appConfig";
import * as appStrings from "_core/constants/appStrings";

export default class TimeAxisD3 {
    // This timeline is loosely based off of this d3 timeline
    // https://github.com/commodityvectors/d3-timeline
    // The timeline also contains several other features/pieces of logic that
    // were not implemented here such as tick label size constraining/formatting (we think)
    constructor(options) {
        this.initValues(options);
    }

    initValues(options) {
        // extract values
        this._selectNode =
            typeof options.selectNode !== "undefined" ? options.selectNode : this._selectNode;
        this._symbolWidth =
            typeof options.symbolWidth !== "undefined" ? options.symbolWidth : this._symbolWidth;
        this._onClick = typeof options.onClick !== "undefined" ? options.onClick : this._onClick;
        this._onHover = typeof options.onHover !== "undefined" ? options.onHover : this._onHover;
        this._onMouseOut =
            typeof options.onMouseOut !== "undefined" ? options.onMouseOut : this._onMouseOut;
        this._minDt = typeof options.minDt !== "undefined" ? options.minDt : this._minDt;
        this._maxDt = typeof options.maxDt !== "undefined" ? options.maxDt : this._maxDt;
        this._elementWidth =
            typeof options.elementWidth !== "undefined" ? options.elementWidth : this._elementWidth;
        this._elementHeight =
            typeof options.elementHeight !== "undefined"
                ? options.elementHeight
                : this._elementHeight;
        this._margin = typeof options.margin !== "undefined" ? options.margin : this._margin;

        // derive values
        this._width = this._elementWidth - (this._margin.left + this._margin.right);
        this._height = this._elementHeight - (this._margin.top + this._margin.bottom);

        // grab d3 selection if needed
        this._selection =
            typeof this._selection !== "undefined" ? this._selection : d3.select(this._selectNode);

        // prep the axis functions if needed
        this._xFn =
            typeof this._xFn !== "undefined"
                ? this._xFn
                : TimeScaleD3()
                      .domain([this._minDt, this._maxDt])
                      .range([this._margin.left, this._margin.left + this._width]);
        this._hiddenXFn = this._xFn.copy();

        this._xAxis =
            typeof this._xAxis !== "undefined"
                ? this._xAxis
                : d3.svg
                      .axis()
                      .scale(this._xFn)
                      .orient("bottom")
                      .innerTickSize(-this._height)
                      .tickFormat(this._timeFormat);

        // track zoom level/direction
        this._forceAxisUpdate = false;
        this._prevZoomScale = 0;
        this._prevZoomDomain = [0, 0];
        this._prevZoomTranslate = [0, 0];
    }

    enter(options = false) {
        let _context = this;

        // configure the zoom
        this._selection.zoom = d3.behavior
            .zoom()
            .x(this._xFn)
            .scaleExtent([1, appConfig.DATE_SLIDER_RESOLUTIONS[0].resolution])
            .on("zoom", () => {
                this.zoomed();
            })
            .on("zoomstart", () => {
                this.zoomstart();
            });

        this._prevZoomDomain = this._xFn.domain();
        this._prevZoomScale = this._selection.zoom.scale();
        this._prevZoomTranslate = this._selection.zoom.translate();

        // enable the zooming
        this._selection
            .call(this._selection.zoom)
            .on("dblclick.zoom", null)
            .on("click", () => {
                this.handleClick(d3.event);
                // if (!d3.event.defaultPrevented && typeof this._onClick === "function") {
                //     let date = this.getNearestDate(d3.event.clientX);
                //     this._onClick(d3.event.clientX, date);
                // }
            })
            .on("mousemove", () => {
                this.handleHover(d3.event);
                // if (typeof this._onHover === "function") {
                //     let date = this.getNearestDate(d3.event.clientX);
                //     this._onHover(d3.event.clientX, date);
                // }
            })
            .on("mouseleave", () => {
                this.handleMouseOut(d3.event);
                // if (typeof this._onMouseOut === "function") {
                //     this._onMouseOut();
                // }
            });

        // configure the axis
        this._selection
            .select("#x-axis")
            .attr("transform", "translate(0," + this._height + ")")
            .call(this._xAxis);

        // done entering time to update
        this.updateAxis();
        this.update(options);
    }

    handleClick(event) {
        if (!event.defaultPrevented && typeof this._onClick === "function") {
            let date = this.getNearestDate(event.clientX);
            this._onClick(event.clientX, date);
        }
    }

    handleHover(event) {
        if (typeof this._onHover === "function") {
            let date = this.getNearestDate(event.clientX);
            this._onHover(event.clientX, date);
        }
    }

    handleMouseOut(event) {
        if (typeof this._onMouseOut === "function") {
            this._onMouseOut();
        }
    }

    updateAxis() {
        let _context = this;

        // update sizes
        this._selection
            .select("clipPath rect")
            .attr("x", this._margin.left)
            .attr("y", 0)
            .attr("height", this._height)
            .attr("width", this._width);
        this._selection
            .select("rect#chart-bounds")
            .attr("x", this._margin.left)
            .attr("y", 0)
            .attr("height", this._height)
            .attr("width", this._width);
        this._selection
            .select(".timeline-horiz-axis")
            .attr("x1", this._margin.left - 5) // TODO: find cause of 5px displacement
            .attr("x2", this._margin.left + this._width);

        this._selection.select("#x-axis").call(this._xAxis);

        this._selection.selectAll(".tick").each(function(d, i) {
            let tick = d3.select(this);
            _context.formatTick(tick, d);
        });
    }

    updateSingleDate(options = false) {
        // update the single date display
        let _context = this;
        this._selection.selectAll(".single-date").each(function() {
            let singleDate = d3.select(this);
            let datum = singleDate.datum();
            if (
                !datum.isDragging &&
                _context._xFn(datum.date) !== parseFloat(singleDate.attr("x"))
            ) {
                singleDate
                    .attr("x", _context._xFn(datum.date))
                    .attr("transform", "translate(" + _context._xFn(datum.date) + ",0)");
            }
        });
    }

    updateResolution(options) {
        let _context = this;
        if (
            options &&
            options.date &&
            options.scale &&
            options.scale.resolution !== this._selection.zoom.scale()
        ) {
            // See: http://bl.ocks.org/mbostock/7ec977c95910dd026812
            this._selection.call(this._selection.zoom.event);

            // translate resolution to scale
            let scale =
                options.scale && typeof options.scale.resolution !== "undefined"
                    ? options.scale.resolution
                    : this._selection.zoom.scale();

            // Record the coordinates (in data space) of the center( in screen space).
            let center0 = [this._xFn(options.date), 0];
            let translate0 = this._selection.zoom.translate();
            let coordinates0 = this.coordinates(center0);
            this._selection.zoom.scale(scale);

            // Translate back to the center.
            let center1 = this.point(coordinates0);
            this._selection.zoom.translate([
                translate0[0] + center0[0] - center1[0],
                translate0[1] + center0[1] - center1[1]
            ]);
            let translate1 = this._selection.zoom.translate();
            let xOffset = this._xFn.range()[1] - this._width / 2 - this._xFn(options.date);
            this._selection.zoom.translate([translate1[0] + xOffset, translate1[1]]);

            this._forceAxisUpdate = true;
            this._selection.call(this._selection.zoom.event);
        }
    }

    scrollToDate(date = false) {
        // check if scroll is needed
        if (date && !this.dateInRange(date)) {
            let currRange = this._xFn.range();
            let rangeLeft = currRange[0];
            let rangeRight = currRange[1];
            let padding = Math.floor((rangeRight - rangeLeft) / 2);
            let currDateX = this._xFn(date);
            if (currDateX < rangeLeft) {
                this.autoScroll(false, rangeLeft - currDateX + padding);
            } else if (currDateX > rangeRight) {
                this.autoScroll(true, currDateX - rangeRight + padding);
            }
        }
    }

    update(options = false) {
        this.updateResolution({
            date: options.date,
            scale: options.scale
        });

        this.scrollToDate(options.date);
    }

    dateInRange(date) {
        let dateX = this._xFn(date);
        return this._xFn.range()[0] < dateX && this._xFn.range()[1] > dateX;
    }

    coordinates(point) {
        let scale = this._selection.zoom.scale();
        let translate = this._selection.zoom.translate();
        return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
    }

    point(coordinates) {
        let scale = this._selection.zoom.scale();
        let translate = this._selection.zoom.translate();
        return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
    }

    formatTick(selection, d) {
        let y1 = "0";
        let y2 = "-17";
        let className = "default";

        // unlabeled tick
        if (selection.select("text").text() === "") {
            y1 = "-7";
            className = "no-label";
        }

        // check if its in the future
        if (moment(d).isAfter(moment(new Date()))) {
            className += " future-date";
        }

        selection.select("text").classed("tick-text " + className, true);

        selection
            .select("line")
            .attr("y1", y1)
            .attr("y2", y2)
            .classed("tick-line " + className, true);
    }

    zoomed() {
        let _context = this;

        // Check that the domain is not larger than bounds
        if (this._xFn.domain()[1] - this._xFn.domain()[0] > this._maxDt - this._minDt) {
            this._selection.zoom.scale(1);
        }

        // keep the domain within bounds
        if (this._xFn.domain()[0] <= this._minDt) {
            this._selection.zoom.translate([
                this._selection.zoom.translate()[0] - this._xFn(this._minDt) + this._xFn.range()[0],
                this._selection.zoom.translate()[1]
            ]);
        }
        if (this._xFn.domain()[1] >= this._maxDt) {
            this._selection.zoom.translate([
                this._selection.zoom.translate()[0] - this._xFn(this._maxDt) + this._xFn.range()[1],
                this._selection.zoom.translate()[1]
            ]);
        }

        // check what sort of event triggered this
        let currDomain = this._selection.zoom.x().domain();
        let scaleChange = this._selection.zoom.scale() !== this._prevZoomScale;
        let domainChange =
            currDomain[0] !== this._prevZoomDomain[0] || currDomain[1] !== this._prevZoomDomain[1];

        // do not update the scale if this is a zoom
        if (!this._forceAxisUpdate && scaleChange) {
            this._selection.zoom.scale(this._prevZoomScale);
            this._selection.zoom.translate(this._prevZoomTranslate);
        }

        // update the axis display
        this.updateAxis();
        this.updateSingleDate();

        this._forceAxisUpdate = false;
    }

    zoomstart() {
        this._prevZoomDomain = this._xFn.domain();
        this._prevZoomScale = this._selection.zoom.scale();
        this._prevZoomTranslate = this._selection.zoom.translate();
    }

    getDateFromX(value) {
        return this._xFn.invert(value);
    }

    getXFromDate(value) {
        return this._xFn(value);
    }

    autoScroll(toLeft, scrollDiff = undefined) {
        // get current translation
        let currTrans = this._selection.zoom.translate();

        // if unset, determine autoscroll amount
        if (typeof scrollDiff !== "number") {
            let currTicks = this._xFn.ticks();
            scrollDiff = this._xFn(currTicks[1]) - this._xFn(currTicks[0]);
        }

        // prep the timeline
        this._selection.call(this._selection.zoom.translate(currTrans).event);

        // shift the timeline
        if (toLeft) {
            this._selection.call(
                this._selection.zoom.translate([currTrans[0] - scrollDiff, currTrans[1]]).event
            );
        } else {
            this._selection.call(
                this._selection.zoom.translate([currTrans[0] + scrollDiff, currTrans[1]]).event
            );
        }

        this._forceAxisUpdate = true;
        this._selection.call(this._selection.zoom.event);
        // this.zoomed();
    }

    resize(options) {
        // update the dimension values
        this.initValues(options);

        // get current scale
        this._prevZoomDomain = this._xFn.domain();
        this._prevZoomScale = this._selection.zoom.scale();
        this._prevZoomTranslate = this._selection.zoom.translate();

        // Manually reset the zoom
        this._selection.zoom.scale(1).translate([0, 0]);

        // Update range values based on resized container dimensions
        this._xFn.range([this._margin.left, this._margin.left + this._width]);

        // Apply the updated xFn to the zoom
        this._selection.zoom.x(this._xFn);

        this.updateAxis();

        options.scale.resolution = this._prevZoomScale;
        this.update(options);
    }

    getScaledWidth() {
        return (this._xFn.range()[1] - this._xFn.range()[0]) * this._selection.zoom.scale();
    }

    getNearestDate(x) {
        let currTicks = this._xFn.ticks();
        return currTicks.reduce((acc, tickEntry) => {
            let tickX = this.getXFromDate(tickEntry);
            let accX = this.getXFromDate(acc);
            if (Math.abs(x - tickX) < Math.abs(x - accX)) {
                return tickEntry;
            }
            return acc;
        }, currTicks[0]);
    }

    getTickResolution() {
        return this._xFn.getTickResolution();
    }
}
