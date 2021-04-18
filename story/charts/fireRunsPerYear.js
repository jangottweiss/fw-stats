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
            right: 0,
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
                data: [{
                        type: 'max'
                    },
                    {
                        type: 'min'
                    }
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
            right: 0,
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

export function fireRunsPerTypeYearBar(data, years) {
    function getTypeCntTypeYear() {
        const arr = types.map(e => years.map(e => 0));
        data
            .forEach((e) => {
                arr[types.indexOf(e.type)][years.indexOf(new Date(e.date).getFullYear())] += 1;
            })
        debugger;
        return arr;
    }

    return {
        legend: {
            data: types,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            right: 0,
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: years,
        },
        series: getTypeCntTypeYear().map((e, idx) => ({
            name: uniqueType[idx],
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: e
        }))
    };
}