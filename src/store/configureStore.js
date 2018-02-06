/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

if (process.env.NODE_ENV === "production") {
    module.exports = require("./configureStore.prod");
} else {
    module.exports = require("./configureStore.dev");
}
