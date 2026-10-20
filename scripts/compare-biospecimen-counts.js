/**
 * compare-biospecimen-counts.js
 *
 * Compares the Biospecimen Lookup page's participant counts between two data
 * sources, using the page's own parsing, filtering and chart helpers. Use it
 * before switching the page to a new backend or data release, to confirm that
 * every difference is explained (participants added, vials gaining results)
 * and nothing was lost or reclassified.
 *
 * Usage:
 *   yarn compare:biospecimens [--old <source>] [--new <source>] [--json <file>] [--strict]
 *
 * A <source> is a preset, an http(s) URL or a local file (JSON array,
 * {results: [...]} or TSV with a header row; detected from the content).
 * Presets read the gateway addresses and keys from .env (not .env.local, which
 * may redirect the API address for local testing):
 *   legacy-prod   (default --old) services gateway, old /v1/data/phenotype/biospecimen
 *   legacy-dev    staging gateway, old route
 *   dev           (default --new) staging gateway, phenotype API /v1/data/phenotype/biospecimens
 *   prod          services gateway, phenotype API route
 * For a URL, `key` is added from OLD_API_KEY / NEW_API_KEY when set.
 *
 * Exit code: 1 when anything shown today would be lost or changed — a
 * participant or vial with assay results missing from --new, an assay removed
 * from a vial, or a participant moved to another chart category (except BMI
 * moves for participants whose BMI group differs across visits, which depend
 * on row order in both sources). With --strict, any difference fails. 0 otherwise.
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// The 24 columns the page requests (BIOSPECIMEN_API_FIELDS).
const NEW_ROUTE = '/v1/data/phenotype/biospecimens';
const LEGACY_ROUTE = '/v1/data/phenotype/biospecimen/';

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { old: 'legacy-prod', new: 'dev', json: null, strict: false, list: 20 };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--old') args.old = argv[++i];
    else if (a === '--new') args.new = argv[++i];
    else if (a === '--json') args.json = argv[++i];
    else if (a === '--list') args.list = Number(argv[++i]);
    else if (a === '--strict') args.strict = true;
    else if (a === '-h' || a === '--help') args.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

// ---------------------------------------------------------------------------
// Loading a source
// ---------------------------------------------------------------------------

/**
 * Gateway addresses and keys from .env alone. Deliberately not Vite's
 * loadEnv: that also applies .env.local, which may point
 * VITE_API_SERVICE_ADDRESS at another gateway for local testing and would
 * silently send the legacy-prod preset to staging.
 */
function readDotEnv() {
  const env = {};
  const file = resolve(root, '.env');
  if (!existsSync(file)) return env;
  readFileSync(file, 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  });
  return env;
}

function resolveSource(source, side, env, fields) {
  const presets = {
    'legacy-prod': [env.VITE_API_SERVICE_ADDRESS, LEGACY_ROUTE, env.VITE_API_SERVICE_KEY, {}],
    'legacy-dev': [env.VITE_API_SERVICE_ADDRESS_DEV, LEGACY_ROUTE, env.VITE_API_SERVICE_KEY_DEV, {}],
    dev: [env.VITE_API_SERVICE_ADDRESS_DEV, NEW_ROUTE, env.VITE_API_SERVICE_KEY_DEV,
      { return_format: 'tsv', fields }],
    prod: [env.VITE_API_SERVICE_ADDRESS, NEW_ROUTE, env.VITE_API_SERVICE_KEY,
      { return_format: 'tsv', fields }],
  };
  if (presets[source]) {
    const [address, route, key, params] = presets[source];
    if (!address || !key) {
      throw new Error(`Preset '${source}' needs its gateway address and key in .env`);
    }
    const url = new URL(address + route);
    Object.entries({ ...params, key }).forEach(([k, v]) => url.searchParams.set(k, v));
    return { label: `${source} (${address}${route})`, url };
  }
  if (/^https?:\/\//.test(source)) {
    const url = new URL(source);
    const key = process.env[side === 'old' ? 'OLD_API_KEY' : 'NEW_API_KEY'];
    if (key) url.searchParams.set('key', key);
    return { label: `${url.origin}${url.pathname}`, url };
  }
  if (!existsSync(source)) throw new Error(`No such preset, URL or file: ${source}`);
  return { label: source, file: source };
}

async function loadRows(src, records) {
  let text;
  if (src.file) {
    text = readFileSync(src.file, 'utf8');
  } else {
    // fetch decompresses gzip itself; the key stays out of any output.
    const res = await fetch(src.url, { headers: { 'Accept-Encoding': 'gzip' } });
    if (!res.ok) throw new Error(`${src.label}: HTTP ${res.status}`);
    text = await res.text();
  }
  const trimmed = text.trimStart();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    const data = JSON.parse(text);
    const rows = Array.isArray(data) ? data : data.results;
    if (!Array.isArray(rows)) throw new Error(`${src.label}: unexpected JSON shape`);
    return rows.map(records.normalizeBiospecimenRecord);
  }
  return records.parseBiospecimenTsv(text);
}

// ---------------------------------------------------------------------------
// The page's counting rules
// ---------------------------------------------------------------------------

/**
 * One function per participant chart in BiospecimenChart.jsx, returning the
 * category a record would be counted in (or null). Each chart places a
 * participant by the first record with a valid value. Keep in sync with the
 * participantBy* computations there.
 */
function chartRules(h) {
  return {
    sex: (r) => r.sex || null,
    age: (r) => r.dmaqc_age_groups || null,
    race: (r) => h.getRaceCategory(r) || null,
    bmi: (r) => (r.bmi ? h.getBMIGroup(r.bmi) || null : null),
    ethnicity: (r) => h.getEthnicityCategory(r) || null,
    randomGroup: (r) => h.getRandomizedGroup(r) || null,
    study: (r) => h.getStudyName(r.study) || null,
    tranche: (r) => h.transformTrancheCode(r.tranche) || null,
  };
}

const assaysOf = (r) => new Set(
  r.raw_assays_with_results ? String(r.raw_assays_with_results).split(';').filter(Boolean) : [],
);

function analyse(rows, rules) {
  // useBiospecimenData keeps only rows with assay results.
  const kept = rows.filter((item) => item?.raw_assays_with_results != null);
  const charts = {};
  const byPid = {};
  const valuesByPid = {};
  Object.entries(rules).forEach(([chart, rule]) => {
    const first = new Map();
    kept.forEach((r) => {
      if (!r.pid) return;
      const v = rule(r);
      if (!v) return;
      if (!first.has(r.pid)) first.set(r.pid, v);
      ((valuesByPid[chart] ||= {})[r.pid] ||= new Set()).add(v);
    });
    const counts = {};
    first.forEach((v, pid) => {
      counts[v] = (counts[v] || 0) + 1;
      (byPid[pid] ||= {})[chart] = v;
    });
    charts[chart] = counts;
  });
  return {
    rows: rows.length,
    kept,
    keptVials: new Map(kept.filter((r) => r.vial_label != null).map((r) => [r.vial_label, r])),
    allVials: new Map(rows.filter((r) => r.vial_label != null).map((r) => [r.vial_label, r])),
    participants: new Set(kept.map((r) => r.pid).filter(Boolean)),
    allParticipants: new Set(rows.map((r) => r.pid).filter(Boolean)),
    charts,
    byPid,
    valuesByPid,
  };
}

const countBy = (items, key) => items.reduce((acc, it) => {
  const k = key(it) ?? '(none)';
  acc[k] = (acc[k] || 0) + 1;
  return acc;
}, {});

function compare(o, n) {
  const report = {};
  report.summary = {
    old: { rows: o.rows, vialsWithAssays: o.kept.length, participants: o.participants.size },
    new: { rows: n.rows, vialsWithAssays: n.kept.length, participants: n.participants.size },
  };

  report.charts = {};
  Object.keys(o.charts).forEach((chart) => {
    const cats = [...new Set([...Object.keys(o.charts[chart]), ...Object.keys(n.charts[chart])])].sort();
    report.charts[chart] = cats
      .map((c) => ({ category: c, old: o.charts[chart][c] || 0, new: n.charts[chart][c] || 0 }))
      .filter((d) => d.old !== d.new);
  });

  const describe = (side, pid) => {
    const r = side.kept.find((x) => x.pid === pid) || {};
    return { pid, study: r.study ?? null, tranche: r.tranche ?? null };
  };
  const onlyOld = [...o.participants].filter((p) => !n.participants.has(p)).sort();
  const onlyNew = [...n.participants].filter((p) => !o.participants.has(p)).sort();
  report.participantsRemoved = onlyOld.map((p) => describe(o, p));
  report.participantsAdded = onlyNew.map((p) => describe(n, p));
  report.participantsAddedHadRowsInOld = onlyNew.filter((p) => o.allParticipants.has(p)).length;

  // Participants in both, placed in a different category on some chart.
  report.reclassified = [];
  [...o.participants].filter((p) => n.participants.has(p)).forEach((pid) => {
    Object.keys(o.charts).forEach((chart) => {
      const a = o.byPid[pid]?.[chart] ?? null;
      const b = n.byPid[pid]?.[chart] ?? null;
      if (a === b) return;
      const multi = (o.valuesByPid[chart]?.[pid]?.size || 0) > 1
        || (n.valuesByPid[chart]?.[pid]?.size || 0) > 1;
      report.reclassified.push({ pid, chart, old: a, new: b, orderDependent: multi });
    });
  });
  report.orderDependentBmiParticipants = {
    old: Object.values(o.valuesByPid.bmi || {}).filter((s) => s.size > 1).length,
    new: Object.values(n.valuesByPid.bmi || {}).filter((s) => s.size > 1).length,
  };

  // Vials with assay results.
  const lostVials = [...o.keptVials.keys()].filter((v) => !n.keptVials.has(v));
  const gained = [...n.keptVials.keys()].filter((v) => !o.keptVials.has(v));
  const gainedExisting = gained.filter((v) => o.allVials.has(v));
  const assaysRemoved = {};
  const assaysAdded = {};
  let vialsWithChangedAssays = 0;
  [...o.keptVials.keys()].filter((v) => n.keptVials.has(v)).forEach((v) => {
    const a = assaysOf(o.keptVials.get(v));
    const b = assaysOf(n.keptVials.get(v));
    let changed = false;
    a.forEach((x) => { if (!b.has(x)) { assaysRemoved[x] = (assaysRemoved[x] || 0) + 1; changed = true; } });
    b.forEach((x) => { if (!a.has(x)) { assaysAdded[x] = (assaysAdded[x] || 0) + 1; changed = true; } });
    if (changed) vialsWithChangedAssays += 1;
  });
  report.vials = {
    lost: lostVials.length,
    lostStillInNewWithoutAssays: lostVials.filter((v) => n.allVials.has(v)).length,
    gained: gained.length,
    gainedExistingVials: gainedExisting.length,
    gainedNewVials: gained.length - gainedExisting.length,
    gainedByTranche: countBy(gained.map((v) => n.keptVials.get(v)), (r) => r.tranche),
    gainedByAssay: countBy(gained.flatMap((v) => [...assaysOf(n.keptVials.get(v))]), (x) => x),
    vialsWithChangedAssays,
    assaysAddedOnSharedVials: assaysAdded,
    assaysRemovedOnSharedVials: assaysRemoved,
  };
  report.vialsLostSample = lostVials.slice(0, 50);
  return report;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const sortDesc = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);

function print(report, labels, list) {
  const { old: o, new: n } = report.summary;
  console.log(`\nOld: ${labels.old}\nNew: ${labels.new}\n`);
  console.table({
    rows: { old: o.rows, new: n.rows },
    'vials with assay results': { old: o.vialsWithAssays, new: n.vialsWithAssays },
    'participants (charts)': { old: o.participants, new: n.participants },
  });

  console.log('\nChart counts that differ (old → new):');
  let any = false;
  Object.entries(report.charts).forEach(([chart, diffs]) => {
    if (!diffs.length) return;
    any = true;
    console.log(`  ${chart}: ${diffs.map((d) => `${d.category} ${d.old}→${d.new}`).join(', ')}`);
  });
  if (!any) console.log('  none');

  const people = (title, items) => {
    console.log(`\n${title}: ${items.length}`);
    if (!items.length) return;
    console.log(`  by study:   ${sortDesc(countBy(items, (p) => p.study)).map(([k, v]) => `${k} ${v}`).join(', ')}`);
    console.log(`  by tranche: ${sortDesc(countBy(items, (p) => p.tranche)).map(([k, v]) => `${k} ${v}`).join(', ')}`);
    console.log(`  ${items.slice(0, list).map((p) => p.pid).join(' ')}${items.length > list ? ' …' : ''}`);
  };
  people('Participants removed (shown today, missing from new)', report.participantsRemoved);
  people('Participants added', report.participantsAdded);
  if (report.participantsAdded.length) {
    console.log(`  ${report.participantsAddedHadRowsInOld} of them have rows in old, without assay results`);
  }

  console.log(`\nParticipants placed in a different category: ${report.reclassified.length}`);
  report.reclassified.slice(0, list).forEach((d) => console.log(
    `  ${d.pid} ${d.chart}: ${d.old} → ${d.new}${d.orderDependent ? '  (several values across visits; depends on row order)' : ''}`,
  ));
  console.log(`  participants with more than one BMI group across visits: old ${report.orderDependentBmiParticipants.old}, new ${report.orderDependentBmiParticipants.new}`);

  const v = report.vials;
  console.log('\nVials with assay results:');
  console.log(`  lost: ${v.lost} (${v.lostStillInNewWithoutAssays} still in new, without results)`);
  console.log(`  gained: ${v.gained} (${v.gainedExistingVials} existing vials gained results, ${v.gainedNewVials} new vials)`);
  if (v.gained) {
    console.log(`    by tranche: ${sortDesc(v.gainedByTranche).map(([k, n2]) => `${k} ${n2}`).join(', ')}`);
    console.log(`    by assay:   ${sortDesc(v.gainedByAssay).slice(0, 10).map(([k, n2]) => `${k} ${n2}`).join(', ')}`);
  }
  console.log(`  shared vials whose assay list changed: ${v.vialsWithChangedAssays}`);
  if (Object.keys(v.assaysRemovedOnSharedVials).length) {
    console.log(`    removed: ${sortDesc(v.assaysRemovedOnSharedVials).map(([k, n2]) => `${k} ${n2}`).join(', ')}`);
  }
  if (Object.keys(v.assaysAddedOnSharedVials).length) {
    console.log(`    added:   ${sortDesc(v.assaysAddedOnSharedVials).map(([k, n2]) => `${k} ${n2}`).join(', ')}`);
  }
}

function verdict(report, strict) {
  const problems = [];
  if (report.participantsRemoved.length) problems.push(`${report.participantsRemoved.length} participants removed`);
  if (report.vials.lost) problems.push(`${report.vials.lost} vials lost their assay results`);
  if (Object.keys(report.vials.assaysRemovedOnSharedVials).length) problems.push('assays removed from vials');
  const moved = report.reclassified.filter((d) => !(d.chart === 'bmi' && d.orderDependent));
  if (moved.length) problems.push(`${moved.length} participant/chart placements changed`);
  if (strict) {
    const anyDiff = Object.values(report.charts).some((d) => d.length)
      || report.participantsAdded.length || report.vials.gained || report.reclassified.length;
    if (anyDiff && !problems.length) problems.push('differences found (--strict)');
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0]);
    return 0;
  }
  const env = readDotEnv();

  // Load the page's modules through Vite, which resolves their extensionless
  // imports and import.meta.env, so the comparison uses the page's own code.
  const vite = await createServer({
    root,
    configFile: false,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const quiet = console.log;
    console.log = () => {};   // biospecimenService logs its config on import
    let records;
    let helpers;
    try {
      records = await vite.ssrLoadModule('/src/lib/api/biospecimenService.js');
      const base = '/src/DataExploration/Biospecimen/Clinical/utils/';
      helpers = {
        ...(await vite.ssrLoadModule(`${base}demographicUtils.js`)),
        ...(await vite.ssrLoadModule(`${base}studyUtils.js`)),
        ...(await vite.ssrLoadModule(`${base}dataTransformUtils.js`)),
      };
    } finally {
      console.log = quiet;
    }

    const fields = records.BIOSPECIMEN_API_FIELDS.join(',');
    const oldSrc = resolveSource(args.old, 'old', env, fields);
    const newSrc = resolveSource(args.new, 'new', env, fields);
    console.log('Loading both sources…');
    const [oldRows, newRows] = await Promise.all([loadRows(oldSrc, records), loadRows(newSrc, records)]);

    const rules = chartRules(helpers);
    const report = compare(analyse(oldRows, rules), analyse(newRows, rules));
    print(report, { old: oldSrc.label, new: newSrc.label }, args.list);

    if (args.json) {
      writeFileSync(args.json, JSON.stringify({ old: oldSrc.label, new: newSrc.label, ...report }, null, 2));
      console.log(`\nFull report: ${args.json}`);
    }

    const problems = verdict(report, args.strict);
    console.log(problems.length
      ? `\nFAIL: ${problems.join('; ')}`
      : '\nOK: nothing shown today is lost or changed; any differences are additions.');
    return problems.length ? 1 : 0;
  } finally {
    await vite.close();
  }
}

main().then((code) => process.exit(code)).catch((err) => {
  console.error(err.message || err);
  process.exit(2);
});
