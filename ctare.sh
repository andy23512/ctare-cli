#!/bin/sh
if [[ $# -eq 0 ]] ; then
    \echo 'Usage: ./ctare.sh [project name]'
    \exit 1
fi
\vue create $1
\cd $1
\yarn add axios jquery semantic-ui-reset
\yarn add -D awesome-fontmin-loader charactor-scanner imagemin imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant img-loader pug pug-plain-loader
\perl -0 -i -pe 's/"browserslist": \[.*?\]/"browserslist": [\n    "> 1% in tw",\n    "last 3 versions",\n    "not ie <= 11"\n  ]/s' package.json
\echo "\n# add by ctare\nsrc/assets/fonts/" >> .gitignore
\git clone https://github.com/andy23512/ctare-cli/
if [ -f ./src/router.js ] ; then
    \cp -rf ctare-cli/* .
else
    \cp -rf ctare-cli/* .
    \rm -f ./src/router.js
    \perl -ni -e 'print unless /router/' ./src/main.js
fi
\rm -rf .git ctare-cli ctare.sh
