export function fireRunWeekdayTime(data) {
    const meta = {
        weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        weekdaysNumber: Array.from({
            length: 7
        }, (v, k) => k + 0),
        hours: Array.from({
            length: 24
        }, (v, k) => k + 0),
    }
    const arr = meta.weekdaysNumber.map(e => meta.hours.map(e => 0));
    data.forEach((d) => {
        const dObj = new Date(d.date);
        arr[dObj.getDay()][dObj.getHours()] += 1;
    })

    const punchCardData = arr.map((wd, wdi) => {
        return wd.map((h, hi) => {
            return [hi, wdi, h];
        })
    }).flat()
    return {
        title: {
            text: 'Alarmierungszeitpunkt'
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
                const cnt = params.value[2];
                const wd = meta.weekdays[params.value[1]];
                const hStart = params.value[0];
                const hEnd = params.value[0] + 1;
                return `${cnt} Einsätze, ${wd}s zwischen ${hStart} und ${hEnd}`
            }
        },
        grid: {
            left: 40,
            bottom: 45,
            right: 5,
            // containLabel: true
        },
        xAxis: {
            nameGap: 30,
            name: 'Stunde der Alarmierung',
            nameLocation: 'center',
            type: 'category',
            data: meta.hours,
            boundaryGap: false,
            splitLine: {
                show: true
            },
            axisLine: {
                show: false
            }
        },
        yAxis: {
            nameGap: 30,
            name: 'Wochentag der Alarmierung',
            nameLocation: 'center',
            type: 'category',
            data: meta.weekdays.map(e => e.substring(0,2).trim()),
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
            data: punchCardData,
            animationDelay: function (idx) {
                return idx * 5;
            }
        }]
    };
}