const cheerio = require('cheerio')
const fs = require('fs')

const html = fs.readFileSync('parser/export.html');
const $ = cheerio.load(html)
const allEinsatz = [];
$('#einsatzberichtList > tbody > tr').each((rIdx, row) => {
    const einsatz = {
        org: []
    };
    $(row).children().each((cIdx, column) => {
        if(cIdx === 13) {
            einsatz.intId = $(column).text().trim();
        }
        if (cIdx === 3) {
            einsatz.date = new Date($(column).text().trim());
            einsatz.dateStr = $(column).text().trim();
        }
        if (cIdx === 5) {
            einsatz.type = $(column).find('a').children().text().trim();
            $(column).find('img').each((imgIdx, img) => {
                if (imgIdx === 0) {
                    einsatz.alertType = img.attribs.title.trim();
                }
                if (imgIdx === 1) {
                    einsatz.typeCat = img.attribs.title.trim();
                }
                if (imgIdx === 2) {
                    einsatz.category = img.attribs.title.trim();
                }
            })
        }
        if (cIdx === 6) {
            // einsatz.location = $(column).text().trim();
        }
        if (cIdx === 8) {
            einsatz.report = $(column).text().trim();
        }
        if (cIdx === 12) {
            $(column).find('.label').each((lIdx, label) => {
                einsatz.org.push(label.children[0].data);
            })
        }
    });
    allEinsatz.push(einsatz);
});
fs.writeFileSync('story/data.json', JSON.stringify(allEinsatz));