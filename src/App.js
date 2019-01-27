import React, { Component } from 'react';
import './assets/css/app.css';
import Calendar from './components/Calendar';
import Reason from './components/Reason';
import SubmitButton from './components/SubmitButton';
import LoadReportButton from './components/LoadReportButton';
import Preview from './components/Preview';
import Report from './components/Report';
import PageType from './PageType';
import * as actions from './actionTypes';
import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import moment from "moment";
import ReasonType from "./ReasonType";
import Logger from "./components/Logger";


class App extends Component {
    /*
    mailingList = "itay84@gmail.com";
    mailingListName = "Itay Gal";
    appUrl = "http://localhost:3002/";
    */
    timezone = "Asia/Jerusalem";
    
    
    appUrl = "https://www.itayg.com/tom/";
    mailingList = "Toluna-Office-Haifa@toluna.com";
    mailingListName = "Toluna Haifa";
    
    
    selectReason = (reasonType) => {
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
    
    toggleSubmit = (visible) => {
        this.props.tomActions.toggleSubmitAction(visible);
    };

    getQueryVariable = (variable) => {
        let query = window.location.hash;
        query = query.substring(1, query.length);
        let vars = query.split("&");
        for (let i=0;i<vars.length;i++) {
            let pair = vars[i].split("=");
            if(pair[0] === variable){return pair[1];}
        }
        return(false);
    };

    getCookie = (cname) => {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
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
            this.props.tomActions.togglePageAction(PageType.SEND_EVENT);
            return true;
        }
        return false;
    };
    
    processLoginAnswer = () => {
        const token = this.getQueryVariable("access_token");
        const expiresIn = this.getQueryVariable("expires_in");
        const returnedState = this.getQueryVariable("state");
        const stateToMatch = this.getCookie("myEventsState");
        if (token && stateToMatch && (stateToMatch === returnedState) && token !== localStorage.getItem('token')) {
            let cookie = token;
            if (expiresIn) {
                let now = new Date();
                let hourLater = new Date(now.getTime() + (expiresIn * 1000));
                cookie = token + ";expires=" + hourLater.toUTCString();
            }
            document.cookie = "myEventsCookie=" + cookie;
            const expiration = moment().add(expiresIn, "seconds").valueOf().toString();
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpirationDate', expiration);
            this.props.tomActions.loginAction(token, moment().add(expiresIn, "seconds"));
            this.props.tomActions.togglePageAction(PageType.SEND_EVENT);
            setTimeout(() => {
                this.getUserInfo();
                }, 10);
            
            return true;
        }
        return false;
    };
    
    login = () => {
        const clientId = "ddc9bc57-5764-4dea-b006-63e86db2a060";
        const redirectUrl = this.appUrl;
        const authServer = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?";
        const responseType = "token";
        const stateParam = Math.random() * new Date().getTime();
        document.cookie = "myEventsState=" + stateParam;

        const authUrl = authServer +
            "response_type=" + encodeURI(responseType) +
            "&client_id=" + encodeURI(clientId) +
            "&scope=" + encodeURI("https://outlook.office.com/User.Read https://outlook.office.com/User.ReadBasic.All https://outlook.office.com/Calendars.Read https://outlook.office.com/Calendars.Read.Shared  https://outlook.office.com/Calendars.ReadWrite https://outlook.office.com/Calendars.ReadWrite.Shared") +
            "&redirect_uri=" + redirectUrl +
            "&state=" + stateParam;
        window.location = authUrl;
    };
    
    processResults = (data) => {
        console.log(JSON.stringify(data));
    };

    getUserInfo = () => {
        const apiUrl = "https://outlook.office.com/api/v2.0/me";
        
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this.props.token
            },
            contentType: 'application/json'
        }).then((res) => res.json())
            .then(
            (data) => {
                this.props.tomActions.userDataAction(data.DisplayName);
                localStorage.setItem("name", data.DisplayName);
                console.log("User display name was set to " + data.DisplayName);
                this.processResults(data);
                const postData = {
                    username: data.DisplayName,
                    action: "Login",
                    success: true,
                    start: moment().format("YYYY-MM-DD"),
                    end: moment().format("YYYY-MM-DD")
                };
                Logger.log(postData);
            },
            (error) => {
                console.log("Could not get user info");
            }
        );
    };
    
    updateEvents = (events) => {
        this.props.tomActions.updateEventsAction(events);
    };

    createEvent = (startDate, endDate, subject, description) => {
        const startDateTime = moment(startDate).format("YYYY-MM-DD") + "T00:00";
        // end date should be 1 day later at 00:00 - for allDay event
        const endDateTime = moment(endDate).add(1, 'd').format("YYYY-MM-DD") + "T00:00";
     
        console.log("start " + startDate);
        console.log("end " + endDate);
        
        const apiUrl = "https://outlook.office.com/api/v2.0/me/events";
        const postData = {
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

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.props.token,
                'Content-Type':'application/json'
            },
            body: JSON.stringify(postData)
        }).then((res) => res.json())
            .then(
            (data) => {
                this.processResults(data);
                this.updateLoadingAnimationVisibility(false);
                const postData = {
                    username: this.props.name,
                    action: "Create Event",
                    success: true,
                    start: moment(startDate).format("YYYY-MM-DD"),
                    end: moment(endDate).format("YYYY-MM-DD")
                };
                Logger.log(postData);
            },
            (error) => {
                console.log("Could not create event");
                this.updateLoadingAnimationVisibility(false);
                const postData = {
                    username: this.props.name,
                    action: "Create Event",
                    success: false,
                    start: moment(startDate).format("YYYY-MM-DD"),
                    end: moment(endDate).format("YYYY-MM-DD")
                };
                Logger.log(postData);
            }
        );
    };
    
    togglePages = () => {
        let newPageType = PageType.SEND_EVENT;
        if (this.props.pageType === PageType.SEND_EVENT) {
            newPageType = PageType.REPORT;
            this.props.tomActions.reasonFormVisibilityAction(false);
            this.updateMessageContainerVisibility(false);
            this.selectReason(ReasonType.NONE);
        }  
        this.props.tomActions.togglePageAction(newPageType);
    };
    
    updateLoadingAnimationVisibility = (visible) => {
        this.props.tomActions.loadingAnimationChangeAction(visible);
    };

    updateReasonFormVisibility = (visible) => {
        this.props.tomActions.reasonFormVisibilityAction(visible);
    };

    updateMessageContainerVisibility = (visible) => {
        this.props.tomActions.messageContainerVisibilityAction(visible);
    };

    componentWillMount() {
        if (!this.isLoggedIn() && !this.processLoginAnswer()){
            this.login();
        }
    }
    
    render() {
        return (
            <Provider store={this.props.store}>
                <div className="app">
                    <div className="app-header">
                        <div><img src="https://www.itayg.com/tom/static/media/tom_logo.png" alt="TOM LOGO"/></div>
                        <div className="page-title">{this.props.pageType === PageType.REPORT ? PageType.REPORT.name : PageType.SEND_EVENT.name}</div>
                    </div>
                    {this.props.pageType === PageType.LOGIN ?
                        <div className="loading-page">
                            <img src="https://www.itayg.com/tom/static/media/tom_logo_sign.png" alt="loading" />
                        </div>
                        : null }
                    {this.props.pageType === PageType.SEND_EVENT ?
                    <div className="send-event-page">
                        <Reason 
                            selectReason={this.selectReason} 
                            deselectReason={this.deselectReason} 
                            description={this.props.description} 
                            descriptionChanged={this.descriptionChanged} 
                            toggleSubmit={this.toggleSubmit}
                            reasonFormVisible={this.props.reasonFormVisible}
                            messageContainerVisible={this.props.messageContainerVisible}
                            reasonType={this.props.reasonType}
                            updateReasonFormVisibility={this.updateReasonFormVisibility}
                            updateMessageContainerVisibility={this.updateMessageContainerVisibility} />
                        {this.props.reasonFormVisible ?
                        <Calendar selectStartDate={this.selectStartDate} selectEndDate={this.selectEndDate} pageType={this.props.pageType}  />
                            : null }
                        {this.props.reasonFormVisible ?
                        <Preview name={this.props.name} startDate={this.props.startDate} endDate={this.props.endDate} reasonType={this.props.reasonType} description={this.props.description} />
                            : null}
                        {this.props.showSubmit ?
                        <SubmitButton 
                            name={this.props.name} 
                            startDate={this.props.startDate} 
                            endDate={this.props.endDate} 
                            reasonType={this.props.reasonType} 
                            description={this.props.description} 
                            createEvent={this.createEvent} 
                            pageType={this.props.pageType}
                            showSubmit={this.props.showSubmit}
                            toggleSubmit={this.toggleSubmit}
                            updateLoadingAnimationVisibility={this.updateLoadingAnimationVisibility}
                            loadingAnimation={this.props.loadingAnimation} />
                            : null}
                    </div> 
                        : null }
                        
                    {this.props.pageType === PageType.REPORT ?
                    <div className="report-page">
                        <Calendar selectStartDate={this.selectStartDate} selectEndDate={this.selectEndDate} pageType={this.props.pageType} />
                        <LoadReportButton 
                            name={this.props.name} 
                            startDate={this.props.startDate} 
                            endDate={this.props.endDate} 
                            reasonType={this.props.reasonType} 
                            description={this.props.description} 
                            createEvent={this.createEvent} 
                            pageType={this.props.pageType} 
                            showSubmit={this.props.showSubmit}
                            toggleSubmit={this.toggleSubmit}
                            token={this.props.token}
                            updateEvents={this.updateEvents}
                            updateLoadingAnimationVisibility={this.updateLoadingAnimationVisibility}
                            loadingAnimation={this.props.loadingAnimation} />
                        <Report events={this.props.events} token={this.props.token} updateEvents={this.updateEvents} toggleSubmit={this.toggleSubmit} /> 
                    </div>
                        : null }
                    {this.props.pageType !== PageType.LOGIN ? 
                        <div className="toggle-page" onClick={() => this.togglePages()}>Go To {this.props.pageType === PageType.REPORT ? PageType.SEND_EVENT.name : PageType.REPORT.name}</div>
                        : null}
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
        tokenExpiration: state.tokenExpiration,
        events: state.events,
        pageType: state.pageType,
        showSubmit: state.showSubmit,
        loadingAnimation: state.loadingAnimation,
        reasonFormVisible: state.reasonFormVisible,
        messageContainerVisible: state.messageContainerVisible
    };
};

const mapDispatchToProps = (dispatch) => {
    return { tomActions: bindActionCreators(actions, dispatch) }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);