# FAQ

### Prerequisites
* NodeJS

### Quick Installation
* `npm install`

### Run Dev Server
* `npm start`

### Run Tests
* Single run of tests: `npm run test`
* Run tests with code watch: `npm run test:watch`
* Single run of tests with coverage report: `npm run test:cover`

### Build for Production
* `npm run build`

### Run Build Server
* `npm run build`
* `npm run open:dist`

### What is CMC?
The Common Mapping Client is a foundation for web based mapping applications that leverages, combines, and abstracts certain commonly used mapping functionalities, enabling developers to spend less time reinventing the wheel and more time solving their specific problems.

### Where did this project start?
CMC was born in 2014 and used Dojo as its underlying framework. After much
fragmentation and slapdash development, a new effort was undertaken in 2016
to create a stable and forward-thinking re-implementation of CMC using
React/Redux. This project used [React Slingshot](https://github.com/coryhouse/react-slingshot)
as a starting point.

### How do you determine what features should or shouldn't be in CMC?
CMC is not a final, user-facing application. CMC is a foundation on which to build more specific applications. Because of that, what is and is not part of the CMC core is an ongoing discussion, but the general idea is that if the majority of applications CMC is intended to support require a certain functionality, (such as shareable urls or adjusting layer opacity), then CMC should include it. It is important to be able to exclude certain functionalities from CMC in order to keep CMC as thin as possible, that way developers can spend more time creating and less time removing unwanted features.

### When to use CMC?
CMC is suitable for complex production applications centered around maps and geospatial data. Ideally, these applications build on top of CMC without having to re-write a significant portion of the core code. See our [Example Projects](https://podaac-git.jpl.nasa.gov:8443/cmc/cmc-core/blob/master/docs/EXAMPLE_PROJECTS.md) for more.

### When not to use CMC?
Unless you are already fairly comfortable with CMC architechture and development practices, small and very experimental demo projects would be more easily and more quickly developed without CMC.

### What are the Example projects in CMC?
Example projects are small applications that build one or two features on top of CMC. We use the example projects to demonstrate:

* CMC's flexibility and power
* How a feature could be integrated into your project
* Explorations of new techniques of data vizualization and interaction
* Explorations of new user interactions and workflows

### What are the major functionalities CMC provides?
* 2D/3D Map library abstraction
* Map layer controls
* Map layer ingestion and merging (from JSON and WMTS capabilities XML)
* Highly customizable user analytics
* Configurable map projection
* Basic vector layer support
* Map extent synchronization across all maps (2D and 3D)
* Geodesic map geometry synchronization across all maps (2D and 3D)
* Global time widget, and interactive timeslider
* Adjustable map layer cache
* Shareable/loadable application state via url parameters with share widget (facebook, twitter, email, google plus)
* Core set of UI elements necessary for most basic applications
* Basemap switching
* Basic shape drawing tools in 2D and 3D
* Basic geodesic measurement (distance and area) tools in 2D and 3D
* Display help documentation from markdown files
* A preconfigured testing framework
* A preconfigured build process
* Handy development tools
  * Hot reloading
  * Local dev and production node servers
  * BrowserSync

### When should I separate a large component into smaller components?
Of course keeping your code modular and reusable is paramount. However, the overhead involved in making any component
(defining their proptypes, rendering methods, update conditions, etc) can often overweigh their utility as an independant module.
Here are some guidelines we've come up with for knowing whether or not it's worth creating a new module.

_Minimum recommendations for a component_:
* The component returns more than 1 node in the `render` method
* The component performs 1 or more actions
* The component has more than 1 display state
* The component includes logic that would unduely clutter to parent/sibling components

Read up on [ReactJS](facebook.github.io/react/) and [ReduxJS](http://redux.js.org) for more detailed information.
