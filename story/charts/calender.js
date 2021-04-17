import {
    getDataForYear,
} from '../util.js'

import {
    neutralColor,
    getColorForType,
    types,
    typeColors,
} from '../constants.js'

export function fireRunCalender(data, years) {

    const calendarData = years.map((y, idx) => {
        const dataForThisYear = {};
        getDataForYear(data, y).forEach((e) => {
            const d = echarts.format.formatTime('yyyy-MM-dd', e.date);
            if (!dataForThisYear[d]) {
                dataForThisYear[d] = {
                    value: [d, 1, [e], e.type],
                    itemStyle: {
                        color: getColorForType(e.type)
                    }
                }
                return;
            }
            dataForThisYear[d].value[1] += 1;
            dataForThisYear[d].value[2].push(e);
            dataForThisYear[d].value[3] = 'Verschiedene';
            dataForThisYear[d].itemStyle.color = neutralColor;
        });
        return {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: idx,
            data: Object.values(dataForThisYear),

            tooltip: {
                transitionDuration: 0,
                formatter: function (params) {
                    const run = params.value[2];
                    // const baseLink = 'http://www.feuerwehr-neckarelz-diedesheim.de/einsaetze/einsaetze-2/einsatzbericht';
                    // const str = run.map(e => `<a href="${baseLink}/${e.intId}">${e.report}</a>`).join('<br>')
                    const str = run.map(e => e.report).join('<br>')
                    return str;
                }
            }
        }
    })

    return {
        // visualMap: {
        //     type: 'piecewise',
        //     orient: 'horizontal',
        //     left: 'center',
        //     // pieces: typeColors.map(e => ({color: e})),
        //     // categories: [...types, 'Verschiedene'],
        //     dimension: 3,
        //     top: 0,
        // },
        tooltip: {
            position: 'top'
        },
        calendar: years.map((y, idx) => ({
            top: idx * 90,
            range: y,
            cellSize: ['auto', 10],
        })),
        series: calendarData,
    };
}