const pass1b06PhenoKeyAnimal = require('../../data/pass1b_06_pheno_key_animal');
const pass1b06PhenoRegistrationAnimal = require('../../data/pass1b_06_pheno_registration_animal');
const pass1b06PhenoNmrTestingAnimal = require('../../data/pass1b_06_pheno_nmr_testing_animal');
const pass1b06PhenoVo2MaxAnimal = require('../../data/pass1b_06_pheno_vo2_max_animal');

// animal sets by 1-week, 2-week, 4-week, and 8-week
const oneWeekRats = pass1b06PhenoKeyAnimal.filter(
  (item) => item.ANIRandGroup.indexOf('One-week') > -1
);
const twoWeekRats = pass1b06PhenoKeyAnimal.filter(
  (item) => item.ANIRandGroup.indexOf('Two-week') > -1
);
const fourWeekRats = pass1b06PhenoKeyAnimal.filter(
  (item) => item.ANIRandGroup.indexOf('Four-week') > -1
);
const eightWeekRats = pass1b06PhenoKeyAnimal.filter(
  (item) => item.ANIRandGroup.indexOf('Eight-week') > -1
);

// female set
const femaleRats = pass1b06PhenoRegistrationAnimal.filter(
  (item) => item.sex === 'female'
);

// male set
const maleRats = pass1b06PhenoRegistrationAnimal.filter(
  (item) => item.sex === 'male'
);

// find the rat in a given gender group and a given program group
export function searchRat(rat, plot) {
  let match;
  switch (plot) {
    case 'one_week_program':
      match = oneWeekRats.find((item) => item.pid === rat.pid);
      return match;
    case 'two_week_program':
      match = twoWeekRats.find((item) => item.pid === rat.pid);
      return match;
    case 'four_week_program':
      match = fourWeekRats.find((item) => item.pid === rat.pid);
      return match;
    case 'eight_week_program':
      match = eightWeekRats.find((item) => item.pid === rat.pid);
      return match;
    default:
      match = oneWeekRats.find((item) => item.pid === rat.pid);
      return match;
  }
}

const singleVisitDomainPadding = { x: 160 };

const multiVisitsDomainPadding = { x: 40 };

const singleVisitCategories = {
  x: ['Post-train females', 'Post-train males'],
};

const multiVisitsCategories = {
  x: [
    '1st post-train\nfemales',
    '2nd post-train\nfemales',
    '1st post-train\nmales',
    '2nd post-train\nmales',
  ],
};

const plotConfig = {
  pass1b06PhenoNmrTestingAnimal,
  pass1b06PhenoVo2MaxAnimal,
  femaleRats,
  maleRats,
  singleVisitDomainPadding,
  multiVisitsDomainPadding,
  singleVisitCategories,
  multiVisitsCategories,
};

export default plotConfig;
