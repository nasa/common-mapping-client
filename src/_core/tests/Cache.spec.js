/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from "chai";
import Cache from "_core/utils/Cache";

export const CacheSpec = {
    name: "CacheSpec",
    tests: {
        setAndGet: {
            test1: () => {
                it(
                    "Set adds an arbitrary key/value mapped entry to the cache." +
                        "Get takes a key and retrieves the mapped value if it hasn't " +
                        "been ejected, false otherwise",
                    () => {
                        let limit = 3;
                        let cache = new Cache(limit);
                        cache.set("a", 1);
                        cache.set(3, [1]);
                        cache.set("c", { a: 1 });

                        //assert
                        expect(cache.get("a")).to.equal(1);
                        expect(cache.get(3)).to.deep.equal([1]);
                        expect(cache.get("c")).to.deep.equal({ a: 1 });
                        expect(cache.get("d")).to.deep.equal(false);
                        expect(cache.getSize()).to.equal(limit);
                    }
                );
            }
        },
        ejection: {
            test1: () => {
                it("Adds key/value pairs up the specified limit then ejects entries in FIFO order", () => {
                    let limit = 3;
                    let cache = new Cache(limit);
                    cache.set("a", 1);
                    cache.set(3, [1]);
                    cache.set("c", { a: 1 });
                    cache.set("d", { a: 2 });
                    cache.set("e", 44);
                    cache.set("f", "power pack");

                    //assert
                    expect(cache.get("a")).to.equal(false);
                    expect(cache.get(3)).to.equal(false);
                    expect(cache.get("c")).to.equal(false);
                    expect(cache.get("d")).to.deep.equal({ a: 2 });
                    expect(cache.get("e")).to.equal(44);
                    expect(cache.get("f")).to.equal("power pack");
                    expect(cache.getSize()).to.equal(limit);
                });
            }
        },
        clearing: {
            test1: () => {
                it("Clears all entries in the cache", () => {
                    let limit = 3;
                    let cache = new Cache(limit);
                    cache.set("a", 1);
                    cache.set(3, [1]);
                    cache.set("c", { a: 1 });

                    // assert all is well
                    expect(cache.get("a")).to.equal(1);
                    expect(cache.get(3)).to.deep.equal([1]);
                    expect(cache.get("c")).to.deep.equal({ a: 1 });
                    expect(cache.get("d")).to.deep.equal(false);
                    expect(cache.getSize()).to.equal(limit);

                    // Clear cache
                    cache.clear();

                    // assert cache is cleared
                    expect(cache.getSize()).to.equal(0);
                });
            }
        },
        limitAndSize: {
            test1: () => {
                it("Allows for arbitrary limit", () => {
                    let limit = 4321;
                    let cache = new Cache(limit);
                    for (let i = 0; i < limit; ++i) {
                        cache.set(i, -i);
                    }

                    for (let i = 0; i < limit; ++i) {
                        expect(cache.get(i)).to.equal(-i);
                    }
                    expect(cache.getLimit()).to.equal(limit);
                    expect(cache.getSize()).to.equal(limit);
                });
            },
            test2: () => {
                it("defaults to a limit of 0 if given a non-number or negative limit", () => {
                    let cacheA = new Cache(-1);
                    let cacheB = new Cache("aa");

                    let limit = 10;
                    for (let i = 0; i < limit; ++i) {
                        cacheA.set(i, -i);
                        cacheB.set(i, -i);
                    }

                    for (let i = 0; i < limit; ++i) {
                        expect(cacheA.get(i)).to.equal(false);
                        expect(cacheB.get(i)).to.equal(false);
                    }
                    expect(cacheA.getLimit()).to.equal(0);
                    expect(cacheB.getSize()).to.equal(0);
                });
            },
            test3: () => {
                it("size reflects current usage, limit is max usage", () => {
                    let limit = 10;
                    let cache = new Cache(limit);

                    // fill half the cache
                    for (let i = 0; i < limit / 2; ++i) {
                        cache.set(i, -i);
                    }

                    // check the filled half
                    for (let i = 0; i < limit / 2; ++i) {
                        expect(cache.get(i)).to.equal(-i);
                    }

                    // check limit and size
                    expect(cache.getLimit()).to.equal(limit);
                    expect(cache.getSize()).to.equal(limit / 2);
                });
            }
        }
    }
};
