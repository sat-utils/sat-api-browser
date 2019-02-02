
## sat-api-browser
A query constructor and results visualizer for [stac-spec](https://github.com/radiantearth/stac-spec/tree/master/api-spec)
compliant APIs.

## Intent
The STAC `api-spec` provides a powerful interface for querying and filtering
data represented as STAC catalogs. But constructing appropriate queries to find
datasets that meet your criteria can be difficult when done manually due to the
verbose query language defined by the standard.  The `sat-api-browser`'s intent is to simplify this
query construction by providing a UI which lets users use STAC extension
[schemas](https://github.com/radiantearth/stac-spec/tree/master/extensions) to
build and validate queries. 

Once the user has received the results of the query, they can select candidate
items and save them to a list to quickly and seamlessly build
large lists of datasets (represented as STAC items) that they can use in other
applications.  This provides the ability to query and search for data in a more
iterative fashion rather than attempting to build a single all encompassing query
to capture results.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `yarn install`
Installs necessary dependencies.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`
Runs the tap based unit tests.

### `yarn run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

The following environment variables are required.  You can copy and rename `.env.sample` to `.env` for use as a template.<br>
`SKIP_PREFLIGHT_CHECK=true`
`REACT_APP_API_URL` The URL with port of the oam-api.<br>
`REACT_APP_MAPBOX_ACCESS_TOKEN`<br>
`REACT_APP_RESULT_LIMIT`

### Design Approach

The application uses [Redux](https://redux.js.org/) for state management.

The Redux [store](https://redux.js.org/basics/store) is a vanilla JS object but each logical state slice is an [ImmutableJS](https://facebook.github.io/immutable-js/) [map](https://facebook.github.io/immutable-js/docs/#/Map).  

State slices are never queried directly from the store but are accessed via [selectors](https://redux.js.org/recipes/computingderiveddata) which are memomized using the [Reselect](https://github.com/reduxjs/reselect) library where appropriate.

The application design uses both Presentational and Container components but makes liberal use of [react-redux](https://react-redux.js.org/docs/introduction/basic-tutorial) `connect` as outlined [here](https://redux.js.org/faq/reactredux#should-i-only-connect-my-top-component-or-can-i-connect-multiple-components-in-my-tree).

State that is transient or does not affect other components in the application can be maintained directly in components where appropriate as described [here](https://redux.js.org/faq/organizingstate#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate).

Pure stateless React [components](https://reactjs.org/docs/state-and-lifecycle.html) are preferred but Class components are used where local state is required.

Any impure actions which may have side effects (asynchronous API requests, interaction with browser local storage) are isolated in Redux [middleware](https://redux.js.org/advanced/middleware).

Cross-cutting actions are also managed through the use of middleware.

The application uses [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) for map display and management.  When the `Map` React component mounts it loads a [style](https://www.mapbox.com/mapbox-gl-js/style-spec) and some GeoJSON data.  This state is then pushed into the Redux store where all subsequent actions act on this state and provide the Map component with the new updated style via props. A more detailed description of this approach is available in this blog [post](https://blog.mapbox.com/mapbox-gl-js-in-a-reactive-application-e08eecf0221b) by Tom Macwright.

The application uses [Material-UI](https://material-ui.com/) for UI components and styling.

Individual component style [overrides](https://material-ui.com/customization/overrides/) are acheived using Material UIs own css injection with [JSS](https://cssinjs.org/?v=v9.8.7).

The application store is configured to support the [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) for advanced debugging with state rewind and fast forward.

Because the application makes extensive use of [HOCs](https://reactjs.org/docs/higher-order-components.html), wrapped components are exposed as the default export while raw components are available as a named component.  This allows for unit testing without invoking HOC behavior.

The application uses [tape-await](https://github.com/mbostock/tape-await) to simplify asynchronous test flow for middleware.
