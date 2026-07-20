#!/usr/bin/env sh
set -eu

echo "Running PR checks..."

pnpm lint
pnpm check-types
pnpm test
pnpm build

echo "PR checks passed."
