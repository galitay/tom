import React from 'react';
import './../assets/css/submitButton.css';
import PageType from './../PageType';
import $ from 'jquery';
import 'jquery-ui-bundle';
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

        const subject = name + " - OOO - " + dateText + " - " + reasonText;
        console.log(subject);
        this.props.createEvent(this.props.startDate, this.props.endDate, subject, this.props.description);
    };
    
    submitClicked = () => {
        this.onclickAction();
        $("#button").addClass("onclic", 250, this.validate);
    };
    
    validate() {
        setTimeout(function() {
            $("#button").removeClass("onclic");
            $("#button").addClass("validate", 450, this.callback);
        }, 2250 );
    }
    
    callback() {
        setTimeout(function() {
            $("#button").removeClass("validate");
        }, 1250 );
    }
    
    render() {
        return (
            <div className="submit-container">
                <button id="button" className={this.props.pageType === PageType.REPORT ? "load-report-button" : null} onClick={() => this.submitClicked()} />
            </div>
        )
    }
}