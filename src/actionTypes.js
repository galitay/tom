export const selectReasonAction = (id) => ({
    type: 'SELECT_REASON',
    reasonTypeId: id
});


export const deselectReasonAction = () => ({
    type: 'DESELECT_REASON'
});


export const selectStartDateAction = (yearVal, monthVal, dayVal) => ({
    type: 'SELECT_START_DATE',
    year: yearVal,
    month: monthVal,
    day: dayVal
});