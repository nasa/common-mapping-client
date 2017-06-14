// This is a stub file for application tests.
// See developer manual for more


import { expect } from 'chai';

function stubFunction(input) {
    return !input;
}

describe('STUB TEST', () => {
    describe('a stub for your tests', () => {
        it('returns false for true', () => {
            let varIn = true;
            let varOut = false;

            //assert
            expect(stubFunction(varIn)).to.equal(varOut);
        });
    });
});