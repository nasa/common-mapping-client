/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// This is a stub file for application tests.
// See developer manual for more

import { expect } from "chai";

function stubFunction(input) {
    return !input;
}

describe("STUB TEST", () => {
    describe("a stub for your tests", () => {
        it("returns false for true", () => {
            let varIn = true;
            let varOut = false;

            //assert
            expect(stubFunction(varIn)).to.equal(varOut);
        });
    });
});
