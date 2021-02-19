import moleculeIcon from '../assets/analysisIcons/DifferentialMolecules.svg';
import tissueIcon from '../assets/analysisIcons/Tissue.svg';
import networkIcon from '../assets/analysisIcons/NetworkAnalysis.svg';
import timeIcon from '../assets/analysisIcons/TimeCourse.svg';
import omicsIcon from '../assets/analysisIcons/OmicsComparison.svg';
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
    input: 'Sex, Weight, % Body Fat, and VO2 Max',
    description:
      'A number of visualizations are presented in the analysis of various phenotype data from the 6-month old rats.',
    active: true,
    species: ['animal'],
  },
  {
    title: 'Gene-Centric View',
    shortName: 'MOLECULES',
    icon: moleculeIcon,
    inactiveIcon: moleculeIconInactive,
    input: null,
    description:
      'Search by gene symbol and examine the training response of its related molecules (e.g. protein phosphorylation/acetylation, promoter methylation, transcript).',
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
      'Examine similarities, differences, and potential time lagged response across tissues.',
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
      'Identify modules of highly connected molecules that manifest similar response to training.',
    active: false,
    species: ['animal', 'human'],
  },
  {
    title: 'Differential Molecules (Time Course)',
    shortName: 'TIME_COURSE',
    icon: timeIcon,
    inactiveIcon: timeIconInactive,
    input: null,
    description:
      'Visualize the trajectory of a single molecule.',
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
      'Explore consistencies across different "omes", focusing on novel discoveries (e.g. novel enhancers that are correlated with transcriptomic response).',
    active: false,
    species: ['animal', 'human'],
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
];

export default analysisTypes;
