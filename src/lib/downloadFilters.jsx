import React from 'react';
import assayList from './assayList';

const downloadFilters = [
  {
    keyName: 'subject',
    name: 'Subject',
    filters: ['Human', 'Animal'],
    icons: ['icon-Human filterIcon burgundy', 'icon-Animal filterIcon dblue'],
  },
  {
    keyName: 'availability',
    name: 'Status',
    filters: ['Publicly Available', 'Internally Available', 'Pending Q.C.'],
    icons: ['oi oi-circle-check green', 'oi oi-loop-square dblue', 'oi oi-clock dgray'],
  },
  {
    keyName: 'type',
    name: 'Assay Type',
    filters: assayList,
  },
];

export default downloadFilters;
