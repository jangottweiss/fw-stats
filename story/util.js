export function getUnique(arr, getter, sort = false) {
    const data = arr
        .map(e => getter(e))
        .filter((item, i, ar) => ar.indexOf(item) === i);

    if (!sort) return data;
    if (typeof sort === 'function') return data.sort(sort);
    return data.sort();
}

export function getDataForYear(data, year) {
    return data
        .filter(e => new Date(e.date).getFullYear() === year);
}

export function getDataForReportKeyword(data, key) {
    return data
        .filter(e => e.report.toLowerCase().includes(key.toLowerCase()))
}