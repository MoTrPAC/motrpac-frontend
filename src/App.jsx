import React from 'react';
import { Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LandingPage from './components/landingPage';
import './main.css';

function App() {
  return (
    <div className="App">
      <header>
        <Navbar />
      </header>
      <div className="componentHolder">
        <Route path="/" component={LandingPage} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
