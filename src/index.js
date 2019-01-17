import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, compose, applyMiddleware } from 'redux';

export const ReasonType = {
    NONE: {id: 0, name: "None", image: "none"},
    VACATION: {id: 1, name: "Vacation", image: "vacation"},
    SICK: {id: 2, name: "Sick"},
    SICK_CHILD: {id: 3, name: "Sick Child"},
    RESERVE_DUTY: {id: 4, name: "Reserve Duty"},
    LEAVING_EARLY: {id: 5, name: "Leaving Early"}
};

const initialData = {reasonTypeId: ReasonType.NONE.id, description: "", name: "Itay Gal"};

const tomReducer = (state, action) => {
    switch (action.type) {
        case 'SELECT_REASON':
            console.log("selected reason id: " + action.reasonTypeId);
            return {...state, reasonTypeId: action.reasonTypeId};
        case 'DESELECT_REASON':
            return {...state, reasonType: ReasonType.NONE};
        case 'SELECT_START_DATE':
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
