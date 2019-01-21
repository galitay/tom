import React from 'react';
import './report.css';
import $ from 'jquery';
import 'jquery-ui-bundle';
import moment from "moment";
import {ReasonType} from "./index";

export default class Report extends React.Component {
    
    extractReasonFromSubject(subject){
        subject = subject.toLowerCase();
        if (subject.includes("sick") && subject.includes("child")){
            return ReasonType.SICK_CHILD
        }
        if (subject.includes("sick") && !subject.includes("child")){
            return ReasonType.SICK
        }
        if (subject.includes("reserve") && subject.includes("duty")){
            return ReasonType.RESERVE_DUTY
        }
        if (subject.includes("leaving")){
            return ReasonType.LEAVING_EARLY
        }
        if (subject.includes("vacation") || subject.includes("pto") || subject.includes("day off")){
            return ReasonType.VACATION
        }
        return ReasonType.NONE;
    }

    processAllEvents = (data) => {
        let allEvents = data.value;
        let eventsData = {};

        for (var i = 0; i < allEvents.length; i++) {
            let event = allEvents[i];
            const email = event.Organizer.EmailAddress.Address;
            const eventEntry = {
                "organizerName": event.Organizer.EmailAddress.Name,
                "subject": event.Subject,
                "start": event.Start.DateTime,
                "end": event.End.DateTime,
                "reason": this.extractReasonFromSubject(event.Subject)
            };
            if (!eventsData[email]){
                eventsData[email] = [];
            }
            // Object.assign(eventsData[email], {eventEntry});
            eventsData[email].push(eventEntry);
            console.log("Organizer: " + email + " - " + event.Subject);
        }
        this.props.updateEvents(eventsData);
    };

    getEvents = (startDateTime, endDateTime) => {
        // var startDateTime = moment().startOf("day").format("YYYY-MM-DDTHH:mm");
        // var endDateTime = moment().add(7, "days").endOf("day").format("YYYY-MM-DDTHH:mm");
        var apiUrl = "https://outlook.office.com/api/v2.0/me/calendarview?startdatetime=" + startDateTime + "&enddatetime=" + endDateTime + "&$top=" + 10000;

        $.ajax({
            type: 'GET',
            url: apiUrl,
            headers: {
                "Authorization": "Bearer " + this.props.token
            }
        }).done((data) => {
            this.processAllEvents(data);
        }).fail(function (response) {
            console.log("Could not retrieve events");
        });
    };
    
    loadReport = () => {
        console.log("Loading reports");
        const start = moment("2018-12-01").startOf("day").format("YYYY-MM-DDTHH:mm");
        const end = moment("2019-01-01").startOf("day").format("YYYY-MM-DDTHH:mm");
        this.getEvents(start, end);  
    };
    
    render() {
        return (
            <div className="report-container">
                <div className="load-report" onClick={this.loadReport}>Load Report</div>
                <div className="employees-container">
                    {
                        Object.keys(this.props.events).map((employeeKey) => {
                            return <div className="employee-container">
                                <div>{this.props.events[employeeKey][0].organizerName}</div>
                                <div className="employee-events">
                                    {this.props.events[employeeKey].map((event) => {
                                        return <div className="event-container">
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