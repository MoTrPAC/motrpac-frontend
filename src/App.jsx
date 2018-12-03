import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'bootstrap';
import NavbarConnected from './components/navbar';
import Footer from './components/footer';
import LandingPageConnected from './components/landingPage';
import Dashboard from './components/dashboard';
import UploadScreenConnected from './components/uploadScreen';
import LinkoutPageConnected from './components/linkoutPage';
import AnalysisHomePageConnected from './components/analysisHomePage';
import Callback from './components/callback';
import actions from './actions';

class App extends Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.isAuthenticated !== prevProps.auth.isAuthenticated) {
      this.fetchData();
    }
  }

  fetchData() {
    const { isAuthenticated } = this.props.auth;
    const { getProfile } = this.props;

    if (isAuthenticated) {
      getProfile();
    }
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const { history } = this.props;

    return (
      <div className="App">
        <header>
          <NavbarConnected isAuthenticated={isAuthenticated} />
        </header>
        <Switch>
          <Route path="/" exact component={LandingPageConnected} />
          <Route exact path="/callback" component={Callback} />
          <Route
            exact
            path="/dashboard"
            render={() => (
              <Dashboard isAuthenticated={isAuthenticated} history={history} />
            )}
          />
          <Route
            exact
            path="/upload"
            render={() => (
              <UploadScreenConnected
                isAuthenticated={isAuthenticated}
                history={history}
              />
            )}
          />
          <Route path="/external-links" component={LinkoutPageConnected} />
          <Route
            path="/analysis/:subjectType"
            component={AnalysisHomePageConnected}
          />
        </Switch>
        <Footer isAuthenticated={isAuthenticated} history={history} />
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => state,
    actions
  )(App)
);
