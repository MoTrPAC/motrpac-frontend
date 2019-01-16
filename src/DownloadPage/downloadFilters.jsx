import React from 'react';
import assayList from './assayList';

const downloadFilters = [
  {
    keyName: 'subject',
    name: 'Subject',
    filters: ['Human', 'Animal'],
    icons: [(<span title="Subject: Human" className="icon-Human filterIcon burgundy" />), (<span title="Subject: Animal" className="icon-Animal filterIcon dblue" />)],
  },
  {
    keyName: 'availability',
    name: 'Status',
    filters: ['Publicly Available', 'Internally Available', 'Pending Q.C.'],
    icons: [(<span className="oi oi-circle-check green" />), (<span className="oi oi-loop-square dblue" />), (<span className="oi oi-ellipses dgray" />)],
  },
  {
    keyName: 'type',
    name: 'Assay Type',
    filters: assayList,
  },
];

export default downloadFilters;
