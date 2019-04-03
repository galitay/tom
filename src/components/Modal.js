import React from 'react';
import './../assets/css/modal.css';
import checkmark from "./../assets/img/checkmark.gif";

export default class Modal extends React.Component {
    
    render() {
        return (
            <div className="modal">
                <div className="modal-background"> </div>
                <div className="modal-container">
                    <div className="modal-message">{this.props.modalMessage}</div>
                    <img className="modal-checkmark" src={checkmark} alt="checkmark" />
                    <div className="modal-button" onClick={() => this.props.toggleModal(false, null)}>Thanks ({this.props.modalCountdown})</div>
                    <div className="modal-bottom"></div>
                </div>
            </div>
        )
    }
}