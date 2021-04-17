import {
    getDataForType,
} from '../util.js'

import {
    getEditDistance
} from '../distance.js'

import {
    getColorForType,
    types,
    typeColors,
} from '../constants.js'

export function typeKeywordTree(data) {
    const proccessedData = data.map((e) => {
        e.report = e.report.replaceAll('Brandmeldeanlage', 'BMA');
        e.report = e.report.replaceAll('Drehleiter', 'DLK');
        e.report = e.report.replaceAll('Fahrstuhl', 'Aufzug');
        return e;
    })

    function getReportCount(data) {
        const collect = {};
        data.forEach((e, idx) => {
            const rep = e.report;
            if (!collect[rep]) {
                collect[rep] = {
                    name: rep,
                    value: 1,
                }
                return;
            }
            collect[rep].value += 1;
        });
        return collect;
    }
    const threshold = 2;

    function getReportCountLevenshtein(data) {
        const collect = {};
        data.forEach((e, idx) => {
            const rep = e.report;
            if (!collect[rep]) {
                const dists =
                    Object.keys(collect).map(e => {
                        return [getEditDistance(rep, e), e]
                    })
                    .sort((a, b) => a[0] - b[0]);

                if (dists[0] && dists[0][0] <= threshold) {
                    collect[dists[0][1]].value += 1;
                    collect[dists[0][1]].texts.push(rep);
                    return;
                }
                collect[rep] = {
                    name: rep,
                    value: 1,
                    texts: [],
                }
                return;
            }
            collect[rep].value += 1;
        });
        return collect;
    }

    return {
        tooltip: {
            formatter: function (info) {
                var value = info.value;
                var treePathInfo = info.treePathInfo;
                var treePath = [];                
                for (var i = 1; i < treePathInfo.length; i++) {
                    treePath.push(treePathInfo[i].name);
                }

                return [
                    `${treePath.join(' > ')}`,
                    `Anzahl Einsätze: ${value}`,
                ].join('<br>');
            }
        },
        series: [{
            type: 'treemap',
            breadcrumb: {
                show: false,
            },
            levels: [{
                    itemStyle: {
                        borderWidth: 0,
                        gapWidth: 5
                    }
                },
                {
                    itemStyle: {
                        gapWidth: 1
                    }
                },
                {
                    colorSaturation: [0.35, 0.5],
                    itemStyle: {
                        gapWidth: 1,
                        borderColorSaturation: 0.6
                    }
                }
            ],
            data: types.map(type => {
                const value = getDataForType(proccessedData, type);
                const children = getReportCountLevenshtein(value);
                return {
                    name: type, // First tree
                    value: value.length,
                    itemStyle: {
                        color: getColorForType(type),
                    },
                    children: Object.values(children),
                }

            })
        }]
    };
}