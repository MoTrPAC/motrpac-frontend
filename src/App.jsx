import React from 'react';
import { Route, Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from './reducers/index';
import history from './history';
import NavbarConnected from './components/navbar';
import FooterConnected from './components/footer';
import LandingPageConnected from './components/landingPage';
import DashboardConnected from './components/dashboard';
import UploadScreenConnected from './components/uploadScreen';
import AuthLoadingConnected from './components/authLoading';

require('bootstrap');


function App() {
  // TODO: Before production remove redux devtools extension javascript
  return (
    <Provider store={createStore(rootReducer,
      defaultRootState,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
      }
    >
      <Router history={history}>
        <div className="App">
          <header>
            <NavbarConnected />
          </header>
          <div className="componentHolder">
            <Route path="/" exact component={LandingPageConnected} />
            <Route path="/dashboard" component={DashboardConnected} />
            <Route path="/upload" component={UploadScreenConnected} />
          </div>
          <FooterConnected />
          <AuthLoadingConnected />
        </div>
      </Router>
    </Provider>
  );
}


export default App;
