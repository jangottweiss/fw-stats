import {
    getDataForYear,
    getDataForReportKeyword
} from '../util.js';

export function fireRunReportKeyWord(data, years) {
    const keys = ["BMA", "Türöffnung", "Brand", "Unfall", "Personenrettung", "DLK", "Aufzug", "Rauchmelder", "Baum", "Wasser", "Öl"];
    return {
        title: {
            text: 'Einsätze pro Jahr und Stichwort',
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
            right: 0,
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
        series: keys.map((k, idx) => ({
            name: k,            
            data: years.map(y => getDataForYear(getDataForReportKeyword(data, k), y).length),
            type: 'line'
        })),
    };
}