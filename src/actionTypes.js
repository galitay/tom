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

/*export const reasonSelectAction = (id) => ({
    type: 'REASON_SELECT',
    id: id
});*/

export const reasonFormVisibilityAction = (visible) => ({
    type: 'REASON_FORM_VISIBILITY',
    visible: visible
});

export const messageContainerVisibilityAction = (visible) => ({
    type: 'MESSAGE_CONTAINER_VISIBILITY',
    visible: visible
});

export const toggleHalfDayAction = (halfDay) => ({
   type: 'TOGGLE_HALF_DAY',
   halfDay: halfDay 
});

export const titleSuffixChangeAction = (titleSuffix) => ({
    type: 'TITLE_SUFFIX_CHANGED',
    titleSuffix: titleSuffix
});

export const modalToggleAction = (isModal, message) => ({
    type: 'MODAL_TOGGLE',
    isModal: isModal,
    modalMessage: message
});

export const countdownAction = (timeLeft) => ({
    type: 'COUNTDOWN',
    modalCountdown: timeLeft
});


