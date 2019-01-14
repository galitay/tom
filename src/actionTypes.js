export const selectReasonAction = (id) => ({
    type: 'SELECT_REASON',
    reasonType: id
});


export const deselectReasonAction = (id) => ({
    type: 'DESELECT_REASON',
    reasonType: id
});


export const selectStartDataAction = (yearVal, monthVal, dayVal) => ({
    type: 'SELECT_START_DATE',
    year: yearVal,
    month: monthVal,
    day: dayVal
});