import d3 from 'd3';
import moment from 'moment';

export default class SingleDateD3 {
    constructor(options) {
        this.initValues(options);
    }

    initValues(options) {
        // extract values
        this._selectNode = typeof options.selectNode !== "undefined" ? options.selectNode : this._selectNode;
        this._symbolWidth = typeof options.symbolWidth !== "undefined" ? options.symbolWidth : this._symbolWidth;
        this._symbolWidthLarge = typeof options.symbolWidthLarge !== "undefined" ? options.symbolWidthLarge : this._symbolWidthLarge;
        this._maxX = typeof options.maxX !== "undefined" ? options.maxX : this._maxX;
        this._minX = typeof options.minX !== "undefined" ? options.minX : this._minX;
        this._beforeDrag = typeof options.beforeDrag !== "undefined" ? options.beforeDrag : this._beforeDrag;
        this._onDrag = typeof options.onDrag !== "undefined" ? options.onDrag : this._onDrag;
        this._afterDrag = typeof options.afterDrag !== "undefined" ? options.afterDrag : this._afterDrag;
        this._getDateFromX = typeof options.getDateFromX !== "undefined" ? options.getDateFromX : this._getDateFromX;
        this._getXFromDate = typeof options.getXFromDate !== "undefined" ? options.getXFromDate : this._getXFromDate;

        // grab d3 selection if needed
        this._selection = typeof this._selection !== "undefined" ? this._selection : d3.select(this._selectNode);
    }

    enter(options) {
        this.prepDrag();
        this.update(options);
    }

    update(options) {
        if (typeof options !== "undefined") {
            this.setDatum({
                date: options.date,
                isDragging: options.isDragging
            });
            this.initValues(options);

            // need to delay due to transition on containing axis
            window.requestAnimationFrame(() => {
                this.updatePosition(true);
            });
        }
    }

    setDatum(options) {
        this._selection.datum({
            date: options.date,
            isDragging: options.isDragging
        });
    }

    updatePosition(transition = false) {
        // update the single date display
        let _context = this;
        let datum = this._selection.datum();
        if (!datum.isDragging && this._getXFromDate(datum.date) !== parseFloat(this._selection.attr('x'))) {
            if (transition) {
                this._selection
                    .transition()
                    .duration(75)
                    .attr('x', this._getXFromDate(datum.date))
                    .attr('transform', 'translate(' + this._getXFromDate(datum.date) + ',0)');
            } else {
                this._selection
                    .attr('x', this._getXFromDate(datum.date))
                    .attr('transform', 'translate(' + this._getXFromDate(datum.date) + ',0)');
            }
        }
    }

    prepDrag() {
        let drag = d3.behavior.drag()
            .on('dragstart', () => {
                d3.event.sourceEvent.stopPropagation();
                this._selection.select(".single-date-inner")
                    .transition()
                    .duration(150)
                    .attr("r", this._symbolWidthLarge / 2);
                if (typeof this._beforeDrag === "function") {
                    this._beforeDrag();
                }
            })
            .on('drag', () => {
                // define bounds
                let scrollFlag = 0;
                let maxX = this._maxX - (this._symbolWidth / 2);
                let minX = this._minX + (this._symbolWidth / 2);
                let x = d3.event.x;

                // check for scroll
                if (x >= maxX) {
                    this._selection
                        .attr('x', (d) => maxX)
                        .attr("transform", (d) => {
                            return 'translate(' + (maxX) + ',0)';
                        });
                    scrollFlag = 1;
                } else if (x <= minX) {
                    this._selection
                        .attr('x', (d) => minX)
                        .attr("transform", (d) => {
                            return 'translate(' + (minX) + ',0)';
                        });
                    scrollFlag = -1;
                } else {
                    this._selection
                        .attr('x', (d) => x)
                        .attr("transform", (d) => {
                            return 'translate(' + (x) + ',0)';
                        });
                }
                if (typeof this._onDrag === "function") {
                    let date = this.getNearestDate(x);
                    this._onDrag(x, date, scrollFlag);
                }
            })
            .on('dragend', () => {
                this._selection.select(".single-date-inner")
                    .transition()
                    .duration(150)
                    .attr("r", this._symbolWidth / 2);
                if (typeof this._afterDrag === "function") {
                    let x = this._selection.attr('x');
                    let date = this.getNearestDate(x);
                    x = this._getXFromDate(date);

                    this._afterDrag(x);
                }
            });

        this._selection.call(drag);
    }

    getNearestDate(x) {
        // snap to nearest date
        let date = this._getDateFromX(x);
        let lowDate = moment(date).startOf("d").toDate();
        let highDate = moment(lowDate).add(1, "d").toDate();
        if ((date - lowDate) > (highDate - date)) {
            date = highDate;
        } else {
            date = lowDate;
        }
        return date;
    }
}
