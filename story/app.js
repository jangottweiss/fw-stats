import {
    typeColors,
    types,
    yearColors
} from './constants.js';

import {
    getUnique,
    getDataForYear,
    getDataForReportKeyword
} from './util.js';

import {
    fireRunsPerYearConfig,
    fireRunsPerTypeYearConfig,
} from './charts/fireRunsPerYear.js';

import {
    fireRunWeekdayTime,
} from './charts/punchCard.js';

import {
    fireRunCalender
} from './charts/calender.js';

import {
    fireRunReportKeyWord
} from './charts/reportKeyWord.js';

import {
    typeKeywordTree
} from './charts/keywordTree.js';

const charts = {
    fireRunsPerYear: {
        id: 'fireRunsPerYear',
    },
    fireRunsPerTypeYear: {
        id: 'fireRunsPerTypeYear',
    },
    fireRunWeekdayTime: {
        id: 'fireRunWeekdayTime',
    },
    fireRunCalender: {
        id: 'fireRunCalender',
    },
    fireRunReportKeyWord: {
        id: 'fireRunReportKeyWord',
    },
    typeKeywordTree: {
        id: 'typeKeywordTree',
    }
};


function loadData() {
    return new Promise((resolve, reject) => {
        fetch("data.json")
            .then(response => response.json())
            .then((data) => {
                resolve(data.map((e) => {
                    e.date = new Date(e.dateStr);
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
    charts.fireRunCalender.config = fireRunCalender(data, years); 
    charts.fireRunReportKeyWord.config = fireRunReportKeyWord(data, years);
    charts.typeKeywordTree.config = typeKeywordTree(data);

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

window.addEventListener(
    "scroll",
    function() {
      const scrollTop =
        document.documentElement["scrollTop"] || document.body["scrollTop"];
      const scrollBottom =
        (document.documentElement["scrollHeight"] ||
          document.body["scrollHeight"]) - document.documentElement.clientHeight;
      const scrollPercent = scrollTop / scrollBottom * 100 + "%";
      document
        .getElementById("_progress")
        .style.setProperty("--scroll", scrollPercent);
    },
    { passive: true }
  );