import React from 'react';
import MailingListItems from './MailingListItems';
import './../assets/css/preview.css';
import moment from "moment";

export default class Preview extends React.Component {
    render () {
        const startDate = moment(this.props.startDate).format("DD.MM.YY"); 
        const endDate = moment(this.props.endDate).format("DD.MM.YY");
        let dateText = startDate;
        if (startDate !== endDate) {
            dateText += "-" + endDate;
        }
        const reasonText = this.props.reasonType.name;
        const name = this.props.name;
        const halfDay = this.props.halfDay ? " - Half Day" : "";
        const subjectText = name + " - OOO - " + dateText + " - " + reasonText + " " + halfDay;

        return (
            <div className="preview">
                <div className="preview-title">Preview</div>
                <div className="preview-section-container">
                    <div className="preview-section-title">TO</div>
                    <MailingListItems
                        mailingLists={this.props.mailingLists}
                        updateSelectedMailingLists={this.props.updateSelectedMailingLists} />
                </div>
                <div className="separator"></div>
                <div className="preview-section-container">
                    <div className="preview-section-title">SUBJECT</div>
                    <div className="preview-subject-value">
                        <div className="preview-fixed-text">{subjectText}</div>
                        <div>
                            <input placeholder="Additional text..." type="text" onChange={(event) =>  this.props.titleSuffixChange(event.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="separator"></div>
                <div className="preview-section-container">
                    <div className="preview-section-title">CONTENT</div>
                    <div className="preview-section-content-container"><textarea placeholder="Add content here..." value={this.props.description} onChange={(event) =>  this.props.descriptionChanged(event)} /></div>
                </div>
            </div>  
        );
    }
}