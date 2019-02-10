import React from 'react';
import ReasonType from './../ReasonType';
import './../assets/css/report.css';
import moment from "moment";
import PageType from "../PageType";

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
                                            <div className={event.reason === ReasonType.NONE ? "reason-label-unknown" : "reason-label"}>{event.reason.name}</div>
                                            {event.halfDay ?
                                            <div className="half-day">½</div>
                                                : null }
                                            <div>{moment(event.start).format("DD.MM.YY")} {moment(event.end).subtract(1, "days").isSameOrBefore(moment(event.start), "day") ? "" : " - " + moment(event.end).subtract(1, "days").format("DD.MM.YY")}</div> 
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