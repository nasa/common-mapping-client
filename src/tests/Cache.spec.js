import { expect } from 'chai';
import Cache from '../utils/Cache';

describe('Cache', () => {
    describe('Set and Get', () => {
        it('Set adds an arbitrary key/value mapped entry to the cache.' +
            'Get takes a key and retrieves the mapped value if it hasn\'t ' +
            'been ejected, false otherwise', () => {
            let cache = new Cache(3);
            cache.set("a", 1);
            cache.set(3, [1]);
            cache.set("c", {a: 1});

            //assert
            expect(cache.get("a")).to.equal(1);
            expect(cache.get(3)).to.deep.equal([1]);
            expect(cache.get("c")).to.deep.equal({a:1});
            expect(cache.get("d")).to.deep.equal(false);
        });
    });
    describe('Ejection', () => {
        it('Adds key/value pairs up the specified limit then ejects entries in FIFO order', () => {
            let cache = new Cache(3);
            cache.set("a", 1);
            cache.set(3, [1]);
            cache.set("c", {a: 1});
            cache.set("d", {a: 2});
            cache.set("e", 44);
            cache.set("f", "power pack");

            //assert
            expect(cache.get("a")).to.equal(false);
            expect(cache.get(3)).to.equal(false);
            expect(cache.get("c")).to.equal(false);
            expect(cache.get("d")).to.deep.equal({a:2});
            expect(cache.get("e")).to.equal(44);
            expect(cache.get("f")).to.equal("power pack");
        });
    });
    describe('Limit', () => {
        it('Allows for arbitrary limit', () => {
            let limit = 4321;
            let cache = new Cache(limit);
            for(let i = 0; i < limit; ++i){
                cache.set(i, -i);
            }

            for(let i = 0; i < limit; ++i){
                expect(cache.get(i)).to.equal(-i);
            }
        });
    });
});
