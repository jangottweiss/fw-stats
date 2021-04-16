import {
    getDataForYear,    
} from '../util.js'

import {
    neutralColor,
} from '../constants.js'

export function fireRunCalender(data, years) {

    return {
        tooltip: {
            position: 'top'
        },
        grid: {
            left: 5,
        },
        calendar: years.map((y, idx) => ({
            top: idx * 90,
            range: y,
            cellSize: ['auto', 10],
        })),
        series: years.map((y, idx) => ({
            color: neutralColor,
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: idx,
            data: getDataForYear(data, y).map(e => [echarts.format.formatTime('yyyy-MM-dd', e.date), 1])
        })),
    };
}