# Developer Manual

### Installation guide
Make sure you have `Node` and `npm` installed before continuing.

Once you have a copy of the project, install all the dependencies and prep the project for development by running:

* `npm install`

Next, start the development server by running:

* `npm start`

Your default browser should open to localhost:3000 and you should see a default mapping application.

Now get building!

### Overview of various start, build, etc., commands from package.json
| **Script** | **Description** |
|----------|-------|
| prestart | Runs automatically before start. Calls remove-dist script which deletes the dist folder. This helps remind you to run the build script before committing since the dist folder will be deleted if you don't. ;) |
| start | Runs tests, lints, starts dev webserver, and opens the app in your default browser. |
| open:src | Serve development version of the app using babel-node |
| open:dist | Serve production version of the app using babel-node |
| lint:tools | Runs ESLint on build related JS files. (eslint-loader lints src files via webpack when `npm start` is run) |
| clean-dist | Removes everything from the dist folder. |
| remove-dist | Deletes the dist folder. |
| build:html | Copies src/index.html into /dist/index.html |
| prebuild | Runs automatically before build script (due to naming convention). Cleans dist folder, builds html, and builds sass. |
| build | Bundles all JavaScript using webpack and writes it to /dist. |
| test | Runs tests (files ending in .spec.js) using Mocha and outputs results to the command line. |
| test:watch | Runs tests (files ending in .spec.js) using Mocha and outputs results to the command line.  Watches all files so tests are re-run upon save. |
| postinstall | Copies over certain node_module files, libraries, sets up other stuff, etc. |

### Installing/removing modules via npm
NPM modules are installed and removed using the following commands
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
that state machine and creates a single data flow path to keep everything coherent.

### Quick React Toolbox overview
[React-Toolbox](http://react-toolbox.com/) is a library of what I will call "React-Compliant" UI components
that follow [Google's Material Design Standards](https://material.google.com/). We use it to make things look nice easily

### Quick D3 overview (regarding how we use it)
[D3](https://d3js.org/) is a big, powerful library. We use it to handle large, dynamic data processing and interactions. This
is mainly comprised of the TimeSlider and associated components. Basically, it renders SVGs really well and has a bunch of
useful math built in.

### Brief Overview of Application Directory 
```
.
├── .babelrc                  # Configures Babel
├── .editorconfig             # Configures editor rules
├── .eslintrc                 # Configures ESLint
├── .gitignore                # Tells git which files to ignore
├── .npmrc                    # Configures npm to save exact by default
├── README.md                 # This file.
├── dist                      # Folder where the build script places the built app. Use this in prod.
├── public                    # Folder created during postinstall to house Cesium and Cesium-Drawhelper
├── docs                      # All documentation
├── karma.conf.js             # Configuration for karma test runner
├── package.json              # Package configuration. The list of 3rd party libraries and utilities
├── postbuild.sh              # Shell script that runs after npm build to copy over certain libs to certain places in the distribution
├── postinstall.sh            # Shell script that copies over certain node_module files, libraries, sets up other stuff, etc.
├── src                       # Source code
│   ├── actions               # Flux/Redux actions. List of distinct actions that can occur in the app.  
│   ├── components            # React components
│   ├── constants             # Application constants including constants for Redux
│   ├── default-data          # Default data for the application
│   │   ├── help              # In-app help markdown documentation files
│   ├── index.html            # Start page
│   ├── index.js              # Entry point for your app
│   ├── lib                   # 3rd party libraries not in npm or copied over during postinstall
│   ├── reducers              # Redux reducers. Your state is altered here based on actions
│   │   ├── models            # State models acted upon by reducers. Each reducer corresponds to a model
│   ├── store                 # Redux store configuration
│   ├── styles                # CSS Styles, typically written in Sass
|   |   ├── lib               # Any 3rd party CSS libraries (copied over from node_modules or src/lib during postinstall)
|   |   ├── resources         # CSS Styles, typically written in Sass
│   ├── tests                 # All tests
│   │   ├── data              # Any dummy data tests may need
│   └── utils                 # Plain ES6 JS objects. Pure logic. No framework.
├── tools                     # Node scripts that run build related tools
│   ├── build.js              # Runs the production build
│   ├── buildHtml.js          # Builds index.html
│   ├── distServer.js         # Starts webserver and opens final built app that's in dist in your default browser
│   ├── srcServer.js          # Starts dev webserver with hot reloading and opens your app in your default browser
├── webpack.config.dev.js     # Configures dev webpack
└── webpack.config.prod.js    # Configures production webpack
```

### How to write tests
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

### How the analytics work (briefly, will be covered in separate example)
The analytics operates as a "silent reducer". It watches every action dispatched to the store and buffers
each action that it is defined to include. Every time 10 actions are buffered or 5 seconds have passed,
the currenly buffered actions are sent as a JSON string to the defined endpoint as a POST request.

### Bundled Packages
Main tech under the hood


| **Tech** | **Description** |**Learn More**|
|----------|-------|---|
| [React](https://facebook.github.io/react/)  |   Fast, composable client-side components.    | [Pluralsight Course](https://www.pluralsight.com/courses/react-flux-building-applications)  |
| [Redux](http://redux.js.org) |  Enforces unidirectional data flows and immutable, hot reloadable store. Supports time-travel debugging. Lean alternative to [Facebook's Flux](https://facebook.github.io/flux/docs/overview.html).| [Pluralsight Course](http://www.pluralsight.com/courses/react-redux-react-router-es6)    |
| [Cesium](http://cesiumjs.org) | An open-source JavaScript library for world-class 3D globes and maps. |
| [Openlayers](http://openlayers.org) | A high-performance, feature-packed library for all your mapping needs. |
| [d3](https://d3js.org/) | D3.js is a JavaScript library for manipulating documents based on data. |
| [fetch](https://github.com/github/fetch) | An easier Javascript request library adhering to the new Fetch standard. |
| [Moment](http://momentjs.com/) | Parse, validate, manipulate, and display dates in JavaScript. |
| [React-Toolbox](http://react-toolbox.com/) | Bootstrap your application with beautiful Material Design Components. |
| [TurfJS](http://turfjs.org/) | Advanced geospatial analysis for browsers and node. |
| [ArcJS](https://github.com/springmeyer/arc.js/) | Great Circle routes in Javascript. |
| [Babel](http://babeljs.io) |  Compiles ES6 to ES5. Enjoy the new version of JavaScript today.     | [ES6 REPL](https://babeljs.io/repl/), [ES6 vs ES5](http://es6-features.org), [ES6 Katas](http://es6katas.org), [Pluralsight course](https://www.pluralsight.com/courses/javascript-fundamentals-es6)    |
| [Webpack](http://webpack.github.io) | Bundles npm packages and our JS into a single file. Includes hot reloading via [react-transform-hmr](https://www.npmjs.com/package/react-transform-hmr). | [Quick Webpack How-to](https://github.com/petehunt/webpack-howto) [Pluralsight Course](https://www.pluralsight.com/courses/webpack-fundamentals)|
| [Browsersync](https://www.browsersync.io/) | Lightweight development HTTP server that supports synchronized testing and debugging on multiple devices. | [Intro vid](https://www.youtube.com/watch?time_continue=1&v=heNWfzc7ufQ)|
| [Karma](https://karma-runner.github.io/1.0/index.html) | Test runner for Javascript. |
| [Mocha](http://mochajs.org) | Automated tests with [Chai](http://chaijs.com/) for assertions and [Enzyme](https://github.com/airbnb/enzyme) for DOM testing without a browser using Node. | [Pluralsight Course](https://www.pluralsight.com/courses/testing-javascript) |
| [ESLint](http://eslint.org/)| Lint JS. Reports syntax and style issues. Using [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) for additional React specific linting rules. | |
| [SASS](http://sass-lang.com/) | Compiled CSS styles with variables, functions, and more. | [Pluralsight Course](https://www.pluralsight.com/courses/better-css)|
| [npm Scripts](https://docs.npmjs.com/misc/scripts)| Glues all this together in a handy automated build. | [Pluralsight course](https://www.pluralsight.com/courses/npm-build-tool-introduction), [Why not Gulp?](https://medium.com/@housecor/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8#.vtaziro8n)  |