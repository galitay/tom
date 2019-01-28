import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import PageType from './PageType';
import ReasonType from './ReasonType';
import * as serviceWorker from './serviceWorker';
import { createStore, compose, applyMiddleware } from 'redux';
import moment from "moment";

const initialData = {
    reasonType: ReasonType.NONE,
    description: "",
    name: "John Doe",
    startDate: moment(),
    endDate: moment(),
    token: "",
    tokenExpiration: "",
    events: {},
    pageType: PageType.LOGIN,
    showSubmit: false,
    loadingAnimation: false,
    reasonFormVisible: false,
    messageContainerVisible: false,
};

const tomReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {...state, token: action.token, tokenExpiration: action.expiration};
        case 'USER_DATA':
            return {...state, name: action.name};
        case 'SELECT_REASON':
            return {...state, reasonType: action.reasonType};
        case 'DESELECT_REASON':
            return {...state, reasonType: ReasonType.NONE};
        case 'DESCRIPTION_CHANGED':
            return {...state, description: action.description};
        case 'SELECT_START_DATE':
            console.log("Current selected start date is: " + moment(action.startDate).format("YYYY-MM-DD"));
            return {...state, startDate: action.startDate};
        case 'SELECT_END_DATE':
            console.log("Current selected end date is: " + moment(action.endDate).format("YYYY-MM-DD"));
            return {...state, endDate: action.endDate};
        case 'UPDATE_EVENTS':
            return {...state, events: action.events};
        case 'TOGGLE_PAGE':
            return {...state, pageType: action.pageType};
        case 'TOGGLE_SUBMIT':
            return {...state, showSubmit: action.visible};
        case 'LOADING_ANIMATION_CHANGE':
            return {...state, loadingAnimation: action.visible};
        case 'REASON_FORM_VISIBILITY':
            return {...state, reasonFormVisible: action.visible};
        case 'MESSAGE_CONTAINER_VISIBILITY':
            return {...state, messageContainerVisible: action.visible};
        default:
            return state;
    }
};

const store = createStore(tomReducer, initialData, compose(
    applyMiddleware(...[]),
    window.devToolsExtension ? window.devToolsExtension() : f => f // add support for Redux dev tools
    )
);

ReactDOM.render(
    <App store={store} />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();