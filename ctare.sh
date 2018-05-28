#!/bin/sh
vue create $@
cd $1
yarn add axios jquery semantic-ui-reset
yarn add -D awesome-fontmin-loader charactor-scanner imagemin imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant img-loader pug pug-plain-loader 
echo "\n\n# add by ctare\nsrc/assets/fonts/" >> .gitignore
git clone https://github.com/andy23512/ctare-cli/
mv ctare-cli/* .
