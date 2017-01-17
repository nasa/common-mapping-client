# Developer Manual

## Table of Contents
1. [Installation Guide](#installation-guide)
2. [Package.json Scripts Overview](#overview-of-various-start-build-etc-commands-from-packagejson)
3. [Installing & Removing Modules via npm](#third-example)
4. [The CMC _core Philosphy](#example)
4. [CMC Build Process](#third-example)
5. [Styling CMC](#third-example)
    1. [React UI Component Library (React-Toolbox)](#third-example)
    2. [SASS Usage](#third-example)
    3. [Overriding Core Styles](#third-example)
    4. [Overriding React-Toolbox SASS Variables](#third-example)
    5. [postCSS](#third-example)
    6. [Theming](#third-example)
6. [React & Redux](#third-example)
    1. [Brief Overview](#third-example)
    2. [CMC React & Redux Architecture](#third-example)
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
17. [CMC Scripts](#example)
19. [Main Technologies Under the Hood](#example)
20. [Deployment to Github pages](#example)

***

### Installation guide
Make sure you have [NodeJS](https://nodejs.org/en/) 4.4 or higher installed before continuing.

Once you have a copy of the project, install all the dependencies and prep the project for development by running:

* `npm install`

Next, start the development server by running:

* `npm start`

Your default browser should open to `localhost:3000` and you should see a default mapping application. Now get building!

### Overview of various start, build, etc., commands from package.json
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

### Installing/removing packages via npm
NPM packages are installed and removed using the following commands. The `--save` flag tells NPM to save/remove the specified packages from your `package.json` file.
* Install a package : `npm install <package_name> --save`
* Remove a package : `npm remove <package_name> --save`

### Build system overview via webpack including Cesium loading
[It's really quite straight forward](http://chucksblog.typepad.com/.a/6a00d83451be8f69e201bb07e83109970d-popup)

### Quick SASS overview
It's like CSS, but better. You can define variables and stuff. No really, [check it out](http://sass-lang.com/)

### Quick React/Redux overview (in general + our set up)
[The React framework](https://facebook.github.io/react/) let's you break all of your UI components up into independant
modules. Those modules then base their rendering on a state machine you define for them and React takes care of
efficiently determining when and how much to edit the DOM. [Redux](http://redux.js.org/) centralizes
that state machine and creates a single data flow path to keep everything coherent. In general, try to keep
every aspect of the rendering located and editable in the state.

### Quick React Toolbox overview
[React-Toolbox](http://react-toolbox.com/) is a React UI Component library
that follows [Google's Material Design Standards](https://material.google.com/). React-Toolbox was chosen for CMC because React-Toolbox is fairly complete component-wise, does not inline css, and exposes most of the necessary selectors for overriding and tweaking its components. At times certain CSS hacks _are_ necessary to style or fix certain components that don't expose the desired elements with classes or data-react-toolbox attributes.

### Quick D3 overview (regarding how we use it)
[D3](https://d3js.org/) is a big, powerful graphics/math/data library. In this application it is primarily responsible for 
renering the TimeAxis and assocaited components, though it has capabilities far beyond that which we encourage you to use.
In relation to React/Redux, D3 essentially takes care of the dynamic renderings we don't care to keep in the global state. We
create a React/Redux component to manage the data flow between D3 and the rest of the application as well as provide a
sane DOM entry point for D3. D3 then takes the DOM node and data from the state machine to perform its own rendering.

### Brief Overview of Application Directory 
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

### How to write tests for CMC
Tests are placed under `src/tests` and must be named `*.spec.js`. For non-framework bound classes/functions (i.e. anything under `src/utils`)
try to maintain a 1-to-1 mapping of `*.js` to `*.spec.js` files. These tests should be in a familiar unit test format.
For framework bound classes/functions (i.e. anything under `src/reducers`) the general flow of any given test is as follows:

1. Define an initial state/store object
2. Define an array of actions to affect that store
3. Dispatch the actions
4. Define an expected state by cloning then manipulating the inital state
5. Remove those pieces of the state that cannot be compared directly (i.e. pointers to otherwise identitcal Openlayers map instances)
6. Compare the actual and expected states using `TestUtil.compareFullStates`

CMC uses the [Mocha testing framework](https://mochajs.org/) with the [Chai assertion library](http://chaijs.com/).
Please refer to their respective documentation for syntactic aid etc.

### How CMC analytics work (briefly, will be covered in separate example)
The analytics operates as a "silent reducer". It watches every action dispatched to the store and buffers
each action that it is defined to include. Every time 10 actions are buffered or 5 seconds have passed,
the currenly buffered actions are sent as a JSON string to the defined endpoint as a POST request.

### Google Analytics
In addition to the custom analytics solution mentioned previously, CMC includes a React-based Google Analytics component that can be enabled/disabled and configured from appConfig.js. The default behavior is to register the app using a root pageview of '/' but adding more specific pageviews is as easy as calling `ReactGA.pageview('ROUTE')` when desired. For more on the React Google Analytics module please refer to the [React-GA repository](https://github.com/react-ga/react-ga)

### ImmutableJS for State Objects
### The CMC _core Philosphy
### Upgrading your Project to Latest Version of CMC
### The CMC Build Process
### SASS, Style Overrides, postCSS, and Theming
### CMC Scripts
### Test Coverage and Test Results


### Deployment to Github pages
Github pages are a great way to host static content right out of your github repos. One simple way to deploy to Github pages if you don't have a continuous integration service set up or available is to use the deploy.bash script found in the `scripts` directory to push a built version of your application to github pages. Note, you'll need to enable github pages for your repository. Also note that all github pages are public even if your repository is private. Follow these steps below to deploy. The deploy script included works with multiple branches as well which can be useful for comparing built branches, sharing testable branches with others, etc.

1. Run `npm run test:cover`
2. Run `npm run build` (you may want to verify that your build works using `npm run open:dist`)
3. Make a copy of your entire repository folder and `cd` into the copy
4. Run `chmod a+x scripts/deploy.bash` to give the deploy script correct permissions
5. Run `git branch -D gh-pages` to ensure that your local gh-pages branch does not exist
6. Run `npm run deploy` and verify that the deployment was successful by navigating to, for example, `https://github.jpl.nasa.gov/pages/CommonMappingClient/cmc-core/branches/master/` where `CommonMappingClient` is the organization name, `cmc-core` is the repository name, and `master` is the branch name.
7. Cleanup by removing the folder you were just in

### Bundled Packages
Main tech under the hood


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
