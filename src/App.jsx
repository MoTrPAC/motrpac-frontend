import React from 'react';
import { Route, Router, withRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from './reducers/index';
import 'bootstrap';
import History from './history';
import NavbarConnected from './components/navbar';
import Footer from './components/footer';
import LandingPageConnected from './components/landingPage';
import Dashboard from './components/dashboard';
import UploadScreenConnected from './components/uploadScreen';
import LinkoutPageConnected from './components/linkoutPage';
import AnalysisHomePageConnected from './components/analysisHomePage';
import Callback from './components/callback';

function App(props) {
  const authenticated = props.auth.isAuthenticated();

  // TODO: Before production remove redux devtools extension javascript
  return (
    <Provider
      store={createStore(
        rootReducer,
        defaultRootState,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )}>
      <Router history={History}>
        <div className="App">
          <Route
            exact
            path="/callback"
            render={() => <Callback auth={props.auth} />}
          />
          <header>
            <NavbarConnected />
          </header>
          <div className="componentHolder">
            <Route path="/" exact component={LandingPageConnected} />
            <Route
              exact
              path="/dashboard"
              render={() => (
                <Dashboard
                  authenticated={authenticated}
                  auth={props.auth}
                  history={props.history}
                />
              )}
            />
            <Route
              exact
              path="/upload"
              render={() => (
                <UploadScreenConnected
                  authenticated={authenticated}
                  auth={props.auth}
                  history={props.history}
                />
              )}
            />
            <Route path="/external-links" component={LinkoutPageConnected} />
            <Route
              path="/analysis/:subjectType"
              component={AnalysisHomePageConnected}
            />
          </div>
          <Footer
            authenticated={authenticated}
            auth={props.auth}
            history={props.history}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default withRouter(App);
