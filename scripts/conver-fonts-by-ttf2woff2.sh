#!/bin/bash

# Run the script from the root of the project!

# @see https://www.npmjs.com/package/ttf2woff2
# @see https://www.npmjs.com/search?q=ttf%20to%20woff2

: "${FONTS_PATH:=public/fonts/disaster-fonts}"

cd "$FONTS_PATH"

pwd

for file in *.ttf; do
  echo -e "\nConverting $file"
  npx ttf2woff2 <$file >${file%.ttf}.woff2
done
