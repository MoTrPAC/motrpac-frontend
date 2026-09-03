export const KIND_LABELS = {
  quantID: 'Quant-ID',
  analysis: 'Analysis',
  phenotype: 'Phenotype',
};

export const KIND_ORDER = ['quantID', 'analysis', 'phenotype'];

export const STAGE_LABELS = {
  public: 'Public',
  consortium: 'Consortium',
  early: 'Early Access',
};

// Studies that run both arms need their own label; a study is not limited to
// one design.
export const DESIGN_MODIFIERS = {
  'Acute exercise': 'acute',
  'Endurance training': 'endurance',
  'Acute + training': 'combined',
};

export const STAGE_CODES = {
  public: 'PR',
  consortium: 'CR',
  early: 'EA',
};

const bucketName = import.meta.env.VITE_DATA_FILE_BUCKET;

const studyDataCards = [
  {
    code: 'rat-training-06',
    name: 'Endurance Training in Young Adult Rats',
    cardTitle: 'Endurance Training in Young Adult Rats',
    icon: 'pest_control_rodent',
    species: 'rat',
    cohort: '6 month old',
    studyDesign: 'Endurance training',
    description: 'Progressive treadmill training for 1, 2, 4 or 8 weeks in young adult rats, with 18 tissues coillected 48-hour after the last bout.',
    dataTypes: {
      quantID: [
        {
          collection: 'c3.0',
          referenceGenome: 'Rn8',
          latest: true,
          storageLocation: `gs://${bucketName}/quant-id/rat-training-06/c3.0`,
          releaseStage: 'consortium',
        },
        {
          collection: 'c2.0',
          referenceGenome: 'Rn7',
          latest: false,
          storageLocation: `gs://${bucketName}/quant-id/rat-training-06/c2.0`,
          releaseStage: 'public',
        },
        {
          collection: 'c1.0',
          referenceGenome: 'Rn6',
          latest: false,
          storageLocation: `gs://${bucketName}/quant-id/rat-training-06/c1.0`,
          releaseStage: 'public',
        },
      ],
      analysis: [
        {
          collection: 'c2.0',
          referenceGenome: 'Rn7',
          latest: true,
          storageLocation: `gs://${bucketName}/analysis/rat-training-06/c2.0`,
          releaseStage: 'public',
        },
        {
          collection: 'c1.0',
          referenceGenome: 'Rn6',
          latest: false,
          storageLocation: `gs://${bucketName}/analysis/rat-training-06/c1.0`,
          releaseStage: 'public',
        },
      ],
      phenotype: [
        {
          collection: 'c4.0',
          latest: true,
          storageLocation: `gs://${bucketName}/phenotype/rat-training-06/c4.0`,
          releaseStage: 'public',
        },
      ],
    },
  },
  {
    code: 'rat-acute-06',
    name: 'Acute Exercise in Young Adult Rats',
    cardTitle: 'Acute Exercise in Young Adult Rats',
    icon: 'pest_control_rodent',
    species: 'rat',
    cohort: '6 month old',
    studyDesign: 'Acute exercise',
    description: 'A single treadmill bout in young adult rats, with tissues collected from immediately post-exercise through 48 h to trace the recovery time course.',
    dataTypes: {
      quantID: [
        {
          collection: 'c2.0',
          referenceGenome: 'Rn8',
          latest: true,
          storageLocation: `gs://${bucketName}/quant-id/rat-acute-06/c2.0`,
          releaseStage: 'consortium',
        },
        {
          collection: 'c1.0',
          referenceGenome: 'Rn7',
          latest: false,
          storageLocation: `gs://${bucketName}/quant-id/rat-acute-06/c1.0`,
          releaseStage: 'consortium',
        },
      ],
      analysis: [
        {
          collection: 'c2.0',
          referenceGenome: 'Rn7',
          latest: true,
          storageLocation: `gs://${bucketName}/analysis/rat-acute-06/c2.0`,
          releaseStage: 'consortium',
        },
        {
          collection: 'c1.1',
          referenceGenome: 'Rn7',
          latest: false,
          storageLocation: `gs://${bucketName}/analysis/rat-acute-06/c1.1`,
          releaseStage: 'consortium',
        },
        {
          collection: 'c1.0',
          referenceGenome: 'Rn7',
          latest: false,
          storageLocation: `gs://${bucketName}/analysis/rat-acute-06/c1.0`,
          releaseStage: 'consortium',
        },
      ],
      phenotype: [
        {
          collection: 'c4.0',
          latest: true,
          storageLocation: `gs://${bucketName}/phenotype/rat-acute-06/c4.0`,
          releaseStage: 'consortium',
        },
      ],
    },
  },
  {
    code: 'human-precovid-sed-adu',
    name: 'Acute Exercise in Human Sedentary Adults',
    cardTitle: 'Acute Exercise in Human Sedentary Adults',
    icon: 'person',
    species: 'human',
    cohort: 'Pre-Suspension',
    studyDesign: 'Acute exercise',
    description: 'Sedentary adults performing a single endurance or resistance bout, with muscle, blood and adipose sampled before, during and after exercise. Enrolled before the study suspension.',
    dataTypes: {
      // Quant-ID and Phenotype for this study are publicly released, but are
      // not distributed through the Data Hub: external users obtain them by
      // applying to dbGaP. They are held at `consortium` so the Data Hub never
      // serves them directly, and carry an `accessNote` so the card says why
      // rather than implying the data does not exist yet.
      quantID: [
        {
          collection: 'c1.0',
          latest: true,
          storageLocation: `gs://${bucketName}/quant-id/human-precovid/c1.0`,
          releaseStage: 'consortium',
          accessNote: 'Please obtain access to this data by applying through dbGaP.',
        },
      ],
      analysis: [
        {
          collection: 'c1.3',
          latest: true,
          storageLocation: `gs://${bucketName}/analysis/human-precovid-sed-adu/c1.3`,
          releaseStage: 'public',
        },
      ],
      phenotype: [
        {
          collection: 'c3.0',
          latest: true,
          storageLocation: `gs://${bucketName}/phenotype/human-precovid-sed-adu/c3.0`,
          releaseStage: 'consortium',
          accessNote: 'Please obtain access to this data by applying through dbGaP.',
        },
        {
          collection: 'c2.0',
          latest: false,
          storageLocation: `gs://${bucketName}/phenotype/human-precovid-sed-adu/c2.0`,
          releaseStage: 'consortium',
          accessNote: 'Please obtain access to this data by applying through dbGaP.',
        },
      ],
    },
  },
  {
    code: 'human-main',
    name: 'Human Main Study',
    cardTitle: 'Human Main Study',
    icon: 'person',
    species: 'human',
    cohort: 'Post-Suspension',
    studyDesign: 'Acute + training',
    description: 'The main human cohort, covering both acute exercise and endurance training arms and sub-collections such as highly active adults and pediatric participants. Data collection and processing are ongoing.',
    dataTypes: {
      // Quant-ID and Phenotype for this study are publicly released, but are
      // not distributed through the Data Hub: external users obtain them by
      // applying to dbGaP. They are held at `consortium` so the Data Hub never
      // serves them directly, and carry an `accessNote` so the card says why
      // rather than implying the data does not exist yet.
      quantID: [],
      analysis: [],
      phenotype: [
        {
          code: 'human-main-sed-adu',
          name: 'Sedentary Adults (Post-Suspension)',
          cardTitle: 'Sedentary Adults (Post-Suspension)',
          description: 'Phenotype data collected from sedentary adults enrolled after the study suspension. This collection includes early access data.',
          collections: [
            {
              collection: 'c2.0',
              latest: true,
              storageLocation: `gs://${bucketName}/phenotype/human-main-sed-adu/c2.0`,
              releaseStage: 'consortium',
            },
          ],
        },
        {
          code: 'human-all-ped',
          name: 'Low and Highly Active Pediatrics',
          cardTitle: 'Low and Highly Active Pediatrics',
          description: 'Phenotype data collected from low and highly active pediatric participants. This collection includes early access data.',
          collections: [
            {
              collection: 'c2.0',
              latest: true,
              storageLocation: `gs://${bucketName}/phenotype/human-all-ped/c2.0`,
              releaseStage: 'consortium',
            },
          ],
        },
        {
          code: 'human-all-ha-adu',
          name: 'Highly Active Adults',
          cardTitle: 'Highly Active Adults',
          description: 'Phenotype data collected from highly active adult participants. This collection includes early access data.',
          collections: [
            {
              collection: 'c2.0',
              latest: true,
              storageLocation: `gs://${bucketName}/phenotype/human-all-ha-adu/c2.0`,
              releaseStage: 'consortium',
            },
          ],
        },
        {
          code: 'human-screening-adu',
          name: 'Screening Adults',
          cardTitle: 'Screening Adults',
          description: 'Phenotype data collected from adult participants during the screening phase. This collection includes early access data.',
          collections: [
            {
              collection: 'c2.0',
              latest: true,
              storageLocation: `gs://${bucketName}/phenotype/human-screening-adu/c2.0`,
              releaseStage: 'consortium',
            },
          ],
        },
        {
          code: 'human-screening-ped',
          name: 'Screening Pediatrics',
          cardTitle: 'Screening Pediatrics',
          description: 'Phenotype data collected from pediatric participants during the screening phase. This collection includes early access data.',
          collections: [
            {
              collection: 'c2.0',
              latest: true,
              storageLocation: `gs://${bucketName}/phenotype/human-screening-ped/c2.0`,
              releaseStage: 'consortium',
            },
          ],
        },
      ],
    },
  },
];

// Not yet wired into the explorer UI - reserved for a future "Supporting human
// collections" section (see mockup's SUPPORTING array).
export const humanPhenotypeDataCards = [
  {
    code: 'human-eqc',
    name: 'Human Extended Quality Control',
    cardTitle: 'Human Extended Quality Control',
    icon: 'person',
    species: 'human',
    cohort: 'Adults and pediatrics',
    description: 'Extended QC data in both CSV and JSON formats supporting the human phenotype collections.',
    dataTypes: {
      phenotype: [
        {
          collection: 'c14.0',
          latest: true,
          storageLocation: `gs://${bucketName}/phenotype/human-eqc/c14.0`,
          releaseStage: 'consortium',
        },
      ],
    },
  },
  {
    code: 'human-biospecimen',
    name: 'Human Biospecimen',
    cardTitle: 'Human Biospecimen',
    icon: 'person',
    species: 'human',
    cohort: 'Adults and pediatrics',
    description: 'Curated biospecimen data supporting the human phenotype collections.',
    dataTypes: {
      phenotype: [
        {
          collection: 'c3.0',
          latest: true,
          storageLocation: `gs://${bucketName}/phenotype/human-biospecimen/c3.0`,
          releaseStage: 'consortium',
        },
      ],
    },
  },
];

export default studyDataCards;
