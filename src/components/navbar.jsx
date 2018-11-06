import React from 'react';

function Navbar({ loggedIn }) {
  const loggedInNavItems = (
    <React.Fragment>
      <li className="nav-item navItem"><a href="/dashboard" className="nav-link">Dashboard</a></li>
      <li className="nav-item navItem dropdown">
        <div className="nav-link dropdown-toggle" role="button" id="navbarDropdownMenuLinkAnalysis" data-toggle="dropdown">Analysis</div>
        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLinkAnalysis">
          <a href="/analysis/animal" className="dropdown-item">Animal</a>
          <a href="/analysis/human" className="dropdown-item">Human</a>
        </div>
      </li>
      <li className="nav-item navItem"><a href="/methods" className="nav-link">Methods</a></li>
    </React.Fragment>
  );
  const navbar = (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <a href="/" className="navbar-brand siteTitle">
        MoTrPAC
          <span className="light">
          &nbsp; Data Hub
          </span>
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse flex-row-reverse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            {loggedIn ? loggedInNavItems : ''}
            <li className="nav-item navItem"><a href="/data" className="nav-link">Data</a></li>
            <li className="nav-item navItem dropdown">
              <div className="nav-link dropdown-toggle" role="button" id="navbarDropdownMenuLink" data-toggle="dropdown">About</div>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a href="" className="dropdown-item">Useful Links</a>
                <a href="" className="dropdown-item">Who we are</a>
              </div>
            </li>
            <li className="nav-item navItem"><a href="" className="nav-link">Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
  return navbar;
}

export default Navbar;
