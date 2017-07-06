# 1.1.0 Release Jul 5th, 2017
## Summary
This release features a number of UI, build system, and deployment improvements, dependency upgrades, and several tweaks and bug fixes.

## Upgrade notes
The following sections will walk you through the new features to be aware of as well as any changes you will have to make when upgrading to this release.

#### Webpack 1 -> Webpack 2
We've upgraded to Webpack 2. If you haven't modified the webpack configurations you shouldn't need to worry about this, but if you have, go checkout the migration guide provided by Webpack [here](https://webpack.js.org/guides/migrating/). Not to worry, it's mostly changes in syntax, although if you have any special webpack loaders or plugins there's a very small chance some of them won't have been updated for 2.0.

#### Openlayers 3 -> Openlayers 4
We've upgraded to Openlayers 4. The biggest difference in OL4 is that we can now bring the library in as a standard npm package, so no more special import handling of the library! This means you must explicitly import all the Ol.\* functions as they are no longer bundled under one Ol object.

#### NPM Scripts
Several modifications to the scripts in `package.json` have been made for consistency as well as flexibility. Most importantly, instead of listing out all `test` script combinations, there is now a single `test` command that must be passed arguments such as `--includecoretests`, `--watch`, and `--nowebgl`. For a complete reference, please see the developer manual.

#### NPM Scripts
Several modifications to the scripts in `package.json` have been made for consistency as well as flexibility. Most importantly, instead of listing out all `test` script combinations, there is now a single `test` command that must be passed arguments such as `--includecoretests`, `--watch`, and `--nowebgl`. For a complete reference, please see the developer manual.

#### Timeline Updates
We've improved the behavior and rendering of the timeline and timeline resolution stepper. The timeline should now have more consistent tick behavior and formatting. We've also removed scroll-zoom in favor of discrete zoom levels accessible by resolution stepper and keyboard arrows.

#### Webpack Bundle Analyzer
We've added webpack bundle analzyer to help you get a breakdown of the size of items in your final webpack bundle. Read more about it [here](https://github.com/th0r/webpack-bundle-analyzer), but if you're curious, all you have to do is run `npm run analyze-bundle` for some juicy insights!

## Changes
 * [#222](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/222) - removed the uglier style overrides and commented out styles
 * [#221](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/221) - removed the long-press activation of the context menu
 * [#219](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/219) - Update CHANGELOG with output from generateChangelog script.
 * [#217](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/217) - Configurable 2D map extent
 * [#215](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/215) - Ignore test data by adding an exclusion pattern in .babelrc. Closes #188.
 * [#213](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/213) - Upgraded Openlayers to 4.2.0. Closes #208.
 * [#214](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/214) - Loading container fix
 * [#216](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/216) - Update EXAMPLE_PROJECTS. Closes #185.
 * [#206](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/206) - swapped direction of the resolution step buttons
 * [#204](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/204) - Npm scripts
 * [#205](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/205) - made favicon links relative to index.html
 * [#203](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/203) - Bundle analyzer
 * [#201](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/201) - Changed date slider resolution slider picker to slider instead of buttons. Closes #193.
 * [#200](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/200) - Timeline update
 * [#197](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/197) - Eslint config change and fixes
 * [#196](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/196) - Added auto-focus behavior to Share Component. In componentDidUpdate, …
 * [#194](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/194) - React webpack upgrade
 * [#182](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/182) - Ci build
 * [#180](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/180) - Set view
 * [#179](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/179) - made set extent not constrain resolution for openlayers. Fixes issue with shared urls not matching view in 2D
 * [#178](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/178) - Ol4
 * [#177](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/177) - Feature browser environment detection
 * [#169](https://github.jpl.nasa.gov//CommonMappingClient/cmc-core/pull/169) - made the 2D max zoom more reasonable. Closes #168

# 1.0.2 Release - Feb 23, 2017
## Summary
Patch update to make overriding and extending core reducer functions easier and more concise.

## Changes
* #164 : (PR) Reducer override changes

# 1.0.1 Release - Feb 21, 2017
## Summary
Patch update to address some consistency issues.

## Changes
* #162 : Switched back to using a url hash string instead of a query string for shareable urls (fixed Firefox display issue)
* #161 : Updated test WebGL test skipping for consistency across different platforms
* #158 : Updated Dockerfile and deployAssets for CI deployment

# 1.0.0 Release - Feb 16, 2017
## Summary
Initial release 🎉🎉🎉
