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
  return (
    <Provider store={createStore(rootReducer, defaultRootState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
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
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}


export default App;
