# Developer Manual (CMC Version 1.0)
A detailed guide on getting starting with the Common Mapping Client. This guide is aimed at developers who may not be familiar with many of these technologies and concepts but have used other JS frameworks before to build complex web applications. It is our hope that this document can serve as useful reference for the major aspects of the CMC system for CMC and Application Developers as well as some justification for why certain technology and architectural decisions were made.

## Table of Contents
1. [Terminology](#terminology)
2. [Installation guide](#installation-guide)
3. [Package.json Scripts Overview](#overview-of-commands-from-packagejson)
4. [Installing/removing packages via npm](#installing-uninstalling-npm)
5. [The CMC Core Philosophy](#cmc-core-philosophy)
  1. [General](#cmc-core-philosophy-general)
  2. [The "_core" Directory](#cmc-core-philosophy-core-directory)
  3. [Adding, Overriding, and Removing "_core" Functionality & Components](#cmc-core-philosophy-modifying-core)
  4. [Overriding configs](#cmc-core-philosophy-modifying-core-config)
6. [The CMC Build Process](#cmc-build-process)
  1. [Post-Install](#cmc-build-process-post-install)
  2. [Webpack](#cmc-build-process-webpack)
    1. [How CMC Uses Webpack](#cmc-build-process-cmc-webpack)
    2. [Development Mode](#cmc-build-process-development-mode)
    3. [Production Mode](#cmc-build-process-production-mode)
    4. [Brief Note on Cesium + Webpack Integration](#cmc-build-process-cesium-integration)
    5. [Brief Note on ESLint](#cmc-build-process-eslint)
  3. [Brief Note on Serving CMC](#cmc-build-process-serving-cmc)
7. [Styling CMC](#styling-cmc)
  1. [React UI Component Library (React-Toolbox)](#styling-cmc-react-toolbox)
  2. [SASS Usage](#styling-cmc-sass)
  3. [CMC Style Architecture](#styling-cmc-sass-architecture)
  4. [Overriding Core Styles](#styling-cmc-overrides)
  5. [Overriding React-Toolbox SASS Variables](#styling-cmc-overrides-react-toolbox)
  6. [Fonts](#styling-cmc-fonts)
    1. [When to use Roboto ](#styling-cmc-using-roboto)
    2. [When to use Roboto Mono](#styling-cmc-using-roboto-mono)
  7. [postCSS](#styling-cmc-postcss)
  8. [Favicon Generation](#styling-cmc-favicons)
  9. [Custom Icons](#styling-cmc-custom-icons)
8. [Components and State with React & Redux](#components-and-state-with-react-redux)
  1. [Things to Know about React/Redux](#things-to-know-about-react-redux)
  2. [CMC React & Redux Idioms](#cmc-react-redux-idioms)
    1. [In the Store](#cmc-react-redux-idioms-store)
    2. [With Maps](#cmc-react-redux-idioms-maps)
    3. [With D3](#cmc-react-redux-idioms-d3)
  3. [Notes on Optimizing React/Redux Performance](#optimizing-react-redux-performance)
    1. [Key Performance Areas](#optimizing-react-redux-performance-key-areas)
    2. [Additional Techniques in Improving Performance](#optimizing-react-redux-performance-additional-techniques)
    3. [Usage of ImmutableJS](#cmc-using-immutablejs)
9. [Mapping With CMC](#mapping-with-cmc)
  1. [Why Did CMC Choose Ol3 and Cesium?](#mapping-with-cmc-why-ol3-cesium)
  2. [Replacing these libraries](#mapping-with-cmc-replacing-libs)
  3. [Overview of the MapWrapper classes](#mapping-with-cmc-mapwrapper)
  4. [Notes on Map Performance](#mapping-with-cmc-note-on-performance)
10. [Brief Overview of Application Directory ](#cmc-application-directory)
11. [How to Write Tests in CMC](#writing-tests)
  1. [Testing Tools](#writing-tests-tools)
  2. [Running Tests](#writing-tests-running-tests)
  3. [Writing Tests for CMC](#writing-tests-cmc)
    1. [Simple Tests](#writing-tests-simple)
    2. [Tests using the Redux Store](#writing-tests-redux-store)
  4. [Writing Tests for CMC Core](#writing-tests-cmc-core)
  5. [Writing Tests for your Application](#writing-tests-your-application)
    1. [Normal Non-Core Test File](#writing-tests-normal-non-core)
    2. [Overriding, Modifying, or Ignoring a CMC Core Test](#writing-tests-modifying-core-tests)
  6. [Asynchronous Local Data Loading in Tests](#writing-tests-async-local-data)
  7. [Using beforeEach and afterEach](#writing-tests-beforeEach-afterEach)
  8. [Testing Asynchronous Behaviors](#writing-tests-async-behavior)
  9. [Test Coverage and Test Results](#writing-tests-code-coverage)
  10. [Karma.conf.js](#writing-tests-karma-conf)
12. [User Analytics](#user-analytics)
  1. [CMC Custom User Analytics](#user-analytics-custom-cmc)
  2. [Google Analytics](#google-analytics)
13. [Upgrading your Project to Latest Version of CMC](#upgrading-cmc)
  1. [When to Upgrade](#upgrading-cmc-when-to-upgrade)
  2. [Files to Watch out For](#upgrading-cmc-files-to-watch)
  3. [Upgrade Steps](#upgrading-cmc-steps)
14. [Layer Ingestion Additional Services](#layer-ingestion-additional-services)
15. [Deployment to Github Pages](#deployment-to-gh-pages)
17. [Main Technologies Under the Hood](#main-tech-under-the-hood)
18. [Contributing to CMC](#contributing-to-cmc)


<a id="terminology">
## Terminology
Some terms and synonyms that you will see throughout this document
* **CMC Core**: This repository. Also known as "CMC" and "Core"
* **Application Developer**: Developers using CMC to create their own applications and are not necessarily contributing to the CMC Core project. Also known as "Non-Core Developers".

<a id="installation-guide"/>
## Installation guide
Make sure you have [NodeJS](https://nodejs.org/en/) 4.4 or higher installed before continuing.

Once you have a copy of the project, install all the dependencies and prep the project for development by running:

* `npm install`

Next, start the development server by running:

* `npm start`

Your default browser should open to `localhost:3000` and you should see the default CMC application.

To create a production build run:

* `npm run build` (may take a few minutes)
* `npm run open:dist` (to open the build using the included node server)

<a id="overview-of-commands-from-packagejson"/>
## Package.json Scripts Overview

The scripts defined in `package.json` are used to control various aspects of application installation, development, testing, and building.

| **Script** | **Description** |
|----------|-------|
| prestart | Runs automatically before start. Calls remove-dist script which deletes the dist folder. This helps remind you to run the build script before committing since the dist folder will be deleted if you don't. ;) |
| start | Runs tests, lints, starts dev webserver, and opens the app in your default browser. |
| open:src | Serve development version of the app using babel-node |
| open:dist | Serve production version of the app using babel-node |
| lint:scripts | Runs ESLint on build related JS files. (eslint-loader lints src files via webpack when `npm start` is run) |
| clean-dist | Removes everything from the dist folder. |
| remove-dist | Deletes the dist folder. |
| build:html | Copies src/index.html into /dist/index.html |
| prebuild | Runs automatically before build script (due to naming convention). Cleans dist folder, builds html, and builds sass. |
| build | Bundles all JavaScript using webpack and writes it to /dist. |
| build:open | Bundles all JavaScript using webpack and writes it to /dist and opens the built app in browser. |
| test | Runs tests (files ending in .spec.js) using Mocha and outputs results to the command line. |
| test:watch | Runs tests (files ending in .spec.js) using Mocha and outputs results to the command line.  Watches all files so tests are re-run upon save. |
| test:cover | Runs tests (files ending in .spec.js) using Mocha and outputs results to the command line and generates a test coverage report, saved in the `coverage` folder. | 
| test:cover | Runs tests (files ending in .spec.js) using Mocha and outputs results to the command line and generates a test coverage report, saved in the `coverage` folder. Watches all files so tests are re-run upon save. |
| postinstall | Copies over certain node_module files, libraries, sets up other stuff, etc. |
| postbuild | Runs the postbuild script |
| deploy | Runs the deploy script |
| analyze-bundle | Analyzes webpack bundles for production and gives you a breakdown of where modules are used and their sizes via a convenient interactive zoomable treemap |

<a id="installing-uninstalling-npm"/>
## Installing/removing packages via npm
NPM packages are installed and removed using the following commands. The `--save` flag tells NPM to save/remove the specified packages from your `package.json` file.
* Install a package : `npm install <package_name> --save`
* Remove a package : `npm remove <package_name> --save`

<a id="cmc-core-philosophy"/>
## The CMC Core Philosophy

<a id="cmc-core-philosophy-general"/>
### General
As is stated in the README, the Common Mapping Client aims to be a production-ready starting point for complex mapping applications. To avoid bloat and feature creep, if a capability or widget is not needed in the majority of mapping applications, it will not be part of CMC.

<a id="cmc-core-philosophy-core-directory"/>
### The "_core" Directory
Inside of the `src/_core` directory lives the bulk of the CMC Core application code. This is code that an Application Developer should only need to reference, duplicate and modify, or exclude. Separating Core code out is helpful for maintaining a lean codebase as well as providing a clean method for upgrading to newer versions of the Core codebase without affecting/breaking the Application Developer's work.

<a id="cmc-core-philosophy-modifying-core"/>
### Adding, Overriding, and Removing "_core" Functionality & Components
It is **strongly** recommended that all of the work you do is **outside** of `src/_core` to avoid future merge conflicts with new versions of CMC Core (upgrading will be discussed later on in this document) and to keep a clean reference to the Core code. It is also recommended that you duplicate whatever folder structure you need from Core in the parent `src` folder. Similar to components, you can swap out utility Reducer functions by changing imports in `src/reducers/index.js`, and change styles by overriding them with SASS in `src/styles.scss`. Also note that to override MapWrapper classes (which are described in more detail later) you should modify the imports in `src/utils/MapCreator.js` and substitute or add your own MapWrapper class. By default uses layer, palette, help information, and metadata from `src/default-data/_core_default-data/`. When you create your own application it is recommended that you not modify the `_core_default-data` folder and instead add your own folder along side containing your own data.

All of the Core Components, Reducers, configurations, styles, tests, utils, etc., are imported (directly or indirectly as dependencies) into the application using the `_core/components/App/AppContainer.js` which is the root React Component in `src/index.js`. Please note that for the Reducer functions (discussed later in the section regarding React & Redux) the Core imports are done in `src/reducers/index.js`.

An Application Developer can choose to use CMC Core's AppContainer as it is and merely change config files to fetch different map layers or you can build your own AppContainer to remove/duplicate/modify Core components or add your own entirely new components. To do this, modify `src/index.js` to point at `src/components/App/AppContainer` instead of `src/_core/components/App/AppContainer` and edit the former accordingly.

**To Override/Extend a Core Reducer**: Create a new reducer function that uses a new state model (if desired) or a new reducer class (if desired). For the reducer class, you must pass a reference of this class to the Core reducer function otherwise it will default to using the Core reducer class. Let's use the example of extending the map reducer to use a new state model that defaults the view to 3D mode and modifying the Core setLayerActive function. Create/modify the following files:


_reducers/models/map\_Extended.js_
```JS
import Immutable from 'immutable';
import { mapState } from '_core/reducers/models/map';

export const mapState_Extended = mapState.mergeDeep(Immutable.fromJS({
    "view": {
        "in3DMode": true
    }
}));
```

This new state model overrides the Core state model just enough to change the default view mode. It must still be imported in a reducer function to have any effect.

_reducers/reducerFunctions/MapReducer\_Extended.js_
```JS
import MapReducer from '_core/reducers/reducerFunctions/MapReducer';
import * as appStrings from '_core/constants/appStrings';

export default class MapReducer_Extended extends MapReducer {
    static setLayerActive(state, action) {
        console.log("Modified Action");
        return MapReducer.setLayerActive(state, action);
    }
}
```

This new reducer class extends the Core reducer class and overrides the `setLayerActive()` method just to add a log statement before executing normally. It must still be imported in a reducer function to have effect.

_reducers/map\_Extended.js_
```JS
import { mapState_Extended } from 'reducers/models/map_Extended';
import map from '_core/reducers/map';
import MapReducer_Extended from 'reducers/reducerFunctions/MapReducer_Extended';

export default function map_Extended(state = mapState_Extended, action, opt_reducer = MapReducer_Extended) {
    switch (action.type) {
        default:
            return map.call(this, state, action, opt_reducer);
    }
}
```
 
This reducer function imports the new model and reducer class, it sets the new state model as the default and passes the new reducer class to the Core reducer function which will use that class reference for all of its actions. It must still be imported into the `index.js` reducer to have effect.

_reducers/index.js_
```JS
import { combineReducers } from 'redux';
import view from '_core/reducers/view';
import map_Extended from 'reducers/map_Extended';
import settings from '_core/reducers/settings';
import help from '_core/reducers/help';
import layerInfo from '_core/reducers/layerInfo';
import share from '_core/reducers/share';
import dateSlider from '_core/reducers/dateSlider';
import asynchronous from '_core/reducers/async';
import analytics from '_core/reducers/analytics';
import alerts from '_core/reducers/alerts';

const rootReducer = combineReducers({
    view,
    map: map_Extended,
    settings,
    help,
    layerInfo,
    share,
    dateSlider,
    asynchronous,
    analytics,
    alerts
});

export default rootReducer;
```

This new index reducer replaces the Core map reducer function with the new map_Extended reducer function. When this modfied application is run, the default view should now be in 3D and you should see a log statement of "Modified Action" every time a layer is activated/deactivated.

In general, the best way to start altering a part of `_core` is to copy the piece into an area outside of `_core`, make the modifications you want then alter the imports necessary to use your new version. It is sometimes the case that these alterations are recursive in nature (e.g. if `_core/A` imports `_core/B` and you want to modify `_core/B` you will need a new `B` and a new `A` to import it). If you are familiar with inheritance and composition, be sure to check if your altered version can simply extend the `_core` version and thus save you quite a bit of code duplication and management. Look through the [Example Projects](https://github.jpl.nasa.gov/CommonMappingClient/cmc-core/blob/master/docs/core-docs/EXAMPLE_PROJECTS.md) to see these approaches in action.

<a id="cmc-core-philosophy-modifying-core-config"/>
### Overriding configs
There are three areas of configuration:

1. CMC Core: `src/_core/constants/appConfig.js`
    * exports config parameters as individual variables
    * overrides none
    * built into `bundle.js` with webpack
2. CMC App: `src/constants/appConfig.js`
    * exports config parameters as a single, unified variable
    * overrides CMC Core
    * built into `bundle.js` with webpack
3. Ops: `src/config.js`
    * exports config parameters as a single unified variable
    * overrides CMC App
    * not built into `bundle.js`

The goal of these different sections is to allow CMC Core and CMC App developers to create and modify configurations without stepping on each other's toes and provide a mechanism for a built app to have it's configurations modified after deployment. Take the example of the `APP\_TITLE` and `APP\_VERSION` parameters. In Core they may be (`APP\_TITLE = "CMC Core"; APP\_VERSION = 2.6;`) but a subsequent application would want the configuration to be (`APP\_TITLE = "My App"; APP\_VERSION = 1.0;`) so they override those parameters in `src/constants/appConfig.js`. Let us then suppose that a backend service is updated and so the version of the app should be bumped to reflect that change. Since there is no reason to modify the frontend client, the Ops team can override those parameters to be (`APP\_TITLE = "My App"; APP\_VERSION = 1.1;`) in `dist/config.js` (which is a copy of `src/config.js` created at build time) without needing a new build or deployment of the app.

These overrides/additions are accomplished by adding the parameters into the `APP_CONFIG` object in `src/constants/appConfig.js` and into the `APPLICATION_CONFIG` object in `src/config.js`.

<a id="cmc-build-process"/>
## The CMC Build Process
![It's really quite straight forward](https://github.jpl.nasa.gov/CommonMappingClient/cmc-design/blob/master/screenshots/black_box.png)

The following sections outline the build process for CMC following installation (`npm install`) which involves copying files and folders, configuring and running Webpack to combine, compile, and minify code, running a development server, and much more. While it may seem a little overwhelming, Application Developers may never actually need to modify most of these steps. 

<a id="cmc-build-process-post-install"/>
### Post-Install
After `npm install` runs successfully, npm automatically looks for a script called `postinstall`. The `package.json` file contains a script called `postinstall` which points to a shell script `scripts/postinstall.sh`, so npm sees this and runs this script. This `scripts/postinstall.sh` script is used to add the `assets/assets` folder for serving static files asynchronously in production. After the folder is added, several libraries and images from `node_modules`, `src/_core`, and `lib` are added into `assets/assets`. Serving files from `assets/assets` is a useful last resort approach for files that aren't behaving well with webpack, libraries that require asynchronous  loading of files and data (like Cesium), etc.

**Why `assets/assets`?** Good question. Our development node server serves multiple directories as if they were contained in one root directory. We created this assets structure in order to mimic what the production environment really looks like.

<a id="cmc-build-process-webpack"/>
### Webpack
In short:
> webpack takes modules with dependencies and generates static assets representing those modules.

Webpack is one of the most popular module bundlers or build systems for web applications (as of early 2017) and continues to increase in popularity and stability. Webpack was chosen for CMC over other build systems because almost every React/Redux starter kit and project uses Webpack. Alternatively you could use a combo of grunt/gulp/browserify/etc/etc if you really think some other combo is better.

CMC uses webpack version 1 for now although weback version 2 is coming out as of early 2017 so CMC may upgrade to the new version if time and stability permit. Read more about webpack version 1 over in the docs [here](https://webpack.github.io/docs/).

Webpack is complicated and does a lot but once you get over the learning curve (or avoid it entirely and just tweak existing configurations) it's great, very flexible, and does a lot right out of the box. Webpack is driven from a JS configuration file (or multiple files in our case for development and production).

<a id="cmc-build-process-cmc-webpack"/>
##### How CMC Uses Webpack
CMC uses two Webpack configurations (three really, the last one is a clone of webpack.config.dev.js living inside of karma.conf.js but ignore that for now).

`webpack.config.helper.js`, is the main webpack configuration file. It defines a general build pipeline for CMC assets and includes specific options for the dev/prod configs to override. It outputs built assets under the `dist` directory. When configured for dev, it includes [JS/CSS sourcemaps](http://blog.teamtreehouse.com/introduction-source-maps) for debugging as well as [hot module replacement](https://webpack.github.io/docs/hot-module-replacement-with-webpack.html) and live reloading via [BrowserSync](https://browsersync.io/) for automatic reloading of certain pieces of code and CSS while maintaining application state and without refreshing the page. In production mode, it creates the optimized, minified, uglified, duplicate dependency reduced, static application output.

<a id="cmc-build-process-development-mode"/>
##### Development Mode
When you are developing an application using CMC, you will most often want to use the development webpack configuration. This configuration is most easily used by running the `npm start` command which in turn runs `npm run open:src` which runs `scripts/srcServer.js` using node. This script imports the development webpack configuration and uses browserSync to serve the output files and enable hot module reloading. If you take a look at the size of the output bundle in a browser development tool you'll see that it's quite large. This is normal since the bundle is not optimized at all and contains many sourcemaps. Not to worry though, the final production bundle will be much smaller. When you first boot up the development server it may take a few seconds but will then be fairly quick to live reload (e.g. if you change and save some CSS you should see the actual page CSS change almost instantly). Also note that no files are actually output during the development build and are instead served in-memory. For more information on development webpack configuration please view [https://webpack.github.io/docs/](webpack documentation). The development configuration is also thoroughly commented.

<a id="cmc-build-process-production-mode"/>
##### Production Mode
The production webpack configuration is useful for creating optimized static builds of your application. As a result, all of the development tools like sourcemaps, hot reloading, etc., are not used. The main use of this configuration is for when you want to deploy your application out to your users, so you won't be running it very often yourself (although your Continuous Integration Service might be) since the build can take up to a few minutes to complete. However, it can be useful to run the build every so often (even if you have a CI/CD service) to:
- Determine the final file size of output resources like bundle.js and styles.css
- Profile performance-critical parts of your application since the built version of the app will generally be slightly more performant than the development version

The production configuration is most easily used by running `npm run build`. However, npm is aware of the keyword `build` and will run the `prebuild` command if one exists. In our case we use `prebuild` to clean the output distribution area using `npm run clean-dist` and then run `npm run build:html` which runs `scripts/buildHtml.js` which reads in `src/index.html` and moves it into `dist`, modify this script if you ever want to modify `index.html` during the build process.

After `prebuild` has successfully run, npm will run `scripts/build.js`. This script configures webpack using the production configuration and runs webpack to create the final bundled output. 

After the build has run, npm automatically looks for a script called `postbuild` which we also have specified in `package.json`. Now `scripts/postbuild.sh` runs and copies over `src/default-data` and `assets/*` into the output `dist` directory so they can be accessed asynchronously after application load.

Now you should have a completed production application inside of `dist` that you can run anywhere. If you would like to open the production application using the server provided by CMC you can run `npm run open:dist` which uses browserSync (with hot module replacement and livereload disabled). You can also run `npm run build:open` to have the server automatically start after build success.

<a id="cmc-build-process-cesium-integration"/>
##### Brief Note on Cesium + Webpack Integration
Most libraries are easily used with Webpack but on occasion some libraries require a bit more work, such as complex libraries like CesiumJS. CesiumJS uses lots of extra assets and doesn't fit the typical mold of a modular javascript library, meaning you can't just `import cesium` and be done. The following steps from CesiumJS.org were used as basis for integration with CMC webpack setup [https://cesiumjs.org/2016/01/26/Cesium-and-Webpack/](https://cesiumjs.org/2016/01/26/Cesium-and-Webpack/). In short, webpack receives a few config tweaks, the main CesiumJS file is loaded using the webpack script loader which executes the script once in global context, Cesium requests extra static resources on demand from the assets folder, and CMC maps the global cesium variable to a instance variables for consistency.

<a id="cmc-build-process-eslint"/>
##### Brief Note on ESLint
CMC uses [ESLint](http://eslint.org/) to report JS syntax and style issues. ESLint is configured via a file at the root of the repository called `.eslintrc` which contains many configuration items that tell ESLint what plugins, rules, and exceptions to use when linting your JS code. Some of these rules you may may want to alter globally from this file if you have different preferences. For example if you want to remove the ESLint rule warning against using `var` in your JS (since you use `const` and `let` instead in ES6) you can set
```JSON
"no-var": 1 
```
to 
```JSON
"no-var": 0
```
_Please, please, don't disable this rule though. Use `const` and `let`! Embrace ES6!_


There may also be situations in which you only want to ignore certain cases in your code where you are forced to break certain rules. In this case, you can use ESLint comments in your code to tell ESLint to ignore a certain rules in certain places. For example, the CMC Core Help component `/src/_core/components/Help/HelpContainer.js` ignores the `react/no-danger` ESLint rule that is normally active to warn developers against using the risky-if-not-used-properly React [dangerouslySetInnerHTML](https://facebook.github.io/react/docs/dom-elements.html#dangerouslysetinnerhtml). In this case, CMC uses the attribute since it needs to insert some HTML (from Markdown files) in string form without explicitly parsing content and building HTML elements. To suppress the ESLint warning for this particular case, CMC uses the following ESLint inline comment syntax: 

```JSX
<div className={!this.props.helpPage ? 'hidden' : 'help-page'} 
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{__html: this.helpPageContent[this.props.helpPage]}} 
/>
```

Other forms of ESLint ignore comments are used in CMC. Learn more about ESLint and the different ways to suppress rules [http://eslint.org/docs/user-guide/configuring](http://eslint.org/docs/user-guide/configuring).

<a id="cmc-build-process-serving-cmc"/>
### Brief Note on Serving CMC
CMC ships with a BrowserSync server used to serve development and production versions locally. BrowserSync is great for development and testing but is not ideal for real world production use. Instead, use whatever static file server you're comfortable with like NGINX or Apache to serve your production `dist/` directory.

<a id="styling-cmc"/>
## Styling CMC
The following sections outline how CMC is styled, how CMC styles are written, organized, and overwritten. 

<a id="styling-cmc-react-toolbox"/>
### React UI Component Library (React-Toolbox)
[React-Toolbox](http://react-toolbox.com/) is a React UI Component library
that follows [Google's Material Design Standards](https://material.google.com/). React-Toolbox was chosen for CMC because React-Toolbox is fairly complete component-wise, does not inline CSS, and exposes most of the necessary selectors for overriding and tweaking its components. In general React-Toolbox was found to be more overridable and complete than most other React component libraries. At times certain CSS hacks _are_ necessary to style or fix certain components that don't expose the desired elements with classes or data-react-toolbox attributes.

**Why don't you like inline CSS**? Inline CSS is very difficult to override. The only option is to use `!important` which creates very brittle style structures. CMC was unable to find any component library that required no style modifications to suit it's needs (which is quite a common problem) and so the ability to modify styles cleanly and consistently was paramount.

<a id="styling-cmc-sass"/>
### SASS Usage
CMC uses SASS which is a popular CSS extension language. From SASS's [site](http://sass-lang.com/documentation/file.SASS_REFERENCE.html):

>Sass is an extension of CSS that adds power and elegance to the basic language. It allows you to use variables, nested rules, mixins, inline imports, and more, all with a fully CSS-compatible syntax. Sass helps keep large stylesheets well-organized, and get small stylesheets up and running quickly...

<a id="styling-cmc-sass-architecture"/>
### CMC Style Architecture
CMC SASS files are separated into a few sections. The bulk of CMC Core styles are in `src/_core/styles`. In this directory are the SASS files for each Core React component. Note that SASS files use a syntax called SCSS and therefore use the `.scss` file extension name. All Core React component styles are `@import`ed into the `src/_core/styles/styles.scss` file which is the master Core style file which also contains all non-component specific styles. If Core component styles are not imported into this main file they will not be included in the application. Also in this file are imports of:

- [normalize.css](http://necolas.github.io/normalize.css/) - Used for more consistent cross-browser element rendering
- [flexboxgrid.min.css](http://flexboxgrid.com/) - A responsive grid system based on the CSS `flex` property
- [Google's Material Icon font](https://material.io/icons/) - used as primary application icons, note that not all icons on the site are included in the icon font

Note that some styles and fonts _are_ loaded outside of these stylesheets. In `index.html` there are imports of:

- [mapskin.min.css](http://mapsk.in/) – A collection of scalable geospatial vector icons
- [Roboto](https://fonts.google.com/specimen/Roboto) & [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono) – The two fonts used in CMC

Other important SASS files are:

- `src/styles/_theme.scss` - Used to override certain React-Toolbox variables
- `src/styles/_variables.scss` - Used to define non-React-Toolbox variables for use in all CMC SASS files
- `src/styles/styles.scss` - Used for non-Core style imports

<a id="styling-cmc-overrides"/>
### Overriding Core Styles
You can override Core styles by modifying `src/styles/styles.scss` to either override Core styles or by removing the import of `src/_core/styles/styles.scss` and importing only certain Core SASS files.

<a id="styling-cmc-overrides-react-toolbox"/>
### Overriding React-Toolbox SASS Variables
Many React-Toolbox components use SASS variables that can be overridden. Many of these variables are already overridden by Core in `src/styles/_theme.scss`. To find the React-Toolbox SASS variable names that can be overridden, dig around in `node_modules/react-toolbox/`. Many primary variables are defined in `node_modules/react-toolbox/components/_globals.scss` but many more are defined in SASS files that live alongside the React-Toolbox component sources, like `node_modules/react-toolbox/components/button/_config.scss`. Re-assigning something like `$button-neutral-color` in `src/styles/_theme.scss` will change the value for React-Toolbox components, making theming and recoloring fairly simple. For more on theming, check out the [cmc-example-dark-theme](https://github.jpl.nasa.gov/CommonMappingClient/cmc-example-dark-theme) repository.

<a id="styling-cmc-fonts"/>
### Fonts
CMC tries to stay within the Material Design specification by using Google's [Roboto](https://fonts.google.com/specimen/Roboto) and [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono) fonts. React-Toolbox is built to use Roboto and CMC attempts to mirror and/or inherit font choices made by React-Toolbox in CMC components. 

<a id="styling-cmc-using-roboto"/>
##### When to use Roboto 
Roboto is recommended for everything from titles to labels to paragraphs. CMC only uses three weights of Roboto – 300, 400, and 500 to keep load times down since fonts are large. If you need more weights feel free to add some more.

<a id="styling-cmc-using-roboto-mono"/>
##### When to use Roboto Mono
Roboto Mono is recommended for use as a contrasting font in limited cases including title font, numerical displays (like dates, slider amounts, counters, timeline labels, etc.) but should be avoided for default use. CMC uses three weights of Roboto Mono – 300, 400, and 700. 

<a id="styling-cmc-postcss"/>
### postCSS
CMC uses [postCSS](http://postcss.org/) in both it's development and production webpack build processes. PostCSS provides a framework for CSS plugins that make writing CSS easier. CMC uses [PostCSS's autoprefixer](github.com/postcss/autoprefixer) that automatically adds vendor prefixes from [Can I Use](caniuse.com) to your CSS to ensure cross-browser compatibility. For example, take this snippet of CSS.

```CSS
transition: opacity 0.1s linear 0s;
```

Normally to ensure cross-browser compatibility you'd want to look up and add all of the different browser prefixes for the `transition` property. (Note that this example is a little overkill since CMC does not support many of these older browser versions)

```CSS
-webkit-transition: opacity 0.1s linear 0s; /* Chrome < 26, Safari < 7 */
   -moz-transition: opacity 0.1s linear 0s; /* Firefox < 16 */
     -o-transition: opacity 0.1s linear 0s; /* Opera < 12.10 */
        transition: opacity 0.1s linear 0s; /* IE10+, Firefox 16+, Chrome 36+, Opera 12.10 */
```

This is a huge pain and it means you have to constantly change multiple copies of the same CSS property over and over. Luckily, autoprefixer solves this problem by automatically adding these browser prefixes to your CSS, meaning you can stick to only writing the standard version of the property:

```CSS
transition: opacity 0.1s linear 0s;
```

There are many other PostCSS compatible plugins that you may find useful so feel free to add more.

<a id="styling-cmc-favicons"/>
### Favicon Generation
CMC uses the NASA meatball favicon by default. The favicon is specified in `index.html` using the following imports:

```HTML
<link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png">
<link rel="icon" type="image/png" href="/img/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="/img/favicon-16x16.png" sizes="16x16">
<link rel="manifest" href="/img/manifest.json">
<link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#5bbad5">
<link rel="shortcut icon" href="/img/favicon.ico">
<meta name="msapplication-config" content="/img/browserconfig.xml">
```
Favicons specification varies quite a lot based on browser, device, and screen size and pixel density, so CMC used [http://www.favicon-generator.org/](http://www.favicon-generator.org/) to generate all of the necessary favicons (note that the list CMC uses may be a subset of the full output).

<a id="styling-cmc-custom-icons"/>
### Custom Icons
When Material icons or Mapskin icons do not contain the icon you are looking for, you can easily add your own svg icon. CMC uses several custom icons and you can look in `src/_core/components/Share/ShareContainer.js` for a complete example, but in short the process involves declaring your icon  as shown below and tweaking the CSS, viewBox, and svg parameters.

```JSX
const FacebookIcon = () => (
    <svg className="shareIcon FacebookIcon" viewBox="0 0 24 24">
        <path fill="white" d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" /> 
    </svg>
);
```

<a id="components-and-state-with-react-redux"/>
## Components and State with React & Redux
[The React framework](https://facebook.github.io/react/) let's you break all of your UI components up into independent modules. Those modules then base their rendering on a state machine you define for them and React takes care of
efficiently determining when and how much to edit the DOM. [Redux](http://redux.js.org/) centralizes that state machine and creates a single data flow path to keep everything coherent. In general, try to keep every aspect of the rendering located and editable in the state.

Most of the syntax for components and the file structure paradigm are driven by Redux more than React. Here are the main pieces of React/Redux that we deal with:

* **Store** - Wraps the application state and provides an API to dispatch _actions_ that create a new state. The store will then pass that new state to React to render the new application state in the DOM.
* **State** - One big object that represents the current state of the application. The combination of this and the reducers constitutes the application's state machine.
* **Reducers** - These functions accept the current state of the application and an action object. They then perform an update to create the new application state that will be passed back to the store.
* **ReducerFunctions** - These are the actual function definitions that the Reducer will call to modify the state. This layer of indirection was developed in CMC to make overrides and expansion of Core reducers cleaner.
* **Actions** - These are JS objects, or functions that return JS objects, that contain action definition data. In CMC Core, the functions under `Actions/` create these objects.
* **Components** - These are the React objects that define a component's render logic within the DOM. They track some subset of the application state to base their rendering on and can dispatch actions to modify the application state.
* **Containers** - These are Components that primarily aggregate smaller components. They will often track very little state but may define a common action abstraction that is passed to children components. They let you group related components together while isolating their rendering.
  * _Note_: CMC Core does not strictly adhere to this definition at present but is slowly migrating to this paradigm
* **Models** - These are smaller pieces of the application state that let you modularize state and create re-usable object models.
  * _Note_: This is not strictly a React/Redux idiom
* **Constants/ActionTypes** - These are constant strings that are used to uniquely identify actions. They are not strictly necessary but are useful to avoid simple errors.

<a id="things-to-know-about-react-redux"/>
### Things to Know about React/Redux

#### A diagram of the data flow

This data flow demonstrates how an interaction flows from the user through Redux/React and back to the user. The simple example is of a switch that toggles on and off. Notice how the actual DOM that the user sees isn't updated until the end.

![Data flow diagram](https://github.jpl.nasa.gov/CommonMappingClient/cmc-design/blob/master/screenshots/data_flow.png)

Read up on [ReactJS](facebook.github.io/react/) and [ReduxJS](http://redux.js.org) for more detailed information.

#### Render Time Matters
After a state change, React will find all components that are affected (i.e. those components that track the changed piece of state), perform a render of those components in their virtualDOM, performs a diff between their virtualDOM and the current DOM to determine which pieces of the DOM need changing, then update the DOM accordingly. If you have many sequential state updates, your application can quickly become bogged down in this cycle. Some steps to optimize this process are:

 * Break up your components into more isolated pieces (wrapping them in a container lets you continue to think of them as a whole)
 * Reduce the amount of state each component tracks
 * Make liberal use of `shouldComponentUpdate()` in your components to skip unnecessary renders
 * Track pieces of state as instance variables within components and use `forceRender()` to shortcut the entire process
   * **Note**: this is not often recommended as it circumvents the Redux paradigm of a single state, but CMC Core has found this approach useful when performance becomes bottlenecked

#### Dispatched State Updates are Synchronous
When a component dispatches an action to the Redux store, the store will update the state and push the update to React. React will then go through it's render process. Once completed the call to the dispatch will return. 

#### Components Get Updated Props Even if `shouldComponentUpdate()` Returns `false`
If a component needs to track a piece of state to dispatch actions but doesn't need it to determine its rendering, `shouldComponentUpdate()` can return false when that piece of state changes but it will still have the updated piece of state when dispatching the action.

#### Asynchronous Actions use Functions that Return Promises
Take the example of loading an external file, `file.json`. A component would dispatch an action that is a function that returns a Promise. The Promise will be tracked by the Thunk middleware in the CMC store. For an example of this, look at `loadInitialData()` in `src/_core/Actions/LayerActions.js`.

<a id="cmc-react-redux-idioms"/>
### CMC React & Redux Idioms

<a id="cmc-react-redux-idioms-store"/>
#### In the Store
CMC uses [Thunk Middleware](github.com/gaearon/redux-thunk) in its store to allow for actions that perform asynchronous operations (such as fetching external resources). In a future version, we may also include something like [Redux Batched Updates](github.com/acdlite/redux-batched-updates) to remove unwanted renderings.

<a id="cmc-react-redux-idioms-maps"/>
#### With Maps
In its purest the form, React and Redux would have the currently displayed DOM be simply a reflection of what is in the state. This places a heavy burden on React as it must perform a diff between the current and next DOM on each state update. This also means that you are expected to place all rendered components in the React/Redux cycle so that React can take care of those changes for you. However, this paradigm breaks for thinks like maps because their rendering is handled by mapping libraries and are often rendered directly on a canvas element, which has no discernible DOM updates to manage. A React idiomatic approach would be:

1. On each state change, read the expected state of the map and the current state of the map
    1. e.g. Which layers are active? What are their opacities? Their order? What are the current lat/lon bounds on the view?
2. Compare the two states
3. Perform the necessary updates on the map to conform it to the expected state

The issue with this approach simply one of scale. There are so many aspects of map rendering which may or may not be library specific that building out this diffing ability would be beyond cumbersome and slow. Instead, CMC takes the following approach:

1. On each dispatch to the store (e.g. to turn on a layer)
2. Perform the update on the map object
3. Update the state accordingly
  1. If the update succeeded, set the layer object in the state to active
  2. If the update failed, do not update the layer object in the state but add an error alert
4. Return the updated state

This allows CMC to avoid tracking any map state except for what is needed by components to render correctly as well as skip large amounts state comparisons.

This deviation in data flow is shown below. In this diagram, we use the same premise as the data flow diagram above with one change, the switch will now toggle a layer on the map on or off. Notice how the DOM for the switch is again not updated until the end but the map is updated from within the reducer itself.

![Data flow diagram - map](https://github.jpl.nasa.gov/CommonMappingClient/cmc-design/blob/master/screenshots/data_flow_maps.png)

<a id="cmc-react-redux-idioms-d3"/>
#### With D3

[D3](https://d3js.org/) is a big, powerful graphics/math/data library. In this application it is primarily responsible for rendering the TimeAxis and associated components, though it has capabilities far beyond that which we encourage you to use. In relation to React/Redux, D3 essentially replaces the React rendering functions. We create a React component to manage the data flow between D3 and the rest of the application as well as provide a sane DOM entry point for D3. D3 then takes the DOM node and data from the state machine to perform its own rendering.

This flow is very similar to how maps are handled in CMC with the main difference being that updates are handled from within the component instead of the reducer. In this way, the React component acts essentially as a wrapper around the D3 component that it creates as an instance variable.

Here is a data flow diagram to demonstrate this. In this example we are again toggling on a switch, however here we are assuming the switch is a D3 component. Notice how the render cycle behaves normally up until component render time at which point the changes to the DOM are offloaded to D3 and React does not need to do anything.

![Data flow diagram - D3](https://github.jpl.nasa.gov/CommonMappingClient/cmc-design/blob/master/screenshots/data_flow_d3.png)

<a id="optimizing-react-redux-performance"/>
### Notes on Optimizing React/Redux Performance
This is a collection of things CMC has run into in its development but there is a wealth of information out there on optimizing React/Redux applications so please don't stop here if you're interested in boosting your application's performance. And remember kids, **Measure First, Optimize Later**

<a id="optimizing-react-redux-performance-key-areas"/>
#### Key Performance Areas
  * **React's Render Cycle**: Specifically the section after the reducers have updated the state and React is now updating the components and UI. As explained above, React has to do a fair amount of work to decide what needs updating, how to update it, and to actually update the DOM. This section if likely to be the most profitable in terms of increasing performance. Methods to improve this section are:
    * Use logging or React-DevTools to profile which components are rendering when
    * Reduce the number of props and amount of state components rely on
    * Use smaller, more isolated components
    * Use `shouldComponentUpdate()` to cut down on unnecessary renders
    * Use instance variables and `forceUpdate()` within components to skip the Redux/React cycle entirely. This will force React to go straight to a render of the component, skipping all the steps in between. Note that this technique is not often recommended as it circumvents the Redux paradigm of a single state. The only times this technique is really appropriate is with state changes/renderings that can safely live outside the central state without harm to the user. These should be very small things and there is no hard and fast rule for defining them.
    * Use middleware to batch your updates. In some cases, there are several state updates that happen sequentially. It may not be necessary to render the states in between these actions so using middleware to roll all the state updates into one avoids this issue entirely in some cases.
    * Delay/Batch updates for individual components. For this, we'll use the example of the `src/_core/components/Share/ShareContainer.js` component. It needs to remain constantly up to date with the state of the application so that at any time the user can copy the url from the browser to share the application with someone else. That means that on each state update, the ShareContainer has to update. With certain action sequences (such as adjusting layer opacity) it's very possible for the call to render to come 100+ times in under 0.5sec. The actual render time for this component is non-trivial as it is reading a large amount of the state and constructing a string to represent that state. To cut down on the need for rendering this component, CMC implemented a timeout that waits 0.5s from when a render is first fired to actually read the state and render itself. That effectively batches all the state updates that occur within that 0.5s together so that the number of renders required for that component has been reduced from 100+ to 1.
  * **Reducer Functions**: State updates can be costly, depending on your data structures and the extent of changes needed. CMC uses ImmutableJS to keep state updates isolated from each other and to provide high performance data structures. Some tips to improve in this section are:
    * Use Immutable.Maps instead of Immutable.Lists when possible. ImmutableJS provides nearly identical APIs for Maps and Lists. It may not always make sense to use a Map but they provide constant time data access which can be a major boon in many cases.
    * Make state changes as functional as possible. The fewer extraneous actions that occur in each reducer, the better.
  * **Layer Rendering on the Map**: For a layer to render, the mapping library will need to fetch the resources (images/data files) necessary, decode those resources, then draw them onto the canvas. It must repeat that process whenever the map view changes or layers are added/removed. Ways to improve this are:
    * Use tiled datasets. This allows the library to parallelize resource gathering and cache resources more efficiently
    * Don't use large vector datasets. This goes along with tiling but large vector datasets require a greater amount of computation to render.
  * **Beware D3 Renderings**: Rendering in D3, if done too often with fancy transitions can easily hog CPU power since (unlike React) there is no DOM diffing done to avoid unnecessary renderings. Pay attention to your D3 components to ensure they render only when needed and that your svg transitions are simple.

<a id="optimizing-react-redux-performance-additional-techniques"/>
#### Additional Techniques in Improving Performance
  * **Chrome Timeline Tool**: Learn to use this and you will quickly be able to narrow in on which actions cost you the most and where to focus your efforts.
  * **React-DevTools**: This browser extension offers many tools for quickly checking your application state during runtime and tracking changes as they occur to find extraneous renderings.

<a id="cmc-using-immutablejs"/>
#### Usage of ImmutableJS
[ImmutableJS](facebook.github.io/immutable-js/) offers a set of high-performance, immutable data structures. Since Redux/React emphasizes a functional paradigm and so much of the application relies on a single, shared state that is passed by reference throughout, it is very important to make sure that the state is treated as immutable. ImmutableJS also provides a coherent and powerful API for dealing with Arrays, Maps, Sets, and more.

<a id="mapping-with-cmc"/>
## Mapping With CMC
CMC uses [Openlayers3](openlayers.org) and [Cesium](http://cesiumjs.org) as its default mapping libraries. As noted in the diagram above, these mapping libraries sit slightly removed from the normal React/Redux cycle and are interacted with through an abstraction layer called a **MapWrapper** (`src/_core/utils/MapWrapper.js`). The MapWrapper abstraction is used so that the actual mapping library used can be changed to suit any given applications needs.

<a id="mapping-with-cmc-why-ol3-cesium"/>
### Why Did CMC Choose Ol3 and Cesium?
These two libraries were chosen for a few reasons:

* They each provide a large and robust feature set that will accommodate most applications' needs
* Strong community involvement for both
* Together they demonstrate the flexibility of the MapWrapper abstraction
* Cesium is by far the best WebGL based, open sourced 3D mapping library
* Why not leaflet or ArcGIS JS?
  * Leaflet relies too much on third-party plugins to provide a rich feature set. These plugins are often not well maintained and managing them can easily become overwhelming
  * ArcGIS JS is closed source and built with Dojo in mind and does not meet the flexibility requirements CMC needed to support many unique projects

<a id="mapping-with-cmc-replacing-libs"/>
### Replacing these libraries
If an Application Developer wants to use Leaflet for their project, they need only create their own `MapWrapper_Leaflet.js` class that extends CMC Core's base `MapWrapper` class, modify the `MapCreator.js` file to instantiate that class instead of the default and that's it. You can see examples of this here: [Example Projects](https://github.jpl.nasa.gov/CommonMappingClient/cmc-core/blob/master/docs/core-docs/EXAMPLE_PROJECTS.md). 

<a id="mapping-with-cmc-mapwrapper"/>
### Overview of the MapWrapper classes
The MapWrapper class provides an abstracted API for the Reducer functions to interact with the map objects. This allows the reducers to be completely ignorant of what kind of map they are operating on (2D or 3D or WebGL or DOM based etc). Each individual MapWrapper class inherits from the base MapWrapper abstract class (we say abstract though JS really has no such thing) and uses Composition to maintain a backing instance of a map object from the library it uses. For each abstracted method, the MapWrapper operates on this map instance, catches any errors that occur and returns a success or failure to the caller. In addition, the MapWrapper class can be extended to build complex features around the mapping library. For example, extracting data from tiles involves overriding the mapping library's method for requesting image tiles, reading the data from the fetched resources, and storing that off within the MapWrapper for later reference.

<a id="mapping-with-cmc-note-on-performance"/>
### Notes on Map Performance
Openlayers and Cesium are both aware of their visibility in the DOM to some extent. This means that they will delay rendering if their containing domNodes have `display: none;` styling. This allows MapReducers and the MapWrapper to operate on the map while it is not displayed without fear of it rendering in the background. Note however that the instance does not easily give up resources and once initiated Cesium in particular can become a resource hog.

# Intermission

So at this point you're probably feeling like:

![](https://media.giphy.com/media/3o6UBpHgaXFDNAuttm/giphy.gif)

and it is, everything is going to be fine, yes this is a lot of stuff, but you'll eventually work through it all and build something really awesome, so keep powering through this stuff!

<a id="cmc-application-directory"/>
## Brief Overview of Application Directory 
```
.
├── .babelrc                  # Configures Babel
├── .editorconfig             # Configures editor rules
├── .eslintrc                 # Configures ESLint
├── .gitignore                # Tells git which files to ignore
├── .npmrc                    # Configures npm to save exact by default
├── .travis.yml               # Travis configuration file
├── README.md                 # This file.
├── assets/assets             # Folder created during postinstall to house Cesium, Cesium-Drawhelper, arcJS, flexboxgrid, mapskin, and normalize libraries that won't play well with webpack and have to be requested post load. Note: the assets/assets nesting is _not_ by mistake, it's actually used at the moment to resolve some build system alias issues.
├── coverage                  # Karma code coverage output folder
├── dist                      # Folder where the build script places the built app. Use this in prod.
├── docs                      # All documentation
├── lib                       # Contains arcJS and mapskin libraries that are not available in npm as well as a config file for Modernizr.
├── karma.conf.js             # Configuration for karma test runner
├── package.json              # Package configuration. The list of 3rd party libraries and utilities
├── scripts                   # Node scripts that run build related tools
│   ├── deployAssets          # Folder containing files used for deployment of CMC in a Dockerized NGINX server
│   ├── build.js              # Runs the production build
│   ├── buildHtml.js          # Builds index.html
│   ├── distServer.js         # Starts webserver and opens final built app that's in dist in your default browser
│   ├── deploy.bash           # Script for deploying built app to Github Pages
│   ├── dockerDeploy.bash     # Script for deploying built app (with branch support) in Docker
│   ├── postbuild.sh          # Shell script that runs after npm build to copy over certain libs to certain places in the distribution
│   ├── postinstall.sh        # Shell script that copies over certain node_module files, libraries, sets up other stuff, etc.
│   └── srcServer.js          # Starts dev webserver with hot reloading and opens your app in your default browser
├── src                       # Source code
│   ├── _core                 # Folder containing all cmc-core files that should not need to be modified by external developer
│   │   └── actions           # Core Flux/Redux actions. List of distinct actions that can occur in the app.  
│   │     ├── components        # Core React components
│   │     ├── constants         # Core application constants including constants for Redux
│   │     ├── reducers          # Core Redux reducers. Your state is altered here based on actions
│   │     │   ├── models        # Core state models acted upon by reducers. Each reducer corresponds to a model
│   │     │   └── reducerFunctions  # Functions used by core reducers, separated out for cleanliness
│   │     ├── styles              # Core CSS Styles, typically written in Sass
│   │     │   └── resources     # Style media resources like favicons and images required by core 
│   │     ├── store           # Redux store configuration, modifications usually unnecessary
│   │     ├── tests               # All Core tests
│   │     │   └── data            # Any dummy data core tests may need
│   │     └── utils               # Application constants including constants for Redux
│   ├── components            # Components that live outside of Core, used for applications built on top of Core. By default contains only AppContainer.js stub file for getting started.
│   ├── constants             # Container for user defined constant files. Also includes appConfig.js which is used for general app config.
│   ├── default-data          # Default data for the application
│   │   └── _core_default-data    # Default data for Core, not to be modified by user
│   │       ├── help              # Core in-app help markdown documentation files
│   │       └── layer-metadata    # Core metadata files for each layer
│   ├── config.js             # Ops configuration options
│   ├── index.html            # Start page where the app bundle is included, also has loading screen written in vanilla JS.
│   ├── index.js              # Entry point for your app
│   ├── styles                # CSS Styles, typically written in Sass
│   │   ├── _theme.scss           # High level SCSS variables used for setting various application colors (Note: this is an scss partial file, see http://stackoverflow.com/questions/31311147/underscore-in-partial-sass-file)
│   │   ├── _variables.scss   # SCSS variables, mixin and animation definitions (Note: this is an scss partial file, see http://stackoverflow.com/questions/31311147/underscore-in-partial-sass-file)
│   │   └── styles.scss       # SCSS top level file used for importing _variables and Core styles.scss
│   │   
│   └── utils                 # Plain ES6 JS objects. Pure logic. No framework.
├── test-results              # Karma test results output folder
├── webpack.config.dev.js     # Configures dev webpack
└── webpack.config.prod.js    # Configures production webpack
```

<a id="writing-tests"/>
## How to Write Tests in CMC
The following sections outline the testing concepts, tools, and configuration necessary for testing both CMC Core and your own application.

<a id="writing-tests-tools"/>
### Testing Tools
The testing tools and their main dependencies used are:
- [Karma](https://karma-runner.github.io/1.0/index.html) - Test runner for Javascript
- [Chai](http://chaijs.com/) - An assertion library for NodeJS and browser
- [Mocha](https://mochajs.org/) - JS test framework for NodeJS and browser for async testing
- [Karma-chai](https://github.com/xdissent/karma-chai) - Chai for Karma
- [Karma-mocha](https://github.com/karma-runner/karma-mocha) - Mocha for Karma
- [Karma-chrome-launcher](https://github.com/karma-runner/karma-chrome-launcher) - Launcher for Google Chrome, Google Chrome Canary and Google Chromium
- [Karma-htmlfile-reporter](https://www.npmjs.com/package/karma-html-reporter) - Reports tests results in pretty HTML format
- [Karma-coverage](https://github.com/karma-runner/karma-coverage) - Generates code coverage reports using [Istanbul](https://github.com/gotwarlost/istanbul)
- [Nyc](https://github.com/istanbuljs/nyc) - Istanbul Command Line Interface
- [Enzyme](https://github.com/airbnb/enzyme) – JS testing utilities for React (not currently used but can be very useful)
- [Sinon](http://sinonjs.org/) - Test spies, stubs, and mocks for JS (not currently used but can be very useful)
- [Sinon-chai](https://github.com/domenic/sinon-chai) - Extends Chai with assertions for the Sinon.JS mocking framework (not currently used but can be very useful)

That's a lot, but not to worry. The ones you really need to be aware of are Karma, Chai, and Karma Coverage. Additionally, you shouldn't need to do anything drastically different from what's been set up here already so for the most part you can base your tests off of existing tests and structures in CMC Core.

<a id="writing-tests-running-tests"/>
### Running Tests
The following `package.json` scripts can be used to run tests in a variety of ways. 

- `npm run test` - Run tests once and generate html test report
- `npm run test:watch` - Run tests on every file change (is a little fragile, try to space out your saves so you don't thrash this thing) and generate html test report
- `npm run test:cover` - Run tests once and generate html test report and a test coverage report
- `npm run test:cover:watch` - Run tests on every file change and generate html test report and a test coverage report
- `npm run test:skipWebGLTests` - Run tests once and generate html test report and skip tests that require WebGL (an environment variable is passed in which tells certain tests to skip themselves via check from TestUtil)
- `npm run test:skipWebGLTests:watch` - Run tests on every file change (is a little fragile, try to space out your saves so you don't thrash this thing) and generate html test report, skip WebGL tests
- `npm run test:skipWebGLTests:cover` - Run tests once and generate html test report and a test skipWebGLTests:coverage report, skip WebGL tests
- `npm run test:skipWebGLTests:cover:watch` - Run tests on every file change and generate html test report and a test coverage report, skip WebGL tests

<a id="writing-tests-cmc"/>
### Writing Tests for CMC
Application tests cover a range of functionalities from testing utility functions to testing Redux state changes. The differences between writing tests for CMC Core and applications built on top of CMC will be covered later. All test files must use the .spec.js file extension and may be written in ES6. As a general rule, try to keep a 1-1 mapping of your *.js files to *.spec.js. Due to time constraints, CMC does not currently have component level tests where the nitty gritty rendering aspects of components are tested using Enzyme and Sinon, but feel free to add your own. 

<a id="writing-tests-simple"/>
##### Simple Tests
Let's begin with an example test from a CMC Core utility test file `/src/_core/tests/Cache.spec.js`.

```JSX
import { expect } from 'chai';
import Cache from '_core/utils/Cache';

export const CacheSpec = {
    name: "CacheSpec",
    tests: {
        setAndGet: {
            test1: () => {
                it('Set adds an arbitrary key/value mapped entry to the cache.' +
                    'Get takes a key and retrieves the mapped value if it hasn\'t ' +
                    'been ejected, false otherwise', () => {
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
                    });
            }
        },
        ejection: {
            test1: () => {
                it('Adds key/value pairs up the specified limit then ejects entries in FIFO order', () => {
                    let limit = 3;
                    ...
```

This file imports the `Cache` module from Core as well as the `expect` assertion function from Chai. The testing structure below is not strictly the minimal testing setup as it contains some abstraction that CMC uses to be able to provide overridable/ignorable Core tests for the user. For now we'll ignore these extra bits and focus on the test content. 

In the first test, we use the Mocha syntax `it` to describe a single test. Here, we test the setting and getting of the Cache class.

```JSX
it('Set adds an arbitrary key/value mapped entry to the cache.' +
    'Get takes a key and retrieves the mapped value if it hasn\'t ' +
    'been ejected, false otherwise', () => {
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
    });
```

First we construct our cache and add some things to it.

```JSX
let limit = 3;
let cache = new Cache(limit);
cache.set("a", 1);
cache.set(3, [1]);
cache.set("c", { a: 1 });
```

Then we declare our assertions using Chai's `expect` syntax (which you can learn more about [here](http://chaijs.com/api/bdd/)).

```JSX
//assert
expect(cache.get("a")).to.equal(1);
expect(cache.get(3)).to.deep.equal([1]);
expect(cache.get("c")).to.deep.equal({ a: 1 });
expect(cache.get("d")).to.deep.equal(false);
expect(cache.getSize()).to.equal(limit);
```

Note that you can use `expect` whenever you wish and however many times you wish but it's good to keep tests focused on a particular input/output or set of expected behaviors.

<a id="writing-tests-redux-store"/>
##### Tests using the Redux Store

Now let's move on to a more complex test that involves using the Redux store. Here's a test from `src/_core/tests/store.map.spec.js` that tests initialization of the 2D and 3D maps.

```JSX
it('initializes 2D and 3D maps', function() {
    const store = createStore(rootReducer, initialState);

    const actions = [
        mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
        mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D")
    ];
    actions.forEach(action => store.dispatch(action));

    const actual = store.getState();
    const actualNumMaps = actual.map.get("maps").size;
    const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
    const actualMap3D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

    actual.map = actual.map.remove("maps");

    const expected = {...initialState };
    expected.map = expected.map.remove("maps");

    expect(actualNumMaps).to.equal(2);
    expect(actualMap2D).to.not.equal(undefined);
    expect(actualMap3D).to.not.equal(undefined);
    TestUtil.compareFullStates(actual, expected);
});
```

In this test we first create the Redux store that we will use to test state changes:

```JSX
const store = createStore(rootReducer, initialState);
```

We then define an array of actions to affect this store. In this case we specify actions to initialize the 2D and 3D maps.

```JSX
const actions = [
    mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
    mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D")
];
```

Next we dispatch the actions to the store. Note that these action dispatches are **synchronous**! This is a guarantee provided by Redux as was mentioned in a previous section. In testing, this allows us to string together an arbitrary number of actions together and deterministically arrive at an expected final state. Note that this is somewhat incorrect for asynchronous actions (which will be covered later).

```JSX
actions.forEach(action => store.dispatch(action));
```

Now we pull out a few items out of the state that we wish to examine. This step is performed since these items live in the `maps` part of state which in this case holds Openlayers and Cesium objects which cannot be compared to themselves and are therefore removed later on.

```JSX
const actual = store.getState();
const actualNumMaps = state.map.get("maps").size;
const actualMap2D = state.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

actual.map = actual.map.remove("maps");
```

Next we make a copy of our expected state from the initialState object we defined at the top of the file that all tests in this file use. To do this we use the [JS spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).

```JSX
const expected = {...initialState };
expected.map = expected.map.remove("maps");
```

where initialState is defined as an object mirroring the state model you've previously defined and the individual state values like `mapState` are imported from your actual model files, in this case `_core/reducers/models/map`.

```JSX
const initialState = {
    map: mapState,
    view: viewState,
    asynchronous: asyncState,
    help: helpState,
    settings: settingsState,
    share: shareState,
    dateSlider: dateSliderState,
    analytics: analyticsState,
    layerInfo: layerInfoState
};
```

Next we check some actual values of the state versus expected values.

```JSX
expect(actualNumMaps).to.equal(2);
expect(actualMap2D).to.not.equal(undefined);
expect(actualMap3D).to.not.equal(undefined);
```

Finally, we use a utility function in `TestUtil` to convert the state object parts into JS and compare them. 

```JSX
TestUtil.compareFullStates(actual, expected);
```

<a id="writing-tests-cmc-core"/>
### Writing Tests for CMC Core
If you are developing tests for CMC Core there's a bit of extra structure you need to use on top of the standard tests. This structure allows Application Developers to override or exclude certain CMC Core tests from their application testing setup while still allowing CMC Core tests to be upgraded in the future. 

Each Core test file exports an object containing a `name` property, used as a label when logging the test output, and an object containing test suites. Let's take a look at the `setAndGet` test suite again.

```JSX
import { expect } from 'chai';
import Cache from '_core/utils/Cache';

export const CacheSpec = {
    name: "CacheSpec",
    tests: {
        setAndGet: {
            test1: () => {
                it('Set adds an arbitrary key/value mapped entry to the cache.' +
                    'Get takes a key and retrieves the mapped value if it hasn\'t ' +
                    'been ejected, false otherwise', () => {
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
                    });
            }
        },
        ejection: {
            test1: () => {
                it('Adds key/value pairs up the specified limit then ejects entries in FIFO order', () => {
                    let limit = 3;
                    ...
```

Each test suite (like setAndGet) contains one or more tests pertaining to the title of the test suite. As a convention, CMC Core tests are labeled test + number-ascending but any unique identifier can be used. These test names will eventually be used by Application Developers if the wish to ignore certain tests.

The testing flow for Core tests is as follows – 

1. Inside of `karma.conf.js` (more about this later) we specify the list of files/patterns to use for testing. Here we specify `src/tests/**/*.spec.js`. Note that this is _not_ the Core directory of files.
2. In `src/tests/core-test-overrides.spec.js`, the only *.spec.js in the folder, we import all Core tests and use a utility from `TestUtil` to run each test suite. If you write a new Core test suite be sure to add it to this file or else the test will not be run. 

<a id="writing-tests-your-application" />
### Writing Tests for your Application

<a id="writing-tests-normal-non-core"/>
Non-Core test files should live in the `src/tests` directory and should end in *.spec.js. In this directory you will find a file named `non-core-test-stub.spec.js` which you should modify for your own use. Inside of this file and any other test files you write you should have something looking like:

```JSX
import { expect } from 'chai';
import Immutable from 'immutable';
import MyUtils from '/utils/MyUtils';

const myUtils = new MyUtils();

describe('Misc Utils', () => {
    describe('generateStringFromSet', () => {
        it('returns a space separated string from a set of strings mapped to booleans', () => {
            let varIn = {
                "foo": true,
                "bar": false,
                "fubar": true
            };
            let varOut = 'foo fubar';

            //assert
            expect(myUtils.generateStringFromSet(varIn)).to.equal(varOut);
        });
        it ('...')
    }),
    describe('findObjectInArray', () => {...})
```

Where all you need to do is use [Mocha `describe` syntax](https://mochajs.org/#getting-started), essentially writing tests in the same way as is described in the Mocha docs. These tests will match the pattern in `karma.conf.js` and will be run through the testing framework.

<a id="writing-tests-modifying-core-tests"/>
##### Overriding, Modifying, or Ignoring a CMC Core Test
There many be times as an Application Developer when you wish to modify or override a Core test. For example, let's say you want to build an application that does not use a 3D map and you want to exclude all Core tests that test and rely on the 3D map. To override these tests, you would want to find the relevant (failing) tests in `_core/tests/MapUtil.spec` and remove them by overriding the imported object in `core-test-overrides.spec.js`. For example:

```JSX
MiscUtilSpec.generateStringFromSet.test3 = () => {};
```

excludes that test by overriding the test contents. You can also choose to exclude some or all imported Core test suites by changing what's inside the `testSuites` array in `core-test-overrides.spec.js`.

<a id="writing-tests-async-local-data"/>
### Asynchronous Local Data Loading in Tests
Core tests sometimes make use of use of asynchronously loaded data from `src/_core/tests/data`. This folder contains several files copied over from `src/default-data/_core_default-data` (if you're developing Core tests you will need to make note of this) and some intermediate state object definitions for use in testing. For non-Core tests feel free to import any of the files from `src/_core/tests/data` and/or add your own folder in `src/tests/YOUR_DATA` with your own files.

<a id="writing-tests-beforeEach-afterEach"/>
### Using beforeEach and afterEach
CMC Core tests (`src/_core/tests/store.map.spec.js` in particular) make use of the Mocha [`beforeEach` and `afterEach` hooks](https://mochajs.org/#hooks) in order to provide an html fixture from the DOM so that the maps have a place to render. In Core, these `beforeEach` and `afterEach` functions are defined in the exported testSuite objects. In non-Core tests feel free to use these functions and any other Mocha hooks according to the normal Mocha paradigm.

<a id="skipping-webgl-tests"/>
### Skipping WebGL Tests
Certain CMC Core tests that test functionalities requiring WebGL are configured to skip themselves if a certain global variable is defined as true. This variable is included as a global variable in the test webpack build in `karma.conf.js` if a certain environment variable is set while running tests (`SKIP_WEBGL_TESTS`). Skipping WebGL tests is useful if you need to run your tests in an environment where configuring a WebGL enabled browser is difficult or impossible. Running tests on a continuous integration server that doesn't have anything besides PhantomJS available is one example where this functionality can be useful. Note that skipped tests will still be reported in the test output but will be labeled as skipped.

<a id="writing-tests-async-behavior"/>
### Testing Asynchronous Behaviors
Testing asynchronous functions is accomplished by making use of the [done](https://mochajs.org/#asynchronous-code) callback paradigm in Mocha. We can use this `done` callback to tell Mocha to wait for this callback to be called to complete the test. In Core we make use of this paradigm and also make use of timeouts for certain map behaviors that do not have easily trackable async success or failure values. For example in `StoreMapSpec.test16` in `src/_core/tests/store.map.spec.js` we use async testing to test the 2D and 3D map zooming out behavior. This is because the call to zoom on the map may return true but the zoom will not be accomplished until after a final render which uses an unknown number of frames. To accommodate this, we give a generous timeout in the beginning, initialize maps, wait for maps to initialize, do some zooming, wait a bit, and then check the relevant state and map properties.

```JSX
test16: () => {
    it('can zoom out', function(done) {
        this.timeout(30000);

        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D")
        ];
        actions.forEach(action => store.dispatch(action));

        setTimeout(() => {
            const zoomActions = [
                mapActions.zoomIn(),
                mapActions.zoomOut()
            ];
            zoomActions.forEach(action => store.dispatch(action));
            setTimeout(() => {
                const state = store.getState();

                const actual = {...state };
                const actualMap2D = actual.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
                actual.map = actual.map.remove("maps");

                const expected = {...initialState };
                expected.map = expected.map.remove("maps");

                expect(actualMap2D.getZoom()).to.equal(2);
                TestUtil.compareFullStates(actual, expected);
                done();
            }, 1000);
        }, 1000);
    });
},
```

If your async functions have promises or callbacks then you should be able avoid using timeouts, but in this case when we have neither callbacks or promises we are forced into using timeouts.

<a id="writing-tests-code-coverage"/>
### Test Coverage and Test Results
Every command used to run tests (e.g. `npm run test`, `npm run test:watch`, etc.) makes use of Karma test reporters (usually in the form of plugins). All tests by default use:

- Progress reporter - Report test progress in console
- [Karma HTML Reporter](https://www.npmjs.com/package/karma-htmlfile-reporter) - For reporting test results in styled HTML format. The default output folder for these test results is `test-results`, configuration of which will be covered in the next section.
- [Karma Coverage Reporter](https://github.com/karma-runner/karma-coverage) - For generating code coverage reports in several formats including HTML and lcov. The default output folder for these test results is `coverage`, configuration of which will be covered in the next section. Test coverage is a very handy tool for identifying untested statements, branches, and functions. Learn more about it [here](https://istanbul.js.org/). Note that the coverage plugin will only be aware of files that are run through Karma so if you don't have `.spec.js` files for, say, components and none of these components are imported then none of the components will be analyzed in the coverage report. This is something to be aware of when you're trying to estimate the _real_ code coverage of your project. That said, take the overall code coverage percent with a grain of salt. Try to be smart with how you prioritize _what_ you test. Knowing that 100% of your critical math and utility functions are correct with other files only at 25% coverage is probably more valuable than 50% code coverage throughout the entire project.

These default reporters are specified in the `karma.conf.js` configuration but some commands are overridden at runtime using flags. For example, `npm run test` uses the `--reporters=progress,html` to skip code coverage generation. Code coverage does take a bit of extra time so if you're running tests often or using a watched test (like `test:watch`) then it makes sense to skip coverage.

<a id="writing-tests-karma-conf"/>
### Karma.conf.js
CMC Karma testing is configured using a file called `karma.conf.js`. This configuration shouldn't need much tweaking and is heavily commented but there are several important parts to note. 

Karma uses webpack to preprocess the files and must be configured using roughly the same method as the `webpack.config.dev`. If you add more `module` rules or `resolve` rules to your `webpack.config.dev`, you _must_ add these rules to the webpack section in `karma.conf.js` or else Karma will not be able to load your files. This system is something that may be improved upon in the future with some common webpack config shared between webpack configurations but for now that's what needs to be done.

The Karma config options: 

```JSX
browserNoActivityTimeout: 60000,
browserDisconnectTolerance: 1,
browserDisconnectTimeout: 20000,
```
are used to control browser timeouts and disconnects while testing. These numbers can be tweaked to allow for some wiggle room when you're testing on lower end machines, say a CI server, and need more time to run tests above the default limits. If you're noticing timeout issues in your testing try playing with these config options.

The Karma config options:

```JSX
browsers: process.env.TRAVIS ? ['Chrome_travis_ci'] : ['Chrome'],

// Custom launcher for headless CI testing (Travis)
customLaunchers: {
    Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox', "--enable-webgl", "--ignore-gpu-blacklist"]
    }
},
```
relate to the configuration of which browser Karma uses to run tests. Some options include:
- [Chrome](https://github.com/karma-runner/karma-chrome-launcher)
- [Firefox](https://github.com/karma-runner/karma-firefox-launcher)
- [Safari](https://www.npmjs.com/package/karma-safari-launcher)
- [PhantomJS](https://github.com/karma-runner/karma-phantomjs-launcher)

To run Chrome, Firefox, Safari, and any other standard browsers outside of a standard environment you must run [X Virtual Framebuffer](https://www.x.org/archive/X11R7.6/doc/man/man1/Xvfb.1.xhtml). For example, in the CMC Core `.travis.yml` file (for Travis CI), the following commands are run before package install:
- `export CHROME_BIN=chromium-browser` - Tell Karma the Chrome path in the Travis Environment
- `export DISPLAY=:99.0` - Export the display variable used for xvfb
- `sh -e /etc/init.d/xvfb start` - Start xvfb
- `sleep 3` - give xvfb some time to start

In the Karma config, we check for the `process.env.TRAVIS` environment variable set in the Travis environment and if it exists we specify a particular browser to use. Otherwise, we use standard native Chrome. Below in `customLaunchers` we configure the Travis Chrome browser base path as well as a few flags to enable WebGL so that we can run CesiumJS.

Using real browsers can be useful since it allows us to test CMC in environments closer to the real end-user environment. Additionally, using a real browser allows us to run all of our tests, including those that utilize WebGL which is something many thin or headless testing browsers don't support well or at all. That said, running Chrome or any of the other standard browsers is slightly more complicated (since it requires xvfb setup and some browser flags which can vary from CI to CI) and are a little less performant than using something like [PhantomJS](http://phantomjs.org/), which is a Webkit framework for running headless tests. If you don't need to run WebGL tests or just want to simplify your testing setup you can use PhantomJS, but do note that all tests that rely on the rendering of the CesiumJS 3D map will fail, so you will have to override or ignore these tests.

Learn more about Karma and Karma configuration [here](http://karma-runner.github.io/1.0/config/configuration-file.html).

<a id="user-analytics"/>
## User Analytics

<a id="user-analytics-custom-cmc"/>
### CMC Custom User Analytics
The analytics operates as a "silent reducer". It watches every action dispatched to the store and buffers each action that it is defined to include. Every time 10 actions are buffered or 5 seconds have passed, the currently buffered actions are sent as a JSON string to the defined endpoint as a POST request. This means if you set up some server to capture these actions you can ask and answer various questions based on these actions such as:

- "What is the most popular layer?"
- "How often do people use this layer"
- "How often do people use 3D mode?"
- "How many people change the date?"
- "How soon do most people change the date?"
- "What percentage of people change the basemap?"
- _and so on_

To learn more about this analytics system and view a simple example of a server to collect and analyze these actions, check out our [CMC Analytics Example](https://github.jpl.nasa.gov/CommonMappingClient/cmc-example-analytics).

<a id="google-analytics"/>
### Google Analytics
In addition to the custom analytics solution mentioned previously, CMC includes a React-based Google Analytics module that can be enabled/disabled and configured from appConfig.js. The default behavior is to register the app using a root pageview of '/' but adding more specific pageviews is as easy as calling `ReactGA.pageview('ROUTE')` when desired. For more on the React Google Analytics module please refer to the [React-GA repository](https://github.com/react-ga/react-ga). The CMC Core component containing the React-GA plugin is `src/_core/components/Analytics/AnalyticsContainer.js`.

<a id="upgrading-cmc"/>
## Upgrading your Project to Latest Version of CMC
CMC was architected so that developers using CMC as a base for their applications would be able to easily upgrade the underlying CMC version in their applications. That said, there isn't a huge abstraction layer separating CMC Core from non-Core – a deliberate choice made by the Core developers – which means that there are some files and areas that Core and non-Core developers must share and be aware of to avoid nasty merge conflicts or blowing away work.

<a id="upgrading-cmc-when-to-upgrade"/>
##### When to Upgrade
Upgrading CMC can range from almost painless (0 - 2 simple merge conflicts) to a bit of work (3+ large merge conflicts, new Core dependencies, etc.) which means that you should plan on giving yourself a bit of time to read up on what's changed in Core since your version (see `docs/core-docs/CHANGELOG.md`), how much effort it will take to upgrade, and whether or not you really want/need to upgrade. If you're getting quite close to a release you may want to hold off until you have a little more time to upgrade so you can take your time and be careful.

<a id="upgrading-cmc-files-to-watch"/>
##### Files to Watch out For
- `scripts` - These scripts may change in Core. You shouldn't need to tweak these scripts too much and you probably won't have conflicts here. That said, you should probably use your own deploy.sh script customized for your own CI/deployment environment.
- `AppContainer.js` - This is just a stub file in Core so you shouldn't see any issues here.
- `.travis.yml` - CMC Core .travis.yml file may change from time to time, be careful with this one if you're using Travis CI.
- `tests/core-test-overrides.spec.js` - If Core adds a new Spec file it will need to add an import to this file which in theory shouldn't cause too much trouble. 
- `package.json` - There's no getting around this one unfortunately with the current architecture. If Core modifies dependencies, updates it's version number (which it will do every time you upgrade to a tagged version), your package.json may conflict/be overridden. Make sure you look at what's changed in the Core package.json before upgrading and plan accordingly.
- `webpack.config.dev.js` - This config will also change from time to time but in theory you shouldn't have to worry about this file too much and any conflicts should be easy to manage.
- `webpack.config.prod.js` - Same as above.

This separation between Core and Non-Core is still being tweaked now and then to improve the upgrading process.

<a id="upgrading-cmc-steps"/>
##### Upgrade Steps
1. Add cmc-core as a git remote if you haven't done so already by running `git remote add core https://github.jpl.nasa.gov/CommonMappingClient/cmc-core`
2. Fetch the latest from cmc-core by running `git fetch --tags core`
3. Make a new branch (optional)
4. Review the changes that have been made to Core since your version by looking in `docs/core-docs/CHANGELOG.MD`.
5. Merge in Core by running `git merge <LATEST_TAG>`
6. Check your `package.json` to make sure Core didn't overwrite anything of yours in the merge.
7. Run `npm install` to make sure that any packages added in the latest version of CMC get installed
8. Run your tests with `npm run test` to verify that everything passes
9. Load up your application and verify that everything works.

<a id="layer-ingestion-additional-services"/>
## Layer Ingestion Additional Services
As mentioned before, CMC is not expected to be a final product. This extends not only to the front-end application itself, but also the services that power it. CMC Core uses a directory called `default-data` that contains numerous static files that provide CMC with something to display by default. This includes lists of layers, color palettes, vector data, etc. In a real world application, we would not expect this directory to be referenced. Instead, we would expect all of the static data to be replaced by a dynamic service on the backend with some sort of REST API (this could be a solr catalogue or similar). However, for small projects and local development, static file usage is more than adequate.

<a id="deployment-to-gh-pages"/>
## Deployment to Github Pages
Github pages are a great way to host static content right out of your Github repos. One simple way to deploy to Github pages if you don't have a continuous integration service set up or available is to use the `deploy.bash` script found in the `scripts` directory to push a built version of your application to Github pages. Note, you'll need to enable Github pages for your repository. Also note that all Github pages are public even if your repository is private. Follow these steps below to deploy. The deploy script included works with multiple branches as well which can be useful for comparing built branches, sharing testable branches with others, etc.

1. Run `npm run test:cover`
2. Run `npm run build` (you may want to verify that your build works using `npm run open:dist`)
3. Make a copy of your entire repository folder and `cd` into the copy
4. Run `chmod a+x scripts/deploy.bash` to give the deploy script correct permissions
5. Run `git branch -D gh-pages` to ensure that your local gh-pages branch does not exist
6. Run `npm run deploy` and verify that the deployment was successful by navigating to:`https://github.jpl.nasa.gov/pages/[USER_OR_ORG]/[REPO]/branches/[BRANCH]/`
  1. Example: `https://github.jpl.nasa.gov/pages/CommonMappingClient/cmc-core/branches/master/` where `CommonMappingClient` is the organization name, `cmc-core` is the repository name, and `master` is the branch name.
7. Cleanup by removing the folder you were just in

<a id="main-tech-under-the-hood"/>
## Main Technologies Under the Hood

![Node dependencies](https://github.jpl.nasa.gov/CommonMappingClient/cmc-design/blob/master/screenshots/node_dependencies.png)

Main tech under the hood. **Yes**, this is a lot of dependencies _(actually this isn't even the [full list](https://github.jpl.nasa.gov/CommonMappingClient/cmc-core/blob/master/package.json))_ but that's modern web development for you. We've tried to limit the number of unnecessary dependencies included in CMC but you may find that for your own application you may be able to remove some dependencies that your application does not require (e.g. Cesium, d3, react-ga, etc.)


| **Tech** | **Description** |**Learn More**|
|----------|-------|---|
| [React](https://facebook.github.io/react/)  |   Fast, composable client-side components. |
| [Redux](http://redux.js.org) |  Enforces unidirectional data flows and immutable, hot reloadable store. Supports time-travel debugging. Lean alternative to [Facebook's Flux](https://facebook.github.io/flux/docs/overview.html).  |
| [Cesium](http://cesiumjs.org) | An open-source JavaScript library for world-class 3D globes and maps. |
| [Openlayers](http://openlayers.org) | A high-performance, feature-packed library for all your mapping needs. |
| [d3](https://d3js.org/) | D3.js is a JavaScript library for manipulating documents based on data. |
| [fetch](https://github.com/github/fetch) | An easier Javascript request library adhering to the new Fetch standard. |
| [Moment](http://momentjs.com/) | Parse, validate, manipulate, and display dates in JavaScript. |
| [React-Toolbox](http://react-toolbox.com/) | Bootstrap your application with beautiful Material Design Components. |
| [TurfJS](http://turfjs.org/) | Advanced geospatial analysis for browsers and node. |
| [ArcJS](https://github.com/springmeyer/arc.js/) | Great Circle routes in Javascript. |
| [Proj4js](http://proj4js.org/) | JavaScript library to transform coordinates from one coordinate system to another, including datum transformations. |
| [Babel](http://babeljs.io) |  Compiles ES6 to ES5. Enjoy the new version of JavaScript today.     | [ES6 REPL](https://babeljs.io/repl/), [ES6 vs ES5](http://es6-features.org), [ES6 Katas](http://es6katas.org)  |
| [Webpack](http://webpack.github.io) | Bundles npm packages and our JS into a single file. Includes hot reloading via [react-transform-hmr](https://www.npmjs.com/package/react-transform-hmr). | [Quick Webpack How-to](https://github.com/petehunt/webpack-howto) |
| [Browsersync](https://www.browsersync.io/) | Lightweight development HTTP server that supports synchronized testing and debugging on multiple devices. | [Intro vid](https://www.youtube.com/watch?time_continue=1&v=heNWfzc7ufQ)|
| [Karma](https://karma-runner.github.io/1.0/index.html) | Test runner for Javascript. |
| [Mocha](http://mochajs.org) | Automated tests with [Chai](http://chaijs.com/) for assertions and [Enzyme](https://github.com/airbnb/enzyme) for DOM testing without a browser using Node. |
| [ESLint](http://eslint.org/)| Lint JS. Reports syntax and style issues. Using [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) for additional React specific linting rules. | |
| [SASS](http://sass-lang.com/) | Compiled CSS styles with variables, functions, and more. |
| [npm Scripts](https://docs.npmjs.com/misc/scripts)| Glues all this together in a handy automated build. | [Why not Gulp?](https://medium.com/@housecor/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8#.vtaziro8n)  |
| [postCSS](http://postcss.org/)| PostCSS is an CSS autoprefixer that automatically adds vendor prefixes from Can I Use to your CSS to ensure cross-browser compatibility |
| [showdown](https://github.com/showdownjs/showdown)| A Markdown to HTML converter written in Javascript |
| [react-ga](https://github.com/react-ga/react-ga)| A JavaScript module that can be used to include Google Analytics tracking code in a website or app that uses React for its front-end codebase. |
| [react-slingshot](https://github.com/coryhouse/react-slingshot)| The React/Redux/Webpack starter kit CMC is based off of. CMC has diverged a fair bit from React-Slingshot in many respects but still owes a great deal of its webpack structure, config, npm scripts, and dev server code to react-slingshot.
| [Modernizr](https://modernizr.com/)| Modernizr tells you what HTML, CSS and JavaScript features the user’s browser has to offer. CMC uses Modernizr to detect certain browser features such as webgl and fullscreen and degrade gracefully if these features are not present.

<a id="contributing-to-cmc"/>
## Contributing to CMC
The main contributors to CMC are Flynn Platt _flynn.platt@jpl.nasa.gov_ and Aaron Plave _aaron.plave@jpl.nasa.gov_. Please get in contact with us via email or chat if you have any questions, are considering using CMC, or if you would like to contribute to CMC.

We welcome contributions and ask that you submit pull requests through a fork of cmc-core. If you would like to be a more direct contributor to cmc-core then please contact us and we will discuss adding you to the cmc-core repository.

For issue reporting please visit the github issues page for cmc-core [here](https://github.jpl.nasa.gov/CommonMappingClient/cmc-core/issues).

If you use CMC for your project please let us know, we'd love to see what you're doing and add you to our list of projects that use CMC.
