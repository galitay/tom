import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, compose, applyMiddleware } from 'redux';

const reasonsData = [{id: 1, name: "Vacation"},
                {id: 2, name: "Sick"},
                {id: 3, name: "Sick Child"},
                {id: 4, name: "Reserve Duty"},
                {id: 5, name: "Leaving Early"}];

const initialData = {reasons: reasonsData};

const tomReducer = (state, action) => {
    switch (action.type) {
        case 'SELECT_REASON':
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
