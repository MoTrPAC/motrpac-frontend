import metaAnalysisIcon from '../assets/analysisIcons/MetaAnalysis.svg';
import moleculeIcon from '../assets/analysisIcons/DifferentialMolecules.svg';
import tissueIcon from '../assets/analysisIcons/Tissue.svg';
import networkIcon from '../assets/analysisIcons/NetworkAnalysis.svg';
import timeIcon from '../assets/analysisIcons/TimeCourse.svg';
import omicsIcon from '../assets/analysisIcons/OmicsComparison.svg';
import metaAnalysisGeneIcon from '../assets/analysisIcons/MetaAnalysisGene.svg';
import phenotypeIcon from '../assets/analysisIcons/PhenotypeData.svg';
import moleculeIconInactive from '../assets/analysisIcons/DifferentialMolecules_inactive.svg';
import tissueIconInactive from '../assets/analysisIcons/Tissue_inactive.svg';
import networkIconInactive from '../assets/analysisIcons/NetworkAnalysis_inactive.svg';
import timeIconInactive from '../assets/analysisIcons/TimeCourse_inactive.svg';
import omicsIconInactive from '../assets/analysisIcons/OmicsComparison_inactive.svg';
import geneTimeCourseInactive from '../assets/analysisIcons/GeneTimeCourse_inactive.svg';

const analysisTypes = [
  {
    title: 'Phenotypic Data',
    shortName: 'PHENOTYPE',
    icon: phenotypeIcon,
    inactiveIcon: null,
    input: 'Distance, Gender, Weight and Fat',
    description:
      'Displays a number of visualizations in analyzing various animal phenotype data.',
    active: true,
    species: ['animal'],
  },
  {
    title: 'Published Data Meta-Analysis',
    shortName: 'META_ANALYSIS',
    icon: metaAnalysisIcon,
    inactiveIcon: null,
    description:
      'This analysis includes two sub-analyses: the meta-analysis of public data and the gene time course clustering.',
    active: true,
    species: ['human'],
    subAnalyses: [
      {
        title: 'Meta-Analysis of Public Data',
        icon: metaAnalysisGeneIcon,
        inactiveIcon: null,
        shortName: 'META_ANALYSIS_PUBLIC_DATA',
        input: 'Specific Tissue(s), Gene, and Time Window',
        description:
          'Displays up and down regulations. Gene lists are detected for interpretation.',
        active: true,
        species: ['human'],
      },
      {
        title: 'Gene Time Course Clustering',
        icon: null,
        inactiveIcon: geneTimeCourseInactive,
        shortName: 'GENE_TIME_COURSE',
        input: 'Differentially Expressed Genes',
        description:
          'Genes are clustered by their trajectories. Results are sorted by tissues.',
        active: false,
        species: ['human'],
      },
    ],
  },
  {
    title: 'Differential Molecules',
    shortName: 'MOLECULES',
    icon: moleculeIcon,
    inactiveIcon: moleculeIconInactive,
    input: null,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    active: false,
    species: ['animal', 'human'],
  },
  {
    title: 'Tissue Comparison',
    shortName: 'TISSUE',
    icon: tissueIcon,
    inactiveIcon: tissueIconInactive,
    input: null,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    active: false,
    species: ['animal', 'human'],
  },
  {
    title: 'Network Analysis',
    shortName: 'NETWORK',
    icon: networkIcon,
    inactiveIcon: networkIconInactive,
    input: null,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    active: false,
    species: ['animal', 'human'],
  },
  {
    title: 'Time Course Visualization',
    shortName: 'TIME_COURSE',
    icon: timeIcon,
    inactiveIcon: timeIconInactive,
    input: null,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    active: false,
    species: ['animal', 'human'],
  },
  {
    title: 'Omics Comparison',
    shortName: 'OMICS',
    icon: omicsIcon,
    inactiveIcon: omicsIconInactive,
    input: null,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    active: false,
    species: ['animal', 'human'],
  },
];

export default analysisTypes;
