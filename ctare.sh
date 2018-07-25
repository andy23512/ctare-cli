#!/bin/sh
FONTS='Y'
PROJECT=

function usage()
{
    echo "./test.sh [options] project-name"
    echo "\tOptions:"
    echo "\t--no-fonts"
    echo ""
}

while [ "$1" != "" ]; do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    case $PARAM in
        -h | --help)
            usage
            exit
            ;;
        --no-fonts)
            FONTS='N'
            ;;
        *)
            PROJECT=$PARAM
            ;;
    esac
    shift
done

if [[ "$PROJECT" == '' ]] ; then
    usage
    exit
fi
\vue create $PROJECT
\cd $PROJECT
\yarn add axios jquery semantic-ui-reset
\yarn add -D awesome-fontmin-loader charactor-scanner imagemin imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant img-loader pug pug-plain-loader
\perl -0 -i -pe 's/"browserslist": \[.*?\]/"browserslist": [\n    "> 1% in tw",\n    "last 3 versions",\n    "not ie <= 11"\n  ]/s' package.json
\echo "\n# add by ctare\nsrc/assets/fonts/" >> .gitignore
\git clone https://github.com/andy23512/ctare-cli/
\cp ctare-cli/vue.config.js .
if [ -f ./src/router.js ] ; then
    \cp -rf ctare-cli/src ./src
else
    \cp -rf ctare-cli/src ./src
    \rm -f ./src/router.js
    \perl -ni -e 'print unless /router/' ./src/main.js
fi
if [ ! -f ./src/store.js ]; then
    \perl -ni -e 'print unless /store/' ./src/main.js
fi
if [[ "$FONTS" == 'Y' ]] ; then
    \mkdir ./src/assets/fonts/
    cd ./src/assets/fonts
    \wget https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Light.ttf 2>/dev/null || \curl -O https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Light.ttf
    \wget https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Regular.ttf 2>/dev/null || \curl -O https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Regular.ttf
    \wget https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Medium.ttf 2>/dev/null || \curl -O https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Medium.ttf
    \wget https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Bold.ttf 2>/dev/null || \curl -O https://raw.githubusercontent.com/minjiex/kaigen-gothic/master/dist/TW/KaiGenGothicTW-Bold.ttf
else
    \perl -0 -i -pe "s/\@import\s'~@\/assets\/font\.sass'//; s/Noto Sans TC, //" ./src/assets/global.sass
    \rm -f ./src/assets/font.sass
fi
