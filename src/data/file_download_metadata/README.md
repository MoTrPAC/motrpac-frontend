# File download metadata

**The JSON committed here is sample data, not the real file listings.** Your
working copy is expected to hold the real thing — one record per collection is a
commit-time state, not a development-time one.

So `collections/` and `facet-vocabulary.json` will normally show as modified in
`git status`. That is correct. **Run `generator mock` before committing** and
`generator deploy` after, to get back to a usable local corpus.

## Why

The real listings are ~4.8 MB across 24 collections and enumerate the object
paths and sizes of consortium-only files. Neither belongs in the repo, so this
follows the convention already used by the four per-study files at this level:
commit something representative and small, place the real thing out-of-band.

## Layout

| Path | What |
|---|---|
| `collections/{family}_{study}_{cN.M}-minified.json` | one file per collection; what the file browser loads |
| `facet-vocabulary.json` | the Tissue / Omics / Assay options, built from `collections/` |
| `*-files-minified.json` | the four legacy per-study files. **Nothing imports these.** Kept for reference |

The four legacy files carry one record each — that is the convention this
directory follows, not an accident.

`collections/` and `facet-vocabulary.json` are generated together and must
travel together. Real collections with a sampled vocabulary means the filter
panel silently offers a fraction of the corpus.

## The two states

| | `collections/` holds | when |
|---|---|---|
| **working / staging / production** | the real listings, ~10.8k records | almost always |
| **committed** | one record per collection, 24 records | only at commit time |

One command each way:

```bash
yarn metadata:full    # real listings   -> collections/   (normal state)
yarn metadata:mock    # one record each -> collections/   (before committing)
```

Both rebuild `facet-vocabulary.json` in the same step, because that file is
derived from `collections/` and the two must never be committed apart. Pair real
data with a sampled vocabulary and the filter panel offers 4 tissues against 26
in the data, silently hiding most of the corpus — nothing crashes.

`facetVocabulary.test.js` catches that mismatch, and CI runs `yarn test` on every
PR, so an inconsistent pair **fails the pull request**. That is the guard; there
is deliberately no git hook, since a hook could not fix the problem at push time
anyway — the metadata is already committed by then.

The scripts drive the generator, which lives in its own repo. Set
`MOTRPAC_GENERATOR` if your checkout is not at
`~/Workflows/motrpac-data-registry-metadata`.

`deploy` exits non-zero and prints the line to paste if a collection has no
`LOADERS` entry in `src/lib/collectionFiles.js`. Vite needs literal import
specifiers, so that one line stays manual.

These are **build-time imports** — Vite bundles each collection into its own lazy
chunk at `yarn build`. They are not fetched at runtime, so the real files must be
in the checkout *before* the build, not uploaded to a server or CDN afterwards.

> **The one thing that can go wrong quietly:** `git add -A` while `collections/`
> holds real data commits ~4.9 MB enumerating consortium-only object paths. No
> test catches that — real collections and a real vocabulary agree with each
> other, so the suite stays green. Check `git diff --stat` on this directory
> before committing.

## Regenerating the samples

`yarn metadata:mock` keeps **one real record per collection**, the first by object path — 24
records, ~11 KB, matching the one-record convention of the legacy per-study
files beside this README. Real rather than invented, so the shapes stay honest:
null-vs-absent fields, comma-joined assay lists, the `Human `-prefixed tissue
names.

### What that means for tests

Nothing may assert against the *contents* of this directory. A test that needs
particular tissues, or a collection holding both release stages, builds its own
fixture — `collectionFiles.test.js` does exactly that for the per-file
entitlement gate.

Shipped metadata is only ever checked for **self-consistency** (the committed
`facet-vocabulary.json` matches the committed `collections/`) or for
**invariants** that hold at any size:

- an option is enabled iff some in-scope collection carries it
- a collection contributes exactly the facet values its files carry
- no record without `external_release: true` reaches a non-internal user

The suite passes unchanged against these 24 records and against the full 9,698,
which is the property that makes the samples safe to commit.
