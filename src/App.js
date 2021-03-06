import React, { Component } from 'react';
import './assets/css/app.css';
import Calendar from './components/Calendar';
import Reason from './components/Reason';
import SubmitButton from './components/SubmitButton';
import AdvancedOptions from './components/AdvancedOptions';
import LoadReportButton from './components/LoadReportButton';
import Preview from './components/Preview';
import Report from './components/Report';
import Menu from './components/Menu';
import PageType from './PageType';
import * as actions from './actionTypes';
import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import moment from "moment";
import ReasonType from "./ReasonType";
import Logger from "./components/Logger";
import Modal from './components/Modal';
import MailingLists from './components/MailingLists';

class App extends Component {
    
    haifaMailingList = window.configs.haifaMailingList;
    haifaMailingListName = window.configs.haifaMailingListName;
    timiMailingList = window.configs.timiMailingList;
    tmiiMailingListName = window.configs.timiMailingListName;
    appUrl = window.configs.appUrl;
    BASE_URL = window.configs.baseUrl;
    IMAGES_PATH = window.configs.imagesPath;
    MAILING_LIST_CONTROLLER = window.configs.mailingListController;
   
    timezone = "Asia/Jerusalem";

    SECONDS_TO_CLOSE_MODAL = 6;
    EVENT_CREATED_MESSAGE = "Your event was created successfully";  
    
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
    
    toggleHalfDay = () => {
        this.props.tomActions.toggleHalfDayAction(!this.props.halfDay);
    };

    titleSuffixChange = (suffix) => {
        this.props.tomActions.titleSuffixChangeAction(suffix);
    };

    updateMailingLists = (mailingLists) => {
        this.props.tomActions.updateMailingListsAction(mailingLists);
        this.generateAttendeesList(mailingLists);
    }

    updateMailingListName = (mailingListName) => {
        this.props.tomActions.updateMailingListNameAction(mailingListName);
    }

    updateMailingListEmails = (mailingListEmails) => {
        this.props.tomActions.updateMailingListEmailsAction(mailingListEmails);
    }

    updateHaifaListState = (haifaListState) => {
        this.props.tomActions.updateHaifaListStateAction(haifaListState);
    }

    updateCurrentButtonClicked = (currentButtonClicked) => {
        this.props.tomActions.updateCurrentButtonClickedAction(currentButtonClicked);
    }


    updateSelectedMailingLists = (listName) => {
        let items = Object.create(this.props.mailingLists);
        let index = items.findIndex(item => item.listName === listName);
        if (index !== -1){
            items[index].selected = items[index].selected === 1 ? 0 : 1;
            this.updateUserMailingLists(listName, items[index].emails, items[index].selected);
            this.updateMailingLists(items);
        }
        //console.log(JSON.stringify(items));
        
    }

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
    
    isTokenExpired = () => {
        let tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
        if (!tokenExpirationDate){
            return true;
        }
        return moment() > tokenExpirationDate;
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
    
    logout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('tokenExpirationDate', '0');
        localStorage.setItem('name', '');
        document.cookie = "myEventsState=";
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
                localStorage.setItem("email", data.EmailAddress);
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
    
    getUserMailingLists = () => {
        const apiUrl = this.BASE_URL + this.MAILING_LIST_CONTROLLER;
        const postData = {
            "action": "GET",
            "userId": localStorage.getItem("email"),
        }
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(postData)
        }).then((res) => res.json())
            .then(
            (data) => {
                this.processResults(data);
                this.updateMailingLists(data);
            },
            (error) => {
                console.log("Could not get user mailing lists");
            }
        );
    }

    updateUserMailingLists = (listName, emails, selected) => {
        const apiUrl = this.BASE_URL + this.MAILING_LIST_CONTROLLER;
        const postData = {
            "action": "UPDATE",
            "userId": localStorage.getItem("email"),
            "listName": listName,
            "emails": emails,
            "selected": selected
        }
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(postData)
        }).then((res) => res.json())
            .then(
            (data) => {
                this.processResults(data);
                this.updateMailingLists(data);
            },
            (error) => {
                console.log("Could not update user mailing list");
            }
        );
    }

    updateEvents = (events) => {
        this.props.tomActions.updateEventsAction(events);
    };

    generateAttendeesList(lists){
        if (!lists){
            return;
        }
        let attendees = [];
        if (this.props.haifaListState == true){
            let haifaItem = {
                "EmailAddress":
                    {
                        "Address": this.haifaMailingList,
                        "Name": this.haifaMailingListName
                    }
            };
            attendees.push(haifaItem);
        }
        lists.forEach((list) =>{
            if (!list || !list.selected){
                return;
            }
            let emails = list.emails.split(";");
            if (!emails){
                return;
            }
            
            emails.forEach((email) => {
                let entry = {
                    "EmailAddress":
                        {
                            "Address": email,
                            "Name": list.listName
                        }
                }
                attendees.push(entry);
            });
        });
        return attendees;
    }

    createEvent = (startDate, endDate, subject, description) => {
        if (this.isTokenExpired()){
            this.login();
        }
        const startDateTime = moment(startDate).format("YYYY-MM-DD") + "T00:00";
        /* end date should be 1 day later at 00:00 - for allDay event */
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
            "Attendees": this.generateAttendeesList(this.props.mailingLists),
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
                this.toggleModal(true, this.EVENT_CREATED_MESSAGE)
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
    
    togglePages = (targetPage) => {
        if (targetPage === PageType.REPORT) {
            this.props.tomActions.reasonFormVisibilityAction(false);
            this.updateMessageContainerVisibility(false);
            this.selectReason(ReasonType.NONE);
            this.selectStartDate(moment());
            this.selectEndDate(moment());
        }  
        
        if (targetPage === PageType.SEND_EVENT){
            this.selectStartDate(moment());
            this.selectEndDate(moment());
            this.titleSuffixChange("");
            this.getUserMailingLists();
        }
        
        if (targetPage === PageType.MAILING_LISTS){
            this.getUserMailingLists();
        }

        if (targetPage === PageType.LOGOUT) {
            this.logout();
        }
        else{
            if (this.isTokenExpired()){
                this.login();
                return;
            }
        }
        
        this.props.tomActions.togglePageAction(targetPage);
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

    toggleModal = (isModal, message) => {
        this.props.tomActions.modalToggleAction(isModal, message);
        if (isModal) {
            this.props.tomActions.countdownAction(this.SECONDS_TO_CLOSE_MODAL);
            this.countdown();
        }
        else{
            this.props.tomActions.countdownAction(0); 
        }
    };
    
    modalCountdown = (timeLeft) => {
        this.props.tomActions.countdownAction(timeLeft);  
    };
    
    countdown = () => {
        if (this.props.modalCountdown > 0) {
            this.modalCountdown(this.props.modalCountdown - 1);
            console.log(this.props.modalCountdown);
            setTimeout(() => {
                this.countdown();
            }, 1000);
        }
        else{
            this.toggleModal(false, null);
        }
    };

    componentWillMount() {
        if (!this.isLoggedIn() && !this.processLoginAnswer()){
            this.login();
        }
        this.getUserMailingLists();
    }
    
    render() {
        return (
            <Provider store={this.props.store}>
                <div className="app-container">
                    {this.props.isModal ?
                    <Modal
                        toggleModal={this.toggleModal}
                        modalMessage={this.props.modalMessage}
                        modalCountdown={this.props.modalCountdown}
                        BASE_URL={this.BASE_URL}
                        IMAGES_PATH={this.IMAGES_PATH} />
                        : null }
                    <div className="app">
                        <div className="app-header">
                            <div>
                                <img src={this.BASE_URL + this.IMAGES_PATH + "tom_logo.png"} alt="TOM LOGO"/>
                                <img src={this.BASE_URL + this.IMAGES_PATH + "start.png"} className="logo-start" alt="Start"/>
                            </div>
                            <div className="page-title">{this.props.pageType.name}</div>
                            <div className="menu-container">
                                <Menu 
                                    pageType={this.props.pageType} 
                                    togglePages={this.togglePages}
                                />
                            </div>
                        </div>
                        {this.props.pageType === PageType.LOGIN ?
                            <div className="loading-page">
                                <img src={this.BASE_URL + this.IMAGES_PATH+ "tom_logo_sign.png"} alt="loading" />
                            </div>
                            : null }
                        {this.props.pageType === PageType.LOGOUT ?
                            <div className="logout-page">
                                Thank you for using <br />
                                <img src={this.BASE_URL + this.IMAGES_PATH + "tom_logo.png"} alt="TOM LOGO"/>
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
                            <AdvancedOptions 
                                toggleHalfDay={this.toggleHalfDay}
                                halfDay={this.props.halfDay}
                                 />
                                : null }
                            {this.props.reasonFormVisible ?
                            <Preview 
                                name={this.props.name}
                                startDate={this.props.startDate} 
                                endDate={this.props.endDate} 
                                reasonType={this.props.reasonType} 
                                description={this.props.description} 
                                halfDay={this.props.halfDay}
                                titleSuffix={this.props.titleSuffix}
                                titleSuffixChange={this.titleSuffixChange}
                                descriptionChanged={this.descriptionChanged}
                                mailingLists={this.props.mailingLists}
                                updateSelectedMailingLists={this.updateSelectedMailingLists} 
                                haifaListState={this.props.haifaListState}
                                updateHaifaListState={this.updateHaifaListState} />
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
                                loadingAnimation={this.props.loadingAnimation}
                                halfDay={this.props.halfDay} 
                                titleSuffix={this.props.titleSuffix} />
                                : null}
                        </div> 
                            : null }
                        {this.props.pageType === PageType.MAILING_LISTS ?
                        <div className="mailing-lists-page">
                            <MailingLists 
                                mailingLists={this.props.mailingLists} 
                                newMailingListName={this.props.newMailingListName}
                                newMailingListEmails={this.props.newMailingListEmails}
                                updateMailingListName={this.updateMailingListName} 
                                updateMailingListEmails={this.updateMailingListEmails}
                                updateLoadingAnimationVisibility={this.updateLoadingAnimationVisibility}
                                loadingAnimation={this.props.loadingAnimation}
                                isTokenExpired={this.isTokenExpired}
                                login={this.login} 
                                token={this.props.token} 
                                getUserMailingLists={this.getUserMailingLists}
                                currentButtonClicked={this.props.currentButtonClicked}
                                updateCurrentButtonClicked={this.updateCurrentButtonClicked}
                                BASE_URL={this.BASE_URL} />
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
                                loadingAnimation={this.props.loadingAnimation}
                                isTokenExpired={this.isTokenExpired}
                                login={this.login}
                                buttonStyle={"load-report-button"}
                            />
                            <Report events={this.props.events} token={this.props.token} updateEvents={this.updateEvents} toggleSubmit={this.toggleSubmit} /> 
                        </div>
                            : null }
                    </div>
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
        messageContainerVisible: state.messageContainerVisible,
        halfDay: state.halfDay,
        titleSuffix: state.titleSuffix,
        isModal: state.isModal,
        modalMessage: state.modalMessage,
        modalCountdown: state.modalCountdown,
        mailingLists: state.mailingLists,
        newMailingListName: state.newMailingListName,
        newMailingListEmails: state.newMailingListEmails,
        selectedMailingLists: state.selectedMailingLists,
        haifaListState: state.haifaListState,
        currentButtonClicked: state.currentButtonClicked
    };
};

const mapDispatchToProps = (dispatch) => {
    return { tomActions: bindActionCreators(actions, dispatch) }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);