import {
    getUnique
} from '../util.js';

import {
    types,
    typeColors,
    NELZ,
} from '../constants.js'

function getUniqueVehicles(data) {
    return getUnique(data.map(e => e.vehicles).flat(), (e => e.name));
}

function getUniqueVehiclesNelz(data) {
    return getUnique(data.map(e => e.vehicles).flat().filter(e => e.departmentName === NELZ), (e => e.name));
}

function getUniqueDepartments(data) {
    return getUnique(data.map(e => e.vehicles).flat(), (e => e.departmentName));
}

export function vehiclesBarChart(data) {
    // const uniqueVehicles = getUniqueVehicles(data);
    const uniqueVehiclesNelz = getUniqueVehiclesNelz(data);
    // const uniqueDepartments = getUniqueDepartments(data);

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {
            data: types,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: uniqueVehiclesNelz,
        },
        series: types.map((type, idx) => {
            const sd = Array(uniqueVehiclesNelz.length).fill(0);
            const dataForType = data.filter(e => e.type === type);
            dataForType.map(e => e.vehicles).flat().forEach(e => {
                if(e.departmentName !== NELZ) return
                sd[uniqueVehiclesNelz.indexOf(e.name)] += 1;                
            })            
            return {
                name: type,
                type: 'bar',
                stack: 'total',
                color: typeColors[idx],
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: sd,
            }
        })


    };

    debugger;
}