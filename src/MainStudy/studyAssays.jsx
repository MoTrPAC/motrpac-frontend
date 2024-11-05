import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';
import pass1b06AssayTissueTreeData from './pass1b06AssayTissueTreeData';
import Pass1b06AssayTissueTable from './pass1b06AssayTissueTable';

// Import order is important!
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/treegraph')(Highcharts);
require('highcharts/modules/boost')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

function StudyAssays() {
  const [assayView, setAssayView] = useState('table');
  // Highcharts options
  const chartOptions = {
    chart: {
      spacingBottom: 30,
      marginRight: 120,
      height: 2000,
    },
    title: {
      align: 'center',
      style: {
        fontSize: '1.5rem',
      },
      text: 'Click on a node to expand or collapse its child nodes',
    },
    tooltip: {
      enabled: false,
    },
    series: [
      {
        type: 'treegraph',
        keys: ['parent', 'id', 'level'],
        clip: false,
        data: pass1b06AssayTissueTreeData,
        marker: {
          symbol: 'circle',
          radius: 6,
          fillColor: '#FFFFFF',
          lineWidth: 3,
        },
        dataLabels: {
          align: 'left',
          pointFormat: '{point.id}',
          style: {
            color: '#000000',
            textOutline: '3px #ffffff',
            whiteSpace: 'nowrap',
          },
          x: 16,
          crop: false,
          overflow: 'none',
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false,
          },
          {
            level: 2,
            colorByPoint: true,
          },
          {
            level: 3,
            colorVariation: {
              key: 'brightness',
              to: -0.5,
            },
          },
          {
            level: 4,
            colorVariation: {
              key: 'brightness',
              to: 0.5,
            },
            marker: {
              radius: 4,
            },
            dataLabels: {
              x: 10,
            },
          },
        ],
      },
    ],
    credits: {
      enabled: false,
    },
    legend: {
      squareSymbol: true,
      symbolWidth: 25,
    },
    exporting: {
      enabled: true,
    },
  };

  function handleViewChange(view) {
    setAssayView(view);
  }

  return (
    <div className="studyAssaysPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Assays in MoTrPAC Studies - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Assays in MoTrPAC Studies" />
      <div className="study-assays-page-container">
        <div className="study-assays-page-content-container row mb-4">
          <div className="study-assays-content-container study-assays mt-4 w-100">
            <div className="col-12 d-flex align-items-center">
              <h3>Endurance trained young adult rats study</h3>
              <div className="btn-group ml-3" role="group" aria-label="Assay View Select Button Group">
                <button
                  type="button"
                  className={`btn btn-outline-primary btn-sm ${
                    assayView === 'table' ? 'active' : ''
                  }`}
                  onClick={handleViewChange.bind(this, 'table')}
                >
                  <span className="d-flex align-items-center">
                    <span className="material-icons">table_view</span>
                    <span className="ml-1">Table</span>
                  </span>
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-primary btn-sm ${
                    assayView === 'graph' ? 'active' : ''
                  }`}
                  onClick={handleViewChange.bind(this, 'graph')}
                >
                  <span className="d-flex align-items-center">
                    <span className="material-icons">account_tree</span>
                    <span className="ml-1">Graph</span>
                  </span>
                </button>
              </div>
            </div>
            {assayView === 'table' && (
              <div className="table-container col-12">
                <Pass1b06AssayTissueTable />
              </div>
            )}
            {assayView === 'graph' && (
              <div className="plot-container col-12 mt-4">
                <div className="w-100">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    containerProps={{ className: 'assay-tissue-treegraph-container' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyAssays;
