import React, { Component } from 'react';
import './App.css';
import Calendar from './Calendar';
import Reason from './Reason';
import SubmitButton from './SubmitButton';
import Preview from './Preview';
import * as actions from './actionTypes';
import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import moment from "moment";
import $ from 'jquery';
import 'jquery-ui-bundle';


class App extends Component {
    mailingList = "itay84@gmail.com";
    mailingListName = "Itay Gal";
    timezone = "Asia/Jerusalem";
    appUrl = "http://localhost:3002/";
    // appUrl = "https://www.itayg.com/tom/";
    
    selectReason = (event, reasonType) => {
        this.props.tomActions.selectReasonAction(reasonType);
    };
    
    deselectReason = (event) => {
        this.props.tomActions.deselectReasonAction();
    };
    
    descriptionChanged = (event) => {
        this.props.tomActions.descriptionChangedAction(event);
    };

    selectStartDate = (startDate) => {
        this.props.tomActions.selectStartDateAction(startDate);  
    };

    selectEndDate = (endDate) => {
        this.props.tomActions.selectEndDateAction(endDate);
    };

    getQueryVariable = (variable) => {
        var query = window.location.hash;
        query = query.substring(1, query.length);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    };

    getCookie = (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
    
    isLoggedIn = () => {
        let token = localStorage.getItem('token');
        let tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
        let name = localStorage.getItem("name");
        if (token && name && tokenExpirationDate && tokenExpirationDate > moment()) {
            this.props.tomActions.userDataAction(name);
            this.props.tomActions.loginAction(token, tokenExpirationDate);
            console.log("User already logged in");
            return true;
        }
        return false;
    };
    
    processLoginAnswer = () => {
        var token = this.getQueryVariable("access_token"); // getHashParameterByName("access_token");
        var expiresIn = this.getQueryVariable("expires_in"); // getHashParameterByName("expires_in");
        var returnedState = this.getQueryVariable("state"); // getHashParameterByName("state");
        var stateToMatch = this.getCookie("myEventsState"); // getBrowserCookie("myEventsState"); //state parameter cookie
        if (token && stateToMatch && (stateToMatch == returnedState)) {
            var cookie = token;
            if (expiresIn) {
                var now = new Date();
                var hourLater = new Date(now.getTime() + (expiresIn * 1000));
                cookie = token + ";expires=" + hourLater.toUTCString();
            }
            document.cookie = "myEventsCookie=" + cookie;
            const expiration = moment().add(expiresIn, "seconds").valueOf().toString();
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpirationDate', expiration);
            this.props.tomActions.loginAction(token, moment().add(expiresIn, "seconds"));
            setTimeout(() => {
                this.getUserInfo();
                }, 10);
            
            return true;
        }
        return false;
    };
    
    login = () => {
        var clientId = "ddc9bc57-5764-4dea-b006-63e86db2a060";
        var redirectUrl = this.appUrl;
        var authServer = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?";
        var responseType = "token";
        var stateParam = Math.random() * new Date().getTime();
        document.cookie = "myEventsState=" + stateParam;

        var authUrl = authServer +
            "response_type=" + encodeURI(responseType) +
            "&client_id=" + encodeURI(clientId) +
            "&scope=" + encodeURI("https://outlook.office.com/User.Read https://outlook.office.com/User.ReadBasic.All https://outlook.office.com/Calendars.Read https://outlook.office.com/Calendars.Read.Shared  https://outlook.office.com/Calendars.ReadWrite https://outlook.office.com/Calendars.ReadWrite.Shared") +
            "&redirect_uri=" + redirectUrl +
            "&state=" + stateParam;
        window.location = authUrl;
    };

    getEvents = () => {
        var startDateTime = moment().startOf("day").format("YYYY-MM-DDTHH:mm");
        var endDateTime = moment().add(7, "days").endOf("day").format("YYYY-MM-DDTHH:mm");
        var apiUrl = "https://outlook.office.com/api/v2.0/me/calendarview?startdatetime=" + startDateTime + "&enddatetime=" + endDateTime + "&$top=" + 100;;

        $.ajax({
            type: 'GET',
            url: apiUrl,
            headers: {
                "Authorization": "Bearer " + this.props.token
            }
        }).done((data) => {
            this.processAllEvenets(data);
        }).fail(function (response) {
            console.log("Could not retrieve events");
        });
    };

    processAllEvenets = (data) => {
        debugger;
        let allEvents = data.value;
        for (var i = 0; i < allEvents.length; i++) {
            let event = allEvents[i];
            console.log("Organizer: " + event.Organizer.EmailAddress.Address + " - " + event.Subject);
        }
    };

    processResults = (data) => {
        console.log(JSON.stringify(data));
    };

    getUserInfo = () => {
        var apiUrl = "https://outlook.office.com/api/v2.0/me";
        $.ajax({
            type: 'GET',
            url: apiUrl,
            headers: {
                "Authorization": "Bearer " + this.props.token
            },
            contentType: 'application/json'
        }).done((data) => {
            this.props.tomActions.userDataAction(data.DisplayName);
            localStorage.setItem("name", data.DisplayName);
            console.log("User display name wat set to: " + data.DisplayName);
            this.processResults(data);
        }).fail(function (response) {
            console.log("Could not get user info");
        });
    };

    createEvent = (startDate, endDate, subject, description) => {
        var startDateTime = moment(startDate).format("YYYY-MM-DD") + "T00:00";
        // end date should be 1 day later at 00:00 - for allDay event
        var endDateTime = moment(endDate).add(1, 'd').format("YYYY-MM-DD") + "T00:00";
     
        console.log("start " + startDate);
        console.log("end " + endDate);
        
        var apiUrl = "https://outlook.office.com/api/v2.0/me/events";
        var postData = {
            "Subject": subject,
            "Body": {
                "ContentType": "HTML",
                "Content": description
            },
            "Attendees": [
                {
                    "EmailAddress":
                        {
                            "Address": this.mailingList,
                            "Name": this.mailingListName
                        }
                }
            ],
            "Start": {
                "DateTime": startDateTime,
                "TimeZone": this.timezone
            },
            "End": {
                "DateTime": endDateTime,
                "TimeZone": this.timezone
            },
            "IsReminderOn": false,
            "ShowAs": "free",
            "ResponseRequested": false,
            "IsAllDay": true,
        };

        $.ajax({
            type: 'POST',
            url: apiUrl,
            headers: {
                "Authorization": "Bearer " + this.props.token
            },
            contentType: 'application/json',
            data: JSON.stringify(postData)
        }).done((data) => {
            this.processResults(data);
        }).fail(function (response) {
            console.log("Could not create event");
        });
    };

    componentWillMount() {
        if (!this.isLoggedIn() && !this.processLoginAnswer()){
            this.login();
        }
        setTimeout(() => {
            this.getEvents();
        }, 10);
        
    }
    
    render() {
        return (
            <Provider store={this.props.store}>
                <div className="App">
                    <Reason selectReason={this.selectReason} deselectReason={this.deselectReason} description={this.props.description} descriptionChanged={this.descriptionChanged}/>
                    <Calendar selectStartDate={this.selectStartDate} selectEndDate={this.selectEndDate} />
                    <Preview name={this.props.name} startDate={this.props.startDate} endDate={this.props.endDate} reasonType={this.props.reasonType} description={this.props.description} />
                    <SubmitButton name={this.props.name} startDate={this.props.startDate} endDate={this.props.endDate} reasonType={this.props.reasonType} description={this.props.description} createEvent={this.createEvent} />
                </div>
            </Provider>
        );
    }
}

const mapStateToProps = (state) => {
    return { name: state.name,
        startDate: state.startDate, 
        endDate: state.endDate, 
        reasonType: state.reasonType, 
        description: state.description,
        token: state.token,
        tokenExpiration: state.tokenExpiration};
};

const mapDispatchToProps = (dispatch) => {
    return { tomActions: bindActionCreators(actions, dispatch) }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);