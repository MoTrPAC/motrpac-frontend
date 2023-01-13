import React from 'react';

const bundleData = [
  {
    type: 'transcriptomics',
    phase: 'pass1b-06',
    title: 'Transcriptomics data (metadata, QC and quantitative results)',
    object_zipfile: 'motrpac_pass1b-06_transcriptomics.tar.gz',
    object_zipfile_size: '176.34 MB',
  },
  {
    type: 'epigenomics',
    phase: 'pass1b-06',
    title:
      'Epigenomics data (RRBS and ATAC-seq metadata, QC and quantitative results)',
    object_zipfile: 'motrpac_pass1b-06_epigenomics.tar.gz',
    object_zipfile_size: '17.90 MB',
  },
  {
    type: 'metabolomics-targeted',
    phase: 'pass1b-06',
    title: 'Metabolomics Targeted data (metadata, QC and quantitative results)',
    object_zipfile: 'motrpac_pass1b-06_metabolomics-targeted.tar.gz',
    object_zipfile_size: '36.93 MB',
  },
  {
    type: 'metabolomics-untargeted',
    phase: 'pass1b-06',
    title:
      'Metabolomics Untargeted data (metadata, QC and quantitative results)',
    object_zipfile: 'motrpac_pass1b-06_metabolomics-untargeted.tar.gz',
    object_zipfile_size: '479.90 MB',
  },
  {
    type: 'proteomics',
    phase: 'pass1b-06',
    title: 'Proteomics data (metadata, QC and quantitative results)',
    object_zipfile: 'motrpac_pass1b-06_proteomics.tar.gz',
    object_zipfile_size: '349.67 MB',
  },
  {
    type: 'phenotype',
    phase: 'pass1b-06',
    title: 'Phenotypic data (including raw data)',
    object_zipfile: 'motrpac_pass1b-06_phenotype.tar.gz',
    object_zipfile_size: '5.80 MB',
  },
];

function OpenAccessBundleDownloads() {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-sm">
        <tbody>
          {bundleData.map((item) => {
            return (
              <tr key={`${item.type}-${item.phase}`}>
                <td className="pt-1 px-2">
                  <span>{item.title}</span>
                </td>
                <td className="open-access-bundle-data-download-link pt-1 px-2">
                  <button
                    type="button"
                    className="btn-data-download"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="material-icons open-access-bundle-data-download-icon">
                      save_alt
                    </i>
                  </button>
                  <span className="file-size">{`(${item.object_zipfile_size})`}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OpenAccessBundleDownloads;
