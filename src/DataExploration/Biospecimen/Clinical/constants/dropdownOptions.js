// Define dropdown options
const dropdownOptions = {
  tranche: [
    { value: 'TR00', label: 'Tranche 0' },
    { value: 'TR01', label: 'Tranche 1' },
    { value: 'TR02', label: 'Tranche 2' },
    { value: 'TR03', label: 'Tranche 3' },
    { value: 'TR04', label: 'Tranche 4' },
  ],
  randomizedGroup: [
    { value: 'ADUControl', label: 'Control Intervention' },
    { value: 'ADUEndur', label: 'Endurance Intervention' },
    { value: 'ADUResist', label: 'Resistance Intervention' },
    { value: 'ATHEndur', label: 'Highly Active Endurance' },
    { value: 'ATHResist', label: 'Highly Active Resistance' },
    { value: 'PEDControl', label: 'Pediatric Sedentary Control' },
    { value: 'PEDEndur', label: 'Pediatric Sedentary Endurance' },
  ],
  collectionVisit: [
    {
      value: 'ADU_BAS',
      label: 'Adult Baseline Biospecimen Assessment Sequence',
    },
    {
      value: 'ADU_PAS',
      label: 'Adult Post Intervention Biospecimen Assessment Sequence',
    },
    {
      value: 'PED_BAS',
      label: 'Pediatric Baseline Biospecimen Assessment Sequence',
    },
    {
      value: 'PED_PAS',
      label: 'Pediatric Post Intervention Biospecimen Assessment Sequence',
    },
  ],
  timepoint: [
    { value: 'pre_exercise', label: 'Pre-exercise or Rest 1' },
    { value: 'during_20_min', label: '20 minutes during exercise' },
    { value: 'during_40_min', label: '40 minutes during exercise' },
    { value: 'post_10_min', label: '10 minutes post-exercise' },
    {
      value: 'post_15_30_45_min',
      label: '15, 30, or 45 minutes post-exercise',
    },
    { value: 'post_3.5_4_hr', label: '3.5 or 4 hours post-exercise' },
    { value: 'post_24_hr', label: '24 hours post-exercise' },
  ],
  tissue: [
    { value: 'ADI', label: 'Adipose' },
    { value: 'BLO', label: 'Blood' },
    { value: 'MUS', label: 'Muscle' },
  ],
  sex: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ],
  ageGroup: [
    { value: '10-13', label: '10 to 13 years old' },
    { value: '14-17', label: '14 to 17 years old' },
    { value: '18-39', label: '18 to 39 years old' },
    { value: '40-59', label: '40 to 59 years old' },
    { value: '60+', label: '60 years old and above' },
  ],
};

export default dropdownOptions;
