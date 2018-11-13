import React from 'react';
import { connect } from 'react-redux';

export function LinkoutPage() {
  return (
    <div className="container linkoutPage">
      <div className="row title">
        <div className="col">
          <h3>Useful Links</h3>
        </div>
      </div>
    </div>
  );
}

export default connect()(LinkoutPage);
