/**
 * Fail fast, and readably, on the wrong Node version.
 *
 * Yarn 4 runs in PnP mode, and its ESM loader hooks into Node's module-loader
 * internals. On Node 21+ those internals have changed enough that the loader
 * throws `EBADF: bad file descriptor, fstat` from deep inside
 * node:internal/modules/esm — a stack trace with no application frames in it,
 * and an exit code of 0, so CI reports success.
 *
 * `engines` in package.json does NOT prevent this: Yarn 4 checks engines for
 * dependencies, not for the project itself (verified — `yarn install` on Node 25
 * exits 0 without mentioning engines). `.nvmrc` only helps people who run
 * `nvm use`. This check is the part that actually stops the confusing failure,
 * so it is chained inside the scripts rather than relying on a pre* hook, which
 * Yarn 4 does not run automatically.
 */
const REQUIRED_MAJOR = 20;
const [major] = process.versions.node.split('.').map(Number);

if (major !== REQUIRED_MAJOR) {
  console.error(
    [
      '',
      `  ✖ Wrong Node version: ${process.versions.node} (this project needs ${REQUIRED_MAJOR}.x)`,
      '',
      `    Yarn 4's Plug'n'Play loader breaks on Node ${major} with a misleading`,
      '    "EBADF: bad file descriptor" stack trace from node:internal/modules/esm.',
      '',
      '    Fix:  nvm use          # reads .nvmrc (20.19.5)',
      '',
      `    Node in use here: ${process.execPath}`,
      '',
    ].join('\n'),
  );
  process.exit(1);
}
