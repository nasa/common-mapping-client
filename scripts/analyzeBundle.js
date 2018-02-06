/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import config from "../webpack/webpack.config.prod";

config.plugins.push(new BundleAnalyzerPlugin());

const compiler = webpack(config);

compiler.run((error, stats) => {
    if (error) {
        throw new Error(error);
    }

    console.log(stats); // eslint-disable-line no-console
});
