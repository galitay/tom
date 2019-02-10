import './../assets/css/submitButton.css';
import SubmitButton from './SubmitButton';
import moment from "moment";
import ReasonType from './../ReasonType';
import Logger from './Logger';

export default class LoadReportButton extends SubmitButton {
    
    onclickAction = () => {
        console.log("Loading reports");
        const start = moment(this.props.startDate).startOf("day").format("YYYY-MM-DDTHH:mm:ss");
        const end = moment(this.props.endDate).startOf("day").format("YYYY-MM-DDTHH:mm:ss");
        this.getEvents(start, end);
    };

    getEvents = (startDateTime, endDateTime) => {
        if (this.props.isTokenExpired()){
            this.props.login();
        }
        
        var apiUrl = "https://outlook.office.com/api/v2.0/me/calendarview?startdatetime=" + startDateTime + "&enddatetime=" + endDateTime + "&$top=" + 10000;

        fetch(apiUrl,{
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this.props.token
            }
        }).then((res) => res.json())
            .then(
            (data) => {
                this.processAllEvents(data);
                this.props.updateLoadingAnimationVisibility(false);
                const postData = {
                    username: this.props.name,
                    action: "Load Report",
                    success: true,
                    start: moment(startDateTime).format("YYYY-MM-DD"),
                    end: moment(endDateTime).format("YYYY-MM-DD")
                };
                Logger.log(postData);
            },
            (error) => {
                console.log("Could not retrieve events");
                this.props.updateLoadingAnimationVisibility(false);
                const postData = {
                    username: this.props.name,
                    action: "Load Report",
                    success: false,
                    start: moment(startDateTime).format("YYYY-MM-DD"),
                    end: moment(endDateTime).format("YYYY-MM-DD")
                };
                Logger.log(postData);
            });
    };

    processAllEvents = (data) => {
        let allEvents = data.value;
        let eventsData = {};

        for (var i = 0; i < allEvents.length; i++) {
            let event = allEvents[i];
            
            // filter out of scope events because of query date limitation
            // console.log("event end " + moment(event.End.DateTime).startOf("day").format("YYYY-MM-DDTHH:mm:ss") + " - start selected " +  moment(this.props.startDate).startOf("day").format("YYYY-MM-DDTHH:mm:ss"));
            if (moment(event.End.DateTime).startOf("day") <= moment(this.props.startDate).startOf("day")) {
                console.log("filtered: start at " + event.Start.DateTime + " until " + event.End.DateTime);
                continue;
            }
            
            const email = event.Organizer.EmailAddress.Address;
            const eventEntry = {
                "id": event.Id,
                "organizerName": event.Organizer.EmailAddress.Name,
                "subject": event.Subject,
                "start": event.Start.DateTime,
                "end": event.End.DateTime,
                "reason": this.extractReasonFromSubject(event.Subject),
                "halfDay": this.isHalfDay(event.Subject)
            };
            if (!eventsData[email]){
                eventsData[email] = [];
            }
            eventsData[email].push(eventEntry);
            console.log("Organizer: " + email + " - " + event.Subject);
        }
        this.props.updateEvents(eventsData);
    };
    
    isHalfDay(subject){
        return subject.toLowerCase().includes("half");
    }
    
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
        if (subject.includes("leaving") || subject.includes("leave")){
            return ReasonType.LEAVING_EARLY
        }
        if (subject.includes("vacation") || subject.includes("pto") || subject.includes("day off")){
            return ReasonType.VACATION
        }
        if (subject.includes("wfh") || subject.includes("home")){
            return ReasonType.WFH
        }
        if (subject.includes("arriving") || subject.includes("late")){
            return ReasonType.ARRIVING_LATE
        }
        return ReasonType.NONE;
    }

}