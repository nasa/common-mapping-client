import Immutable from 'immutable';

export default class Cache {
    constructor(limit) {
        // type and range checks on limit
        if (typeof limit !== "number" || limit < 0) {
            limit = 0;
        }

        this._limit = Math.floor(limit);
        this._activeMap = Immutable.OrderedMap();
    }

    set(key, value) {
        this._activeMap = this._activeMap.set(key, value);
        if (this._activeMap.size > this._limit) {
            let firstAdded = this._activeMap.keySeq().first();
            this._activeMap = this._activeMap.delete(firstAdded);
        }
    }

    get(key) {
        let value = this._activeMap.get(key);
        if (typeof value !== "undefined") {
            return value;
        }
        return false;
    }

    getSize() {
        return this._activeMap.size;
    }

    getLimit() {
        return this._limit;
    }

    clear() {
        this._activeMap = this._activeMap.clear();
    }
}
