import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders the global footer.
 *
 * @returns {object} JSX representation of the global footer.
 */
function Footer() {
  // Get current copyright year
  const getCopyrightYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    return year;
  };

  return (
    <footer className="footer">
      <div className="footer-disclaimers">
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
