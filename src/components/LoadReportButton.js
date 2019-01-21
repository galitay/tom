import React from 'react';
import './../assets/css/submitButton.css';
import SubmitButton from './SubmitButton';
import $ from 'jquery';
import 'jquery-ui-bundle';
import moment from "moment";
import {ReasonType} from "../index";

export default class LoadReportButton extends SubmitButton {
    
    onclickAction = () => {
        console.log("Loading reports");
        const start = moment("2018-12-01").startOf("day").format("YYYY-MM-DDTHH:mm");
        const end = moment("2019-01-01").startOf("day").format("YYYY-MM-DDTHH:mm");
        this.getEvents(start, end);
    };

    getEvents = (startDateTime, endDateTime) => {
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

    processAllEvents = (data) => {
        let allEvents = data.value;
        let eventsData = {};

        for (var i = 0; i < allEvents.length; i++) {
            let event = allEvents[i];
            const email = event.Organizer.EmailAddress.Address;
            const eventEntry = {
                "id": event.Id,
                "organizerName": event.Organizer.EmailAddress.Name,
                "subject": event.Subject,
                "start": event.Start.DateTime,
                "end": event.End.DateTime,
                "reason": this.extractReasonFromSubject(event.Subject)
            };
            if (!eventsData[email]){
                eventsData[email] = [];
            }
            eventsData[email].push(eventEntry);
            console.log("Organizer: " + email + " - " + event.Subject);
        }
        this.props.updateEvents(eventsData);
    };

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
        if (subject.includes("wfh") || subject.includes("home")){
            return ReasonType.WFH
        }
        return ReasonType.NONE;
    }

}