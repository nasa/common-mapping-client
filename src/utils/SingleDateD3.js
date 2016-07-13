import d3 from 'd3';

export default class TimeAxisD3 {
    constructor(options) {
        this.initValues(options);
    }

    initValues(options) {
        // extract values
        this._selectNode = options.selectNode || this._selectNode;
        this._symbolWidth = options.symbolWidth || this._symbolWidth;
        this._defaultWidth = options.defaultWidth || this._defaultWidth;
        this._activeWidth = options.activeWidth || this._activeWidth;
        this._maxX = options.maxX || this._maxX;
        this._minX = options.minX || this._minX;
        this._beforeDrag = options.beforeDrag || this._beforeDrag;
        this._onDrag = options.onDrag || this._onDrag;
        this._afterDrag = options.afterDrag || this._afterDrag;

        // grab d3 selection if needed
        this._selection = this._selection || d3.select(this._selectNode);
    }

    enter(options) {
        this.prepDrag();
        this.update(options);
    }

    update(options) {
        this.setDatum(options);
        this.initValues(options);

        // this._selection
        //     .attr('width', (d) => {
        //         return d.isDragging ? (this._activeWidth) : this._defaultWidth;
        //     })
        //     .attr('transform', (d) => {
        //         let translate = !d.isDragging ? -(this._defaultWidth / 2) : -(this._activeWidth / 2);
        //         return 'translate(' + translate + ',0)';
        //     });
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
                if (typeof this._beforeDrag === "function") {
                    this._beforeDrag();
                }
            })
            .on('drag', () => {
                let scrollFlag = 0;
                let maxX = this._maxX - (2 * this._activeWidth);
                let minX = this._minX + (this._activeWidth);
                if (d3.event.x >= maxX) {
                    this._selection
                        .attr('x', (d) => maxX)
                        .attr("transform", (d) => {
                            return 'translate(' + (maxX - (this._symbolWidth / 2)) + ',0)';
                        });
                    scrollFlag = 1;
                } else if (d3.event.x <= minX) {
                    this._selection
                        .attr('x', (d) => minX)
                        .attr("transform", (d) => {
                            return 'translate(' + (minX - (this._symbolWidth / 2)) + ',0)';
                        });
                    scrollFlag = -1;
                } else {
                    this._selection
                        .attr('x', (d) => d3.event.x)
                        .attr("transform", (d) => {
                            return 'translate(' + (d3.event.x - (this._symbolWidth / 2)) + ',0)';
                        });
                }
                if (typeof this._onDrag === "function") {
                    this._onDrag(d3.event.x, scrollFlag);
                }
            })
            .on('dragend', () => {
                if (typeof this._afterDrag === "function") {
                    this._afterDrag(this._selection.attr('x'));
                }
            });
        this._selection.call(drag);
    }
}
