#!/usr/bin/env bash
# Deploiement Cloudflare Pages a partir d'une copie PROPRE du site.
#
# Pourquoi : `wrangler pages deploy portfolio-victor` envoie TOUT le dossier,
# y compris les fichiers ignores par git (.claude/settings.local.json, drafts/,
# .gitignore...). Ce script copie uniquement une liste blanche de fichiers
# publics dans un dossier temporaire, verifie qu'aucun secret n'y traine,
# puis deploie ce dossier.
#
# Usage : ./deploy.sh            -> deploiement production
#         ./deploy.sh --dry-run  -> prepare et verifie, sans deployer

set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
PROJECT="shuren-portfolio"
DIST="$(mktemp -d)"
trap 'rm -rf "$DIST"' EXIT

# Liste blanche : tout ce qui n'est pas ici n'est PAS publie.
PUBLIC=(
  index.html processus.html faq.html contact.html cas-client.html
  mentions-legales.html 404.html
  agent-ia-avis-google.html agent-ia-restaurant.html planning-equipe-ia.html
  en
  assets
  home.css home.js style.css script.js
  favicon.ico favicon.svg favicon-48x48.png favicon-96x96.png
  favicon-192x192.png apple-touch-icon.png
  robots.txt sitemap.xml llms.txt
  _headers _redirects
)

for f in "${PUBLIC[@]}"; do
  if [ ! -e "$SRC/$f" ]; then
    echo "ERREUR : fichier attendu introuvable : $f" >&2
    exit 1
  fi
  cp -R "$SRC/$f" "$DIST/"
done

# Nettoyage des artefacts OS / captures d'ecran
find "$DIST" \( -name '.DS_Store' -o -name 'Screenshot*' -o -name '*.md' \) -exec rm -rf {} +

# Garde-fou : aucun fichier cache ni secret dans le paquet
if find "$DIST" -name '.*' | grep -q .; then
  echo "ERREUR : fichier cache detecte dans le paquet :" >&2
  find "$DIST" -name '.*' >&2
  exit 1
fi
if grep -rIlE 'cfut_|sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|Bearer [A-Za-z0-9_-]{20,}' "$DIST"; then
  echo "ERREUR : secret potentiel detecte (fichiers ci-dessus). Deploiement annule." >&2
  exit 1
fi

echo "Paquet pret ($(find "$DIST" -type f | wc -l | tr -d ' ') fichiers) : $DIST"

if [ "${1:-}" = "--dry-run" ]; then
  find "$DIST" -type f | sed "s|$DIST/||" | sort
  exit 0
fi

npx wrangler pages deploy "$DIST" --project-name="$PROJECT" --branch=main
