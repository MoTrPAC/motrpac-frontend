import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function DifferentialAbundanceSummary({ userType }) {
  return (
    <div className="search-summary-container row mb-3 collapse show" id="collapseDifferentialAbundanceSummary">
      <div className="lead col-12">
        {userType === 'internal' ? (
          <span>
            Search by gene symbol, protein name (for rats) or metabolite name to
            examine the timewise endurance training response over 8 weeks of
            training in young adult rats, or the pre-COVID human sedentary adults
            randomized to endurance exercise training (EE), resistance exercise
            training (RE), or no-exercise control groups. To ensure the best
            search results, please use the following guidelines:
          </span>
        ) : (
          <span>
            Search by gene symbol, protein name or metabolite name to examine the
            timewise endurance training response over 8 weeks of training in
            young adult rats. To ensure the best search results, please use the
            following guidelines:
          </span>
        )}
        <ol>
          <li>
            Use
            {' '}
            <span className="font-weight-bold">
              auto-suggested search terms
            </span>
            {' '}
            by typing the first few
            characters of the gene symbol, protein or metabolite names.
          </li>
          <li>
            Separate multiple search terms using a comma followed by a space. For example:
            {' '}
            <code>brd2, smad3, vegfa</code>
          </li>
          <li>
            Use double quotes to enclose search terms containing commas,
            spaces or commas followed by spaces. For example:
            {' '}
            <code>"taurocholic acid", "8,9-epetre", "cer(d18:1/18:0)"</code>
          </li>
        </ol>
        <p>
          The endurance trained young adult rats dataset is made available
          under the
          {' '}
          <Link to="/license">CC BY 4.0 license</Link>
          .
        </p>
      </div>
    </div>
  );
}

DifferentialAbundanceSummary.propTypes = {
  userType: PropTypes.string,
};

DifferentialAbundanceSummary.defaultProps = {
  userType: '',
};

export default DifferentialAbundanceSummary;
