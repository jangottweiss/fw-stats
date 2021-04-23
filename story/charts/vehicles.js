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
function getUniqueDepartmentDescription(data) {
    return getUnique(data.map(e => e.vehicles).flat(), (e => e.departmentDescription));
}

export function vehiclesBarChart(data) {
    const uniqueVehiclesNelz = getUniqueVehiclesNelz(data);

    return {
        title: {
            text: `Eingesetzte Fahrzeuge - ${NELZ}`
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {
            data: types,
            top: 30,
        },
        grid: {
            left: 80,
            bottom: 25,
            top: 120,
            right: 0,
            containLabel: false,
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
                if (e.departmentName !== NELZ) return
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
}

export function departmentsBarChart(data) {
    
    // const uniqueDepartments = getUniqueDepartments(data);
    // const uniqueDepartmentDescription = getUniqueDepartmentDescription(data);
    const deps = ['Rettungsdienst', 'Polizei', 'Abt. Mosbach-Stadt', NELZ];
    debugger;
    return {
        title: {
            text: `Alarmierte Kräfte`
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {
            data: types,
            top: 30,
        },
        grid: {
            left: 155,
            bottom: 25,
            top: 120,
            right: 0,
            containLabel: false,
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: deps,
        },
        series: types.map((type, idx) => {
            const sd = Array(deps.length).fill(0);
            const dataForType = data.filter(e => e.type === type);
            dataForType.forEach(e => {
                if(e.vehicles.find(k => k.departmentName === deps[0])) sd[0] += 1
                if(e.vehicles.find(k => k.name === 'Streifenwagen')) sd[1] += 1
                if(e.vehicles.find(k => k.departmentName === deps[2])) sd[2] += 1
                if(e.vehicles.find(k => k.departmentName === deps[3])) sd[3] += 1
            })
            // dataForType.map(e => e.vehicles).flat().forEach(e => {
            //     if (e.departmentName !== NELZ) return
            //     sd[uniqueVehiclesNelz.indexOf(e.name)] += 1;
            // })
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
}