import React from 'react';

/**
 * Renders the QC report help page
 *
 * @returns {object} JSX representation of QC report help page
 */
function QcReportHelp() {
  return (
    <div className="QcReportHelp content-wrapper">
      <div className="section-omic">
        <h4 className="mt-4">Metabolomics</h4>
        <p className="text-body">
          Summary of data submissions by the Metabolomics chemical analysis
          sites.
        </p>
        <h6>Terms & Definitions</h6>
        <ul className="terms-definitions">
          <li>
            <span className="term">cas</span>: Chemical Analysis Site
          </li>
          <li>
            <span className="term">phase</span>: MoTrPAC phase
          </li>
          <li>
            <span className="term">tissue</span>: tissue code
          </li>
          <li>
            <span className="term">t_name</span>: tissue name
          </li>
          <li>
            <span className="term">assay</span>: metabolomics (
            <span className="untargeted">untargeted</span>,{' '}
            <span className="targeted">targeted</span>) assays:
            <ul>
              <li>
                <span className="term untargeted">HILICPOS</span> : HILIC
                positive (Broad)
              </li>
              <li>
                <span className="term untargeted">IONPNEG</span>: ion pairing
                negative (U.Michigan)
              </li>
              <li>
                <span className="term untargeted">RPPOS</span>: reversed phase
                positive (U.Michigan)
              </li>
              <li>
                <span className="term untargeted">RPNEG</span>: reversed phase
                negative (U.Michigan)
              </li>
              <li>
                <span className="term untargeted">LRPPOS</span>: lipid reversed
                phase positive (Georgia Tech)
              </li>
              <li>
                <span className="term untargeted">LRPNEG</span>: lipid reversed
                phase negative (Georgia Tech)
              </li>
              <li>
                <span className="term targeted">3HIB</span>: Targeted
                3-Hydroxyisobutyric Acid (Duke)
              </li>
              <li>
                <span className="term targeted">AA</span>: Targeted Amino Acids
                (Duke)
              </li>
              <li>
                <span className="term targeted">AC_DUKE</span>: Targeted
                Acylcarnitines (Duke)
              </li>
              <li>
                <span className="term targeted">ACOA</span>: Targeted Acyl CoA
                (Duke)
              </li>
              <li>
                <span className="term targeted">BAIBA</span>: Targeted
                beta-aminoisobutyric acid (Duke)
              </li>
              <li>
                <span className="term targeted">CER_DUKE</span>: Targeted
                Ceramide (Duke)
              </li>
              <li>
                <span className="term targeted">CON</span>: Targeted
                Conventional (Duke)
              </li>
              <li>
                <span className="term targeted">KA</span>: Targeted Keto acids
                (Duke)
              </li>
              <li>
                <span className="term targeted">NUC</span>: Targeted Oxylipins
                nucleotides (Duke)
              </li>
              <li>
                <span className="term targeted">OA</span>: Targeted Oxylipins
                Organic Acids (Duke)
              </li>
              <li>
                <span className="term targeted">SPHM</span>: Targeted
                sphingomyelins
              </li>
              <li>
                <span className="term targeted">OXYLIPNEG</span>: Targeted
                Oxylipins negative (Emory)
              </li>
              <li>
                <span className="term targeted">AC_MAYO</span>: Targeted
                Acylcarnitines (Mayo)
              </li>
              <li>
                <span className="term targeted">AMINES</span>: Targeted Amines
                (Mayo)
              </li>
              <li>
                <span className="term targeted">CER_MAYO</span>: Targeted
                Ceramides (Mayo)
              </li>
              <li>
                <span className="term targeted">TCA</span>: Targeted
                tricarboxylic acid cycle (Mayo)
              </li>
              <li>
                <span className="term targeted">ETAMIDPOS</span>: Targeted
                Ethanolamides (Emory)
              </li>
            </ul>
          </li>
          <li>
            <span className="term">version</span>: batch / processed versions
          </li>
          <li>
            <span className="term">vial_label</span>: number of MoTrPAC vial
            label ids available in results
          </li>
          <li>
            <span className="term">qc_samples</span>: number of QC samples
            included by the CAS
          </li>
          <li>
            <span className="term">issues</span>: total number of issues
            identified affecting one or many required files that must be
            addressed by the CAS sites. Details available in QC reports shared
            with CAS
          </li>
          <li>
            <span className="term">dmaqc_valid</span>:
            <ul>
              <li>
                <span className="term">PASS</span>: all <em>vial_label</em>{' '}
                shipped to the CAS successfully reported (some of them could
                have failed but reported on the <em>failedsample.txt</em> file).
              </li>
              <li>
                <span className="term">FAIL</span>: one or many{' '}
                <em>vial_label</em> not found in results and not available in{' '}
                <em>failedsample.txt</em> file
              </li>
            </ul>
          </li>
          <li>
            <span className="term">raw_manifest</span>:
            <ul>
              <li>
                <span className="term">0</span>: <em>raw_file</em> column
                content matches between <em>metadata_sample</em> and{' '}
                <em>manifest</em> file
              </li>
              <li>
                <span className="term">1</span>: one or many raw files missed in{' '}
                <em>manifest</em>
              </li>
            </ul>
          </li>
        </ul>
        <h4 className="mt-4">Proteomics</h4>
        <p className="text-body">
          Summary of data submissions by the Proteomics chemical analysis sites.
        </p>
        <h6>Terms & Definitions</h6>
        <ul className="terms-definitions">
          <li>
            <span className="term">cas</span>: Chemical Analysis Site
          </li>
          <li>
            <span className="term">phase</span>: MoTrPAC phase
          </li>
          <li>
            <span className="term">tissue</span>: tissue code
          </li>
          <li>
            <span className="term">t_name</span>: tissue name
          </li>
          <li>
            <span className="term">assay</span>: Proteomics assays:
            <ul>
              <li>
                <span className="term prot-pr">PROT_PR</span> : Global protein
                abundance
              </li>
              <li>
                <span className="term prot-ph">PROT_PH</span>: Protein
                phosphorylation
              </li>
              <li>
                <span className="term prot-ac">PROT_AC</span>: Protein
                Acetylation
              </li>
              <li>
                <span className="term prot-ub">PROT_UB</span>: Protein
                Ubiquitination
              </li>
            </ul>
          </li>
          <li>
            <span className="term">version</span>: batch / processed versions
          </li>
          <li>
            <span className="term">vial_label</span>: number of MoTrPAC vial
            label ids available in results
          </li>
          <li>
            <span className="term">qc_samples</span>: number of QC samples
            included by the CAS
          </li>
          <li>
            <span className="term">issues</span>: total number of issues
            identified affecting one or many required files that must be
            addressed by the CAS sites. Details available in QC reports shared
            with CAS
          </li>
          <li>
            <span className="term">dmaqc_valid</span>:
            <ul>
              <li>
                <span className="term">PASS</span>: all <em>vial_label</em>{' '}
                shipped to the CAS successfully reported (some of them could
                have failed but reported on the <em>failedsample.txt</em> file).
              </li>
              <li>
                <span className="term">FAIL</span>: one or many{' '}
                <em>vial_label</em> not found in results and not available in{' '}
                <em>failedsample.txt</em> file
              </li>
            </ul>
          </li>
          <li>
            <span className="term">raw_manifest</span>:
            <ul>
              <li>
                <span className="term">0</span>: <em>raw_file</em> column
                content matches between <em>metadata_sample</em> and{' '}
                <em>manifest</em> file
              </li>
              <li>
                <span className="term">1</span>: one or many raw files missed in{' '}
                <em>manifest</em>
              </li>
            </ul>
          </li>
        </ul>
        <h4 className="mt-4">RNA-seq, RRBS, and ATAC-seq</h4>
        <h6>Terms & Definitions</h6>
        <ul className="terms-definitions">
          <li>
            <span className="term">cas</span>: Chemical Analysis Site
          </li>
          <li>
            <span className="term">phase</span>: MoTrPAC phase
          </li>
          <li>
            <span className="term">tissue</span>: tissue code
          </li>
          <li>
            <span className="term">t_name</span>: tissue name
          </li>
          <li>
            <span className="term">seq_flowcell_lane</span>: sequencing flow
            cell lane/lanes in a flowcell
          </li>
          <li>
            <span className="term">version</span>: batch / processed versions
          </li>
          <li>
            <span className="term">sample_category</span>: study (MotrPAC study
            sample) or ref (batch QC sample)
          </li>
          <li>
            <span className="term">sample_count</span>: Number of samples per
            sample_category / tissue / seq_flowcell_lane
          </li>
          <li>
            <span className="term">dmaqc_valid</span>:
            <ul>
              <li>
                <span className="term">OK</span>: all <em>vial_label</em>{' '}
                shipped to the CAS successfully reported (some of them could
                have failed but reported on the <em>failedsample.txt</em> file).
              </li>
              <li>
                <span className="term">FAIL</span>: one or many{' '}
                <em>vial_label</em> not found in results and not available in{' '}
                <em>failedsample.txt</em> file
              </li>
            </ul>
          </li>
        </ul>
        <h4 className="mt-4">(Multiplex) Immunoassay</h4>
        <p className="text-body">
          Summary of data submissions by the cas site.
        </p>
        <h6>Terms & Definitions</h6>
        <ul className="terms-definitions mb-4">
          <li>
            <span className="term">cas</span>: Chemical Analysis Site
          </li>
          <li>
            <span className="term">phase</span>: MoTrPAC phase
          </li>
          <li>
            <span className="term">tissue</span>: tissue code
          </li>
          <li>
            <span className="term">t_name</span>: tissue name
          </li>
          <li>
            <span className="term">assay</span>: Multiplex Immune Assay
            (Luminex) to measure different proteins like cytokines, chemokines,
            hormones, growth factors. Five different panels were designed and
            run on different tissues. Each panel measures different set and
            number (n) of proteins.
            <ul>
              <li>mag27plex (n=27)</li>
              <li>metabolic (n=13)</li>
              <li>myokine (n=12)</li>
              <li>pituitaty (n=7)</li>
              <li>adipokine (n=2)</li>
            </ul>
          </li>
          <li>
            <span className="term">sample_category</span>: reference or
            experimental sample
          </li>
          <li>
            <span className="term">sample_count</span>: number of samples per
            tissue/assay/sample_category
          </li>
        </ul>
      </div>
    </div>
  );
}

export default QcReportHelp;
