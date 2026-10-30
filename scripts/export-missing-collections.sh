#!/usr/bin/env bash
# Export the 3 missing Stopsygefravær.nu collections from Umbraco.
# Run with your fresh Umbraco cookies set as environment variables:
#
#   UMBRACO_COOKIE="UMB_UCONTEXT=...; UMB-XSRF-TOKEN=..." \
#   UMBRACO_XSRF_TOKEN="s02gjzY..." \
#   bash scripts/export-umbraco-stopsygefravær-collections.sh
#
# Or just run it and paste a JSON config on stdin for each collection (see below).

set -euo pipefail

SCRIPT="scripts/export-umbraco-collection.mjs"
BASE_OUT="umbraco-data/users/Stopsygefravær.nu/content"

COOKIE="${UMBRACO_COOKIE:-}"
XSRF_TOKEN="${UMBRACO_XSRF_TOKEN:-}"

if [[ -z "$COOKIE" ]]; then
  echo "ERROR: Set UMBRACO_COOKIE env var with the full cookie string." >&2
  exit 1
fi

run_export() {
  local parentId="$1"
  local collectionName="$2"
  local outDir="$3"

  echo ""
  echo "==> Exporting collection: $collectionName (parentId=$parentId)"
  echo "    Out: $outDir"

  local config
  config=$(node -e "process.stdout.write(JSON.stringify({
    cookie: process.env.UMBRACO_COOKIE,
    xsrfToken: process.env.UMBRACO_XSRF_TOKEN || '',
    parentId: $parentId,
    collectionName: $(echo "\"$collectionName\""),
    outDir: $(echo "\"$outDir\""),
    includeProperties: ['title','orderID','hidden','description','headline','coverImage','access','rentalPrice','purchasePrice','code','period'],
    fetchDetails: true
  }))")

  echo "$config" | node "$SCRIPT"
  echo "    Done."
}

# 1. Det her skal du vide...  (parentId: 39091)
run_export \
  39091 \
  "Det her skal du vide naar du er leder og haandterer sygefraavaer paa arbejdspladsen!" \
  "${BASE_OUT}/Det_her_skal_du_vide_naar_du_er_leder_og_handterer_sygefravær_paa_arbejdspladsen"

# 2. E-BOG i to forskellige formater  (parentId: 14230)
run_export \
  14230 \
  "E-BOG i to forskellige formater" \
  "${BASE_OUT}/E-BOG_i_to_forskellige_formater_PDF-format_eller_E-PUB_format_som_kan_laeses_direkte_i_e-bogs_appen"

# 3. Videoer med tips og triks...  (parentId: 19339)
run_export \
  19339 \
  "Videoer med tips og triks" \
  "${BASE_OUT}/Videoer_med_tips_og_triks_til_hvad_du_skal_vide_om_handtering_af_sygefravær"

echo ""
echo "All 3 collections exported successfully."
