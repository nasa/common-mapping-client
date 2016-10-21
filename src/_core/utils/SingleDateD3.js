import d3 from 'd3';

export default class TimeAxisD3 {
    constructor(options) {
        this.initValues(options);
    }

    initValues(options) {
        // extract values
        this._selectNode = typeof options.selectNode !== "undefined" ?  options.selectNode : this._selectNode;
        this._symbolWidth = typeof options.symbolWidth !== "undefined" ?  options.symbolWidth : this._symbolWidth;
        this._symbolWidthLarge = typeof options.symbolWidthLarge !== "undefined" ?  options.symbolWidthLarge : this._symbolWidthLarge;
        this._maxX = typeof options.maxX !== "undefined" ?  options.maxX : this._maxX;
        this._minX = typeof options.minX !== "undefined" ?  options.minX : this._minX;
        this._beforeDrag = typeof options.beforeDrag !== "undefined" ?  options.beforeDrag : this._beforeDrag;
        this._onDrag = typeof options.onDrag !== "undefined" ?  options.onDrag : this._onDrag;
        this._afterDrag = typeof options.afterDrag !== "undefined" ?  options.afterDrag : this._afterDrag;

        // grab d3 selection if needed
        this._selection = typeof this._selection !== "undefined" ?  this._selection : d3.select(this._selectNode);
    }

    enter(options) {
        this.prepDrag();
        this.update(options);
    }

    update(options) {
        this.setDatum(options);
        this.initValues(options);
    }

    setDatum(options) {
        this._selection.datum({
            date: options.date,
            isDragging: options.isDragging
        });
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
                let scrollFlag = 0;
                let maxX = this._maxX - (this._symbolWidth / 2);
                let minX = this._minX + (this._symbolWidth / 2);
                let x = d3.event.x;
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
                    this._onDrag(x, scrollFlag);
                }
            })
            .on('dragend', () => {
                this._selection.select(".single-date-inner")
                    .transition()
                    .duration(150)
                    .attr("r", this._symbolWidth / 2);
                if (typeof this._afterDrag === "function") {
                    this._afterDrag(this._selection.attr('x'));
                }
            });
        this._selection.call(drag);
    }
}
