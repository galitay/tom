import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, compose, applyMiddleware } from 'redux';
import soldier from './soldier.png';
import baby from './baby.png';
import vacation from './vacation.png';
import early from './early.png';
import sick from './sick.png';
import moment from "moment";

export const ReasonType = {
    NONE: {id: 0, name: "N/A", image: "none"},
    VACATION: {id: 1, name: "Vacation", image: {vacation}},
    SICK: {id: 2, name: "Sick", image: {sick}},
    SICK_CHILD: {id: 3, name: "Sick Child", image: {baby}},
    RESERVE_DUTY: {id: 4, name: "Reserve Duty", image : {soldier}},
    LEAVING_EARLY: {id: 5, name: "Leaving Early", image: {early}}
};

const initialData = {
    reasonType: ReasonType.NONE,
    description: "",
    name: "Itay Gal",
    startDate: moment(),
    endDate: moment()
};

const tomReducer = (state, action) => {
    switch (action.type) {
        case 'SELECT_REASON':
            console.log("selected reason id: " + action.reasonType.id);
            return {...state, reasonType: action.reasonType};
        case 'DESELECT_REASON':
            return {...state, reasonType: ReasonType.NONE};
        case 'SELECT_START_DATE':
            console.log("Current selected start date is: " + moment(action.startDate).format("YYYY-MM-DD"));
            return{...state, startDate: action.startDate};
        case 'SELECT_END_DATE':
            console.log("Current selected end date is: " + moment(action.endDate).format("YYYY-MM-DD"));
            return{...state, endDate: action.endDate};
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

// registerServiceWorker();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
