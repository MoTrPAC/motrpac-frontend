// Static function to prepend prefix GET, METAB, or PROT to y-axis CAS/assay labels
function selectOmicPrefix(assay) {
  let omicPrefix = 'METAB';
  const patternGet = /rna[-_]?seq|rrbs|atac[-_]?seq|methylcap[-_]?seq/;
  if (assay.toLowerCase().match(patternGet)) {
    omicPrefix = 'GET';
  }
  const patternImmuno = /rat-adipokine|rat-mag27plex|rat-metabolic|rat-myokine|rat-pituitary/;
  if (assay.toLowerCase().match(patternImmuno)) {
    omicPrefix = 'IMMUNO';
  }
  if (assay.toLowerCase().indexOf('prot') > -1) {
    omicPrefix = 'PROT';
  }
  return omicPrefix;
}

export default selectOmicPrefix;
