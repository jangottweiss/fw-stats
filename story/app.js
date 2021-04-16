import {
    typeColors,
    types,
    yearColors
} from './constants.js';

import {
    getUnique,
    getDataForYear,
} from './util.js';

import {
    fireRunsPerYearConfig,
    fireRunsPerTypeYearConfig,
} from './charts/fireRunsPerYear.js';

import {
    fireRunWeekdayTime,
} from './charts/punchCard.js'

const charts = {
    fireRunsPerYear: {
        id: 'fireRunsPerYear',
    },
    fireRunsPerTypeYear: {
        id: 'fireRunsPerTypeYear',
    },
    fireRunWeekdayTime: {
        id: 'fireRunWeekdayTime',
    }
};


function loadData() {
    return new Promise((resolve, reject) => {
        fetch("data.json")
            .then(response => response.json())
            .then((data) => {
                resolve(data.map((e) => {
                    e.date = new Date(e.date);
                    return e;
                }));
            })
            .catch(reject);
    });
}

async function buildPage() {
    const data = await loadData();
    const years = getUnique(data, (e => e.date.getFullYear()), true);

    charts.fireRunsPerYear.config = fireRunsPerYearConfig(data, years);
    charts.fireRunsPerTypeYear.config = fireRunsPerTypeYearConfig(data, years); 
    charts.fireRunWeekdayTime.config = fireRunWeekdayTime(data);

    for (const key in charts) {
        if (Object.hasOwnProperty.call(charts, key)) {
            charts[key].chart = echarts.init(document.getElementById(charts[key].id));
            charts[key].chart.setOption(charts[key].config); 
        }
    }

    
    
    
}

buildPage();

window.addEventListener('resize', () => {
    Object.values(charts).forEach(e => {
        e.chart.resize();
    })
});