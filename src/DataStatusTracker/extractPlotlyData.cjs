#!/usr/bin/env node
/**
 * Extracts Plotly data/layout/config from the generated HTML file
 * and writes them as ES module exports.
 *
 * Usage:
 *   node src/DataStatusTracker/extractPlotlyData.cjs [path-to-html]
 *
 * Defaults to public/static-assets/motrpac_human_assays_data_status.html
 */
const fs = require('fs');
const path = require('path');

const htmlPath = process.argv[2]
  || path.resolve(__dirname, '../../public/static-assets/motrpac_human_assays_data_status.html');
const outputPath = path.resolve(__dirname, 'humanAssayStatusData.js');

const html = fs.readFileSync(htmlPath, 'utf8');

const callStart = html.indexOf('Plotly.newPlot(');
if (callStart === -1) {
  console.error('Could not find Plotly.newPlot() in the HTML file.');
  process.exit(1);
}

const content = html.substring(callStart);

function findMatchingBracket(str, startIdx, open, close) {
  let count = 0;
  for (let i = startIdx; i < str.length; i++) {
    if (str[i] === open) count++;
    if (str[i] === close) count--;
    if (count === 0) return i + 1;
  }
  return -1;
}

// Extract data array
const dataStart = content.indexOf('[');
const dataEnd = findMatchingBracket(content, dataStart, '[', ']');

// Extract layout object
const layoutStart = content.indexOf('{', dataEnd);
const layoutEnd = findMatchingBracket(content, layoutStart, '{', '}');

// Extract config object
const configStart = content.indexOf('{', layoutEnd);
const configEnd = findMatchingBracket(content, configStart, '{', '}');

const dataStr = content.substring(dataStart, dataEnd);
const layoutStr = content.substring(layoutStart, layoutEnd);
const configStr = content.substring(configStart, configEnd);

// Validate JSON
try { JSON.parse(dataStr); } catch (e) { console.error('Invalid data JSON:', e.message); process.exit(1); }
try { JSON.parse(layoutStr); } catch (e) { console.error('Invalid layout JSON:', e.message); process.exit(1); }
try { JSON.parse(configStr); } catch (e) { console.error('Invalid config JSON:', e.message); process.exit(1); }

// Extract generated date
const dateMatch = html.match(/Generated:\s*([^<]+)/);
const generatedDate = dateMatch ? dateMatch[1].trim() : 'Unknown';

const output = [
  '// Auto-extracted from motrpac_human_assays_data_status.html',
  `// Generated: ${generatedDate}`,
  '// To update: re-run this script after the Python pipeline generates a new HTML file',
  '',
  `export const generatedDate = ${JSON.stringify(generatedDate)};`,
  '',
  `export const plotData = ${dataStr};`,
  '',
  `export const plotLayout = ${layoutStr};`,
  '',
  `export const plotConfig = ${configStr};`,
  '',
].join('\n');

fs.writeFileSync(outputPath, output);
console.log(`Extracted Plotly data (Generated: ${generatedDate})`);
console.log(`Written to ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
