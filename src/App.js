import React, { Component } from 'react';
import './App.css';
import Calendar from './Calendar';
import Reason from './Reason';
import SubmitButton from './SubmitButton';
import * as actions from './actionTypes';
import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';

class App extends Component {
    selectReason = (event, id) => {
        if (event === undefined){
            return;
        }
        this.props.tomActions.selectReasonAction(id);
    };
    
    render() {
        return (
            <Provider store={this.props.store}>
                <div className="App">
                    <Reason selectReason={this.selectReason} />
                    <Calendar />
                    <SubmitButton />
                </div>
            </Provider>
        );
    }
}

const mapStateToProps = (state) => {
    return { reasons: state.reasons};
};

const mapDispatchToProps = (dispatch) => {
    return { tomActions: bindActionCreators(actions, dispatch) }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);