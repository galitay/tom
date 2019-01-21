import React from 'react';
import './../assets/css/report.css';
import 'jquery-ui-bundle';
import moment from "moment";

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
                            return <div key={employeeKey} className="employee-container">
                                <div className="employee-name">{this.props.events[employeeKey][0].organizerName}</div>
                                <div className="employee-events">
                                    {this.props.events[employeeKey].map((event) => {
                                        return <div key={event.id} className="event-container" title={event.subject}>
                                            <div className="reason-label">{event.reason.name}</div>
                                            <div>{moment(event.start).format("DD.MM.YY")} {moment(event.start).add(1, "days").format("DD.MM.YY") !== moment(event.end).format("DD.MM.YY") ? " - " + moment(event.end).format("DD.MM.YY") : ""}</div> 
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