import React from 'react';
import './../assets/css/report.css';
import $ from 'jquery';
import 'jquery-ui-bundle';
import moment from "moment";
import {ReasonType} from "./../index";

export default class Report extends React.Component {

    componentWillMount(){
        this.props.toggleSubmit(true);
    }
    
    render() {
        return (
            <div className="report-container">
                <div className="employees-container">
                    {
                        Object.keys(this.props.events).map((employeeKey) => {
                            return <div className="employee-container">
                                <div>{this.props.events[employeeKey][0].organizerName}</div>
                                <div className="employee-events">
                                    {this.props.events[employeeKey].map((event) => {
                                        return <div key="1" className="event-container">
                                            {event.subject} 
                                        </div>
                                    })}
                                </div>
                            </div>;
                        })
                    }
                </div>
            </div>
        )
    }
}