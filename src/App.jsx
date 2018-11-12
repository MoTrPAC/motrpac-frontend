import React from 'react';
import { Route, Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from './reducers/index';
import history from './history';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LandingPage from './components/landingPage';
import dashboard from './components/dashboard';
import uploadScreen from './components/uploadScreen';
import AuthLoading from './components/authLoading';

require('bootstrap');


function App() {
  // TODO: Before production remove redux devtools extension javascript
  return (
    <Provider store={createStore(rootReducer, defaultRootState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
      <Router history={history}>
        <div className="App">
          <header>
            <Navbar />
          </header>
          <div className="componentHolder">
            <Route path="/" exact component={LandingPage} />
            <Route path="/dashboard" component={dashboard} />
            <Route path="/upload" component={uploadScreen} />
          </div>
          <Footer />
          <AuthLoading />
        </div>
      </Router>
    </Provider>
  );
}


export default App;
