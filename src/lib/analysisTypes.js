import globeIcon from '../assets/analysisIcons/Globe.svg';
import moleculeIcon from '../assets/analysisIcons/Molecule.svg';
import lungIcon from '../assets/analysisIcons/Lungs.svg';
import networkIcon from '../assets/analysisIcons/Network.svg';
import timeIcon from '../assets/analysisIcons/TimeSeries.svg';
import omicsIcon from '../assets/analysisIcons/Omics.svg';
import MAGeneIcon from '../assets/analysisIcons/MA_gene.svg';
import MATimeIcon from '../assets/analysisIcons/MA_time.svg';
import chartbarIcon from '../assets/analysisIcons/ChartBar.svg';
import globeIconInactive from '../assets/analysisIcons/Globe_inactive.svg';
import moleculeIconInactive from '../assets/analysisIcons/Molecule_inactive.svg';
import lungIconInactive from '../assets/analysisIcons/Lungs_inactive.svg';
import networkIconInactive from '../assets/analysisIcons/Network_inactive.svg';
import timeIconInactive from '../assets/analysisIcons/TimeSeries_inactive.svg';
import omicsIconInactive from '../assets/analysisIcons/Omics_inactive.svg';
import MAGeneIconInactive from '../assets/analysisIcons/MA_gene_inactive.svg';
import MATimeIconInactive from '../assets/analysisIcons/MA_time_inactive.svg';

const analysisTypes = [
  {
    title: 'Phenotypic Data',
    shortName: 'PD',
    icon: chartbarIcon,
    active: true,
    subAnalyses: [
      {
        title: 'Animal Phenotype Data',
        icon: chartbarIcon,
        inactiveIcon: MAGeneIconInactive,
        shortName: 'APD',
        input: 'Distance, Gender, Weight and Fat',
        description: 'Displays a number of visualizations in analyzing various animal phenotype data.',
        active: true,
      },
    ],
  },
  {
    title: 'Published Data Meta-Analysis',
    shortName: 'PDMA',
    icon: globeIcon,
    inactiveIcon: globeIconInactive,
    active: true,
    subAnalyses: [
      {
        title: 'Meta-Analysis of Public Data',
        icon: MAGeneIcon,
        inactiveIcon: MAGeneIconInactive,
        shortName: 'MA_G',
        input: 'Specific Tissue(s), Gene, and Time Window',
        description: 'Displays up and down regulations. Gene lists are detected for interpretation',
        active: true,
      },
      {
        title: 'Gene Time Course Clustering',
        icon: MATimeIcon,
        inactiveIcon: MATimeIconInactive,
        shortName: 'MA_GTCC',
        input: 'Differentially Expressed Genes',
        description: 'Genes are clustered by their trajectories. Results sorted by tissue',
        active: false,
      },
    ],
  },
  {
    title: 'Differential Molecules',
    shortName: 'DM',
    icon: moleculeIcon,
    inactiveIcon: moleculeIconInactive,
    active: false,
  },
  {
    title: 'Tissue Comparison',
    shortName: 'TC',
    icon: lungIcon,
    inactiveIcon: lungIconInactive,
    active: false,
  },
  {
    title: 'Network Analysis',
    shortName: 'NA',
    icon: networkIcon,
    inactiveIcon: networkIconInactive,
    active: false,
  },
  {
    title: 'Time Course Visualization',
    shortName: 'TCV',
    icon: timeIcon,
    inactiveIcon: timeIconInactive,
    active: false,
  },
  {
    title: 'Omics Comparison',
    shortName: 'OC',
    icon: omicsIcon,
    inactiveIcon: omicsIconInactive,
    active: false,
  },
];

export default analysisTypes;
