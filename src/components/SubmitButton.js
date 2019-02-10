import React from 'react';
import './../assets/css/submitButton.css';
import PageType from './../PageType';
import moment from "moment";

export default class SubmitButton extends React.Component {
    
    onclickAction = () => {
        const startDate = moment(this.props.startDate).format("DD.MM.YY");
        const endDate = moment(this.props.endDate).format("DD.MM.YY");
        let dateText = startDate;
        if (startDate !== endDate) {
            dateText += "-" + endDate;
        }
        const reasonText = this.props.reasonType.name;
        const name = this.props.name;
        const halfDay = this.props.halfDay ? " - Half Day" : "";
        const suffix = this.props.titleSuffix;

        const subject = name + " - OOO - " + dateText + " - " + reasonText + halfDay + " " + suffix;
        console.log(subject);
        this.props.createEvent(this.props.startDate, this.props.endDate, subject, this.props.description);
    };
    
    submitClicked = () => {
        this.props.updateLoadingAnimationVisibility(true);
        this.onclickAction();
    };
    
    render() {
        return (
            <div className="submit-container">
                <button id="button" className={(this.props.pageType === PageType.REPORT ? "load-report-button" : "") + (this.props.loadingAnimation ? " onclic" : "") } onClick={() => this.submitClicked()} />
            </div>
        )
    }
}