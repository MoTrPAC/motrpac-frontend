import React from 'react';
import EmailLink from './emailLink';

/**
 * Renders a text string for contacting MoTrPAC helpdesk
 *
 * @returns {Object} JSX representation of a text string.
 */
function ContactHelpdesk() {
  return (
    <span className="motrpac-helpdesk-contact-text">
      contact the MoTrPAC Bioinformatics Center helpdesk at
      {' '}
      <EmailLink mailto="motrpac-helpdesk@lists.stanford.edu" label="MoTrPAC Helpdesk" />
    </span>
  );
}

export default ContactHelpdesk;
