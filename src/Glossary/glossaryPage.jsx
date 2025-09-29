import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';

import variableNamesPass1b06 from '../data/glossary_variable_names_pass1b06.json';

import '@styles/glossary.scss';

function Glossary() {
  const [filterKeywords, setFilterKeywords] = useState('');

  const filteredData = useMemo(() => {
    if (filterKeywords.length < 2) {
      return variableNamesPass1b06;
    }
    
    const keywords = filterKeywords.toLowerCase();
    return variableNamesPass1b06.filter(item => 
      item.variable_name.toLowerCase().includes(keywords) ||
      item.definition.toLowerCase().includes(keywords)
    );
  }, [filterKeywords]);

  const handleFilterChange = (e) => {
    setFilterKeywords(e.target.value);
  };

  return (
    <div className="glossaryPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Glossary - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Glossary" />
      <div className="glossary-content-container row mb-4">
        <div className="col-12">
          <h3 className="study-title-species-icon mr-1 d-flex align-items-center mt-4">
            <span className="material-icons study-title-species-icon mr-1">pest_control_rodent</span>
            <span>Variable names in the endurance trained young adult rats study</span>
          </h3>
          
          <div className="glossary-filter-container mb-3">
            <div className="input-group my-3 d-flect align-items-center">
              <div className="glossary-filter-label mr-2">
                <b>Search glossary terms:</b>
              </div>
              <input
                id="glossary-filter"
                type="text"
                className="form-control"
                placeholder="Enter at least 2 characters to filter results"
                value={filterKeywords}
                onChange={handleFilterChange}
                aria-describedby="filter-help"
              />
            </div>
          </div>

          <div className="glossary-table-container table-responsive my-2">
            <table className="glossary-table table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Variable Name</th>
                  <th scope="col">Definition</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={`glossary-item-${index}-${item.variable_name}`}>
                    <th scope="row">{item.variable_name}</th>
                    <td>{item.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Glossary;
