export const tissues = [
  { filter_value: 'adipose', filter_label: 'Adipose', species: 'human' },
  { filter_value: 'brown adipose', filter_label: 'Brown Adipose', species: 'rat' },
  { filter_value: 'white adipose', filter_label: 'White Adipose', species: 'rat' },
  { filter_value: 'blood', filter_label: 'Blood', species: 'human' },
  { filter_value: 'blood rna', filter_label: 'Blood RNA', species: 'rat' },
  { filter_value: 'plasma', filter_label: 'Plasma', species: 'rat' },
  { filter_value: 'muscle', filter_label: 'Muscle', species: 'human' },
  { filter_value: 'gastrocnemius', filter_label: 'Gastrocnemius', species: 'rat' },
  { filter_value: 'vastus lateralis', filter_label: 'Vastus Lateralis', species: 'rat' },
  { filter_value: 'adrenal', filter_label: 'Adrenal', species: 'rat' },
  { filter_value: 'aorta', filter_label: 'Aorta', species: 'rat' },
  { filter_value: 'colon', filter_label: 'Colon', species: 'rat' },
  { filter_value: 'cortex', filter_label: 'Cortex', species: 'rat' },
  { filter_value: 'heart', filter_label: 'Heart', species: 'rat' },
  { filter_value: 'hippocampus', filter_label: 'Hippocampus', species: 'rat' },
  { filter_value: 'hypothalamus', filter_label: 'Hypothalamus', species: 'rat' },
  { filter_value: 'kidney', filter_label: 'Kidney', species: 'rat' },
  { filter_value: 'liver', filter_label: 'Liver', species: 'rat' },
  { filter_value: 'lung', filter_label: 'Lung', species: 'rat' },
  { filter_value: 'ovaries', filter_label: 'Ovaries', species: 'rat' },
  { filter_value: 'small intestine', filter_label: 'Small Intestine', species: 'rat' },
  { filter_value: 'spleen', filter_label: 'Spleen', species: 'rat' },
  { filter_value: 'testes', filter_label: 'Testes', species: 'rat' },
  { filter_value: 'vena cava', filter_label: 'Vena Cava', species: 'rat' },
];

const assays = [
  { filter_value: 'transcript-rna-seq', filter_label: 'RNA-seq' },
  { filter_value: 'epigen-atac-seq', filter_label: 'ATAC-seq' },
  { filter_value: 'epigen-rrbs', filter_label: 'RRBS' },
  { filter_value: 'immunoassay', filter_label: 'Immunoassay' },
  { filter_value: 'metab-t-3hib', filter_label: 'Targeted 3-Hydroxyisobutyric Acid (3-HIB)' },
  { filter_value: 'metab-t-aa', filter_label: 'Targeted Amino Acids' },
  { filter_value: 'metab-t-acoa', filter_label: 'Targeted Acyl-CoA' },
  { filter_value: 'metab-t-amines', filter_label: 'Targeted Amines' },
  { filter_value: 'metab-t-baiba', filter_label: 'Targeted Beta-Aminoisobutyric acid' },
  { filter_value: 'metab-t-etamidpos', filter_label: 'Targeted Ethanolamides' },
  { filter_value: 'metab-t-ka', filter_label: 'Targeted Keto Acids' },
  { filter_value: 'metab-t-nuc', filter_label: 'Targeted Nucleotides' },
  { filter_value: 'metab-t-oa', filter_label: 'Targeted Organic Acids' },
  { filter_value: 'metab-t-oxylipneg', filter_label: 'Targeted Oxylipins' },
  { filter_value: 'metab-t-sphm', filter_label: 'Targeted Sphingomyelin' },
  {
    filter_value: 'metab-t-tca',
    filter_label: 'Targeted Tricarboxylic Acid Cycle',
  },
  {
    filter_value: 'metab-u-hilicpos',
    filter_label: 'Untargeted HILIC-Positive',
  },
  {
    filter_value: 'metab-u-ionpneg',
    filter_label: 'Untargeted Ion-Pair Negative',
  },
  {
    filter_value: 'metab-u-lrpneg',
    filter_label: 'Untargeted Lipidomics Reversed-Phase Negative',
  },
  {
    filter_value: 'metab-u-lrppos',
    filter_label: 'Untargeted Lipidomics Reversed-Phase Positive',
  },
  {
    filter_value: 'metab-u-rpneg',
    filter_label: 'Untargeted Reversed-Phase Negative',
  },
  {
    filter_value: 'metab-u-rppos',
    filter_label: 'Untargeted Reversed-Phase Positive',
  },
  { filter_value: 'prot-pr', filter_label: 'Global Proteomics' },
  { filter_value: 'prot-ph', filter_label: 'Phosphoproteomics' },
  { filter_value: 'prot-ac', filter_label: 'Acetyl Proteomics' },
  { filter_value: 'prot-ub', filter_label: 'Protein Ubiquitination' },
  {
    filter_value: 'prot-ub-protein-corrected',
    filter_label: 'Protein Ubiquitination',
  },
];

export const assayListRat = assays.sort((a, b) =>
  a.filter_label.toLowerCase().localeCompare(b.filter_label.toLowerCase()),
);

const assaysHuman = [
  { filter_value: 'transcript-rna-seq', filter_label: 'RNA-seq' },
  { filter_value: 'metab-t-acoa', filter_label: 'Targeted Acyl-CoA' },
  { filter_value: 'metab-t-amines', filter_label: 'Targeted Amines' },
  { filter_value: 'metab-t-conv', filter_label: 'Targeted Conventional' },
  { filter_value: 'metab-t-ka', filter_label: 'Targeted Keto Acids' },
  { filter_value: 'metab-t-nuc', filter_label: 'Targeted Nucleotides' },
  { filter_value: 'metab-t-oxylipneg', filter_label: 'Targeted Oxylipins' },
  {
    filter_value: 'metab-t-tca',
    filter_label: 'Targeted Tricarboxylic Acid Cycle',
  },
  {
    filter_value: 'metab-u-hilicpos',
    filter_label: 'Untargeted HILIC-Positive',
  },
  {
    filter_value: 'metab-u-ionpneg',
    filter_label: 'Untargeted Ion-Pair Negative',
  },
  {
    filter_value: 'metab-u-lrpneg',
    filter_label: 'Untargeted Lipidomics Reversed-Phase Negative',
  },
  {
    filter_value: 'metab-u-lrppos',
    filter_label: 'Untargeted Lipidomics Reversed-Phase Positive',
  },
  {
    filter_value: 'metab-u-rpneg',
    filter_label: 'Untargeted Reversed-Phase Negative',
  },
  {
    filter_value: 'metab-u-rppos',
    filter_label: 'Untargeted Reversed-Phase Positive',
  },
  { filter_value: 'prot-pr', filter_label: 'Global Proteomics' },
  { filter_value: 'prot-ph', filter_label: 'Phosphoproteomics' },
  { filter_value: 'prot-ol', filter_label: 'Proteomics Olink' },
];

export const assayListHuman = assaysHuman.sort((a, b) =>
  a.filter_label.toLowerCase().localeCompare(b.filter_label.toLowerCase()),
);

export const randomGroupList = [
  { filter_value: 'ADUControl', filter_label: 'Control Intervention' },
  { filter_value: 'ADUEndur', filter_label: 'Endurance Intervention' },
  { filter_value: 'ADUResist', filter_label: 'Resistance Intervention' },
  { filter_value: 'ATHEndur', filter_label: 'Highly Active Endurance' },
  { filter_value: 'ATHResist', filter_label: 'Highly Active Resistance' },
];

export const sexList = [
  { filter_value: 'Male', filter_label: 'Male' },
  { filter_value: 'Female', filter_label: 'Female' },
];

export const timepointListRatEndurance = [
  { filter_value: '1w', filter_label: '1 week' },
  { filter_value: '2w', filter_label: '2 week' },
  { filter_value: '4w', filter_label: '4 week' },
  { filter_value: '8w', filter_label: '8 week' },
];

export const timepointListHuman = [
  { filter_value: 'pre_exercise', filter_label: 'Pre-Exercise' },
  { filter_value: 'during_20_min', filter_label: 'During 20 Min' },
  { filter_value: 'during_40_min', filter_label: 'During 40 Min' },
  { filter_value: 'post_10_min', filter_label: 'Post 10 Min' },
  { filter_value: 'post_15_30_45_min', filter_label: 'Post 15/30/45 Min' },
  { filter_value: 'post_3.5_4_hr', filter_label: 'Post 3.5/4 Hour' },
  { filter_value: 'post_24_hr', filter_label: 'Post 24 Hour' },
];

export const timepointListRatAcute = [
  { filter_value: '00.0h', filter_label: '0 Hour' },
  { filter_value: '00.5h', filter_label: '0.5 hour' },
  { filter_value: '01.0h', filter_label: '1 hour' },
  { filter_value: '04.0h', filter_label: '4 hour' },
  { filter_value: '07.0h', filter_label: '7 hour' },
  { filter_value: '24.0h', filter_label: '24 hour' },
  { filter_value: '48.0h', filter_label: '48 Hour' },
];

export const rangeList = [
  { filter_value: null, filter_label: 'Min' },
  { filter_value: null, filter_label: 'Max' },
];

export const rangeSearchFilters = [
  {
    keyName: 'logFC',
    name: 'logFC',
    filters: rangeList,
  },
  {
    keyName: 'p_value',
    name: 'P-value',
    filters: rangeList,
  },
  {
    keyName: 'adj_p_value',
    name: 'Adj P-value',
    filters: rangeList,
  },
];

export const geneCentricSearchFilters = [
  {
    keyName: 'tissue',
    name: 'Tissue',
    filters: tissues.filter((t) => t.filter_value !== 'aorta'),
  },
  {
    keyName: 'assay',
    name: 'Assay',
    filters: assayListRat,
  },
];

export const studyList = [
  { filter_value: 'pass1b06', filter_label: 'Endurance Training in Young Adult Rats' },
  { filter_value: 'precawg', filter_label: 'Acute Exercise in Human Sedentary Adults (Pre-Suspension)' },
  { filter_value: 'pass1a06', filter_label: 'Acute Exercise in Young Adult Rats' },
];

export const speciesList = [
  { filter_value: 'rat', filter_label: 'Rat' },
  { filter_value: 'human', filter_label: 'Human' },
];

export const interventionEffectList = [
  { filter_value: 'pre-training', filter_label: 'Pre Training Acute Bout' },
  { filter_value: 'training', filter_label: 'Training' },
];

const assaysGene = [
  { filter_value: 'transcript-rna-seq', filter_label: 'RNA-seq' },
  { filter_value: 'epigen-atac-seq', filter_label: 'ATAC-seq' },
  { filter_value: 'epigen-rrbs', filter_label: 'RRBS' },
  { filter_value: 'immunoassay', filter_label: 'Immunoassay' },
  { filter_value: 'prot-pr', filter_label: 'Global Proteomics' },
  { filter_value: 'prot-ph', filter_label: 'Phosphoproteomics' },
  { filter_value: 'prot-ol', filter_label: 'Proteomics Olink' },
  { filter_value: 'prot-ac', filter_label: 'Acetyl Proteomics' },
  { filter_value: 'prot-ub', filter_label: 'Protein Ubiquitination' },
  {
    filter_value: 'prot-ub-protein-corrected',
    filter_label: 'Protein Ubiquitination Corrected',
  },
];

export const assayListGene = assaysGene.sort((a, b) =>
  a.filter_label.toLowerCase().localeCompare(b.filter_label.toLowerCase()),
);

const assaysProtein = [
  { filter_value: 'prot-pr', filter_label: 'Global Proteomics' },
  { filter_value: 'prot-ph', filter_label: 'Phosphoproteomics' },
  { filter_value: 'prot-ol', filter_label: 'Proteomics Olink' },
  { filter_value: 'prot-ac', filter_label: 'Acetyl Proteomics' },
  { filter_value: 'prot-ub', filter_label: 'Protein Ubiquitination' },
  {
    filter_value: 'prot-ub-protein-corrected',
    filter_label: 'Protein Ubiquitination Corrected',
  },
];

export const assayListProtein = assaysProtein.sort((a, b) =>
  a.filter_label.toLowerCase().localeCompare(b.filter_label.toLowerCase()),
);

const assaysMetabolite = [
  { filter_value: 'metab-t-3hib', filter_label: 'Targeted 3-Hydroxyisobutyric Acid (3-HIB)' },
  { filter_value: 'metab-t-aa', filter_label: 'Targeted Amino Acids' },
  { filter_value: 'metab-t-acoa', filter_label: 'Targeted Acyl-CoA' },
  { filter_value: 'metab-t-amines', filter_label: 'Targeted Amines' },
  { filter_value: 'metab-t-baiba', filter_label: 'Targeted Beta-Aminoisobutyric acid' },
  { filter_value: 'metab-t-conv', filter_label: 'Targeted Conventional' },
  { filter_value: 'metab-t-etamidpos', filter_label: 'Targeted Ethanolamides' },
  { filter_value: 'metab-t-ka', filter_label: 'Targeted Keto Acids' },
  { filter_value: 'metab-t-nuc', filter_label: 'Targeted Nucleotides' },
  { filter_value: 'metab-t-oa', filter_label: 'Targeted Organic Acids' },
  { filter_value: 'metab-t-oxylipneg', filter_label: 'Targeted Oxylipins' },
  { filter_value: 'metab-t-sphm', filter_label: 'Targeted Sphingomyelin' },
  {
    filter_value: 'metab-t-tca',
    filter_label: 'Targeted Tricarboxylic Acid Cycle',
  },
  {
    filter_value: 'metab-u-hilicpos',
    filter_label: 'Untargeted HILIC-Positive',
  },
  {
    filter_value: 'metab-u-ionpneg',
    filter_label: 'Untargeted Ion-Pair Negative',
  },
  {
    filter_value: 'metab-u-lrpneg',
    filter_label: 'Untargeted Lipidomics Reversed-Phase Negative',
  },
  {
    filter_value: 'metab-u-lrppos',
    filter_label: 'Untargeted Lipidomics Reversed-Phase Positive',
  },
  {
    filter_value: 'metab-u-rpneg',
    filter_label: 'Untargeted Reversed-Phase Negative',
  },
  {
    filter_value: 'metab-u-rppos',
    filter_label: 'Untargeted Reversed-Phase Positive',
  },
];

export const assayListMetabolite = assaysMetabolite.sort((a, b) =>
  a.filter_label.toLowerCase().localeCompare(b.filter_label.toLowerCase()),
);

export const defaultOmeList = [
  { filter_value: 'transcriptomics', filter_label: 'Transcriptomics', filter_param: 'omics' },
  { filter_value: 'prot-pr', filter_label: 'Global Proteomics', filter_param: 'assay', filter_ome: 'proteomics' },
  { filter_value: 'prot-ph', filter_label: 'Phosphoproteomics', filter_param: 'assay', filter_ome: 'proteomics' },
  { filter_value: 'prot-ol', filter_label: 'Proteomics Olink', filter_param: 'assay', filter_ome: 'proteomics' },
  { filter_value: 'prot-ac', filter_label: 'Acetyl Proteomics', filter_param: 'assay', filter_ome: 'proteomics' },
  { filter_value: 'prot-ub', filter_label: 'Protein Ubiquitination' , filter_param: 'assay', filter_ome: 'proteomics' },
  { filter_value: 'metabolomics', filter_label: 'Metabolomics', filter_param: 'omics' },
  { filter_value: 'immunoassay', filter_label: 'Immunoassay', filter_param: 'assay', filter_ome: 'proteomics' },
];

export const optionalOmeList = [
  { filter_value: 'epigen-atac-seq', filter_label: 'ATAC-seq', filter_param: 'assay', filter_ome: 'epigenomics' },
  { filter_value: 'epigen-rrbs', filter_label: 'RRBS', filter_param: 'assay', filter_ome: 'epigenomics' },
  { filter_value: 'epigen-methylcap-seq', filter_label: 'Methylcap-seq', filter_param: 'assay', filter_ome: 'epigenomics' },
];
