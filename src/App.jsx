import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'bootstrap';
import configureStore from './configureStore';
import ProtectedRoute from './protectedRoute';
import NavbarConnected from './components/navbar';
import Footer from './components/footer';
import LandingPageConnected from './components/landingPage';
import Dashboard from './components/dashboard';
import UploadScreenConnected from './components/uploadScreen';
import LinkoutPageConnected from './components/linkoutPage';
import AnalysisHomePageConnected from './components/analysisHomePage';
import Callback from './components/callback';

const store = configureStore();
const supportsHistory = 'pushState' in window.history;

function App() {
  const { isAuthenticated } = true;

  return (
    <Provider store={store}>
      <Router forceRefresh={!supportsHistory}>
        <div className="App">
          <header>
            <NavbarConnected isAuthenticated={isAuthenticated} />
          </header>
          <Switch>
            <Route path="/" exact component={LandingPageConnected} />
            <Route path="/callback" component={Callback} />
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            <ProtectedRoute path="/upload" component={UploadScreenConnected} />
            <Route path="/external-links" component={LinkoutPageConnected} />
            <ProtectedRoute path="/analysis/:subjectType" component={AnalysisHomePageConnected} />
          </Switch>
          <Footer isAuthenticated={isAuthenticated} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
