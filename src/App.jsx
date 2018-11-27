import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from './reducers/index';
import 'bootstrap';
import History from './history';
import NavbarConnected from './components/navbar';
import FooterConnected from './components/footer';
import LandingPageConnected from './components/landingPage';
import DashboardConnected from './components/dashboard';
import UploadScreenConnected from './components/uploadScreen';
import AuthLoadingConnected from './components/authLoading';
import LinkoutPageConnected from './components/linkoutPage';
import AnalysisHomePageConnected from './components/analysisHomePage';

const hist = History;

function App({ history = hist }) {
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
            <Route path="/external-links" component={LinkoutPageConnected} />
            <Route path="/analysis/:subjectType" component={AnalysisHomePageConnected} />
          </div>
          <FooterConnected />
          <AuthLoadingConnected />
        </div>
      </Router>
    </Provider>
  );
}

App.propTypes = {
  history: PropTypes.shape({
    length: PropTypes.number,
    action: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      hash: PropTypes.string,
      key: PropTypes.string,
    }),
    createHref: PropTypes.func,
    push: PropTypes.func,
    replace: PropTypes.func,
    go: PropTypes.func,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
    block: PropTypes.func,
    listen: PropTypes.func,
  }),
};
App.defaultProps = {
  history: hist,
};

export default App;
