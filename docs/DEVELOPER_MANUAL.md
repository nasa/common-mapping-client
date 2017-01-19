# Developer Manual
A detailed guide on getting starting with the Common Mapping Client.

## Table of Contents
1. [Installation Guide](#installation-guide)
2. [Package.json Scripts Overview](#overview-of-various-start-build-etc-commands-from-packagejson)
3. [Installing & Removing Modules via npm](#third-example)
4. [The CMC "_core" Philosphy](#example)
    1. [General](#third-example)
    2. ["_core" Directory ](#third-example)
    3. [Adding, Overriding, and Removing "_core" Functionality & Components](#third-example)
4. [The CMC Build Process](#third-example)
    1. [Post-Install](#third-example)
    3. [Webpack](#third-example)
        1. [Brief Overview](#third-example)
        2. [Development Mode](#third-example)
        3. [Production Mode](#third-example)
    5. [Brief Note on Serving CMC](#third-example)
5. [Styling CMC](#third-example)
    1. [React UI Component Library (React-Toolbox)](#third-example)
    2. [SASS Usage](#third-example)
    3. [Overriding Core Styles](#third-example)
    4. [Overriding React-Toolbox SASS Variables](#third-example)
    5. [postCSS](#third-example)
    6. [Theming](#third-example)
6. [Components and State with React & Redux](#third-example)
    1. [Brief Overview](#third-example)
    2. [CMC React & Redux Architecture](#third-example)
        1. [Where the Relevant Files Are](#third-example)
        2. [Example State Update Cycle](#third-example)
        3. [Notes on Optimizing React/Redux Performance](#third-example)
    3. [Using D3 in React](#third-example)
    4. [Usage of ImmutableJS for Redux State Objects](#example)
9. [Application Directory Overview](#third-example)
10. [Writing Tests in CMC](#third-example)
    1. [Testing Tools](#third-example)
    2. [Writing a Test for Your Application](#third-example)
    3. [Overriding, Modifying, or Ignoring a CMC Core Test](#third-example)
11. [User Analytics](#third-example)
    1. [CMC Custom User Analytics](#third-example)
    2. [Google Analytics](#third-example)
14. [Upgrading your Project to Latest Version of CMC](#example)
20. [Deployment to Github pages](#example)
19. [Main Technologies Under the Hood](#example)

<a id="installation-guide"/>
## Installation guide
Make sure you have [NodeJS](https://nodejs.org/en/) 4.4 or higher installed before continuing.

Once you have a copy of the project, install all the dependencies and prep the project for development by running:

* `npm install`

Next, start the development server by running:

* `npm start`

Your default browser should open to `localhost:3000` and you should see a default mapping application.

To create a production build run:

* `npm run build` (may take a few minutes)
* `npm run open:dist` (to open the build using the included distribution server)

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

## Installing/removing packages via npm
NPM packages are installed and removed using the following commands. The `--save` flag tells NPM to save/remove the specified packages from your `package.json` file.
* Install a package : `npm install <package_name> --save`
* Remove a package : `npm remove <package_name> --save`

## The CMC "_core" Philosphy

### General
As is stated in the README, the Common Mapping Client aims to be a production-ready starting point for complex map based applications. To avoid bloat and feature creep, if a capability or widget is needed in the majority of mapping applications, it will not be part of CMC. CMC Core, the bulk of which is located in the "/_core" directory, is all of the code that the application developer should only need to reference, duplicate and modify, or exclude. Separating Core code out from the future developers' code is helpful for maintaining a lean Core codebase as well as providing a clean method for upgrading to newer versions of the Core codebase without affecting/breaking the other developers' work.

### The "_core" Directory
Inside of the `src/_core` directory lives the bulk of the CMC Core application code. All of the React components, Redux-related code, configurations, styles, tests, utils, etc., are imported (directly or indirectly as dependencies) into the application using the `_core/components/App/AppContainer.js` which is the root level React Component in `src/index.js`. Please note that for the Reducer functions (discussed later in the section regarding React & Redux) the _core imports are done in `src/reducers/index.js`. 


### Adding, Overriding, and Removing "_core" Functionality & Components
You as the developer can choose to use CMC-Core's AppContainer.js as it is and merely change config files to point at other layers or you can build your own AppContainer.js to remove core components, duplicate core components and modify them, or add your own entirely new components. To do this, modify `src/index.js` to point at `src/components/App/AppContainer` instead of `src/_core/components/App/AppContainer` and edit the former accordingly. It is **strongly** recommended that all of the work you do is **outside** of `src/_core` to avoid future merge conflicts with new versions of CMC (upgrading will be discussed later on in this document) and to keep a clean reference to the Core code. It is also recommended that you duplicate whatever folder structure you need from core in the parent `src` folder. Similar to components, you can swap out utilities Reducer functions by changing imports in `src/reducers/index.js`, and change styles by overriding them with SASS in `src/styles.scss`. Also note that to override certain MapWrappers (map functionality implementation classes for specific map libraries like Openlayers and Cesium) you should modify the imports in `src/utils/MapCreator.js` and substitute or add your own MapWrapper class.

In general, the best way to start altering a part of `_core` is to copy the piece into an area outside of `_core`, make the modifications you want then alter the imports necessary to use your new version. It is sometimes the case that these alterations are recursive in nature (e.g. if `_core/A` imports `_core/B` and you want to modify `_core/B` you will need a new `B` and a new `A` to import it). If you are familiar with inheritance, be sure to check if your altered version can simply extend the `_core` version and thus save you quite a bit of code duplication and management. Similarly, many pieces of `_core` (such as the reducers) can be overriden using composition (e.g. create a new reducer class that defers everything except the functions you care about to an instance of the `_core` reducer). Look through the [Example Projects](https://podaac-git.jpl.nasa.gov:8443/cmc/cmc-core/blob/master/docs/EXAMPLE_PROJECTS.md) to see this in action.

## The CMC Build Process
[It's really quite straight forward](http://chucksblog.typepad.com/.a/6a00d83451be8f69e201bb07e83109970d-popup). 
The following sections outline the build process for CMC following installation (`npm install`) which involves copying files and folders, configuring and running Webpack to combine, compile, and minify code, running a development server, and much more. While it may seem a little overwhelming, non-core developers may never actually need to modify most of these steps. 

### Post-Install
After `npm install` runs successfully, npm automatically looks for a script called `postinstall`. The `package.json` file contains a script called `postinstall` which points to a shell script `scripts/postinstall.sh`, so npm sees this and runs this script. This `scripts/postinstall.sh` script is used to add the `assets/assets` folder for serving static files asyncronously in production. After the folder is added, several libraries and images from `node_modules`, `src/_core`, and `lib` are added into `assets/assets`. Serving files from `assets/assets` is a useful last resort approach for files that aren't behaving well with webpack, libraries that require asyncronous loading of files and data (like Cesium), etc.

### Webpack
In short:
> webpack takes modules with dependencies and generates static assets representing those modules.

Webpack is one of the most popular moduler bundlers, or, build systems for web applications (as of early 2017) and continues to increase in popularity and stability. Webpack was chosen for CMC over other build systems because almost every React/Redux starter kit and project uses Webpack. Alternatively you could use a combo of grunt/gulp/browserify/etc/etc if you really think some other combo is better. CMC uses webpack version 1 for now although weback version 2 is coming out as of early 2017 so CMC may upgrade to the new version if time and stability permit. Read more about webpack version 1 over in the docs [https://webpack.github.io/docs/](here).

Webpack is complicated and does a lot but once you get over the learning curve (or avoid it entirely and just tweak existing configurations) it's great, very flexible, and does a lot right out of the box. Webpack driven from a JS configuration file (or multiple files in our case for development and production).

##### Brief Overview
CMC uses two Webpack configurations (three really, the last one is a clone of webpack.config.dev.js living inside of karma.conf.js but ignore that for now). One configuration, `webpack.config.js`, is used for development versions of CMC and is configured to provide [JS/CSS sourcemaps](http://blog.teamtreehouse.com/introduction-source-maps) for debugging as well as [hot module replacement](https://webpack.github.io/docs/hot-module-replacement-with-webpack.html) and live reloading via [BrowserSync](https://browsersync.io/) for automatic reloading of certain pieces of code and CSS while maintaining application state and without refreshing the page. The other configuration, `webpack.prod.js`, is used for production and produces the optimized, minified, uglified, duplicate dependency reduced, static application output. 

##### Development Mode
When you are developing an application using CMC, you will most often want to use the development webpack configuration. This configuration is most easily used by running the `npm start` command which in turn runs `npm run open:src` which runs `scripts/srcServer.js` using node. This script imports the development webpack configuration and uses browserSync to serve the output files and enable hot module reloading. If you take a look at the size of the output bundle in a browser development tool you'll see that it's quite large. This is normal since the bundle is not optimized at all and contains many sourcemaps. The final production bundle will be much smaller so not to worry! When you first boot up the development server it may take a few seconds but will then be fairly quick to live reload (say if you change and save some imported CSS in your editor, you should see the actual page CSS change almost instantly). Also note that no files are actually output during the development build and are instead served in-memory. For more information on development webpack configuration pleease view [https://webpack.github.io/docs/](webpack documentation). The development configuration is also thoroughly commented.

##### Production Mode
The production webpack configuration is useful for creating optimized static builds of your application. As a result, all of the development tools like sourcemaps, hot reloading, etc., are not used. The main use of this configuration is for when you want to deploy your application out to your users, so you won't usually be running it very often yourself (although your Continuous Integration Service might be!) since the build can take up to a few minutes to complete. However, it can be useful to run the build yourself every so often (even if you have a CI/CD service) to:
- Verify that the build works
- Determine the final file size of output resources like bundle.js and styles.css
- Profile and performance-critical parts of your application since the built version of the app will generally be slightly more performant than the development version

The production configuration is most easily used by running `npm run build`. However, npm is aware of the keyword `build` and will run the `prebuild` command if one exists. In our case we use `prebuid` to clean the output distribution area using `npm run clean-dist` and then run `npm run build:html` which runs `scripts/buildHtml.js` which reads in `src/index.html` and prepends a link to `styles.css` to the head (`styles.css` is the combined styles output by production webpack).  

After `prebuild` has successfully run, npm will run `scripts/build.js`. This script configures webpack using the production configuration and runs webpack to create the final bundled output. 

After the build has run, npm automatically looks for a script called `postbuild` which we also have specified in `package.json`. Now `scripts/postbuild.sh` runs and copies over `src/default-data` and `assets/*` into the output `dist` directory so they can be accessed asyncronously after application load.

Now you should have a completed production application inside of `dist` that you can run anywhere. If you would like to open the production application using the server provided by CMC you can run `npm open:dist` which uses browserSync (with hot module replacement and livereload disabled). You can also run `npm run build:open` to have the server automatically start after build success.

### Brief Note on Cesium + Webpack Integration
Most libraries are easily used with Webpack but on occasion some libraries require a bit more work, such as complex libraries like CesiumJS. CesiumJS uses lots of extra assets and doesn't fit the typical mould of a javascript library, meaning you can't just `import cesium` and be done. The following steps from CesiumJS.org were used as basis for integration with CMC webpack setup https://cesiumjs.org/2016/01/26/Cesium-and-Webpack/. In short, webpack recieves a few config tweaks, the main CesiumJS javascript file is loaded using the webpack script loader which executes the script once in global context, and Cesium requests extra static resources on demand from the assets folder.

### Brief Note on Serving CMC

## Styling CMC
### React UI Component Library (React-Toolbox)
[React-Toolbox](http://react-toolbox.com/) is a React UI Component library
that follows [Google's Material Design Standards](https://material.google.com/). React-Toolbox was chosen for CMC because React-Toolbox is fairly complete component-wise, does not inline css, and exposes most of the necessary selectors for overriding and tweaking its components. At times certain CSS hacks _are_ necessary to style or fix certain components that don't expose the desired elements with classes or data-react-toolbox attributes.
### SASS Usage
### Overriding Core Styles
### Overriding React-Toolbox SASS Variables
### postCSS
### Theming

## Components and State with React & Redux
[The React framework](https://facebook.github.io/react/) let's you break all of your UI components up into independant
modules. Those modules then base their rendering on a state machine you define for them and React takes care of
efficiently determining when and how much to edit the DOM. [Redux](http://redux.js.org/) centralizes
that state machine and creates a single data flow path to keep everything coherent. In general, try to keep
every aspect of the rendering located and editable in the state.

### Brief Overview
### CMC React & Redux Architecture
#### Where the Relevant Files Are
#### Example State Update Cycle
### Notes on Optimizing React/Redux Performance
### Using D3 in React
[D3](https://d3js.org/) is a big, powerful graphics/math/data library. In this application it is primarily responsible for 
renering the TimeAxis and assocaited components, though it has capabilities far beyond that which we encourage you to use.
In relation to React/Redux, D3 essentially takes care of the dynamic renderings we don't care to keep in the global state. We
create a React/Redux component to manage the data flow between D3 and the rest of the application as well as provide a
sane DOM entry point for D3. D3 then takes the DOM node and data from the state machine to perform its own rendering.
### Usage of ImmutableJS for Redux State Objects
### Quick D3 overview (regarding how we use it)


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
├── lib                       # Contains arcJS and mapskin libraries that are not available in npm
├── karma.conf.js             # Configuration for karma test runner
├── package.json              # Package configuration. The list of 3rd party libraries and utilities
├── scripts                   # Node scripts that run build related tools
│   ├── build.js              # Runs the production build
│   ├── buildHtml.js          # Builds index.html
│   ├── distServer.js         # Starts webserver and opens final built app that's in dist in your default browser
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
│   ├── constants             # Container for user defined constant files. Also includes appConfig.js which is used for general app config. Note that core is also configured from this file.
│   ├── default-data          # Default data for the application
│   │   ├── help              # In-app help markdown documentation files
│   │   └── layer-metadata    # Metadata files for each layer
│   ├── index.html            # Start page where the app bundle is included, also has loading screen written in vanilla JS.
│   ├── index.js              # Entry point for your app
│   ├── styles                # CSS Styles, typically written in Sass
│   │   ├── _theme.scss         # High level SCSS variables used for setting various application colors (Note: this is an scss partial file, see http://stackoverflow.com/questions/31311147/underscore-in-partial-sass-file)
│   │   ├── _variables.scss   # SCSS variables, mixin and animation definitions (Note: this is an scss partial file, see http://stackoverflow.com/questions/31311147/underscore-in-partial-sass-file)
│   │   └── styles.scss       # SCSS top level file used for importing _variables and Core styles.scss
│   │   
│   └── utils                 # Plain ES6 JS objects. Pure logic. No framework.
├── test-results              # Karma test results output folder
├── webpack.config.dev.js     # Configures dev webpack
└── webpack.config.prod.js    # Configures production webpack
```

## How to write tests for CMC
### Testing Tools
Mocha, Chai, Enzyme, Karma, Istanbul, nyc, etc etc. Reporters and such too.
CMC uses the [Mocha testing framework](https://mochajs.org/) with the [Chai assertion library](http://chaijs.com/).
Please refer to their respective documentation for syntactic aid etc.
### Writing a Test for your Application
Tests are placed under `src/tests` and must be named `*.spec.js`. For non-framework bound classes/functions (i.e. anything under `src/utils`)
try to maintain a 1-to-1 mapping of `*.js` to `*.spec.js` files. These tests should be in a familiar unit test format.
For framework bound classes/functions (i.e. anything under `src/reducers`) the general flow of any given test is as follows:

1. Define an initial state/store object
2. Define an array of actions to affect that store
3. Dispatch the actions
4. Define an expected state by cloning then manipulating the inital state
5. Remove those pieces of the state that cannot be compared directly (i.e. pointers to otherwise identitcal Openlayers map instances)
6. Compare the actual and expected states using `TestUtil.compareFullStates`

### Overriding, Modifying, or Ignoring a CMC Core Test
### Test Coverage and Test Results
### Karma.config.js
### GPU Enabled Testing (For Cesium)

## User Analytics
### CMC Custom User Analytics
The analytics operates as a "silent reducer". It watches every action dispatched to the store and buffers
each action that it is defined to include. Every time 10 actions are buffered or 5 seconds have passed,
the currenly buffered actions are sent as a JSON string to the defined endpoint as a POST request.

### Google Analytics
In addition to the custom analytics solution mentioned previously, CMC includes a React-based Google Analytics component that can be enabled/disabled and configured from appConfig.js. The default behavior is to register the app using a root pageview of '/' but adding more specific pageviews is as easy as calling `ReactGA.pageview('ROUTE')` when desired. For more on the React Google Analytics module please refer to the [React-GA repository](https://github.com/react-ga/react-ga)

## Upgrading your Project to Latest Version of CMC


## Deployment to Github pages
Github pages are a great way to host static content right out of your github repos. One simple way to deploy to Github pages if you don't have a continuous integration service set up or available is to use the deploy.bash script found in the `scripts` directory to push a built version of your application to github pages. Note, you'll need to enable github pages for your repository. Also note that all github pages are public even if your repository is private. Follow these steps below to deploy. The deploy script included works with multiple branches as well which can be useful for comparing built branches, sharing testable branches with others, etc.

1. Run `npm run test:cover`
2. Run `npm run build` (you may want to verify that your build works using `npm run open:dist`)
3. Make a copy of your entire repository folder and `cd` into the copy
4. Run `chmod a+x scripts/deploy.bash` to give the deploy script correct permissions
5. Run `git branch -D gh-pages` to ensure that your local gh-pages branch does not exist
6. Run `npm run deploy` and verify that the deployment was successful by navigating to, for example, `https://github.jpl.nasa.gov/pages/CommonMappingClient/cmc-core/branches/master/` where `CommonMappingClient` is the organization name, `cmc-core` is the repository name, and `master` is the branch name.
7. Cleanup by removing the folder you were just in

## Main Technologies Under the Hood
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
| [showdown](http://postcss.org/)| A Markdown to HTML converter written in Javascript |
| [react-ga](https://github.com/react-ga/react-ga)| A JavaScript module that can be used to include Google Analytics tracking code in a website or app that uses React for its front-end codebase. |
| [react-slingshot](https://github.com/coryhouse/react-slingshot)| The React/Redux/Webpack starter kit CMC is based off of. CMC has diverged a fair bit from React-Slingshot in many respects but still owes a great deal of its webpack structure, config, npm scripts, and dev server code to react-slingshot.