const baseUrl = 'http://study-docs.motrpac-data.org';

const StudyDocuments = [
  {
    title: 'Animal protocol',
    location: `${baseUrl}/Animal_Protocol.pdf`,
    description: 'Describes the animal handling, the exercise intervention and the sampling procedures.',
  },
  {
    title: 'Case report forms',
    location: `${baseUrl}/Case_Report_Forms.tar.gz`,
    description: 'The forms for metadata collected for each animal.',
  },
  {
    title: 'Sample tracking',
    location: '',
    description: 'Describes the sample tracking and shipping system.Here you can find the basics of the sample labelling system, how the samples are shipped to the MotrPAC biorepository, and then to the chemical analysis sites for specific assays. This document also describes how the molecular data is transferred to the bioinformatics center of MoTrPAC.',
  },
  {
    title: 'GET MOP',
    location: `${baseUrl}/GET_MOP.pdf`,
    description: 'The procedures for the different molecular assays are described in the manual of procedures (MOPs). This one is for genomic, transcriptomic and epigenomic (GET) assays.',
  },
  {
    title: 'Proteomics MOP',
    location: '',
    description: 'Describes the procedures for the proteomics assays.',
  },
  {
    title: 'Metabolomics MOP',
    location: `${baseUrl}/Metabolomics_MOP.pdf`,
    description: 'Describes the procedures for the metabolomics assays.',
  },
  {
    title: 'Metabolomics data dictionary',
    location: '',
    description: 'Data dictionary used to label all identified compounds.',
  },
  {
    title: 'GET QC SOP',
    location: `${baseUrl}/GET_QC_SOP.pdf`,
    description: 'Describes the standard operating procedures (SOP) for the primary quality control of GET data.',
  },
  {
    title: 'Proteomics QC SOP',
    location: `${baseUrl}/Proteomics_QC_SOP.pdf`,
    description: 'Describes the SOP for the primary quality control of proteomics data.',
  },
  {
    title: 'Metabolomics QC SOP',
    location: '',
    description: 'Describes the SOP for the primary quality control of metabolomics data.',
  },
  {
    title: 'Data use agreement',
    location: `${baseUrl}/MoTrPAC_Data_Use_Agreement.pdf`,
    description: 'Specifies the embargo period and describes the terms for using MoTrPAC data during this period.',
  },
];

export default StudyDocuments;
