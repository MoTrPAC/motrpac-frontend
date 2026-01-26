import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function DifferentialAbundanceSummary({ userType = '' }) {
  const isInternal = userType === 'internal';

  return (
    <div className="search-summary-container row mb-3 collapse show" id="collapseDifferentialAbundanceSummary">
      <div className="lead col-12">
        <span>
          {isInternal ? (
            <>
              Search by gene, protein or metabolite names to examine the timewise endurance
              training response over 8 weeks of training or the training responses to
              acute exercise intervention in young adult rats, or the pre-suspension human
              sedentary adults randomized to endurance exercise training (EE), resistance
              exercise training (RE), or no-exercise control groups. To ensure the best
              search results, please use the following guidelines:
            </>
          ) : (
            <>
              Search by gene, protein or metabolite names to examine the
              timewise endurance training response over 8 weeks of training in
              young adult rats, as well as the pre-suspension human sedentary adults
              randomized to acute exercise or no-exercise control groups. To ensure the
              best search results, please use the following guidelines:
            </>
          )}
        </span>
        <ol className="mt-2">
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
            <code>
              bag3, myom2, prag1, smad3, vegfa
            </code>
          </li>
          <li>
            Use double quotes to enclose search terms containing commas,
            spaces or commas followed by spaces. For example:
            {' '}
            <code>
              {`"capric acid", "5,6-dihet", "cl(70:7)>cl(16:1_18:2_18:2_18:2)", "cer(d18:1/18:0)"`}
            </code>
          </li>
        </ol>
        <p>
          The{' '}
          <span className="font-weight-bold">endurance training in young adult rats</span>
          {' '}and{' '}
          <span className="font-weight-bold">acute exercise in human sedentary adults (pre-suspension)</span>
          {' '}datasets are available to the community under the{' '}
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

export default DifferentialAbundanceSummary;
