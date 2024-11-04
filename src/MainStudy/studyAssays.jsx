import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';
import pass1b06AssayTissueTreeData from './pass1b06AssayTissueTreeData';

// Import order is important!
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/treegraph')(Highcharts);
require('highcharts/modules/boost')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

function StudyAssays() {
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
      text: 'Enduarance trained young adult rats study assays',
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

  return (
    <div className="exerciseBenefitsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Assays in MoTrPAC Studies - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Assays in MoTrPAC Studies" />
      <div className="exercise-benefits-page-container">
        <div className="study-assays-page-content-container row mb-4">
          <div className="study-assays-content-container study-assays mt-4">
            <div className="col-12">
              <h3>Endurance trained young adult rats study</h3>
            </div>
            <div className="col-12">
              <p>
                Below is a visual guide to the assays performed in the endurance
                trained young adult rats study. Click on a node to expand or
                collapse it.
              </p>
            </div>
            <div className="plot-container">
              <div className="w-100">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions}
                  containerProps={{ className: 'phenotype-plot-container' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyAssays;
