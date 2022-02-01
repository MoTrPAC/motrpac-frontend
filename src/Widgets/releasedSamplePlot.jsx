import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import tissues from '../lib/tissueCodes';
import colors from '../lib/colors';

/**
 * Renders chart.js plot of release sample counts on dashboard
 *
 * @param {Array} data    Array of tissue sample metadata by phase/release
 * @param {String} plot   Redux state of plot view
 *
 * @returns {object} JSX representation of the dashboard sample count plot
 */
function ReleasedSamplePlot({ data, plot }) {
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Create new set mapping counts to tissues
  function datasetByTissue() {
    const sampleCounts = [];
    data.forEach((tissueSample) => {
      let studyCount = 0;
      let qcCount = 0;
      let totalCount = 0;
      // Get new set of tissues from source of truth
      // by mapping to tissues present in the data
      const tissue = tissues.find(
        (item) => item.bic_tissue_code === tissueSample.tissue_code
      );
      // Get total sample count by combining all assays
      // for each tissue present in the data
      tissueSample.sample_data.forEach((item) => {
        studyCount += Number(item.count);
        qcCount += Number(item.qc_count);
        totalCount = studyCount + qcCount;
      });
      const tissueCount = {
        tissue_name: tissue.bic_tissue_name,
        study_count: studyCount,
        qc_count: qcCount,
        total_count: totalCount,
      };
      sampleCounts.push(tissueCount);
    });
    return sampleCounts;
  }

  // Utility function to create new set of samples
  // for each assay from each tissue
  function assaySet(assayName) {
    const set = [];
    data.forEach((tissueSample) => {
      tissueSample.sample_data.forEach((item) => {
        if (item.assay_name === assayName) {
          set.push(item);
        }
      });
    });
    return set;
  }

  // Create new set mapping counts to assays
  function datasetByAssay() {
    const sampleCounts = [];
    // Get new set of unique assay names present in the data
    const assays = [
      ...new Set(data[0].sample_data.map((item) => item.assay_name)),
    ];

    assays.forEach((assay) => {
      let studyCount = 0;
      let qcCount = 0;
      let totalCount = 0;
      // Get total sample count by combining all tissues
      // for each unqiue assay present in the data
      assaySet(assay).forEach((item) => {
        studyCount += Number(item.count);
        qcCount += Number(item.qc_count);
        totalCount = studyCount + qcCount;
      });
      const assayCount = {
        assay_name: assay,
        study_count: studyCount,
        qc_count: qcCount,
        total_count: totalCount,
      };
      sampleCounts.push(assayCount);
    });
    return sampleCounts;
  }

  function sortedDataset(arg) {
    const datasetOfTissues = datasetByTissue();
    const datasetOfAssays = datasetByAssay();
    switch (arg) {
      case 'tissue_name':
        return datasetOfTissues.sort((a, b) =>
          a.tissue_name.localeCompare(b.tissue_name)
        );
      case 'tissue_count':
        return datasetOfTissues.sort((a, b) => b.total_count - a.total_count);
      case 'assay_name':
        return datasetOfAssays.sort((a, b) =>
          a.assay_name.localeCompare(b.assay_name)
        );
      case 'assay_count':
        return datasetOfAssays.sort((a, b) => b.total_count - a.total_count);
      default:
        return datasetOfTissues.sort((a, b) =>
          a.tissue_name.localeCompare(b.tissue_name)
        );
    }
  }

  // Input to chartJS bar chart
  const plotData = {
    labels: sortedDataset(plot).map((item) =>
      plot.indexOf('tissue') >= 0 ? item.tissue_name : item.assay_name
    ),
    datasets: [
      {
        label: 'Study Assays',
        data: sortedDataset(plot).map((item) => item.study_count),
        borderWidth: 1,
        backgroundColor: colors.graphs.lblue,
      },
      {
        label: 'QC-Reference',
        data: sortedDataset(plot).map((item) => item.qc_count),
        borderWidth: 1,
        backgroundColor: '#ffde72',
      },
    ],
  };

  // ChartJS formatting options
  const options = {
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            stepSize: 200, // integer only
            beginAtZero: true,
            fontFamily: "'Open Sans', sans-serif",
            fontSize: width < breakpoint ? 12 : 14,
          },
          scaleLabel: {
            display: true,
            labelString: 'Total Assay Count',
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 15,
            fontStyle: 'bold',
          },
        },
      ],
      xAxes: [
        {
          stacked: true,
          ticks: {
            fontFamily: "'Open Sans', sans-serif",
            fontSize: width < breakpoint ? 9 : 14,
            fontStyle: width < breakpoint ? 'normal' : 'bold',
            padding: 6,
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="releasedSamplePlot col-12">
      <Bar data={plotData} options={options} />
    </div>
  );
}

ReleasedSamplePlot.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      tissue_code: PropTypes.string.isRequired,
      sample_data: PropTypes.array.isRequired,
    })
  ).isRequired,
  plot: PropTypes.string.isRequired,
};

export default ReleasedSamplePlot;
