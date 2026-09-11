#!/bin/sh
#
# Switch the file-download metadata between the two states it has.
#
#   yarn metadata:mock    one record per collection -- what gets committed
#   yarn metadata:full    the real listings         -- local dev, staging, prod
#
# Both steps have to happen together: `facet-vocabulary.json` is derived from
# `collections/`, and shipping real collections beside a sampled vocabulary
# leaves the filter panel offering 4 tissues against 26 in the data, silently
# hiding most of the corpus. Doing it in one command is the point of this file.
#
# The generator lives in its own repo, so set MOTRPAC_GENERATOR if yours is not
# at the default path. (It is the mirror of the MOTRPAC_FRONTEND variable the
# generator itself reads.)

set -e

mode="$1"
generator="${MOTRPAC_GENERATOR:-$HOME/Workflows/motrpac-data-registry-metadata}"
frontend="$(cd "$(dirname "$0")/.." && pwd)"

case "$mode" in
  mock) command="mock" ;;
  full) command="deploy" ;;
  *)
    echo "usage: $0 mock|full" >&2
    exit 64
    ;;
esac

if [ ! -d "$generator/generator" ]; then
  echo "error: no generator at $generator" >&2
  echo "Set MOTRPAC_GENERATOR to your motrpac-data-registry-metadata checkout." >&2
  exit 66
fi

# `deploy` exits non-zero when a collection has no LOADERS entry, and prints the
# line to paste. Let that through rather than swallowing it -- but still rebuild
# the vocabulary, so the two never disagree even on a partial run.
status=0
(cd "$generator" && python3 -m generator "$command") || status=$?

node "$frontend/scripts/build-facet-vocabulary.js"

if [ "$mode" = "mock" ]; then
  echo
  echo "Ready to commit collections/ and facet-vocabulary.json together."
  echo "Run 'yarn metadata:full' afterwards to get a usable local corpus back."
fi

exit $status
