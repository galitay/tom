export const selectReasonAction = (reasonType) => ({
    type: 'SELECT_REASON',
    reasonType: reasonType
});


export const deselectReasonAction = () => ({
    type: 'DESELECT_REASON'
});


export const selectStartDateAction = (newStartDate) => ({
    type: 'SELECT_START_DATE',
    startDate: newStartDate
});

export const selectEndDateAction = (newEndDate) => ({
    type: 'SELECT_END_DATE',
    endDate: newEndDate
});

