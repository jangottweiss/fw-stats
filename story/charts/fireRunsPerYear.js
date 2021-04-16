import {
    typeColors,
    types,
    yearColors
} from '../constants.js';

import {
    getDataForYear
} from '../util.js'

export function fireRunsPerYearConfig(data, years) {
    return {
        title: {
            text: 'Einsätze pro Jahr',
        },
        grid: {
            left: 40,
            // top: 120,
            bottom: 25,
            containLabel: false,
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: years,
        },
        yAxis: {
            name: 'Anzahl Einsätze',
            nameLocation: 'center',
            nameGap: 30,
            type: 'value'
        },
        series: [{
            color: '#6C7A89',
            name: 'Einsätze pro Jahr',
            data: years.map(y => getDataForYear(data, y).length),
            type: 'line',
            markPoint: {
                data: [
                    {type: 'max'},
                    {type: 'min'}
                ]
            },
        }]
    };
}
export function fireRunsPerTypeYearConfig(data, years) {
    return {
        title: {
            text: 'Einsätze pro Jahr und Art',
        },
        legend: {
            top: 30,
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: 40,
            bottom: 25,
            top: 120,
            containLabel: false,
        },
        xAxis: {
            type: 'category',
            data: years,
        },
        yAxis: {
            name: 'Anzahl Einsätze',
            nameLocation: 'center',
            nameGap: 30,
            type: 'value'
        },
        series: types.map((type, idx) => ({
            name: type,
            color: typeColors[idx],
            data: years.map(y => getDataForYear(data.filter(e => e.type === type), y).length),
            type: 'line'
        })),
    };
}