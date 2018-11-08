import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from './reducers/index';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LandingPage from './components/landingPage';
import dashboard from './components/dashboard';
import uploadScreen from './components/uploadScreen';

require('bootstrap');


function App() {
  function handleLogInOut(loggedIn) {
    console.log(loggedIn);
  }

  return (
    <Provider store={createStore(rootReducer, defaultRootState)}>
      <BrowserRouter>
        <div className="App">
          <header>
            <Navbar />
          </header>
          <div className="componentHolder">
            <Route path="/" exact component={LandingPage} />
            <Route path="/dashboard" component={dashboard} />
            <Route path="/upload" component={uploadScreen} />
          </div>
          <Footer handleLogInOut={handleLogInOut} />
        </div>
      </BrowserRouter>
    </Provider>
  );
}


export default App;
