fetch("data.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const charts = {
            calender: {
                id: 'calender',
            },
            punchCard: {
                id: 'punchCard',
            },
            punchCardPolar: {
                id: 'punchCardPolar',
            },
            radarTypePerYear: {
                id: 'radarTypePerYear',
            },
            radarTypePerYear: {
                id: 'radarTypePerYear',
            },
            stackedBarPerYearAndType: {
                id: 'stackedBarPerYearAndType',
            }
        }
        Object.values(charts).forEach(c => {
            c.chart = echarts.init(document.getElementById(c.id));
        });

        // var myChart = echarts.init(document.getElementById('main'));
        // var punchCard = echarts.init(document.getElementById('punchCard'));
        // var punchCardRound = echarts.init(document.getElementById('punchCardRound'));
        // var radarTypeChart = echarts.init(document.getElementById('radarTypePerYear'));

        const minYear = Math.min(...data.map(e => new Date(e.date).getFullYear()))
        const maxYear = Math.max(...data.map(e => new Date(e.date).getFullYear()))
        const years = Array.from({
            length: maxYear - minYear + 1
        }, (v, k) => k + minYear);

        const unqiqueCategories = data
            .map(e => e.category)
            .filter((item, i, ar) => ar.indexOf(item) === i)
            .filter(e => e.indexOf('images/'));

        const unqiqueAlertType = data
            .map(e => e.alertType)
            .filter((item, i, ar) => ar.indexOf(item) === i);

        const uniqueType = data
            .map(e => e.type.replace())
            .filter((item, i, ar) => ar.indexOf(item) === i)
            .sort();

        const uniqueTypeCat = data
            .map(e => e.typeCat)
            .filter((item, i, ar) => ar.indexOf(item) === i)
            .sort();

        const uniqueReport = data
            .map(e => e.report)
            .filter((item, i, ar) => ar.indexOf(item) === i)
            .sort();
        debugger
        // specify chart configuration item and data

        function getDataPerYear(year) {
            return data
                .filter(e => new Date(e.date).getFullYear() === year)
                .map(e => [echarts.format.formatTime('yyyy-MM-dd', e.date), 1])
        }

        function getTypeCntPerYear(year) {
            const cnt = new Array(uniqueType.length).fill(0);
            data
                .filter(e => new Date(e.date).getFullYear() === year)
                .forEach((e) => {
                    cnt[uniqueType.indexOf(e.type)] += 1;
                })
            return cnt;
        }

        function getTypeCntTypeYear() {
            const arr = uniqueType.map(e => years.map(e => 0));
            data
                .forEach((e) => {
                    arr[uniqueType.indexOf(e.type)][years.indexOf(new Date(e.date).getFullYear())] += 1;
                })
            debugger;
            return arr;
        }

        console.log(uniqueType)
        charts.radarTypePerYear.option = {
            title: {
                text: 'Verteilung der Einsätze im Jahresvergleich'
            },
            legend: {
                data: years,
                top: 35,
            },
            tooltip: {},
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: uniqueType.map(e => ({
                    name: e
                })),

            },
            series: years.map(y => ({
                name: y,
                type: 'radar',
                data: [{
                    value: getTypeCntPerYear(y),
                    name: y
                }, ]
            }))
        };

        const punchCardMetaData = {
            weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            weekdaysNumber: Array.from({
                length: 7
            }, (v, k) => k + 0),
            hours: Array.from({
                length: 24
            }, (v, k) => k + 0),
        }
        const arr = punchCardMetaData.weekdaysNumber.map(e => punchCardMetaData.hours.map(e => 0));
        data.forEach((d) => {
            const dObj = new Date(d.date);
            arr[dObj.getDay()][dObj.getHours()] += 1;
        })

        const punchCardDate = arr.map((wd, wdi) => {
            return wd.map((h, hi) => {
                return [hi, wdi, h];
            })
        }).flat()

        charts.calender.option = {
            tooltip: {
                position: 'top'
            },
            calendar: years.map((y, idx) => ({
                top: idx * 90,
                range: y,
                cellSize: [10, 10],
            })),
            series: years.map((y, idx) => ({
                color: (param) => {
                    debugger
                    return 'red'
                },
                type: 'heatmap',
                coordinateSystem: 'calendar',
                calendarIndex: idx,
                data: getDataPerYear(y)
            })),
        };

        charts.punchCard.option = {
            title: {
                text: 'Anzahl Alarmierungen je Wochentag und Uhrzeit'
            },
            tooltip: {
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                },
                position: 'top',
                formatter: function (params) {
                    debugger;
                    const cnt = params.value[2];
                    const wd = punchCardMetaData.weekdays[params.value[1]];
                    const hStart = params.value[0];
                    const hEnd = params.value[0] + 1;
                    return `${cnt} Einsätze, ${wd}s zwischen ${hStart} und ${hEnd}`
                }
            },
            grid: {
                left: 35,
                bottom: 35,
                right: 5,
                containLabel: true
            },
            xAxis: {
                nameGap: 30,
                name: 'Stunde der Alarmierung',
                nameLocation: 'center',
                type: 'category',
                data: punchCardMetaData.hours,
                boundaryGap: false,
                splitLine: {
                    show: true
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                nameGap: 10,
                name: 'Wochentag der Alarmierung',
                nameLocation: 'end',
                type: 'category',
                data: punchCardMetaData.weekdays,
                axisLine: {
                    show: false
                }
            },
            series: [{
                name: 'Punch Card',
                type: 'scatter',
                symbolSize: function (val) {
                    return val[2] * 2;
                },
                data: punchCardDate,
                animationDelay: function (idx) {
                    return idx * 5;
                }
            }]
        };

        charts.punchCardPolar.option = {
            title: {
                text: 'Anzahl Alarmierungen je Wochentag und Uhrzeit'
            },
            polar: {},
            tooltip: {
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                },
                formatter: function (params) {
                    debugger;
                    const cnt = params.value[2];
                    const wd = punchCardMetaData.weekdays[params.value[0]];
                    const hStart = params.value[1];
                    const hEnd = params.value[1] + 1;
                    return `${cnt} Einsätze, ${wd}s zwischen ${hStart} und ${hEnd}`
                }
            },
            angleAxis: {
                type: 'category',
                data: punchCardMetaData.hours,
                boundaryGap: false,
                splitLine: {
                    show: true
                },
                axisLine: {
                    show: false
                }
            },
            radiusAxis: {
                type: 'category',
                data: punchCardMetaData.weekdays,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    rotate: 45
                }
            },
            series: [{
                name: 'Punch Card',
                type: 'scatter',
                coordinateSystem: 'polar',
                symbolSize: function (val) {
                    return val[2] * 2;
                },
                data: punchCardDate.map(e => [e[1], e[0], e[2]]),
                animationDelay: function (idx) {
                    return idx * 5;
                }
            }]
        };

        charts.stackedBarPerYearAndType.option = {
            legend: {
                data: uniqueType,
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

        // use configuration item and data specified to show chart
        Object.values(charts).forEach(e => {
            e.chart.setOption(e.option)
        })
        // myChart.setOption(option);
        // punchCard.setOption(punchCardOption)
        // punchCardRound.setOption(punchCardRoundOption)
        // radarTypeChart.setOption(radarTypeOption);

        window.addEventListener('resize', () => {
            Object.values(charts).forEach(e => {
                e.chart.resize();
            })
        });
    });