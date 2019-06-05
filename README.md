
## stac-search-gui 
A query constructor and results visualizer for [stac-spec](https://github.com/radiantearth/stac-spec/tree/master/api-spec)
compliant APIs.

## Intent

The STAC `api-spec` provides querying and filtering capabilities for data
represented as STAC catalogs.  The `stac-search-gui`'s intent is to simplify
STAC compliant API filter construction and results visualization by providing a
UI which lets users use STAC extension [schemas](https://github.com/radiantearth/stac-spec/tree/master/extensions)
to build and validate filters. 

Once the user has received the results of the query, they can select interesting
candidate items and save them to a 'shopping cart' of datasets (represented as STAC items)
that they can leverage in other applications.  This provides the ability to search
for data in a more organic and iterative fashion (much like shopping) rather than
attempting to build a single all encompassing query to capture appropriate results
like traditional data search applications.


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
`SKIP_PREFLIGHT_CHECK=true`<br>
`REACT_APP_API_URL` The URL with port of the stac compliant api.<br>
`REACT_APP_MAPBOX_ACCESS_TOKEN`<br>
`REACT_APP_RESULT_LIMIT`

### `yarn run build && aws s3 sync build/ s3://sat-api-browser-dev`

Build and deploy to s3 bucket.

## References
- Based on [sat-api-browser](https://github.com/developmentseed/sat-api-browser)