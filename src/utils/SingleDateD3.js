import d3 from 'd3';

export default class TimeAxisD3 {
    constructor(options) {
        this.initValues(options);

    }

    initValues(options) {
        // extract values
        this._selectNode = options.selectNode || this._selectNode;
        this._onClick = options.onClick || this._onClick;
        this._minDt = options.minDt || this._minDt;
        this._maxDt = options.maxDt || this._maxDt;
        this._elementWidth = options.elementWidth || this._elementWidth;
        this._elementHeight = options.elementHeight || this._elementHeight;
        this._margin = options.margin || this._margin;

        // derive values
        this._width = this._elementWidth - (this._margin.left + this._margin.right);
        this._height = this._elementHeight - (this._margin.top + this._margin.bottom);
        this._selection = this._selection || d3.select(this._selectNode);
    }

    enter() {
        
    }

    update() {
        
    }

    resize(options) {
        
    }
}
