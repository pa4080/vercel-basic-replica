#!/bin/bash

# Run the script from the root of the project!

# @see https://www.npmjs.com/package/csso
# @see https://github.com/css/csso-cli

: "${CSS_PATH:=public/css}"

cd "$CSS_PATH"
rm -f *.min.css

for file in *.css; do
  echo -e "\nMinifying $file"
  npx csso --input "$file" --output "${file%.css}.min.css"
done
