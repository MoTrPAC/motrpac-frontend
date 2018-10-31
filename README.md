# motrpac-frontend
**User interface and Frontend for MoTrPAC Bioinformatics Center**
---

### Directory Layout and Setup

#### File Structure
`.  
├── src   

│   ├── components: jsx UI components  
│   ├── index.css  
│   ├── index.js  
│   ├── logo.svg  
│   ├── main.css: Compiled from sass/main.sass  
│   ├── reducers.js: Handles logic for redux store  
│   ├── sass: source sass styling  
│   ├── stories: UI visual tests for storybook  
│   ├── storybook.test.js: initialize snapshots for storybook tests  
│   └── testData: Mock data  
├── public  
├── .storybook: configuration for storybook  
├── .eslintrc.js: ESlint configuration  
`

#### Building and running

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
