export const loginAction = (token, expiration) => ({
    type: 'LOGIN',
    token: token,
    expiration: expiration
});

export const userDataAction = (name) => ({
    type: 'USER_DATA',
    name: name
});

export const selectReasonAction = (reasonType) => ({
    type: 'SELECT_REASON',
    reasonType: reasonType
});

export const deselectReasonAction = () => ({
    type: 'DESELECT_REASON'
});


export const descriptionChangedAction = (event) => ({
    type: 'DESCRIPTION_CHANGED',
    description: event.target.value
});


export const selectStartDateAction = (newStartDate) => ({
    type: 'SELECT_START_DATE',
    startDate: newStartDate
});

export const selectEndDateAction = (newEndDate) => ({
    type: 'SELECT_END_DATE',
    endDate: newEndDate
});

export const updateEventsAction = (events) => ({
    type: 'UPDATE_EVENTS',
    events: events
});

export const togglePageAction = (newPageType) => ({
    type: 'TOGGLE_PAGE',
    pageType: newPageType
});

export const toggleSubmitAction = (visible) => ({
    type: 'TOGGLE_SUBMIT',
    visible: visible
});

export const loadingAnimationChangeAction = (visible) => ({
    type: 'LOADING_ANIMATION_CHANGE',
    visible: visible
});

