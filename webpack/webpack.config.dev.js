/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

 const options = {
    node_env: "development",
    isProduction: false,
    devtool: "eval-source-map",
};

const config = require("./webpack.config.helper")(options);
const modConfig = require("./webpack.config.mod")(config);

module.exports = modConfig;
