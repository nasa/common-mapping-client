/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
/**
 * FIFO Cache class based on key-value pairs
 *
 * @export
 * @class Cache
 */
export default class Cache {
    /**
     * Creates an instance of Cache.
     *
     * @param {number} [limit=0] the maximum number of entries to hold. Defaults to 0
     * @memberof Cache
     */

    constructor(limit = 0) {
        // type and range checks on limit
        if (typeof limit !== "number" || limit < 0) {
            limit = 0;
        }

        this._limit = Math.floor(limit);
        this._activeMap = Immutable.OrderedMap();
    }
    /**
     * add an entry to the cache. Will override previous value for this key
     *
     * @param {any} key the key by which this value will be accessed
     * @param {any} value the value to store
     * @memberof Cache
     */
    set(key, value) {
        this._activeMap = this._activeMap.set(key, value);
        if (this._activeMap.size > this._limit) {
            let firstAdded = this._activeMap.keySeq().first();
            this._activeMap = this._activeMap.delete(firstAdded);
        }
    }
    /**
     * retrieve a value from the cache
     *
     * @param {any} key the key to access the stored value
     * @returns {any} the value associated with the key or `false` if it is not found
     * @memberof Cache
     */
    get(key) {
        let value = this._activeMap.get(key);
        if (typeof value !== "undefined") {
            this.set(key, value);
            return value;
        }
        return false;
    }
    /**
     * Get the number of currently stored values
     *
     * @returns {number} number of entries stored
     * @memberof Cache
     */
    getSize() {
        return this._activeMap.size;
    }
    /**
     * Get the maximum number of values this cache can hold
     *
     * @returns {number} maximum number of entries
     * @memberof Cache
     */
    getLimit() {
        return this._limit;
    }
    /**
     * Remove all key-value mappings from the cache
     *
     * @memberof Cache
     */
    clear() {
        this._activeMap = this._activeMap.clear();
    }
    /**
     * Remove all key-value pairs that include specified key.
     * If an exact key match exists, only that pair will be cleared.
     * Otherwise, it is assumed that keys are strings and all
     * keys with the provided key as a subtring are cleared.
     *
     * @param {any} key the key to search by
     * @memberof Cache
     */
    clearByKeyMatch(key) {
        if (this._activeMap.contains(key)) {
            this._activeMap = this._activeMap.delete(key);
        } else if (key) {
            this._activeMap = this._activeMap.filterNot((v, k) => {
                return k.includes(key);
            });
        }
    }
}
