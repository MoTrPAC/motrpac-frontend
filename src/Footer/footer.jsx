import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import '@styles/footer.scss'

/**
 * Renders the global footer.
 *
 * @returns {object} JSX representation of the global footer.
 */
function Footer() {
  const location = useLocation();
  const path = location.pathname;

  // Get current copyright year
  const getCopyrightYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    return year;
  };

  return (
    <footer className="footer">
      <div className="footer-disclaimers">
        {path !== '/' && (
          <div className="footer-content compliance-review-notice mb-2">
            <span>
              This repository is under review for potential modification in
              compliance with Administration directives.
            </span>
          </div>
        )}
        <div className="footer-content">
          <span>
            MoTrPAC Data Hub is designed and maintained by the MoTrPAC
            BioInformatics Center at{' '}
            <a
              href="https://www.stanford.edu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stanford University
            </a>
            <span>.&nbsp;</span>
          </span>
          <span>
            Funded by the&nbsp;
            <a
              href="https://commonfund.nih.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIH Common Fund
            </a>
            <span>.</span>
          </span>
        </div>
        <div className="footer-content">
          <span className="mr-2">
            &#169;
            {getCopyrightYear()}
            &nbsp;Stanford University
          </span>
          <span className="mr-2">
            <Link to="/license">License</Link>
          </span>
          <span>
            <Link to="/contact">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
