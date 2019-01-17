import React, { Component } from 'react';
import './App.css';
import Calendar from './Calendar';
import Reason from './Reason';
import SubmitButton from './SubmitButton';
import * as actions from './actionTypes';
import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import Preview from './Preview';

class App extends Component {
    selectReason = (event, reasonType) => {
        this.props.tomActions.selectReasonAction(reasonType);
    };
    
    deselectReason = (event) => {
        this.props.tomActions.deselectReasonAction();
    };

    selectStartDate = (startDate) => {
        this.props.tomActions.selectStartDateAction(startDate);  
    };

    selectEndDate = (endDate) => {
        this.props.tomActions.selectEndDateAction(endDate);
    };
    
    render() {
        return (
            <Provider store={this.props.store}>
                <div className="App">
                    <Reason selectReason={this.selectReason} deselectReason={this.deselectReason} />
                    <Calendar selectStartDate={this.selectStartDate} selectEndDate={this.selectEndDate} />
                    <Preview startDate={this.props.startDate} endDate={this.props.endDate} reasonType={this.props.reasonType}/>
                    <SubmitButton />
                </div>
            </Provider>
        );
    }
}

const mapStateToProps = (state) => {
    return { startDate: state.startDate, endDate: state.endDate, reasonType: state.reasonType};
};

const mapDispatchToProps = (dispatch) => {
    return { tomActions: bindActionCreators(actions, dispatch) }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);