#!/bin/sh
# Rebuild public/ from the app's www folder (../hazem-app/www) plus the web-only files.
set -e
cd "$(dirname "$0")"
SRC="${1:-../hazem-app/www}"
rm -rf public && mkdir public && cp -R "$SRC"/. public/
cp web/webgate.js public/js/webgate.js
cp web/manifest.webmanifest public/manifest.webmanifest
cp web/icon-*.png public/ && cp web/apple-touch-icon.png public/
python3 - <<'PY'
p='public/index.html'; s=open(p,encoding='utf-8').read()
s=s.replace('<link rel="stylesheet" href="css/app.css">','<link rel="manifest" href="manifest.webmanifest">\n  <link rel="apple-touch-icon" href="apple-touch-icon.png">\n  <meta name="apple-mobile-web-app-capable" content="yes">\n  <meta name="apple-mobile-web-app-status-bar-style" content="black">\n  <meta name="apple-mobile-web-app-title" content="شحناتي">\n  <link rel="stylesheet" href="css/app.css">\n  <script src="js/webgate.js"></script>')
open(p,'w',encoding='utf-8').write(s)
PY
echo built
