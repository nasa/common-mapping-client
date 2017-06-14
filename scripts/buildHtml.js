// This script copies src/index.html into /dist/index.html
// This is a good example of using Node and cheerio to do a simple file transformation.
// In this case, the transformation is useful since we only want to track errors in the built production code.

// Allowing console calls below since this is a build file.
/*eslint-disable no-console */

import fs from 'fs';
import colors from 'colors';
import cheerio from 'cheerio';
import CleanCSS from 'clean-css';



fs.readFile('src/index.html', 'utf8', (err, markup) => {
    if (err) {
        return console.log(err);
    }

    const $ = cheerio.load(markup);

    // inline stylesheets so that dom can render those styles immediately
    let styleText = "";
    fs.readFile('src/styles/inline_styles.css', 'utf8', (err, styleText) => {
        if (!err) {
            styleText = new CleanCSS().minify(styleText).styles;
            $('head').append("<style type='text/css'>" + styleText + "</style>");
            fs.writeFile('dist/index.html', $.html(), 'utf8', function(err) {
                if (err) {
                    return console.log(err);
                }
            });
        } else {
            console.log("Error reading styles: ", err);
        }
    });
});
