MoTrPAC Data Hub
================

[![MoTrPAC Data Hub](/src/assets/logo-motrpac.png)](https://motrpac-data.org)

**User interface and Frontend for MoTrPAC Bioinformatics Center**
---

[![CI](https://github.com/MoTrPAC/motrpac-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/MoTrPAC/motrpac-frontend/actions/workflows/ci.yml)

Directory Layout and Setup
--------------------------

File Structure
--------------

.  
├── src  
│   ├── assets: images, logos, etc.  
│   ├── components: jsx UI components  
│   ├── data: static JSON data (study datasets, metadata)  
│   ├── lib: static information like team member names and assay lists  
│   ├── sass: source sass styling (compiled to src/main.css via `yarn sass`)  
│   └── \[Component/Feature Name\]: contains reducers, actions, components, subcomponents, and tests  
│   |   └── \_\_test\_\_: contains the storybook story and vitest tests for the feature.  
├── public  
├── .storybook: configuration for storybook  
├── eslint.config.js: ESLint configuration  
├── stylelint.config.js: StyleLint configurations for Sass linting  
├── vite.config.js: Vite build configuration and path aliases

Flow for creating new components
--------------------------------

  1. Create \[component\].jsx file in src/\[Component\]
  2. Create storybook story file src/\[Component\]/\_\_test\_\_/\[component\].stories.jsx
  3. Create tests in src/\[Component\]/\_\_test\_\_/\[component\].test.jsx
  4. Integrate required actions and reducers in to the components directory (ex. for upload handling logic that would be src/UploadPage/uploadReducer.js)
  5. If it is a full page, add routing logic to src/App/App.jsx

Building and running
--------------------

* Preparation:
  * Run `corepack enable` to activate the Yarn version pinned in `package.json` (Yarn 4).
  * Set `node` environment to `20.x`, or use `nvm` to run `nvm use v20.19.5`.
  * Create a `.env` file at the root of the local working copy and add `ESLINT_NO_DEV_ERRORS=true`.
  * Add additional required environment variables to the `.env` file in root (e.g. the API service address). All client-side variables must be prefixed with `VITE_`.
  * Run `yarn install`.

* Building CSS: Uses sass in `node_modules/sass/sass.js`
  * `yarn sass`
  * Compiles sass from `src/sass/main.scss` to `src/main.css`

* Running React App:
  * `yarn start`
  * Runs core React app at localhost:5173 (Vite dev server)

* Running Storybook:
  * `yarn storybook`
  * Runs storybook server at localhost:9009

* Testing:
  * `yarn test`
  * Runs Vitest tests
  * `yarn test --coverage`
  * Runs all tests and returns table illustrating code coverage
  * `yarn test --ui`
  * Opens interactive Vitest UI

* Quickly inspect someone's branch:
  * `yarn inspect-branch`
  * Rebuilds node_modules if different, compiles Scss, and starts react app

Knowledge Center docs refresh (manual local run)
-------------------------------------------------

`yarn build` does **not** run `scripts/fetch-docs.js`.

To refresh Knowledge Center docs locally on demand, run: `node scripts/fetch-docs.js`.
(`yarn fetch-docs` is an equivalent shortcut.)

The script automatically loads root `.env` values when present.

* If `GITHUB_PAT`, `GITHUB_REPO_OWNER`, and `GITHUB_REPO_NAME` are present, docs are fetched from GitHub and `src/data/knowledge-base.json` is regenerated.
* If those variables are missing, fetch is skipped and the existing `knowledge-base.json` remains unchanged.
* Set `DOCS_FETCH_STRICT=true` to fail the build on docs fetch errors.

Optional docs source variables:

* `GITHUB_DOCS_BRANCH` (default: `main`)
* `GITHUB_DOCS_PATH` (default: `docs`)

Software versions and styles
----------------------------

Software
--------

* [Node v20](https://github.com/nodejs/Release)
  * Check your version: `node --version`
  * If the version is not 20, use [nvm](https://github.com/creationix/nvm/blob/master/README.md#installation): `nvm use v20.19.5`

* [Yarn 4](https://yarnpkg.com) (pinned in `package.json` — activate via `corepack enable`)

* [React v18](https://react.dev)
  * Built with [Vite 5](https://vitejs.dev) + SWC for fast refresh
  * Storybook used to visualize individual UI components

* Style guide:
  * [Eslint](https://github.com/eslint/eslint) (flat config: `eslint.config.js`)
  * [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
  * [Style Lint Recommended SCSS Guide](https://github.com/stylelint/stylelint-config-recommended)

Additional Notes
----------------

Testing meta tags
-----------------

* localtunnel used to serve react app with command `lt --port 5173` after running the app using `yarn start` in a separate terminal
* url from localtunnel used to test in [Twitter Card Validator](https://cards-dev.twitter.com/validator)  and the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/sharing/)
* `%PUBLIC_URL%` evaluates to nothing if the application is running on the dev server so the images which require absolute urls may not display

Notes on redux integration
--------------------------

* New components should use `useSelector` and `useDispatch` hooks from `react-redux`.
* Existing components that use `connect()` should be left as-is for consistency.
* Components connected to a redux store are exported by default as connected functions/containers. They are also exported in pure function form (ex: "import { UploadScreen } from 'path/to/component' " for pure function and "import UploadScreen from 'path/to/component'" for container) — always export both so components can be tested without a Redux store.
* mapStateToProps used to link the section from the combined reducer to properties required by the container
* mapDispatchtoProps defines required actions and what to send to a reducer.
* redux-thunk middleware used to handle asynchronous requests like for authentication

Potential down the line dependency issues
-----------------------------------------

* Storybook has trouble integrating with react-router. The `storybook-addon-remix-react-router` package handles this. If you run in to an issue with storybook saying something like "You should not use Link outside Router" it has something to do with react-router and this addon.

Current navigation/routing implementation
----------------------------------------

* React-router v6 is being used to handle routing
* history ( createBrowserHistory ) is used to update location from button clicks and function calls ( history.push('path/to/new/location') )
* \< Link > tags  from react-router are used in place of \< a > tags handle navigation from links. Certain elements return \< Redirect to="path/to/new/location" > elements if protected and user not authenticated.
* Analysis page only uses routing to differentiate between human and analysis (/analysis/human or /analysis/animal). After that it acts as a single page application.

Download Page Behavior
----------------------

* Makes call to backend for a list of uploads (size depending maxRows variable) on a given page. Expects backend to give total count of uploads fitting filters and the uploads for a specific page. (e.g on page 2, with 10 rows per page, expects items 11-20  from backend and a count of all  rows that fit current filters)
* Changing filters should also call backend
