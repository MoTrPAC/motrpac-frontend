[![MoTrPAC Data Hub](/src/assets/logo-motrpac.png)](https://motrpac-data.org)

**User interface and Frontend for MoTrPAC Bioinformatics Center**
---
[![CircleCI](https://circleci.com/gh/MoTrPAC/motrpac-frontend.svg?style=svg)](https://circleci.com/gh/MoTrPAC/motrpac-frontend)
[![Sauce Test Status](https://saucelabs.com/buildstatus/motrpac-developers)](https://app.saucelabs.com/u/motrpac-developers)

### Directory Layout and Setup

#### File Structure

.  
├── src  
│   ├── assets: images, logos, etc.  
│   ├── components: jsx UI components  
│   ├── lib: static information like team member names and assay lists  
│   ├── main.css: Compiled from sass/main.sass  
│   ├── sass: source sass styling  
│   ├── storybook.test.js: initialize snapshots for storybook tests  
│   ├── storybookSnapshotInit.Skiptest.js: rename Skiptest to test to include snapshot testing  
│   ├── testData: Mock data used in stories and tests  
│   └── \[Component/Feature Name\]: contains reducers, actions, components, subcomponents, and tests  
│   |   └── \_\_test\_\_: contains the storybook story and jest tests for the feature.  
├── public  
├── .storybook: configuration for storybook  
├── .eslintrc.js: ESlint configuration  
├── .stylelint.config.js: StyleLint configurations for Sass Linting . 

#### Flow for creating new components
  1. Create \[component\].jsx file in src/\[Component\]
  2. Create storybook snapshots file src/\[Component\]/\_\_test\_\_/\[component\].stories.jsx
  3. Create tests in src/\[Component\]/\_\_test\_\_/\[component\].test.jsx
  4. Integrate required actions and reducers in to the components directory (ex. for upload handling logic that would be src/UploadPage/uploadReducer.js)
  5. If it is a full page, add routing logic to src/App/App.jsx

#### Building and running

 * Running React App:
   - `yarn start`
   - runs core React app at localhost:3000

 * Running Storybook:
   - `yarn run storybook`
   - runs storybook server at localhost:9009

 * Testing:
   - `yarn test`
   - runs tests and storybook snapshots
   - `yarn test --coverage`
   - runs all tests and returns table illustrating code coverage

 * Building CSS: Uses sass in node_modules/sass/sass.js
   - `yarn sass`
   - compiles sass from src/sass/main.scss to src/main.css
   - `yarn sass-watch`
   - compiles sass from src/sass/main.scss to src/main.css and watches for changes

 * Quickly inspect someone's branch:
   - `yarn inspect-branch`
   - compiles Scss, rebuilds node_modules if different, and starts react app

### Software versions and styles

#### Software:

 * [Node v10](https://github.com/nodejs/Release)
     - Check your version: `node --version`
     - If the version is not 10, you can `brew install node@10` or use [nvm](https://github.com/creationix/nvm/blob/master/README.md#installation), the Node Version Manager
     
 * [React v16](https://reactjs.org/versions)
     - Storybook used to visualize individual UI components

 * Style guide:
     - [Eslint](https://github.com/eslint/eslint) 
     - [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
     - [Style Lint Recommended SCSS Guide](https://github.com/stylelint/stylelint-config-recommended)

### Additional Notes

#### Testing meta tags
 - localtunnel used to serve react app with command `lt --port 3000` after running the app using `yarn start` in a seperate terminal
 - url from localtunnel used to test in [Twitter Card Validator](https://cards-dev.twitter.com/validator)  and the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/sharing/)
 - `%PUBLIC_URL%` evaluates to nothing if the application is running on the dev server so the images which require absolute urls may not display

#### Notes on redux integration
 - Components that need to be linked to a redux store in implementation are exported by default as connected functions/containers. They are also exported in pure function form (ex: "import { UploadScreen } from 'path/to/component' " for pure function and "import UploadScreen from 'path/to/component'" for container).
 - mapStateToProps used to link the section from the combined reducer to properties required by the container
 - mapDispatchtoProps defines required actions and what to send to a reducer.
 - redux-thunk middleware used to handle asynchronous requests like for authentication

#### Potential down the line dependency issues
  - Storybook has trouble integrating with react-router, I installed a package called storybook-react-router to make them work together. If you run in to an issue with storybook saying something like "You should not use <Link > outside <Router >" it has something to do with react-router and storybook-react-router

#### Current navigation/routing implementation
  - React-router is being used to handle routing
  - history ( createBrowserHistory ) is used to update location from button clicks and function calls ( history.push('path/to/new/location') )
  - \< Link > tags  from react-router are used in place of \< a > tags handle navigation from links. Certain elements return \< Redirect to="path/to/new/location" > elements if protected and user not authenticated.
  - Analysis page only uses routing to differentiate between human and analysis (/analysis/human or /analysis/animal). After that it acts as a single page application.

#### Download Page Behavior
  - Makes call to backend for a list of uploads (size depending maxRows variable) on a given page. Expects backend to give total count of uploads fitting filters and the uploads for a specific page. (e.g on page 2, with 10 rows per page, expects items 11-20  from backend and a count of all  rows that fit current filters)
  - Changing filters should also call backend

#### Samir's Flow for Creating Custom Font Icons
  1. Create a 200px by 200px artboard in Adobe Illustrator
  2. Draw Icon and export artboard as SVG (make sure only one color -- white counts as a color but transparent does not)
  3. Upload all icons to [IcoMoon](https://icomoon.io/app/#/select) 4. Download and unzip resultant zipped file
  5. Copy contents of the fonts folder (icomoon.eot, icomoon.woff, icomoon.svg, icomoon.tff) and place  them in the src/assets/fonts folder overwriting  the previous file. 

  - Make sure you upload ALL custom icons to icomoon so that previously created icons are still accessible

---

Cross-browser Testing Platform and Open Source ❤️ provided by [Sauce Labs][homepage]

[homepage]: https://saucelabs.com
