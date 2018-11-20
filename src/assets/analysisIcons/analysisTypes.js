import globeIcon from './Globe.png';
import moleculeIcon from './Molecule.png';
import lungIcon from './Lungs.png';
import networkIcon from './Network.png';
import timeIcon from './TimeSeries.png';
import omicsIcon from './Omics.png';

const analysisTypes = [
  {
    title: 'Published Data Meta-Analysis',
    shortName: 'PDMA',
    icon: globeIcon,
  },
  {
    title: 'Differential Molecules',
    shortName: 'DM',
    icon: moleculeIcon,
  },
  {
    title: 'Tissue Comparison',
    shortName: 'TC',
    icon: lungIcon,
  },
  {
    title: 'Network Analysis',
    shortName: 'NA',
    icon: networkIcon,
  },
  {
    title: 'Time Course Visualization',
    shortName: 'TCV',
    icon: timeIcon,
  },
  {
    title: 'Omics Comparison',
    shortName: 'OC',
    icon: omicsIcon,
  },
];

export default analysisTypes;
