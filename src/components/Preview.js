import React from 'react';
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
        return (
            <div className="preview">
                <div className="preview-title">Preview</div>
                <div>{name} - OOO - {dateText} - {reasonText}</div>
                <div className="separator"></div>
                <div>{this.props.description}</div>
            </div>  
        );
    }
}