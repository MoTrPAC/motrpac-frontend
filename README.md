# motrpac-frontend
**User interface and Frontend for MoTrPAC Bioinformatics Center**
---

### Directory Layout and Setup

#### File Structure

.  
├── src  
│   ├── components: jsx UI components  
│   ├── index.css  
│   ├── index.js  
│   ├── main.css: Compiled from sass/main.sass  
│   ├── reducers: Handles logic for redux store  
│   ├── sass: source sass styling  
│   ├── stories: UI visual tests for storybook  
│   ├── storybook.test.js: initialize snapshots for storybook tests  
│   ├── tests: Contains tests for components and reducers
│   └── testData: Mock data used in stories and tests
├── public  
├── .storybook: configuration for storybook  
├── .eslintrc.js: ESlint configuration  

#### Flow for creating new components
  1. Create \[component\].jsx file in src/components
  2. Create storybook snapshots file \[component\].stories.jsx
  3. Create tests in tests/components/\[component\].test.jsx
  4. Integrate required actions in to associated reducer (ex. for upload handling logic that would be src/reducers/uploadReducer.js)
  5. If it is a full page, add routing logic to src/App.jsx

#### Building and running

 * Running React App 
   - `yarn start`
   - runs core React app at localhost:3000

 * Running Storybook:
   - `yarn run storybook`
   - runs storybook server at localhost:9009

 * testing:
   - `yarn test`
   - runs tests and storybook snapshots

 * Building CSS:
   - `yarn sass`
   - compiles sass from src/sass/main.sass to src/main.css

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

---
