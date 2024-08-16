const baseUrl = 'https://d1yw74buhe0ts0.cloudfront.net/docs';

export const AnimalStudyDocuments = [
  {
    title: 'Animal protocol',
    location: `${baseUrl}/Animal_Protocol.pdf`,
    description: 'Describes the animal handling, the exercise intervention and the sampling procedures.',
    filetype: 'pdf',
  },
  {
    title: 'Case report forms',
    location: `${baseUrl}/Animal_Case_Report_Forms.tar.gz`,
    description: 'The forms for metadata collected for each animal (5 forms in a single downloadable zipped file).',
    filetype: 'zip',
  },
  {
    title: 'Sample tracking',
    location: `${baseUrl}/Animal_Sample_Tracking.pdf`,
    description: 'Describes the sample tracking and shipping system. Here you can find the basics of the sample labelling system, how the samples are shipped to the MotrPAC biorepository, and then to the chemical analysis sites for specific assays. This document also describes how the molecular data is transferred to the bioinformatics center of MoTrPAC.',
    filetype: 'pdf',
  },
  {
    title: 'GET MOP',
    location: `${baseUrl}/Animal_GET_MOP.pdf`,
    description: 'The procedures for the different molecular assays are described in the manual of procedures (MOPs). This one is for genomic, transcriptomic and epigenomic (GET) assays.',
    filetype: 'pdf',
  },
  {
    title: 'Proteomics MOP',
    location: `${baseUrl}/Animal_Proteomics_MOP.pdf`,
    description: 'Describes the procedures for the proteomics assays.',
    filetype: 'pdf',
  },
  {
    title: 'Metabolomics MOP',
    location: `${baseUrl}/Animal_Metabolomics_MOP.pdf`,
    description: 'Describes the procedures for the metabolomics assays.',
    filetype: 'pdf',
  },
  {
    title: 'GET QC SOP',
    location: `${baseUrl}/Animal_GET_QC_SOP.pdf`,
    description: 'Describes the standard operating procedures (SOP) for the primary quality control of GET data.',
    filetype: 'pdf',
  },
  {
    title: 'Proteomics QC SOP',
    location: `${baseUrl}/Animal_Proteomics_QC_SOP.pdf`,
    description: 'Describes the SOP for the primary quality control of proteomics data.',
    filetype: 'pdf',
  },
  {
    title: 'Metabolomics QC SOP',
    location: `${baseUrl}/Animal_Metabolomics_QC_SOP.pdf`,
    description: 'Describes the SOP for the primary quality control of metabolomics data.',
    filetype: 'pdf',
  },
  {
    title: 'Data use agreement',
    location: `${baseUrl}/External_Release_1_MoTrPAC_Data_Use_Agreement.pdf`,
    description: 'Specifies the embargo period and describes the terms for using MoTrPAC data during this period.',
    filetype: 'pdf',
  },
];

export const HumanStudyDocuments = [
  {
    title: 'MoTrPAC Adult Study - Protocol',
    location: `${baseUrl}/MoTrPAC_Adult_Study_Protocol.pdf`,
    description: 'Describes the MoTrPAC research study for the Adult humans including design, rationale, objectives, methodologies, and how data is managed and analyzed.',
    filetype: 'pdf',
  },
  {
    title: 'MoTrPAC Adult Study - Manual of Procedures chapters',
    location: `${baseUrl}/MoTrPAC_Adult_Study_Manual_of_Procedures_chapters.pdf`,
    description: 'Details the conduct of the MoTrPAC study operations for standardized implementation of the Adult human protocol.',
    filetype: 'pdf',
  },
  {
    title: 'MoTrPAC Pediatric Study - Protocol',
    location: `${baseUrl}/MoTrPAC_Pediatric_Study_Protocol.pdf`,
    description: 'Describes the MoTrPAC research study for the Pediatric humans including design, rationale, objectives, methodologies, and how data is managed and analyzed.',
    filetype: 'pdf',
  },
  {
    title: 'MoTrPAC Pediatric Study - Manual of Procedures chapters',
    location: `${baseUrl}/MoTrPAC_Pediatric_Study_Manual_of_Procedures_chapters.pdf`,
    description: 'Details the conduct of the MoTrPAC study operations for standardized implementation of the Pediatric human protocol.',
    filetype: 'pdf',
  },
];
